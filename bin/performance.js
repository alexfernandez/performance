#!/usr/bin/env node

/**
 * Binary to check performance.
 * (C) 2014 Alex Fernández.
 */

import {readFile} from 'fs/promises'
import stdio from 'stdio'
import {runBenchmarks} from '../lib/performance.js'

// init
const options = stdio.getopt({
	file: {key: 'f', args: 1, description: 'Output results to a file', default: ''},
	json: {key: 'j', description: 'Show benchmark results in JSON format'},
	seconds: {key: 's', args: 1, description: 'Number of seconds to run', default: 0},
	version: {key: 'v', description: 'Show version number and exit'},
})
if (options.version) {
	const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)))
	console.log('Loadtest version: %s', packageJson.version)
	process.exit(0)
}

runBenchmarks(options)
