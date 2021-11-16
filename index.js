const utils = require('./utils')
const comparation = require('./comparison')

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
let compare_sessions = (sessions, t) => {
  let parsefiles = utils.parse_sessions(sessions)
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

module.exports = {
  compare_dir,
  compare_dir_v2,
  compare_sessions
}
