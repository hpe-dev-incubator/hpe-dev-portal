---
title: "Dockerizing your NodeJS based backend Applications "
date: 2020-06-15T14:51:00.025Z
author: Rahul Kumar 
tags: ["Docker","Containers"]
path: dockerizing-your-nodejs-based-backend-applications
---
  
Hello developers!  In this blog post, I will take you through a step-by-step procedure that uses best practices to dockerize your NodeJS backend applications. To better understand this tutorial, the reader should have some basic familiarity with Docker as-a-container technology and NodeJS-based backend applications. Briefly, NodeJS is the most popular JavaScript-based server side ecosystem. It is mostly used to build highly scalable, fault tolerant microservices-based backend enterprise applications. Many enterprise application developers prefer NodeJS over other programming languages, such as JAVA, because of its light memory footprint, event driven, non-blocking model. NodeJS is also very popular in building end-to-end applications in JavaScript, typically using MEAN (Mongo, Express, Angular, Node) and MERN (Mongo, Express, React, Node) stacks. In this post, I do not intend to focus on NodeJS-based application development, but rather on how to dockerize already developed NodeJS based applications.


Let’s first try to build a sample web server using express, which is a NodeJS package. Express is a node package typically used for building REST APIs in server side JavaScript. Below are the steps we are going to perform in this article:


- Create and Initialize a sample NodeJS based backend application
   using express package
- Dockerize the NodeJS application( i.e creating Dockerfile for
   application)
- Build a docker image out of Dockerfile
- Run a built image as a docker container and access the NodeJS
   backend application in web client typically web browser
- Push the finalized docker image on docker hub or any private 
    docker registry using docker CLI.

>Pre-requisite: you must have latest version of Node and Docker installed on your machine . ( Supported platform are Linux/windows/MAC). Throughout this article , i will be using docker for windows 10 using Hyper-V hypervisor . Follow the official documentation to install Node and Docker on your platform.

__STEP 1: Create and initialize a sample NodeJS based application__
  
Create sample project directory as below:
         

```
mkdir sample_node_app
```

  
Initialize the NodeJS project using node package manager (npm). It will generate a project skeleton with a package.json file (also called project descriptor) which carries all the meta data and dependencies information for your application.
       

```
cd sample_node_app && npm init
```

  
Once the project skeleton is ready, edit the "scripts" section of the package.json file as shown below:

```
cat package.json
     {
         "name": "sampleapp",
         "version": "1.0.0",
         "description": "This is sample Node Project",
          "main": "index.js",
          "scripts": {
           "start": "node index.js"
          },
          "author": "rahul kumar",
          "license": "ISC"
    }
```
  
In order to build a web server using NodeJS, install the express package using npm as below:

       

```
npm install express --save
```

     
By this time, your package.json should look as what’s shown below:



```
cat package.json
    {
       "name": "sampleapp",
       "version": "1.0.0",
        "description": "This is sample Node Project",
        "main": "index.js",
        "scripts": {
           "start": "node index.js"
         },
        "author": "rahul kumar",
        "license": "ISC",
       "dependencies": {
             "express": "^4.17.1"
       }
}
```
  
Once we have the project skeleton ready, let’s add express code to build a simple web server that listens on a certain port, for example, port 4000.

```
cat index.js
const express = require('express');
const application=new express();
const PORT=4000;
application.get('/',(req,resp)=>{	
	resp.send(`Congrats ! Your Node Express server is running on PORT ${PORT}`);
});
application.listen(PORT,()=>{
	console.log(`Node express server is running on ${PORT}. Enjoy NodeJS`)
});
```

  
Now that we have the Node express server ready, let’s run it!

```
 npm start
```


  
Once you have started the web server using the above command, you will see the following on the console:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/node-1592239169346.PNG)

  
Then, you can access the application on http://localhost:4000 in a browser.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/browser-1592239218657.PNG)

  
Okay! Now we have the simplest possible NodeJS backend application running on port 4000.

__STEP 2: Dockerize the application__ 
  
Now, let’s create a Dockerfile in the project directory.

```
cat Dockerfile
# Base image used 
FROM ALPINE
# Installing project dependencies
RUN npm install
# Running default command 
CMD ["npm", "start"]
```


