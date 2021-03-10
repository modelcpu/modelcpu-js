/**
 * Compiled Nearly grammar for lmc assembler.
 *
 * @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 * @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 * @license MIT
 */
// Generated automatically by nearley, version see documentation.
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const MAXIMUM_ADDRESS = 99;

function getValidBranchAddress(value) {
  value = parseInt(value);
  if (value < 0) {
    throw new Error('branch address out of bounds');
  }
  if (value > MAXIMUM_ADDRESS) {
    throw new Error('branch address must not be negative');
  }
  return value;
}

function convertStringToFunction(line, labels) {
  const [label] = line.args;
  if (label == null) {
    throw new Error(`compiler error: not enough arguments for label instruction`);
  }

  let loc = labels[label];
  if (loc == null) {
    throw new Error(`undefined label '${label}'`);
  }

  // Make sure it is safe to use the argument as the branch location.
  loc = getValidBranchAddress(loc);
  line.fn = ({ bra }) => bra(loc);
  line.code = [600 + loc];
}

// Set labels.
function firstPass(d) {
  let location = 0;
  d.labels = {};
  d.lines.forEach((line) => {
    const { code, labl } = line;
    if (labl) {
      // Add this to the symbol table.
      d.labels[labl] = location;
    }

    if (code) {
      // Increment the code offset.
      line.loc = location;
      location += code.length;
    }
  });
}

// Insert labels and build the code stream.
function secondPass(d) {
  d.compiled = [];
  d.lines.forEach((line) => {
    const { code, loc, fn } = line;
    if (code) {
      // Check we are at the right position in the code stream otherwise labels
      // will have been calculated incorrectly.
      if (d.compiled.length !== loc) {
        throw new Error('compiler error: code length does not match first pass');
      }

      // If this is a label instruction, modify it for the label.
      if (typeof fn === 'string') {
        convertStringToFunction(line, d.labels);
      }

      if (d.compiled.length + code.length - 1 > MAXIMUM_ADDRESS) {
        throw new Error('code too long to fit in memory');
      }

      // Now it is safe to push it to the object code stream.
      d.compiled.push(...code);
    }
  });
}

// Compile the lines.
function compile(lines) {
  const compiled = { lines };
  firstPass(compiled);
  secondPass(compiled);
  return compiled;
}

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": ["line"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": ([lines]) => compile(lines)},
    {"name": "line$subexpression$1", "symbols": ["empty_line"]},
    {"name": "line$subexpression$1", "symbols": ["instruction_line"]},
    {"name": "line$subexpression$1", "symbols": ["label_instruction_line"]},
    {"name": "line", "symbols": ["line$subexpression$1"], "postprocess": ([[d]]) => d},
    {"name": "empty_line", "symbols": ["_", "EOL"], "postprocess": () => ({})},
    {"name": "instruction_line", "symbols": ["_", "instruction", "_", "EOL"], "postprocess": ([, instruction]) => instruction},
    {"name": "label_instruction_line", "symbols": ["_", "LABEL", "__", "instruction", "_", "EOL"], "postprocess": ([,labl,, instruction]) => ({ labl, ...instruction })},
    {"name": "instruction", "symbols": ["hlt"], "postprocess": ([d]) =>      ({ fn: ({ hlt }) => hlt(),  code: [0] })},
    {"name": "instruction", "symbols": ["bra", "__", "INTEGER"], "postprocess":  ([,, arg]) => {
            address = getValidBranchAddress(arg);
            return { fn: ({ bra }) => bra(address), code: [600 + address], args: [arg] };
        } },
    {"name": "instruction", "symbols": ["bra", "__", "LABEL"], "postprocess": ([,, arg]) => ({ fn: 'braL', code: [600], args: [arg] })},
    {"name": "argsep", "symbols": ["_", {"literal":","}, "_"], "postprocess": () => null},
    {"name": "bra$string$1", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bra", "symbols": ["bra$string$1"]},
    {"name": "bra$string$2", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"A"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bra", "symbols": ["bra$string$2"], "postprocess": () => null},
    {"name": "hlt$string$1", "symbols": [{"literal":"h"}, {"literal":"l"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "hlt", "symbols": ["hlt$string$1"]},
    {"name": "hlt$string$2", "symbols": [{"literal":"H"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "hlt", "symbols": ["hlt$string$2"], "postprocess": () => null},
    {"name": "LABEL$ebnf$1", "symbols": [/[A-Za-z0-9]/]},
    {"name": "LABEL$ebnf$1", "symbols": ["LABEL$ebnf$1", /[A-Za-z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "LABEL", "symbols": [/[A-Za-z]/, "LABEL$ebnf$1"], "postprocess": ([d, e]) => d + e.join('')},
    {"name": "INTEGER$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "INTEGER$ebnf$1", "symbols": ["INTEGER$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INTEGER", "symbols": ["INTEGER$ebnf$1"], "postprocess": ([d]) => d.join('')},
    {"name": "EOL", "symbols": [{"literal":"\n"}], "postprocess": () => null},
    {"name": "__$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": () => null},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.assemblerGrammar = grammar;
}
})();
