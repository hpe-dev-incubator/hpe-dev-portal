---
title: "Building HPE's new design portal with headless Wordpress and Next.JS"
date: 2018-11-27T20:35:27.762Z
author: Alex Mejias 
tags: []
path: building-hpes-new-design-portal-with-headless-wordpress-and-nextjs
---
## Work smarter, not harder
I can't quite recall who planted the "work smarter, not harder" seed in my head but for the past six months, it has been resonating non-stop in an almost comical manner. This project reflected that mantra to a T.

![work smarter not harder](https://media.giphy.com/media/SSw1KX5otdqPm/source.gif)

## The brief ... 
An application concept recently arrived at my desk regarding constructing a new design portal for HPE, similar to the HPE DEV portal you're currently using. The goal for the application is to house all things related to HPE's new design program, including all of the various design resources we offer. My career at HPE has generally revolved around building or leading the construction of this same type of web application in various flavors. The stack usually includes a [grommet](https://v2.grommet.io/) based front end and some form of a custom content management system with an API. In fact, this very developer portal was built upon 100% custom solutions built over the course of three months. With each iteration of this fullstack scope, we've eventually widdled away the complexity of a fully custom back and frontend. The difference between this new design portal project and previous projects was that we had **3 weeks** to ship it for [Discover '18 Madrid](https://www.hpe.com/events/discover/). The *"work smarter, not harder"* mantra showed up in full swing. What was once a Grommet based CMS was replaced with a headless instance of Wordpress running in a Docker container. A custom Webpack configuration which constantly needed tuning and a homebrewed server-side rendering engine were replaced by [Next.JS](https://nextjs.org/) with Grommet. 

## Off to the races
As we began building on this new stack I felt a huge weight being lifted off of my shoulders. I was no longer focusing on whether or not the tooling or build processes were working as expected and I could focus on what was important - the end user's experience. Not having to wrestle a webpack config or babel transpiling gave us the runway we needed to make sure this project was successful.

Next's server-side rendering and bundling worked flawlessly out of the box and it integrated perfectly with Grommet. New stacks come with a learning curve, however, this one was quite low. Here's some items we needed to pick up to create a great Grommet based Next frontend:
- Handling page [routing](https://github.com/zeit/next.js#routing)
- The next/link component and nesting anchor tags within it
- Handling route parameters, [here's a great example](https://github.com/zeit/next.js/tree/canary/examples/parameterized-routing) of the approach we took
- Creating new components to handle SEO and meta tags
- Extending Next's custom babel config to support styled components, here's a [great article](https://dev.to/aprietof/nextjs--styled-components-the-really-simple-guide----101c) explaining how to handle this

While we had cleared up tooling and build complexities on the front end there was still the matter of handling dynamic content. I had kicked around headless Wordpress in a few projects but always walked away wondering if it was the right choice. As time has gone by the ecosystem has ironed out a lot of the complexities which made me question the solution, WP API has now become a staple in web application development. We started out by referencing [Postlight](https://github.com/postlight/headless-wp-starter) to get a better understanding of the current state of headless Wordpress. I ended up not using Postlight's approach to Wordpress but it did provide me with some keen insight into proper architecture. Ultimately, we chose to roll our own environment variable driven Docker compose setup which would handle Wordpress, MySQL, SSL, Nginx, backups, and obtain certificates on the fly from Let's Encrypt. Our final Wordpress build included the following plugins:
  - [ACF to WP API](https://wordpress.org/plugins/acf-to-wp-api/) to expose custom metadata in the Wordpress API
  - [Advanced Custom](https://www.advancedcustomfields.com/) Fields to allow for flexible content entry
  - [Custom Post Type UI](https://wordpress.org/plugins/custom-post-type-ui/) to quickly create and edit post types without requiring code changes or rebuilds
  - [WP Migrate Pro](https://deliciousbrains.com/wp-migrate-db-pro/) to effortlessly sync data from our staging to our production environment
  - [WP-REST-API V2 Menus](https://wordpress.org/plugins/wp-rest-api-v2-menus/) to expose Wordpress' native nav menu editing to the API

That's all it took to create a fully featured CMS in about a week.

![gotchas](https://media.giphy.com/media/XH6MU5zmqIpAA/giphy.gif)
## Headless Wordpress gotchas
I've picked up a few things after building Wordpress APIs, here's what to look out for:
  - Your API will most likely live in its own sub-domain to avoid exposing non-traditional web ports like `8000` in your URLs
  - Keep [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), cross-origin resource sharing, in mind. You may need to include a [plugin](https://github.com/ahmadawais/WP-REST-Allow-All-CORS) to allow cross-domain fetches
  - If you're running Wordpress in Docker consider state, be sure to mount and backup the media uploads volume and of course your MySQL database
  - Disable your Wordpress front end with [redirects](https://github.com/postlight/headless-wp-starter/blob/master/wordpress/wp-content/themes/postlight-headless-wp/index.php)

## The perception of value through customization
I was once naive enough to think custom solutions added enough technical value to a project to disregard the delivery timeline and simply worked harder. While building these custom solutions are absolutely invaluable when it comes to learning it's not always a sustainable practice. I still struggle to justify my team's decision to use Wordpress for our data layer to my colleagues but when all of my technical hurdles come solved out of the box it's hard to refute the value of a staple like Wordpress. When we look at buying a car, we generally don't buy the pieces separately then build the engine. We find the car we like and we drive it.

Now that you've listened to my long-winded spiel about libraries, content management, and frameworks **[check out the new HPE design portal!](https://hpe.design/)**

![88 mph](https://media.giphy.com/media/BRpMznCmYTiik/giphy.gif)
