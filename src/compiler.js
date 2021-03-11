// src/compiler.js

const { Parser, Grammar } = require('nearley');

const defaultConfig = {
  minBranchAddress: 0,
  maxBranchAddress: 0xff,
};

class Compiler {
  constructor({ instructions, grammar, config } = {}) {
    this.instructions = instructions;
    this.grammar = grammar;
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Parse source code.
   *
   * @param {*} source
   * @returns {[lines]} Parsed lines.
   */
  assemble(source) {
    // Create a new parser each time as they are not reusable.
    const parser = new Parser(Grammar.fromCompiled(this.grammar));
    parser.feed(source);
    if (parser.results.length > 1) {
      throw new Error(
        'test parsing error: multiple results due to ambiguous grammer'
      );
    }
    return parser.results[0];
  }

  getValidBranchAddress(value) {
    value = parseInt(value);
    if (
      value < this.config.minBranchAddress ||
      value > this.config.maxBranchAddress
    ) {
      throw new Error('branch address out of bounds');
    }
    return value;
  }

  convertStringToFunction(line, labels) {
    const [label] = line.args;
    if (label == null) {
      throw new Error(
        `compiler error: not enough arguments for label instruction`
      );
    }

    let loc = labels[label];
    if (loc == null) {
      throw new Error(`undefined label '${label}'`);
    }

    // Make sure it is safe to use the argument as the branch location.
    loc = this.getValidBranchAddress(loc);
    line.fn = ({ bra }) => bra(loc);
    line.code = [600 + loc];
  }

  // Set labels.
  firstPass(d) {
    let location = 0;
    d.labels = {};
    d.lines.forEach((line) => {
      const { fn, labl } = line;
      if (labl) {
        // Add this to the symbol table.
        d.labels[labl] = location;
      }

      if (fn) {
        Object.assign(line, this.instructions[fn](line, this));

        // Increment the code offset.
        line.loc = location;
        location += line.code.length;
      }
    });
  }

  // Insert labels and build the code stream.
  secondPass(d) {
    d.compiled = [];
    d.lines.forEach((line) => {
      const { code, loc, fn } = line;
      if (code) {
        // Check we are at the right position in the code stream otherwise labels
        // will have been calculated incorrectly.
        if (d.compiled.length !== loc) {
          throw new Error(
            'compiler error: code length does not match first pass'
          );
        }

        // If this is a label instruction, modify it for the label.
        if (typeof fn === 'string') {
          this.convertStringToFunction(line, d.labels);
        }

        if (
          d.compiled.length + code.length - 1 >
          this.config.maxBranchAddress
        ) {
          throw new Error('code too long to fit in memory');
        }

        // Now it is safe to push it to the object code stream.
        d.compiled.push(...code);
      }
    });
  }

  // Compile one line.
  compileLine(source) {
    return this.compile(`${source}\n`).lines[0];
  }

  // Compile the lines.
  compile(source) {
    const compiled = { lines: this.assemble(source) };
    this.firstPass(compiled);
    this.secondPass(compiled);
    return compiled;
  }
}

module.exports = Compiler;
