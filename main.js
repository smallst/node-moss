const preprocessing = require('./preprocessing')
const comparation = require('./comparison')
const winnowing = require('./winnowing')
const HashtblDict = require('./dictionary')
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
    return res;
  }
 
let test = (t) => {
  let tests = fs.readdirSync('./tests')
  tests.forEach(dir => {
    let parsefiles = parse_dir('./tests/' + dir)
    let comp = comparation.compare(parsefiles)
    let files = comparation.create_sim_list(comp, parsefiles, t)
    let res = concat_result_list(files, false, t)
    console.log(JSON.stringify(res))//, JSON.stringify(comp))
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
