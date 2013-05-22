var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	static = require('node-static');

var webroot = '../public',
	routes = {
		INDEX: '/',
		EXECUTE: '/execute'
	},
	statuses = {
		OK: 200,
		NOT_FOUND: 404,
		METHOD_NOT_ALLOWED: 405
	},
	methods = {
		POST: 'POST'
	},
	file = new(static.Server)(webroot, {
		cache: 600
	});

function onRequest(request, response) {
	var data = '';

	request.on('data', function(chunk) {
		console.log('Received body data: ' + chunk.toString());
		data += chunk.toString();
	});

	request.on('end', function() {
		if (request.url === routes.EXECUTE) {
			if (request.method === methods.POST) {
				console.log(request.url + ' ' + statuses.OK)
				response.writeHead(statuses.OK, {
					'Content Type': 'text/plain'
				});
				try {
					var evaluation = eval(data);
					response.write(evaluation.toString());	
				} 
				catch(e) {
					response.write(e.toString());
				}
			} 
			else {
				console.log(request.url + ' ' + statuses.METHOD_NOT_ALLOWED)
				response.writeHead(statuses.METHOD_NOT_ALLOWED, {
					'Content Type': 'text/plain'
				});
				response.write('405: Method not allowed');	
			}
			response.end();
		}
		else {
			file.serve(request, response, function(error, result) {
				if (error) {
					console.log(request.url + ' ' + error.status);
					response.writeHead(error.status, error.headers);
					response.write(error.status + ': ' + error.message);
					response.end();
				}
				else {
					console.log(request.url + ' ' + result.status);
				}
			});
		}
	});
}

http.createServer(onRequest).listen(8080);
console.log('Server has started');