// test/test.spec.js
const { expect, use } = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");

use(sinonChai);

const { getAssembler } = require('../helpers');

const grammar = require('../../../src/models/lmc/assembler-grammar.js');

const assembler = getAssembler(grammar);

describe('The lmc assembler', function () {
  describe('labels', function () {
    it('should compile labels', function () {
      const { labels } = assembler.assemble('label0 HLT\nlabel1 HLT\n');

      expect(labels).to.eql({ label0: 0, label1: 1 });
    });
  });

  describe('HLT', function () {
    it('should have the opcode 0', function () {
      const { code } = assembler.assembleLine('HLT');

      expect(code).to.eql([0]);
    });

    it('should call hlt() on the vm', function () {
      const { fn } = assembler.assembleLine('HLT');
      const hlt = sinon.spy();

      fn({ hlt });

      expect(hlt.called).to.be.true;
    });
  });

  describe('BRA', function () {
    describe('BRA address', function () {
      it('should have the opcode 6xx', function () {
        const { code } = assembler.assembleLine('BRA 99');

        expect(code).to.eql([699]);
      });

      it('should call bra(address) on the vm', function () {
        const { fn } = assembler.assembleLine('BRA 99');
        const bra = sinon.spy();

        fn({ bra });

        expect(bra).to.have.been.called;
      });

      it('should generate working code for a back reference', function () {
        const { lines } = assembler.assemble(
          'HLT\n label1 HLT\n HLT\n BRA label1\n'
        );
        const bra = sinon.spy();

        const { code, fn } = lines[3];
        fn({ bra });

        expect(code).to.eql([601]);
        expect(bra).to.have.been.calledWith(1);
      });

      it('should generate working code for a forward reference', function () {
        const { lines } = assembler.assemble(
          'BRA label1\n HLT\n label1 HLT\n'
        );
        const bra = sinon.spy();

        const { code, fn } = lines[0];
        fn({ bra });

        expect(code).to.eql([602]);
        expect(bra).to.have.been.calledWith(2);
      });

    });
  });
});
