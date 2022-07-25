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
  // let templateCode = "def guard(e):\n    colossus = e.colossus\n    place = e.place\n    while True:\n        enemy = colossus.findNearestEnemy() or hero.findNearestEnemy()\n        if enemy and enemy.health > 0:\n            if colossus.isReady() and colossus.distanceTo(enemy) < colossus.specialRange:\n                colossus.special(enemy)\n            else:\n                colossus.attack(enemy)\n\ndef choose(place):\n    return {\n        'B': 'atlas',\n        'C': 'cronus'\n    }[place]\n\nhero.chooseColossus = choose\n\nhero.on('spawn-colossus', guard)\n\nwhile True:\n    hero.summon('munchkin', 'B')\n    hero.summon('ogre', 'C')\n"
  let templateCode = '# 三分钟内击败对手\n    \ndef buildArmy():\n    # 你的英雄可以召唤和命令盟友的军队\n    \n    buildOrder = ["soldier", "soldier"]  # "archer", "artillery", "arrow-tower"\n    type = buildOrder[len(hero.built) % len(buildOrder)]\n    if hero.gold >= hero.costOf(type):\n        hero.summon(type)\n    \ndef commandArmy():\n    friends = hero.built\n    enemies = hero.findEnemies()\n    points = hero.getControlPoints()\n    for i, friend in enumerate(friends):\n        if friend.health <= 0 or friend.type == "arrow-tower":\n            continue\n        # 命令你的军队夺取控制点\n        # 明智的选择你的控制点！\n        \n        point = points[i % len(points)]\n        if hero.time < 90:\n            hero.command(friend, "defend", point.pos)\n        else:\n            hero.command(friend, "attack", friend.findNearest(enemies))\n    \ndef controlHero():\n    enemies = hero.findEnemies()\n    nearestEnemy = hero.findNearest(enemies)\n    shouldAttack = hero.time > 90\n    # 用你的英雄技能来改变局势。\n    # if shouldAttack: ...\n    \n    \nwhile True:\n    buildArmy()\n    commandArmy()\n    controlHero()\n'
  let csst = "\ndef chooseUnits(lane):\n    if (lane is 0): return ['thrower']\n    if (lane is 1): return ['ogre', 'ogre', 'munchkin']\n    if (lane is 2): return ['warlock', 'thrower', 'thrower']\n\ndef chooseChampion(lane):\n    champs = ['knight', 'raider', 'samurai', 'sorcerer', 'ninja', 'ranger']\n    return champs[hero.championsSpawned % 6]\n\ndef chooseUpgrade(level):\n    upgrades = ['champion-defense', 'champion-attack',\n                'unit-defense', 'unit-attack']\n    return upgrades[level % 4]\n\ndef onSpawnChampion(e):\n    champion = e.champion\n    lane = e.lane\n    while True:\n        enemy = champion.findNearestEnemy()\n        # 指挥你的英雄扭转局势！ \n        \n\nhero.chooseUnits = chooseUnits\nhero.chooseChampion = chooseChampion\nhero.chooseUpgrade = chooseUpgrade\nhero.on(\"spawn-champion\", onSpawnChampion)\n\n"

  templateCode = "def guard(e):\n    colossus = e.colossus\n    place = e.place\n    while True:\n        enemy = colossus.findNearestEnemy() or hero.findNearestEnemy()\n        if enemy and enemy.health > 0:\n            if colossus.isReady() and colossus.distanceTo(enemy) < colossus.specialRange:\n                colossus.special(enemy)\n            else:\n                colossus.attack(enemy)\n\ndef choose(place):\n    return {\n        'B': 'atlas',\n        'C': 'cronus'\n    }[place]\n\nhero.chooseColossus = choose\n\nhero.on('spawn-colossus', guard)\n\nwhile True:\n    hero.summon('munchkin', 'B')\n    hero.summon('ogre', 'C')\n\n" // colossus
  let template = {code: templateCode, language: 'python' }
  let cq = fs.readFileSync('./tests/SNGG.json', {encoding: 'utf-8'})
  let sessions = JSON.parse(cq)
  let pysessions = Object.values(sessions).filter(s => s.language == 'python')
  let start = new Date()
  let st = moss.compare_sessions(pysessions, template, t)
  console.log('time flies: ', (new Date() - start)/1000 , 's')
  console.log('---group----')
  console.log(st.grouped)
  for(let k in st.grouped) {
    let v = st.grouped[k]
    console.log(v.map(id => sessions[id].name).join(','))
  }
    // console.log(pp)
    // console.log(JSON.stringify(st.hashes[pp[0]]))
    // console.log( JSON.stringify(st.hashes[pp[1]]), pp[2])
    // console.log(sessions[pp[0]].name, sessions[pp[1]].name, pp[2])
    // break
}
testCQ(0.99)
