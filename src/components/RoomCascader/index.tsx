import React, { Component } from 'react';
import { message, Cascader } from 'antd';
import forEach from 'lodash/forEach';
import { sort } from '@/helper/commonUtils';
import { getRoomsSimple, getAllRooms } from '@s/component/roomCascader';
import './RoomCascader.less';
const isSingle = (projIds: string) => (projIds || '').split(',').length === 1;
interface propsType {
    projIds: string;
    projNames: string;
    selectedConfig: any;
    noOptionalAll?: any;
    onChange: any;
    style: any;
}
interface stateType {
    treeData: any;
}
class RoomCascader extends Component<propsType, stateType> {
    public noSubdistrict = false;
    constructor(props: propsType) {
        super(props);
        const { projIds, projNames } = this.props;

        this.state = {
            treeData: this.getProjs(projIds, projNames),
        };
    }

    componentDidMount() {
        const { treeData } = this.state;
        const { selectedConfig, projIds, projNames } = this.props;
        const isSingleProj = isSingle(projIds);
        const selectedProjId = selectedConfig.selectedProjId || (isSingleProj ? projIds : '');
        const stageOption = treeData.find((item: any) => item.value === selectedProjId);
        if (isSingleProj || (!isSingleProj && selectedProjId && stageOption)) {
            const option = isSingleProj
                ? {
                      label: projNames,
                      value: projIds,
                      type: 'proj',
                  }
                : stageOption;
            this.fetchStageTree([option], true);
        }
    }

    componentDidUpdate(prevProps: propsType) {
        const { projIds, projNames } = this.props;
        const isSingleProj = isSingle(projIds);
        if (prevProps.projIds !== projIds) {
            if (isSingleProj) {
                this.fetchStageTree([
                    {
                        label: projNames,
                        value: projIds,
                        type: 'proj',
                    },
                ]);
            } else if (projIds) {
                this.setState({
                    treeData: this.getProjs(projIds, projNames),
                });
            }
        }
    }

    render() {
        const { treeData } = this.state;
        const { selectedConfig, projIds, projNames, noOptionalAll, ...otherProps } = this.props;
        return (
            <Cascader
                {...otherProps}
                options={treeData}
                loadData={this.loadData}
                onChange={this.handleChange}
                value={this.getValue()}
            />
        );
    }

    getProjs = (projIds = '', projNames = '') => {
        const { noOptionalAll } = this.props;
        const projIdsArr = projIds.split(',');
        const projNamesArr = projNames.split(',');
        const treeData = (noOptionalAll
            ? []
            : [
                  {
                      label: '全部项目',
                      value: '',
                      isLeaf: true,
                      type: 'proj',
                  },
              ]
        ).concat(
            projIdsArr.map((item, index) => ({
                label: projNamesArr[index],
                value: item,
                isLeaf: false,
                type: 'proj',
            }))
        );
        return treeData;
    };

    getPlaceholder = () => {
        const { projIds } = this.props;
        const isSingleProj = isSingle(projIds);
        return isSingleProj ? '(分区)/楼栋/楼层/房间' : '项目/(分区)/楼栋/楼层/房间';
    };

    getValue = () => {
        const { selectedConfig, projIds } = this.props;
        const isSingleProj = isSingle(projIds);
        const { selectedProjId, subdistrictId, buildingId, floorId, roomId } = selectedConfig;
        const value = [buildingId, floorId, roomId];
        if (subdistrictId) {
            value.unshift(subdistrictId);
        }
        if (!isSingleProj) {
            value.unshift(selectedProjId);
        }
        return value;
    };

    createStageTree = (data = [], stageId = null) => {
        if (data.length === 0) {
            return [];
        }
        const stage: any = data[0];
        if (stage.id !== stageId) {
            return [];
        }
        stage.buildings = Object.values(stage.buildings);
        this.noSubdistrict = false;
        if (
            !Array.isArray(stage.subdistricts) ||
            stage.subdistricts.length === 0 ||
            stage.buildings.every((item: any) => !item.parent_id)
        ) {
            this.noSubdistrict = true;
            return this.getBuildings(stage);
        }
        return this.getSubdistricts(stage);
    };

