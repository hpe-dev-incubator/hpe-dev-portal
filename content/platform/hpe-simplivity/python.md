---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Using the API with Python
=========================

This sample Python code performs authentication, issues three example GET requests, performs a POST operation (in this case, renaming a backup), and monitors the status of the operation using a task.

```
import requests
# Set the base URL for REST API requests.
url = 'https://[host]/api/'

# Set the username and password.
hms_username = 'HMS_USER'
hms_password = 'HMS_PASS'

# Authenticate user and generate access token.
response = requests.post(url+'oauth/token', auth=('simplivity', ''), verify=False, data={
  'grant_type':'password',
  'username':hms_username,
  'password':hms_password})
access_token = response.json()['access_token']

# Add the access_token to the header.
headers = {'Authorization':  'Bearer ' + access_token, 'Accept' : 'application/vnd.simplivity.v1+json'}

# Issue a GET request: GET /hosts.
response = requests.get(url+'hosts', verify=False, headers=headers)
print(response.json())

# Issue a GET request: GET /datastores.
response = requests.get(url+'datastores', verify=False, headers=headers)
print(response.json())

# Issue a GET request with sorting and filtering:
# GET first 100 backups of the MANUAL type
# sorted in ascending order by name
# and show only the name, id, and created_at fields.
response = requests.get(url+'backups?type=MANUAL&fields=name%2C%20id%2C%20created_at&limit=100&offset=0&sort=name&order=ascending', verify=False, headers=headers)
print(response.json())

# Issue a POST request: Rename the first backup from the GET results.
# Define a container to hold the JSON response.
json = response.json()
# Find the ID of the first backup from the GET results.
backupid = json['backups'][0]['id']
# Create a JSON body for the rename action.
body = '{"backup_name":"newbackupname"}'
# Specify the correct MIME type for the body.
headers['Content-Type'] = 'application/vnd.simplivity.v1+json'
# Issue the POST operation and expect a task object in return.
response = requests.post(url+'backups/'+backupid+'/rename', data=body, verify=False, headers=headers)
json = response.json()

# Monitor the status of the rename operation by using a loop to query
# the task while this task is IN_PROGRESS.
# The state field in the JSON response body indicates the status.
taskid = json['task']['id']
state = json['task']['state']
while (state == "IN_PROGRESS"):
    # Wait one second.
    time.sleep(1)
    response = requests.get(url+'tasks/'+taskid, verify=False, headers=headers)
    json = response.json()
    state = json['task']['state']
print(json)
```
