---
title: "Using Grommet with Gatsby"
date: 2020-01-21T17:34:14.734Z
author:  Michael Kingdom 
tags: ["grommet","opensource"]
path: using-grommet-with-gatsby
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture1-1579628420945.png)

[Gatsby](https://www.gatsbyjs.org/) is a popular, free, and open source framework based on [ReactJS](https://reactjs.org/) that helps developers quickly build websites and apps. Because Gatsby is a PWA (Progressive Web App) generator, it provides code and data splitting out-of-the-box. Gatsby loads only the critical HTML, CSS (cascading style sheets), data, and JavaScript required so websites load quickly. Gatsby uses a GraphQL query interface to easily get data from just about any source, making clicking around the website feel very fast. You can augment these capabilities and make great looking applications and websites mobile-friendly, accessible, and responsive by using [Grommet.](https://v2.grommet.io/) In this tutorial, I’ll show you how to get started using Grommet components and styles with Gatsby to make websites and applications more inviting.

## Pre-requisites

This tutorial assumes you have [Yarn](https://yarnpkg.com/lang/en/) as well as [Node.js and npm](https://nodejs.org/en/download/) installed. 

## Step 1: Create a basic Gatsby app
First, use npm to install the Gatsby commands and create a basic Gatsby app with the 
```gatsby new <name>``` command. You can use an existing Gatsby starter (there are some that include Grommet), but we'll use the default Gatsby minimal app for this example. 


```bash
npm install -g gatsby-cli
gatsby new gatsby-with-grommet 
cd gatsby-with-grommet
```
## Step 2: Add in grommet dependencies
Add Grommet to the dependencies. We'll use Yarn, since Gatsby uses it when doing 
```gatsby new```. 


```bash
yarn add grommet grommet-icons styled-components
```

## Step 3: Start up a development server
Start up a Gatsby development server to make changes and see the effect of those changes in real time.


```bash
gatsby develop
```

Now, you can view the result in your local browser at `http://localhost:8000/.`


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture2-1579628526610.png)

We aren't using Grommet components yet, so let's add some in, along with the Grommet themes.

## Step 4: Start using Grommet components

First, replace the contents of the `src/components/layout.css` file with this simple bit of CSS to reset some browser defaults we don't want. We'll rely on Grommet's internal styles rather than use a separate CSS file to style the user interface (UI).


```css
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

img {
  max-width: 100%;
  height: auto;
}
```

Next, make the main Layout component using the Grommet wrapper and theme, as well as the other equivalent Grommet components, instead of the literal html elements. Change `src/components/layout.js` to look like this:


```jsx
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import { Grommet, Anchor, Box, Footer, Text } from "grommet"
import { grommet } from "grommet/themes"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Grommet
      theme={grommet}
      full
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header siteTitle={data.site.siteMetadata.title} />
      <Box as="main" pad="medium" flex overflow="auto">
        {children}
      </Box>
      <Footer background="light-4" justify="center" pad="small">
        <Text textAlign="center" size="small">
          © {new Date().getFullYear()}, Built with
          {` `}
          <Anchor href="https://www.gatsbyjs.org">Gatsby</Anchor>
          {` and `}
          <Anchor href="https://v2.grommet.io">Grommet</Anchor>
        </Text>
      </Footer>
    </Grommet>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
```

You’ll also want to change `src/components/header.js` to use the Grommet equivalents.


```jsx
import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Header as GrommetHeader, Heading } from "grommet"

const Header = ({ siteTitle }) => (
  <GrommetHeader background="brand" justify="center">
    <Heading>
      <Link
        to="/"
        style={{
          color: `white`,
          textDecoration: `none`,
        }}
      >
        {siteTitle}
      </Link>
    </Heading>
  </GrommetHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
```

Finally, change `src/pages/index.js` to use Grommet equivalents.


```jsx
import React from "react"
import { Link } from "gatsby"
import { Box, Heading, Paragraph } from "grommet"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Heading>Hi people</Heading>
    <Paragraph>Welcome to your new Gatsby site.</Paragraph>
    <Paragraph>Now go build something great.</Paragraph>
    <Box width={{ max: "300px" }} pad="small">
      <Image />
    </Box>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
```

Make similar changes to `src/pages/page-2.js`.

> Note that Gatsby has a way of optimizing and lazy-loading images that’s implemented in the example `src/components/image.js`. You can use something like this rather than Grommet's `<Image>` component to help optimize a Gatsby site.

You should now see the Grommet styling in the browser.




![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture3-1579638304412.png)

## Step 5: Routing

Gatsby defines routes automatically for pages in the `src/pages` folder so many Gatsby applications don't have to set up routes or even interact with the router directly. Gatsby uses `@reach/router` instead of the react router. So, for efficient internal links, Gatsby applications use Gatsby's `<Link>` component. This component uses `navigateTo` from `@reach/router` to change routes. One way to get Grommet's styling for these internal links is to make a version of Grommet's `<Anchor>` that uses `navigateTo`.

Create a file in `src/components` called `link.js` that contains the following:


```jsx
import React from "react"
import PropTypes from "prop-types"
import { Anchor } from "grommet"
import { navigate } from "gatsby"

const Link = ({ to, ...rest }) => (
  <Anchor
    href={to}
    onClick={ev => {
      navigate(to)
      ev.preventDefault()
    }}
    {...rest}
  />
)

Link.propTypes = {
  to: PropTypes.string,
}
export default Link
```

Now, change all the places that use Gatsby's `<Link>` to use this Link component instead. For example, change `src/pages/index.js` to import this new component and not the Gatsby Link component.


```diff
import React from "react"
// import { Link } from "gatsby"
import Link from "../components/link"
import { Box, Heading, Paragraph } from "grommet"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Heading>Hi people</Heading>
    <Paragraph>Welcome to your new Gatsby site.</Paragraph>
    <Paragraph>Now go build something great.</Paragraph>
    <Box width={{ max: "300px" }} pad="small">
      <Image />
    </Box>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
```

Because you started using this other Link, the **Go to page 2** link on the main page is using the Grommet styling. 


![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture4-1579628555064.png)

Make the same change to `src/pages/page2.js` and `src/components/header.js` to ensure those use the Grommet link styling as well.

## Summary

You can see the complete result at https://github.com/MikeKingdom/gatsby-with-grommet-starter.

Gatsby is a great framework for making high-performing websites and web applications. Try adding Grommet to make these websites even better looking, responsive, accessible and mobile-friendly.
If you have any questions, please join me on the [Grommet Slack channel.](https://app.slack.com/client/T04LMHMUT/C04LMHN59) You’ll find a lot of support there. And don’t forget to check out the [HPE DEV site](https://developer.hpe.com/) to learn more about all our platforms.

