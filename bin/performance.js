#!/usr/bin/env node
'use strict';

/**
 * Binary to check performance.
 * (C) 2014 Alex Fernández.
 */

// requires
var stdio = require('stdio');
var performance = require('../lib/performance.js');
var packageJson = require(__dirname + '/../package.json');

// init
var options = stdio.getopt({
	file: {key: 'f', args: 1, description: 'Output results to a file'},
	json: {key: 'j', description: 'Show benchmark results in JSON format'},
	seconds: {key: 's', args: 1, description: 'Number of seconds to run'},
	version: {key: 'v', description: 'Show version number and exit'},
});
if (options.version)
{
	console.log('Loadtest version: %s', packageJson.version);
	process.exit(0);
}

performance.runBenchmarks(options);
