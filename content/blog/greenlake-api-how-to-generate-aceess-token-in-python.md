---
title: HPE GreenLake API - How to fetch and analyze Audit Logs in Python
date: 2024-07-26T02:57:15.972Z
featuredBlog: false
author: Subash Krishnan
authorimage: /img/subash-krishnan.png
disable: false
tags:
  - hpe-greenlake-platform
  - hpe-greenlake
  - API
---
Accessing and organizing audit logs is crucial for keeping your system secure, meeting compliance requirements, and running operations smoothly. HPE GreenLake’s audit logs are essential for tracking activities and spotting any unusual behavior that might indicate a security threat.

In this guide, we'll show you how to set up a Python script to automatically fetch and process HPE GreenLake audit logs. This will save you time and make it easier to keep an eye on your system.

If you’re new to HPE GreenLake’s APIs, take a look at this [blog post](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-3-tracking-activities-and-monitoring-health/) to get started with the HPE GreenLake platform API Audit Logs.

## Use cases of fetching audit logs

Audit logs are extremely useful in several scenarios:

* **Security Monitoring**: Keeping an eye on who accessed the system and what they did helps in spotting unusual activities that might be security threats.
* **Compliance Auditing**: Many industries have rules about keeping records of system activities. Audit logs are perfect for this and can be shown as proof during audits.
* **Operational Analysis**: By looking at the audit logs, companies can see patterns in how their systems are used, helping them to make better decisions about resources and planning.

## Detailed steps to set up the automation

Here’s a step-by-step guide to getting your audit logs automatically using Python:

### Step 1: Set up oauth2 authentication

HPE GreenLake uses OAuth2 for security, which means you first need to get an access token.

1. **Store Your Credentials**: Keep your client ID and secret safe but accessible to your script. A good practice is to store them in a text file. (In this case, I did save the client_Id in first line and client_secret in second line)
2. **Request a Token**: Your script needs to read these credentials and use them to request an access token. This token proves to HPE GreenLake that your script has permission to access the logs.

```
def generate_and_save_token():
    with open('credentials.txt', 'r') as file:
        client_id, client_secret = [line.strip() for line in file.readlines()]
    client = BackendApplicationClient(client_id=client_id)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=(client_id, client_secret))
    return token['access_token']
```

### Step 2: Fetch the audit logs

Now that you have a token, you can ask HPE GreenLake for the logs.

* **Make the Request**: Use the token to make a secure request to the audit logs endpoint. Handle any errors and ensure you process the logs only if the fetch was successful.

```
def fetch_audit_logs(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('https://global.api.greenlake.hpe.com/audit-log/v1beta1/logs', headers=headers)
    return response.json() if response.status_code == 200 else None
```

### Step 3: Process and save the data

After getting the logs, you'll want to turn them into a format that’s easy to read and use.

* **Process the JSON**: Convert the JSON data into a pandas DataFrame. This makes it easier to work with in Python.
* **Save to Excel**: Export this DataFrame to an Excel file. This file will be your audit log record that you can open, share, and analyze without needing specialised software.

## How does it look like in excel?

![](/img/excel-output.png)

I have used excel in this script just for testing and can be used with any of the databases including sqlite, postgres and oracle, and yes, python can do it, however, it varies on different use case, especially when it comes to real-time data monitoring or handling very large volumes of logs.

For these scenarios, other tools and platforms can be more suitable:

* **Splunk**: This powerful tool specializes in searching, monitoring, and analyzing machine-generated data via a Web-style interface. 
* **ELK Stack (Elasticsearch, Logstash, Kibana)**: This group of three open-source tools works together to allow users to collect logs from different sources, process them, and then visualize and analyze these data in real time. Elasticsearch acts as a search and analytics engine, Logstash processes and prepares your data, while Kibana lets you visualize the data with charts and graphs.
* **Tableau**: Known for its advanced visualization capabilities, Tableau can connect directly to nearly any database or log management solution to create complex dashboards and reports. 

## Full python script

```
import requests
from oauthlib.oauth2 import BackendApplicationClient
from requests.auth import HTTPBasicAuth
from requests_oauthlib import OAuth2Session
import pandas as pd
import json

# Constants
BASE_PATH = '<Directory in your PC>'
CREDENTIALS_FILE = f'{BASE_PATH}credentials.txt'
TOKEN_FILE_PATH = f'{BASE_PATH}access_token.txt'
AUDIT_LOGS_URL = 'https://global.api.greenlake.hpe.com/audit-log/v1beta1/logs'
EXCEL_FILE_PATH = f'{BASE_PATH}audit_logs.xlsx'

def generate_and_save_token():
    print("Reading credentials from file...")
    with open(CREDENTIALS_FILE, 'r') as file:
        lines = file.readlines()
        client_id = lines[0].strip()
        client_secret = lines[1].strip()

    print("Initializing OAuth client...")
    client = BackendApplicationClient(client_id=client_id)
    oauth = OAuth2Session(client=client)
    auth = HTTPBasicAuth(client_id, client_secret)

    print("Fetching access token...")
    token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)
    access_token = token['access_token']
    
    print("Saving access token to file...")
    with open(TOKEN_FILE_PATH, 'w') as token_file:
        token_file.write(access_token)

    print("Token fetched and saved successfully.")
    return access_token

def fetch_audit_logs():
    print("Generating and saving access token...")
    access_token = generate_and_save_token()
    headers = {'Authorization': f'Bearer {access_token}'}

    print("Fetching audit logs from API...")
    response = requests.get(AUDIT_LOGS_URL, headers=headers)
    
    if response.status_code == 200:
        print("Audit logs fetched successfully.")
        return response.json()
    else:
        print(f"Failed to fetch audit logs: HTTP status code {response.status_code}")
        return None

def process_and_export_to_excel(data):
    print("Processing audit log data...")
    df = pd.json_normalize(data['items'])
    df = df.reindex(columns=[  # Reordering and selecting columns
        'id', 'type', 'user.username', 'workspace.id', 'workspace.workspaceName',
        'category', 'application.id', 'application.applicationName', 
        'description', 'generation', 'createdAt', 'updatedAt', 
        'additionalInfo.ipAddress', 'hasDetails'
    ])
    df.rename(columns={  # Renaming for clarity
        'user.username': 'Username',
        'workspace.id': 'Workspace ID',
        'workspace.workspaceName': 'Workspace Name',
        'category': 'Category',
        'application.id': 'Application ID',
        'application.applicationName': 'Application Name',
        'description': 'Description',
        'generation': 'Generation',
        'createdAt': 'Created At',
        'updatedAt': 'Updated At',
        'additionalInfo.ipAddress': 'IP Address',
        'hasDetails': 'Has Details'
    }, inplace=True)
    
    print("Exporting data to Excel...")
    df.to_excel(EXCEL_FILE_PATH, index=False)
    print(f"Audit logs have been successfully exported to {EXCEL_FILE_PATH}.")

def main():
    print("Starting audit log processing...")
    audit_logs_data = fetch_audit_logs()
    if audit_logs_data:
        process_and_export_to_excel(audit_logs_data)
    print("Process completed.")

if __name__ == "__main__":
    main()
```

## Summary

This post showed how to access and organize HPE GreenLake's audit logs using Python. It explained how to set up OAuth2 to get an access token, fetch the audit logs, and turn them into an easy-to-read Excel file. This makes it easier to keep your system secure, follow rules, and run things smoothly.

In the next article, we will explore how to get additional detail of an audit log and all audit logs of a particular application or user.

If you still have any questions regarding the HPE GreenLake Audit Log APIs, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We’re always here to help.