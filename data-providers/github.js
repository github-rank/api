const GithubApi = require('github');
const config = require('config');

const githubProvider = new GithubApi({
    debug: config.get('providers.github.debug'),
    protocol: config.get('providers.github.protocol'),
    host: config.get('providers.github.host'),
    pathPrefix: config.get('providers.github.path-prefix'),
    headers: config.get('providers.github.headers'),
    followRedirects: config.get('providers.github.follow-redirects'),
    timeout: config.get('providers.github.timeout'),
    promise: require('bluebird')
});

module.exports = githubProvider;
