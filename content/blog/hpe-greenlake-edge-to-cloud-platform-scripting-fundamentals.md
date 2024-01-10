---
title: HPE GreenLake edge-to-cloud platform scripting fundamentals
date: 2024-01-10T09:51:57.270Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
tags:
  - API
  - hpe-greenlake
---
<style>
ul li{
 font-size:27px;
}
</style>

<style>
ol li{
 font-size:27px;
}
</style>

## What are the HPE GreenLake edge-to-cloud platform APIs  

The foundational APIs for common HPE GreenLake  platform services allow IT administrators and IT operators to programmatically operate and manage users and resources in an HPE GreenLake platform’s workspace.   

This set of APIs for common platform services includes API for workspace management, identity and access management, device and subscription, locations, audit logs, and wellness.   

> > *Note: The [HPE Greenlake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs leverages OpenAPI specifications and associated reference material. The documentation provides a complete explanation of the operations supported by these APIs for common HPE GreenLake platform services, as well as sample requests and responses.*   

 The following blog posts are an excellent way to learn more about the APIs using Postman. 

* URL Blog Denis Part 1 
* URL Blog Denis Part 2 

In this blog post here, I will explore the usage of the HPE GreenLake platform API one step further by using the APIs to build automation scripts or custom integrations. To develop my script, I will use bash, python and PowerShell. 

## Let’s pick a use case  

Let’s say I’d like to check  what is in my audit log at regular intervals in order to keep an eye on my HPE GreenLake workspace. The following graphics explain what I will be doing: 

![](/img/don-picture.png)

For reference, I can also check the content of this audit log in the HPE GreenLake console, under the Manage Workspace tab. 

![Figure 2: Audit log in HPE GreenLake platform console](/img/auditlogui.jpg "Figure 2: Audit log in HPE GreenLake platform console")

## High-level algorithm 

Let’s look at the steps necessary to accomplish this. 

1. Gather details about the API access  
2. Get an API access/session token 
3. Compute date for filtering events 
4. Call audit log API 
5. Extract data and print results 
6. Wait a bit and go to Step 3 

## Give me a token, my friend!  

The HPE GreenLake platform console provides a way to create an API access that will deliver a Client ID and a Client Secret, which, in turn, I am going to use to generate a session token.  

> *Note: To learn how to create API credentials for HPE GreenLake platform APIS, check out the [Generate and Reset application credentials documentation](https://developer.greenlake.hpe.com/docs/greenlake/guides/#generate-or-reset-application-credentials).*  

My script will prompt for these two values (**client_id** and **client_secret**) and will make sure that **client_secret** is never printed anywhere. Because these values are quite long, I will also test the presence of the operating system’s environment variables CLIENTID and CLIENTSECRET. If present, I will use their values and not prompt the user. 

 From the HPE GreenLake console, I’ve learned that the cURL command to get a session token is: 

```markdown
curl -s --location 'https://sso.common.cloud.hpe.com/as/token.oauth2' \ 
--header 'Content-Type: application/x-www-form-urlencoded' \ 
--data-urlencode 'grant_type=client_credentials' \ 
--data-urlencode 'client_id='<CLIENTID>' \ 
--data-urlencode 'client_secret='<CLIENTSECRET>'
```

You can see this in the API section of the Manage Workspace screen of the HPE GreenLake console shown below: 

![Figure 3: API access management page](/img/apiaccess.jpg "Figure 3: API access management page")

The JSON response is received from this call in the following format: 

```json
{
"access_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjJGSmhvZ1lRMDZNazNBc2Q4UU8zU09ZVE9wayIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiI1ZDVjMDVjMi00OGM5LTRmNzAtOWY4ZS1iMzIwZmQxNTA0NmYiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBZGUyODI1ZjIxMWVjOGE4NGZlZGViY2I0YTc1NCIsImF1dGhfc291cmNlIjoiY2NzX3Rva2VuX21hbmFnZW1lbnQiLCJwbGF0Zm9ybV9jdXN0b21lcl9pZCI6IjMwMQlkZTI4MjVmMjExZWM4YTg0ZmVkZWJjYjRhNzU0IiwiaWF0IjoxNzAyMDUxMDg1LCJhcHBsaWNhdGlvbl9pbnN0YW5jZV9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImV4cCI6MTcwMjA1ODI4NX0.ocpBLPKG5XdL1s_ndMmuySGt5S2-ngcaZDTrb3P0L_M4px-6_7JOavSOW-x_lCns1i1mrYKk6vfswgsRtVVq7HQA-NT8PCbxNGBVzeBjhf0SLYtPUsDLr8tfZgIH3-tE4KoW9frAWVOM1plJ5DL8i7xIpj33yyrQiLEb84IAq5TuLQ6KesSvgatQyKgB4dGRZ6lISqh9jeXU7ZuoO2rnFRC8wDcPlx-XNX3oGM0-ZO5U-NXckdmxhaWMETKmDxnvvqmLbr_jvDxUwZWCcbPfIYyqP_OYpCljhtAPkGbj8U4V0xF7HMBms1qazSy9ZVgfJEPwvbdRwo5iRKAxi7oFnQ", 
"token_type":"Bearer", 
"expires_in":7199
}
```

The response provides an access token of type “Bearer” with a time to live of 7200 seconds (2 hours). You should renew a token before expiration, but for the purposes of this blog, I will just check and terminate cleanly if it happens. 

> > *Note: The token is returned as a standard JWT (JSON Web Token) described by [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519). You can dissect the content of your token using <https://jwt.io/>. Part of the data provided in the content is the date of expiration.*

## Querying the audit log 

According to the [API Reference documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/audit-logs/public/) for the Audit Log service, I can query the log using:  

```markdown
GET /audit-log/v1beta1/logs
```

I can also see from the documentation, that I can use a filter to keep only logs after a certain date using the following parameter: 

```markdown
GET /audit-log/v1beta1/logs?filter=createdAt ge '2023-07-24T04:21:22.00Z'
```

> > *Note: the format of the date used by the API, which is [ISO 8601](https://www.iso.org/standard/70908.html) of the form: YYYY-MM-DDTHH:MM:SS.ss-/+FF:ff. For example: '2023-07-24T04:21:22.00Z' for 4:21AM on the 24th of July, 2023 in UTC (Z=Zero Meridian)* 

This call needs an Authorization header which contains the access_token preceded with the string “Bearer ”. It is also a best practice to provide an Accept header to specify that a response in JSON (application/json) is expected, although this has become the default nowadays. 

The JSON response received from this API call should be in the form of: 

```json
{ 
"items":[], 
"count": 0, 
"offset": 0, 
"total": 0, 
"remainingRecords": true 
}
```

In this response, **count** provides the size of **items**, the returned array of items and **total**, the total number of existing items. If **total** is greater than **count**, I would need to call the same API multiple times, specifying an **offset** parameter to get the next batch, until **total** is reached or **remainingRecords** is false. 

**Items** is an array of audit items, with a single audit item being defined as shown below: 

```json
{ 
"id": "string", 
"type": "/audit-log/logs", 
"application":  
   { 
   "id": "string" 
   }, 
"region": "string", 
"user":  
   { 
   "username": "string" 
   }, 
"category": "string", 
"description": "string", 
"workspace":  
  { 
  "id": "string", 
  "workspaceName": "string" 
  }, 
"createdAt": "2019-08-24T14:15:22Z", 
"updatedAt": "2019-08-24T14:15:22Z", 
"generation": 0, 
"additionalInfo": { }, 
"hasDetails": true 
}
```

To keep it simple and human readable, in my scripts, I will only display: 

* user.username 
* description 
* createdAt 
* additionalInfo.ipAddress

## Putting it all together in bash 

Let’s first try to assemble a bash script. In the next sections, I will show you how to achieve the same using PowerShell and Python. 

### Step 1: Gather details about the API Access 

The first section of the script needs to take care of collecting the CLIENTID and CLIENTSECRET, checking first for environment variables, and prompting the user if no environment variables are set. Reading the CLIENTSECRET shall be done in a secure way to avoid displaying it. 

```shell
if [[ -z "${CLIENTID}" ]]; then 
  read -p "Enter your HPE GreenLake Client ID: " client_id 
else 
  client_id="${CLIENTID}" 
fi 

if [[ -z "${CLIENTSECRET}" ]]; then 
  client_secret="" 
  pass_var="Enter your HPE GreenLake Client Secret: "       

  while IFS= read -p "$pass_var" -r -s -n 1 letter 
  do 
    if [[ $letter == $'\0' ]]        
    then 
        break 
    fi 
    client_secret="${client_secret}$letter"      
    pass_var="*"             
  done 
else 
  client_secret="${CLIENTSECRET}" 
fi
```

### Step 2: Get a session token 

```shell
access_token="Bearer "`curl -s --location 'https://sso.common.cloud.hpe.com/as/token.oauth2' \ 
--header 'Content-Type: application/x-www-form-urlencoded' \ 
--data-urlencode 'grant_type=client_credentials' \ 
--data-urlencode 'client_id='$client_id'' \ 
--data-urlencode 'client_secret='$client_secret''  | jq .access_token | xargs`
```

### Step 3: Compute date for filtering events 

I can start this infinite loop and each time, I will collect the audit logs that were generated during the last minute. To do so, I will need to compute the time now and subtract 1 minute. 

```shell
for (( ; ; )) 
do 
  d=`date -v "-1M" -u +"%Y-%m-%dT%H:%M:%S.00Z"` 
  echo Last check at \(UTC\): $d 
  echo '---------------------'
```

### Step 4: Call audit log API 

I can now call the API with the right authorization header and set the filter parameter,  startTime greater than the computed date: 

```shell
http_response=$(curl -s -o out.json -w "%{http_code}" --location "https://global.api.greenlake.hpe.com/audit-log/v1beta1/logs?filter=startTime%20ge%20'$d'" \ 
--header 'Accept: application/json' \ 
--header "Authorization: $access_token")
```

### Step 5: Extract data and print results 

I need to check that the call returned an HTTP status code of 200 (Success) and then use [jq](https://jqlang.github.io/jq/download/) to display the selected fields: 

```shell
  if [ "$http_response" != "200" ]; then 
      echo "Error calling the API or token has expired!" 
      exit $http_response 
  else 
      cat out.json | jq '.items[] | { createdAt: .createdAt, username: .user.username, description: .description, ipAddress: .additionalInfo.ipAddress}' 
  fi
```

### Step 6: Wait a bit and go to Step 3 

I decided that a 1mn was a good interval, so I used the sleep command to wait 60 seconds and go back to the beginning of the infinite loop (Step 3). 

```shell
 sleep 60

done
```

### Running the bash code 

When the code is invoked in bash (tested on MacOS and Ubuntu), I can see that, every minute, the script displays time and audit logs (if any have occurred): 

```shell
$ ./spy_workspace.sh 

Last check at (UTC): 2023-12-18T09:05:53.00Z 
--------------------- 
{ 
  "createdAt": "2023-12-18T09:06:11.000000Z", 
  "username": "<usename>" 
  "description": "Loading workspace 3009de2825f211ec8a84fedebcb4a754 for user <username> 
  "ipAddress": "<ip address>" 
} 
{ 
  "createdAt": "2023-12-18T09:05:55.000000Z", 
  "username": "<usename>", 
  "description": "User <usename> logged in via ping mode.", 
  "ipAddress": "<ip address>" 
} 
Last check at (UTC): 2023-12-18T09:06:54.00Z 
--------------------- 
Last check at (UTC): 2023-12-18T09:07:55.00Z 
---------------------
```

> > *Note: The audit log API returns logs in LIFO (Last In First Out) mode. This is great for a GUI interface; however, it makes things a little more complicated for CLI and scripts. Sorting the logs is outside the scope of the blog post.*   

When the token expires after 2 hours, I can catch the error, display a message, and exit. 

```shell
Last check at (UTC): 2023-12-18T11:05:55.00Z 
--------------------- 
Error calling the API or token has expired!
```

## Putting it all together in PowerShell 

Let’s now see how I could do the same (or better) using PowerShell: 

### Step 1: Gather details about the API Access 

```powershell
if ($Env:CLIENTID -eq $null) { 
    $ClientID = read-host "Enter your HPE GreenLake Client ID"  
} 
else { 
    $ClientID = $Env:CLIENTID  
} 

if ($Env:CLIENTSECRET -eq $null) { 
    $secClientSecret = read-host  "Enter your HPE GreenLake Client Secret" -AsSecureString 
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secClientSecret) 
    $ClientSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)  
} 
else { 
    $ClientSecret = $Env:CLIENTSECRET 
}
```

### Step 2: Get a session token 

```powershell
$headers = @{}  
$body = "grant_type=client_credentials&client_id=" + $ClientID + "&client_secret=" + $ClientSecret 

# Get a Token 
$headers = @{}  
$headers["Content-Type"] = "application/x-www-form-urlencoded" 

try { 
    $response = Invoke-webrequest "https://sso.common.cloud.hpe.com/as/token.oauth2" -Method POST -Headers $headers -Body $body 
} 
catch { 
    Write-Host "Error retrieving access token!"  
    exit 
} 

# Capturing API Access Token 
$AccessToken = ($response.Content  | Convertfrom-Json).access_token
```

I can now prepare the headers for Step 4 

```powershell
# Headers creation 
$headers = @{}  
$headers["Authorization"] = "Bearer $AccessToken" 
$headers["Accept"] = "application/json"
```

### Step 3: Compute date for filtering events 

```powershell
While ($true) { 
    $d=((Get-Date).AddMinutes(-1)).ToUniversalTime() 
    $sd=$d.tostring('yyyy-MM-ddTHH:mm:ss.00Z') 
    write-host "Last check at (UTC): " $sd 
    write-host "--------------------"
```

### Step 4: Call audit log API 

Here, you’ll see that I can leverage exceptions that PowerShell supports: 

```powershell
    try { 
        $response = Invoke-webrequest "https://global.api.greenlake.hpe.com/audit-log/v1beta1/logs?filter=startTime%20ge%20'$sd'" -Method GET -Headers $headers  
    } 
    catch { 
        write-host "Error calling the API or token has expired!" 
        exit 
    }
```

### Step 5: Extract data and print results 

```powershell
$my_json=$response | ConvertFrom-Json 

    foreach ($i in $my_json.items){ 
        write-host "createdAt:" $i.createdAt 
        write-host "username: " $i.user.username  
        write-host "description: " $i.description  
        write-host "ipAddress: " $i.additionalInfo.ipAddress 
        write-host "--------------" 
    }
```

### Step 6: Wait a bit and go to Step 3 

```powershell
  start-sleep -Seconds 60 
}
```

### Running the PowerShell code 

Running the code in PowerShell (tested on Windows and MacOS) provides similar results: 

```markdown
PS> ./spy-workspace.ps1 
Last check at (UTC):  2023-12-18T15:16:59.00Z                                                            -------------------- 
createdAt: 12/18/2023 3:17:40 PM                                                                                 username:  <usename> 
description:  User <usename> logged out 
ipAddress:  <ip address> 
-------------- 
createdAt: 12/18/2023 3:17:36 PM 
username:  <usename> 
description:  Platform customer 3009de2825f211ec8a84fedebcb4a754 profile Address updated 
ipAddress:  <ip address> 
-------------- 
createdAt: 12/18/2023 3:17:17 PM 
username:  <usename> 
description:  Loading workspace 3009de2825f211ec8a84fedebcb4a754 for user <usename> 
ipAddress:  <ip address> 
-------------- 
createdAt: 12/18/2023 3:17:11 PM 
username:  <usename> 
description:  User <usename> logged in via ping mode. 
ipAddress:  <ip address> 
--------------
```

> > *Note: The audit log API returns logs in LIFO (Last In First Out) mode. This is great for a GUI interface; however, it makes things a little more complicated for CLI and scripts. Sorting the logs is outside the scope of the blog post.*   

Here I can catch the exception when the token has expired, display a message, and stop: 

```markdown
Last check at (UTC):  2023-12-18T17:17:02.00Z                                                                            
-------------------- 
Error calling the API or token has expired!
```

## Putting it all together in Python 

### Step 1: Gathering details about the API Access 

```python
from time import sleep 
from oauthlib.oauth2 import BackendApplicationClient        
from requests.auth import HTTPBasicAuth        
from requests_oauthlib import OAuth2Session        
from datetime import datetime, timedelta 
import requests 
import json 
import os 
import pwinput 
 
client_id = os.environ.get("CLIENTID", "") 
client_secret = os.environ.get("CLIENTSECRET", "") 

if client_id == "": 
    client_id = input("Enter your HPE GreenLake Client ID: ") 
 
if client_secret == "": 
    client_secret = pwinput.pwinput("Enter your HPE GreenLake Client Secret: ") 

client = BackendApplicationClient(client_id)        
oauth = OAuth2Session(client=client)        
auth = HTTPBasicAuth(client_id,client_secret)
```

### Step 2: Get a session token 

```python
try: 
    token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)        
except: 
    print("Error retrieving access token.") 
    exit() 

my_token = "Bearer " + token["access_token"]
```

### Step 3: Compute date for filtering events 

```python
while True: 
# Get date in right format 

    now = datetime.utcnow() + timedelta(minutes = -1) 
    date = now.strftime("%Y-%m-%dT%H:%M:%S.00Z") 
    print("Last check at (UTC): ", date) 
    print('-------------------')
```

### Step 4: Call audit log API 

```python
my_headers = { 
        'accept': 'application/json', 
        'Authorization': my_token, 
    } 
    my_url = "https://global.api.greenlake.hpe.com/audit-log/v1beta1/logs?filter=startTime%20ge%20'" + date + "'" 

# Fetch audit logs since last minute 
    response = requests.get(url=my_url, headers=my_headers) 

    try: 
        response.raise_for_status() 
    except: 
        print("Error calling the API or token has expired!") 
        exit()
```

### Step 5: Extract data and print results 

```python
json = response.json()  

    e = 0 
    while (e < json['count']): 
        print('createdAt: '+ json['items'][e]['createdAt']) 
        print('username: ' + json['items'][e]['user']['username']) 
        print('description: ' + json['items'][e]['description']) 
        try: 
            print('ipAddress: ' + json['items'][e]['additionalInfo']['ipAddress']) 
        except: { 
            print('ipAddress:') 
        } 
        print('-----------') 
        e = e + 1
```

### Step 6: Wait a bit and go to Step 3 

```python
    sleep(60)
```

### Running the Python code  

I can now run this script (tested on MacOS) and get the same behavior: 

```markdown
$ python3 ./spy_workspace.py 
Last check at (UTC):  2023-12-18T15:17:10.00Z 
------------------- 
createdAt: 2023-12-18T15:17:36.000000Z 
username: <username> 
description: Platform customer 3009de2825f211ec8a84fedebcb4a754 profile Address updated 
ipAddress: <ip address> 
-----------
```

Similar to how it was done in the other versions, I can catch an exception calling the audit log API, display a message and terminate: 

```markdown
Last check at (UTC):  2023-12-18T17:17:23.00Z 
------------------- 
Error calling the API or token has expired!
```

## What’s next? 

The next step for the HPE GreenLake APIs is to provide language specific SDK, which would provide better handling in PowerShell and Python, with stronger type checking and exception handling. In the meantime, I have shown you through this blog post that it is already possible to integrate with HPE GreenLake platform using the most popular scripting languages. 

Do you have any questions on HPE GreenLake platform API? Please join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel.