'use strict';
const fs = require("fs");
const readline = require("readline");
const rs = fs.ReadStream("./popu-pref.csv");
// ファイルの中身をストリームにする
const rl = readline.createInterface({"input": rs, "output": {}});
const map = new Map();
// ストリームの中でlineイベントが起きた時の処理を実装
rl.on('line',(lineString) => {
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefucture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
    // mapの中身はキーが県名、バリューが人口や変化率が入った入れ子の配列となっている
    // mapの中にすでにその県の情報が入ってないかチェック
    let value = map.get(prefucture);
    if (!value) {
      value = {
          popu10: 0,
          popu15: 0,
          change: null
      };
    }

    if (year === 2010) {
      value.popu10 += popu;      
    }
    if (year === 2015) {
      value.popu15 += popu;      
    }
    map.set(prefucture, value);
  }
});
// ストリームを流し始める
rl.resume();
rl.on('close', () => {
  for(let pair of map){
    const value = pair[1];
    value.change = value.popu15/value.popu10;
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingString = rankingArray.map(function(pair) {
    return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
  })  
  console.log(rankingString);
});