Simple enough. So, now we have the smallest possible Dockerfile. Let’s move on to the next step .

__STEP 3: Building the docker image__
  
Navigate to the directory where your Dockerfile is present, also known as the “build context” for your Dockerfile. Note that you can change the name of the docker file to what you desire. If you do, you need to use the –f option in the docker CLI while building the docker image. By default, the docker CLI looks for a file named Dockerfile in the build context.


```
docker build .
Sending build context to Docker daemon   2.01MB
Step 1/3 : FROM alpine
latest: Pulling from library/alpine
df20fa9351a1: Pull complete                                                                                             Digest: sha256:185518070891758909c9f839cf4ca393ee977ac378609f700f60a771a2dfe321
Status: Downloaded newer image for alpine:latest
 ---> a24bb4013296
Step 2/3 : RUN npm install
 ---> Running in 0b3e3ae93e9c
/bin/sh: npm: not found
The command '/bin/sh -c npm install' returned a non-zero code: 127
```



  
We have found a problem: We need a Docker base image that has node and npm already installed.

Problem resolution: Why we are getting this error? To better understand this, you need to understand on what basis to select the base images in your custom (or project specific) Dockerfile. The rule of thumb is that you should choose your base image based on what programs you need to build your custom image. In this case, npm is the package manager for node and it is required for installing dependencies that your project needs inside the container. In Docker world, alpine images are very small in size (just a few megabytes) and the alpine image we selected does not seem to have npm in it. 

One way to overcome this problem is to use some other base image that has node and npm installed. The best option in this case would be to use the official base image found on the Docker Hub public registry. On Docker Hub, if we see a full-fledged Node official image tag, its size is probably on the order of 300-400 MB. But we don't need that large a sized Node image. Instead, what we need is just a tiny version of Node image that has at least npm in it. That is why Node also comes with its own alpine tag just like other official images. 
  
Let’s try to modify our Dockerfile to fix this.

```
cat Dockerfile
# Base image used 
FROM node:alpine
# Install project dependencies
RUN npm install
# Run default command
CMD ["npm", "start"]
```

  
Now, build it again with the alpine tag of the official node base image:

```
docker build .
Sending build context to Docker daemon   2.01MB
Step 1/3 : FROM node:alpine
alpine: Pulling from library/node
cbdbe7a5bc2a: Pull complete                                                                                                                                                                  fb0e3739aee1: Pull complete                                                                                                                                                                  738de7869598: Pull complete                                                                                                                                                                  ffd68be3d86c: Pull complete                                                                                                                                                                  Digest: sha256:7d11fea6d901bfe59999dda0fa3514438628a134d43c27c2eaec43cc8f4b98d5
Status: Downloaded newer image for node:alpine
 ---> 3bf5a7d41d77
Step 2/3 : RUN npm install
 ---> Running in 091b75730aa4
npm WARN saveError ENOENT: no such file or directory, open '/package.json'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN enoent ENOENT: no such file or directory, open '/package.json'
npm WARN !invalid#2 No description
npm WARN !invalid#2 No repository field.
npm WARN !invalid#2 No README data
npm WARN !invalid#2 No license field.
```

  
We have found a problem: We need to ensure the docker container is aware of our package.json file.

Problem resolution: When you see this warning or error, it is because the node package manager always relies on package.json file (which is generated as part of npm init during project initialization) for the installation of project dependencies. It shouldn’t be any surprise that containers don't have this package.json on its file system snapshot because the whole of our project source code is on a local hard disk. So the File system snapshot found in the container is merely the one which comes from node:alpine base image. One solution to this problem is to make your project source code somehow available in the container. Hence, before we install project dependencies using npm install in Dockerfile, package.json must be made available inside your container file system. The way we do it is to use the COPY instruction of Dockerfile. 

Here is the syntax:

```
# COPY docker instruction syntax
COPY <PATH to folder to copy from> <destination inside container>
```

  
Notice that there are various ways in which you can make your source code available to the container. The preferred ways are docker volumes and bind mounts. But in this example, we will directly copy the whole source code into the container file system. 
Here is the updated docker file :

