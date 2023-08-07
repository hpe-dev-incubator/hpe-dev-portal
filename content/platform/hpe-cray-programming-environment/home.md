---
title: HPE Cray Programming Environment
version: "1"
description: HPE Cray Programming Environment (CPE) suite offers programmers a
  comprehensive set of tools for developing, porting, debugging, and tuning
  applications. The programming environment simplifies the transition to new
  hardware architectures and configurations by automatically applying
  optimizations on HPC applications that use existing programming models with a
  simple recompile.
image: /img/platforms/cray_logo_-2018-.svg.png
width: large
priority: 5
active: true
tags:
  - cray
  - CPE
---

<style>
li {
    font-size: 27px;
    line-height: 33px;
    max-width: none;
}
</style>

HPE Cray Programming Environment (CPE) suite offers programmers a comprehensive set of tools for developing, porting, debugging, and tuning applications. The programming environment simplifies the transition to new hardware architectures and configurations by automatically applying optimizations on HPC applications that use existing programming models with a simple recompile.

The environment provides:    

* User environment (compiler drivers, hugepages, craype-api)        

* Compilers, programming languages, and models    

* Scalable communication libraries    

* Scientific and math libraries    

* Debugging tools    

* Profiling and performance optimization tools    


Learn more about the HPE Cray Programming Environment components

## HPE Cray user environment

Our user environment provides libraries that support code compilation and development environment setup. It includes compiler drivers, the hugepages utility, and the CPE API (craype-api).

PrgEnv modules provide wrappers (cc, CC, ftn) for both CCE and third-party compiler drivers. These wrappers call the correct compiler with appropriate options to build and link applications with relevant libraries as required by loaded modules.  Note that only dynamic linking is supported. These wrappers replace direct calls to compiler drivers in Makefiles and build scripts.

Hugepages: Standard Linux operating system typically supports base pages of size 4KiB. For high performance parallel workloads that involve data movement operations across a high-speed network, larger page sizes generally yield improved communication performance. On HPE Cray EX supercomputing systems, the Cray Operating System (COS) supports non-standard large page sizes to offer an additional layer of optimization. HPE CPE software stack is tightly integrated with COS and exposes this feature via craype-hugepages modules. Users can leverage this important optimization by loading specific craype-hugepages modules in their build and runtime environments.

CrayPE API (cray-api) provides software package integration with enhanced control when building multiple versions of a software product modulefile.

## HPE Cray Compiling Environment

Our Fortran, C, and C++ compilers are designed to help extract maximum performance from the systems regardless of the underlying architecture supporting ARM and x86-64 (Intel and AMD) processors, as well as AMD and NVIDIA accelerators.

The compilers identify regions of computation that are either sequential scalar or vector parallel, and automatically exploit these capabilities for the targeted system.

The compilers give programmers optimization feedback with an annotated listing of source code for easier application tuning. Our compilers integrate with debuggers and performance tools in the HPE Cray Programming Environment suite—enhancing each other's capability to generate correct and performant code.

The suite also includes integration with GNU, Intel, AMD, and NVIDIA programming environments, so developers can choose between multiple compilers and still use the libraries, debuggers, and performance analysis tools included in our suite to help optimize application performance.

We focus on standards compliance for code safety, application portability, and investment protection. Our compilers support standard programming languages (Fortran, C/C++, and UPC) and standard programming models such as OpenMP and OpenACC.

## HPE Cray Message Passing Toolkit (CMPT)

CMPT is a collection of libraries that provide portable, efficient, and flexible mechanisms for performing data transfers between parallel processes. It comprises HPE Cray MPI, HPE Cray OpenSHMEMX, HPE Cray PMI, and HPE Cray DSMML libraries.

HPE Cray MPI is an MPICH ABI compatible library tuned for Intel, AMD, and ARM CPUs as well as AMD and NVIDIA GPUs. It is a highly scalable implementation, customized for low latency and high bandwidth, both on-node and off-node, for point-to-point and collective communications. It is also highly optimized and tuned for the HPE Slingshot network architecture. Strategic optimizations for MPI I/O, MPI\_THREAD\_MULTIPLE, remote memory access (RMA), and integration with the performance analysis tools in the suite contribute to deliver ideal application performance for today's HPC codes.

HPE Cray OpenSHMEMX is a highly scalable implementation of the OpenSHMEM standards library interface specification. It supports Partitioned Global Address Space (PGAS) style of programming to cater to the needs of distributed memory applications with highly irregular and random communication models. It is optimized specifically for system architectures involving Intel, AMD, and ARM CPUs. HPE Cray OpenSHMEMX is tuned for exposing the rich set of features available in HPE Slingshot interconnect through operations like remote memory access (RMA), atomic memory updates, put-with-signal, scalable-collective communication, memory ordering, and effective multithreading.

