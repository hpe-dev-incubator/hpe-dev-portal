---
title: Chapel
version: v 2.01.8964
description: A programming language designed for productive parallel computing
  from laptops to supercomputers.
image: /img/platforms/Chapel.svg
width: large
priority: 9
frontpage: true
active: false
tags:
  - chapel
---
# What is Chapel?

Chapel is a programming language designed for productive parallel computing on large-scale systems. Chapel's design and implementation have been undertaken with portability in mind, permitting Chapel to run on multicore desktops and laptops, commodity clusters, and the cloud, in addition to the high-end supercomputers for which it was designed. Chapel's design and development are being led by Cray Inc. in collaboration with contributors from academia, computing centers, industry, and the open-source community.

Chapel supports a multithreaded execution model via high-level abstractions for data parallelism, task parallelism, concurrency, and nested parallelism. Chapel's locale type enables users to specify and reason about the placement of data and tasks on a target architecture in order to tune for locality and affinity. Chapel supports global-view data aggregates with user-defined implementations, permitting operations on distributed data structures to be expressed in a natural manner. In contrast to many previous higher-level parallel languages, Chapel is designed around a multiresolution philosophy, permitting users to initially write very abstract code and then incrementally add more detail until they are as close to the machine as their needs require. Chapel supports code reuse and rapid prototyping via object-oriented design, type inference, and features for generic programming. Existing code can be integrated into Chapel programs (or vice-versa) via interoperability features.

Chapel was designed from first principles rather than by extending an existing language. It is an imperative block-structured language, designed to be easy to learn for users of Python, C, C++, Fortran, Java, Matlab, and the like. While Chapel builds on concepts and syntax from many previous languages, its parallel features are most directly influenced by ZPL, High-Performance Fortran (HPF), and the Cray MTA™/Cray XMT™ extensions to C and Fortran.


- [Try Chapel Tutorials for Yourself](https://chapel-lang.org/docs/examples/index.html)
- [Learn more about Chapel](https://chapel-lang.org/)
- [Read the Introduction to Chapel Whitepaper](https://chapel-lang.org/publications/PMfPC-Chapel.pdf)
- [See Chapel's Performance](https://chapel-lang.org/performance.html)
- [Check out Chapel Newsletters](https://chapel.discourse.group/c/newsletters) 


[Join HPE and the active Chapel community on GitHub ![](Github)](https://github.com/chapel-lang/chapel) 

---

# Projects Powered by Chapel

[Arkouda ![](Github)](https://github.com/mhmerrill/arkouda) 

Arkouda allows a user to interactively issue from the Python3 interpreter massively parallel computations on distributed data using functions and syntax that mimic NumPy, the underlying computational library used in the vast majority of Python data science workflows. The computational heart of Arkouda is a Chapel interpreter that accepts a pre-defined set of commands from a client (currently implemented in Python) and uses Chapel's built-in machinery for multi-locale and multithreaded execution. Arkouda has benefited greatly from Chapel's distinctive features and has also helped guide the development of the language.

[CHAMPS ![](Github)](https://www.polymtl.ca/expertises/en/laurendeau-eric) 

CHAMPS is multi-physics software oriented toward fluid dynamics, written completely in Chapel and developed to solve systems of equations in a general manner. A key theme is to easily expand the capabilities of the software while keeping good performance on distributed memory. The software currently handles 2D and 3D unstructured grids to solve RANS equations with a finite volume approach using the Spalart-Allmaras turbulence model for closure. Different spatial discretization schemes and linear solvers can be used, including a variety of solvers from the PETSc library for which an API has been developed. Other C libraries for which APIs were developed in this project include the CGNS (CFD General Notation System) library, the Intel MKL library and the METIS library. The overall performance achieved with Chapel is comparable to equivalent C/C++/MPI approaches. Future developments will include multi-fidelty simulations in aerodynamics, aero-elasticity, and aero-icing.

[CHGL ![](Github)](https://github.com/pnnl/chgl) 

The Chapel Hypergraph Library (CHGL) is a library for hypergraph computation in the Chapel language. Hypergraphs generalize graphs, where a hypergraph edge can connect any number of vertices. Thus, hypergraphs capture high-order, high-dimensional interactions between multiple entities that are not directly expressible in graphs. CHGL is designed to provide HPC-class computation with high-level abstractions and modern language support for parallel computing on shared- and distributed memory systems.

[ChOp ![](Github)](https://www.sciencedirect.com/science/article/abs/pii/S0167739X1930946X) 

This project aims at programming distributed algorithms for solving big instances of combinatorial optimization problems, taking into account productivity, parallel efficiency, heterogeneity, and fault tolerance. This project comprises heuristic and exact optimization algorithms, and its main application is a distributed Branch-and-Bound for solving permutation-based combinatorial problems.

[ChplUltra ![](Github)](https://github.com/sourceryinstitute/PAW/raw/gh-pages/PAW-ATM19/extendedAbstracts/PAW-ATM2019_abstract2.pdf) 

chplUltra is designed to simulate the dynamics of ultra-light dark matter for astrophysics. Ultralight dark matter is a relatively new proposal designed to alleviate some of the challenges faced by the more traditional WIMP (weakly interacting massive particles) candidates. It has a rich phenomenology, including the formation of Bose-Einstein condensate solitons and interference effects from the wave-like behavior of the particles. chplUltra is a pseudo-spectral fixed grid code designed to evolve the Schrodinger-Poisson equations. The code uses a Chapel distributed FFT routine, built around the serial FFTW library. Using Chapel allows the authors to rapidly extend the code and to simultaneously scale it out to ~100s of nodes. The code has been run on up to 512 nodes (18k cores) on a Cray XC system.

[CrayAI ![](Github)](https://cray.github.io/crayai/) 

CrayAI is a suite of distributed machine learning workflow libraries designed with HPC in mind. These libraries are portable, running on anything from a laptop up to a supercomputer. The core back-end of these libraries is written in Chapel, while the user-facing interface is Python. CrayAI currently consists of Cray HPO and Cray FS. Cray HPO is a distributed black-box hyperparameter optimization framework and Cray FS is a distributed feature selection library.

---

# Any questions on Chapel?

Join the conversation by chat on our [Chapel Gitter Channel](https://gitter.im/chapel-lang/chapel) or by posting to our [Chapel Discourse Forum](https://chapel.discourse.group/latest).

