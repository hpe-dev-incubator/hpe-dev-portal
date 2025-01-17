---
title: Using the gdb4hpc debugger at scale with a CUDA/MPI HPC application
date: 2025-01-17T16:37:53.003Z
author: Josh Chandler
authorimage: /img/e01ld9fh0jz-u014j40c3d2-43d529500caf-192.jpg
thumbnailimage: ""
disable: false
tags:
  - HPE Cray Programming Environment
  - gdb4hpc
  - debuggers
  - developer tools
  - HPC
  - CPE
  - cray
---
Command line debuggers for Linux have existed for decades. The gdb debugger is the most famous and arguably the most powerful. But gdb has a weakness when it comes to HPC applications - it can only run on one system at a time. gdb can't be used to debug an HPC application at scale because HPC applications run tens of thousands of processes on thousands of systems at once!

This is where gdb4hpc comes in. gdb4hpc is part of the HPE Cray Programming Environment package. It captures the powerful features of gdb and allows the user to apply them to an HPC application at scale. gdb4hpc can debug HPC applications running on thousands of nodes.

gdb4hpc works by connecting the user to many instances of gdb at once. gdb4hpc controls all of the instances of gdb at once and aggregates and filters the results into representations that will comfortably fit on a single terminal screen.

<center><img src="/img/gdb4hpc-controlling-gdbs.png" width="95%" alt="Illustration showing how gdb4hpc connects to individual gdb instances. A single gdb4hpc instance is run on the login node. On each compute node, multiple application ranks are running. Each application rank has an instance of gdb attached to it. In turn, gdb4hpc remotely attaches to each individual gdb instance." title="gdb4hpc controlling multiple instances of gdb"></center>

In this tutorial, you will learn how to debug a multinode MPI/CUDA application
with gdb4hpc in the HPE Cray Programming Environment. This tutorial uses a CUDA
application and NVIDIA GPUs as examples, but the concepts are applicable to HIP
applications on AMD GPUs as well.

## Prerequisites

This tutorial assumes you already have a familiarity with command line debuggers, git, MPI, and CUDA.

You will need a system with access to Cray C++ compilers and gdb4hpc, which are parts of the HPC Cray Programming Environment. You will also need access to the NVIDIA C++ compiler.

## Setup

To set up the debugging session, you will need to obtain the sample application
and compile it for your chosen GPU with debug information.

### Download The Sample Code

