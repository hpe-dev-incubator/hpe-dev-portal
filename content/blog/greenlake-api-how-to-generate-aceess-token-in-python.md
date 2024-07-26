---
title: Greenlake API - How To Fetch And Analyse Audit Logs  in Python?
date: 2024-07-26T02:57:15.972Z
featuredBlog: false
author: Subash Krishnan
authorimage: /img/subash-krishnan.png
disable: false
---
The main reason to use this script is to simplify how you access and organize HPE GreenLake’s audit logs. These logs are essential for maintaining security, meeting compliance requirements, and optimising system operations through detailed activity records.

## Use Cases of Fetching Audit Logs

Audit logs are extremely useful in several scenarios:

* **Security Monitoring**: Keeping an eye on who accessed the system and what they did helps in spotting unusual activities that might be security threats.
* **Compliance Auditing**: Many industries have rules about keeping records of system activities. Audit logs are perfect for this and can be shown as proof during audits.
* **Operational Analysis**: By looking at the audit logs, companies can see patterns in how their systems are used, helping them to make better decisions about resources and planning.

## Detailed Steps to Set Up the Automation

Here’s a step-by-step guide to getting your audit logs automatically using Python:

### Step 1: Set Up OAuth2 Authentication

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

### Step 2: Fetch the Audit Logs

Now that you have a token, you can ask HPE GreenLake for the logs.

* **Make the Request**: Use the token to make a secure request to the audit logs endpoint. Handle any errors and ensure you process the logs only if the fetch was successful.

```
def fetch_audit_logs(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('https://global.api.greenlake.hpe.com/audit-log/v1beta1/logs', headers=headers)
    return response.json() if response.status_code == 200 else None

```



### Step 3: Process and Save the Data

After getting the logs, you'll want to turn them into a format that’s easy to read and use.

* **Process the JSON**: Convert the JSON data into a pandas DataFrame. This makes it easier to work with in Python.
* **Save to Excel**: Export this DataFrame to an Excel file. This file will be your audit log record that you can open, share, and analyze without needing specialized software.



## Full Script

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