"use strict";
const fs = require("fs");
const readline = require("readline");
const rs = fs.createReadStream("./popu-pref.csv");
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on("line", lineString => {
	const colmuns = lineString.split(",");
	const year = parseInt(colmuns[0]);
	const prefecture = colmuns[1];
	const popu = parseInt(colmuns[3]);
	let value = prefectureDataMap.get(prefecture);
	if (!value) {
		value = {
			popu10: 0,
			popu15: 0,
			change: null
		};
	}
	if (year === 2010) {
		value.popu10 = popu;
	} else if (year === 2015) {
		value.popu15 = popu;
	}
	prefectureDataMap.set(prefecture, value);
});

rl.on("close", () => {
	for (let [key, val] of prefectureDataMap) {
		val.change = val.popu15 / val.popu10;
	}
	const ranking = Array.from(prefectureDataMap).sort(
		(p1, p2) => p2[1].change - p1[1].change
	);
	const rankingStr = ranking.map(
		([key, val]) =>
			key +
			" : " +
			val.popu10 +
			" -> " +
			val.popu15 +
			" : 変化率 " +
			val.change * 100 +
			"%"
	);
	console.log(rankingStr);
});
