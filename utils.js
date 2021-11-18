const preprocessing = require('./preprocessing')
const winnowing = require('./winnowing')
const comparation = require('./comparison')

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

let parse_sessions = (ss) => {
  let file_dict = {}
  ss.forEach(s => {
    let  hashes = preprocessing.hash_coco_session(s)
    let winnowed_hashes = winnowing.winnow(40, hashes)
    file_dict[s.creator] = winnowed_hashes
  })
  return file_dict
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
 
let handle_pair = (r, t) => {
  let disp = Object.entries(r).reduce((d, [f,v]) => {
    return d.concat(comparation.create_pair_sim_list(f, Object.entries(r[f])).reduce((s, [f2, ss]) => {
      if(ss < t && f != f2) {
        return s
      }
      else {
        return s.concat([[f, f2 , ss]])
      }
    }, []))
  }, [])
  return disp
}

module.exports = {
  handle_pair,
  concat_result_list,
  parse_sessions,
  parse_dir
}