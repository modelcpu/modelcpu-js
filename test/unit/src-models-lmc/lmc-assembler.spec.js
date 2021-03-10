// test/test.spec.js
const { expect } = require('chai');
const sinon = require('sinon');

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

        expect(bra.called).to.equal(true);
      });
    });
  });
});
