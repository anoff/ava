'use strict';

var indentString = require('indent-string');
var chalk = require('chalk');
var diff = require('diff');
var highlight = require('./highlight');

function cleanUp(line) {
	if (line[0] === '+') {
		return chalk.green('+ ') + line.slice(1);
	}

	if (line[0] === '-') {
		return chalk.red('- ') + line.slice(1);
	}

	if (line.match(/@@/)) {
		return null;
	}

	if (line.match(/\\ No newline/)) {
		return null;
	}

	return ' ' + line;
}

module.exports = function (err) {
	if ((err.actualType === 'object' || err.actualType === 'array') && err.actualType === err.expectedType) {
		var patch = diff.createPatch('string', err.actual, err.expected);
		var msg = highlight(patch
			.split('\n')
			.splice(4)
			.map(cleanUp)
			.filter(Boolean)
			.join('\n'), err.actualType);

		return 'Difference:\n\n' + msg;
	}

	if (err.actualType === 'string' && err.expectedType === 'string') {
		var patch = diff.diffChars(err.actual, err.expected);
		var msg = patch.map(function (part) {
			if (part.added) {
				return chalk.black.bgGreen(part.value);
			}

			if (part.removed) {
				return chalk.black.bgRed(part.value);
			}

			return part.value;
		})
		.join('');

		return 'Difference:\n\n' + msg + '\n';
	}

	return [
		'Actual:\n',
		indentString(highlight(err.actual, err.actualType), 2) + '\n',
		'Expected:\n',
		indentString(highlight(err.expected, err.expectedType), 2) + '\n'
	].join('\n');
};
