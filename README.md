[![Build Status](https://secure.travis-ci.org/alexfernandez/performance.svg)](http://travis-ci.org/alexfernandez/performance)
[![NPM](https://nodei.co/npm/performance.png?downloads=true)](https://nodei.co/npm/performance/)
[![Package quality](http://packagequality.com/badge/performance.png)](http://packagequality.com/#?package=performance)

# performance

A short and slick node.js performance measurement.

## Installation

Simply install with:

    $ npm install performance

and run with:

    $ npm start

You will get a measurement of performance on that particular machine,
which can be compared with other instances.

### Binary

Install globally to get a binary that you can run from any path:

    $ sudo npm install -g performance

And the binary will be called simply performance:

    $ performance

You can run it from any path and with any user.

#### Options

* `--file`: Output results to a file. `performance --file out.txt` is equivalent
  to `performance > out.txt`
* `--json`: Show benchmark results in JSON format
* `--seconds`: Number of seconds to run
* `--version`: Show version number and exit

### Programmatic Use

Once installed, you can use performance from your own packages. Simply require
it, and invoke the function `runBenchmarks()`. It accept an object with the same
options as running it from the CLI:

```
var performance = require('performance');
var results = performance.runBenchmarks();
console.log(results);
```

This will show an object with a lot of results, each with iterations per second and nanoseconds per iteration:

```
{
	nil: {
            seconds: 1.03,
            ips: 1.65844e+8,
            ns: 6,
    },
	...
}
```

## Sample run

On an amd64 server for [Travis-CI](https://travis-ci.org/) with Node.js v10.20.1:

```
$ npm test

> performance@1.3.0 test /home/travis/build/alexfernandez/performance
> node index.js

Running benchmarks for 1000 ms
Function nil running for 1.00 seconds: 1.042137e+9 iterations per second, 1 ns per iteration
Function util._extend() running for 1.00 seconds: 1.56934e+8 iterations per second, 6 ns per iteration
Function Object.keys() running for 1.08 seconds: 6.487488415199259e+3 iterations per second, 154143 ns per iteration
Function sha1-token running for 1.00 seconds: 4.16e+5 iterations per second, 2404 ns per iteration
Function sha256-token running for 1.00 seconds: 3.806193806193807e+5 iterations per second, 2627 ns per iteration
Function replace-regexp() running for 1.00 seconds: 1.834e+6 iterations per second, 545 ns per iteration
Function match().join() running for 1.00 seconds: 2.47e+6 iterations per second, 405 ns per iteration
Function for().toLowerCase() running for 1.00 seconds: 2.399e+6 iterations per second, 417 ns per iteration
Function for().charCodeAt() running for 1.00 seconds: 3.902e+6 iterations per second, 256 ns per iteration
Function timestamp running for 1.00 seconds: 2.325e+6 iterations per second, 430 ns per iteration
Function array-access running for 1.09 seconds: 6.439742410303588e+3 iterations per second, 155286 ns per iteration
Function object-access running for 1.11 seconds: 6.323396567299006e+3 iterations per second, 158143 ns per iteration
Function string+ running for 1.00 seconds: 1.83771e+8 iterations per second, 5 ns per iteration
Function string-replace running for 1.00 seconds: 3.625e+7 iterations per second, 28 ns per iteration
Function string-replace-regexp running for 1.00 seconds: 1.8935e+7 iterations per second, 53 ns per iteration
Function parseInt running for 1.00 seconds: 1.27524e+8 iterations per second, 8 ns per iteration
Function |0 running for 1.00 seconds: 1.84153e+8 iterations per second, 5 ns per iteration
Function Math.random() running for 1.00 seconds: 1.929e+6 iterations per second, 518 ns per iteration
Function string-concat running for 1.00 seconds: 1.4053e+7 iterations per second, 71 ns per iteration
Function string-array-concat running for 1.00 seconds: 2.938e+6 iterations per second, 340 ns per iteration
Function for-loop running for 1.00 seconds: 1.1144278606965176e+5 iterations per second, 8973 ns per iteration
Function forEach() running for 1.00 seconds: 3.0876494023904383e+4 iterations per second, 32387 ns per iteration
Function process.hrtime() running for 1.00 seconds: 1.6807e+7 iterations per second, 59 ns per iteration
```

It is similar to the performance on a large Amazon AWS instance. Note that most of the time,
what you are paying for on Amazon is more cores, not better ones.

## Some interesting points

Note that a regular `for` loop is more than 20 times faster than `forEach()`,
and that even a `forFun()` function that emulates `forEach()` can easily be made
to run 5 times faster than `forEach()`.

## Extending

Add you own benchmark on `index.js`: simply give it a name and a function
that can be called repeatedly.

    benchmark(name, operation);

Example:

    benchmark('replaceAll()', function()
    {
        return token.replaceAll('=', '').replaceAll('/', '').replaceAll('+', '').toLowerCase();
    });

Don't forget to send a Pull Request!

## The MIT License

Copyright (c) 2014-2020 Alex Fernández <alexfernandeznpm@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
