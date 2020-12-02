const apiComm = require('../apiCommunicator.js');

// START THE API !! //

test('Real api - read all users', async ()=>{
  expect.assertions(3);
  const res = await apiComm('/api/', 'GET', '');
  expect(res).toBeDefined();
  expect(res.answer).toBe('object');
  expect(res.answer.message).toEqual('Reading done!')
})

// test('Real api - login attempt, cookie revision', ()=>{
//
// })
