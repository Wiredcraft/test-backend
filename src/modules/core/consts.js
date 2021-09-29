'use strict';

let Enums = {};
let Options = {};
let OptionMaps = {};
let ValMaps = {};
let ValKeyMaps = {};
let ValNameMaps = {};
import configs from  './consts.conf';

function flat(data) {
	let key = 'id';
	let dist = {};
	for (let i = 0, item; i < data.length; i++) {
		item = data[i];
		dist[item[key]] = item.value;
	}
	return dist;
}

function flatKey(data) {
	let key = 'id';
	let dist = {};
	for (let i = 0, item; i < data.length; i++) {
		item = data[i];
		dist[item[key]] = item;
	}
	return dist;
}

function flatVKey(data) {
	let key = 'value';
	let dist = {};
	for (let i = 0, item; i < data.length; i++) {
		item = data[i];
		dist[item[key]] = item;
	}
	return dist;
}

function keyValMap(data) {
	let key = 'id';
	let map = {};
	for (let i = 0, item; i < data.length; i++) {
		item = data[i];
		map[item[key]] = item.value;
	}
	return map;
}

function valKeyMap(data) {
	let key = 'id';
	let map = {};
	for (let i = 0, item; i < data.length; i++) {
		item = data[i];
		map[item.value] = item[key];
	}
	return map;
}

function valNameMap(data) {
	let key = 'id';
	let map = {};
	for (let i = 0, item; i < data.length; i++) {
		item = data[i];
		map[item.value] = item.name;
	}
	return map;
}

function add(name, item) {
	let key = 'id';
	Enums[name] = flat(item);
	Options[name + "Option"] = item;
	OptionMaps[name + "Map"] = flatKey(item);
	ValMaps[name + "VMap"] = flatVKey(item);
	ValKeyMaps[name + "VKMap"] = valKeyMap(item, key);
	ValNameMaps[name + "VNMap"] = valNameMap(item, key);
}


for (let k in configs) {
	add(k, configs[k]);
}

export {
	Enums,
	Options,
	OptionMaps,
	ValMaps,
	ValKeyMaps,
	ValNameMaps
};