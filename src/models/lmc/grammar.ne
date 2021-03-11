# src/models/lmc/grammar.ne

###
 # Nearly grammar for little-man-computer assembler.
 #
 # @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 # @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 # @license MIT
 #/

# The top level structure is an array of lines.
main -> line:+ {% id %}

# A line can be empty, contain an instruction or a label and an instruction.
line -> ( empty_line | instruction_line | label_instruction_line ) {% ([[d]]) => d %}

empty_line -> _ EOL {% () => ({}) %}
instruction_line -> _ instruction _ EOL {% ([, instruction]) => instruction %}
label_instruction_line -> _ LABEL __ instruction _ EOL {% ([,labl,, instruction]) => ({ labl, ...instruction }) %}

# --- IMPLEMENT INSTRUCTIONS ---------------------------------------------------
instruction ->

  # HLT -> 000
    hlt            {% ()         => ({ fn: 'hlt' }) %}

  # BRA nn -> 6nn
  | bra __ INTEGER {% ([,, arg]) => ({ fn: 'bra', args: [arg] }) %}

  # BRA label -> 6nn
  | bra __ LABEL   {% ([,, arg]) => ({ fn: 'braL', args: [arg] }) %}

# === TERMINALS FOR USE WITHOUT A LEXER ========================================

# --- Instructions  ------------------------------------------------------------
bra -> "bra" | "BRA" {% () => null %}
hlt -> "hlt" | "HLT" {% () => null %}

# Limited characters in label currently.
LABEL -> [A-Za-z] [A-Za-z0-9]:+ {% ([d, e]) => d + e.join('') %}

# Only unsigned decimals allowed.
INTEGER -> [0-9]:+ {% ([d]) => d.join('') %}

EOL -> "\n" {% () => null %}

# Mandatory whitespace.
__ -> [ \t]:+ {% () => null %}

# Optional whitespace.
_ -> [ \t]:*  {% () => null %}
