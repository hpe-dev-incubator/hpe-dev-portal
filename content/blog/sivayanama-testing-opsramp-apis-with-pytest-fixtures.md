---
title: Testing OpsRamp APIs with PyTest Fixtures
date: 2023-07-26T06:58:31.750Z
featuredBlog: false
author: BalaSubramanian Vetrivel
authorimage: /img/vetrivel-balasubramanian1-photo.jpg
disable: false
---
The OpsRamp platform provides a rich set of APIs.


By using these APIs, customers can build solutions to automate various IT Operations Management (ITOM) workflows. These could include discovery and monitoring, event and incident management, or remediation and automation.
Testing these APIs and the resulting automated solution is critical to ensure the reliability and stability of the workflow


The PyTest is a powerful Python testing framework and it is widely used to test APIs. Fixtures are one of the most important capabilities of the PyTest framework. In this article, I will discuss some advanced techniques for testing OpsRamp APIs using PyTest fixtures.


## What Fixtures are
PyTest fixtures are a special type of Python function that provisions a fixed baseline for testing. With the help of this baseline, you can ensure tests are run reliably and produce consistent results. In addition, you can ensure that the same tests are repeatable.


## Install PyTest
Run the below command.


```shell
pip install -U pytest
```


## Verify PyTest installation
Run the below command.


```shell
pytest --version
pytest 7.4.0
```
## Define fixture
You can define fixtures just by decorating a simple Python function with [@pytest.fixture](https://docs.pytest.org/en/6.2.x/reference.html#pytest.fixture) for example


Python Decorators are a very powerful and convenient way to alter the behaviour of functions. For more details, refer to [Python Decorators](https://www.geeksforgeeks.org/decorators-in-python).


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
As shown below, execute OpsRamp [*Get Access Token* API](https://develop.opsramp.com/v2/api/auth/tenancy-auth-oauth-token).


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
## Define fixture to get Access Token
You can transform the above function as a PyTest fixture by simply decorating the code as shown below.


```python
@pytest.fixture
def get_auth_header(api_endpoint, client_id, client_secret, grant_type="client_credentials"):
```


## Autouse fixtures
Sometimes some of your fixtures are required for all other tests. The above Get access token is the perfect use case for this. Every API call depends on this API. In this case, you can designate this fixture as an “autouse fixture”  by passing in *autouse=True* to the fixture’s decorator. The autouse fixture capability will reduce a lot of redundant requests.


```python
@pytest.fixture(autouse=True)
def get_auth_header(api_endpoint, client_id, client_secret, grant_type="client_credentials"):
```
## Provisioning of third-party plugin fixtures
You do not necessarily have to define all fixtures on your code. Fixtures can be provided by third-party plugins as well and you are free to use them. You just need to install the required plugins. You can see an example with the pytest-datadir plugin.


Install this plugin as shown below.


```shell
pip install pytest-datadir
```


```python
@pytest.fixture(autouse=True)
def get_bearer_token(shared_datadir,request):
    json_path = (shared_datadir / "auth_header_input.json")
```


![](https://lh4.googleusercontent.com/dacTgDdw17BzeyCitShA73WSip9LVtenQoNN-uraaN5tKEU5cA_xP3cEmNPWmTzU3A1HegdoOVvwPbyYqQuoLeEk4W766nIvpBdoTzUdIiT2dXiOQG0_h7atQWS7-T9qvRrieuhlEV84VS15ir11Ocw)


The get\_bearer\_token fixture is using [shared_datadir](https://pypi.org/project/pytest-datadir/) fixture from a third-party plugin. The *Shared_datadir* fixture provisions the data folder as *pathlib.Path* object.


## Fixture finalization
Usually, you do teardown or cleanup activities for each test. There are many good reasons for this, such as:


- The executed tests will not impact other tests
- Do not want to have the testing environment piled up with tons of test data
- Every test should execute in a clean state


Fixtures offer a very powerful teardown/cleanup capability known as finalization.


```python
@pytest.fixture()
def create_client(shared_datadir, get_bearer_token, request):
    client = Client()
    client.logger.debug("IN***")


    payload_file = (shared_datadir / "create_client1.json")
    input_payload = client.http_helper.to_json(payload_file)


    # client_response=client.http_helper.do_post(url, input_payload, get_bearer_token)
    client_response = client.create_client(input_payload, get_bearer_token)


    def terminate_client():
        client.logger.debug("IN***")
        util = Utils()


        clientId = Client.clientId


        if len(str(clientId)) > 0:
            oauth_token = get_bearer_token
            client.terminate_client(clientId, oauth_token)
        client.logger.debug("OUT***")


    request.addfinalizer(terminate_client)


    client.print_log(client_response)
    client.logger.debug("OUT***")
    return client_response


```


You should add the finalizer function to the request’s context object of the test as shown below:


*request.addfinalizer(terminate_client)*


In the above example, you do all the test set-up on the client and execute the test. Once the test is complete, the finalizer function runs and cleans up the whole thing.


## Conclusion
In this article, I have explained what PyTest fixtures are and how to define, invoke and implement fixtures. I also showed you how to leverage the testing of OpsRamp APIs using these fixtures and how to do teardown activities using the finalizer functions. Check back often on the HPE Developer Community blog to find more blog posts on OpsRamp.





















