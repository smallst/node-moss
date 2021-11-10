const max_int = 4611686018427387903;

/* w: window size
   h: hashes list */
module.exports.winnow = function (w, h) {

  let mincheck = (win) => {
    let min = [win[0],  0];
    for (let [i, wi] of win.entries()) {
      if(wi <= min[0]) {
        min[0] = wi;
        min[1] = i;
      }
    }
    // console.log('win, min', win, min)
    return min;
  }
  let window = Array(w).fill(max_int)

  let min = [ max_int,  0]
  let acc = []

  for(let [index, hi] of h.entries()) {
    window = window.concat([hi]).slice(1)
    if(hi <= min[0]) {
      min[0] = hi;
      min[1] = w-1;
      acc.push([ hi,  index])
    }
    else {
      min[1] = min[1] - 1;
      if(min[1] < 0) {
        min = mincheck(window);
        acc.push([min[0], (index - w + 1 + min[1])])
      }
    }
    // console.log('min: ', min)
  }
  return acc;
}