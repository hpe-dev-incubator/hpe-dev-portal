---
title: Curling through the OneView API
date: 2017-09-07T17:33:30.771Z
featuredBlog: false
priority: null
author: Didier Lalli
authorimage: /img/blogs/Avatar2.svg
thumbnailimage: null
tags:
  - HPE-OneView
  - OneView
  - RESTAPI
---
In previous articles, we used a REST client plug-in to Firefox or Chrome
to exercise the HPE Composable Infrastructure API. This is nice, for
discovery and understanding of the API, but the next step toward a
software-defined infrastructure is to be able to automate those actions,
in a script. One possible approach to writing automation scripts using a
REST API such as the HPE Composable Infrastructure API, is to use a tool
like curl, and open source command line tool able to exchange data with
a web application or API using an URL syntax. cURL (Command-line URL) is
available for just about any device and any operating system, and
actually used by millions of users. More on cURL from
https://curl.haxx.se.

# cURL syntax 101

Let us remember how we described a REST call in [our first
article](https://community.dev.hpe.com/t5/Blogs/First-steps-with-programming-the-HPE-Composable-Infrastructure/ba-p/235724):

&gt; Verb protocol://server-end-point/URI

With some examples such as:

-   POST https://oneviewsrv.cilab.net/rest/login-sessions

-   GET https://oneviewsrv.cilab.net/rest/alerts

So how do these calls translate in cURL?

We can call cURL with no option, and see the syntax: **curl
\[options...\] **

There are many available options but let us focus on the most important
ones:

| Option | Meaning                    | Example                                                                         |
|--------|----------------------------|---------------------------------------------------------------------------------|
| H      | HTTP Header                | -H "accept: application/json"                                                   |
|        |                            | -H "content-type: application/json"                                             |
| d      | data or payload            | -d '{"userName":"Administrator","password":"password"}'                         |
| X      | command                    | -X GET https://213.30.139.22:37441/rest/version                                 |
|        |                            | -X POST https://213.30.139.22:37441/rest/login-sessions                         |
| k      | insecure                   | bypasses SSL certificate validation                                             |
| i      | include HEADER in response | useful to check the response status code, but not used when parsing JSON result |
| p      | use a proxy                | -p http://mycompanyproxy.com:8888                                               |

So let us try!

On a Linux machine with Internet access, type the following command,
which will retrieve the version of the API.


```postscript
curl -i -k -H "accept: application/json" \\
-X GET https://213.30.139.22:37441/rest/version
```

![Curl command to retrieve the version of the  API.](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-1-1504806712277.png)

# Parsing JSON 

We can see in the last line of the above example that the response is
provided in JSON (we asked for it with our accept HTTP header). So in
order to write powerful scripts, we will need a mechanism to parse the
JSON responses to extract the fields that we need. We have found this
convenient open source tool called jq (command line JSON processor)
available from http://stedolan.github.io/jq/download/linux64/jq

Once installed you can use it like this:


```postscript
curl -k -H "accept: application/json" \\
-X GET https://213.30.139.22:37441/rest/version | jq -r "."
```

![command line JSON processor to parse the JSON](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-2-1504806725594.png)

This will just pretty print the JSON response, but you can also extract
field, for example to retrieve the currentVersion.


```postscript
curl -k -H "accept: application/json" \\
-X GET https://213.30.139.22:37441/rest/version | jq -r ".currentVersion"
```

![Retrieve API version using command line JSON parser](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-3-1504806732409.png)

So let us pretend would like to capture the currentVersion in a variable
within a shell script, we could do the following:

# Retrieve API version


```postscript
currentVersion=$(curl -k -H "accept: application/json" -X GET
https://213.30.139.22:37441/rest/version | jq -r ".currentVersion")

echo $currentVersion
```

![retrieve current version of API using open source jq tool](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-4-1504806739646.png)

# Getting a Session token

Let us now apply this technique to login to our HPE OneView Appliance
and start managing our HPE Composable Infrastructure. As we have already
seen in previous articles, we need to send a POST to the
/rest/login-sessions API.


```postscript
curl -k -H "accept: application/json" -H "content-type:
application/json" \\
-d '{"userName":"Administrator","password":"password"}' \\
-X POST https://213.30.139.22:37441/rest/login-sessions | jq -r "."
```

![Getting a Session token using POST Curl command](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-5-1504806745891.png)

We can then, extract the sessionID in a variable using the following
syntax:


```postscript
sessionID=$(curl -k -H "accept: application/json" -H "content-type:
application/json" \\
-d '{"userName":"Administrator","password":"password"}' \\
-X POST https://213.30.139.22:37441/rest/login-sessions | jq -r ".sessionID")

echo $sessionID
```

![extract the sessionID in a variable](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-6-1504806754438.png)

# Putting it all together

We have now retrieved the API Version (currentVersion) and a login
session (sessionID), we are now ready to explore the full HPE Composable
Infrastructure API with a simple shell script. For example, let us
enumerate the models of the servers managed in this environment


```postscript
curl -k -H "accept: application/json" -H "content-type:
application/json" \\
-H "x-api-version: $currentVersion" -H "auth: $sessionID" \\
-X GET https://213.30.139.22:37441/rest/server-hardware \\
| jq -r ".members\[\].model"
```

![enumerate the models of the servers managed in this environment](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-7-1504806761092.png)

# cURL on Linux and Windows

But what about Windows? Some of you might ask. The good news is that
everything we have just shown here, can be done on Windows. If you use
cygwin, the cURL package is part of the default distribution and jq can
be easily compiled from sources located at
https://stedolan.github.io/jq/download/

Another option is to install jq and cURL for Window, and in that case,
you will have to perform a few syntax changes to the examples we showed
above.

-   cURL if available from:
    http://winampplugins.co.uk/curl/curl_7_48_0_openssl_nghttp2_x64.7z

-   jq is available from:
    https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win64.exe

Once curl and jq are installed and in the default path, we can then
execute the following command to retrieve a sessionID:


```postscript
curl -k -H "accept: application/json" -H "content-type:
application/json" -X POST
https://213.30.139.22:37441/rest/login-sessions -d
"{\\"userName\\":\\"Administrator\\",\\"password\\":\\"password\\"}" |
jq -r ".sessionID"
```

![Curl command to retrieve a sessionID using jq tool](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-8-1504806767303.png)

However, if you really need to store it into a variable in Windows
command interpreter, things get a little more complicated:

for /f "delims=" %a in ('curl -k -H "accept: application/json" -H
"content-type: application/json" -X POST
https://213.30.139.22:37441/rest/login-sessions -d
"{\\"userName\\":\\"Administrator\\",\\"password\\":\\"password\\"}" ^|
jq -r ".sessionID"') do @set sessionID=%a

echo %sessionID%

![store session id into a variable in Windows command interpreter](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-9-1504806773156.png)

# And the last good news is…

So I asked early on, how do these calls translate in cURL? Here is the
last piece of good news: POSTman can help you with that. Imagine you
have been experimenting with a GET in POSTman, and you would like to run
the same GET from cURL in a script

![POSTman can help to generate Curl code](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-10-1504806780133.png)

You can use the **Generate Code** button in the upper right corner and
select cURL from the drop down to get the right string ready to paste in
your own script.

![Generated Curl code from POSTman REST tool](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/curl-11-1504806788067.png)

# What is next?

Scripting with cURL might solve a number of use cases, and is somewhat
portable across Linux and Windows, but it is not the most convenient and
readable scripting language. In the next articles, we will cover how to
script against the HPE Composable Infrastructure API using Microsoft
PowerShell and Python.