```
cat Dockerfile
# Base image used  
FROM node:alpine 
COPY ./ ./
# Install project dependencies
RUN npm install
# Running default command
CMD ["npm", "start"]
```


  
Let’s build and tag it in order to push it to Docker Hub.

```
docker build -t rajput/sample_node_app .
Sending build context to Docker daemon   2.01MB
Step 1/4 : FROM node:alpine
 ---> 3bf5a7d41d77
Step 2/4 : COPY ./ ./
 ---> 586eada1b908
Step 3/4 : RUN npm install
 ---> Running in 90bcbf81b81c
npm WARN sampleapp@1.0.0 No repository field.

audited 50 packages in 2.925s
found 0 vulnerabilities

Removing intermediate container 90bcbf81b81c
 ---> bab8c88e351b
Step 4/4 : CMD ["npm","start"]
 ---> Running in bcb475eb3b19
Removing intermediate container bcb475eb3b19
 ---> 14119783c338
Successfully built 14119783c338
Successfully tagged rajput/sample_node_app:latest
```


  
We have now successfully built a docker image for our project. Let’s verify it using the following:


```
docker images 
REPOSITORY               TAG                 IMAGE ID            CREATED              SIZE
rajput/sample_node_app   latest              14119783c338        About a minute ago   119MB
```


  
As you can see, we have built the docker image and tagged it. Let’s run it now.

__STEP 4: Running the Docker container__
  
Run the docker image that we built in the previous step and see what happens.


```
docker run rajput/sample_node_app
> sampleapp@1.0.0 start /
> node index.js

Node express server is running on 4000. Enjoy NodeJS
```



  
Great! Our NodeJS express server is running. Let’s access our application on http://localhost:4000. 
Uh oh! Something’s wrong. We are not able to connect to our application.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/access-1592307009901.PNG)

  
Let’s see if the NodeJS container is running to find the root cause.





```
docker ps
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                    NAMES
c2408a62350e        rajput/sample_node_app   "docker-entrypoint.s…"   14 seconds ago      Up 13 seconds                                practical_tharp
```



  
Although we have successfully built our docker image and the container is running as well, the application still can't be accessed. As you can see , the PORT column in the screen above is empty. To understand why this is, you need to understand Docker Networking concepts. The port 4000 is inside the docker container, but we are accessing this 4000 on our host where the docker engine is running. One way to solve this problem is to route the traffic that is coming from your local host to the container where our application resides. Each docker container is considered to be an isolated sandbox with its own namespace, port, mount, etc. So, let’s make sure that whenever any request comes from the local host it is routed or redirected to the application in the container. This concept is called Port Mapping at run time in the docker networking world.  
  
Here’s how it looks:


```
# syntax for port mapping
docker run -p <PORT on HOST>: <PORT in container> <Image name or ID>
docker run -p 8080:4000 rajput/sample_node_app
```


  
And now we can access our Node application which is running in container!

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/sucaccess-1592307705946.PNG)
 
 Let’s visualize the NodeJS container file system snapshot by running a shell inside it 
 


```
docker run -it rajput/sample_node_app sh
/ # ls
Dockerfile         etc                lib                node_modules       package.json       run                sys                var
bin                home               media              opt                proc               sbin               tmp
dev                index.js           mnt                package-lock.json  root               srv                usr
```



  
Let’s see if we can improve on this: Our application source code is mixed with the root file system of the container.

Let’s do it!  You can see the application source code, including package.json, was copied inside the root file system of the container. Notice that, in order to avoid any undesired state of your container root file system once it is mixed with the project source code, it is recommended that you choose your own custom application directory inside the container file system. This will help in avoiding any undesired overriding of the file system by your own project source code. We can achieve this by using the WORKDIR instruction in our Docker file. This instruction ensures that any further commands (followed by WORKDIR) in the Dockerfile will be executed relative to WORKDIR in the container 
  
We will use this to optimize our Dockerfile:




```
cat Dockerfile
# Base image used  
FROM node:alpine 
WORKDIR /usr/mynodeapp
COPY ./ ./
# Install project dependencies
RUN npm install
# Running default command
CMD ["npm", "start"]
```

 Build and tag the docker file

```
docker build -t rajput/sample_node_app  .
```

