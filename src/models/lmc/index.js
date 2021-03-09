// src/models/lmc/index.js

/**
 * Little Man Computer (LMC) model.
 *
 * @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 * @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 * @license MIT
 */

const { Parser, Grammar } = require('nearley');
const assemblerGrammar = require('./assembler-grammar.js');

exports.getAssembler = () => {
  return {
    assemble(source) {
      const parser = new Parser(Grammar.fromCompiled(assemblerGrammar));
      parser.feed(source.slice(-1) === '\n' ? source : `${source}\n`);
      this.compiled = parser.results[0].lines;
      this.linePointer = 0;
    },
    compiled: [],
    linePointer: 0,

    step() {
      let type, line;
      do {
        // See if we have got to the end.
        if (this.linePointer >= this.compiled.length) return null;
        ({ type, line } = this.compiled[this.linePointer]);
        ++this.linePointer;
      } while (type !== 'line');
      line.compiled(this.context);
      return this.context;
    },

    context: {
      state: { a: 0 },
      terminal: {
        getPrompt() {
          return 23;
        },
      },
    },
  };
};
