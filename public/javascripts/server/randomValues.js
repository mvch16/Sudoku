function* random (min,max) {
  while (true) {
    yield Math.floor(Math.random() * (max - min + 1)) + min;
  }
}


module.exports = {random}