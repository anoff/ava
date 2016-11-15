'use strict';
var cleanYamlObject = require('clean-yaml-object');
var ErrorStackParser = require('error-stack-parser');
var prettyFormat = require('pretty-format');
var reactElementPlugin = require('pretty-format/plugins/ReactElement');
var reactTestPlugin = require('pretty-format/plugins/ReactTestComponent');
var renderer = require('react-test-renderer');
var beautifyStack = require('./beautify-stack');

function isReactElement(obj) {
	return obj.type && obj.ref !== undefined && obj.props;
}

function filter(propertyName, isRoot, source, target) {
	if (!isRoot) {
		return true;
	}

	if (propertyName === 'stack') {
		target.stack = beautifyStack(source.stack);
		return false;
	}

	if (propertyName === 'actual' || propertyName === 'expected') {
		var value = source[propertyName];
		target[propertyName + 'Type'] = typeof value;

		if (isReactElement(value)) {
			value = renderer.create(value).toJSON();
		}

		target[propertyName] = prettyFormat(value, {
			plugins: [reactTestPlugin, reactElementPlugin]
		});

		return false;
	}

	return true;
}

module.exports = function (error) {
	var err = cleanYamlObject(error, filter);

	var source = ErrorStackParser.parse(error)[1];
	err.source = {
		file: source.fileName,
		line: source.lineNumber
	};

	return err;
};
