---
title: "Automation is not testing"
date: 2020-02-18T17:55:26.750Z
author: Chris Young 
tags: []
path: automation-is-not-testing
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture1-1582049527283.png)

I recently attended a webinar where the speaker commented that "Automation is not testing". It started me thinking about testing in general and some of the challenges it can present.
We all know that we should be testing scripts, but you can fall into a lot of potential pit falls when starting this journey. In this article, I’m going to jump straight into the deep end and deal with one of the struggles that took me a while to deal with.

Imagine the following:
* You have a local device with a REST API.
* You write a library that accesses that REST API.
* You write tests for that library so it runs against the local devices REST API.
* You push the library to GITHUB so other people can leverage your work. (You are a good person, right? )
* You configure TravisCI or CircleCI for integration testing.
* You realize all your tests fail because Travis/Circle doesn’t have access to your internal device.

And now, your GITHUB badges all show red, and no one trusts your code. Which brings us to *vcrpy.*

## What’s vcrpy?
Wow! So glad you asked! *Vcrpy* is a REST API library that helps to automatically record responses from a REST API and captures them on a local file you can reuse later.
According to the *vcrpy* docs, (available [here](https://vcrpy.readthedocs.io/en/latest/)), the three main benefits of the library are:

* The ability to work offline
* Completely deterministic tests
*Increased test execution speed

Let’s dig in by writing a quick piece of code that is going to access a REST API. In this case, I’m going to use a public API, but let’s imagine it’s behind your firewall on a device where you don’t want anyone fiddling with anything.

For this example, I’m going to be using the public API at https://api.kanye.rest. This is a public API that responds to every GET request with a quote from Kanye West.
Let’s use python to create a small library that will access the API, print a message, and return the quote as JSON.
If you want to take a look at the library, feel free to check out the GITHUB repository [pykanyerest.](https://github.com/netmanchris/pykanyerest)
If you don’t want to leave this page, I’ve included the library function below.


```

import requests
import json


def get_new_quote():
    url = 'https://api.kanye.rest'
    r = requests.get(url)
    quote = json.loads(r.text)
    print ("New Kanye Quote coming up!")
    return quote

```

Now that we’ve got the new function built, let’s take a quick look at what we get. We will run the function and capture it in a python variable called x.


```

x = get_new_quote()
New Kanye Quote coming up!

```

Now, let’s use the json library to take a look at what was returned.


```

json.dumps(x)
'{"quote": "I’m nice at ping pong"}'

```

Now that we’ve got some working code, let’s run it again and capture this as the python variable y.


```

y = get_new_quote()
New Kanye Quote coming up!
json.dumps(y)
'{"quote": "The world is our office"}'

```
*Hmmmmm…*

As you can see, each time you perform a GET against the API, another variable is returned. You can imagine this probably isn’t the best thing for testing because we really don’t have a clear indication as to what *exactly* we’re going to expect from this API.

We do know a couple of things that can be used for testing:

* the returned object is a python dictionary
* the returned object has a single key/value pair
* the returned object’s first key is “quote”
* the returned object’s first value is going to be an object of type STR

Imagine code that could test for all these things.

*Take your time… I’ll wait.*

While you were imagining it, I wrote a quick test to help make sure that the API returns what we expect.

__If you don’t expect anything, you deserve what you get, right?__


```

from unittest import TestCase
from pykanyerest.quotes import *


class TestGetNewQuote(TestCase):
    """
    Test Case for get_new_quote function from kanye.rest
    """

    def test_GetNewQuote(self):
        """
        """
        quote = get_new_quote()
        self.assertEqual(type(quote), dict)
        self.assertEqual(len(quote), 1)
        keys = quote.keys()
        self.assertIn('quote', keys)
        self.assertEqual(type(quote['quote']), str)

```

If you were to run this test, you would find that it passes. *You can trust me on this, right?*

Now, we’ve already got a lot we can hang our tests on, but imagine we want to also test the exact contents of the value.
The code to test would now look like this:


```

class TestGetNewQuote(TestCase):
    """
    Test Case for get_new_quote function from kanye.rest
    """

    def test_GetNewQuote(self):
        """
        """
        quote = get_new_quote()
        self.assertEqual(type(quote), dict)
        self.assertEqual(len(quote), 1)
        keys = quote.keys()
        self.assertIn('quote', keys)
        self.assertEqual(type(quote['quote']), str)
        self.assertEqual(quote['quote'], "If I got any cooler I would freeze to death")

```

If you ran THIS code, you would now find it fails.


```

Traceback (most recent call last):
  File "/Users/christopheryoung/PycharmProjects/OpenTestingBlog/tests/test_quotes.py", line 18, in test_GetNewQuote
    self.assertEqual(quote['quote'], "If I got any cooler I would freeze to death")
  File "/Applications/PyCharm.app/Contents/helpers/pycharm/teamcity/diff_tools.py", line 38, in _patched_equals
    raise error
teamcity.diff_tools.EqualsAssertionError:  :: People only get jealous when they care. != If I got any cooler I would freeze to death

```

## Why did it fail?

Well, of course it failed, because the API is supposed to return a *NEW* quote every time we hit it.

This is where the *vcrpy* library comes in SUPER handy, as it can record and freeze the API response so we can make sure the last test passes every time.

So, the first thing we’re going to do is to import the VCR library into our test file and configure the new test to record the API response into a file on the local filesystem.
As you can see below, we’ve really only added two lines.
The first is the “import vcr” line at the top that makes the vcrpy library available to the test script. The second is the decorator on top of the “test_GetNewQuote” function, which does two things:

1. Tells the script where to copy the results of the API call the first time you run it
2. Tells the script where to look for the results every subsequent time you run it.


```

import vcr
from unittest import TestCase
from pykanyerest.quotes import *


class TestGetNewQuote(TestCase):
    """
    Test Case for get_new_quote function from kanye.rest
    """

    @vcr.use_cassette(cassette_library_dir='./test_pykanyerest/fixtures/cassettes')
    def test_GetNewQuote(self):
        """
        """
        quote = get_new_quote()
        self.assertEqual(type(quote), dict)
        self.assertEqual(len(quote), 1)
        keys = quote.keys()
        self.assertIn('quote', keys)
        self.assertEqual(type(quote['quote']), str)
        self.assertEqual(quote['quote'], "If I got any cooler I would freeze to death")

```

Once you’ve run the test once, a new file will appear in the ./test_pykanyerest/fixtures/cassettes/test_GetNewQuote folder with the following contents:


```

interactions:
- request:
    body: null
    headers:
      Accept:
      - '*/*'
      Accept-Encoding:
      - gzip, deflate
      Connection:
      - keep-alive
      User-Agent:
      - python-requests/2.22.0
    method: GET
    uri: https://api.kanye.rest/
  response:
    body:
      string: '{"quote":"I''m a creative genius"}'
    headers:
      Access-Control-Allow-Headers:
      - Content-Type
      Access-Control-Allow-Methods:
      - GET
      Access-Control-Allow-Origin:
      - '*'
      CF-RAY:
      - 55a5b75cac3aecee-YUL
      Connection:
      - keep-alive
      Content-Length:
      - '33'
      Content-Type:
      - application/json
      Date:
      - Fri, 24 Jan 2020 23:16:38 GMT
      Expect-CT:
      - max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
      Server:
      - cloudflare
      Set-Cookie:
      - __cfduid=d1c38c52e7d73039e047e768fdea93b5d1579907798; expires=Sun, 23-Feb-20
        23:16:38 GMT; path=/; domain=.kanye.rest; HttpOnly; SameSite=Lax
      Vary:
      - Accept-Encoding
    status:
      code: 200
      message: OK
version: 1

```

If you look closely, you can see a lot of information in there, including the contents of the response body string, which is now ‘{“quote”:”I’m a creative genius”}’.

*Note: For those paying attention, you will probably have guessed that the test we created above will still fail, as the Kanye quote we were looking for has changed again.*

Let’s change the test to look for the new quote that’s captured in the test_GetNewQuote file above.


```

import vcr
from unittest import TestCase
from pykanyerest.quotes import *


class TestGetNewQuote(TestCase):
    """
    Test Case for get_new_quote function from kanye.rest
    """

    @vcr.use_cassette(cassette_library_dir='./test_pykanyerest/fixtures/cassettes')
    def test_GetNewQuote(self):
        """
        """
        quote = get_new_quote()
        self.assertEqual(type(quote), dict)
        self.assertEqual(len(quote), 1)
        keys = quote.keys()
        self.assertIn('quote', keys)
        self.assertEqual(type(quote['quote']), str)
        self.assertEqual(quote['quote'], "I'm a creative genius")

```

Now when we run the tests, they all pass.

And when we run them again?
… They still pass.

And when we run them again?
… __They still pass.__
We can now run the same test a million times and get the same answer, which is pretty cool, right?

__One More Thing__

One of the other major benefits of using something like *vcrpy* is we can now continue to refactor our code even when we don’t have access to the resource we’re testing.

Stuck in a plane with no internet? No problem, you’ve captured the *actual* response from the original server. Your code has no clue you’re not connected.

No access to the corporate network? No problem, you’ve captured the *actual* response from the original server. Your code has no clue you’re not connected.

TravisCI has no access to your internal resources? No problem, you’ve captured the actual response from the original server and posted to GITHUB. TravisCI has no clue you’re not connected.

## VCRPY

I’ve only begun to scratch the surface of this library, but hopefully it will spark your curiosity to investigate it a bit more and see how you can write some new tests for that fancy REST API on your new infrastructure.

Just remember, you don’t want to write your secret usernames and passwords to the public GITHUB. The nice thing is that the vcrpy also has the ability to hide credentials. I’ll leave it up to you to see if you can figure that part out.
 
[@netmanchris](https://kontrolissues.net/mentions/netmanchris/)




