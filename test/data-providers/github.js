'use strict';

const github = require('../../data-providers/github');
const vow = require('vow');

describe('github', () => {
    let sandbox = null;
    describe('getUser', () => {
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should get github user successful', (done) => {
            sandbox.stub(github._githubProvider.users, 'getForUser', () => {
                return vow.resolve(require('./stubs/getUser/success.json'));
            });
            github.getUser('test').then(result => {
                assert.isObject(result);
                done();
            });
        });
    });
});
