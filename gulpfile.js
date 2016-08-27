var tr = require('tor-request');
var gulp = require('gulp');
var low = require('lowdb');
var _ = require('lodash');
var Promise = require("bluebird");
const db = low('data/db.json');

db.defaults({ users: [] }).value();

var callStack = 0;

tr.TorControlPort.password = 'p99ux45r';

function getReposByUser(name, cease) {
	console.log('getting repos:', name);
	return new Promise((resolve, reject) => {
		if (callStack < 10) {
			const user = db.get('users').find({ name: name }).value();
			if (user&&cease) {
				reject('user already saved');
			} else {
				callStack++;
				tr.request({ 
					url: 'https://api.github.com/users/' + name + '/repos',
					headers: {
		    			'User-Agent': 'Chrome/43.0.2357.65'
		  			}
		  		}, (err, res, body) => {
		  			if (!err && res.statusCode == 200) {
		  				const repos = JSON.parse(body);
		  				db.get('users').push({
		  					name: name,
		  					repos: repos
		  				}).value();
		  				resolve(repos);
		  			} else {
		  				console.log(err, res.statusCode);
		  				reject(err, res);
		  			}
		  		})
		  	}
		} else {
			console.log('callstack: ', callStack);
			tr.newTorSession((err, result) => { 
				if (err) console.log(err); 
				console.log(result);
				callStack = 0;
				getReposByUser(name).then((repos) => resolve(repos), (err) => reject(err, res));
			})
		}
  	})
}

function getContributorsByRepo(repo) {
	console.log('getting contributors: ', repo.full_name);
	return new Promise((resolve, reject) => tr.request({ 
    				url: repo.contributors_url,
    				headers: {
    					'User-Agent': 'Chrome/43.0.2357.65'
  					}
  				}, (err, res, body) => {
  					if (!err && res.statusCode == 200) {
  						resolve(JSON.parse(body));
  					} else {
  						console.log(err, res.statusCode);
  						reject(err, res);
  					}
  				}))
}

gulp.task('default', function() {
	
	getReposByUser('yalovek', false)
		.then((repos) => 
			repos.forEach((repo) => 
				getContributorsByRepo(repo).then((users) => 
					users.forEach((user) => 
						getReposByUser(user.login, true).then((repos) => 
							console.log('user: ', user.login, 'repos: ', repos.length),
							(err) => console.log(err)
						)
					),
					(err) => console.log(err)
				),
				(err) => console.log(err)
			),
			(err) => console.log(err)
		);
});

gulp.task('count', function() {
	var users = db.get('users').value();
	users.forEach((user) => {
		console.log(user.name);
		user.repos.forEach((repo) => console.log('     ', repo.name));
	})
});

gulp.task('uniq', function() {
	var users = db.get('users').value();
	db.set('users', _.uniqBy(users, 'name')).value();
});
