---
title: Smart use cases for SmartSim
date: 2023-02-13T08:45:53.549Z
author: Matt Ellis
authorimage: /img/Avatar1.svg
disable: false
tags:
  - SmartSim
  - opensource
---
[SmartSim](https://developer.hpe.com/platform/smartsim/home) is an open source library that aims to bridge the divide between traditional numerical simulations and data science tools. SmartSim started as a project at Cray before Cray was acquired by Hewlett Packard Enterprise (HPE). SmartSim was later open sourced under the BSD-2 license.

[High performance computing software](https://www.hpe.com/us/en/compute/hpc/hpc-software.html) (HPC) takes advantage of parallel computing techniques. A large portion of the traditional HPC applications are written in C, C++, or Fortran whereas data science toolkits are often written in Python and NumPy (which is used for scientific computing in Python). This can make it difficult to bridge the gap between the data science world and HPC. SmartSim is a software library aimed at providing the glue between these two worlds.

SmartSim enables users to use machine learning models inside their existing Fortran/C/C++ simulations. It does so by allowing them to push and pull data to/from these applications and an in-memory, highly performant database. Because this database also supports the storage of ML models, SmartSim also allows coders to enable online training of machine learning models and use those models to make predictions inside of that same code. In essence, SmartSim tries to take the world of traditional HPC applications and bring it together with modern data science tools.

With SmartSim, you get an infrastructure library component and a client library component. The infrastructure library helps users set up, configure, run and monitor simulations from a Python script. The SmartSim infrastructure library basically provides a lightweight API for users to create what we call experiments. These experiments may be a combination of traditional HPC applications and other data science tools. SmartSim’s infrastructure library automatically deploys the infrastructure on the compute resources that’s needed to accomplish whatever that experiment describes (e.g., having a tensor flow backend to do online inference). 

The client library that's a part of SmartSim enables users to embed this machine learning capability inside of traditional applications.  The library is available in four languages, Python, C, C++ and Fortran. It provides a very simple API that allows the transfer of data between the traditional applications and the database. The simplicity of the API allows users to rapidly integrate their application with only a minimal amount of modification to the original source code (usually less than 10 lines).  

One of the early use cases that the designers focused on was using SmartSim to enable better predictions inside of a global ocean model. The [MOM6 (Modular Ocean Model)](https://www.gfdl.noaa.gov/mom-ocean-model/) global ocean model has an algorithm that calculates a term called Eddy Kinetic Energy (EKE) which governs the strength of turbulence. It turns out that the parameterization is not very accurate. So, using SmartSim, we trained a machine learning model on a high fidelity run to learn the mapping from a coarsened version of the quantities (similar to those in the low fidelity run) to the true EKE. Not only did that machine learning model improve the accuracy by at least 20%, but there was no visible degradation in performance, even though this simulation required about 1.6 million inferences per second. 

SmartSim is great for users who have very specialized domain expertise in things like computational fluid dynamics or molecular dynamics; but don’t necessarily have the knowledge set to deploy the machine learning infrastructure for high performance. SmartSim removes that technical barrier for users so that they can spend more time experimenting with combining scientific simulations and ML.

For more information on SmartSim, please reference the [SmartSim page](https://developer.hpe.com/platform/smartsim/home) found on the [HPE Developer Community portal](https://developer.hpe.com/). You can also access [SmartSim’s GitHub page](https://github.com/CrayLabs/SmartSim). 

