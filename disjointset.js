module.exports = class DisjointSet {
  constructor(n) {
    this.fa = [0];
    this.rank = [0];
    this.nameMap = {};
    this.names = [];
    for(let i = 1; i <= n; i++) {
      this.fa.push(i);
      this.rank.push(1)
    }

    this.find = this.find.bind(this)
    this.getNameid = this.getNameid.bind(this)
    this.merge = this.merge.bind(this)
    this.print = this.print.bind(this)
  }
  getNameid (name){
    if(!(name in this.nameMap)) {
      this.names.push(name)
      this.nameMap[name] = this.names.length
    }
    return this.nameMap[name]
  }
  find (name){
    let x = name
    if(typeof name === 'string')
      x = this.getNameid(name)
    if(x == this.fa[x])
      return x
    else {
      this.fa[x] = this.find(this.fa[x]);
      return this.fa[x];
    }
  }
  merge (namei, namej) {
    let i = namei, j = namej
    if(typeof i == 'string')
      i = this.getNameid(i)
    if(typeof j == 'string')
      j = this.getNameid(j)
    let x = this.find(i), y = this.find(j)
    if(this.rank[x] <= this.rank[y])
      this.fa[x] = y;
    else
      this.fa[y] = x;
    if(this.rank[x] == this.rank[y] && x != y)
      this.rank[y] ++;
  }

  print (){
    let results = {};
    for(let i = 1; i <= this.names.length; i++) {
      let x = this.find(i)
      if(!(x in results)) {
        results[x] = []
      }
      results[x].push(this.names[i-1])
    }

    return results
  }
}