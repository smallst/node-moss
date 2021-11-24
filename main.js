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

  let template = {code: "count = 0;\n\ndef choose(collector):\n    global count\n    count += 1\n    return ['fire', 'water', 'earth'][count % 3]\n\ndef collectHandler(data):\n    unit = data.target\n    while True:\n        if unit.item:\n            unit.bring()\n        else:\n            fruit = unit.findNearestFruit()\n            if fruit:\n                unit.pick(fruit)\n\nhero.on('spawn-runner', collectHandler)\n\nhero.spawnCollector()\nhero.spawnCollector()\n\nwhile True:\n    if hero.fire > 3:\n        hero.cast('fire-arrow')\n    elif hero.water >= 4 and len(hero.findMyCollectors()):\n        hero.transform(hero.findMyCollectors()[0], 'runner')\n    elif hero.earth > 3:\n        hero.cast('earth-arrow')\n", language: 'python' }

  let cq = fs.readFileSync('./tests/CQ.json', {encoding: 'utf-8'})
  let sessions = JSON.parse(cq)
  let pysessions = Object.values(sessions).filter(s => s.language == 'python').sort(s => -s.wins/(s.wins+s.losses))
  let start = new Date()
  let st = moss.compare_sessions(pysessions.slice(0, 300), template, t)
  console.log('time flies: ', (new Date() - start)/1000 , 's')
  console.log('---pair----')
  // console.log(st.pairs)
  for(let p in st.pairs) {
    let pp = st.pairs[p]
    // console.log(pp)
    // console.log(JSON.stringify(st.hashes[pp[0]]))
    // console.log( JSON.stringify(st.hashes[pp[1]]), pp[2])
    console.log(sessions[pp[0]].name, sessions[pp[1]].name, pp[2])
    // break
  }
}

testCQ(0.95)
