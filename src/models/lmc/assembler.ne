###
 # Nearly grammar for little-man-computer assembler.
 #
 # @link https://github.com/modelcpu/modelcpu-js/blob/models/lmc/README.md
 # @copyright Copyright 2021 [ModelCPU](https://modelcpu.com/).
 # @license MIT
 #/

# Javascript internals.
@{%
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

%}

main -> line:+ {% ([lines]) => compile(lines) %}

line -> ( empty_line | instruction_line | label_instruction_line ) {% ([[d]]) => d %}

empty_line -> _ EOL {% () => ({}) %}
instruction_line -> _ instruction _ EOL {% ([, instruction]) => instruction %}
label_instruction_line -> _ LABEL __ instruction _ EOL {% ([,labl,, instruction]) => ({ labl, ...instruction }) %}

# --- IMPLEMENT INSTRUCTIONS ---------------------------------------------------
instruction ->

  # HLT -> 000
    hlt            {% ([d]) =>      ({ fn: ({ hlt }) => hlt(),  code: [0] }) %}

  # BRA nn -> 6nn
  | bra __ INTEGER {% ([,, arg]) => {
      address = getValidBranchAddress(arg);
      return { fn: ({ bra }) => bra(address), code: [600 + address], args: [arg] };
  } %}

  # BRA label -> 6nn
  | bra __ LABEL   {% ([,, arg]) => ({ fn: 'braL', code: [600], args: [arg] }) %}

# --- SYNTAX ELEMENTS ----------------------------------------------------------

# Argument separator.
argsep -> _ "," _ {% () => null %}

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
