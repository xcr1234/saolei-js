import $ from 'jquery'

/**
 * 禁用右键菜单
 */
export const disableRightMouse = () => {
    document.oncontextmenu = function () {
        return false;
    };

}

/**
 * 闪烁控件
 * @param el 元素
 */
export const fade = (el) => {
    $(el).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
        .fadeOut(100).fadeIn(100)
}
