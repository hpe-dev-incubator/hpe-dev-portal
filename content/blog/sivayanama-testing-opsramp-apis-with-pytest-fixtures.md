---
title: Testing OpsRamp APIs with PyTest Fixtures
date: 2023-07-26T06:58:31.750Z
featuredBlog: false
author: BalaSubramanian Vetrivel
authorimage: /img/vetrivel-balasubramanian1-photo.jpg
disable: false
---



# Testing OpsRamp APIs with PyTest Fixtures
OpsRamp platform provides a rich set of APIs. By using these APIs customers can build solutions to automate various IT Operations Management (ITOM) workflows such as discovery and monitoring , event and incident mangement and remidiation and automation. Testing these APIs and automated solution is very critical to ensure reliability and stability of the same. PyTest is a powerful python testing framework and it is widely used to test APIs. Fixtures is one of the most important capabilities of PyTest framework. In this article, I will discuss some advanced techniques of testing OpsRamp APIs using PyTest fixtures.

## What Fixtures are 
PyTest fixtures are a special type of Python function that provisions a fixed baseline for testing. With the help of this baseline we can ensure tests are run in reliable manner and produce consistent results and the same tests can be repeatable.

## Install PyTest
Run the below command 

```shell
pip install -U pytest
```

## Verify PyTest installation 
Run the below command 

```shell
pytest --version
pytest 7.4.0

```

## Define Fixture
You can define fixtures just by decorating a simple Python function with [@pytest.fixture](https://docs.pytest.org/en/6.2.x/reference.html#pytest.fixture) for example 

Python Decorators is a very powerful and convenient way to alter the behavior of functions, For more details refer
[Python Decorators](https://www.geeksforgeeks.org/decorators-in-python)

```python
import pytest

@pytest.fixture
def hello_world():
    return 'Hello, Happy testing'
```



## Invoke fixtures
Test functions can invoke fixtures just by declaring the required fixtures as arguments. 

```python
def test_hello_world(hello_world):
    assert hello_world == 'Hello, Happy testing'
```

## Invoke OpsRamp API
Let us try to execute OpsRamp [*Get Access Token* API](https://develop.opsramp.com/v2/api/auth/tenancy-auth-oauth-token)  as shown below.

```python
import http.client
import json
import traceback
import urllib
from asyncio.log import logger

import pytest

def get_auth_header(api_endpoint, client_id, client_secret, grant_type="client_credentials"):
    """
    Returns bearer token string in the blow format
    bearer adfa-afdaf-1599-402c-a3ee-1ed24f597cc8
    """

    api_connection = http.client.HTTPSConnection(api_endpoint)
    params = {"client_id": client_id, "client_secret": client_secret, "grant_type": "client_credentials"}

    payload = urllib.parse.urlencode(params)

    headers = {
        'accept': "application/json",
        'content-type': "application/x-www-form-urlencoded",
    }

```

## Define Fixture to get Access Token

You can transform the above function as PyTest Fixture by simply decorating the code as shown below 



@pytest.fixture

def get_auth_header(api_endpoint, client_id, client_secret, grant_type="client_credentials"):



## Autouse fixtures

Sometimes some of your fixtures are required for all other tests. The above Get access token is the perfect use case for this. Every API call is depending on this API. In this case you can make this fixture as “autouse fixture”  by passing in *autouse=True* to the fixture’s decorator. The autouse fixure capability will reduce lot of redundant requests. 

```python
@pytest.fixture(autouse=True)
def get_auth_header(api_endpoint, client_id, client_secret, grant_type="client_credentials"):
```



## Provisioning of third-party plugin Fixtures 

Not necessarily have to define all fixtures on your own code. Fixtures can be provided by third-party plugins as well and you are free to use them. You just need to install the required plugins. We will see an example with pytest-datadir plugin.



Install this plugin as shown below 

```shell
pip install pytest-datadir
```



```python
@pytest.fixture(autouse=True)

def get_bearer_token(shared_datadir,request):

json_path = (shared_datadir / "auth_header_input.json")
```

![](https://lh4.googleusercontent.com/dacTgDdw17BzeyCitShA73WSip9LVtenQoNN-uraaN5tKEU5cA_xP3cEmNPWmTzU3A1HegdoOVvwPbyYqQuoLeEk4W766nIvpBdoTzUdIiT2dXiOQG0_h7atQWS7-T9qvRrieuhlEV84VS15ir11Ocw)



get\_bearer\_token fixture is using [shared_datadir](https://pypi.org/project/pytest-datadir/) fixture from third party plugin. Shared_datadir fixture provision data folder from the current folder as pathlib.Path object. 



## Fixture finalization

Usually, you do teardown or cleanup activities for each test for many good reasons such as the following: 

- The executed tests will not impact other tests

- Do not want to have the testing environment piled up with tons of test data

- Every test should execute in a clean state



Fixtures offer a very powerful teardown, cleanup capability known as finalization. 


```python
@pytest.fixture()

def create_client( shared_datadir, get_bearer_token,request):

client = Client()

client.logger.debug("IN\*\**")



payload_file = (shared_datadir / "create_client1.json")

input_payload= client.http_helper.to_json(payload_file)



client_response = client.create_client(input_payload,get_bearer_token)



def terminate_client():

client.logger.debug("IN\*\**")

util=Utils()



clientId=Client.clientId



if len(str(clientId)) > 0:

oauth_token=get_bearer_token

client.terminate_client(clientId, oauth_token)

client.logger.debug("OUT\*\**")



request.addfinalizer(terminate_client)





client.print_log(client_response)

client.logger.debug("OUT\*\**")

return client_response
```

You should add the finalizer function to the request’s context object of the test as shown below:

*request.addfinalizer(terminate_client)*



In the above example, you do all the test setup on the client and execute the test. Once the test is complete finalizer function runs and cleans up the whole thing. 



## Conclusion

In this article, you have seen what are PyTest Fixtures, and how to define, invoke, and Fixtures. Also, you have seen how to leverage testing of OpsRamp APIs using these fixtures, how to do teardown activities using finalizer functions. 








