const assert = require('assert');
const app = require('../../src/app');

describe('\'direction\' service', () => {
  it('registered the service', () => {
    const service = app.service('direction');

    assert.ok(service, 'Registered the service');
  });
});