    getSubdistricts = (stage: any) => {
        const { subdistricts } = stage;
        const { noOptionalAll } = this.props;
        const buildings = this.getBuildings(stage);
        if (buildings.length === 0) {
            return [];
        }
        const unsubdistrictBuildings = buildings.filter((item: any) => !item.parent_id && item.value);
        const hasUnsubdistrict = unsubdistrictBuildings.length > 0;
        const options = [];
        if (!noOptionalAll) {
            options.push({
                label: '全部分区',
                isLeaf: true,
                value: '',
                type: 'subdistrict',
            });
        }
        forEach(subdistricts, subdistrict => {
            const filterBuildings = buildings.filter((item: any) => subdistrict.id === item.parent_id);
            const hasBuildingChildren = filterBuildings.length > 0;
            if (!hasBuildingChildren) {
                return;
            }
            const { name, id } = subdistrict;
            const optionsSubdistrict: any = {
                label: name,
                value: id,
                isLeaf: false,
                type: 'subdistrict',
            };
            const initArr = noOptionalAll
                ? []
                : [
                      {
                          label: '全部楼栋',
                          isLeaf: true,
                          value: '',
                          type: 'building',
                      },
                  ];
            optionsSubdistrict.children = initArr.concat(filterBuildings);
            options.push(optionsSubdistrict);
        });
        if (hasUnsubdistrict) {
            options.push({
                label: '其它(未分区)',
                value: '未分区',
                isLeaf: false,
                children: unsubdistrictBuildings,
                type: 'subdistrict',
            });
        }
        return options;
    };

    getBuildings = (stage: any) => {
        const { noOptionalAll } = this.props;
        const options: any = [];
        if (!Array.isArray(stage.buildings) || stage.buildings.length === 0) {
            return options;
        }
        const { buildings = [] } = stage;
        if (!noOptionalAll) {
            options.push({
                label: '全部楼栋',
                isLeaf: true,
                value: '',
                type: 'building',
            });
        }
        forEach(buildings, building => {
            const { name, id, floors } = building;
            const isBuildingLeaf = !Array.isArray(floors) || floors.length === 0;
            const optionsBuilding: any = {
                label: name,
                value: id,
                parent_id: building.parent_id,
                isLeaf: isBuildingLeaf,
                type: 'building',
            };
            let buildingRoomNum = 0;

            if (isBuildingLeaf) {
                return;
            }
            sort(floors);
            optionsBuilding.children = noOptionalAll
                ? []
                : [
                      {
                          label: '全部楼层',
                          isLeaf: true,
                          value: '',
                          type: 'floor',
                      },
                  ];
            forEach(floors, floor => {
                const { name, id } = floor;
                const roomNum = Number(floor.room_num);
                const isFloorLeaf = !(roomNum > 0);
                const optionsFloor = {
                    label: name,
                    value: id,
                    isLeaf: isFloorLeaf,
                    type: 'floor',
                };
                buildingRoomNum += roomNum;
                if (roomNum > 0) {
                    optionsBuilding.children.push(optionsFloor);
                }
            });
            if (buildingRoomNum > 0) {
                options.push(optionsBuilding);
            }
        });
        return options;
    };

    loadData = (selectedOptions: any) => {
        const len = selectedOptions.length;
        const last = selectedOptions[len - 1];
        if (last.type === 'proj') {
            this.fetchStageTree(selectedOptions);
        } else if (last.type === 'floor') {
            this.getRoomData(selectedOptions);
        }
    };

