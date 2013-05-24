# cloudmine-project #
This is a little project I was asked to do for an interview. The assignment was to create a web service that would run arbitray Javascript. I also had to make web page to drive the service.

## Running the Project ##
I'm assuming a UNIX enviornment for these instructions. Replace folder separaters appropriately for your platform.

### Prerequisits ###
You'll need to have [nodejs](http://nodejs.org) and [git](http://git-scm.com/) installed.

### Prepare your Environment ###
1. Clone the repository using git.
2. Using a terminal, navigate to the top level folder of the project.
3. Run `npm install` to get the required node modules.
4. Run `./node_modules/less/bin/lessc ./public/css/content.less > ./public/css/content.css` to generate the CSS.
5. Navigate into the `server` directory.
6. Run `node server.js`

### Play Around ###
You should now be able to navigate to localhost:8080 and play around with the application.

## Implementation Details ##

### Client ###
The client is made up of a single HTML page, index.html. This page contains the controls to interact with the application. In the main tab, Applications, you have the ablitity to write code snippets in javascript in the upper left hand textarea and run them on the server by using the 'Run' button. The output of the execution will be shown in the lower textrea. 

You can also save off code snippets by using the 'Save' button. If you choose not to name the snippet, it will be entered in the snippet list, on the right, as No Name.

You can also upload Javascript or text files from your computer with the 'Upload' button and have the code therein placed in the input box.

The information in the other tabs is just stubbed. There were no further requirements for those areas.

### Server ###
The server was built on nodejs. It accepts three types of requests:

1. GET requests for static files
2. POST requests for javascript execution
3. POST requests for file upload

To manage the static file requests I'm using a node module called [static](https://github.com/cloudhead/node-static). I pass the request into its serve method and it handles the work of located the files based on a WEBROOT and passing them into the response.

For javascript execution, I take in the request and evaluate it using Javascript's `eval` method. I store the output in a variable and attempt to write it into the response. If no return value was given for the execution, I write <No output> into th response.

To handle file uploads I'm using another node module called [formidable](https://github.com/felixge/node-formidable). I pass any multipart form request through formidable's parse method. This reads in any file and saves it locally to the server. I then use the node module fs, part of the standard installation of node, to read back that file and write its contents into the response. If the file is not one of the types accepted by the server (either Javascript or text at this point), the server responds with a 415, unsupported media type, error code.

When any other request method is attempted, the server responds with a 405, method not allowed, error code.

## Future Considerations ##

### Client ###

#### Snippets ####
First of all, the naming requirements for the snippets is very relaxed. Every snippet can have the same name and the system doesn't really care. An improvement here would be to have some sort of uniqueness checking on the names. The autonaming would also have to improved to account for this.

Snippets also don't save during a user's session. If they refresh the page or open it in a new tab, the snippets they had written will have been erased. An improvement here could be using HTML5 local storage to save the snippets on the user's machine. An actual user framework could also be hooked up so that many users could save off snippets and have them stored on the server. Then, even after local storage has expired, the snippets would be grabbed from the server and shown.

#### File Handling ####
The system doesn't care right now what type of file a user wants to send to the server and has no size constraints. In the future an MIME-Type check should be implemented to make sure the user isn't trying to upload a PDF to be parsed by the server. For performance purposes the upload size should be limited to a standard size, say 100kb.

### Server ###
In doing this project I came across the situation where calling `console.log()` wouldn't print antyhing out to the client. This was expected, given that `console.log()` doesn't return anything, but I questioned whether or not console output should be written to the response. After doing some investigation with other arbitrary Javascript executors I've decided that that isn't being done anywhere else. While it might be nice to implement, it isn't necessary in order to have feature parity with other products.

#### Security ####
The biggest problem the server faces right now is that the arbitray code coming from the client could be malicious. The code being executed has full access to the full node stack. Knowledge of the server implementation could allow a malicious user to attack responses, spawn new servers, or any other number of things. The best way to combat this would be to make an execution environment for the uploaded Javascript, where the user doesn't have access to anything node related.