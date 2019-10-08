---
title: Using HPE OneSphere Javascript Package
date: 2018-02-01T22:40:50.420Z
author: Alex Mejias 
tags: ["Javascript","HPE-OneSphere","GettingStarted","API"]
path: using-hpe-onesphere-javascript-package
---
# Summary

In previous articles we covered, [Getting Started with HPE OneSphere Programming](/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API](/blog/authenticating-against-hpe-onesphere-api). In these articles, we discovered HPE OneSphere's API through an essential API development tool known as Postman. In this article, we will cover the basics of the HPE OneSphere Javascript package by creating a Javascript application.

# Why Javascript
Javascript and Node have taken the development scene by storm. With the rise of front end tools such as Angular, React, and Vue, the web has become increasingly dynamic and interactive. Not only does Javascript allow for a richer front end experience, it also supports back end development. A single language which can produce front end and back end applications is a very powerful tool and probably a good reason why [62.5% of developers use Javascript as their primary language](https://insights.stackoverflow.com/survey/2017#technology) according to Stack Overflow's 2017 survey.

# Package Dependencies and NPM
When a developer [installs Node](https://nodejs.org/en/), it comes bundled with the Node Package Manager (NPM). NPM allows dead simple dependency management through a json file titled `package.json`. Let's run through the steps around creating a basic Javascript application, which can communicate with your HPE OneSphere instance.

# Starting the Project
Let's start by creating a new project directory I called mine `hpe-onesphere-js-app`. In your terminal window within this directory initiate your project by running `npm init -y`, the `-y` lets NPM know we want to accept whatever default project name value it chooses. After running the `init` command you will see an output similar to the following:
```json
{
  "name": "hpe-onesphere-js-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
These are the contents of your `package.json` file.

# Project Scaffolding
Our next step is to get our Node/Express API ready. In your project's directory, run the following command `npm i -S express babel-cli babel-preset-env`. This will install the express, babel-cli, and babel-preset packages, the `-S` lets NPM know these packages are project dependencies not just development dependencies. We will be using express as our web server. Babel-cli is used to allow us to include the latest Javascript syntax to our code. To learn more about why developers choose babel check out [this article](https://kleopetrov.me/2016/03/18/everything-about-babel/).

Our next step is to create a `.babelrc` in our base project directory, this file tells babel what extra features of the latest Javascript spec to include. We will be including the latest spec which will allow us to use imports, consts, and arrow functions in our project. To learn more about the latest Javascript syntax features, check out this [handy repo](https://github.com/lukehoban/es6features). The contents of our `.babelrc` should look like this:
```json
{
  "presets": ["env"],
  "plugins": []
}
```

Now, create an `index.js` file in your project folder. This will be the entry point for our project. Your index.js should look like the following:
```javascript
// Import the express npm package from our node_modules directory.
import express from 'express';

// Instantiate our express application.
const app = express();

// Create a GET route to our base url.
app.get('/', (req, res) => {
  res.send('Hello World');
})
 
// Listen for requests at a specified port, 3000.
app.listen(3000, () => {
  // Send a message to our terminal window that we're ready for action.
  console.log('Server listening to http://localhost:3000');
});
``` 
I've added comments in the code to clarify what each line of code is doing to help create our application. Save your `index.js` file and open your terminal. In the project directory, run `npx babel-node index.js`, this runs our current application in Node. We're running our application in babel-node to transpile the latest Javascript features to lower versions of Javascript on the fly. *Note: babel-node is being used here for demonstration purposes and ease of use, babel-node should not be used in production. Instead a developer would look to transpiling their Javascript to a distribution bundle via [Webpack](https://webpack.js.org/).*

Upon running the babel-node command you should see `Server listening to http://localhost:3000` output in your terminal - Success! Now, to interact with your project open a web browser window and goto the URL `http://localhost:3000`. You should see our `Hello World` message. This is the `app.get` request from our `index.js` responding to a route request of `/`. In your terminal terminate the server task by pressing `ctrl + c`.

# NPM Scripts
Now that we've learned how to run our project, let's look at a quicker method of handling spinning up our application. In your `package.json` file, in the `"scripts"` key, let's add the script  `"start": npx babel-node index.js`. Your `package.json` should look like this:
```json
{
  "name": "hpe-onesphere-js-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npx babel-node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-es2015": "^6.24.1",
    "express": "^4.16.2"
  }
}
```
Now we can run our project by simply typing `npm start` in our terminal.

# Time to OneSphere
We'll start by adding the HPE OneSphere Javascript language bindings to our app by running `npm i -S npm i @hpe/hpe-onesphere-js` in our terminal. Once the package has been installed open your `index.js`. Next, we will add the OneSphere package with the following import statement:
```
import OneSphere from '@hpe/hpe-onesphere-js';`
```
Then instantiate the class with our host name.
```javascript
const oneSphere = new OneSphere('https://my-instance-name.hpeonesphere.com');
```

Now that we have our `oneSphere` class instance we can start to communicate with our remote server.

# Sessions
Most requests to OneSphere's API require the user to post  session details. We accomplish this by calling the `postSession` method, this will initiate a session in our class that will be re-used every time we make a request. Just below your `oneSphere` instantiation, add a request to post a session.
```javascript
oneSphere.postSession({
  username: 'user@email.com',
  password: 'myPassword'
}).then((sessionDetails) => console.log('OneSphere session details:', sessionDetails));
```
If you run `npm start` in your terminal now you should see a message logged to your console with your session details, this includes your `token` and `userUri`. Now whenever we need to access our session details, we can call the `oneSphere.getSession()` method. Session details will be an important tool for making authenticated requests.

# A Real Live API Route
The finish line is in sight, an OneSphere API route for our app. Let's create a route to check the OneSphere server status. Below your hello world route add the following:
```javascript
app.get('/onesphere-status', (req, res) => {
  oneSphere.getStatus()
  .then(myStatus => res.send(myStatus));
});
```
If we `npm start` our app and check the `http://localhost:3000/onesphere-status` URL in our browser, we should see the following JSON output:
```json
{
  "service": "OK",
  "database": ""
}
```
Well there it is, the service is running and we have successfully created an HPE OneSphere express application!

# Error Handling
This is great and all but what about when we get an error during our API request? Javascript has a great way of handling promise chain failures known as a `catch` statement. Let's add a `catch` to our server status route.
```javascript
app.get('/onesphere-status', (req, res) => {
  oneSphere.getStatus()
  .then(myStatus => res.status(200).send(myStatus))
  .catch(err => res.status(400).send(err));
});
```
With `catch` in place if an error happens in the `then` block `catch` will takeover and handle things from there. Notice we introduced sending the HTTP response code with `status`. This is very helpful when communicating with an API from a front end application, as the developer can decide what to do based on the response code not just the content of the response body.

Here's our final application:
```javascript
// Import the express and HPE OneSphere package from our node_modules directory.
import express from 'express';
import OneSphere from '@hpe/hpe-onesphere-js';

// Instantiate our express application.
const app = express();
// Instantiate our OneSphere module.
const oneSphere = new OneSphere('https://my-instance-name.hpeonesphere.com');

// Start my authenticated OneSphere session.
oneSphere.postSession({
  username: 'user@email.com',
  password: 'myPassword'
}).then((sessionDetails) => console.log('OneSphere session details:', sessionDetails));

// Create a GET route to our base url.
app.get('/', (req, res) => {
  res.send('Hello World');
})

// Check OneSphere's server status.
app.get('/onesphere-status', (req, res) => {
  oneSphere.getStatus()
  .then(myStatus => res.status(200).send(myStatus))
  .catch(err => res.status(400).send(err));
});

// Listen for requests at a specified port, 3000.
app.listen(3000, () => {
  // Send a message to our terminal window that we're ready for action.
  console.log('Server listening to http://localhost:3000');
});
```

# Next Steps
What's next? We've posted a helpful [HPE OneSphere interactive API guide](https://developer.hpe.com/api/onesphere/) right here on our Developer Portal. Use this guide to learn which routes your application can use. And if you're already an HPE OneSphere customer, simply use the `https://my-instance-name.hpeonesphere.com/docs/api/` URL to see your own fully interactive API guide.