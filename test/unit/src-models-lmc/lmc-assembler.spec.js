// test/test.spec.js
// Keep these
// lines so that
// it is easy to
// see the diff
// with jest

const { getAssembler } = require('../helpers');

const grammar = require('../../../src/models/lmc/assembler-grammar.js');

const assembler = getAssembler(grammar);

describe('The lmc assembler', function () {
  describe('labels', function () {
    it('should compile labels', function () {
      const { labels } = assembler.assemble('label0 HLT\nlabel1 HLT\n');

      expect(labels).toEqual({ label0: 0, label1: 1 });
    });
  });

  describe('HLT', function () {
    it('should have the opcode 0', function () {
      const { code } = assembler.assembleLine('HLT');

      expect(code).toEqual([0]);
    });

    it('should call hlt() on the vm', function () {
      const { fn } = assembler.assembleLine('HLT');
      const hlt = jest.fn();

      fn({ hlt });

      expect(hlt).toHaveBeenCalled();
    });
  });

  describe('BRA', function () {
    describe('BRA address', function () {
      it('should have the opcode 6xx', function () {
        const { code } = assembler.assembleLine('BRA 99');

        expect(code).toEqual([699]);
      });

      it('should call bra(address) on the vm', function () {
        const { fn } = assembler.assembleLine('BRA 99');
        const bra = jest.fn();

        fn({ bra });

        expect(bra).toHaveBeenCalled();
      });

      it('should generate working code for a back reference', function () {
        const { lines } = assembler.assemble(
          'HLT\n label1 HLT\n HLT\n BRA label1\n'
        );
        const bra = jest.fn();

        const { code, fn } = lines[3];
        fn({ bra });

        expect(code).toEqual([601]);
        expect(bra).toHaveBeenCalledWith(1);
      });

      it.skip('should generate working code for a forward reference', function () {
        const { lines } = assembler.assemble('BRA label1\n HLT\n label1 HLT\n');
        const bra = jest.fn();

        const { code, fn } = lines[0];
        fn({ bra });

        expect(code).toEqual([602]);
        expect(bra).toHaveBeenCalledWith(2);
      });
    });
  });
});
