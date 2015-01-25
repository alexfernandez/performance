'use strict';

/**
 * Performance measurements.
 * (C) 2014 Alejandro Fernández.
 */

// requires
require('prototypes');
var crypto = require('crypto');
var util = require('util');
var Log = require('log');

// constants
var TIME = 1000;
var ITERATIONS = 1000;
var ARRAY_SIZE = 1000;

// globals
var log = new Log('info');
var token = 'mpQFJMt/dfnp5L8HtTAcAxYw+wSIlg==';
var original = {
	a: 'a',
	b: 'b',
};
var spanMs;


/**
 * Run all performance benchmarks.
 */
exports.runBenchmarks = function(seconds)
{
	spanMs = 1000 * seconds ||  TIME;
	log.info('Running benchmarks for %s ms', spanMs);
	var longArray = [];
	var object = {};
	for (var i = 0; i < ARRAY_SIZE; i++)
	{
		longArray.push(i);
		object[i] = i;
	}
	benchmark('nil', function()
	{
	});
	benchmark('util._extend()', function()
	{
		return util._extend(original);
	});
	benchmark('sha1-token', function()
	{
		var value = '' + Date.now() + Math.random();
		var hash = crypto.createHash('sha1');
		return hash.update(value).digest("hex").toLowerCase();
	});
	benchmark('sha256-token', function()
	{
		var value = '' + Date.now() + Math.random();
		var hash = crypto.createHash('sha256');
		return hash.update(value).digest("hex").toLowerCase();
	});
	benchmark('replaceAll()', function()
	{
		return token.replaceAll('=', '').replaceAll('/', '').replaceAll('+', '').toLowerCase();
	});
	benchmark('match().join()', function()
	{
		return token.match(/\w+/g).join('').toLowerCase();
	});
	benchmark('for().toLowerCase()', function()
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
	benchmark('for().charCodeAt()', function()
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
	benchmark('timestamp', function()
	{
		return Date.now() + "_" + Math.random().toString().substring(2);
	});
	benchmark('array-access', function()
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
	benchmark('object-access', function()
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
	benchmark('string+', function()
	{
		return 'a' + 'b' + '12' + 'd';
	});
	benchmark('string-replace', function()
	{
		return 'abcd'.replace('12');
	});
	benchmark('string-replace-all', function()
	{
		return 'abcd'.replaceAll('12');
	});
	var number = '1';
	benchmark('parseInt', function()
	{
		return parseInt(number);
	});
	benchmark('|0', function()
	{
		return number | 0;
	});
	benchmark('Math.random()', function()
	{
		var r = parseInt(Math.random() * 1000000000);
		return r.toString(16);
	});
	benchmark('buffer-concat', function()
	{
		var buffer = new Buffer('hello');
		var buffers = [];
		for (var i = 0; i < 10; i++)
		{
			buffers.push(buffer);
		}
		return Buffer.concat(buffers).toString('utf8');
	});
	benchmark('string-concat', function()
	{
		var string = 'hello';
		var result = '';
		for (var i = 0; i < 10; i++)
		{
			result += string;
		}
		return result;
	});
	benchmark('string-array-concat', function()
	{
		var string = 'hello';
		var result = [];
		for (var i = 0; i < 10; i++)
		{
			result.push(string);
		}
		return result.join('');
	});
	benchmark('for-loop', function()
	{
		var total = 0;
		for (var i = 0; i < longArray.length; i++)
		{
			total += longArray[i];
		}
	});
	benchmark('forEach()', function()
	{
		var total = 0;
		longArray.forEach(function(element)
		{
			total += element;
		});
	});
	benchmark('for..in', function()
	{
		var total = 0;
		for (var i in longArray)
		{
			total += longArray[i];
		}
	});
	benchmark('for-function', function()
	{
		var total = 0;
		forFun(longArray, function(element)
		{
			total += element;
		});
	});
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

function benchmark(name, fn)
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
	var secs = elapsed / 1000;
	var its = iterations / secs;
	console.log('Function ' + name + ' running for ' + Math.round(secs * 100) / 100 + ' second: ' + its.toExponential() + ' iterations per second');
}

