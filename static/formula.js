var calcResult = 0
var F = {}


function randInt(min, max) {
  return (min + Math.round((max - min) * Math.random()))
}
function paddingZero(n, len) {
  return (Array(len).join('0') + n).slice(-len)
}

var G = { i: 0, lotteryName: '', data: [], FNS: [] }

// 取号码
G.C = (i, d) => {
  let index = G.i - i
  return index < 0 ? 0 : G.data[index][d]
}
G.杀对了吗 = {
  kl8: (i, r) => {
    r = G.取杀号[G.lotteryName](r)
    for (let j = 2; j <= 21; j++) {
      if (G.data[i][j] == r) return 0
    }
    return 1
  },
  '3d': (i, r) => {
    r = G.取杀号[G.lotteryName](r)
    for (let j = 2; j <= 4; j++) {
      if (G.data[i][j] == r) return 0
    }
    return 1
  }
}
G.取杀号 = {
  kl8: (r) => paddingZero(Math.abs(r) % 80 + 1, 2),
  '3d': (r) => Math.abs(r) % 10
}

G.随机生成一个公式 = (len, hasNum) => {
  let op = ['+', '-', '*']
  len = len ? len + 2 : randInt(3, 20)
  let name_len = G.FNS.length
  let res = ''
  for (let i = 0; i < len; i++) {
    let temp = G.FNS[randInt(3, name_len - 1)]
    res += hasNum && randInt(1, 5) === 1 ? randInt(1, 999999).toString() : temp
    if (i < len - 1) {
      res += ' ' + op[randInt(0, 2)] + ' '
    }
  }
  return res
}

G.init = (data, lotteryName) => {
  G.data = data
  G.lotteryName = lotteryName
  G.FNS = Object.keys(F[lotteryName])
}
G.运行公式 = (formula) => {
  let arr = formula.split(' ')
  for (let i = 0; i < arr.length; i++) {
    arr[i] = F[G.lotteryName][arr[i]] ? F[G.lotteryName][arr[i]] : arr[i]
  }
  eval(`calcResult = ${arr.join('')};`)
  return calcResult
}

var lotteryName = 'kl8'

F[lotteryName] = {}
for (let i = 1; i <= 9; i++) {
  F[lotteryName][`上${i}期和值`] = `G.C(${i},24)`
  F[lotteryName][`上${i}期跨度`] = `G.C(${i},25)`
  F[lotteryName][`上${i}期期号`] = `parseInt(G.C(${i},0))`
  for (let j = 1; j <= 20; j++) {
    F[lotteryName][`上${i}期第${j}球`] = `parseInt(G.C(${i},${j}+1))`
  }
}

lotteryName = '3d'
F[lotteryName] = {}
for (let i = 1; i <= 9; i++) {
  F[lotteryName][`上${i}期和值`] = `G.C(${i},10)`
  F[lotteryName][`上${i}期跨度`] = `G.C(${i},11)`
  F[lotteryName][`上${i}期期号`] = `parseInt(G.C(${i},0))`

  F[lotteryName][`上${i}期开奖号`] = `parseInt(G.C(${i},2)+G.C(${i},3)+G.C(${i},4))`
  F[lotteryName][`上${i}期百位`] = `parseInt(G.C(${i},2))`
  F[lotteryName][`上${i}期十位`] = `parseInt(G.C(${i},3))`
  F[lotteryName][`上${i}期个位`] = `parseInt(G.C(${i},4))`

  F[lotteryName][`上${i}期试机号`] = `parseInt(G.C(${i},5)+G.C(${i},6)+G.C(${i},7))`
  F[lotteryName][`上${i}期试机号和值`] = `G.C(${i},12)`
  F[lotteryName][`上${i}期试机号跨度`] = `G.C(${i},13)`
  F[lotteryName][`上${i}期试机号百位`] = `parseInt(G.C(${i},5))`
  F[lotteryName][`上${i}期试机号十位`] = `parseInt(G.C(${i},6))`
  F[lotteryName][`上${i}期试机号个位`] = `parseInt(G.C(${i},7))`
}

export { G }