#!/usr/bin/env node
// bin/build.js

const { createReadStream, createWriteStream, promises } = require('fs');
const { resolve, join } = require('path');

const nearley = require('nearley/lib/nearley.js');
const compile = require('nearley/lib/compile.js');
const generate = require('nearley/lib/generate.js');
const lint = require('nearley/lib/lint.js');

const { readdir, stat } = promises;

const parserGrammar = nearley.Grammar.fromCompiled(
  require('nearley/lib/nearley-language-bootstrapped.js')
);
const StreamWrapper = require('nearley/lib/stream.js');

const modelsDir = join(__dirname, '..', 'src', 'models');

// const modelcpuVersion = require('../package.json').version;
const nearleyVersion = require('nearley/package.json').version;

const assemblerCompileOptions = {
  export: 'assemblerGrammar',
  quiet: false,
  nojs: false,
  version: 'see documentation.',
};

async function build() {
  // Get the models directory entries.
  (await readdir(modelsDir)).forEach(async (name) => {
    // Get the full paths.
    const filePath = join(modelsDir, name);

    // Only try to build directories.
    if ((await stat(filePath)).isDirectory()) {
      return buildOneModel(filePath, name);
    }
  });
}

async function buildOneModel(modelPath, name) {
  const inFile = resolve(modelPath, 'assembler.ne');
  const outFile = resolve(modelPath, 'assembler-grammar.js');

  var input = createReadStream(inFile);
  var output = createWriteStream(outFile, { mode: 0o644 });

  const banner = `/**
 * Compiled Nearly grammar for ${name} assembler.
 *
 * @link https://github.com/modelcpu/modelcpu-js/blob/models/${name}/README.md
 * @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 * @license MIT
 */
`;

  const parser = new nearley.Parser(parserGrammar);

  input.pipe(new StreamWrapper(parser)).on('finish', function () {
    parser.feed('\n');
    var compiled = compile(parser.results[0], assemblerCompileOptions);
    if (!assemblerCompileOptions.quiet) {
      lint(compiled, { out: process.stderr, version: nearleyVersion });
    }
    output.write(banner + generate(compiled, assemblerCompileOptions.export));
  });
}

build();
