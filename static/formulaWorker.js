var q1Index = 0
var q2Index = 0
var calcResult = 0
var F = {}


function randInt(min, max) {
  return (min + Math.round((max - min) * Math.random()))
}

var G = { i: 0, lotteryName: '', data: [], FNS: [] }
G.取号码 = (i, d) => {
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
  }
}
G.取杀号 = {
  kl8: (r) => paddingZero(Math.abs(r) % 80 + 1, 2)
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

/* 快乐8的公式 */
G.快乐8_取和值 = (i) => {
  return G.取号码(i, 24)
}
G.快乐8_取跨度 = (i) => {
  return G.取号码(i, 25)
}
G.快乐8_取期号 = (i) => {
  return parseInt(G.取号码(i, 0))
}
G.快乐8_取号码 = (i, j) => {
  return parseInt(G.取号码(i, j + 1))
}


var lotteryName = 'kl8'
F[lotteryName] = {}
for (let i = 1; i <= 9; i++) {
  F[lotteryName][`上${i}期和值`] = `G.快乐8_取和值(${i})`
  F[lotteryName][`上${i}期跨度`] = `G.快乐8_取跨度(${i})`
  F[lotteryName][`上${i}期期号`] = `G.快乐8_取期号(${i})`
  for (let j = 1; j <= 20; j++) {
    F[lotteryName][`上${i}期第${j}球`] = `G.快乐8_取号码(${i},${j})`
  }
}

function paddingZero(n, len) {
  return (Array(len).join('0') + n).slice(-len)
}
const evalFormula = (formula, lotteryName) => {
  let arr = formula.split(' ')
  for (let i = 0; i < arr.length; i++) {
    arr[i] = F[lotteryName][arr[i]] ? F[lotteryName][arr[i]] : arr[i]
  }
  eval(`calcResult = ${arr.join('')};`)
  return calcResult
}

onmessage = function (e) {
  // console.log('Worker onmessage e =', e.data.action)
  if (e.data.action === 'init') {
    q1Index = e.data.q1Index
    q2Index = e.data.q2Index
    G.data = e.data.data
    G.lotteryName = e.data.lotteryName
    G.FNS = Object.keys(F[G.lotteryName])
    postMessage(JSON.stringify({ action: 'inited'}))
  } else if (e.data.action === 'calc') {
    // console.log('e.data.formula', e.data.formula)
    let dui = 0
    for (let i = q1Index; i <= q2Index; i++) {
      G.i = i
      dui += G.杀对了吗[G.lotteryName](i, evalFormula(e.data.formula, G.lotteryName))
    }
    // console.log('Worker calc dui', dui)
    postMessage(JSON.stringify({action: 'calc', dui: dui }))
  }
}