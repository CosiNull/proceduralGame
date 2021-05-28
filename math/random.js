//Hashing
function hash3d(x, y, z = seed) {
  return x * 18397 + y * 20483 + z * 29303;
}
function hash2d(a, b) {
  return (b << 16) | a;
}

//Randomness
function random(seed) {
  // Robert Jenkins’ 32 bit integer hash function
  seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
  seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
  seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
  seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
  seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
  seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
  return (seed & 0xfffffff) / 0x10000000;
}

let fastRandom = {
  rand: (seed) => {
    return (Math.imul(seed, 0x5deece66d) + 11) % 0x7fffffff;
  },
  toDecimal: (num) => {
    return Math.abs(num / 0x7fffffff);
  },
};
let fastRandom2 = {
  rand: (seed) => {
    return (Math.imul(seed, 0x41c64e6d) + 12345) % 0x80000000;
  },
  toDecimal: (num) => {
    return Math.abs(num / 0x80000000);
  },
  rangeInt(min, max, num) {
    return Math.floor(fastRandom2.toDecimal(num) * (max - min) + min);
  },
};

//Random 3d
function random3d(x, y, z = seed) {
  return random(hash3d(x, y, z));
}

//functions random range
function randomRange(min, max, s = seed) {
  return random(s) * (max - min) + min;
}
function randomRangeInt(min, max, s = seed) {
  return Math.floor(randomRange(min, max, s));
}
