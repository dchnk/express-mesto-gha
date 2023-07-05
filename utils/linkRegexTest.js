/* eslint-disable no-useless-escape */
const RegExp = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const linkRegexTest = (link) => {
  RegExp.test(link);
};

module.exports = { linkRegexTest, RegExp };
