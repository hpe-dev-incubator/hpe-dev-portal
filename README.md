[![Netlify Status](https://api.netlify.com/api/v1/badges/444a3be6-7ca6-4e30-ac1c-7288c321e2cd/deploy-status)](https://app.netlify.com/sites/hpe-dev-portal/deploys)

<h1 align="center">
  HPE Dev Portal
</h1>

Kick off your project with this blog boilerplate. This starter ships with the main Gatsby configuration files you might need to get up and running blazing fast with the blazing fast app generator for React

_Have another more specific idea? You may want to check out our vibrant collection of [official and community-created starters](https://www.gatsbyjs.org/docs/gatsby-starters/)._

## Commands 
1.  **Start developing.**

    Navigate into your new site’s directory and start it up to run the gatsby project on development mode

    ```sh
    cd hpe-dev-portal/
    yarn install
    git submodule init
    git submodule update
    yarn start 
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    Open the `my-blog-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

## Platform resource tiles

In platform pages, use two or more consecutive bullet links with explicit
`guide`, `docs`, `faq`, or `video` tags to display a resource tile group:

```markdown
* [guide] [Getting started](https://example.com/getting-started)
* [docs] [API reference](https://example.com/api)
* [video] [Video walkthrough](https://example.com/video) Watch a hands-on demo.
```

Every eligible tagged group renders as tiles in its original position, retaining
the link titles, including groups in the introduction before the first heading.
Untagged introduction lists remain Markdown.
Separate groups with headings or paragraphs separated by blank
lines. Single-link lists remain Markdown.
Tagged links can include a description after the URL on the same line, with
additional description text on subsequent lines.

The `video` tag uses the CirclePlay icon. Video categories must be explicitly
tagged; video titles and URLs are not automatically classified as videos.

Pages without eligible tagged groups retain the existing behavior: only the
untagged group with the most recognized documentation, guide, or FAQ links
becomes tiles. When tagged groups exist, other untagged lists remain Markdown.

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: Gatsby is licensed under the MIT license.

10. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

 **NOTE:** To run gatsby project on production mode run below commands.

    ```sh
    cd hpe-dev-portal/
    yarn install
    gatsby build
    gatsby serve
    ```

    Your site is now running at `http://localhost:9000`!

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

## 💫 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hpe-dev-incubator/hpe-dev-portal/)

# hpe-dev-portal
