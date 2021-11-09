let intersection = (l1, l2) => {
  let common = []
  for(let v in l1){
    if(!l2.every(l => l.v != v.v)) {
      common.push(v)
    }
  }
  return common
}

let make_pair_comp = (k0, file_list) => {

}

let compare = (d) => {
  
}

let cmp_tuple = ([k1,s1], [k2, s2]) => {
  
}

let create_sim_list = (comp_dict, t) => {
  
}

let create_pair_sim_list = (f_name, f_dict_list) => {
  
}