---
title: "Using Your First Grommet Component with Create-React-App"
date: 2019-05-10T15:27:12.417Z
author: Ian Bovard 
tags: ["Grommet"]
path: using-your-first-grommet-component-with-create-react-app
---
In this tutorial, I will walk you through the steps it takes to set up your first grommet component using create-react-app.

## Prerequisites

This tutorial assumes that you have node.js and a package manager; either npm (npm is installed with node.js) or yarn package manager. Create react app can be installed globally or locally using npx (npx comes with npm 5.2+).

[Node Download Page](https://nodejs.org/en/download/) - The latest LTS version will have node.js, npm, and npx.  
[Create React App Local Install](https://facebook.github.io/create-react-app/docs/getting-started) - Instructions to install it locally can be found here (npm versions 5.2+).  
[Create React App Global Install](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f) - Instructions to install it globally can be found here (npm versions 5.1 or earlier).  
[Yarn Package Manager - *Not Required*](https://yarnpkg.com/en/docs/getting-started) - I use yarn as my primary package manager, however npm will work fine for this tutorial.
## Clean-up

Create and name your application with create-react-app. Then navigate into the folder of your newly created application and open it with the editor of your choice.

*If you have create-react-app installed globally,*


```bash
create-react-app grommet-rules
cd grommet-rules
```

*or if you use npx.*


```
npx create-react-app grommet-rules
cd my-app
```

Once inside, delete the files `App.css`, `App.test.js`, `index.css`, and `logo.svg` that are located in the src folder. These files will not be used in this tutorial.

*Delete the highlighted files.*


![5bf2e1a0cd93d0796238ae01-blog-content-1557502375030](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/deletethese-1557502375028.png)

All associated imports and components in index.js and App.js must be deleted as well.

> In App.js, delete the highlighted imports and header component.

![5bf2e1a0cd93d0796238ae01-blog-content-1557502556519](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/delete-app-1557502556518.png)

> In index.js, delete the highlighted import.

![5bf2e1a0cd93d0796238ae01-blog-content-1557502646696](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/delete-index-1557502646695.png)

Your `App.js` file should look like this,


```jsx
import React from 'react';
function App() {
  return (
    <div className="App">
    </div>
  );

}
export default App;

```

and your `index.js` file should look like this.


```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
```

**It's sanity check time!**   
Run your application with


```bash
yarn start
```

or


```bash
npm start

```

>When you run your application, do you see a blank screen? Yes? Cool!  
>When you add text to `App.js`, is it visible on the screen? Yes? Rad! It's time to move on.

## Set-up

Install the grommet packages and dependencies using a package manager of your choice.


```bash
yarn add grommet grommet-icons styled-components
```

or


```bash
npm install grommet grommet-icons styled-components --save
```

You will not be using grommet-icons and styled-components in this tutorial, but if you would like to keep using this application to practice using grommet in the future, it would be best if you installed them now.

A requirement for grommet is to import it and use it as a top-level node. You can do this in `App.js`.

*In `App.js`, import grommet and replace the div component with the Grommet component. Your app is now ready to use all that grommet has to offer.*


```jsx
import React from 'react';
import { Grommet, Heading } from 'grommet'
function App() {
  return (
    <Grommet className="App">
    </Grommet>
  );

}
export default App;
```

## Using Your First Component

Grommet components, such as Heading, can be imported and included in very much the same way as you did in the previous step.

*In `App.js`, import the Heading component, put it within the Grommet component, and add some text.*


```jsx
import React from 'react';
import { Grommet, Heading } from 'grommet'
function App() {
  return (
    <Grommet className="App">
      <Heading>
        Please work!
      </Heading>
    </Grommet>
  );

}
export default App;
```

> It's sanity check time, yet again:  
Is the text visible in your application? Yes? It's time to work with properties!

## Props

Properties can be used to position and style your grommet components. The Heading component has two properties, color and size, that you can manipulate.

*In `App.js`, within your Heading component add the properties color and size, and give them values.  
Detailed information on how the properties of each component can be modified can be found at [grommet components docs](https://v2.grommet.io/components).*


```jsx
import React from 'react';
import { Grommet, Heading } from 'grommet'
function App() {
  return (
    <Grommet className="App">
      <Heading
        size='large'
        color='#00739D'
      >
        I've Mastered Grommet!
      </Heading>
    </Grommet>
  );

}
export default App;

```

It's time to check your work.


![5bf2e1a0cd93d0796238ae01-blog-content-1557503147092](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/tutorialcomplete-1557503147092.png)

*Maybe, dial it back a bit.*

## Resources

You've created your grommet playground and all there is left to do is practice. Here are a few resources that I have found helpful when I first began familiarizing myself with grommet.

[Grommet Components Docs](https://v2.grommet.io/components) - This is useful for when you want information on each individual component, the properties that they have, and the default and accepted values for each property.

[Grommet Github](https://github.com/grommet/grommet) - It's always important to dig through the closed and open issues for any solutions not covered in the docs.

[Grommet Slack Inviter](http://slackin.grommet.io/) - When I've exhausted all my resources, the grommet community is eager to help and quick to answer.