For this tutorial, you will use the `simpleMPI` example from
[NVIDIA's cuda-samples repository](https://github.com/NVIDIA/cuda-samples).
`simpleMPI` does a simple distributed calculation involving square roots and averages:

1. `simpleMPI` generates millions of random floats (2,560,000 per node)
2. `simpleMPI` uses MPI to distribute those numbers across multiple compute nodes
3. `simpleMPI` uses uses CUDA to calculate the square root of each number
4. `simpleMPI` uses MPI to collect the resulting square roots and average them

Start by cloning the sample code repository.

```
$ git clone https://github.com/NVIDIA/cuda-samples.git
```

Next, navigate to the directory containing the `simpleMPI` sample.

```
$ cd cuda-samples/Samples/0_Introduction/simpleMPI
```

The sample comes with some source files, some Visual Studio project files, a
Makefile, and a README.

```
$ ls
Makefile       simpleMPI.cu          simpleMPI_vs2017.vcxproj  simpleMPI_vs2022.sln
README.md      simpleMPI.h           simpleMPI_vs2019.sln      simpleMPI_vs2022.vcxproj
simpleMPI.cpp  simpleMPI_vs2017.sln  simpleMPI_vs2019.vcxproj
```

For this tutorial, you will only need the following source files:

```
simpleMPI.cpp  simpleMPI.cu  simpleMPI.h
```

Remove the other files if desired.

```
$ rm *.sln *.vcxproj README.md Makefile
```

### Build The Application

To compile the application, load the appropriate compilers and compile the
sample application for your chosen GPU architecture with debug information.

#### Load Compilers

The version of the `cce` and `cuda` compilers that you should load depend on
which GPU architecture you will be compiling for and the version of the CUDA
drivers on your system. Find your GPU on the [NVIDIA GPU Compute Capability page](https://developer.nvidia.com/cuda-gpus) and choose a version of CUDA that
supports the required compute capability. Then load an appropriate CCE version.
For information about which CCE versions support which versions of CUDA, see
the [HPE Cray Programming Environment release announcements](https://cpe.ext.hpe.com/docs/latest/release_announcements/index.html). If in doubt, the default versions on your system
should work just fine.

When writing this tutorial, I used CCE 17 and CUDA 12 and ran the application on NVIDIA A100 GPUs, but the debugging process is the same for any compiler combination.

After deciding which versions you want, use the `module` command in a terminal to ensure that the Cray `CC` compiler and the NVIDIA `nvcc` compiler are available.

```
$ module load cce/17
$ module load cuda/12
```

You can check that your environment is set up correctly by checking that CC
(the Cray CCE C++ compiler) and nvcc (the NVIDIA CUDA application compiler)
are available in the terminal.

```
$ CC --version
Cray clang version 17.0.1  (5ec9405551a8c8845cf14e81dc28bff7aa3935cb)
...

$ nvcc --version
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2024 NVIDIA Corporation
Built on Thu_Jun__6_02:18:23_PDT_2024
Cuda compilation tools, release 12.5, V12.5.82
...
```

#### Compile the Application

The sample application comes with a Makefile, but it's not compatible with the
HPE Cray Programming Environment. You will compile the application manually.

#### Debug Info

When compiling an application, compilers apply optimizations to make the resulting
application faster and smaller. These optimizations often rearrange the order
of code or completely remove it which makes reasoning about the original code
at runtime difficult. When preparing to debug an application, you need to tell
the compiler to disable these optimizations and include extra information that
the debugger can use to reason about the original code.

#### Compile the .cu File

The simpleMPI.cu file contains the code that will be run on the GPU. Use
nvcc to compile it.

```
$ nvcc -g -G -O0 -c -ccbin=cc -gencode arch=... simpleMPI.cu -o simpleMPI_gpu.o
```

The `-g` flag tells nvcc to include debugging information for the host code
(the code that will run on the CPU) and the `-G` flag tells nvcc to include
debugging information for the device code (the code that will run on the GPU).
`-O0` disables optimizations for the host code. `-G` implicitly disables
optimizations for the device code.

`-c` tells the compiler to produce an object file instead of a executable. An
object file is a mostly-compiled program that only needs to be linked to create
an executable. After you compile the .cpp file in the next section, you will
link the object files together to create the final executable.

nvcc does not actually fully compile C/C++. It actually processes the CUDA
directives in the .cu file and produces a new C/C++ file where the CUDA
directives are replaced with the proper C/C++ code that interacts with the CUDA
API to do the work of loading the correct GPU driver etc. `-ccbin=cc` tells
nvcc to use the `cc` compiler to do the actual compilation of the generated
C/C++ code. When the Cray CCE module is loaded, cc is the Cray C/C++ compiler.

`-gencode` tells nvcc which GPU architecture to target. The actual value for
this argument will vary based on which GPU you are targeting. Refer to the
[NVIDIA compute capabilities table](https://developer.nvidia.com/cuda-gpus) to
find the compute capability of your GPU. For example, the A100 GPU that I am
targeting while writing this tutorial has a compute capability of 8.0. Take the compute
capability of your GPU and pass it to nvcc via the `-gencode` flag by
removing the decimal point and embedding it in an `arch=compute_XX,code=sm_XX`
pair. For my A100 example, the complete option is `-gencode compute_80,code=sm_80`.

`simpleMI.cu` is the input file and `-o simpleMPI_gpu.o` tells `nvcc` to call
the output file `simpleMPI_gpu.o`.

My complete nvcc invocation for an A100 GPU looks like this:

```
$ nvcc -g -G -c -ccbin=cc -gencode arch=compute_80,code=sm_80 simpleMPI.cu -o simpleMPI_gpu.o
```

Refer to the [`nvcc` user manual](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html)
and the [compilation section of the cuda-gdb documentation](https://docs.nvidia.com/cuda/cuda-gdb/index.html#compiling-the-application)
for more information.

#### Compile the .cpp File

The simpleMPI.cpp file contains code that will be run on the CPU. It is the
entry point to the program and contains the MPI operations. Use CC to compile
it.

```
$ CC -g -O0 -c simpleMPI.cpp -o simpleMPI_cpu.o
```

The flags have the same meanings as in the nvcc compilation. The Cray CC
compiler will automatically include the flags needed for building with MPI.

#### Link the Application and Produce an Executable

Finally, use CC to link the two object files into the final executable.

```
$ CC simpleMPI_gpu.o simpleMPI_cpu.o -o simpleMPI
```

#### Test The Application

Test that the application was compiled correctly by running it on multiple
nodes. For example, on a Slurm system:

```
$ srun -n8 -N2 --ntasks-per-node 4 --exclusive -p griz256 ./simpleMPI
Running on 8 nodes
Average of square roots is: 0.667337
PASSED
```

Your srun command's flags may vary depending on your system. You should launch the
job on nodes with your targeted GPU with one rank per GPU. See
[the `srun` documentation](https://slurm.schedmd.com/srun.html)
for how to achieve a correct job launch on your system.

In my specific example:

`-n8 -N2 --ntasks-per-node 4` tells Slurm to run 8 ranks across 2 nodes,
splitting the job evenly by running 4 ranks on each node. In this example we
are using nodes with 4 A100s each.

`--exclusive` tells Slurm to run on nodes that aren't being used by anyone
else, and to not let anyone else use them while running the job. Only one
application can use each GPU at a time, so we need to make sure that we aren't
given nodes that have GPUs that are already in use.

`-p griz256` tells Slurm to use the nodes in the griz256 partition. In my case,
the griz256 partition designates all the nodes with A100s. Your partition name
will probably be different.

## Debugging

### Load gdb4hpc and cuda-gdb

You're ready to start debugging! Load the gdb4hpc debugger.

```
$ module load gdb4hpc
$ gdb4hpc --version
gdb4hpc-4.16.3.
```

For this tutorial, I am using gdb4hpc 4.16.3, but any version above 4.13.1
will have the commands used in this tutorial.

gdb4hpc will use the cuda-gdb debugger for GPU debugging. cuda-gdb is
provided by the cuda module that you loaded for building the application.
Check that cuda-gdb is available.

```
$ cuda-gdb --version
NVIDIA (R) cuda-gdb 12.5
Portions Copyright (C) 2007-2024 NVIDIA Corporation
Based on GNU gdb 13.2
Copyright (C) 2023 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

#### Launch the Application in gdb4hpc

Start gdb4hpc. You will be dropped into a command line interface. gdb4hpc is operated
by issuing debugging commands on the command line. The commands should be familiar
to anyone who has used gdb before.

```
$ gdb4hpc
gdb4hpc 4.16.3. - Cray Interactive Parallel Debugger
With Cray Comparative Debugging Technology.
Copyright 2007-2024 Hewlett Packard Enterprise Development LP.
Copyright 1996-2016 University of Queensland. All Rights Reserved.

Type "help" for a list of commands.
Type "help <cmd>" for detailed help about a command.
dbg all>
```

Use the `launch` command to start the application in the debugger.

```
dbg all> launch $simpleMPI{8} --launcher-args="-N2 --ntasks-per-node=4 --exclusive -p griz256" --gpu ./simpleMPI
Starting application, please wait...
Launched application...
0/8 ranks connected... (timeout in 300 seconds)
..
8/8 ranks connected.
Created network...
Connected to application...
Launch complete.
simpleMPI{0..7}: Initial breakpoint, main at simpleMPI.cpp:63
```

`$simpleMPI{8}` tells gdb4hpc to launch a job with 8 ranks and give it a
handle called `simpleMPI`.

`--launcher-args` tells gdb4hpc which WLM arguments to use to launch the job
correctly. Use the same arguments you used in the **Test The
Application** section.

The `--gpu` flag tells gdb4hpc to use the appropriate GPU-aware debugger. Here, that's cuda-gdb.

The final argument, `./simpleMPI`, specifies the binary to launch.

After the launch completes, gdb4hpc stops at `main` and gives you control.

#### Stop at a Breakpoint in a GPU kernel

The sample application contains one CUDA Kernel called `simpleMPIKernel`
defined in simpleMPI.cu. The source code for the kernel looks like this:

```cpp
52  // Device code
53  // Very simple GPU Kernel that computes square roots of input numbers
54  __global__ void simpleMPIKernel(float *input, float *output) {
55    int tid = blockIdx.x * blockDim.x + threadIdx.x;
56    output[tid] = sqrt(input[tid]);
57  }
```

Set a breakpoint at the first line of the kernel with the `break` command, just
like you would in gdb:

```
dbg all> break simpleMPI.cu:55
simpleMPI{0..7}: Breakpoint 1: file simpleMPI.cu, line 55.
```

> You could have also set the breakpoint via the function name by typing `break
> simpleMPIKernel`.

Now use the `continue` command to run the application until it reaches the
breakpoint in the kernel.

```
dbg all> continue
dbg all> <$simpleMPI>: Running on 8 nodes
simpleMPI{0..7}: Breakpoint 1,  at simpleMPI.cu:55
```

The application has stopped in a GPU kernel. From here you can use the usual
debugger commands like `print`, `step`, `next`, etc. You can use `print` to
inspect GPU memory as you would any other memory. Here we print the first 8 items
of the `input` array. Since the program initializes the array with random data,
the result is different for each rank, and your data might be different.

```
dbg all> info locals
simpleMPI{0..7}: Name:tid                       Type:@register int
simpleMPI{0..7}: Name:input                     Type:@generic float * @parameter
simpleMPI{0..7}: Name:output                    Type:@generic float * @parameter
dbg all> print input[0]@8 # print the first 8 items of the input array
simpleMPI{0}: {0.840188,0.394383,0.783099,0.79844,0.911647,0.197551,0.335223,0.76823}
simpleMPI{1}: {0.432718,0.407395,0.918358,0.348798,0.421943,0.527366,0.664573,0.899948}
simpleMPI{2}: {0.490992,0.530234,0.736292,0.0698217,0.825561,0.719689,0.26409,0.439787}
simpleMPI{3}: {0.404152,0.403803,0.990251,0.10481,0.267578,0.685576,0.794025,0.972998}
simpleMPI{4}: {0.113738,0.293829,0.443866,0.706545,0.762252,0.451777,0.93063,0.569985}
simpleMPI{5}: {0.386505,0.760585,0.354206,0.784775,0.329661,0.25768,0.0700815,0.955718}
simpleMPI{6}: {0.959459,0.299068,0.889675,0.0221367,0.809361,0.0220988,0.373968,0.589243}
simpleMPI{7}: {0.839492,0.778462,0.195212,0.832727,0.125331,0.211325,0.0624168,0.56848}
```

#### CUDA Threads and CUDA Commands

gdb4hpc supports cuda-gdb's `cuda` commands.

To get info about currently running CUDA threads, use `info cuda threads`.

```
dbg all> info cuda threads
simpleMPI{0}: Showing one thread per location; use -v for full list.
simpleMPI{0}:    BlockIdx ThreadIdx   Count    Location
simpleMPI{0}: Kernel 0
simpleMPI{0}:   (649,0,0)   (0,0,0)   7840 simpleMPI.cu    54
simpleMPI{0}: *   (0,0,0)   (0,0,0) 213344 simpleMPI.cu    55
simpleMPI{1}: Showing one thread per location; use -v for full list.
simpleMPI{1}:    BlockIdx ThreadIdx   Count    Location
simpleMPI{1}: Kernel 0
simpleMPI{1}:   (649,0,0)   (0,0,0)   7936 simpleMPI.cu    54
simpleMPI{1}: *   (0,0,0)   (0,0,0) 213248 simpleMPI.cu    55
simpleMPI{2}: Showing one thread per location; use -v for full list.
simpleMPI{2}:    BlockIdx ThreadIdx   Count    Location
simpleMPI{2}: Kernel 0
simpleMPI{2}:   (651,0,0)   (0,0,0)   8896 simpleMPI.cu    54
simpleMPI{2}: *   (0,0,0)   (0,0,0) 212288 simpleMPI.cu    55
...
```

You can see that each rank's GPU threads are all stopped in the
`simpleMPIKernel` in `simpleMPI.cu` lines 54 or 55. The ranks have different
locations because gdb4hpc debugs CUDA applications in
[all-stop mode](https://sourceware.org/gdb/current/onlinedocs/gdb.html/All_002dStop-Mode.html).
All-stop mode means that once one thread stops, all other threads are stopped
immediately. This means that every thread was stopped as soon as the first
thread hit the breakpoint, resulting in all threads halting wherever they
happened to be at the time. Because of this, your locations might be slightly
different.

The current thread (the rank that any gdb4hpc commands will apply to) is
indicated with a `*` symbol. You can switch the current block or thread (or warp or
lane) by using the `cuda [block x] thread y` command. Since this application
uses a one dimensional grid of one dimensional thread blocks, you can derive
block and thread IDs by simply using the first number in the block's/thread's
(x, 0, 0) tuple.

The example above shows block 649 on rank 0 as being in a different location
than block 0 thread 0. Your exact block and thread numbers might be different.
Use `cuda block x thread y` to switch to a different block and thread. You can
confirm the switch by printing the CUDA kernel built in variables `blockIdx`
and `threadIdx`.

```
dbg all> cuda block 649 thread 0
simpleMPI{0}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 2, sm 0, warp 59, lane 0]
simpleMPI{0}: 0x00007fcef725da10        54      in simpleMPI.cu
simpleMPI{1}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 0, sm 0, warp 59, lane 0]
simpleMPI{1}: 0x00007f282725da20        54      in simpleMPI.cu
simpleMPI{2}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 3, sm 0, warp 59, lane 0]
simpleMPI{2}: 55        in simpleMPI.cu
simpleMPI{3}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 1, sm 0, warp 59, lane 0]
simpleMPI{3}: 0x00007f9dc725da20        54      in simpleMPI.cu
simpleMPI{4}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 2, sm 0, warp 59, lane 0]
simpleMPI{4}: 0x00007ff3d725da20        54      in simpleMPI.cu
simpleMPI{5}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 0, sm 0, warp 59, lane 0]
simpleMPI{5}: 0x00007f79c325da20        54      in simpleMPI.cu
simpleMPI{6}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 3, sm 0, warp 59, lane 0]
simpleMPI{6}: 0x00007f410525da20        54      in simpleMPI.cu
simpleMPI{7}: [Switching focus to CUDA kernel 0, grid 1, block (649,0,0), thread (0,0,0), device 1, sm 4, warp 50, lane 0]
simpleMPI{7}: 55        in simpleMPI.cu
dbg all> print blockIdx
simpleMPI{0..7}: {x = 649, y = 0, z = 0}
dbg all> print threadIdx
simpleMPI{0..7}: {x = 0, y = 0, z = 0}
```

#### More CUDA Commands

To see what other `info` commands are available, use `cuda info help`:

```
dbg all> cuda help info
simpleMPI{0..7}: Print informations about the current CUDA activities. Available options:
simpleMPI{0..7}:          devices : information about all the devices
simpleMPI{0..7}:              sms : information about all the SMs in the current device
simpleMPI{0..7}:            warps : information about all the warps in the current SM
simpleMPI{0..7}:            lanes : information about all the lanes in the current warp
simpleMPI{0..7}:          kernels : information about all the active kernels
simpleMPI{0..7}:         contexts : information about all the contexts
simpleMPI{0..7}:           blocks : information about all the active blocks in the current kernel
simpleMPI{0..7}:          threads : information about all the active threads in the current kernel
simpleMPI{0..7}:     launch trace : information about the parent kernels of the kernel in focus
simpleMPI{0..7}:  launch children : information about the kernels launched by the kernels in focus
simpleMPI{0..7}:          managed : information about global managed variables
simpleMPI{0..7}:             line : information about the filename and linenumber for a given $pc
simpleMPI{0..7}:
```

There are also other top level `cuda` commands other than `info`:

```
dbg all> cuda help
simpleMPI{0..7}: Print or select the CUDA focus.
simpleMPI{0..7}:
simpleMPI{0..7}: List of cuda subcommands:
simpleMPI{0..7}:
simpleMPI{0..7}: cuda block -- Print or select the current CUDA block.
simpleMPI{0..7}: cuda device -- Print or select the current CUDA device.
simpleMPI{0..7}: cuda grid -- Print or select the current CUDA grid.
simpleMPI{0..7}: cuda kernel -- Print or select the current CUDA kernel.
simpleMPI{0..7}: cuda lane -- Print or select the current CUDA lane.
simpleMPI{0..7}: cuda sm -- Print or select the current CUDA SM.
simpleMPI{0..7}: cuda thread -- Print or select the current CUDA thread.
simpleMPI{0..7}: cuda warp -- Print or select the current CUDA warp.
simpleMPI{0..7}:
simpleMPI{0..7}: Type "help cuda" followed by cuda subcommand name for full documentation.
simpleMPI{0..7}: Type "apropos word" to search for commands related to "word".
simpleMPI{0..7}: Type "apropos -v word" for full documentation of commands related to "word".
simpleMPI{0..7}: Command name abbreviations are allowed if unambiguous.
```

See [the cuda-gdb documentation](https://docs.nvidia.com/cuda/cuda-gdb/index.html) for more information.

#### Single Stepping

The usual `step` and `next` commands are supported. In a GPU kernel, stepping
has the granularity of a warp. A warp is a group of 32 GPU threads and is the
granularity the GPU scheduler works at. See
[the cuda-gdb documentation](https://docs.nvidia.com/cuda/cuda-gdb/index.html#single-stepping)
for more info.

```
simpleMPI{0..7}: Breakpoint 1,  at simpleMPI.cu:55
dbg all> list 55
simpleMPI{0..7}: 50       }
simpleMPI{0..7}: 51
simpleMPI{0..7}: 52     // Device code
simpleMPI{0..7}: 53     // Very simple GPU Kernel that computes square roots of input numbers
simpleMPI{0..7}: 54     __global__ void simpleMPIKernel(float *input, float *output) {
simpleMPI{0..7}: 55       int tid = blockIdx.x * blockDim.x + threadIdx.x;
simpleMPI{0..7}: 56       output[tid] = sqrt(input[tid]);
simpleMPI{0..7}: 57     }
simpleMPI{0..7}: 58
simpleMPI{0..7}: 59     // Initialize an array with random data (between 0 and 1)
dbg all> next # set tid
simpleMPI{0..7}: 56       output[tid] = sqrt(input[tid]);
dbg all> p tid
simpleMPI{0..7}: 64
dbg all> p output[tid]
simpleMPI{0..7}: 0
dbg all> n
simpleMPI{0..7}: 57     }
dbg all> p output[tid]
simpleMPI{0}: 0.516397
simpleMPI{1}: 0.392356
simpleMPI{2}: 0.883166
simpleMPI{3}: 0.806327
simpleMPI{4}: 0.458106
simpleMPI{5}: 0.999046
simpleMPI{6}: 0.366925
simpleMPI{7}: 0.646477
```

## Next Steps

You now know how to start debugging a multinode MPI/CUDA application with gdb4hpc in the HPE Cray Programming Environment!

In general, gdb4hpc's debugging capabilities are that of the underlying GPU
debugger. See the [cuda-gdb documentation](https://docs.nvidia.com/cuda/cuda-gdb/index.html)
for more capabilities.

For more information about gdb4hpc, see [the gdb4hpc documentation](https://cpe.ext.hpe.com/docs/latest/debugging-tools/index.html#gdb4hpc).

Happy bug hunting!