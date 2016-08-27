'use strict';

const github = require('../../data-providers/github');
const vow = require('vow');

describe('github', () => {
    let sandbox = null;

    beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getUser', () => {
        it('should get github user successful', (done) => {
            sandbox.stub(github._githubProvider.users, 'getForUser', () => {
                return vow.resolve(require('./stubs/getUser/success.json'));
            });
            github.getUser('test')
                .then(result => {
                    assert.isObject(result);
                    done();
                })
                .fail(err => {
                    done('should be success');
                });
        });

        it('should get github user with error', (done) => {
            sandbox.stub(github._githubProvider.users, 'getForUser', () => {
                const error = new Error('Not Found');
                return vow.reject(error);
            });
            github.getUser('no-fuckin-existing-user')
                .then(result => {
                    done('should be fail');
                })
                .fail(err => {
                    assert.isNotNull(err);
                    done();
                });
        });
    });

    describe('getUserRepos', () => {
        it('should get repos for user successful', done => {
            sandbox.stub(github._githubProvider.repos, 'getForUser', () => {
                return vow.resolve(require('./stubs/getUserRepos/success.json'));
            });
            github.getUserRepos('test')
                .then(result => {
                    assert.isArray(result);
                    done();
                })
                .fail(err => {
                    done('should be success');
                });
        });

        it('should get repos for user with error', done => {
            sandbox.stub(github._githubProvider.repos, 'getForUser', () => {
                return vow.reject(new Error('Not found'));
            });

            github.getUserRepos('test')
                .then(result => {
                    done('should be fail');
                })
                .fail(err => {
                    assert.isNotNull(err);
                    done();
                });
        });
    });

    describe('getRepoContributes', () => {
        it('should get contributes for repo successful', done => {
            sandbox.stub(github._githubProvider.repos, 'getContributors', () => {
                return vow.resolve(require('./stubs/getRepoContributes/success.json'));
            });

            github.getRepoContributes('test', 'test')
                .then(result => {
                    assert.isArray(result);
                    done();
                })
                .fail(err => {
                    done('should be success');
                })
        });

        it('should get repos for user with error', done => {
            sandbox.stub(github._githubProvider.repos, 'getContributors', () => {
                return vow.reject(new Error('Not found'));
            });

            github.getRepoContributes('test')
                .then(result => {
                    done('should be fail');
                })
                .fail(err => {
                    assert.isNotNull(err);
                    done();
                });
        });
    });
});
