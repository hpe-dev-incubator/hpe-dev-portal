---
title: "Project Golang SDK: A valuable lesson in doing"
date: 2020-03-30T15:54:22.766Z
author: Samarth Deyagond 
tags: []
path: project-golang-sdk-a-valuable-lesson-in-doing
---
This year, I decided to learn the Golang programming language. I have always preferred learning any language or technology by working on a project, rather than just implementing some simple example programs from tutorials. So, I carefully considered what sort of project I could do that would not only provide me with a valuable learning experience, but also make a positive contribution. In this blog post, I’d like to share with you how the project I chose helped me achieve my goal in learning Golang.

In considering the project I wanted to take on, I had a strong urge to work on developing an SDK (software development toolkit) for the Hewlett Packard Enterprise’s (HPE) Composable Fabric Manager API (application programming interface). Why an SDK? Glad you asked! SDKs are like wrappers to APIs, giving them extra capabilities. For instance:

Developers don’t have to worry about creating a JSON payload in the right format and taking care of the endpoints with parameters. All they need to do is to send the required parameters and the SDK will take care of REST operations. More importantly, the developer can implement his software suite employing the programming language he is most comfortable with. In this case, it would be Golang.

* An SDK adds another layer of security layer to the application.
* An SDK also isolates the developer from the changes in the API which significantly reduces the time and effort to maintain the code base. 
* SDKs simplify development of applications that need to scale to multiple devices.

Given all this, I was pretty much convinced that my idea to implement the Golang SDK was a good one. I started off by reading the Golang documentation to understand the syntax, see how similar or how different it is from other programming languages, and learn about features that are exclusive to Golang. 

Here are a few key things I quickly learned:

* Golang is a compiled language. It also supports cross compilation. For those who may be unfamiliar with this term, cross compilation is the mechanism for creating executable code for a platform other than the one on which the compiler is running.
* It was mostly built for those who want to write less code and achieve more. 
* It is predominantly a functional programming language. However, Golang does incorporate a touch of an object-oriented approach.
* It supports the development of web applications, APIs, etc. pretty well.
* Golang doesn’t have exceptions or assertions, which might feel a bit odd at first if one is used to coding with programming languages like Python, Java or C#.
* Golang also has functional testing module built in, which makes it a great programming language to use in CI/CD pipelines.
* Golang is also web aware. That is, it can pull the dependencies directly from the web, version control system like GitHub, SVN, etc.

Truly, I would not be surprised if a Python lover discovers a similar love for Golang!

After learning the basics of Golang, and few advanced concepts, I started working on the design of my SDK. I must say, it involved a lot of thought and iteration. Finally, I came up with a nice design and started the implementation. Here are some of the things I learned while designing the SDK for this API:

1. The SDK must mimic the API. This means that the resource files in the SDK must implement functions corresponding to the endpoints which are defined by the API. For example, if you have an API endpoint for CRUD operations (CRUD — Create, Read, Update and Delete, which is very common in REST API terminologies) that is /rest/v1/users, then the SDK must have a method like AddUser(newUser), GetUsers(), UpdateUser(userUUID, updatedUserInfo) and DeleteUser(userUUID). The naming convention must be very intuitive.
2. A standard must be followed to map the API resources and their attributes to the resources and attributes in the SDK. This means that, in some sense, the resources are datatypes in the SDK. This is an advantage, since the developer can map the API resources to variables instead of parsing the JSON payloads all by himself.
3. The SDK should have documentation. Reading the documentation for either the API or the SDK must help you understand how the API works. Any limitations must be explicitly stated.
4. The SDK must implement a good error handling mechanism, with error logging and error messages. Logging must not log any sensitive information

I began building the unit test suite simultaneously along with the implementation system test suite. Most of the time, it is easier to implement functional testing only. But sometimes, it is not. With all this done, I am now confident that I can demo my Golang SDK.

As Dave Packard once pointed out, it’s important to always set an extraordinary goal by which all of your trivial goals can be achieved. Going through the process that I have shared above, I not only learned a new programming language, but also produced something valuable. I am looking forward to getting this project reviewed by Open Source Review Board at HPE and possibly making it an open source project. If this project becomes open source, then I’ll probably have to work on deciding on the contribution guidelines, test frameworks, how to build validations, and even set up a CI/CD pipeline using Travis CI or Jenkins or GitHub actions or whatever. A lot of work to do, to be sure!

Interested in learning more about SDKs and APIs? You’ll find a lot of good material on the [HPE DEV blog](https://developer.hpe.com/blog) site. Make sure you check it out. Or, sign up for the [HPE DEV newsletter](https://developer.hpe.com/newsletter-signup) to read the latest articles.
