---
title: cURL-ing through HPE OneSphere API
date: 2018-02-03T10:05:29.709Z
author: Didier.Lalli@hpe.com 
tags: ["HPE-OneSphere","API","GettingStarted","REST","CURL"]
path: curl-ing-through-hpe-onesphere-api
---
## Summary
In previous articles, [Using HPE OneSphere Python Module](https://developer.hpe.com/blog/using-hpe-onesphere-python-module) and [Using HPE OneSphere PowerShell Module](https://developer.hpe.com/blog/using-hpe-onesphere-powershell-module), we discussed ways to write scripts to control and automate [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) tasks via its [REST API](https://developer.hpe.com/api/onesphere/). I would like to add another tool, which is quite universal and well appreciated in the Linux community, called *curl*.

## cURL

cURL (Command-line URL) is available for just about any device and any operating system, and used by millions of users. More on cURL can be found here: https://curl.haxx.se. 

Let us remember how we described a REST call in our first article: 

Verb protocol://server-end-point/URI

With some examples such as:

- GET  [https<nolink>://myonesphere.net/rest/status](#) 
- POST [https<nolink>://myonesphere.net/rest/session](#) 

So how do these calls translate in cURL?

We can call cURL --help, to see the syntax of the command. There are many available options but let us focus on the most important ones:

| Option | Meaning | Example |
|----------|-----------|-----------|
|H|	HTTP Header | -H "accept: application/json" |
|d|	data or payload |	-d '{"userName":"Administrator","password":"password"}' |
|X|	command	| -X GET https://YourHPEOneSphere/rest/status |
|k|	insecure |	bypasses SSL certificate validation |
|i|	include HEADER in response |	useful to check the response status code, but not used when parsing JSON result |
|p|	use a proxy |	-p http://mycompanyproxy.com:8888 |

## So let us try!
On a (Linux) machine with Internet access, type the following command, which will retrieve the status of your HPE OneSphere environment:

````bash
curl -i -k -H "accept: application/json" -X GET https://YourOneSphere/rest/status
HTTP/1.1 200 OK
Server: nginx/1.13.7
Date: Sat, 03 Feb 2018 09:42:15 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 30
Connection: keep-alive
Vary: Accept-Encoding
Cache-Control: no-cache, must-revalidate, no-store
Strict-Transport-Security: max-age=15724800; includeSubDomains;
{"service":"OK","database":""}
````
There we go! Status was 200 OK, and we have a JSON response. It's a pretty good start. 

## Parsing JSON 
We can see in the last line of the above example that the response is provided in JSON (we asked for it with our accept HTTP header). So, in order to write powerful scripts, we will need a mechanism to parse the JSON responses to extract the fields that we need. We have found this convenient open source tool called jq (command line JSON processor) available from http://stedolan.github.io/jq/download/linux64/jq

Once installed you can use it like this:

````bash
curl -k -H "accept: application/json" -X GET https://YourOneSphere/rest/status | jq -r "."
{
  "service": "OK",
  "database": ""
}
````
This will just pretty-print the JSON response, but you can also extract field, for example to retrieve the service status.

````bash
curl -k -H "accept: application/json" -X GET https://YourOneSphere/rest/status | jq -r ".service"
OK
````
So let us pretend would like to capture the service status in a variable within a shell script. We could do the following:
````bash
#Retrieve HPE OneSphere Status
status=$(curl -k -H "accept: application/json" -X GET https://YourOneSphere/rest/status | jq -r ".service")
echo $status
OK
```` 
## Getting a Session token
Let us now apply this technique to login to HPE OneSphere and start managing our hybrid cloud. As we have already seen in previous articles, we need to send a POST to the /rest/session API.
````bash
curl -k -H "accept: application/json" -H "content-type: application/json" \
-d '{"userName":"Administrator","password":"password"}' \
-X POST https://YourOneSphere/rest/session | jq -r "." 
{
  "token": "gAAAAABadYXE5bfUC_1F1_f_m-8VOV_w_IyCoNurq6DVcbPzQzpgcohvuQeqy58989OzIK-DCuL5YIUwOKZ8bS9Whfl25-RWc5HstCt9pOz-ixxtS8iH41yqqbvnYx0k2HQtSCLmSO7GszgHgoy-kYU8I2Ty62sHeA",
  "userUri": "/rest/users/4d119632ace9435ca74cafd8c1c98dee"
}
````
We can then, extract the token in a variable using the following syntax:
````bash
# Retrieve HPE OneSphere session token
token=$(curl -k -H "accept: application/json" -H "content-type: application/json" \
-d '{"userName":"Administrator","password":"password"}' \
-X POST https://YourOneSphere/rest/session | jq -r ".token") 
echo $token
gAAAAABadYYWh2fcZTVzY8tkZ7baNCRokyoVDECK1jp-zsoLg5L_8adZeX89hbx2VqKyuQYp5lUqLP275T-8Phd6C14X7Q6dsiGgX8juKzc6P-p6B7Bi8B_6vamM_7AsAHW5LRIZNwg7-9FgtByRkKQ4hjXRbAqITw
````
## Putting it all together
We have now retrieved a login session (stored in variable token), and we are now ready to explore the full HPE OneSphere API with a simple shell script. For example, let us enumerate project names and user names in this environment:
````bash
# Retrieve Projects and Users from HPE OneSphere
echo "-- Projects"
curl -k -H "accept: application/json" -H "content-type: application/json" \
-H "x-api-version: $currentVersion" -H "Authorization: Bearer $token" \
-X GET https://YourOneSphere/rest/projects \
| jq -r ".members[].name"
echo "-- Users"
curl -k -H "accept: application/json" -H "content-type: application/json" \
-H "x-api-version: $currentVersion" -H "Authorization: Bearer $token" \
-X GET https://YourOneSphere/rest/users \
| jq -r ".members[].name"
-- Projects
service
demonstration
WWASProject01
-- Users
Toni Lucas
Joey Don
Carla Kyle
WWAS02
Mary Jane
Ed Smith
WWAS01
````

## cURL on Windows?
But what about Windows, some of you might ask? The good news is that everything we have just shown here, can be done on Windows. If you use cygwin, the cURL package is part of the default distribution and jq can be easily compiled from sources located at https://stedolan.github.io/jq/download/

Another option is to install jq and cURL for Windows, and in that case, you will have to perform a few syntax changes to the examples we showed above.

- cURL if available from: http://winampplugins.co.uk/curl/curl_7_48_0_openssl_nghttp2_x64.7z
- jq is available from: https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win64.exe

Once curl and jq are installed and in the default path, we can then execute the following command to retrieve a token:

````bash
curl -k -H "accept: application/json" -H "content-type: application/json" -X POST https://YourOneSphere/rest/session -d "{\"userName\":\"Administrator\",\"password\":\"password\"}" | jq -r ".token"
````
 
However, if you really need to store it into a variable in Windows command interpreter, things get a little more complicated:

````bash
for /f "delims=" %a in ('curl -k -H "accept: application/json" -H "content-type: application/json" -X POST https://YourOneSphere/rest/session -d "{\"userName\":\"Administrator\",\"password\":\"password\"}" ^| jq -r ".token"') do @set token=%a
echo %token%
````
## And the last good news is…
So I asked early on, how do these calls translate in cURL? Here is the last piece of good news: POSTman can help you with that. Imagine you have been experimenting with a GET in POSTman, and you would like to run the same GET from cURL in a script
  
You can use the Generate Code button in the upper right corner and select cURL from the drop down to get the right string ready to paste in your own script.
 
## What is next?
Scripting with cURL might solve a number of use cases, and is somewhat portable across Linux and Windows, but it is not the most convenient and readable scripting language. If you are operating on Windows, we recommend using PowerShell. Check-out [this article](https://developer.hpe.com/blog/hpe-onesphere-automation-using-powershell-and-csv) which shows how to script import and export projects and users from your HPE OneSphere environment. 