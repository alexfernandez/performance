'use strict';

/**
 * Performance measurements.
 * (C) 2014-2015 Alex Fernández.
 */

// requires
var performance = require('./lib/performance.js');


exports.runBenchmarks = performance.runBenchmarks;

// run if invoked directly
if (__filename == process.argv[1])
{
	exports.runBenchmarks();
}