    fetchStageTree = async (selectedOptions: any, isIntoAgain?: any) => {
        const { selectedConfig, projIds } = this.props;
        const isSingleProj = isSingle(projIds);
        const params: any = {};
        const targetOption = selectedOptions[0];
        const projId = targetOption.value;
        if (projId) {
            params.stage_id = projId;
        }
        targetOption.loading = true;
        if (!projId) {
            return;
        }
        const json = await getAllRooms(params);
        targetOption.loading = false;
        //获取所有的楼栋和楼层信息
        if (!json.result) {
            message.error(json.msg || '获取楼栋和楼层信息失败');
            return;
        }
        const { data = {} } = json;
        const { stages = [] } = data;
        const stage = this.createStageTree(stages, projId);
        let { treeData } = this.state;
        if (isSingleProj) {
            treeData = stage;
        } else {
            treeData.forEach((item: any) => {
                if (item.value === projId) {
                    if (stage.length > 0) {
                        item.children = stage;
                    } else {
                        item.isLeaf = true;
                    }
                }
            });
        }
        this.setState({
            treeData: [...treeData],
        });
        if (isIntoAgain === true && this.noSubdistrict) {
            let activeBuilding;
            let activeFloor;
            forEach(stage, item => {
                if (item.value === selectedConfig.buildingId) {
                    activeBuilding = item;
                    forEach(item.children || [], child => {
                        if (child.value === selectedConfig.floorId) {
                            activeFloor = child;
                        }
                    });
                }
            });
            if (activeBuilding && activeFloor && selectedConfig.buildingId && selectedConfig.floorId) {
                this.getRoomData([targetOption, activeBuilding, activeFloor]);
            }
        } else if (isIntoAgain === true) {
            let activeSubdistrict;
            let activeBuilding;
            let activeFloor;
            forEach(stage, item => {
                if (item.value === selectedConfig.subdistrictId) {
                    activeSubdistrict = item;
                    forEach(activeSubdistrict.children || [], building => {
                        if (building.value === selectedConfig.buildingId) {
                            activeBuilding = building;
                            forEach(activeBuilding.children || [], floor => {
                                if (floor.value === selectedConfig.floorId) {
                                    activeFloor = floor;
                                }
                            });
                        }
                    });
                }
            });
            if (
                activeSubdistrict &&
                activeBuilding &&
                activeFloor &&
                selectedConfig.subdistrictId &&
                selectedConfig.buildingId &&
                selectedConfig.floorId
            ) {
                this.getRoomData([targetOption, activeSubdistrict, activeBuilding, activeFloor]);
            }
        }
    };

    getRoomData = async (selectedOptions: any) => {
        const { noOptionalAll, projIds } = this.props;
        const { treeData } = this.state;
        const isSingleProj = isSingle(projIds);
        const len = selectedOptions.length;
        const stageOption = selectedOptions[0];
        const stageId = isSingleProj ? projIds : stageOption.value;
        const targetOption = selectedOptions[len - 1];
        targetOption.loading = true;
        if (!stageId) {
            return;
        }
        const json = await getRoomsSimple({
            stage_id: stageId,
            building_id: selectedOptions[len - 2].value,
            floor_name: selectedOptions[len - 1].label,
        });
        targetOption.loading = false;
        if (!json.result) {
            message.error(json.msg || '获取房间信息失败');
            return;
        }
        const { data = {} } = json;
        const { items = [] } = data;
        if (items.length === 0) {
            return;
        }
        targetOption.children = noOptionalAll
            ? []
            : [
                  {
                      label: '全部房间',
                      value: '',
                      type: 'room',
                  },
              ];
        items.forEach((room: any) => {
            targetOption.children.push({
                label: `${room.room_no}${room.unit_name ? `(${room.unit_name})` : ''}`,
                value: room.id,
                type: 'room',
            });
        });
        this.setState({
            treeData: [...treeData],
        });
    };

    isChange = (config: any) => {
        const { projIds, selectedConfig } = this.props;
        const isSingleProj = isSingle(projIds);
        return (
            selectedConfig.subdistrictId !== config.subdistrictId ||
            selectedConfig.buildingId !== config.buildingId ||
            selectedConfig.floorId !== config.floorId ||
            selectedConfig.roomId !== config.roomId ||
            (!isSingleProj && config.stageId !== selectedConfig.selectedProjId)
        );
    };

    handleChange = (selectedOptionsIds: any, selectedOptions: any) => {
        const { onChange } = this.props;
        const selectedConfig = {
            stageId: '',
            stageName: '',
            subdistrictId: '',
            subdistrictName: '',
            buildingId: '',
            buildingName: '',
            floorId: '',
            floorName: '',
            roomId: '',
            roomName: '',
        };
        selectedOptions.forEach((item: any) => {
            if (item.type === 'proj') {
                selectedConfig.stageId = item.value;
                selectedConfig.stageName = item.label;
            } else if (item.type === 'subdistrict') {
                selectedConfig.subdistrictId = item.value;
                selectedConfig.subdistrictName = item.label;
            } else if (item.type === 'building') {
                selectedConfig.buildingId = item.value;
                selectedConfig.buildingName = item.label;
            } else if (item.type === 'floor') {
                selectedConfig.floorId = item.value;
                selectedConfig.floorName = (item.label || '').replace('全部楼层', '');
            } else if (item.type === 'room') {
                selectedConfig.roomId = item.value;
                selectedConfig.roomName = item.label;
            }
        });

        if (this.isChange(selectedConfig)) {
            onChange && onChange(selectedConfig);
        }
    };
}

export default RoomCascader;
