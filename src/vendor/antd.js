/*
 * ant design custom variables
 * @see https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
 */

module.exports = {
    // -------- Colors -----------
    '@primary-color': '#248BF2', // 全局主色
    '@success-color': '#14B825', // 成功色
    '@processing-color': '@primary-color', // 不知道什么色，查词典说是处理、重定向
    '@error-color': '#F73E4D', // 错误色
    '@highlight-color': '@error-color', // 强调色
    '@warning-color': '#F2A305', // 警告色

    // Color used by default to control hover and active backgrounds and for
    // alert info backgrounds.
    '@primary-1': '#EDF6FF', // 1号蓝
    '@primary-2': '#BDDDFC', // 2号蓝
    '@primary-3': '#96C8FA', // 3号蓝
    '@primary-4': '#6FB3F7', // 4号蓝
    '@primary-5': '#499FF5', // 5号蓝
    '@primary-6': '@primary-color', // 6号蓝，引用时不要用这个，用上面的@primary-color
    '@primary-7': '#176DC2', // 7号蓝
    '@primary-8': '#0D4F91', // 8号蓝，暂未使用
    '@primary-9': '#063361', // 9号蓝，暂未使用

    // Base Scaffolding Variables
    // ---
    '@text-color': '#636566', // 主文本色
    '@text-color-secondary': '#949799', // 副文本
    '@icon-color-hover': '#4A4B4D', // 灰色图标hover色
    '@heading-color': '#313233', // 标题色

    '@font-size-xl': '18px', // 加大字号
    '@font-size-xxl': ' 20px', // 加加大字号

    '@border-radius-base': '4px', // 默认圆角
    '@border-radius-sm': '2px', // 新增小号圆角

    // Border color
    '@border-color-base': '#D6D7D8', // 边框灰，用于组件外描边，按钮、控件等
    '@border-color-split': '#EDEFF0', // 分割灰，用于分割线等

    // Outline
    '@background-color-light': '#FAFBFC', // 更亮的灰色背景
    '@background-color-base': '#F5F6F7', // 默认的灰色背景，用于表头等

    // Disabled states
    '@disabled-color': '#C6C9CC', // 失效灰，用于按钮、控件等失效状态

    // Shadow
    '@shadow-color': 'rgba(0, 0, 0, 0.15)',
    '@box-shadow-base': '@shadow-2',
    '@shadow-1-up':
        '0 -6px 16px -8px rgba(49, 50, 51, 0.08), 0 -9px 28px 0 rgba(49, 50, 51, 0.05), 0 -12px 48px 16px rgba(49, 50, 51, 0.03)',
    '@shadow-1-down':
        '0 6px 16px -8px rgba(49, 50, 51, 0.08), 0 9px 28px 0 rgba(49, 50, 51, 0.05), 0 12px 48px 16px rgba(49, 50, 51, 0.03)',
    '@shadow-1-left':
        '-6px 0 16px -8px rgba(49, 50, 51, 0.08), -9px 0 28px 0 rgba(49, 50, 51, 0.05), -12px 0 48px 16px rgba(49, 50, 51, 0.03)',
    '@shadow-1-right':
        '6px 0 16px -8px rgba(49, 50, 51, 0.08), 9px 0 28px 0 rgba(49, 50, 51, 0.05), 12px 0 48px 16px rgba(49, 50, 51, 0.03)',
    '@shadow-2':
        '0 3px 6px -4px rgba(49, 50, 51, 0.12), 0 6px 16px 0 rgba(49, 50, 51, 0.08), 0 9px 28px 8px rgba(49, 50, 51, 0.05)',

    // Button// Buttons
    '@btn-border-radius-sm': '@border-radius-sm', // 按钮小号圆角，用于小号按钮
    '@btn-shadow': '0 2px 0 rgba(49, 50, 51, 0.015)', // 次按钮投影
    '@btn-primary-shadow': '0 2px 0 rgba(49, 50, 51, 0.045)', // 主按钮投影
    '@btn-text-shadow': '0 -1px 0 rgba(49, 50, 51, 0.12)', // 文字按钮投影

    // // Radio
    // @radio-dot-disabled-color: @disabled-color; // 单选按钮圆点色

    // // Radio buttons
    // @radio-disabled-button-checked-bg: @border-color-split; // 单选按钮已选失效背景色

    // // Layout
    // @layout-body-background: @background-color-base; // 页面灰色背景
    // @layout-header-background: #0D2640; // 顶部导航背景
    // @layout-header-height: 56px; // 顶部导航高度
    // @layout-trigger-background: @layout-header-background; // 收起区域背景

    // Form
    // ---
    '@label-color': '@text-color', // 表单组件标签色
    // '@form-item-margin-bottom': '16px', // 表单组件内下边距
    '@form-vertical-label-padding': '0 0 4px', // 表单组件垂直标签外边距

    // Modal
    // --
    '@modal-footer-padding-vertical': '8px', // 对话框底部垂直内边距
    '@modal-footer-padding-horizontal': '24px', // 对话框底部水平内边距
    '@modal-mask-bg': 'fade(#04080D, 80%)', // 对话框蒙层背景色
    '@modal-confirm-body-padding': '32px 24px 24px 32px', // 确认对话框内边距

    // Input
    // ---
    '@input-placeholder-color': ' @disabled-color', // 输入框占位符颜色
    '@input-number-handler-active-bg': '@background-color-base', // 数字输入框步进器按下颜色
    '@input-addon-bg': '@background-color-base', // 输入框前置/后置标签背景色
    '@input-icon-hover-color': '@heading-color', // 输入框按钮hover色

    // Layout
    '@layout-body-background': '#F5F6F7',
    '@layout-header-background': '#fff',
    '@layout-header-height': '56px',
    '@layout-sider-background': '#0D2640',
    '@layout-header-padding': '12px 16px',
    '@layout-footer-padding': '8px 50px',

    // Menu
    '@menu-dark-bg': '#0D2640',
    '@menu-item-vertical-margin': '0px', // 导航菜单条目垂直外边距
    '@menu-item-boundary-margin': '0px', // ？？？
    // dark theme
    '@menu-dark-color': 'fade(#fff, 70%)', // 暗主题导航菜单文字/图标颜色
    '@menu-dark-arrow-color': '#fff', // 暗主题导航菜单箭头颜色
    '@menu-dark-submenu-bg': '#0D141A', // 暗主题导航菜单子菜单背景色
    // Card
    '@card-head-font-size': '16px',
    '@card-radius': '4px',
    '@card-padding-base': '0',
    // Table
    '@table-padding-vertical-sm': '8px',
    '@table-padding-horizontal-sm': '16px',

    '@item-hover-bg': '@primary-1', // hover色，用于hover对象的背景色

    // Table
    // --
    '@table-header-bg': '@background-color-base', // 表头背景色
    '@table-header-color': '@text-color', // 表头文字色
    '@table-header-sort-bg': '@border-color-split', // 表头排序背景色
    '@table-body-sort-bg': '@background-color-base', // 表格列排序背景色
    '@table-row-hover-bg': '@primary-1', // 表格行hover色
    '@table-selected-row-bg': '@item-hover-bg', // 表格选中行背景色
    '@table-expanded-row-bg': '@background-color-light', // 表格展开背景色
    '@table-padding-vertical': '8px', // 表格垂直内边距
    '@table-padding-horizontal': '16px', // 表格水平内边距
    // Sorter
    // Legacy: `table-header-sort-active-bg` is used for hover not real active
    '@table-header-sort-active-bg': 'darken(@table-header-bg, 3%)', // 表头排序选中色
    // Filter
    '@table-header-filter-active-bg': 'darken(@table-header-sort-active-bg, 5%)', // 表头筛选选中色
    '@table-filter-btns-bg': 'inherit', // 表头筛选按钮背景色

    // Tabs
    '@tabs-horizontal-margin': '0',
    '@tabs-horizontal-padding': '0 16px 10px 16px',
};
