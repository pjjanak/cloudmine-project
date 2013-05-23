var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	static = require('node-static'),
	formidable = require('formidable');

var webroot = '../public',
	routes = {
		EXECUTE: '/execute',
		UPLOAD: '/upload'
	},
	statuses = {
		OK: 200,
		NOT_FOUND: 404,
		METHOD_NOT_ALLOWED: 405,
		UNSUPPORTED_MEDIA_TYPE: 415
	},
	methods = {
		POST: 'POST'
	},
	types = {
		JAVASCRIPT: 'application/x-javascript',
		PLAINTEXT: 'text/plain'
	}
	file = new(static.Server)(webroot, {
		cache: 600
	});

function onRequest(request, response) {
	if (request.url === routes.UPLOAD) {
		handleFileUpload(request, response);
	}
	else if (request.url === routes.EXECUTE) {
		handleExecuteRequest(request, response);
	}
	else {
		handleStaticRequest(request, response);
	}
}

function handleFileUpload(request, response) {
	if (request.method === methods.POST) {
		var form = new formidable.IncomingForm();
		
		form.parse(request, function(err, fields, files) {
			var file = files['upload-input'];

			if (file.type === types.JAVASCRIPT || file.type === types.PLAINTEXT) {
				fs.readFile(files['upload-input'].path, 'utf8', function(err, data) {
					response.writeHead(statuses.OK, {
						'Content Type': 'text/plain'
					});
					response.write(data);
					response.end();
				});
			}
			else {
				doErrorResponse(response, statuses.UNSUPPORTED_MEDIA_TYPE, statuses.UNSUPPORTED_MEDIA_TYPE + ': Unsupported media type.');
			}
		});
	}
	else {
		doErrorResponse(response, statuses.METHOD_NOT_ALLOWED, statuses.METHOD_NOT_ALLOWED + ': Method not allowed');
	}
}

function handleExecuteRequest(request, response) {
	if (request.method === methods.POST) {
		var data = '';

		request.on('data', function(chunk) {
			data += chunk.toString();
		});

		request.on('end', function() {
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

			response.end();
		});
	}
	else {
		doErrorResponse(response, statuses.METHOD_NOT_ALLOWED, statuses.METHOD_NOT_ALLOWED + ': Method not allowed');
	}
}

function handleStaticRequest(request, response) {
	file.serve(request, response, function(error, result) {
		if (error) {
			response.writeHead(error.status, error.headers);
			response.write(error.status + ': ' + error.message);
			response.end();
		}
	});
}

function doErrorResponse(response, errorCode, errorText) {
	response.writeHead(errorCode, {
		'Content Type': 'text/plain'
	});
	response.write(errorText);
	response.end();
}

http.createServer(onRequest).listen(8080);