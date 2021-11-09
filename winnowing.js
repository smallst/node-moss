const max_int = 4611686018427387903;

/* w: window size
   h: hashes list */
module.exports.winnow = function (w, h) {

  let findMin = (win) => {
    let min = {v:win[0], p: 0};
    for (let [i, wi] of win.entries()) {
      if(wi <= min.v) {
        min.v = wi;
        min.p = i;
      }
    }
    // console.log('win, min', win, min)
    return min;
  }
  let window = Array(w).fill(max_int)

  let min = {v: max_int, p: 0}
  let acc = []

  for(let [index, hi] of h.entries()) {
    window = window.concat([hi]).slice(1)
    if(hi <= min.v) {
      min.v = hi;
      min.p = w-1;
      acc.push({v: hi, p: index})
    }
    else {
      min.p = min.p - 1;
      if(min.p < 0) {
        min = findMin(window);
        acc.push({v: min.v, p: (index - w + 1 + min.p)})
      }
    }
    // console.log('min: ', min)
  }
  return acc;
}