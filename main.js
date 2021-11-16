const fs = require('fs')
const moss = require('./index')



let test = (t) => {
  let tests = fs.readdirSync('./tests')

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

test(0.4)
