---
title: "Dark Mode Theming in Grommet: Theme color customization"
date: 2020-10-28T13:39:20.480Z
featuredBlog: false
priority: null
author: Matt Glissmann
authorimage: /img/blogs/Avatar4.svg
thumbnailimage: null
tags:
  - grommet
  - opensource
---
![g1lightdark3_1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/g1lightdark3_1-1603892557138.png)

This is the final post in a three-part series. Parts [1](/blog/dark-mode-theming-in-grommet-how-to-set-up-and-apply-a-theme) and [2](/blog/dark-mode-theming-in-grommet-adding-dark-and-light-theme-modes) introduced how to apply a theme, change the theme’s mode between light and dark, and, finally, provide an app’s user the ability to change the theme’s mode to their preference.

* [Part 1 - How to set up and apply a theme](/blog/dark-mode-theming-in-grommet-how-to-set-up-and-apply-a-theme)
* [Part 2 - Adding dark and light theme modes](/blog/dark-mode-theming-in-grommet-adding-dark-and-light-theme-modes)
* Part 3 - Theme color customization

In this final post, I’ll demonstrate how to add custom light and dark mode colors to the theme. I will cover the following content:

* Creating a custom theme file
* Defining the color palette
* Mapping the color palette to component definitions in the theme
* Merging the customizations with an existing theme
    

## Customizing the Theme

Up to this point, we have been using Grommet’s theme. Let’s say, however, we’d like to tweak the Grommet theme by adding some custom colors for my fictional company, Acme, Inc.

