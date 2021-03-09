// test/test.spec.js
const { expect } = require('chai');

const { Parser, Grammar } = require('nearley');
const grammar = require('../../../src/models/lmc/assembler-grammar.js');

function assemble(source) {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  parser.feed(source);
  return parser.results;
}

function assembleLine(source) {
  return assemble(source)[0].lines[0];
}

describe('The lmc assembler', function () {
  describe('INP', function () {
    it('should compile INP', function () {
      const { type, line } = assembleLine('INP\n');

      expect(type).to.equal('line');
      expect(line.offset).to.equal(0);
      expect(line.parsed).to.eql(['INP']);
      // expect(line.opcode).to.eql([700]);

      // Test operation.
      const state = { a: 0 };
      const terminal = { getPrompt: () => 123 }
      line.compiled({ state, terminal });
      expect(state.a).to.equal(123);
    });
  });
});
