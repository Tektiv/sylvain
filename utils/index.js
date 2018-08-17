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
