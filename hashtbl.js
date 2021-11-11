let ROTL32 = (a, b)  => {
 return ((a) << b | (a) >> (32-b))
}
module.exports.hashCode = function(s) {
  var h = 0, i, chr, d;
  if (s.length === 0) return h;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    d = ((d << 5) - d) + chr;
    d |= 0;
    // hash |= 0; // Convert to 32bit integer
  }

  d *= 0xcc9e2d51;
  d = ROTL32(d, 15); 
  d *= 0x1b873593; 
  h ^= d; 
  h = ROTL32(h, 13); 
  h = h * 5 + 0xe6546b64;

  return h|0;
};