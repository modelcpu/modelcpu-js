/*
const { Parser, Grammar } = require('nearley');
const grammar = require('./dist/models/little-man-computer/assembler-grammar.js');

const parser = new Parser(Grammar.fromCompiled(grammar));

// parser.feed('firstLabel OUT\nINP\n');
// parser.feed('secondLabel OUT\n');
*/
const { getAssembler } = require('../src/models/lmc');

console.log(getAssembler);

const assembler = getAssembler();
assembler.assemble('OUT\nINP\nOUT\n');

let context;
do {
  context = assembler.step();
  console.log(context);
} while (context);
