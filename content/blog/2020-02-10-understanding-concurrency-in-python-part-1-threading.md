---
title: "Understanding Concurrency in Python Part 1 - Threading"
date: 2020-02-10T22:17:20.233Z
author: Samarth Deyagond 
tags: ["Python"]
path: understanding-concurrency-in-python-part-1-threading
---
![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture3-1581373479403.png)

Although most developers understand the basic concepts of concurrency and parallelism, the nuances can be pretty tricky to understand. At a high level, these are techniques/mechanisms employed to execute multiple processes or threads simultaneously while, at the same time, ensure the CPU is used to its maximum extent. To provide you with a more complete understanding of concurrency in Python, I’ve written a three-part tutorial. I will start off by covering the topic of threading, and then delve into multiprocessing, and asyncio.

__Concurrency__ is when processes are executed on a single processor by context switching, and they appear to be running simultaneously. __Parallelism__ is when processes are executed on multiple processors or cores and are actually running simultaneously.

Python provides multiple libraries to achieve concurrency, namely threading, multiprocessing, and asyncio. These libraries will be better employed if we understand a few aspects about concurrency in Python.

* CPython enforces GIL (Global Interpreter Lock), which mandates one thread execution at a time. The thread needs to acquire this exclusive lock every time before the execution of any bytecode.

* Concurrency is preferred when the process is either I/O bound or CPU bound. I/O bound processes are those that communicate with the devices that are slower than the processor. 

For example, a process talking to a poor network connection, printer/scanner, etc. is an I/O bound process. CPU bound processes are those that do significant CPU intensive computations. Here, the resource that limits the speed of execution is the CPU, unlike those in I/O bound processes.

* In I/O bound or CPU bound processes, the threads don’t need to struggle/race to acquire the GIL.

* The threading and asyncio libraries are best used when the process is I/O bound, and the multiprocessing library is good to use when the process is CPU bound.

Here are some examples of how to employ the threading library in detail:

Remember, this library is best for dealing with I/O bound functions.

Start by looking at an I/O bound function for fetching responses from several websites. (I’m going to refer to this example in Parts 2 and 3 of this series, so make sure you take notes!) If you execute this task in both a regular and multi-threaded fashion and capture the time taken to fetch responses from all the sites, you can see it’s faster with a multi-threaded execution and slower with a regular execution.

Step 1: First, import the necessary libraries and modules.


```

import threading
import time
import requests

```

Step 2:  Define a function get_response() that accepts site as an input and fetches the response data from that site using requests.get() method.


```

def get_response(site):
    return requests.get(site)

```

Step 3: Create a list of several websites. Append any site and as many sites as you want to the list.


```

sites = ["http://www.google.com", "http://www.linkedin.com",
         "http://www.quora.com", "http://www.facebook.com"]


```

Step 4: Iterate through this list of sites and invoke the function get_response() for each site. Capture and print the time taken for this complete iteration using a time.time() method.


```

start_time = time.time()
for site in sites:
    get_response(site)  

print("Time taken for regular execution", time.time()-start_time)

```

Step 5: Now, define threads using the threading library with target to get_response() function and arguments set to sites in the list.


```

threads = [threading.Thread(target=get_response, args=(site,))
          for site in sites]

```

Step 6: Iterate over these threads and start these threads using the thread.start() method. Use the thread.join() method to wait till the thread execution completes. Also, capture the time using the time.time() method to see the time taken to complete the execution.


```

start_time = time.time()
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print("Time taken for multi-threaded execution", time.time()-start_time)

```


![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture1-1581373455996.png)

You can see that the multi-threaded execution of this I/O bound task is way faster than the regular execution. The efficiency of a multi-threaded execution is so significant in a scenario like this with only four sites to fetch responses from. Imagine how much more of an advantage we would see when the list of sites grows longer! Did you just think about working on a mind-blowing web scraping project?

The consolidated code would look like what’s shown below: 


```
import threading
import time
import requests


def get_response(site):
    return requests.get(site)

sites = ["http://www.google.com", "http://www.linkedin.com",
         "http://www.quora.com", "http://www.facebook.com"]

start_time = time.time()
for site in sites:
    get_response(site)

print("Time taken for regular execution", time.time()-start_time)

threads = [threading.Thread(target=get_response, args=(site,))
           for site in sites]
start_time = time.time()
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print("Time taken for multi-threaded execution", time.time()-start_time)

```

Now, let’s consider a CPU bound function and observe how a threading library isn’t of much help in achieving any further efficiency.

Step 1: Again, be sure to first import the necessary libraries and modules.


```

import threading
import time
import requests

```

Step 2: This time, define a CPU intensive function cpu_bound() that accepts a number, multiplies it by 10^6 and calculates the sum of all numbers in a range of 0 to that product.


```
def cpu_bound(num):
    return sum([i for i in range(num*1000000)])
```

Step 3: Create a list of random numbers.


```

numbers = [11, 23, 53, 34]

```

Step 4: Just like in the last example, iterate over these numbers and invoke the cpu intensive function cpu_bound(). Capture the time taken to complete the execution. Print out the time taken for regular execution.


```

start_time = time.time()
for number in numbers:
    cpu_bound(number)

print("Time taken for regular execution", time.time()-start_time)

```

Step 5: As shown previously, define the variable threads using threading.Thread() method with target function set to cpu_bound and arguments set to the numbers in the list. 


```

threads = [threading.Thread(target=cpu_bound, args=(number,))
          for number in numbers]

```

Step 6: Iterate over these threads and start the execution of these threads using the thread.start() method. Use the thread.join() method to wait till the thread execution completes. Also, capture the time using the time.time() method to see the time taken to complete the execution and print it out.


```

start_time = time.time()
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print("Time taken for multi-threaded execution", time.time() - start_time)

```





![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture2-1581373442995.png)

You can see that employing the threading module did not help us much in achieving any further efficiency while executing a CPU bound function. This is probably because line-by-line execution is done faster than waiting for a thread to complete and for another thread to acquire the GIL and proceed.

The consolidated code would look like this:


```
import threading
import time
import requests


def cpu_bound(num):
    return sum([i for i in range(num*1000000)])

numbers = [11, 23, 53, 34]

start_time = time.time()
for number in numbers:
    cpu_bound(number)

print("Time taken for regular execution", time.time()-start_time)

threads = [threading.Thread(target=cpu_bound, args=(number,))
           for number in numbers]

start_time = time.time()
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print("Time taken for multi-threaded execution", time.time()-start_time)

```

Through these two examples, it’s apparent that multi-threaded execution takes more than, or almost the same amount of time as, that of regular execution while handling CPU bound functions. What you need to understand is that, *no matter how many cores you have on your computer, the threading library of Python will not help you to completely exploit the abilities of multi-threading*. Because of this, any CPU intensive functions won’t benefit from multi-threaded execution.

Are there any instances wherein we can take complete advantage of all the cores that our computer has and experience an efficient handling of especially CPU bound functions?

Yes! Python supplies a Multiprocessing library that helps this exact situation. In my next post that covers more of the nuances of concurrency, Understanding Concurrency in Python Part 2 – Multiprocessing, I will explain more about this. Remember to check back on the HPE DEV blog site often to keep up with the many different tutorials we post. If you want to, you can also follow me on Twitter [@deyagondsamarth.](https://twitter.com/deyagondsamarth) or connect with me on [slack.](https://hpedev.slack.com/?redir=%2Fteam%2FUQM0ZTE1F)
