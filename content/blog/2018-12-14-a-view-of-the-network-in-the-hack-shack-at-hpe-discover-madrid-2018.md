---
title:  A view of the network in the Hack Shack at HPE Discover Madrid 2018
date: 2018-12-14T14:20:30.488Z
author: Brian Martin 
tags: ["hpe-discover-madrid-2018","discover","hackshack","hackathon","hpe-composable-fabric-manager","plexxi","letshackshack"]
path: a-view-of-the-network-in-the-hack-shack-at-hpe-discover-madrid-2018
---
![Discover Madrid Stickers](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/dmad-stickers-1544797453006.png)

# #LETSHACKSHACKHowdy! Brian here, just back from the Hack Shack at HPE Discover Madrid. Hanging out with customers and partners was the best part of the show. Having fun helping them accelerate their cloud operational efficiency was icing on the cake. Yes, I said having fun. Having fun with code is a big part of the Hack Shack mantra and just one reason why I enjoy my job. Struggling with integration? Upgrade the API! Dealing with repetitive tasks? Automate! I code where I can make a difference and I have a great time doing it.

My colleagues and I, ([Chris Young](https://twitter.com/netmanchris) and Mark Parenti), had the opportunity of representing [HPE Composable Fabric](https://www.hpe.com/us/en/integrated-systems/composable-fabric.html) in the Hack Shack. We set out to do the impossible - ok, maybe just the highly improbable. Our mission: make network programming comprehensible and accessible. I know you must be chuckling about that mission statement but read on! You are about to embark on a journey of wonder and awe and see how truly simple your network can be.

HPE Composable Fabric Manager (fka: Plexxi) was designed and developed from the beginning to be fully API driven. The web-based user interface uses the same RESTful API available to everyone - no special endpoints or mysterious parameters - and fully documented with Swagger. 

![Plexxi Swagger Screenshot](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/plexxi-swagger-1544797482316.png)

To make programming even easier in the Hack Shack, we pulled together Python bindings for the API, and everyone’s favorite coding example, “hello world”. Several of the customers dropping by the Hack Shack with their laptops successfully programmed the Composable Fabric switches in just a few minutes. Let me show you how they were able to do so much in so little time.

The first component is a client class that wraps the Composable Fabric API in easy to access properties and methods. Initializing the client with authentication credentials and the address of the Composable Fabric Manager instance establishes a secure connection. Convenience methods offer easy access to fabric switches, switch ports, and more. For our exploration, getting switches and ports along with updating ports will suffice.

![plexxi ss 01](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/plexxi-ss-01-1544797520119.png)

Once we have the API client initialized, a call to the `get_switches()` method returns the fabric switches, and `get_ports(switch_uuid)` returns the ports for a given switch. We’ll use the port identifiers to update their status later with calls to `update_ports()`.

![plexxi ss 02](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/plexxi-ss-02-1544797572994.png)

The "secret sauce” in our example is mapping the characters in “hello world” to switch ports in binary ASCII! Then it’s just a simple matter of administratively enabling or disabling the appropriate ports to send our message to the world.
Sure, this example has limited applicability in your data center and only your geekiest friends will appreciate it, but it illustrates the simplicity of programming the Composable Fabric API, making even the most powerful operations simple and automate-able. In fact, many of the integrations in Composable Fabric Manager do exactly that - leverage internal and external APIs to automate network discover, configuration, and remediation.

The Hack Shack at Discover 2018 in Madrid was a great experience and I loved meeting all of you, hearing your ideas and inspiring you. I look forward to seeing you again next year. If you didn’t stop by this time, be sure to visit us at the Discover 2019 event in Vegas.  Ask for me and let’s sit down and talk networking geek.

And don’t forget! Keep an eye out for the upcoming Python bindings on [HPEDEV.IO](https://hpedev.io).
