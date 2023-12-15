---
title: "Dark Mode Theming in Grommet - Part 1: How to set up and apply a theme"
date: 2020-10-14T07:50:10.733Z
featuredBlog: false
priority: null
author: Matt Glissmann
authorimage: /img/blogs/Avatar6.svg
thumbnailimage: null
tags:
  - grommet
  - opensource
---
![darkmode intro part1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/darkmode-intro-part1-1603293464825.png)

This post is Part 1 of a three-part series.

* Part 1 - How to set up and apply a theme
* [Part 2 - Adding dark and light theme modes](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-adding-dark-and-light-theme-modes/)
* [Part 3 - Theme color customization](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-theme-color-customization/)

As a UI/UX developer at HPE, I use [Grommet](https://grommet.io) extensively. I am also a regular contributor on the [Grommet Slack](https://grommet.slack.com) channels where the Theming capabilities, especially Grommet’s support for light and dark modes, are a consistent topic of interest. 

[Grommet](https://grommet.io) has robust support for light and dark themes. Due to the apparent interest in this topic, I thought I’d share my approach on how to get started with theme mode styling in [Grommet](https://grommet.io). 

To illustrate the method I use, I’m going to create a simple application demonstrating the ability to toggle between light and dark modes. By the end of this 3-part blog series, I will have demonstrated how to:

* Apply a theme in a Grommet application
* Incorporate dark and light theme modes
* Modify a theme to apply custom colors in dark and light modes

The final product will be a simple application with a custom theme applied and the ability for a user to toggle between the app’s light and dark modes.

<img src="https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/themetutorialapp-1602698870239.gif" style="height:300px, width:300px" />

# Setup for the tutorial

## Prerequisites

This tutorial assumes familiarity with HTML, JavaScript, and React. However, even if any of these are new to you, you should be able to follow along and complete the exercise.

## Get the Starter Code

Open this [starting code](https://codesandbox.io/s/grommet-theme-toggle-0starter-1k1cv?file=/src/App.js) in your browser. Create your own copy by clicking 'Fork' from the menu in the upper right corner. The starter app will look like this:

<img src="https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/picture-2-1602661773922.png"  />

## Starter Code Orientation

### Development Environment

For this tutorial, I’m using [Codesandbox](https://codesandbox.io/) as the development environment. [Codesandbox](https://codesandbox.io/)  presents the user with: 

* An interface for the project’s file and directory structure
* A text editor for editing files
* A browser window to view and interact with the application

### Project Structure and Dependencies

The project structure mimics a minimal Create React App (CRA) structure and is organized like so:

* /public

  * index.html (this gets loaded by the browser and is what renders src/index.js)
* /src

  * index.js (This is the project’s root file. I won’t be modifying it.)
  * App.js
  * DemoSection.js (This is a component I will use later in the tutorial)
* Package.json (Create React App ships with `react`, `react-dom`, and `react-scripts` as dependencies. Additionally, I’ve added `grommet` and its peer dependency, `styled-components`, to the starter project.)

### App.js

For this tutorial, most of the development will happen in App.js. The App.js file consists of three parts; imports, projectTasks array, and the App component.

Import of React and Grommet components:

```javascript
import React from "react";
import { Grommet, Anchor, Box, List, Heading, Paragraph, Text } from "grommet";
```

`projectTasks` array with the tasks to be implemented

```javascript
const projectTasks = [
 "Apply a Theme - Add an existing theme to provide some styling",
 `Add Theme Toggle Button - Add a button, which when clicked,
 will toggle the theme between light and dark modes`,
 "Customize Theme - Add custom colors to theme"
];
```

The `App` is composed of the following Grommet components:

* `<Grommet>` is the top level Grommet container
* `<Box>` for some basic page layout
* For the page’s content, I have `<Heading>`,`< Paragraph>`, and `<List>` which iterates over the `projectTasks` array, returning a `<Text>` component for each task.

```javascript
const App = () => {
 return (
   <Grommet full>
     <Box gap="small" pad="large" align="start">
       <Heading level="1">Hello Grommet Theme Toggle</Heading>
       <Paragraph>
         This is the first step in a <Anchor href="#">theming tutorial</Anchor>{" "}
         using Grommet.
       </Paragraph>
       <Paragraph>We will be modifying this project to:</Paragraph>
       <List data={projectTasks}>
         {(task, index) => (
           <Text key={index}>
             {index + 1}) {task}
           </Text>
         )}
       </List>
     </Box>
   </Grommet>
 );
};

export default App;
```

# Applying a Theme

To provide some initial styling, I’ll apply the `grommet` theme. In Part 3 of this series, I will show you how to customize and incorporate a custom theme.

In App.js, import and apply the Grommet theme:

Import grommet theme

```javascript
 import { grommet } from "grommet"; 
```

Apply it by adding `theme={grommet}` to the Grommet component.

```javascript
 <Grommet full theme={grommet}>
```

![matt1-picture 3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/picture-3-1602661789429.png)

![matt1-picture 4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/picture-4-1602661802053.png)

Your code and resulting app should resemble this [Codesandbox](https://codesandbox.io/s/grommet-theme-toggle-1adding-theme-rg91i?file=/src/App.js), and the app’s UI should have updated with the applied theme. 

At this point, you now have an understanding for how to apply a theme to a Grommet app. This is the foundation from which we will build custom theming. In my next post, I will show you how to add dark/light theming and give users control over toggling between theme modes. In my final post, I will wrap up with a how to customize a theme with custom dark and light mode colors.

Stay tuned to the [HPE DEV blog](/blog) to catch Parts [2](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-adding-dark-and-light-theme-modes/) and [3](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-theme-color-customization/) of this series. If you have any questions, please feel free to reach out to me and others in the Grommet group on our [Slack channel](https://app.slack.com/client/T04LMHMUT/C04LMHN59).