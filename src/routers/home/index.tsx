import React, { Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Spin } from 'antd';
import { connect } from 'dva';
import './index.less';
import { LoadingOutlined } from '@ant-design/icons';
// import Demo from 'ykj-ui/es/components/demo';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface Props {
    history: any;
    readonly count: number;
    dispatch: Function;
    list: string[];
    loading: any;
}

// class App extends React.PureComponent<Props> {
//     public componentDidMount() {
//         console.log(this.props);
//     }
//     public render() {
//         const {
//             count,
//             loading: { effects = {} },
//         } = this.props;
//         console.log(effects['count/addAfter1Second'], 'effects');
//         return (
//             <div className="home_container">
//                 <Spin spinning={effects['count/addAfter1Second'] === true ? true : false}>
//                     <h1>{count}</h1>
//                     <Button
//                         onClick={() => {
//                             const data = count + 1;
//                             this.props.dispatch({
//                                 type: 'count/add',
//                                 data,
//                             });
//                         }}
//                         type="primary"
//                     >
//                         增加数量
//                     </Button>
//                     <br />
//                     <br />
//                     <Button
//                         onClick={() => {
//                             const data = count - 1;
//                             this.props.dispatch({
//                                 type: 'count/del',
//                                 data,
//                             });
//                         }}
//                         type="primary"
//                     >
//                         减少数量
//                     </Button>
//                     <br />
//                     <br />
//                     <h1>dva-loading:{effects['count/addAfter1Second'] ? 'loading...' : '请求成功'}</h1>
//                     <Button
//                         onClick={() => {
//                             this.props.dispatch({
//                                 type: 'count/addAfter1Second',
//                             });
//                         }}
//                     >
//                         发送请求-测试dva-loading
//                     </Button>
//                     <br />
//                     <br />
//                     <div>
//                         <Button
//                             onClick={() => {
//                                 this.props.history.replace('/init');
//                             }}
//                         >
//                             返回
//                         </Button>
//                     </div>
//                 </Spin>
//             </div>
//         );
//     }
// }

function App(props: Props) {
    // console.log(props, 'props');
    const [value, setValue] = useState(1);
    const [value2, setValue2] = useState(1);
    const [value3, setValue3] = useState(1);
    const [value4, setValue4] = useState(1);
    const [value5, setValue5] = useState(1);
    const [isFirstChange, setChange] = useState(false);
    useEffect(() => {
        console.log('第一次执行', isFirstChange);
    }, []);
    useEffect(() => {
        if (isFirstChange) {
        }
    }, [value]);

    const callback = useCallback(() => {
        console.log('setValue 改变');
    }, [setValue]);

    const memo = useMemo(() => {}, [value]);

    // <Child memo={memo} />;
    //子组件用到了value setValue, 此时我们setValue2导致了这个组件重新渲染，无论你的子组件做了什么判断，PureComponent,React.memo
    useEffect(() => {
        console.log('useEffect');
    }, []);

    useEffect(() => {
        console.log('value改变了');
    }, [value]);

    useEffect(() => {
        console.log('value2改变了');
    }, [value2]);

    const onclick = () => {
        console.log('click');
        setValue(value + 1);
        setValue2(value2 + 1);
    };

    return (
        <div>
            <h1>hooks:{value}</h1>
            <Button onClick={onclick}>测试</Button>
        </div>
    );
}
//PureComponent
export default React.memo(
    connect((state: any) => {
        return {
            count: state.count.count,
            loading: state.loading,
        };
    })(App)
);
