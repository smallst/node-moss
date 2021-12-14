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
  let templateCode = "def guard(e):\n    colossus = e.colossus\n    place = e.place\n    while True:\n        enemy = colossus.findNearestEnemy() or hero.findNearestEnemy()\n        if enemy and enemy.health > 0:\n            if colossus.isReady() and colossus.distanceTo(enemy) < colossus.specialRange:\n                colossus.special(enemy)\n            else:\n                colossus.attack(enemy)\n\ndef choose(place):\n    return {\n        'B': 'atlas',\n        'C': 'cronus'\n    }[place]\n\nhero.chooseColossus = choose\n\nhero.on('spawn-colossus', guard)\n\nwhile True:\n    hero.summon('munchkin', 'B')\n    hero.summon('ogre', 'C')\n"
  let template = {code: templateCode, language: 'python' }
  let cq = fs.readFileSync('./tests/CQ2.json', {encoding: 'utf-8'})
  let sessions = JSON.parse(cq)
  let pysessions = Object.values(sessions).filter(s => s.language == 'python').sort(s => -s.totalScore)
  let start = new Date()
  let st = moss.compare_sessions(pysessions.slice(0, 1000), template, t)
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