## HPE Cray Scientific and Math Libraries

This suite offers a comprehensive collection of highly tuned linear algebra subroutines designed to help extract maximum performance from the system with the least amount of effort.

Customized Cray LibSci (including optimized BLAS, LAPACK, ScaLAPACK, and IRT), Cray LibSci_ACC (GPU accelerated BLAS, and LAPACK), and Cray FFTW (optimized fast Fourier transform routines) are designed to take full advantage of the underlying hardware, optimizing for both intra-node and inter-node performance on all HPE HPC systems.

The libraries are highly tuned and optimized to select performant algorithms at runtime for a variety of HPE HPC systems. They also feature simplified interfaces into complex software (no source code changes required to access optimized algorithms) and integrate with the HPE Cray Compiling Environment for better productivity.

NetCDF, HDF5, and Parallel NetCDF I/O libraries are built with the supported compiling environments and are integrated with the HPE Cray Compiling Environment.

## Debugging tools

The HPE Cray Programming Environment offers traditional debuggers combined with new innovative techniques. Together, these technologies allow users to address debugging problems at a broader range and scale than conventional techniques. This means that programmers can spend less time debugging and more time creating. Included are:

* Comparative Debugger: This market-unique tool helps programmers uncover issues by running two applications side by side. If the values of the selected data structures diverge, the user is notified that an error may exist. This capability is useful for locating errors that are introduced when applications are modified through code, compiler, or library changes, and for application porting between architectures (for example, between CPUs and GPUs) or programming models.    

* GDB for HPC is based on the popular GDB command-line debugger used to debug applications compiled with Fortran, C, and C++ compilers with enhancements to provide a GDB debugging experience for applications that run at scale across many nodes. The tool enables users to run a traditional scalable debugging session—either by launching an application or by attaching it to an already-running application. A GDB for HPC debug session retrieves debug information from thousands of processes and presents merged backtraces and data, removing vast amounts of duplicate information.    

* Valgrind for HPC: Parallel memory analysis tool based on Valgrind debugger used for applications compiled with Fortran, C, and C++ compilers—it aggregates common errors into a single output record for easier analysis of potential memory problems within applications that run at scale.    

* Stack Trace Analysis Tool (STAT): Helps developers identify if an application is hung or still making progress when running. Generates a merged backtrace for applications so users can get a better insight into application behavior at a function level.    

* Tool for Abnormal Termination Processing (ATP): When an application crashes, the tool detects a signal and generates a merged backtrace resulting in a minimal core file set so that programmers do not have to plough through an enormous number of core files when debugging the application.    

* Sanitizers for HPC: Help developers detect memory and thread errors for easier analysis and debugging of their applications at scale by aggregating and analyzing output of LLVM sanitizers at scale.    

We also offer support for traditional debugging mechanisms via integration with TotalView by Perforce and Arm Forge.

## Profiling and performance optimization tools

Comprehensive collection of tools designed to reduce the time and effort associated with porting and tuning of applications on HPE and HPE Cray systems. We offer different tools and experiments to fit different developer needs and choice of interfaces for ease of use.

* Performance analysis tool (PAT) brings valuable insight when analyzing bottlenecks to improve performance of applications that run across the whole system. The tool exposes a wide set of indicators, such as computation, communication, I/O, and memory statistics and displays a program’s top time consumers and bottlenecks (via unique and critical load balance analysis) for jobs at scale. It then automatically generates observations and suggestions to improve code performance.


As ease of use is an important feature of the tool suite, both simple and advanced interfaces are available, offering both a simple path to get started and a wealth of capability for analyzing the most complex codes.

* Programmers can quickly assess the type and severity of performance issues by using our visualization tool, which complements text reports and summarizes programs’ performance data in graphs and charts, allowing users to easily drill down to get to the bottom of issues.    

* Code parallelization assistant helps developers reveal hidden potential of their application via code restructuring. The tool extends our existing performance analysis and visualization technology by combining performance statistics and program source code visualization with our compiling environment optimization feedback. This tool can easily navigate through source code to highlight dependencies or bottlenecks during the optimization phase of program development or porting.    


Using the program library provided by our compiling environment and the performance data collected by our performance, measurement, and analysis tools, users can navigate through their source code to understand which high-level loops could benefit from OpenMP parallelism.

- - -

# Any questions on HPE Cray Programming Environment?

Join the [HPE Developer Slack Workspace](https://slack.hpedev.io/) and start a discussion in our [\#hpe-cray-programming-environment](https://hpedev.slack.com/archives/C04TG4XJBL7) channel.