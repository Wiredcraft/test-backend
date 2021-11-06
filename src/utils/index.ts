const randomChar = () => {
    const abc = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    return abc[Math.floor((Math.random() * abc.length))];
};

export function randomUsername (length = 10) {
    let s = '';
    while (s.length < length) {
        s += randomChar();
    }
    return s;
};
