const Tool = {
    pickColor (callback) {
        const picker = document.appendElement('input');
        picker.type = 'color';
        picker.on('input', () => {
            callback(picker.value);
        });
        picker.setStyle({
            // opacity: 0.8,
            position: 'absolute',
            // left: 0,
            // top: 0
        });
        setTimeout(() => {
            picker.emit('click');
        }, 100);
        return picker;//() => picker.remove();
    },
};

({ Tool }).globalize();

// setTimeout(() => {
//     window.picker = Tool.pickColor(color => {
//         // console.log(color);
//         document.documentElement.cssVar('background', color);
//         document.documentElement.cssVar('default-color', color.properFrontColor());
//
//     });
// });
