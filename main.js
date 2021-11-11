const preprocessing = require('./preprocessing')
const comparation = require('./comparison')
const winnowing = require('./winnowing')
const fs = require('fs')


let parse_dir = (d) => {
  let file_dict = {}
  let filenames = fs.readdirSync(d);
  filenames.forEach(file => {
    let full_path = d +'/' + file
    let hashes = preprocessing.hash_file(full_path)
    let winnowed_hashes = winnowing.winnow(40, hashes)
    file_dict[file] = winnowed_hashes
  });
  return file_dict;
}
let strcmp = (a, b) =>  (a<b ? -1:(a>b?1:0))
let cmp_tuple = ([k1,s1], [k2, s2]) => {
  if(s1 == s2) return k1-k2
  return strcmp(s2, s1)
}
let concat_result_list = (lst, is_pair, t) => {
    let lt = lst.sort(cmp_tuple).filter((k,s) => s >= t);
    let res = [];
    for(let i = 0; i < lt.length;i ++) {
      res.push(lt[i][0], lt[i][1])
    }
  return res
  }
 
let handle_pair = (r, st) => {
  let disp = Object.entries(r).reduce((d, [f,v]) => {
    return d + comparation.create_pair_sim_list(f, Object.entries(r[f])).reduce((s, [f2, ss]) => {
      if(ss < st.threshold && f != f2) {
        return s + ''
      }
      else {
        return s + `${f}, ${f2}\n`
      }
    }, '')
  }, '')
  return disp
}
let test = (t) => {
  let tests = fs.readdirSync('./tests')
  tests.forEach(dir => {
    let parsefiles = parse_dir('./tests/' + dir)
    let comp = comparation.compare(parsefiles)
    let files = comparation.create_sim_list(comp, parsefiles, t)
    let res = concat_result_list(files, false, t)
    let st = {
      results: comp,
      files: res,
      threshold: t,
    }
    let dp = handle_pair(st.results, st)
    console.log(`${dir}:: ---------------`)
    console.log(dp)
  })
  /*
  let concat_result_list = (lst, is_pair) => {
    let lt = lst.sort(cmp_tuple).filter((k,s) => s >= t);
    let res = [];
    for(let i = 0; i < lt.length;i ++) {
      res.append(lt[i][0], lt[i][1])
    }
    return res;
  }
  let files = concat_result_list(Compartion.create_sim_list(comparation, parsefiles, t), false)
 */ 
}

test(0.4)
