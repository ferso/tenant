var request = require('supertest');

describe('Test API UP', function() {

  describe('Index ', function() {
    it('should response json', function (done) {
      request(sails.hooks.http.app)
        .get('/')
        // .send({ name: 'test', password: 'test' })
        .expect(200)
        .expect('location','/mypage', done);
    });
  });

});
