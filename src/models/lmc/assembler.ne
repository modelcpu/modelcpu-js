###
 # Nearly grammar for little-man-computer assembler.
 #
 # @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 # @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 # @license MIT
 #/

# Javascript compiler internals.
@{%
// Location offset.
let offset = 0;
// Label table.
const labels = {};
%}

main -> line:* {% ([lines]) => ({ type:'main', lines, labels }) %}

line -> instruction newline {% ([line]) => ({ type: 'line', line }) %}

# Allow empty lines.
line -> newline {% (line) => ({ type: 'line-empty', line }) %}

instruction ->
  "OUT" {% (parsed) => ({
    compiled: ({ state }) => state.a,
    offset: offset++,
    parsed,
  }) %}

  | "INP" {% (parsed) => ({
    compiled: ({ state, terminal }) => { state.a = terminal.getPrompt(); },
    offset: offset++,
    parsed,
  }) %}

newline -> "\r" "\n" | "\r" | "\n" {% () => null %}
