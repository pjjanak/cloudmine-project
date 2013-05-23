# cloudmine-project #

This is a little project I was asked to do for an interview. The assignment was to create a web service that would run arbitray Javascript. I also had to make web page to drive the service.

## Running the Project ##
I'm assuming a UNIX enviornment for these instructions. Replace folder separaters appropriately for your platform.
### Prerequisits ###
You'll need to have [nodejs](http://nodejs.org) and [git](http://git-scm.com/) installed.
### Prepare your Environment ###
1. Clone the repository using git.
2. Using a terminal, navigate to the top level folder for the project.
3. Run `npm install` to get the required node modules.
4. Run `./node_modules/less/bin/lessc public/css/content.less > public/css/content.css` to generate the CSS.
5. Navigate into `server`.
6. Run `node server.js`
### Play Around ###
You should now be able to navigate to localhost:8080 and play around with the application.
