---
title: "Chapel Technical Lead, Brad Chamberlain, Opens Up About Open Source"
date: 2021-02-12T11:26:55.233Z
author: Dale Rensing 
tags: ["chapel","opensource"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
![brad chamberlain for blog](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/brad-chamberlain-for-blog-1613129198318.jpg)

As a leading global, edge-to-cloud Platform-as-a-Service company, Hewlett Packard Enterprise (HPE) prides itself in employing team members who share one common purpose: to advance the way people live and work. Because of this, HPE boasts some of the finest [open source](https://www.hpe.com/us/en/open-source.html) engineering talent. In this blog series, you’ll get to meet a number of them as I interview some of the open source experts who make up our team.
    
Dr. Bradford Chamberlain is the principal engineer for the [Chapel parallel programming language](https://chapel-lang.org/). His research interests center around parallel computation, particularly with respect to programming languages, compilers, algorithms, applications, and scalability. Brad comes to HPE through its recent acquisition of Cray Inc.

### What attracted you to open source technologies?

I like open source because I tend to be a community-minded person. I like the idea of creating technologies that can span organizations and draw upon the expertise of people from a variety of backgrounds. And given that I benefit greatly from other open-source efforts, I really like the notion of giving back in a way that, hopefully, others will find similarly valuable.
    
When code is open source, users have more confidence that a project can garner enough interest to live on, even if you, as the original developer, move on to pursue new endeavors. Users can continue to make changes, if needed, even if you aren’t there. For me, this is one of the many reasons that open source technologies are so attractive. 

### How did you first get involved with open source?

I got started with open source when I was working on the ZPL programming language while pursuing my Ph.D. in Computer Science & Engineering at the University of Washington. ZPL was open source only in the sense that we released our source code to users—the development itself was done in an internal repository.  With the Chapel programming language that I work on now, our notion of open source extends to the entire development process.  As an example, our project is [hosted at GitHub](https://github.com/chapel-lang/chapel).
    
In both cases, the choice to use open source was very much for practical reasons. It’s generally quite challenging to get people to try any new programming language; making a language that’s proprietary and closed source only makes it more difficult.  In contrast, when a language is free and open source, people are far more willing to give it a try, due in large part to the flexibility afforded by open source.  It also has the practical benefit of dramatically simplifying our release process given all the architectures, operating systems, and compilers that Chapel is compatible with.

### Can you tell me a little more about your work on Chapel and why you’re so excited about it?

Chapel is a programming language designed to make parallel programming on supercomputers far more productive than current approaches.  However, it is also designed for portability such that Chapel programs can be developed and run on laptops, commodity clusters, or the cloud, for anyone who doesn’t have easy access to a supercomputer.  In practice, I do most of my Chapel programming on a Mac laptop with a high degree of confidence that, once I’ve got it working, I can run it on an HPE Cray supercomputer without any problems.
    
Chapel is also designed to appeal to programmers of all expertise levels.  We strive to make it so easy to use that essentially every programmer could program a high-performance computing (HPC) system. Today, programming at such scales tends to require expertise in a number of fairly specialized and explicit programming notations, like C/C++, MPI, OpenMP, and CUDA. With Chapel, we strive to combine the ease-of-use of a language like Python with the performance and scalability you’d expect from conventional HPC techniques.

### What’s currently on your list of things to do? 

My team’s current and upcoming projects that I’m most excited about include compiling Chapel to GPUs, refactoring our compiler for speed and flexibility, and optimizing Chapel’s performance for HPE Cray EX. I’m also excited to engage with our community more as we modernize our website using some open source technologies that are new to me (Jekyll and Rouge).  That said, my most immediate task is helping to wrap up our Spring 2021 release, due out in March.

### As a developer, what you create says a lot about who you are. What impression do you hope you leave with others? 

When people think of me, I hope they envision someone who is passionate about making supercomputers as straightforward and fun to program as laptops are, yet without sacrificing performance or scalability.  I also strive to be as approachable and affable as my own mentors were, and hope that comes through to people.
    
To learn more about the open source projects that HPE is involved with, please visit our [open source page](https://www.hpe.com/us/en/open-source.html). Interested in exploring what HPE offers for developers and data scientists? Check out our [HPE DEV site](https://developer.hpe.com/) for a ton of articles, workshops, tutorials, and other resources.
