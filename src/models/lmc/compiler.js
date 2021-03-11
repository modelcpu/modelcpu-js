// src/models/lmc/compiler.js

/**
 * Compiler for LMC.
 *
 * @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 * @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 * @license MIT
 */

const Compiler = require('../../compiler');

const grammar = require('./grammar.js');

const config = {
  maxBranchAddress: 99,
};

// Each intermediate code instruction has a function to convert the parsed
// instruction into machine code. Note arguments are always strings.
const instructions = {
  // hlt -> HLT -> 000
  hlt: () => ({ fn: ({ hlt }) => hlt(), code: [0] }),

  // bra -> BRA nn -> 6nn
  bra: ({ args }, c) => {
    const address = c.getValidBranchAddress(args[0]);
    return { fn: ({ bra }) => bra(address), code: [600 + address] };
  },

  // braL -> BRA label -> 600, address to be added in next pass.
  braL: () => ({ fn: 'braL', code: [600] }),
};

// Compile the lines.
exports.getCompiler = () => {
  return new Compiler({
    instructions,
    grammar,
    config,
  });
};
