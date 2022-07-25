const utils = require('./utils')
const preprocessing = require('./preprocessing')
const comparation = require('./comparison')
const DisjointSet = require('./disjointset')

let compare_dir = (dir, t) => {
  let parsefiles = utils.parse_dir(dir)
  let comp = comparation.compare(parsefiles)
  let files = comparation.create_sim_list(comp, parsefiles, t)
  let res = utils.concat_result_list(files, false, t)
  let dp = utils.handle_pair(comp, t)
  return {
    results: comp,
    files: res,
    threshold: t,
    pairs: dp
  }
}
let compare_dir_v2 = (dir, t) => {
  let parsefiles = utils.parse_dir(dir)
  let comp = comparation.compareV2(parsefiles)
  let files = comparation.create_sim_list(comp, parsefiles, t)
  let res = utils.concat_result_list(files, false, t)
  let dp = utils.handle_pair(comp, t)
  return {
    results: comp,
    files: res,
    threshold: t,
    pairs: dp
  }
}
let compare_sessions = (sessions, template, t) => {
  let template_hash = utils.parse_template(template)
  let parsefiles = utils.parse_sessions(sessions, template_hash)
  let comp = comparation.compare(parsefiles)
  let files = comparation.create_sim_list(comp, parsefiles, t)
  let res = utils.concat_result_list(files, false, t)
  let dp = utils.handle_pair(comp, t)

  let uniqNames = new Set()
  dp.forEach(p => uniqNames.add(p[0]))
  let disjoint = new DisjointSet(uniqNames.size)
  for(let p in dp) {
    let pp = dp[p]
    disjoint.merge(pp[0], pp[1])
  }
  let groupedResults = disjoint.print()

  return {
    hashes: parsefiles,
    results: comp,
    files: res,
    threshold: t,
    pairs: dp,
    grouped: groupedResults
  }
}


module.exports = {
  compare_dir,
  compare_dir_v2,
  compare_sessions
}
