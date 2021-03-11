# modelcpu-js

> CPU models in JavaScript.

## Development

Currently at the proof of concept stage with the following conclusions:

- Using nearley without a lexer works reasonably well for the time being.
- Generating code in nearley fails with forward label references so this
  commit is a dead end.
- There are a number of advantages to moving to a separate compiler stage
  and these become features:
  - nearley will generate an intermediate representation which can be used
    to cross-compile or as input to a compiler for other languages;
  - JavaScript is kept out of the `.ne` grammar definition files which is
    cleaner for development tooling and testing;
  - the compilation stage (particularly handling labels) can be a common
    component between languages.

## Roadmap

### Blocking v0.2.0

- Convert nearley post-processing to output IR code instead of functions.
- Build a compiler from IR code to vm function calls.
- Implement all LMC instrucitons.
- Build a LMC virtual machine.
