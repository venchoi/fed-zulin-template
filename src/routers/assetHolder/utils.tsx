import React, { useEffect, useImperativeHandle } from 'react';
import throttle from 'lodash/throttle';

const calcBodyHeight = WrappedComponent => {
    const Table = ({ forwardedRef, scroll, ...restProps }) => {
        const internalRefs = React.useRef();
        const [usedY, setUsedY] = React.useState(typeof scroll?.y === 'number' ? scroll.y : undefined);

        // 计算 Table 组件表格最大高度
        const calcTableMaxHeight = React.useCallback(
            throttle(() => {
                try {
                    const antdTable = internalRefs.current.parentNode;
                    const thead = antdTable ? antdTable.querySelectorAll('thead')[0] : null;
                    const pagination = antdTable ? antdTable.querySelectorAll('.ant-pagination')[0] : null;
                    const doms = [];

                    console.log('antdTable', antdTable);

                    if (thead) {
                        doms.push(thead);
                    }

                    if (pagination) {
                        doms.push(pagination);
                    }

                    setUsedY(
                        antdTable.offsetHeight -
                            doms.reduce((prev, dom) => {
                                if (dom == null) {
                                    return prev;
                                }
                                const target = dom;
                                const cpStyle = window.getComputedStyle(target);
                                const height =
                                    target.offsetHeight +
                                    (window.parseFloat(cpStyle.getPropertyValue('margin-top')) || 0) +
                                    (window.parseFloat(cpStyle.getPropertyValue('margin-bottom')) || 0);
                                return prev + height;
                            }, 0)
                    );
                } catch (err) {
                    console.error(err);
                }
            }, 100),
            []
        );

        useImperativeHandle(forwardedRef, () => ({
            calcTableMaxHeight,
        }));

        useEffect(() => {
            window.addEventListener('resize', calcTableMaxHeight);
            return () => {
                window.removeEventListener('resize', calcTableMaxHeight);
            };
        }, []);

        useEffect(() => {
            if (scroll) {
                if (scroll.y === true) {
                    calcTableMaxHeight();
                    return;
                }
                setUsedY(scroll.y);
            }
            calcTableMaxHeight();
        }, [scroll, restProps]);

        return (
            <div ref={internalRefs} style={{ height: '100%' }}>
                <WrappedComponent ref={forwardedRef} scroll={{ ...scroll, y: usedY }} {...restProps} />
            </div>
        );
    };

    return React.forwardRef((props, ref) => <Table {...props} forwardedRef={ref} />);
};

export default calcBodyHeight;
