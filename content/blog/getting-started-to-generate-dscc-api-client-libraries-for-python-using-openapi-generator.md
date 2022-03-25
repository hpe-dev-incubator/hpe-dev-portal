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
In this tutorial, you will be introduced with the process that is required to convert the HPE Data Services Cloud Console (DSCC) public API specification in the OpenAPI 3.X definition to any client libraries from several popular programming language. The goal of this conversion process is to achieve the agility of cloud-like operation where update to DSCC API client libraries is automatic and painless.

HPE DSCC public REST API is for customers looking to enhance their data-ops using the programmatic extensions from Data Services Cloud Console. Please see the [Data Services Cloud Console Platform page](https://developer.hpe.com/platform/data-services-cloud-console/home/) for detailed information about the DSCC benefits to customer's Data-Ops operation. Please see the [Getting Started with the HPE Data Services Cloud Console Public REST API](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/) for the authentication mechanism used to access the DSCC API.

The DSCC API definition is available for download in either YAML or JSON format from the DSCC API website (US region:  <https://console-us1.data.cloud.hpe.com/doc/api/v1/>) as shown below:

![DSCC API download](/img/dscc-api-spec.png "DSCC API specification download")

The definition file contains the following information:

* A brief description of the API definition along with the version of the API in this file.
* The available regions with the base-URL that must be concatenated to every API path. For more information about each region, please see [Getting Started with DSCC API](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/) blog post.
* Summary tags for the content of this API definition.

![](/img/the-introduction-to-the-api-definition.png "DSCC Open API specification (YAML)")

* All available endpoints of the DSCC resources, along with their HTTP headers, parameters, and the responses for each endpoint.
* The syntax of the HTTP methods (GET, POST, UPDATE, DELETE) and path (relative path).
* A more detailed description of the content of each response.

![](/img/examples-of-the-api-definition-end-points.png "Detail of a resource - host-initiator group")

With this definition file (YAML or JSON), anyone can generate client libraries into a selected programming language or scripts.  With the client libraries, a user can use them to programmatically consume the capabilities of DSCC. Currently, there are many tools on the market that are capable to perform the conversion. The list of some of the well-known open-API converter tools are:

* [OpenAPI generator](https://openapi-generator.tech/)
* [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
* [Azure AutoRest](https://github.com/Azure/autorest)
* REST API Client Code generator (Found within [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=ChristianResmaHelle.ApiClientCodeGenerator))

In this tutorial, I am going to cover the popular and simple OpenAPI generator from the [OpenAPI generator](https://openapi-generator.tech/) from soup to nuts. 

*Let's get on with it!*

### Generating Client Libraries using OpenAPI Generator painlessly

The OpenAPI Generator tool allows the automatic generation of API client libraries (SDKs), server stubs, documentation, and configuration with a given input of [OpenAPI spec](https://github.com/OAI/OpenAPI-Specification) (support both 2.0 and 3.0 OpenAPI formats). This tool can generate more than 50 programming languages that can be consumed by various DevOps tools.

The OpenAPI Generator tool is available for the variety of applications that meet the user's familiarity. The OpenAPI Generator website provides 4 different sets of application:

* A downloadable and executable **JAR** file that can be executed using **Java Run Time tool**.
* A **Docker** image that can be executed using the docker engine.
* Some dependencies in **Maven** and **Gradle** projects that can be used for building the automation tool.
* A node package manager (**npm**) package wrapper.

Those applications and the information about using the OpenAPI generator is available as the Readme section found on this GitHub page from the following URL: <https://github.com/OpenAPITools/openapi-generator> as shown below:

![](/img/openapi-generator.png "OpenAPI Generator GitHub Page")

The key information found in this GitHub website that will be useful and important is the latest stable version number that can be used for the conversion. This version is available at the right column of this webpage as shown below:

![](/img/openapi-generator-version-locatoin.png "Stable version for the openAPI generator project")

In this tutorial, let's take a look at the painless and simplest application of the OpenAPI Generator, which is using the JAR file. Actually, using the JAR file doesn't require any application installation at all. The JAR file can be downloaded and executed directly from the command line window in your workstation. The minimum requirement for executing the JAR file is that your workstation must be deployed with JAVA Run Time Environment (JRE) version 8. 

**Note:** For more information about the deployment of JAVA Run Time executables based on the operating system of your workstation, please take a look at the installation page from the JAVA website: <https://www.java.com/en/download/help/download_options.html>

The JAR file for this OpenAPI generator is available at Maven.org. You can download it from the following location: <https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar>. Below , you will find the syntax required to download the OpenAPI generator JAR files from each corresponding workstation:

**For Mac/Linux users:**

```shell
~$ wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar -O openapi-generator-cli.jar
```

**For Microsoft Windows users:**

```powershell
> Invoke-WebRequest -OutFile openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar
```

**Note:** The OpenAPI Generator version shown above is 5.4.0 (current version as of March 2022). Please keep in mind that, in the future, the location of the JAR file will change once the new version is released.  Please take a look at the figure above to obtain the latest version number, and modify the path to download the latest *openapi-generator-cli* JAR file.

Once the JAR file is downloaded, you can execute the following CLI at the folder where the JAR file is downloaded, to display the brief information on how to use this JAR file.

```shell
~$ java -jar openapi-generator-cli.jar help
```

The output will be something like this:

```typescript
usage: openapi-generator-cli <command> [<args>]

The most commonly used openapi-generator-cli commands are:
    author        Utilities for authoring generators or customizing templates.
    batch         Generate code in batch via external configs.
    config-help   Config help for chosen lang
    generate      Generate code with the specified generator.
    help          Display help information about openapi-generator
    list          Lists the available generators
    meta          MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.
    validate      Validate specification
    version       Show version information used in tooling

See 'openapi-generator-cli help <command>' for more information on a specific
command.
```

Now that the JAR file is downloaded and ready to be used, let's create a Python SDK using the OpenAPI generator JAR file. The following command line is used for generating a Python client library using the *openapi-generator-cli.jar* file.

```shell
~$ java -jar openapi-generator-cli.jar generate -i storage-api.yaml -g python -o sdks/dscc-python-sdk
```

* '-i' represents the input file, that is the downloaded DSCC OpenAPI spec which can be in the form of JSON or YAML.
* 'generate' represents generating the code based on the specified generator
* 'g' represents the generator/language name like Java, Go.
* 'o' represents output directory where the client library will be generated.

This Python DSCC client library can be generated in a few minutes. Below, you can see the screen output generated from the Python client library using the *openapi-generator.jar* file.

![](/img/client-generation.jpg "Generating Python SDK using OpenAPI generator")

The generated client library can be made available in your workstation, or it can also be uploaded to a GitHub library so that it can be made available for others to use. An example of the GitHub repository of a sample Python client library looks like this: 

![](/img/python-open-api-sdk-repo.jpg "GitHub repository of Python Client library generated using OpenAPI generator")

The client library comes with the following:

* The code for assisting the DSCC API calls.
* Documentation for this DSCC client library that derived from the API spec.
* Tests codes that can be used to validate the operation of this client library.
* Examples of every endpoint available in the README.md
* Required python dependencies (requirements.txt and test-requirements.txt) that are required for using this SDK

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

```shell
~$ pip install requirements.txt 
```

Below is the sample of the code to get the information about the associated user's RBAC association. This code will provide list of the capabilities (port.read, volume.create) of that related user who provided the authorization can exercise. To execute this code, please substitute the YOUR_BEARER_TOKEN with the access token generated in your example.

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

The output from the execution of the above code is shown below:

```Shell
$ python .\GetAudits.py
{'items': ['port.read', 'volume.create']}
```

Using these client generator tools, client libraries for DSCC can be generated faster and can be pushed to a GitHub repository and be made ready to use. One good advantage is that, automation of this process can be done by using CI/CD pipelines which require no manual intervention in updating any latest released APIs. 

Hope this blog on generating Python client library of DSCC is hepful. More blog posts will be coming to help you take further advantage of its capabilities. Stay tuned to the [HPE DEV](https://developer.hpe.com/blog) blog for more blog posts about HPE DSCC REST API.