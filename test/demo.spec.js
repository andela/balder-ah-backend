const chai = require('chai');

const { expect } = chai;

const add = (a, b) => a + b;

describe('demo test', () => {
  it('should always pass', () => {});

  it('should add 2 numbers together', () => {
    expect(add(2, 4)).to.equal(6);
  });
});
