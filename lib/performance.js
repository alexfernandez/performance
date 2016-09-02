'use strict';

/**
 * Performance measurements.
 * (C) 2014-2015 Alex Fernández.
 */

// requires
require('prototypes');
var Console = require('console').Console;
var createWriteStream = require('fs').createWriteStream;
var crypto = require('crypto');
var util = require('util');
var Log = require('log');

// constants
var TIME = 1000;
var ITERATIONS = 1000;
var ARRAY_SIZE = 10000;

// globals
var log = new Log('info');
var token = 'mpQFJMt/dfnp5L8HtTAcAxYw+wSIlg==';
var original = {
	a: 'a',
	b: 'b',
};
var spanMs;

var console = global.console;


/**
 * Run all performance benchmarks.
 */
exports.runBenchmarks = function(options)
{
	options = options || {};
	spanMs = 1000 * options.seconds || TIME;
	if (options.file) console = new Console(createWriteStream(options.file));
	if (!options.json) log.info('Running benchmarks for %s ms', spanMs);
	var longArray = [];
	var object = {};
	for (var i = 0; i < ARRAY_SIZE; i++)
	{
		longArray.push(i);
		object[i] = i;
	}
	var benchmark = new BenchmarkRunner(options);
	benchmark.run('nil', function()
	{
	});
	benchmark.run('util._extend()', function()
	{
		return util._extend(original);
	});
	benchmark.run('Object.keys()', function()
	{
		return Object.keys(object);
	});
	benchmark.run('sha1-token', function()
	{
		var value = '' + Date.now() + Math.random();
		var hash = crypto.createHash('sha1');
		return hash.update(value).digest("hex").toLowerCase();
	});
	benchmark.run('sha256-token', function()
	{
		var value = '' + Date.now() + Math.random();
		var hash = crypto.createHash('sha256');
		return hash.update(value).digest("hex").toLowerCase();
	});
	benchmark.run('replaceAll()', function()
	{
		return token.replaceAll('=', '').replaceAll('/', '').replaceAll('+', '').toLowerCase();
	});
	benchmark.run('match().join()', function()
	{
		return token.match(/\w+/g).join('').toLowerCase();
	});
	benchmark.run('for().toLowerCase()', function()
	{
		var result = '';
		for (var i = 0; i < 25; i++)
		{
			var c = token[i];
			if (c != '+' && c != '/' && c != '=')
			{
				result += c.toLowerCase();
			}
		}
		return result;
	});
	benchmark.run('for().charCodeAt()', function()
	{
		var result = '';
		for (var i = 0; i < 25; i++)
		{
			var c = token.charCodeAt(i);
			if (c > 96)
			{
				result += String.fromCharCode(c);
			}
			else if (c > 64)
			{
				result += String.fromCharCode(c + 32);
			}
		}
		return result;
	});
	benchmark.run('timestamp', function()
	{
		return Date.now() + "_" + Math.random().toString().substring(2);
	});
	benchmark.run('array-access', function()
	{
		for (var index in longArray)
		{
			if (longArray[index] == '6')
			{
				return longArray[index];
			}
		}
		return null;
	});
	benchmark.run('object-access', function()
	{
		for (var key in object)
		{
			if (object[key] == '6')
			{
				return object[key];
			}
		}
		return null;
	});
	benchmark.run('string+', function()
	{
		return 'a' + 'b' + '12' + 'd';
	});
	benchmark.run('string-replace', function()
	{
		return 'abcd'.replace('12');
	});
	benchmark.run('string-replace-all', function()
	{
		return 'abcd'.replaceAll('12');
	});
	var number = '1';
	benchmark.run('parseInt', function()
	{
		return parseInt(number);
	});
	benchmark.run('|0', function()
	{
		return number | 0;
	});
	benchmark.run('Math.random()', function()
	{
		var r = parseInt(Math.random() * 1000000000);
		return r.toString(16);
	});
	benchmark.run('buffer-concat', function()
	{
		var buffer = new Buffer('hello');
		var buffers = [];
		for (var i = 0; i < 10; i++)
		{
			buffers.push(buffer);
		}
		return Buffer.concat(buffers).toString('utf8');
	});
	benchmark.run('string-concat', function()
	{
		var string = 'hello';
		var result = '';
		for (var i = 0; i < 10; i++)
		{
			result += string;
		}
		return result;
	});
	benchmark.run('string-array-concat', function()
	{
		var string = 'hello';
		var result = [];
		for (var i = 0; i < 10; i++)
		{
			result.push(string);
		}
		return result.join('');
	});
	benchmark.run('for-loop', function()
	{
		var total = 0;
		for (var i = 0; i < longArray.length; i++)
		{
			total += longArray[i];
		}
	});
	benchmark.run('forEach()', function()
	{
		var total = 0;
		longArray.forEach(function(element)
		{
			total += element;
		});
	});
	benchmark.run('for..in', function()
	{
		var total = 0;
		for (var i in longArray)
		{
			total += longArray[i];
		}
	});
	benchmark.run('for-function', function()
	{
		var total = 0;
		forFun(longArray, function(element)
		{
			total += element;
		});
	});
	benchmark.run('Date.now()', function()
	{
		return Date.now();
	});
	benchmark.run('process.hrtime()', function()
	{
		return process.hrtime();
	});
	if (options.json) console.log('%j', benchmark.results);
	return benchmark.results;
};

function forFun(array, callback)
{
	for (var i = 0; i < array.length; i++)
	{
		if (array[i] !== undefined)
		{
			callback(array[i]);
		}
	}
}

function BenchmarkRunner(options)
{
	// self-reference
	var self = this;

	// attributes
	self.results = {};

	self.run = function(name, fn)
	{
		var time = Date.now();
		var iterations = 0;
		var elapsed = 0;
		while (elapsed < spanMs)
		{
			for (var i = 0; i < ITERATIONS; i++)
			{
				fn();
			}
			iterations += ITERATIONS;
			elapsed = Date.now() - time;
		}
		var seconds = elapsed / 1000;
		var ips = (iterations / seconds).toExponential();
		var ns = (1e9 * (seconds / iterations)).toFixed(0);
		self.results[name] = {
			seconds: seconds,
			ips: ips,
			ns: ns,
		};
		if (!options.json) console.log('Function %s running for %s seconds: %s iterations per second, %s ns per iteration', name, seconds.toFixed(2), ips, ns);
	};
}
