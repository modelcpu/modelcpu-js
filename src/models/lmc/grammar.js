/**
 * Compiled Nearly grammar for lmc.
 *
 * @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 * @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 * @license MIT
 */
// Generated automatically by nearley, version see documentation.
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": ["line"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "line$subexpression$1", "symbols": ["empty_line"]},
    {"name": "line$subexpression$1", "symbols": ["instruction_line"]},
    {"name": "line$subexpression$1", "symbols": ["label_instruction_line"]},
    {"name": "line", "symbols": ["line$subexpression$1"], "postprocess": ([[d]]) => d},
    {"name": "empty_line", "symbols": ["_", "EOL"], "postprocess": () => ({})},
    {"name": "instruction_line", "symbols": ["_", "instruction", "_", "EOL"], "postprocess": ([, instruction]) => instruction},
    {"name": "label_instruction_line", "symbols": ["_", "LABEL", "__", "instruction", "_", "EOL"], "postprocess": ([,labl,, instruction]) => ({ labl, ...instruction })},
    {"name": "instruction", "symbols": ["hlt"], "postprocess": ()         => ({ fn: 'hlt' })},
    {"name": "instruction", "symbols": ["bra", "__", "INTEGER"], "postprocess": ([,, arg]) => ({ fn: 'bra', args: [arg] })},
    {"name": "instruction", "symbols": ["bra", "__", "LABEL"], "postprocess": ([,, arg]) => ({ fn: 'braL', args: [arg] })},
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
   window.grammar = grammar;
}
})();
