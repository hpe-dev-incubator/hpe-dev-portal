---
title: How citizen developers can build award-winning enterprise apps with
  low-code development platforms
date: 2022-11-11T13:58:12.102Z
author: Jeff Fougere
authorimage: /img/Avatar1.svg
disable: false
tags:
  - low-code
  - developer
  - citizen-developer
---
I was not hired to be a developer. My background is in mechanical engineering and patent law and I joined Hewlett Packard Enterprise to help manage its large patent portfolio.  Sure, I took a couple of classes on coding in college, but who doesn’t these days? With all the focus around STEM in schools, a new generation of talent is learning how to build web and mobile apps, just as previous generations learned how to construct imaginative structures with Lego.

It has never been easier for individuals or small teams to build apps through the use of low code platforms like Microsoft Power Apps and Power Automate. I was first introduced to these platforms a few years ago, and with the power they provided me, I am now proud to call myself a “Citizen Developer.” These tools enabled me to lead a small, self-organized cross-department team to create Idea Matchmaker, a mobile app that allows team members to easily connect and self-organize around interesting projects—a sort of “dating app” for ideas .

### A match-making app for ideas

As a world-wide technology company, Hewlett Packard Enterprise (HPE) houses a lot of talent. Ideas can crop up at anytime from anywhere. But ideas need more than simple recognition to come to fruition – they need resources with the appropriate skill sets to make them a reality. As you can imagine, in such a large company, it’s not always easy to build the right team to carry out your bold ideas.

A few years ago, I was part of a team within HPE’s patent department tasked with figuring out an easy way to gather feedback from the company’s vast technical community. This would allow the department to better protect its key inventions with patents and give team members a stronger voice in the company’s innovation strategy. We built a custom message board for each invention and were happy to discover that, in addition to commenting on the merit of the invention itself, team members would often suggest improvements and offer to collaborate. It was then that we realized how powerful a crowdsourcing platform designed to connect people could be.

This inspired us to create Idea Matchmaker, an app that allows HPE team members to easily post and find small projects from other team members that they would like to work on. It’s based on the simple design and user experience for dating and friend-finding apps like Bumble and Tinder, but adapted for HPE project matchmaking. The app works on both mobile and desktop platforms and includes a recommendation engine that leverages a bit of artificial intelligence to assist with matchmaking. With Idea Matchmaker, HPE team members can easily pass or connect on projects based on their interest level. The app began as a submission to an HPE company-wide competition, called Innovation Quest, and won first place in the User Experience category. Winning the Innovation Quest garnered the app a lot of attention and it’s now being deployed company wide.

### How we did it: the power of Power Apps

Building an application outside of the traditional software development streams within a company can be somewhat intimidating. There are a lot of challenges, like setting up cloud-based automation, dealing with security issues, implementing access controls, and navigating data compliance issues. Any “enterprise” app worth building will likely include sensitive or confidential data, which will limit how you can store and access your data outside of your company’s network. It’s not like you can just create a GoDaddy website and put your company’s sensitive information on it. Fortunately, with Microsoft Power Apps, everything can live within your existing Office 365 environment, which will allow you to easily build a secure and compliant end-to-end solution.

Microsoft Power Apps authenticates using your existing Office 365 credentials, so you don’t need to worry about setting up your own Single Sign-On (SSO) workflow. You can also easily connect to data stored in your existing SharePoint sites, and can create surprisingly robust data tables using SharePoint lists. This allows you to rapidly iterate on your ideas without worrying about the time and effort required to secure and spend a budget on database infrastructure. If your data happens to be stored in other databases, like a SQL server or MySQL database, you can connect to that, too (with a premium connector license). This allows you to easily build proof-of-concept apps to validate solutions before investing the big bucks in scaling things up.

The Microsoft Power Apps development environment is accessible via your browser, so you don’t need to install any desktop applications. And you won’t need to set up a Virtual Machine to virtualize your development environment. You can just open the site and start building your app, which I liken to a combination of creating PowerPoint slides, using formulas in Excel, with the bonus of being able to initiate events outside of the app from the app itself (e.g., click a button in the app to send an e-mail, create a document, or pull data from a database).

Using low-code development platforms means you can focus on things like screen layouts and components of your app rather than dwelling on code syntax. For example, you can easily change the color of a button in your app by selecting from a list of colors on a side panel. You don’t have to navigate to the relevant section of the code and try to remember whether the color parameter is called “bgcolor” or “background-color”.

Logic in a low-code app like Microsoft Power Apps feels similar to adding a formula to a cell in Excel, with simple if/then logic to define basic app logic (e.g., “If X, the button should be green, if not the button should be grey”). For adventurous low-code developers, you can also choose to make your entire app layout “responsive”, which will allow your app to automatically resize to fit the dimensions of a user’s browser window. Responsive design can add a great deal of complexity for citizen developers. If it’s not necessary for your specific use case, you can also use a fixed aspect ratio layout, which will allow your app to scale up or down similar to a PowerPoint slide deck. I often use a fixed aspect ratio to quickly build the first few versions of an app, and then switch to a responsive design once all the stakeholders approve of the overall design.

### Enhance your skills and get things done faster

It’s important to remember that platforms like this aren’t just for the non-coder. They can help seasoned developers as well. Remember—skills are the new currency. Most developers do not have expertise in all aspects of bringing an app to life (e.g., authentication, front-end, back-end, databases, APIs, etc.). Low-code tools can allow a single developer to quickly put together a serviceable app rather than incurring the overhead of building a full team of developers.

Another thing to keep in mind is how low-code/no-code platforms can save you time and money. If you’re not a developer, you might need to create a statement of work for a third-party vendor to create an app for you. This can be incredibly expensive—on the order of hundreds of thousands of dollars for medium-complexity apps. If you can do it yourself, you don’t have to find the right vendor, set up all those meetings, follow up, etc. You can get things done much faster, even if it’s just automating some existing process you have.

I really enjoyed creating Idea Matchmaker and I’m always looking for ways now to take advantage of low-code platforms. If you’re interested in being a Citizen Developer, you might want to check out this [HPE Developer Munch & Learn session](https://hpe.zoom.us/webinar/register/4716663493942/WN_8jlRM9SaRKmbT3r1CDNtDw) where I and a couple of colleagues get more into what HPE is doing with platforms like this today.