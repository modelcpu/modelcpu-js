// test/unit/models-lmc/lmc-grammar.spec.js

const { getAssembler } = require('../helpers');

const grammar = require('../../../src/models/lmc/grammar.js');

const assembler = getAssembler(grammar);

describe('The lmc assembler grammar', () => {
  describe('HLT', () => {
    it('should become `hlt`', () => {
      const { fn, args } = assembler.assembleLine('HLT');

      expect(fn).toBe('hlt');
      expect(args).toBeUndefined();
    });
  });

  describe('BRA', () => {
    describe('BRA address', () => {
      it('should become `bra n`', () => {
        const { fn, args } = assembler.assembleLine('BRA 999');
        expect(fn).toBe('bra');
        expect(args).toStrictEqual(['999']);
      });

      it('should reject a float', () => {
        expect(() => assembler.assembleLine('BRA 1.3')).toThrow('Syntax error');
      });

      it('should reject a negative integer', () => {
        expect(() => assembler.assembleLine('BRA -1')).toThrow('Syntax error');
      });
    });

    describe('BRA label', () => {
      it('should become `braL label`', () => {
        const { fn, args } = assembler.assembleLine('BRA anywhere');

        expect(fn).toBe('braL');
        expect(args).toStrictEqual(['anywhere']);
      });
    });
  });
});
