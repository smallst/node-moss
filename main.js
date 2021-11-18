const fs = require('fs')
const moss = require('./index')



let test = (t) => {
  let tests = fs.readdirSync('./tests').filter((d) => fs.statSync('./tests/'+d).isDirectory() )

  let start = new Date()
  tests.forEach(dir => {
    let st = moss.compare_dir('./tests/'+dir, t)
    // console.log(`${dir}:: ---------------`)
    // console.log(st.pairs)
  })
  console.log('time flies: ', (new Date() - start)/1000 , 's')
  start = new Date()
 tests.forEach(dir => {
    let st = moss.compare_dir_v2('./tests/'+dir, t)
    // console.log(`${dir}:: ---------------`)
    // console.log(st.pairs)
  })
  console.log('time flies: ', (new Date() - start)/1000 , 's')
}

let testCQ = (t) => {

  let cq = fs.readFileSync('./tests/CQ.json', {encoding: 'utf-8'})
  let sessions = JSON.parse(cq)
  let start = new Date()
  let st = moss.compare_sessions(Object.values(sessions).slice(0, 300), t)
  console.log('time flies: ', (new Date() - start)/1000 , 's')
  console.log('---pair----')
  // console.log(st.pairs)
  for(let p in st.pairs) {
    let pp = st.pairs[p]
    // console.log(pp)
    console.log(JSON.stringify(st.hashes[pp[0]]))
    console.log( JSON.stringify(st.hashes[pp[1]]), pp[2])
    // console.log(p[0], p[1], p[2])
    break
  }
}

testCQ(0.95)