Run the container out of the successfully built image:

```
docker run -p 8080:4000 rajput/sample_node_app
```

Notice that you might get an error here saying:
 

```
Error response from daemon: driver failed programming external connectivity on endpoint bold_germain (22e41c9ded62fe9f7347d0bbe116e4b23ad7c33890f5ec7401c0566441210616): Bind for 0.0.0.0:8080 failed: port is already allocated.
```

In order to resolve this, you need to ensure that the port on your host machine is not already allocated before running the NodeJS container. 
One common way to solve this is by stopping the running container on that conflicted port or choose a different port on your host machine.
You can stop running the container using the below command:

```
docker container stop <container ID>
```

Let's list the running containers

```
docker ps
```

Examine the file system for NodeJS container

```
docker exec -it 13940468222f sh
/usr/mynodeapp # ls
Dockerfile         index.js           node_modules       package-lock.json  package.json
```




  
You can see that all of our project source code is not in the root file system anymore and instead, it is in /usr/mynodeapp/.

```
/usr/mynodeapp # ls
Dockerfile         index.js           node_modules       package-lock.json  package.json
```


  
There is still an opportunity to improve this docker file. The Node package manager (npm) just uses package.json to install any project specific dependencies and it doesn’t care about the rest of the source code of your application. To further optimize the code, you need to first copy the package.json and then run npm install. Later, you will copy the remaining source code. This will ensure that any source code change in your application does not install project dependencies again and again, and that it does so only when new dependencies are added or an existing dependency version is changed in the package.json file in your project. It is always a best practice to keep the things that more frequently change, such as project or application code, at the bottom of the docker file.
 
If you have done all this, the new Dockerfile should look like what’s shown below: 





```
cat Dockerfile
MAINTAINER geeks@hpe.com
# Base image 
FROM node:alpine
# Working directory
WORKDIR /usr/mynodeapp
COPY ./package.json  ./
RUN npm install
COPY ./  ./
```


  
Let’s build and tag the image again . Ensure tag name for your image is unique at any point of time.

```
docker build -t  rajput/sample_node_app .
```

  
Once the finalized image is successfully built, we can run the NodeJS container out of it:
 

```
docker run -p 8080:4000 rajput/sample_node_app
```




  
Good, so we have the final docker image for our NodeJS based backend application. Let’s push it to Docker Hub.


__Step 5:   Push the image on docker hub__

Congratulations ! It's time to push the docker image onto the docker hub.
Docker hub is a public registry for your docker images ! You need to have docker hub account in order to push your image onto it.





```
docker login
Username: rajput
Password:
Login Succeeded
```



```
docker push rajput/sample_node_app
The push refers to repository [docker.io/rajput/sample_node_app]
312072b77e32: Pushed                                                                                                                                                                         5a3885fb97b9: Pushed                                                                                                                                                                         latest: digest: sha256:707eae883285a5209283aea94950fee5c9f9357a36b1d6f53c60cb659fd950ec size: 1782
```
  
Once you have pushed your image, this is what it will look like on the Docker Hub public registry.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/hub-1592318453804.PNG)

  
Even though we have made great progress, we are still left with the problem that for any change in the application source code still requires rebuilding the docker image. Any time we want to modify project source code, we need to rebuild the image again. This is because the source code is still on our local hard disk and it is nowhere referenced in the container and it is copied into the container only when the docker image is built. One way to solve this problem is to use docker volumes or bind mounts, which let you change your source code from local hard disk and have the change reflected in the running container without even rebuilding the image. I plan on writing a follow-on article that will address this. 

Along with addressing this issue, I plan on showing you the same application built with multiple containers. We will add some No-SQL backend DB, like Redis or Mongo to the NodeJS application service layer. It will be a multi-tier app with a proper service and database layer. We will leverage docker compose to run both containers; one for database and one for express server and see how they interact with each other.
As a full-stack developer with a sincere passion for the latest software technologies, I like to help others by writing tutorials like this. I hope you enjoyed my post. You might want to check out another post I wrote [here](https://developers.redhat.com/blog/author/rkumar/ ). Keep checking back on the [HPE DEV blog site]( https://developer.hpe.com/blog ) for new and interesting articles on containers!




