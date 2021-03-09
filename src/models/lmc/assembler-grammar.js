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

// Location offset.
let offset = 0;
// Label table.
const labels = {};
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": ([lines]) => ({ type:'main', lines, labels })},
    {"name": "line", "symbols": ["instruction", "newline"], "postprocess": ([line]) => ({ type: 'line', line })},
    {"name": "line", "symbols": ["newline"], "postprocess": (line) => ({ type: 'line-empty', line })},
    {"name": "instruction$string$1", "symbols": [{"literal":"O"}, {"literal":"U"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instruction", "symbols": ["instruction$string$1"], "postprocess":  (parsed) => ({
          compiled: ({ state }) => state.a,
          offset: offset++,
          parsed,
        }) },
    {"name": "instruction$string$2", "symbols": [{"literal":"I"}, {"literal":"N"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instruction", "symbols": ["instruction$string$2"], "postprocess":  (parsed) => ({
          compiled: ({ state, terminal }) => { state.a = terminal.getPrompt(); },
          offset: offset++,
          parsed,
        }) },
    {"name": "newline", "symbols": [{"literal":"\r"}, {"literal":"\n"}]},
    {"name": "newline", "symbols": [{"literal":"\r"}]},
    {"name": "newline", "symbols": [{"literal":"\n"}], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.assemblerGrammar = grammar;
}
})();
