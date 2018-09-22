// All the utils needed have to be in the array
const utils = [
  './global',
  './discord',
  './dnd',
  './system',
];

// For every util, we export every of its function as our own
// So that we can easily access as `Utils.<function>` and not as `Utils.<module>.<function>`
utils.forEach((util) => {
  // eslint-disable-next-line
  const library = require(util);
  Object.keys(library).forEach((functionName) => {
    exports[functionName] = library[functionName];
  });
});


// All the classes needed have to be in the array
const modelFiles = [
  'game',
  'stat',
  'character',
];

// We export every class as our own
// So that we can easily access as `Utils.<class>` and not as `Utils.Class.<module>.<class>`
modelFiles.forEach((modelFile) => {
  // eslint-disable-next-line
  const file = require(`./classes/${modelFile}`);
  Object.keys(file).forEach((model) => {
    exports[model] = file[model];
  });
});
