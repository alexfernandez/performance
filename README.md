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

If you want to install a binary that you can run from any path:

    $ sudo npm install -g performance

And the binary will be called simply performance:

    $ performance

You can run it from any path and with any user.

#### Options

* *file*: Output results to a file. `performance --file out.txt` is equivalent
  to `performance > out.txt`
* *json*: Show benchmark results in JSON format
* *seconds*: Number of seconds to run
* *version*: Show version number and exit

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

On my machine with Node.js v0.10.25: Intel(R) Core(TM) i3-2120T CPU @ 2.60GHz.

```
$ npm start

> performance@0.0.2 start /home/chenno/projects/performance
> node index.js

[Mon Nov 10 2014 11:42:42 GMT+0100 (CET)] INFO Running benchmarks for 1000 ms
Function nil running for 1 second: 1.55439e+8 iterations per second
Function util._extend() running for 1 second: 5.3891e+7 iterations per second
Function sha1-token running for 1 second: 1.9223107569721114e+5 iterations per second
Function sha256-token running for 1.01 second: 1.8172790466732872e+5 iterations per second
Function replaceAll() running for 1 second: 4.445554445554446e+5 iterations per second
Function match().join() running for 1 second: 8.09e+5 iterations per second
Function for().toLowerCase() running for 1 second: 8.86e+5 iterations per second
Function for().charCodeAt() running for 1 second: 1.974e+6 iterations per second
Function timestamp running for 1 second: 1.671e+6 iterations per second
Function array access running for 1 second: 4.087736789631107e+4 iterations per second
Function object access running for 1.02 second: 3.7401574803149604e+4 iterations per second
Function string + running for 1 second: 2.1568e+7 iterations per second
Function string replace running for 1 second: 1.5356e+7 iterations per second
Function string replace all running for 1 second: 4.11e+6 iterations per second
Function parseInt running for 1 second: 2.9648e+7 iterations per second
Function | 0 running for 1 second: 2.2428e+7 iterations per second
Function Math.random() running for 1 second: 3.822e+6 iterations per second
Function buffer concat running for 1 second: 1.9541375872382853e+5 iterations per second
Function string concat running for 1 second: 8.959e+6 iterations per second
Function string array concat running for 1 second: 4.184e+6 iterations per second
Function for loop running for 1 second: 4.2657342657342664e+5 iterations per second
Function forEach() running for 1.01 second: 2.180376610505451e+4 iterations per second
Function for..in running for 1.03 second: 1.0689990281827017e+4 iterations per second
Function for function running for 1 second: 1.00597609561753e+5 iterations per second
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

Copyright (c) 2014 Alex Fernández <alexfernandeznpm@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
