export default function toBrMoney(num) {
    if (isNaN(num)) {
        throw new TypeError('The provided value is not a number');
    }
    num = Number(num);

    let str = num.toFixed(2);

    str = str.replace('.', ',');

    str = str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + str;
}