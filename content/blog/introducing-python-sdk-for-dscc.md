---
title: Introducing Python SDK for DSCC
date: 2023-03-29T13:45:50.979Z
priority: 0
author: Anusha Y and Sijeesh Kattumunda
authorimage: /img/Avatar1.svg
disable: false
---
In my previous blog, I discussed how to generate a Software Development Kit (SDK) from the Data services cloud console (DSCC) Open API spec using a third-party tool called OpenAPI generator. Today, I am going to talk more in detail on the Python SDK generated using the tool. As we progress, we will discuss the implementation aspects, and then take up a use-case to better understand how to use the SDK. 
Before we get into SDK, let’s understand the difference between an Application Programming Interface (API) and an SDK. 
APIs are a list of functions libraries that are used to communicate with a web service (via secure HTTP), whereas an SDK is a development kit that facilitates the usage of these APIs. APIs enable any software developer to create business opportunities by leveraging the capabilities provided by the API to extend their application whereas the SDK facilitates the process for developers. An SDK is a collection of software tools and programs for a specific application platform that allows developers to manipulate the functions supported by the service. These can be considered as a wrapper on the top of the APIs, making the code consumable by the application.
One thing to note is that, the user always gets access to the latest DSCC API version through the SDKs. How? The SDK is designed and deployed (using CI/CD pipelines such as Jenkins) in such a way that with every new release of the DSCC Open API spec, the SDKs get updated automatically. Thus, keeping it up-to date without any manual intervention. This also reduces time which is spent waiting for updates with newer features.
Let us take a look at the Python SDK 
Due to the wide adoption of Python, and for the python lovers out there who did not have an option to achieve their automation goals, we have the Python SDK available now. You can access the SDK on this github page.
This SDK contains the following:
•	Documentation (under docs folder)
•	Code libraries (under greenlake_data_services folder)
•	Test file (under test folder)
•	README file 
•	The Python libraries that are required to run this SDK (requirements.txt & test-requirements.txt)
Requirements:
All that is required for these scripts to run is Python (>=3.5). These scripts need the Python packages listed in the requirements.txt file. Then, all you have to do is execute the following command to install them:
pip install –r requirements.txt
Example Usage:
Let us consider Audits as an example. Audit events are a collection of tasks performed by users. The below code snippet uses a GET method to fetch the details of audit events, like task ID, user email, state, etc.
The sample code is provided in the documentation of this resource. Take the sample code and replace the BEARER_TOKEN with the access token. Generate the access token as mentioned in this blog.


Save the file as GetAudits.py.


```python
import time
import greenlake_data_services
from pprint import pprint
from greenlake_data_services.api import audit_api
from greenlake_data_services.model.audit_bad_request import AuditBadRequest
from greenlake_data_services.model.audit_internal_server_error import AuditInternalServerError
from greenlake_data_services.model.audit_results import AuditResults
from greenlake_data_services.model.audit_service_unavailable import AuditServiceUnavailable
from greenlake_data_services.model.audit_user_forbidden import AuditUserForbidden
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth
from oauthlib.oauth2 import BackendApplicationClient

CLIENT_SECRET = "36f6d0fa92ea11ecae650a4cf4dda9cf"
CLIENT_ID = "33a7fd43-4d63-41d5-8a10-1494eb5430c9"
client = BackendApplicationClient(CLIENT_ID)
oauth = OAuth2Session(client=client)
auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)
access_token = token["access_token"]
# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): JWTAuth
configuration = greenlake_data_services.Configuration(
    access_token = access_token,
    host = "https://us1.data.cloud.hpe.com"
)

# Enter a context with an instance of the API client
with greenlake_data_services.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = audit_api.AuditApi(api_client)
    filter = "filter_example" # str | Filter criteria - e.g. state eq Failure and occurredAt gt 2020-09-08T16:51:33Z (optional)
    limit = 1 # int | The number of results to return (optional)
    offset = 1 # int | The number of results to skip (optional)
    sort = "sort_example" # str | A comma separated list of properties to sort by, followed by a direction  indicator (\"asc\" or \"desc\"). If no direction indicator is specified the  default order is ascending. - e.g. state,version desc. Currently only support sorting by 1 property per request (optional)
    select = "select_example" # str | A list of properties to include in the response. Currently only support returning of all fields. (optional)

    try:
        # GET audit-events
        api_response = api_instance.audit_events_get(limit=limit, offset=offset)#filter=filter, , sort=sort, select=select)
        pprint(api_response)
    except greenlake_data_services.ApiExc eption as e:
        print("Exception when calling AuditApi->audit_events_get: %s\n" % e)
```

Run this Python script.

```python
$python GetAudits.py
```

The output of the execution looks like this.
	
The output of these scripts will be in JSON format. These kinds of example scripts along with documentation are available in this SDK for all the resources mentioned in the DSCC API spec.
These sample scripts can be used as per the requirement/use case to build automation scripts.

```json
{'items': [{'associated_resource': {'id': '/api/v1/tasks/3b0139a1-478b-4a24-9811-9a1e072b5744',
                                    'name': 'Delete [Vol-01.1]',
                                    'type': 'tasks'},
            'code': '',
            'context_id': '18337cba-c12f-4c16-a1c2-755471de8ed1',
            'customer_id': 'eb00678a466b11ec94d66ec0ab988305',
            'id': '9794158b-fd2e-4cb6-bbf6-c9df3867d035',
            'loggedAt': datetime.datetime(2022, 6, 8, 10, 12, 31, tzinfo=tzutc()),
            'message': 'Parent Task : Delete [Vol-01.1] - Completed',
            'occurred_at': '2022-06-08T10:12:31Z',
            'permission': '',
            'scope': '',
            'source': '/api/v1/storage-systems/device-type1/2M29510B8L/volumes/0c24e55f12e5609ca0e2de527dfa8426',
            'source_ip_address': 'fleet-gql-data-graph:4000',
            'state': 'Success',
            'task_id': '',
            'unique_id': 'audit.events+2+24511',
            'user_email': 'anusha.y@hpe.com',
            'version': 1}],
 'page_limit': 1,
 'page_offset': 1,
 'total': 6978}

```

Next Steps
Now that you have access to the Python SDK for DSCC, use it to create automations for any use-case that requires the use of DSCC APIs, right from your console. In my next blog, I talk about how to use Ansible playbooks to achive your automation goals for DSCC. Stay tuned!