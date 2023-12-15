---
title: "Dark Mode Theming in Grommet - Part 2: Adding dark and light theme modes"
date: 2023-12-15T15:46:57.782Z
featuredBlog: false
priority: null
author: Matt Glissmann
authorimage: /img/blogs/Avatar1.svg
thumbnailimage: null
tags:
  - Grommet
  - theme
  - mode
  - opensource
---
![f1lightdark2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/f1lightdark2-1603286799167.png)

In [Part 1](/blog/dark-mode-theming-in-grommet-how-to-set-up-and-apply-a-theme) of this 3-part series on Grommet’s support for light and dark modes, I covered setting up a simple Grommet app and applying a theme to that app. Here in Part 2, I’ll guide you through the steps required to implement dark/light theme modes. At the conclusion of this post, the app will have some basic UI components and a control to toggle the interface between light and dark modes.

* [Part 1 - How to set up and apply a Theme](/blog/dark-mode-theming-in-grommet-how-to-set-up-and-apply-a-theme)
* Part 2 - Adding dark and light theme modes
* [Part 3 - Theme color customizations](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-theme-color-customization/)

In this post, I’ll cover content regarding adding a theme toggle button, including:

* Introducing the `themeMode` prop, which allows specifying which version of the theme the app renders.
   
* Adding a button to the interface to serve as a control to toggle the value that gets passed to `themeMode`. 

![f10thememodetoggle](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/f10thememodetoggle-1603286872853.gif)

## Adding a Theme Toggle Button

For this exercise, you’ll continue modifying your app from the example you created in Part 1 of this series.  If you are catching up and joining midstream, you can reference this [Codesandbox](https://codesandbox.io/s/grommet-theme-toggle-1adding-theme-rg91i?file=/src/App.js).

First, I’m going to show you how to add a button that, when clicked, will toggle the theme between light and dark modes.

In App.js:

Add the ***[themeMode](https://v2.grommet.io/grommet#themeMode)*** prop to the `<Grommet>` component and set its value to `"dark"`. The value referenced by `themeMode` specifies whether Grommet should use the dark or light versions of the theme.

```javascript
  <Grommet full theme={grommet} themeMode="dark">
```

This should result in:

![f4part 2 toggle](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/f4part-2-toggle-1603286827841.png)

Next, add a button to serve as the toggle control.

Import `Button` as a component from Grommet

```javascript
import { Grommet, Anchor, Box, Button, List, Heading, Paragraph, Text } from "grommet";
```

Below the `<List>`, add a theme toggle button with some formatting props and an `onClick` handler.

```javascript
  <Button
    label="Toggle Theme"
    primary
    alignSelf="center"
    margin="large"
    onClick={() => {}} 
  />
```

## Enable Toggling of ThemeMode’s State

Next, make the theme mode dynamic by adding a variable `darkMode` to hold the current theme mode, storing it in the component’s state, and adjusting the state each time the theme toggle button is clicked.

Create variable `darkMode` and its state using React’s [`useState` Hook](https://reactjs.org/docs/hooks-state.html).

```javascript
const App = () => {
 const [darkMode, setDarkMode] = React.useState(false);
  return (
   <Grommet full theme={grommet} themeMode="dark">
```

Modify the button’s `onClick` handler to toggle `darkMode` between `true` and `false`.

```html
<Button
    label="Toggle Theme"
    primary
    alignSelf="center"
    margin="large"
    onClick={() => setDarkMode(!darkMode)}
  />
```

Next, replace `themeMode`’s value to be “dark” when `darkMode` is true, and “light” when `darkMode` is false.

```javascript
<Grommet full theme={grommet} themeMode={darkMode ? "dark" : "light"} >
```

The theme mode toggling should be good to go. Give the toggle button a few clicks!

![f2thememodetogglemid](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/f2thememodetogglemid-1603286807584.gif)

## Incorporating More Visual Interest

Finally, to better demonstrate a changing theme, let’s add some more interesting visuals to the application.

Remove the following from App.js

```javascript
   <Paragraph>We will be modifying this project to:</Paragraph>
    <List data={projectTasks}>
      {(task, index) => (
        <Text key={index}>
          {index + 1}) {task}
        </Text>
      )}
    </List>
```

Then, import the DemoSection from `DemoSection.js` and add it below the toggle button. DemoSection contains a sampling of Grommet components to better demonstrate the effect themeMode has across components.

```javascript
  import { DemoSection } from "./DemoSection";	
```

Then add DemoSection directly beneath this button.

```javascript
      <Button
         label="Toggle Theme"
         primary
         alignSelf="center"
         margin="large"
         onClick={() => setDarkMode(!darkMode)}
       />
       <DemoSection />
```

At this point, your code and resulting app should resemble what is shown in this [Codesandbox](https://codesandbox.io/s/grommet-theme-toggle-2addtogglebutton-txbux?file=/src/App.js).

![f14part 2 non animated white theme toggle](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/f14part-2-non-animated-white-theme-toggle-1603286900031.png)

As quick review, here’s what we’ve done to modify the app:

* Added `themeMode` as a prop on the `<Grommet>` component. The value provided to `themeMode` specifies which mode of the theme to use.
   
* Created a state variable called `darkMode` to store whether the theme should currently be in dark mode.
   
* Enabled the value of the `themeMode` prop to update when the value of `darkMode` changes.
   
* Added a `<Button>` to serve as control to toggle the theme mode by toggling the state of `darkMode`.
   
* Lastly, made the app interface a bit more interesting to demonstrate how various components are affected by toggling the `themeMode`. That’s it for Part 2! In [Part 3](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-theme-color-customization/), I’ll demonstrate how to customize a theme with custom dark and light mode colors. Don’t forget to check back at the HPE DEV blog to catch [Part 3](https://developer.hpe.com/blog/dark-mode-theming-in-grommet-theme-color-customization/) of this series. Again, if you have any questions, please feel free to reach out to me and others in the Grommet group on our Slack channel.