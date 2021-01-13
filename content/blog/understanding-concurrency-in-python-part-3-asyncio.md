---
title: "Understanding Concurrency in Python Part 3 - Asyncio"
date: 2020-02-19T17:32:20.225Z
author: Samarth Deyagond 
tags: []
path: understanding-concurrency-in-python-part-3-asyncio
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture1-1582323160514.png)

If you have been following my blog posts on concurrency in Python, you’ll remember that I first covered the [threading library in Python](https://developer.hpe.com/blog/understanding-concurrency-in-python-part-1-threading) and found that it helped significantly with multi-threaded execution of I/O bound tasks. However, it did not improve efficiencies for CPU bound tasks. In [Part 2](https://developer.hpe.com/blog/understanding-concurrency-in-python-part-2-multiprocessing), I pointed out how multiprocessing can help you get around this. In this post, I will show you how the Python asyncio library can help achieve concurrency of processes by letting the application have control over context switching. This library can come in handy when you are dealing with APIs that are implemented with a polling mechanism to handle asynchronous tasks. 

*Asyncio* became associated with Python in version 3.4. It is a single thread/single process cooperative multitasking library that uses something called co-routines, event loops, and awaitable objects to achieve concurrency. An asyncio task has exclusive use of the CPU until it wishes to give it up to the event loop. Asyncio is very beneficial for I/O bound operations, but not very helpful for CPU bound operations.

Let’s use the same I/O bound example we used in Part 1 and Part 2 of this series to fetch responses from websites and see how to implement concurrency of this I/O bound operation using asyncio.

Step 1: Import the necessary libraries and modules.


```

import asyncio
import requests
import time

```

Step 2: Define the co-routines. A co-routine can be defined by prefixing the keyword async before the function definition. An asyncio co-routine is a function that can pause and resume during execution. This means that it acts, more or less, like a [generator](https://wiki.python.org/moin/Generators) in Python.


```

async def get_response(site):
    return requests.get(site)

async def main():
    # define some sites to query
    tasks = []
    sites = ["http://www.google.com", "http://www.linkedin.com",
             "http://www.quora.com", "http://www.facebook.com"]

    for site in sites:
        tasks.append(asyncio.ensure_future(get_response(site)))
    
    await asyncio.gather(*tasks)

```

*ensure_future* takes in a co-routine and returns the future version of it. Basically, it assumes that a result will eventually be given to it at some point in time. And while a co-routine is waiting, its execution is temporarily suspended. Once the future of that co-routine is set to some result, the co-routine is resumed.

Now, create the event loop and call the co-routines to fetch responses. Capture the time taken for execution to see how asyncio performs.


```

start_time = time.time()
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
print("Time taken for asyncio", time.time()-start_time)


```

Using asyncio in this example, I got the following results:


![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture3-1582323145443.png)

You can see that the asyncio execution took relatively less time than a regular iterative execution of an I/O bound operation.


The complete code we used to illustrate how the asyncio library helps would look like this:


```

import asyncio
import requests
import time

async def get_response(site):
    return requests.get(site)

async def main():
    # define some sites to query
    tasks = []
    sites = ["http://www.google.com", "http://www.linkedin.com",
             "http://www.quora.com", “http://www.facebook.com"]

for site in sites:
    tasks.append(asyncio.ensure_future(get_response(site)))

    await asyncio.gather(*tasks)

start_time = time.time()
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()

print("Time taken for asyncio", time.time()-start_time)

```

Note - You might come across an error that says ‘event loop is already running’, while executing the above code in Jupyter Notebooks. In that case, either run the code from your terminal as a regular Python program or fix the issue by installing nest_asyncio from https://pypi.org/project/nest-asyncio/ and importing it in the code.

## Conclusion

As you can see from the example above, the Python asyncio library can be very advantageous when you want the application to have more control over context switching than the operating system, especially when dealing with APIs that have a polling mechanism or any other I/O bound operation. 

Hopefully, after reading through all three of my articles, you now have a basic understanding of the libraries that are available in Python for concurrency, including:

- Threading
- Multiprocessing
- Asyncio

By reading these posts, I hope you also learned to determine which library to employ based on whether the operation is I/O bound or CPU bound. My three articles just covered the basics of concurrency. Is there more to it? Definitely! You may want to explore more on locks in threading, pools in multiprocessing, and a bunch of other cool features found in [asyncio.](https://docs.python.org/3/library/asyncio.html)  

You’ll find more articles and tutorials like this on the [HPE blog site.](https://developer.hpe.com/blog) Remember to check back of-ten to see what’s new! Don’t forget, you can follow me on Twitter [@deyagondsamarth](https://twitter.com/deyagondsamarth) or connect with me on [Slack.](https://hpedev.slack.com/?redir=%2Fteam%2FUQM0ZTE1F) Happy coding!

