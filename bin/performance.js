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
	version: {key: 'v', description: 'Show version number and exit'},
});
if (options.version)
{
	console.log('Loadtest version: %s', packageJson.version);
	process.exit(0);
}

var seconds;
if (options.args)
{
	seconds = options.args[0];
}

performance.runBenchmarks(seconds);

