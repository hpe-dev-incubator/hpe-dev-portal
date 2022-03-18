---
title: Getting started to generate DSCC API Client Libraries for Python using
  OpenAPI-Generator
date: 2022-03-07T13:34:56.483Z
priority: 2
author: Anusha, Y; Sijeesh; RonD
authorimage: /img/404 developer.svg
thumbnailimage: /img/dscc-icon-transparent.png
tags:
  - data-services-cloud-console
---
# Getting started to generate DSCC API Client Libraries for Python using OpenAPI-Generator (painlessly!)

Data Services Cloud Console public REST API provides the interface for customers who are looking to enhance their data-ops using the programmatic extensions from Data Services Cloud Console (DSCC). The [Data Services Cloud Console Platform page](https://developer.hpe.com/platform/data-services-cloud-console/home/) details information about the DSCC benefits to customer.  Please see [Getting Started with DSCC API](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/) blog for the detail information to access the [DSCC API specification](https://console-us1.data.cloud.hpe.com/doc/api/v1/) that is created using [OpenAPI 3.X specification](https://swagger.io/docs/specification/about/). The API definition is available for download in either YAML or JSON format.

![DSCC API download](/img/dscc-api-spec.png "DSCC API specification download")

The definition file contains information about the following:

* All the endpoints of DSCC resources along with their HTTP headers, parameters, and the responses for each endpoint.
* Syntax of the HTTP methods (GET, POST, UPDATE, DELETE) and path (relative path)
* Description of each endpoint

  ![](/img/yamlfile.png "DSCC Open API specification (YAML)")

  With this definition file (YAML or JSON), users can generate client libraries and use them to consume the capabilities of the DSCC programmatically. Currently, there are many tools in the market which does this job, some of the well-known tools are:

  * [OpenAPI generator](https://openapi-generator.tech/)
  * [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
  * [Azure AutoRest](https://github.com/Azure/autorest)
  * REST API Client Code generator (Found within [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=ChristianResmaHelle.ApiClientCodeGenerator))

### Generating Client Libraries using OpenAPI Generator:

OpenAPI generator allows generation of API client libraries (SDK Generation), server stubs, documentation, and configuration automatically given an [OpenAPI spec](https://github.com/OAI/OpenAPI-Specification) (both 2.0 and 3.0 are supported). This tool supports more than 50 programming languages and Dev ops tools.

This tool is available in various forms for usage:

* A downloadable and executable JAR file
* Docker image
* Dependencies in Maven and  Gradle projects
* Node package manager (npm) package wrapper

![](/img/openapi-generator.png "OpenAPI Generator GitHub Page")



Lets look at the simple installation of openAPI generator, that is a JAR file. Actually using JAR file doesn't need installation at all, just download the JAR file and use it directly. The prerequisite to use the JAR file is to have Java runtime 8 (JRE) at a minimum.

The JAR file is available at Maven.org and its location is <https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar>

**For Mac/Linux users:**

```
wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar -O openapi-generator-cli.jar
```

**For Windows users:**

```
Invoke-WebRequest -OutFile openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar
```



Note: Current version of OpenAPI generator is 5.4.0, and in future the location of the jar file may change as per its new version number, so please visit this page and confirm the version number.

Once the JAR is downloaded, execute the following command from the directory, where the JAR file is downloaded, that shows the usage

```
java -jar openapi-generator-cli.jar help  
```

Now that the JAR file is downloaded and ready to use, lets create a Python SDK using the openAPI generator JAR file. The following command is used for generating a Python client library uisng openapi-generator.jar file.

```
java -jar openapi-generator-cli.jar generate -i storage-api.yaml -g python -o sdks/dscc-python-sdk
```

* 'i' represents the input file, that is the OpenAPI spec which can be in the form of JSON or YAML.
* 'generate' represents generating the code based on the specified generator
* 'g' represents the generator/language name like Java, Go.
* 'o' represents output directory where the client library will be generated.

A client library can be generated in a few minutes. Here is a snippet of generating a Python client library using the openapi-generator.jar file.

![](/img/client-generation.jpg "Generating Python SDK using OpenAPI generator")

The generated client library can be used in the local system or else it can be uploaded to a GitHub library and can be made available for others to use. The GitHub repository of a sample Python client library looks like this: 

![](/img/repo.jpg "GitHub repository of Python Client library generated using OpenAPI generator")

The client library comes with the following:

* Source code making API calls
* Documentation
* Tests
* Examples of every endpoint
* Required python dependencies (requirements.txt and test-requirements.txt) to be installed to make use of this SDK

For instance, take a look at the README file of this repository which has the following info.

1. Installation instructions

   ![](/img/readme.png "Python SDK installation instructions")
2. A sample code to get started with 

   ![](/img/sample.png "Sample code")
3. Documentation list for all endpoints

   ![](/img/api-endpoints.png "List of endpoints")
4. Documentation list for all models

   ![](/img/models.png "List of models")
5. Documentation about authorization

    

   ![](/img/auth.png "Authorization of API calls")

Lets run a sample code which displays the access types in DSCC. The usage of each endpoint is given under documentation of each endpoint in the form of a sample code. To execute the operations on the DSCC, all that is needed for a user to do is:

1. Provide an authorized token which is generated from the HPE GreenLake as mentioned in the [blog](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/)
2. Install the Python dependencies using the following command.

   ```
   pip install requirements.txt 
   ```

Below is the sampel code given to get access controls, substitute the YOUR_BEARER_TOKEN with the access token generated.

```python
import time
import openapi_client
from openapi_client.api import authz_api
from openapi_client.model.error_response import ErrorResponse
from openapi_client.model.access_controls_response import AccessControlsResponse
from pprint import pprint
# Defining the host is optional and defaults to https://eu1.data.cloud.hpe.com
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://eu1.data.cloud.hpe.com"
)
# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): JWTAuth
configuration = openapi_client.Configuration(
    access_token = 'YOUR_BEARER_TOKEN'
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = authz_api.AuthzApi(api_client)
    permission = ["volume.create","port.read","audit.read"] # [str] | List of permissions, each of which, has the form \"resource type.permission\" (ex. volume.read,volume.write). The word \"ANY\" can be used as a wild card for the resource type (ex. ANY.read). Omitting the permission parameters is equivalent to asking for all user permissions. (optional)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Get User Accessible Resources
        api_response = api_instance.get_access_controls(permission=permission)
        pprint(api_response)
    except openapi_client.ApiException as e:
        print("Exception when calling AuthzApi->get_access_controls: %s\n" % e)

```

The output looks like:

```
$ python .\GetAudits.py
{'items': ['port.read', 'volume.create']}

```

Using these client generator tools, client libraries for DSCC can be generated faster and can be pushed to a GitHub repository and be made ready to use. One good advantage is that, automation of this process can be done by using CI/CD pipelines which require no manual intervention in updating any latest released APIs. 



Hope this blog on generating Python client library of DSCC is hepful. More blog posts will be coming to help you take further advantage of its capabilities. Stay tuned to the [HPE DEV](https://developer.hpe.com/blog) blog for more blog posts about HPE DSCC REST API.