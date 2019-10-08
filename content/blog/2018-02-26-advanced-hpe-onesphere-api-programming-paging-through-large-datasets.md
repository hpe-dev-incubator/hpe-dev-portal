---
title: Advanced HPE OneSphere API Programming - Paging through large datasets
date: 2018-02-26T21:51:51.181Z
author: Didier.Lalli@hpe.com 
tags: ["HPE-OneSphere","API","Advanced"]
path: advanced-hpe-onesphere-api-programming-paging-through-large-datasets
---
## Summary
In previous articles, we discovered the [HPE OneSphere API](https://developer.hpe.com/api/onesphere), and how to use it to retrieve data from [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html). The next articles will cover some advanced techniques used in REST API programming. In this article we are discussing how to best handle API calls returning large amount of data.

## What's the problem?

In API programming, one problem often faced by programmers is avoiding calling an API method which will return huge amount of data and potentially blocking the calling application for too long. Another problem is that in many cases (especially with a GUI based application), only a subset of the data can be displayed to the user, so why retrieve the entire data set if you won't be using all of it?

## Any standard API technique?

There is a de facto standard used to solve this problem, and only retrieve the amount of data API caller requires. If you recall in a previous articles such as [Discovering HPE OneSphere API](https://developer.hpe.com/blog/discovering-hpe-onesphere-api), we used **[GET /rest/users](https://developer.hpe.com/api/onesphere/endpoint?&path=%2Fusers)** to retrieve the list of users.

![](/uploads/media/2018/2/advancedapitechniquepaging-pic1-1519682281945.jpg "Retrieve HPE OneSphere users ")

Although there are only 8 items returned by this call, we can see that the JSON response is composed of 4 parameters:

1. total
2. start 
3. count
4. members

Where *total* provides the total number of items in the collection (in our case 8), *count* provides the number of items returned by this particular call (again, here it's also 8) and *start* indicates the position of the "cursor" in the result set. You can think of this as:

"Here are your *count* items starting at *start*, out of the complete set of *total* items in the collection"

Finally *members* holds those *count* items.      

This is a technique used by several API implementation, which consists in having a virtual window (cursor) of a certain size, over your entire dataset,  similar to the scroll bars of any PC, when displaying a long text. 

## What? Hidden parameters?

This leads to the fact that any **GET** call can be used with two (not always very well documented) parameters to specify the "cursor" size, and these parameters are *start* and *count*. The syntax of the URL is the following:

- GET /rest/users?start={start}&count={count}

For example:

- GET /rest/users?start=0&count=50
- GET /rest/users?count=100&start=0
- GET /rest/users?start=50&count=50

As in HPE OneSphere, the cursor size is 50, the following two calls are equivalent:

- GET /rest/users?start=0&count=50
- GET /rest/users

It is also important to note that calling: 

- GET /rest/users?count

Will simply return the *total* number of users (but no users).

## So why do we care?

Let's now imagine that we query something which could return a bigger dataset (bigger than 50 items). Take for example the call **[GET /rest/services](https://developer.hpe.com/api/onesphere/endpoint?&path=%2Fservices)** which retrieves potentially hundreds of items from the service catalogs. Let's give it a try:

![](/uploads/media/2018/2/advancedapitechniquepaging-pic2-1519682896078.jpg "Retrieve HPE OneSphere services")

We can see that we have, in this case, a total of 150 (*total*) items, but this particular call returned 50 (*count*) items, starting at position 0 (*start*).  You can try this yourself, but collection of items (*members*) attached with this call has indeed 50 items.

## How do we get the rest?

So now what? Well, we need to get the rest of the dataset. And there are multiple strategies you can choose from:

### The cursor approach

This strategy implies that we will "move" a virtual cursor to get the next batch of data by calling **GET /rest/services** again with the following parameter: start=50, count=50, and then again with: start=100, count=50 to get all of the data (150). A pseudo algorithm could be:

````
newstart = 0
newcount = 50

do {
  set = GET /rest/services?start={newstart}&count={newcount}
  parse response to retrieve total, count and start

  # Do something with this partial set of count items  
  
  newstart = start + count

} while (newstart < total)
````
The following illustration shows the result of the second iteration:

![](/uploads/media/2018/2/advancedapitechniquepaging-pic3-1519682944654.jpg "Retrieve HPE OneSphere services")

### The 2-step approach

In the two step approach, we will retrieve the data in 2 steps. The first step will get the default batch (and the *total* and *count* parameters), then the second will get the rest. A pseudo algorithm could be:
````
  Set1 = GET /rest/services
  #parse response to retrieve total, count and start
  
  if (count < total) {  
    newcount = total - count
    newstart = count
    set2 = GET /rest/services&start={newstart}&count={newcount}
    fullset = Merge (Set1,Set2)
  } 
  else fullset = set1

  # Do something with the fullset of total items  
  ````

The following illustration show the result of the second step:

![](/uploads/media/2018/2/advancedapitechniquepaging-pic4-1519682954786.jpg "Retrieve HPE OneSphere services")

### The simpler 2-step approach

This approach is similar to the 2-step approach in that we will make 2 calls to the GET API, but it's also different because in the first call we only request the total number of items. It's simpler because there is no need to merge datasets. A pseudo algorithm could be:
````
  GET /rest/services?count
  # parse response to retrieve total
  
  fullset = GET /rest/services&count={total}
    
  # Do something with the fullset of total items  
  ````

The following illustrations show the result of both calls:

![](/uploads/media/2018/2/advancedapitechniquepaging-pic6-1519682990371.jpg "Retrieve HPE OneSphere services")

![](/uploads/media/2018/2/advancedapitechniquepaging-pic7-1519683004773.jpg "Retrieve HPE OneSphere services")

### The brute-force approach

With this technique we blindly request the complete data set in one single call by using a conventional count value of -1 (all of them).

![](/uploads/media/2018/2/advancedapitechniquepaging-pic5-1519812831121.jpg "Retrieve HPE OneSphere services")

This is a more dangerous option as we cannot be sure of the size of the data returned (potentially thousands of items) nor the wait time associated.

## Conclusion

Picking the right option depends on the amount of wait time you are ready to impose on your user, which will also depend on the network bandwidth available between the user and the HPE OneSphere management portal. For command line tools, it might be ok to wait a few seconds before starting to display any results (using the simpler 2-step approach). For GUI based applications it might not be a good user experience, and displaying partial result, although harder, will result in a much smoother experience (using the cursor approach). You can use the brute-force approach for data sets which, for sure, are not too large. 

## What is next?

In a follow-up article we will explore how to filter result sets using URL queries. Another technique to limit the amount of data that we retrieve from the [HPE OneSphere API](https://developer.hpe.com/api/onesphere).