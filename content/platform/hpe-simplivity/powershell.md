---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Using the API with Windows PowerShell
=====================================

This sample Windows PowerShell code performs authentication, issues an example GET request, performs a POST operation (in this case, renaming a backup), and monitors the status of the operation using a task instance.

When using Windows PowerShell to develop clients:

- Allow the use of self-signed SSL certifications, as follows: `[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $True }`

- Alternatively, you can use `https://github.com/Jaykul/Tunable-SSL-Validator`with the `-Insecure` option.

- Use PowerShell version 3 or above to support `Invoke-RestMethod`.

- HTTP Basic Authentication requires the manual creation of the base 64 encoding, as follows:

```
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f "simplivity","")))
Invoke-RestMethod -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}
$body = @{grant_type='password';username='username';password='password'} -Method POST
```

Consider the following code:

```
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $True }
$token =  Invoke-RestMethod -Uri https://10.150.1.93/api/oauth/token -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Body $body -Method Post
```

Which returns a response similar to the following:

```
access_token  : 45718cb1-528b-430f-8a6d-89e25ae9c7ea
token_type    : bearer
expires_in    : 83649
scope         : read write
updated_at    : 1459805657628
```

This example shows how to make a GET call for all backups:

```
$header = @{Authorization='Bearer '+$token.access_token}
$backups = Invoke-RestMethod -Insecure -Header $header -Uri https://10.150.1.93/api/backups
```

This example finds the type of the 22nd backup: `$backups.backups[22].type`

This example renames this backup:

```
$header['Content-Type']='application/vnd.simplivity.v1+json'
$uri = 'https://10.150.1.93/api/backups/'
$uri += $backups.backups[22].id
$uri += '/rename'
$body = @{backup_name='new_name'}
$body = $body | ConvertTo-Json
TunableSSLValidator\Invoke-RestMethod -Insecure -Header $header -Uri $uri -Method Post -Body $body
```

Sample code
-----------

```
# Set the base URL for REST API requests.
$BASE_URL = 'https://[host]/api/'

# Set the username and password.
$hms_username = 'HMS_USER'
$hms_password = 'HMS_PASS'

# Allow the use of self signed certificates.
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $True }

# Create a base64 encoding for HTTP Authentication.
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f "simplivity","")))

# Create a JSON body with username, password, and grant_type.
$body = @{grant_type='password';username=$hms_username;password=$hms_password}

# Authenticate user and generate access token.
$url = $BASE_URL+'oauth/token'
$header = @{Authorization=("Basic {0}" -f $base64AuthInfo)}
$response= Invoke-RestMethod -Uri $url -Headers $header -Body $body -Method Post
$access_token = $response.access_token;

# Add the access_token to the header.
$header =@{Authorization='Bearer '+$access_token}

# Issue a GET request: GET /backups.
$url = $BASE_URL+'backups'
$backups = Invoke-RestMethod -Header $header -Uri $url

# Issue a POST request: Rename the second backup from the GET results.
# Find the ID of the second backup from the GET results.
$backupid = $backups.backups[2].id

# Create a JSON body for the rename action.
$body = @{backup_name='new_name'}
$body = $body | ConvertTo-Json

# Form the URI.
$url = $BASE_URL+'backups/'
$url += $backupid
$url += '/rename'

# Issue the POST operation and expect a task object in return.
$response = Invoke-RestMethod -Header $header -Uri $url -Method Post -Body $body -ContentType 'application/vnd.simplivity.v1+json'

# Monitor the status of the rename operation by using a loop to query the task while this task is IN_PROGRESS.
# The state field in the JSON response body indicates the status.
$taskid = $response.task.id
$state = $response.task.state
$url = $BASE_URL+'tasks/'+$taskid
  while ($state -eq 'IN_PROGRESS')
  {
    # Wait one second and try again.
    Start-Sleep -s 1
    $response = Invoke-RestMethod -Header $header -Uri $url
    $state = $response.task.state
  }

# Print out the task result.
$response
```
