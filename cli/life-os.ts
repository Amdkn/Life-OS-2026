#!/usr/bin/env node
import { runCli } from '../src/lib/tooling/adapters/cli';

const args = process.argv.slice(2);
runCli(args);
