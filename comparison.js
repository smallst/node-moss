const {HashtblDict} = require('./dictionary')
/*
let intersection_old = (l1, l2) => {
  let common = []
  for(let v in l1){
    if(!l2.every(l => l.v != v.v)) {
      common.push(v)
    }
  }
  return common
}
*/

let intersection = (l1, l2) => l1.filter(l => l2.some(v => v[0] == l[0]))
/*
let make_pair_comp = (k0, file_list) => {
  file_list.reduce((x, [k,v]) => {
    FileDict.insert(k, intersection(file_list.find(f=>f.k == k0), v), x)
  }, FileDict.empty)
}

let compare_old = (d) => {
  let file_list = d.to_list()
  file_list.reduce((x, [k,v]) => {
    CompDict.insert(k, (make_pair_comp (k, file_list)), x)
  }, CompDict.empty)
}
*/

let compare = (d) => {
  let file_list = Object.entries(d)
  let compDict = {}
  for(let i= 0; i < file_list.length; i++) {
    let fileDict = {}
    for(let j = 0;j < file_list.length; j++) {
      fileDict[file_list[j][0]] = intersection(file_list[i][1], file_list[j][1]);
    }
    compDict[file_list[i][0]] = fileDict;
  }
  return compDict
}
let strcmp = (a, b) =>  (a<b ? -1:(a>b?1:0))
let cmp_tuple = ([k1,s1], [k2, s2]) => {
  if(s1 == s2) return k1-k2
  return strcmp(s2, s1)
}

let create_sim_list = (comp_dict, file_hashes_dict, t) => {
  let comp_list = Object.entries(comp_dict);
  let comp_res = []
  for(let i = 0; i< comp_list.length; i++) {
    let k = comp_list[i][0]
    let d = comp_list[i][1] // dict of intersection
    let v = file_hashes_dict[k] // hashes
    let os = [0, 0]
    if(v) {
      let file_length = v.length
      let file_ss = Object.entries(d)
      for(let j = 0; j < file_ss.length; j ++) {
          let k1 = file_ss[j][0]
          let v1 = file_ss[j][1]
        if(k != k1 && file_length > 0) {
            let s = v1.length / file_length
            if (s >=t) {
              os = [os[0]+s, os[1]+1]
            }
        }
      }
    }
    let sim_score = 0
    if(os[1] != 0) {
      sim_score = os[0]/os[1]
      if(sim_score >= t) {
        comp_res.push([k, sim_score])
      }
    }
  }
  return comp_res.sort(cmp_tuple)
}

let create_pair_sim_list = (f_name, f_dict_list) => {
  if(f_dict_list.length == 0) {
    return []
  }
  let f_length = f_dict_list.find(l => l[0] == f_name).length
  f_dict_list.reduce((lst, [k, v]) => {
    if(k == f_name) {
      return lst
    }
    else if(f_length == 0) {
      lst.unshift([k, 0])
      return lst
    }
    else {
      return [[k, v.length/f_length]].concat(lst)
    }
  }, [])
}