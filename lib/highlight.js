'use strict';

var chalk = require('chalk');

var objectTypes = [
	'Object',
	'Array',
	'ArrayBuffer',
	'DataView',
	'Float32Array',
	'Float64Array',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Uint8Array',
	'Uint8ClampedArray',
	'Uint16Array',
	'Uint32Array',
	'arguments',
	'Map',
	'Set',
	'WeakMap',
	'WeakSet'
];

function highlightObjectType(str) {
	objectTypes.forEach(function (type) {
		if (str.indexOf(type) >= 0) {
			str = str.replace(type, chalk.blue(type));
		}
	});

	return str;
}

function highlightArrayBrackets(str) {
	return str
		.replace(/ \[/, chalk.grey(' ['))
		.replace(/ ]/, chalk.grey(' ]'));
}

function highlightObjectBraces(str) {
	return str
		.replace(/\{/, chalk.grey('{'))
		.replace(/\}/, chalk.grey('}'));
}

function highlightObjectKeys(str) {
	return str.replace(/"(.+)":/, function ($1, $2) {
		return chalk.white($2 + ':');
	});
}

function highlightNumbers(str) {
	return str.replace(/([0-9]+),/, function ($1, $2) {
		return chalk.yellow($2) + ',';
	});
}

function highlightBooleans(str) {
	return str.replace(/(true|false)/, function ($1) {
		return chalk.yellow($1);
	});
}

function highlightStrings(str) {
	return str.replace(/"(.+)"(,)?/, function ($1, $2, $3) {
		return chalk.green('"' + $2 + '"') + ($3 || '');
	});
}

function highlightCommas(str) {
	return str.replace(/,$/, chalk.grey(','));
}

function highlight(obj) {
	return obj
		.split('\n')
		.map(highlightObjectType)
		.map(highlightArrayBrackets)
		.map(highlightObjectBraces)
		.map(highlightObjectKeys)
		.map(highlightNumbers)
		.map(highlightStrings)
		.map(highlightCommas)
		.map(highlightBooleans)
		.join('\n');
}

module.exports = function (obj, type) {
	if (type === 'boolean') {
		return highlightBooleans(obj);
	}

	if (type === 'number') {
		return highlightNumbers(obj);
	}

	if (type === 'string') {
		return highlightStrings(obj);
	}

	if (type === 'object' || type === 'array') {
		return highlight(obj);
	}

	return obj;
};
