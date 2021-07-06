---
title: SmartSim
version: v 0.3.1
description: Enabling Machine Learning and AI for traditional high performance
  computing (HPC) simulations.
image: /img/smartsim_large.png
width: large
priority: 2
tags:
  - SmartSim
---
# What is SmartSim?

Recently, there is growing interest in applying machine-learning (ML) algorithms to improve scientific simulation efficiency and accuracy. New software approaches are needed to couple existing scientific applications, traditionally written in Fortran/C/C++ and MPI, to rapidly evolving ML and data analytics libraries, typically written in Python. Currently, the diversity of programming languages, dependence on file input/output (I/O), and large variance in compute resource requirements for scientific applications makes it difficult to perform online analysis, training, and inference with most ML and data analytics packages at the scale needed for numerical simulations.

How does one connect the two programming paradigms of numerical model development and machine learning? While on the surface, this question seems to approach the problem, we believe the true difficulty (and opportunity) in bridging these workloads needs to be reformulated in terms of data exchange: How to pass data between a simulation and ML model at scale? SmartSim provides the answer to this challenge.

SmartSim is a software framework that facilitates the convergence of numerical simulations and AI workloads on heterogeneous architectures. SmartSim enables simulations in Fortran,C, C++ and Python to execute ML models hosted within in-memory storage (DRAM) facilitating online inference at simulation runtime. In addition, SmartSim’s API orchestrates the movement of data between simulation and learning com-ponents with single-line put/get semantics. SmartSim can host ML models on CPU-only or GPU-enabled compute nodes adjacent to or co-located with the simulation. SmartSim is portable and can be run on laptops and scales to thousands of processors as shown in this work.

SmartSim is comprised of two libraries, a single light weight client library, the SmartRedis, that is compiled into end-users simulation and an Infrastructure Library (IL) that facilitates workflow around simulations. SmartSim users are able to run their ML models written in Python in either TensorFlow, TensorFlow-Lite, Keras, Pytorch, or any framework that can serialize to ONNX(e.g. scikit learn).In addition to online inference, SmartSim also facilitates online analysis, visualization, learning, and computational steering. Because simulation data can be held in co-located DRAM, scientists can interact with and perturb model data manually or programmatically during the course of a simulation. SmartSim enables users to execute nearly any simulation from a Jupyter notebook on HPC systems that support PBSPro, Slurm, Cobalt, as well as laptops and workstations.