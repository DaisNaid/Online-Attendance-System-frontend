var assert = require('assert');

function generateOTC(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('Validate OTC', function () {
  const OTC = generateOTC(6);
  //OTC - One Time Code generated for each class
  //enteredOTC - Value entered as OTC by student
  it(`should be valid when enteredOTC is equals to ${OTC}`, function () {
    var enteredOTC = 'SIOSNM';
    assert.equal(OTC, enteredOTC);
  });
});
