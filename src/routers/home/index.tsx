import React, { Fragment } from 'react';
import { Button, Spin } from 'antd';
import { connect } from 'dva';
import './index.less';
interface Props {
    history: any;
    readonly count: number;
    dispatch: Function;
    list: string[];
    loading: any;
}
class App extends React.PureComponent<Props> {
    public componentDidMount() {
        console.log(this.props);
    }
    public render() {
        const {
            count,
            loading: { effects = {} },
        } = this.props;
        console.log(effects['count/addAfter1Second'], 'effects');
        return (
            <div className="home_container">
                <Spin spinning={effects['count/addAfter1Second'] === true ? true : false}>
                    <Button
                        onClick={() => {
                            const data = count + 1;
                            this.props.dispatch({
                                type: 'count/add',
                                data,
                            });
                        }}
                        type="primary"
                    >
                        增加数量
                    </Button>
                    <br />
                    <br />
                    <Button
                        onClick={() => {
                            const data = count - 1;
                            this.props.dispatch({
                                type: 'count/del',
                                data,
                            });
                        }}
                        type="primary"
                    >
                        减少数量
                    </Button>
                    <br />
                    <br />
                    <h1>dva-loading:{effects['count/addAfter1Second'] ? 'loading...' : '请求成功'}</h1>
                    <Button
                        onClick={() => {
                            this.props.dispatch({
                                type: 'count/addAfter1Second',
                            });
                        }}
                    >
                        发送请求-测试dva-loading
                    </Button>
                    <br />
                    <br />
                    <div>
                        <Button
                            onClick={() => {
                                this.props.history.replace('/init');
                            }}
                        >
                            返回
                        </Button>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default connect((state: any) => {
    return {
        count: state.count.count,
        loading: state.loading,
    };
})(App);
