var http = require('http'),
	url = require('url'),
	static = require('node-static');

var webroot = '../public',
	routes = {
		EXECUTE: '/execute',
		UPLOAD: '/upload'
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
		data += chunk.toString();
	});

	request.on('end', function() {
		if (request.url === routes.EXECUTE) {
			if (request.method === methods.POST) {
				response.writeHead(statuses.OK, {
					'Content Type': 'text/plain'
				});
				try {
					var evaluation = eval(data);
					response.write(evaluation ? evaluation.toString() : '<No output>');	
				} 
				catch(e) {
					response.write(e.toString());
				}
			} 
			else {
				response.writeHead(statuses.METHOD_NOT_ALLOWED, {
					'Content Type': 'text/plain'
				});
				response.write('405: Method not allowed');
			}
			response.end();
		}
		else if (request.url === routes.UPLOAD) {
			if (request.method === methods.POST) {
				response.writeHead(statuses.OK, {
					'Content Type': 'text/plain'
				});
				response.write('File upload not implemented yet.');
			}
			else {
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
					response.writeHead(error.status, error.headers);
					response.write(error.status + ': ' + error.message);
					response.end();
				}
			});
		}
	});
}

http.createServer(onRequest).listen(8080);