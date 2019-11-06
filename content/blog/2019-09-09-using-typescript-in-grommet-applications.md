---
title: Using TypeScript in Grommet Applications
date: 2019-09-09T18:08:08.659Z
author: Brittany Archibeque 
tags: ["Grommet"]
path: using-typescript-in-grommet-applications
---
![typescriptimage](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/typescriptimage-1568052628959.jpeg)

Recently, I spent time learning TypeScript, a typed superset of JavaScript that offers optional static type-checking along with the latest ECMAScript features. TypeScript can be pretty painful to wrap your head around, given the breadth of its capabilities. But I found that TypeScript has many benefits. For instance, declaring types as you write your application, whether they are a number, string, array, or function, can save developers time by catching problems early in the development process. And, if you are maintaining a project with others using TypeScript, it will cut down on runtime because you are able to surface bugs during compilation. In this tutorial, I will introduce you to how to get started with TypeScript within the confines of a React and Grommet project. 

## Step 1

To get started, you might want to check out another blog in which Ian Bovard does a great job going step-by-step in helping you install Grommet into your Create React application - [Using Your First Grommet Component with Create-React-App.](https://developer.hpe.com/blog/using-your-first-grommet-component-with-create-react-app) You can add TypeScript to any of your projects, at any point, if this is something you’d like to try. 

## Step 2 

Assuming you already have a Grommet app, to add TypeScript to your Grommet application, all you need to do is cd into that project and run the following command. 


```
yarn add typescript @types/node @types/react @types/react-dom @types/jest

``` 
Or, if you are using npm, then use this instead:


```

npm install –save typescript @types/node @types/react @types/react-dom @types/jest

```
## Step 3 

Once you’ve added TypeScript to the Grommet application, you can pick up where Ian talks about the App.js in regards to the Heading component. 

As you go through your files, change the App.js to App.tsx. This will trigger the use of TypeScript.


![screen shot 2019 09 09 at 12.22.30 pm](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/screen-shot-2019-09-09-at-122230-pm-1568053417737.png)

Following my own suggestion for this example, I will start with the Heading component that was used in [Ian’s blog:](https://developer.hpe.com/blog/using-your-first-grommet-component-with-create-react-app)


```

import React from "react";
import { Grommet, grommet, Heading } from "grommet";
function App() {
  return (
    <Grommet className="App" theme={grommet}>
      <Heading level='1'>TypeScript Rocks</Heading>
    </Grommet>
  );
}

export default App;

```

As shown in Ian’s blog, each component has its own props. In the Grommet project, these props have been declared in their own TypeScript files to define the types that should be accepted by each prop. 

Let’s try and break a few things to make sure that the types are being checked correctly. The Heading component has various props you can manipulate, including things like size, color, level, and margin. You can change these props to fit your specific design requirements. In this example, we will change the level prop of the Heading component. It accepts a number from 1-6 or a string containing a number 1-6. If we were to use a string that passed in the word “small”, this should give us a TypeScript error.  


![screen shot 2019 09 09 at 12.16.50 pm](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/screen-shot-2019-09-09-at-121650-pm-1568053104287.png)

The great thing about TypeScript is that when you have an error, you can hover over it and it will explain the type options that can be accepted, as well as what was given. In this example, we received an error that stated 



![screen shot 2019 09 12 at 9.35.44 am](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/screen-shot-2019-09-12-at-93544-am-1568737040433.png)

As you can see, the error was very clear in stating what prop types were expected and what was given. This shows what broke the project, so the level prop can be changed back to “1”. Once this is changed, you will see the error disappear without having to debug the whole application!  


![screen shot 2019 09 09 at 12.27.38 pm](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/screen-shot-2019-09-09-at-122738-pm-1568053721635.png)

See what happens after I’ve made the change?
Yay! The error has disappeared!

Through this very simple TypeScript error example, you can see how using TypeScript can save a developer a lot of time debugging. Imagine if someone was not using TypeScript in their project. If the string “small” was passed to the Heading level prop, it would not have immediately been recognized as an error. Although you can do a prop check using [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) in React, errors are only caught at runtime. Using TypeScript allows you to see the error while you’re developing an application, catching them as you compile. However, it is good practice to use both PropTypes as well as TypeScript to check for errors.

Using TypeScript is particularly advantageous when you are onboarding someone new onto a project. The team can rest assured that no matter what new code is added, the new developer will need to follow the established types, making it harder to introduce new mistakes in a code base the developer may not be as familiar with. 

For more help, each component in Grommet has an index.d.ts file that contains all of the prop types for each specific component. Another easy way to quickly interact with Grommet and TypeScript can be found in the [Grommet sandbox](https://codesandbox.io/s/grommet-ts-ugq2y) the team put together to help developers who are using TypeScript.

Lately, more and more users have been incorporating TypeScript into their Grommet projects because it helps them find errors faster and results in cleaner code. The team continuously tries to make it easier for TypeScript users to use Grommet. If you run into any problems with what I described above or have any additional suggestions, please check out the resources listed below. 

Resources: 

* [Grommet Github](https://github.com/grommet/grommet)

* [Grommet Slack](https://slackin.grommet.io/)

* Once you have joined our Grommet Slack be sure to check out the #typescript channel
