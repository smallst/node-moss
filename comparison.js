let intersection = (l1, l2) => l1.filter(l => l2.some(v => v[0] == l[0]))

let make_pair_comp = (k0, file_list) => {
  let fileDict = {}
  let p = file_list.find(f => f[0] == k0)
  for(let j = 0;j < file_list.length; j++) {
    fileDict[file_list[j][0]] = intersection(p[1], file_list[j][1]);
  }
  return fileDict;
}

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

let compareV2 = (file_hashes) => {
  let hash_index = {}
  for(let f in file_hashes) {
    let hashes = file_hashes[f];
    hashes.forEach((h) => {
      if(!(h[0] in hash_index)) {
        hash_index[h[0]] =  []
      }
      hash_index[h[0]].push([f, h[1]])
    })
  }

  let compDict = {}
  Object.entries(file_hashes).forEach((fl) => {
    let fileDict = {}
    Object.keys(file_hashes).forEach((key, index) => {
      fileDict[key] = []
    })
    let hashes = fl[1]

    hashes.forEach((h) => {
      hash_index[h[0]].forEach(([mf, _]) => {
        if(!(mf in compDict && fl[0] in compDict[mf])){
          fileDict[mf].push(h)
        }
      })
    })
    compDict[fl[0]] = fileDict;
  })
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
        // console.log('debug::k, v, k1, v1:::',k, v.length, k1, v1.length )
        if(k != k1 && file_length > 0) {
            let s = v1.length / file_length
            if (s >=t) {
              os = [os[0]+s, os[1]+1]
              // console.log("::::",s, v1.length, file_length, os)
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
  let f_length = f_dict_list.find(l => l[0] == f_name)[1].length
  let res = []
  for(let i = 0; i< f_dict_list.length; i++) {
    let k = f_dict_list[i][0]
    let v = f_dict_list[i][1]
    if(k == f_name) {
      continue;
    }
    else if(f_length == 0) {
      res.unshift([k, 0])
    }else {
      res.unshift([k, v.length/f_length])
    }
  }
  return res;
}

module.exports = {
  intersection,
  compare,
  compareV2,
  create_sim_list,
  create_pair_sim_list,
  make_pair_comp
}
