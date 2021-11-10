const preprocessing = require('./preprocessing')
const winnowing = require('./winnowing')
const HashtblDict = require('./dictionary')

let FileDict = HashtblDict()
let main = () => {
  let fileHashesDict = {}
  let parse_dir = () => {
  let f_name = 'test.c'
  let full_path = './test.c';
  let hashes = preprocessing.hash_file(full_path)
  let winnowed_hashes = winnowing.winnow(40, hashes)
  // FileDict.insert(f_name, winnowed_hashes)
    fileHashesDict[f_name] = winnowed_hashes;
  }

  let parsefiles = parse_dir(dir)
  let comp = Compartion.compare(parsefiles)
  let concat_result_list = (lst, is_pair) => {
    let lt = lst.sort(cmp_tuple).filter((k,s) => s >= t);
    let res = [];
    for(let i = 0; i < lt.length;i ++) {
      res.append(lt[i][0], lt[i][1])
    }
    return res;
  }
  let files = concat_result_list(Compartion.create_sim_list(comparation, parsefiles, t), false)


  
}