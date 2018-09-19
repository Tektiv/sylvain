const RandomOrg = require('random-org');
const config = require('../.config');

const randomOrg = new RandomOrg({ apiKey: config.randomApiKey });

/**
  * Returns a formatted string to display an array
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Array} array - Array to format
  * @param {String} delimiter - Delimiter to add between every elements
  *   default : ', '
  * @param {String} last - Delimiter before the last element
  *   default : ' and '
  * @param {String} before - String to add before the result
  *   default : ''
  * @param {String} after - String to add after the result
  *   default : ''
  * @param {String} empty - String to display if the array is empty
  *   default : ''
  * @returns {String} result - Returns the formatted string
  *
  * @example
  * this.arrayFormat(['Apples', 'Bananas', 'Strawberries']);
  * > Apples, Bananas and Strawberries
  */
exports.arrayFormat = (array, delimiter = ', ', last = ' and ', before = '', after = '', empty = '') => {
  let result = '';
  if (array.length === 0) return empty;
  if (array.length === 1) {
    [result] = array;
  } else if (array.length === 2) {
    result = array.join(`${last}`);
  } else {
    result = `${array.slice(0, -1).join(delimiter)}${last}${array.slice(-1)}`;
  }
  return before + result + after;
};

/**
  * Makes a random using ranom.org api or basic Math.random()
  * whether there is an api key or not
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Number} min
  * @param {Number} max
  * @param {Number} n - Number of randoms to make
  * @param {Boolean} useAPI - Force the use of the API or not
  *   default : true
  * @returns {Array} data - Array with all the random
  */
exports.random = async (min, max, n, useAPI = true) => {
  let data = [];

  if (useAPI && config.randomApiKey !== '') {
    await new Promise((resolve) => {
      randomOrg.generateIntegers({ min, max, n })
        .then((response) => {
          ({ data } = response.random);
          resolve();
        });
    });
  } else {
    for (let i = 0; i < n; i += 1) {
      data.push(Math.floor((Math.random() * ((max - min) + 1)) + min));
    }
  }

  return data;
};

/**
  * Returns a string with its first letter in upper case
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} str
  * @returns {String} result - String with its first letter in upper case
  */
exports.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
  * Inserts a substring inside a string at a specific index
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} str
  * @param {Number} start - Index of the insertion
  * @param {Number} del - Number of letters to remove before inserting / acts like a replace
  * @param {String} sub - Substring to insert
  * @returns {String} result - String with the substring inserted
  */
exports.splice = (str, start, del, sub) =>
  str.slice(0, start) + sub + str.slice(start + Math.abs(del));

/**
  * Returns whether a key is in object or not
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {Object} object
  * @param {String} key
  * @returns {Boolean} bool - returns true if the object has the key, else it returns false
  */
exports.objectIncludes = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
