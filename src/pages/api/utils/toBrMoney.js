export default function toBrMoney(num) {
    // Check if the input is a number and attempt to convert if it is not
    if (isNaN(num)) {
        throw new TypeError('The provided value is not a number');
    }
    // Convert the input to a number (in case it is a string)
    num = Number(num);

    // Convert the number to a string with two decimal places
    let str = num.toFixed(2);

    // Replace the decimal point with a comma
    str = str.replace('.', ',');

    // Add dots every three digits before the comma
    str = str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Add the real symbol at the beginning
    return 'R$ ' + str;
}