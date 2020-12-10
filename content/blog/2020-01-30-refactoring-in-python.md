---
title: "Refactoring in Python"
date: 2020-01-30T22:57:21.363Z
author: Samarth Deyagond 
tags: ["Python"]
path: refactoring-in-python
---
![01 refactoring 1024](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/01-refactoring-1024-1581354751665.jpg)

## What is refactoring, and why do we need it?

Too often, developers don’t take the time required to refactor and refine their code, resulting in the accumulation of technical debt that needs to be addressed somewhere down the road. Refactoring code is a technique used to improve the non-functional requirements of the code by modifying the external structure without altering the default behavior of the code. By non-functional requirements, it refers to attributes like modularity, readability, testability, maintainability and other enhancements, the absence of which can add technical debt to the code. Refactoring code is like making final touches to a painting.

## Refactoring techniques for Python:

While the same refactoring techniques can be employed across different programming languages, this article focuses on refactoring techniques that are more relevant for the Python programming language.

__Flat is better than nested__

When given a *while* *loop* driven by a condition whose iterations check the truth value of another ‘if condition’ inside it, then the *loop* *condition* and nested *if* *condition* can be combined with an *AND* logical operator and used as the new *loop* *condition* to yield the same result. The code still works perfectly. But when refactored as described, it becomes easier to read and debug.

Below is an example code snippet before refactoring:


```
def _upheap(self, index):

    parent_index = (index-1)//2
    while index > 0:  # condition driving the while loop
        if self._heap[parent_index] > self._heap[index]:  # if conditional
            self._swap(parent_index, index)
            index = parent_index
            parent_index = (index-1)//2

```
The refactored code snippet is shown below:	


```
def _upheap(self, index):

    parent_index = (index-1)//2
    while index > 0 and self._heap[parent_index] > self._heap[index]:
        self._swap(parent_index, index)
        index = parent_index
        parent_index = (index-1)//2

``` 

Doesn’t the code look much more refined now?

__Global variables are always a bad idea__

Every function in code has access to global variables. If the global variables are modified, it’s hard to find out which function made the change. Debugging becomes tougher as the code grows. When it comes to readability, strange variables will start popping up from out of nowhere. This is because the global variables in use might be declared somewhere very far into the code. (Don’t you think that declaring the variables close to their usage in the code is a good refactoring idea? This would be especially helpful in Python, which is a dynamically-typed programming language.)

To avoid changing variables that shouldn’t be changed, it is always a good idea not to implement global variables. Global constants, however, are pretty handy. 

Consider the below snippet that uses a global variable.


```
x = 10


def increment_x_by_one():

    global x
    x += 1
    return x


def increment_x_by_two():

    global x
    x += 2
    return x

print(increment_x_by_one())
print(increment_x_by_two())

```

The output will be as shown below:
`11`
`13`

We wanted the second output to be 12, but earlier, the `function increment_x_by_one` has already been modified with the initial/default value that the variable x is supposed to have. This causes us to have an error.
	
Now, let’s refactor the code, avoiding the use of a global variable.


```
def increment_x_by_one(x):
    x += 1
    return x


def increment_x_by_two(x):
    x += 2
    return x

x = 10

print(increment_x_by_one(x))
print(increment_x_by_two(x))

```

The output now will be accurate, as shown below:
`11`
`12`

The result is absolutely as expected, and the function that modified variable x can be easily tracked. 

## Don’t use magic literals

Many times, string literals and numeric values are used directly, as opposed to being assigned to a variable, even though they imply something significant in the code. It is good to store them as variables with proper names to improve the code’s readability. Those string literals and numeric values might be referred to in multiple places. If they are to be modified, then all their references need to be traced, which is, again, an effort that is mostly prone to error.

Consider the below snippet before refactoring: 


```
if age > 21:
    return True


```

Now, consider the refactored code:


```
age_limit = 21
if age > age_limit:
    return True


```
Comprehending the code block is much easier now, isn’t it?

## Remove the commented code

Often working/non-working code sections are commented out when prompted to try an alternative logic, and then they are left “as is”. This makes the readability of the code much more difficult. Also, other comments might get overlooked. So, the commented code should be erased. The best way to keep track of your commented code is via a version control mechanism, like git, using proper commit messages. 

## Address the redundancy

If two blocks of code are doing the same logic or same set of instructions, then address the redundancy by either extracting a function out of the common code or by placing the redundant instruction on an appropriate line before or after (but only in one place).

Consider the below example before refactoring:


```
x = 10

if x % 2 == 0:
    print(“The number”, x, “is even”)
    print(“The squared of the number is”, x**2)
else:
    print(“The number”, x, “is odd”)
    print(“The squared of the number is”, x**2)

```

Now, let’s refactor it:


```
x = 10

if x % 2 == 0:
    print(“The number”, x, “is even”)
else:
    print(“The number”, x, “is odd”)

print(“The squared of the number is”, x**2)

```

Refactoring not only makes it more readable, but also saves on Python code interpretation time.

## Conclusion

Many refactoring tools are available as software packages or extensions for almost every programming language. Some IDE’s (Integrated Development Environments) like PyCharm have built-in refactoring tools. Practice refactoring your code before committing it to the codebase. Besides meeting the non-functional requirements, a neatly refactored code eases debugging, too.


And guess what?! This blog, too, is refactored a couple of times to improve its readability. You see, fundamentals work everywhere! 

I hope you found my post on refactoring useful. For more coding tips, keep checking the [HPE DEV blog.](https://developer.hpe.com/blog) And if you have any questions, feel free to reach out to me [@deyagondsamarth](https://twitter.com/deyagondsamarth) or connect with me on [Slack](https://hpedev.slack.com/?redir=%2Fteam%2FUQM0ZTE1F). Happy coding!
