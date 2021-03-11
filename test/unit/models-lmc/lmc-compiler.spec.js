// test/unit/models-lmc/lmc-compiler.spec.js

const { getCompiler } = require('../../../src/models/lmc/compiler');

const compiler = getCompiler();

describe('The lmc compiler', function () {
  describe('labels', function () {
    it('should compile labels', function () {
      const { labels } = compiler.compile('label0 HLT\nlabel1 HLT\n');

      expect(labels).toEqual({ label0: 0, label1: 1 });
    });
  });

  describe('HLT', function () {
    it('should have the opcode 0', function () {
      const { code } = compiler.compileLine('HLT');

      expect(code).toEqual([0]);
    });

    it('should call hlt() on the vm', function () {
      const { fn } = compiler.compileLine('HLT');
      const hlt = jest.fn();

      fn({ hlt });

      expect(hlt).toHaveBeenCalled();
    });
  });

  describe('BRA', function () {
    describe('BRA address', function () {
      it('should have the opcode 6xx', function () {
        const { code } = compiler.compileLine('BRA 99');

        expect(code).toEqual([699]);
      });

      it('should call bra(address) on the vm', function () {
        const { fn } = compiler.compileLine('BRA 99');
        const bra = jest.fn();

        fn({ bra });

        expect(bra).toHaveBeenCalledWith(99);
      });

      it('should fail for an address greater than maxBranchAddress', function () {
        expect(() => compiler.compileLine('BRA 100')).toThrow('out of bounds');
      });

      it('should generate working code for a back reference', function () {
        const { lines } = compiler.compile(
          'HLT\n label1 HLT\n HLT\n BRA label1\n'
        );
        const bra = jest.fn();

        const { code, fn } = lines[3];
        fn({ bra });

        expect(code).toEqual([601]);
        expect(bra).toHaveBeenCalledWith(1);
      });

      it('should generate working code for a forward reference', function () {
        const { lines } = compiler.compile('BRA label1\n HLT\n label1 HLT\n');
        const bra = jest.fn();

        const { code, fn } = lines[0];
        fn({ bra });

        expect(code).toEqual([602]);
        expect(bra).toHaveBeenCalledWith(2);
      });
    });
  });
});
