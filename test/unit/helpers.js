// test/unit/helpers.js

const { Parser, Grammar } = require('nearley');

class Assembler {
  constructor(grammar) {
    this.grammar = grammar;
  }

  assemble(source) {
    const parser = new Parser(Grammar.fromCompiled(this.grammar));
    parser.feed(source);
    if (parser.results.length > 1) {
      throw new Error(
        'test compilaiton error: multiple results due to ambiguous grammer'
      );
    }
    return parser.results[0];
  }

  assembleLine(source) {
    return this.assemble(`${source}\n`).lines[0];
  }
}

exports.getAssembler = (grammar) => {
  return new Assembler(grammar);
};
