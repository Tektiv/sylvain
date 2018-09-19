const fs = require('fs');
const readline = require('readline');

// readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
  * Starts an input to the console
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} question - Question to display before the input
  * @returns {String} answer - Returns the answer given by the user
  */
exports.ask = async question => new Promise((resolve) => {
  rl.question(`\n${question}\n> `, answer => resolve(answer.trim()));
});

/**
  * Checks if a file exists
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} filePath - Path of the file to check
  * @returns {Boolean} exists - Returns whether the file exists or not
  */
exports.fileExists = async filePath => new Promise((resolve) => {
  fs.stat(filePath, (err) => {
    if (err !== null) resolve(false);
    resolve(true);
  });
});

/**
  * Creates a directory
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} filePath - Path of the directory to create
  * @returns {Boolean} created - Returns whether the folder has been created or not
  */
exports.mkdir = async filePath => new Promise((resolve) => {
  fs.mkdir(filePath, (err) => {
    if (err !== null) resolve(false);
    resolve(true);
  });
});

/**
  * Reads a file
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} filePath - Path of the file to read
  * @param {Boolean} toJSON - Set to true if you want to parse the result to a JSON object
  * @returns {String|Object} content - Returns the content of the file
  */
exports.readFile = async (filePath, toJSON = false) => new Promise((resolve) => {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err !== null) resolve(false);
    resolve(toJSON ? JSON.parse(content) : content);
  });
});

/**
  * Writes in a file, replaces what is already written in it
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} filePath - Path of the file to write in
  * @param {String} content - Content to write
  * @returns {Boolean} result - Returns whether the file has been created/modified or not
  */
exports.writeFile = async (filePath, content) => new Promise((resolve) => {
  fs.writeFile(filePath, content, (err) => {
    if (err !== null) resolve(false);
    resolve(true);
  });
});

/**
  * Edit a .json file using a function given in parameters
  *
  * @since 0.1.0
  * @author Tektiv
  * @param {String} filePath - Path of the .json file to edit
  * @param {Function} editJSON - Function to edit the json
  *   The function needs to take the json as a parameter, and returns it
  * @param {Function} editString - Function to edit how the JSON string is formatted
  * @returns {Boolean} result - Returns whether the file has been modified or not
  */
exports.editJSONFile = async (filePath, editJSON, editString = false) => {
  if (!filePath.endsWith('.json')) {
    console.log('ERROR - file is not .json');
    return false;
  }

  let content = await this.readFile(filePath, true);
  if (content === false) {
    console.log(`ERROR - could not read file ${filePath}`);
    return false;
  }

  content = await editJSON(content);

  if (editString) {
    let stringified = JSON.stringify(content, null, 2);
    stringified = editString(stringified);
    return this.writeFile(filePath, stringified);
  }
  return this.writeFile(filePath, JSON.stringify(content, null, 2));
};
