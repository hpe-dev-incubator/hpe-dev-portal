---
title: "Understanding Concurrency in Python Part 2 - Multiprocessing"
date: 2020-02-19T17:23:08.924Z
author: Samarth Deyagond 
tags: []
path: understanding-concurrency-in-python-part-2-multiprocessing
---
![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture2-1582133413956.png)

In Part 1 of this series, [Understanding Concurrency in Python](https://developer.hpe.com/blog/understanding-concurrency-in-python-part-1-threading), I covered the timing of multi-threaded executions. Through specific examples, I showed you that, no matter how many cores you have on your computer, the Python threading library does not really help you fully exploit the abilities of multi-threading. But a resolution is available, which I promised to show you. I am covering that resolution here in Part 2. Thanks to the Python multiprocessing library, you can take complete advantage of all the cores in your computer and more efficiently handle CPU bound functions.

Multiprocessing allows you to run functions as independent Python processes on different cores. Even though these processes run independently, they can still communicate with each other when needed. 

Let’s look at an example where multiprocessing helps us achieve concurrency and the speed required to handle a CPU bound function. To compare and contrast our results, we will be using the same example we looked at in our previous post to determine how threading affected CPU bound functions.

Step 1: Import the necessary libraries and modules.


```

import multiprocessing
import time

```

Step 2: Define a CPU intensive function cpu_bound() that accepts a number, multiplies it by a million, and calculates the sum of all the numbers in a range of 0 to that product. For ease of reference, we’ll use the same example we used in Understanding Concurrency in Python Part 1 – Threading. As we did previously, remember to create an additional list of random numbers. The example we used before is shown below:


```

def cpu_bound(num):
    return sum([i for i in range(num*1000000)])

numbers = [11, 23, 53, 34]

```

When we previously used this example as we looked at threading, we determined the time taken for regular execution of this function iterated over the list of numbers. In that instance, the results were as shown below:


![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture4-1582133425400.png)


Step 3: This time, let’s capture the time taken to execute this CPU intensive function using the Python Multiprocessing library to invoke multiple processes. Here, we use the Process method of the multiprocessing library, which takes two parameters. One parameter is target, which is set to *cpu_bound* function, and another is *args,* which is the arguments for the function *cpu_bound* function.


```

start_time = time.time()
for number in numbers:
    p = multiprocessing.Process(target=cpu_bound, args=(number,))
    p.start()
print("Time taken for multi-processing execution", time.time()-start_time)

```

When I re-executed the regular and multiprocessing-fashioned code, the results were as follows:


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture5-1582133442778.png)

This is so awesome! You can see the drastic reduction in the time taken to execute the same *cpu_bound()* function using the multiprocessing library where *cpu_bound* function is executed as an independent process for every number in the list.

The complete code that we used to illustrate how the multiprocessing library helps would look like this:


```

import multiprocessing
import time


def cpu_bound(num):
    return sum([i for i in range(num*1000000)])

numbers = [11, 23, 53, 34]

start_time = time.time()
for number in numbers:
    cpu_bound(number)

print("Time taken for regular execution", time.time()-start_time)
start_time = time.time()
for number in numbers:

    p = multiprocessing.Process(target=cpu_bound, args=(number,))
    p.start()
    p.join()

print("Time taken for multi-processing execution", time.time()-start_time)

```

If you are working on a Microsoft Windows-based system, you can open your Task Manager while the above Python code is running to see the number of Python processes being spawned.


![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture6-1582133457943.png)

## Summary

As promised, I’ve shown you how to achieve efficient concurrency in Python for CPU bound functions using the Multiprocessing library. This method executes the target method as independent processes for every input, thus utilizing the CPU resources to the maximum extent. However, the control over context switching between the processes is still with the operating system. This might be a concern at times. Is there an alternative for this? Yes, there is! So, make sure you check out my next post, *Understanding Concurrency in Python Part 3 – Asyncio*, to learn more about how this library can let an application have control over context switching and execute multiple functions simultaneously. You can read all my blog posts on [HPE DEV.](https://developer.hpe.com/blog) Feel free to reach out to me with any questions on [Slack](https://hpedev.slack.com/?redir=%2Fteam%2FUQM0ZTE1F) or connect with me on Twitter [@deyagondsamarth.](https://twitter.com/deyagondsamarth)