To do this, continue modifying your app from where [Part 2](/blog/dark-mode-theming-in-grommet-adding-dark-and-light-theme-modes) concluded, or reference this [Codesandbox](https://codesandbox.io/s/grommet-theme-toggle-2addtogglebutton-txbux?file=/src/App.js) if you are catching up and joining midstream.

Acme’s brand colors are Ruby, Gold, and Amethyst, with some warm greys for backgrounds and text. The hex values for Acme’s color palette, plus values for the light and dark variants, are provided below.

![g3 table](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/g3-table-1603909712399.JPG)

To begin the custom Acme, Inc. theme,  **create a theme file**, **define the color palette**, and then **map the color palette** to the Grommet components for which you want the colors to be applied.

## Create Theme File

In the `src` directory, create a theme file called `acme-theme.js` with the theme object `acme` as an export:

![g2part 3 image](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/g2part-3-image-1603892563485.png)

## <a id="head2"></a>Define the Color Palette

Define the color palette by naming each color, plus their dark and light variants. Colors are defined in the theme object’s `global.colors` property. For each color, the following structure is used:

```markdown
uniqueColorName: {
    dark: ‘hexidecimal value or reference a color name’,
    light: ‘hexidecimal value or reference a color name’,
},
uniqueColorName! : ‘hexidecimal value or reference a color name’,
```

Notice that any Grommet component with color as an attribute can accept either a string or an object containing `dark` and `light` properties. `Dark` specifies the color Grommet uses when the element is on a dark background; `light` specifies the color for use on a light background. 

Additionally, by convention, a color name followed by a ‘!’ bang represents the color’s “true” value rather than a dark/light variant.

Add Acme, Inc. colors to `acme-theme.js` like so:

```javascript
export const acme = {
 global: {
   colors: {
     ruby: {
       dark: "#d4111e",
       light: "#f58990"
     },
     "ruby!": "#EF3F4C",
     gold: {
       dark: "#df9007",
       light: "#e7b86b"
     },
     "gold!": "#F9B644",
     amethyst: {
       dark: "#9B59B6",
       light: "#C39BD3"
     },
     "amethyst!": "#AF7AC5",
     "grey-1": "#ECE9E3",
     "grey-2": "#CECCC6",
     "grey-3": "#737069",
     "grey-4": "#52504C", 
   }
 }
};
```

## <a id="head3"></a>Map Colors to Grommet Namespaces and Components

Now that the colors are defined, it’s time to apply them. For the purposes of this tutorial, I will only map the colors to a handful of theme properties. This will demonstrate the process of implementation, but it is certainly not exhaustive. For the curious, inspecting [Grommet’s base theme](https://github.com/grommet/grommet/blob/master/src/js/themes/base.js) is a great place to take inventory of the many possibilities to fully customize your own theme.

Modify `acme-theme.js` by mapping the colors to background, brand, control, and anchor properties:

```javascript
export const acme = {
 global: {
   colors: {
     /* BEGIN: Color Palette Definition */
     ruby: {
       dark: "#d4111e",
       light: "#f58990"
     },
     "ruby!": "#EF3F4C",
     gold: {
       dark: "#df9007",
       light: "#e7b86b"
     },
     "gold!": "#F9B644",
     amethyst: {
       dark: "#9B59B6",
       light: "#C39BD3"
     },
     "amethyst!": "#AF7AC5",
     "grey-1": "#ECE9E3",
     "grey-2": "#CECCC6",
     "grey-3": "#737069",
     "grey-4": "#52504C",
     /* END: Color Palette Definition */
     /* BEGIN: Mapping Colors to Grommet Namespaces */
     background: {
       dark: "grey-4",
       light: "grey-1"
     },
     "background-back": {
       dark: "grey-4",
       light: "grey-1"
     },
     "background-front": {
       dark: "grey-3",
       light: "grey-2"
     },
     brand: "ruby!",
     control: {
       dark: "brand",
       light: "brand"
     },
     input: {
       background: "blue"
     },
     text: {
       dark: "grey-1",
       light: "grey-3"
     }
   },
   focus: {
     border: {
       color: "gold"
     }
   }
   /* END: Mapping Colors to Grommet Namespaces */
 },
 /* BEGIN: Mapping Colors to Components */
 anchor: {
   color: {
     dark: "gold",
     light: "amethyst!"
   }
 }
 /* END: Mapping Colors to Components */
};
```

## Merging a Custom Theme with an Existing Theme

In `App.js`, add the following imports:

* `import { deepMerge } from “grommet/utils”;` - A function allowing an existing theme to be customized or extended
* `import { acme } from “./acme-theme”;` - Our custom theme file
   
* `import { DemoSection } from “./DemoSection”;` - A section of sample components to see how theme customizations are applied
   

Then, add the line `const theme = deepMerge(grommet, acme)`. The imported `deepMerge` function incorporates the `acme` specifications into the `grommet` theme, resulting in a new custom `theme`.

```javascript
import React from "react";
import { Grommet, Anchor, Box, Button, Heading, Paragraph } from "grommet";
import { grommet } from "grommet";
import { deepMerge } from "grommet/utils";

import { acme } from "./acme-theme";
import { DemoSection } from "./DemoSection";

const theme = deepMerge(grommet, acme);
```

Finally, swap out the `grommet` theme with the newly created `theme`.

```javascript
  <Grommet full theme={theme} themeMode={darkMode ? "dark" : "light"}>
```

That concludes this tutorial. Your final code and resulting app should resemble this [Codesandbox](https://codesandbox.io/s/grommet-theme-toggle-3customizeourtheme-9wqfb?file=/src/App.js). I hope you have enjoyed this three-part tutorial.

As review, here’s how the app was modified:

* Created a custom theme file.
* Defined the color palette and its namespaces.
* Mapped the color namespaces to Grommet namespaces and component definitions.
* Finally, merged the theme customizations with Grommet’s theme.
   

## Next Steps for Exploration

Now that you have seen how easy it is to apply a theme to Grommet, set and toggle the theme’s light/dark modes, and even start applying custom colors to your own theme, here are some great next steps you can take:

* Check out [Grommet’s Theme Designer](https://theme-designer.grommet.io/) (Beta) and other [Grommet Resources](https://developer.hpe.com/platform/grommet/home/).
* Explore Grommet’s other theme properties which can be customized.
* Create and apply your own theme to your own project, then share it on Grommet’s [\#i-made-this](https://grommet.slack.com/archives/CG25TE0KZ) Slack channel for community members to enjoy.