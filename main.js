const fs = require('fs')
const moss = require('./index')



let test = (t) => {
  let tests = fs.readdirSync('./tests')
  tests.forEach(dir => {
    let st = moss.compare_dir('./tests/'+dir, t)
    console.log(`${dir}:: ---------------`)
    console.log(st.pairs)
  })
}

test(0.4)
