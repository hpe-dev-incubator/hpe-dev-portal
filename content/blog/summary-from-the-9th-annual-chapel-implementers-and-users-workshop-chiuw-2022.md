---
title: Summary from the 9th Annual Chapel Implementers and Users Workshop (CHIUW 2022)
date: 2022-07-15T19:31:06.645Z
priority: 2
author: Michelle Strout and Engin Kayraklioglu
authorimage: /img/combined-author-pic-correct-ratio.jpg
thumbnailimage: /img/chapel-logo.jpg
tags:
  - Chapel Programming Language
  - GPU Programming
  - High Performance Computing
  - Open Source
  - Arkouda (Data Analytics in Python powered by Chapel)
  - chapel
---
**Introduction**

Programming today becomes complicated by the many kinds of parallelism that exist in everything from phones to laptops to supercomputers.  The open-source Chapel parallel programming language makes parallel programming easier and more productive, while still enabling high performance that takes advantage of the wide variety of parallelism available today.

In this post, Michelle Strout, general workshop chair, and Engin Kayraklioglu, program committee chair, summarize the highlights of the recent 9th Annual Chapel Implementers and Users Workshop (CHIUW 2022). Read on to hear about some exciting applications that are using Chapel productively, the coding day that happened the day before the workshop, updates on the project, and feedback the team received during and after the workshop.

**Applications Written in Chapel**

Programmers generally enjoy trying out new programming languages, but like to see example use cases before they lean on it.  CHIUW provides them with an opportunity to hear about and ask questions about many different use cases.  The Chapel programming language is being used productively in a range of application domains: data science, aeronautical simulations, cosmology simulations, and quantum diagonalization to name a few. CHIUW featured the following talks on different Chapel applications:

* [Large-Scale and User-Friendly Exact Diagonalization in Chapel](https://youtu.be/vBxPTzIRRr0)
* [Recent Developments in the CHApel Multi-Physics Simulation Software](https://youtu.be/uTE_RZkODOk)
* [UltraLight Dark Matter in Simulations: A Chapel-Powered Eigenstate Perspective](https://youtu.be/YrXYpgnt4rQ)
* [Implementing and Optimizing Parquet I/O in Chapel](https://youtu.be/pstRsgMhCDA)
* [Truss Analytics Algorithms and Integration in Arkouda](https://youtu.be/xI9EByv7A5M)
* [From C and Python to Chapel as My Main Programming Language](https://youtu.be/400jmMzdzHQ)

**Coding Day**

For Coding Day, anyone interested in working one-on-one or in small groups with developers from the Chapel team at HPE could indicate their interest in an online form.  We had 7 different sessions.  Programmers interested in Chapel were able to ask questions specific to their Chapel code, interactively make changes to the code, and work through issues with Chapel developers, who were present to provide immediate assistance.  In these sessions, Chapel users and developers worked on:

* Adding diagnostic support for Chapel runtime’s remote data cache
* Writing a cell-list module/library in Chapel
* Investigating porting a Dask application to Arkouda
* Implementing a Lisp interpreter in Chapel
* Optimizing distributed memory performance of a very large-scale matrix-vector multiplication
* Discussing Chapel’s nascent GPU support and going over the internals of the current implementation
* Learning Chapel in a peer-programming setting

Next year, we plan to keep Coding Day virtual, grow it to include more small groups at non-intersecting times, and publish a schedule ahead of time.  Email Engin at [engin@hpe.com](mailto:engin@hpe.com) if you have any thoughts about what you would like to work on or see during next year’s Chapel coding day.

**Chapel Project Updates**

One update we heard from Chapel developers was that the new parser was being used in the production Chapel compiler.  This is important because an often-heard complaint from Chapel users is that the compiler is too slow.  The current production compiler does whole program compilation and thus is not able to take advantage of separate and incremental compilation approaches.  The current *dyno* effort within the Chapel team is redesigning the Chapel compiler to enable separate, incremental, and in general more dynamic compilation.

Another important update we heard was in regards to the ever-growing GPU support for Chapel.  Currently some `forall` loops in Chapel are compiled for CPUs and as GPU kernels.  Which version to run is selected at runtime.  Below is an example of Chapel code that currently runs as a GPU kernel on machines where one or more GPUs are available.

![coforall gpu in here.gpus do on gpu { var A, B, C: [1..n] real; const alpha = 2.0; B = 1.0; C = 2.0; A = B + alpha + C; }](/img/chiuw22-gpu-code-example.jpg "Chapel Code that is offloaded to all the gpus on a locale/node.")

Keep an eye on the [GPU Programming Technical Note](https://chapel-lang.org/docs/technotes/gpu.html) for new features as GPU support in Chapel continues to expand.  More GPU support means handling an especially difficult kind of parallelism that programmers struggle with these days.

**Feedback from Attendees**

One user, Nelson Dias, gave a talk about moving to Chapel from the C and Python programming languages.  Nelson’s abstract states, “Chapel is a very elegant language, providing the power and speed of C and Fortran, while allowing a high degree of abstraction and expressiveness that rivals Python's. I have used it in the last two years for: calculating statistics over massive turbulence datasets, implementing models for lake evaporation in hydrology, and testing some relatively simple numerical solutions of partial differential equations.”  [His talk](https://youtu.be/400jmMzdzHQ) details the advantages and disadvantages he found while programming in Chapel.

In a post-workshop survey, attendees provided the following feedback to help improve CHIUW:

* Add short tutorials on how to use language features in a real language, as well as a debugging and performance analysis tutorial. (The Chapel team plans on doing these for next year's Chapel Coding Day.)
* Expand presentation topics (The CHIUW organizers can encourage new submissions from the community next year)
* Explore how people are doing performance optimizations in Chapel applications (For next year, we will encourage such submissions from the community)
* Talk more about libraries, specifically have one about parallel/distributed libraries in Chapel and another about wrapping C libraries in Chapel and lightweight Python wrappers for Chapel
* Offer more about the internals of the Chapel compiler, runtime, and libraries

Attendees also pointed out that their favorite Chapel features included parallel iterators, domains, global view memory, separation of concerns, and multi-resolution parallel programming.

**Summary**

Thank you for taking the time to read this post summarizing the recent Chapel workshop that highlights applications using Chapel, Coding Day, updates for the project, and feedback the team received during and after the workshop.

Check out all of the talk videos, slides, and submissions at the [9th Annual Chapel Implementers and Users Workshop (CHIUW 2022)](https://chapel-lang.org/CHIUW2022.html) website.  Come interact with the open-source Chapel project at the [Chapel website](https://chapel-lang.org/), on [GitHub](https://github.com/chapel-lang/), [StackOverflow](https://stackoverflow.com/questions/tagged/chapel), [Facebook](https://www.facebook.com/ChapelLanguage), [Twitter](https://twitter.com/ChapelLanguage), [Discourse](https://chapel.discourse.group/), or [YouTube](https://www.youtube.com/c/ChapelParallelProgrammingLanguage).  Consider how Chapel could help you solve some of your parallel programming challenges.