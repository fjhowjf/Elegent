const checkphone = phone => phone.length == 11;
const checkcode = code => code.length == 6;

module.exports = {
    checkphone,
    checkcode,
}