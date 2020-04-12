'use strict';

/**
 * Performance measurements.
 * (C) 2014-2015 Alex Fernández.
 */

// requires
const Console = require('console').Console;
const createWriteStream = require('fs').createWriteStream;
const crypto = require('crypto');
const util = require('util');

// constants
const TIME = 1000;
const ITERATIONS = 1000;
const ARRAY_SIZE = 10000;

// globals
const token = 'mpQFJMt/dfnp5L8HtTAcAxYw+wSIlg==';
const original = {
	a: 'a',
	b: 'b',
};
let spanMs;

let console = global.console;


/**
 * Run all performance benchmarks.
 */
exports.runBenchmarks = function(options)
{
	options = options || {};
	spanMs = 1000 * options.seconds || TIME;
	if (options.file) console = new Console(createWriteStream(options.file));
	if (!options.json) console.log('Running benchmarks for %s ms', spanMs);
	const longArray = [];
	const object = {};
	for (let i = 0; i < ARRAY_SIZE; i++)
	{
		longArray.push(i);
		object[i] = i;
	}
	const benchmark = new BenchmarkRunner(options);
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
		const value = '' + Date.now() + Math.random();
		const hash = crypto.createHash('sha1');
		return hash.update(value).digest("hex").toLowerCase();
	});
	benchmark.run('sha256-token', function()
	{
		const value = '' + Date.now() + Math.random();
		const hash = crypto.createHash('sha256');
		return hash.update(value).digest("hex").toLowerCase();
	});
	benchmark.run('replace-regexp()', function()
	{
		return token.replace(/\=/g, '').replace(/\//g, '').replace(/\+/g, '').toLowerCase();
	});
	benchmark.run('match().join()', function()
	{
		return token.match(/\w+/g).join('').toLowerCase();
	});
	benchmark.run('for().toLowerCase()', function()
	{
		let result = '';
		for (let i = 0; i < 25; i++)
		{
			const c = token[i];
			if (c != '+' && c != '/' && c != '=')
			{
				result += c.toLowerCase();
			}
		}
		return result;
	});
	benchmark.run('for().charCodeAt()', function()
	{
		let result = '';
		for (let i = 0; i < 25; i++)
		{
			const c = token.charCodeAt(i);
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
		for (const index in longArray)
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
		for (const key in object)
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
		return 'abcd'.replace('12', '34');
	});
	benchmark.run('string-replace-regexp', function()
	{
		return 'abcd'.replace(/12/, 34);
	});
	const number = '1';
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
		const r = parseInt(Math.random() * 1000000000);
		return r.toString(16);
	});
	benchmark.run('buffer-concat', function()
	{
		const buffer = Buffer.from('hello');
		const buffers = [];
		for (let i = 0; i < 10; i++)
		{
			buffers.push(buffer);
		}
		return Buffer.concat(buffers).toString('utf8');
	});
	benchmark.run('string-concat', function()
	{
		const string = 'hello';
		let result = '';
		for (let i = 0; i < 10; i++)
		{
			result += string;
		}
		return result;
	});
	benchmark.run('string-array-concat', function()
	{
		const string = 'hello';
		const result = [];
		for (let i = 0; i < 10; i++)
		{
			result.push(string);
		}
		return result.join('');
	});
	benchmark.run('for-loop', function()
	{
		let total = 0;
		for (let i = 0; i < longArray.length; i++)
		{
			total += longArray[i];
		}
	});
	benchmark.run('forEach()', function()
	{
		let total = 0;
		longArray.forEach(function(element)
		{
			total += element;
		});
	});
	benchmark.run('for..in', function()
	{
		let total = 0;
		for (const i in longArray)
		{
			total += longArray[i];
		}
	});
	benchmark.run('for-function', function()
	{
		let total = 0;
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
	for (let i = 0; i < array.length; i++)
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
	const self = this;

	// attributes
	self.results = {};

	self.run = function(name, fn)
	{
		const time = Date.now();
		let iterations = 0;
		let elapsed = 0;
		while (elapsed < spanMs)
		{
			for (let i = 0; i < ITERATIONS; i++)
			{
				fn();
			}
			iterations += ITERATIONS;
			elapsed = Date.now() - time;
		}
		const seconds = elapsed / 1000;
		const ips = (iterations / seconds).toExponential();
		const ns = (1e9 * (seconds / iterations)).toFixed(0);
		self.results[name] = {
			seconds: seconds,
			ips: ips,
			ns: ns,
		};
		if (!options.json) console.log('Function %s running for %s seconds: %s iterations per second, %s ns per iteration', name, seconds.toFixed(2), ips, ns);
	};
}
