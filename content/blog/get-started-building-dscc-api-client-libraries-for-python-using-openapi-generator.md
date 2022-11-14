---
title: Get Started Building DSCC API Client Libraries for Python using OpenAPI
  Generator
date: 2022-03-28T16:57:29.512Z
priority: 2
author: Anusha, Y, Sijeesh Kattumunda and Ron Dharma
authorimage: /img/Avatar3.svg
thumbnailimage: /img/dscc-icon-transparent.png
tags:
  - data-services-cloud-console
---
In this tutorial, you will be introduced to the process that is required to convert the HPE Data Services Cloud Console public API specification in the OpenAPI 3.X definition to any client libraries from several popular programming languages. The goal of this conversion process is to achieve the agility of cloud-like operations where updates to console API client libraries are automatic and painless.

Data Serviecs Cloud Console public REST API is for customers looking to enhance their data-ops using the programmatic extensions from Data Services Cloud Console. Please see the [Data Services Cloud Console Platform page](https://developer.hpe.com/platform/data-services-cloud-console/home/) for detailed information about the console benefits to customer's Data-Ops operation. Please see the [Getting Started with the HPE Data Services Cloud Console Public REST API](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/) for the authentication mechanism used to access the console API.

The Data Services Cloud Console API definition is available for download in either YAML or JSON format from the console API website ([US region](https://console-us1.data.cloud.hpe.com/doc/api/v1/)) as shown below:

![Data Services Cloud Console API download](/img/dscc-api-spec.png "Data Services Cloud Console API specification download")

You can also download the console API YAML file using the following Unix command line:

```shell
$ wget https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml
```

The definition file contains the following information:

* A brief description of the API definition along with the version of the API in this file.
* The available regions with the base-URL that must be concatenated to every API path. For more information about each region, please see the [Getting Started with Data Services Cloud Console API](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/) blog post.
* Summary tags for the content of this API definition.

![](/img/the-introduction-to-the-api-definition.png "Data Services Cloud Console Open API specification (YAML)")

In addition, the definition file also contains:

* All available endpoints of the console resources, along with their HTTP headers, parameters, and the responses for each endpoint.
* The syntax of the HTTP methods (GET, POST, UPDATE, DELETE) and path (relative path).
* A more detailed description of the content of each response.

![](/img/examples-of-the-api-definition-end-points.png "Detail of a resource - host-initiator group")

With this definition file (YAML or JSON), anyone can generate client libraries into a selected programming language or scripts.  With the client libraries, a user can use them to programmatically consume the capabilities of Data Services Cloud Console. Currently, there are many tools on the market that are capable to perform the conversion. The list of some of the well-known open-API converter tools are:

* [OpenAPI generator](https://openapi-generator.tech/)
* [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
* [Azure AutoRest](https://github.com/Azure/autorest)
* REST API Client Code generator (Found within [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=ChristianResmaHelle.ApiClientCodeGenerator))

In this tutorial, I am going to cover the popular and simple OpenAPI generator from the [OpenAPI generator](https://openapi-generator.tech/) from soup to nuts. 

### *Let's get on with it!*

### Generating Client Libraries using OpenAPI Generator painlessly

The OpenAPI Generator tool allows the automatic generation of API client libraries (SDKs), server stubs, documentation, and configuration with a given input of [OpenAPI spec](https://github.com/OAI/OpenAPI-Specification) (supporting both 2.0 and 3.0 OpenAPI formats). This tool can generate more than 50 programming languages that can be consumed by various DevOps tools.

The OpenAPI Generator tool is available for the variety of applications that meet with the user's familiarity. The OpenAPI Generator website provides 4 different sets of applications:

* A downloadable and executable **JAR** file that can be executed using **Java Run Time tool**.
* A **Docker** image that can be executed using the docker engine.
* Some dependencies in **Maven** and **Gradle** projects that can be used for building the automation tool.
* A node package manager (**npm**) package wrapper.

Those applications and the information about using the OpenAPI generator are available in the Readme section found on this [GitHub page](https://github.com/OpenAPITools/openapi-generator) [](https://github.com/OpenAPITools/openapi-generator)as shown below:

![](/img/openapi-generator.png "OpenAPI Generator GitHub Page")

The key information found in this GitHub website that will be useful and important is the latest stable version number that can be used for the conversion. This version is available at the right column of this webpage as shown below:

![](/img/openapi-generator-version-locatoin.png "Stable version for the openAPI generator project")

In this tutorial, let's take a look at the painless and simplest application of the OpenAPI Generator, which is using the JAR file. Actually, using the JAR file doesn't require any application installation at all. The JAR file can be downloaded and executed directly from the command line window in your workstation. The minimum requirement for executing the JAR file is that your workstation must be deployed with JAVA Run Time Environment (JRE) version 8. 

**Note:** For more information about the deployment of JAVA Run Time executeables based on the operating system of your workstation, please take a look at the installation page from [the JAVA website](https://www.java.com/en/download/help/download_options.html).

The JAR file for this OpenAPI generator is available at Maven.org. You can download it from the following [location](https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar). Below, you will find the syntax required to download the OpenAPI generator JAR files from each corresponding operating systems:

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

* '-i' represents the input file, that is the downloaded Data Services Cloud Console OpenAPI spec which can be in the form of JSON or YAML.
* 'generate' represents generating the code based on the specified generator
* 'g' represents the generator/language name like Java, Go.
* 'o' represents output directory where the client library will be generated. In the above example, the generated files are going to be in the ~/sdks/dscc-python-sdk

This Python DSCC client library can be generated in a few minutes. Below, you can see the screen output generated from the Python client library using the *openapi-generator.jar* file.

![](/img/client-generation.jpg "Generating Python SDK using OpenAPI generator")

The results from the conversion are available under the following folder:

```shell
~/sdks/dscc-python-sdk$ ls -al
total 232
drwxrwxr-x 6 ronald ronald  4096 Mar 25 16:44 .
drwxrwxr-x 3 ronald ronald  4096 Mar 25 16:44 ..
drwxrwxr-x 2 ronald ronald 32768 Mar 25 16:44 docs
-rw-rw-r-- 1 ronald ronald   807 Mar 25 16:44 .gitignore
-rw-rw-r-- 1 ronald ronald   433 Mar 25 16:44 .gitlab-ci.yml
-rw-rw-r-- 1 ronald ronald  1830 Mar 25 16:44 git_push.sh
drwxrwxr-x 6 ronald ronald  4096 Mar 25 16:44 openapi_client
drwxrwxr-x 2 ronald ronald  4096 Mar 25 16:44 .openapi-generator
-rw-rw-r-- 1 ronald ronald  1040 Mar 25 16:44 .openapi-generator-ignore
-rw-rw-r-- 1 ronald ronald 98525 Mar 25 16:44 README.md
-rw-rw-r-- 1 ronald ronald    64 Mar 25 16:44 requirements.txt
-rw-rw-r-- 1 ronald ronald    28 Mar 25 16:44 setup.cfg
-rw-rw-r-- 1 ronald ronald  1002 Mar 25 16:44 setup.py
drwxrwxr-x 2 ronald ronald 36864 Mar 25 16:44 test
-rw-rw-r-- 1 ronald ronald    18 Mar 25 16:44 test-requirements.txt
-rw-rw-r-- 1 ronald ronald   150 Mar 25 16:44 tox.ini
-rw-rw-r-- 1 ronald ronald   304 Mar 25 16:44 .travis.yml
~/sdks/dscc-python-sdk$
```

The generated client library can be made available on your workstation, or it can also be uploaded to a GitHub Repo so that it can be made available for others to use. An example of the GitHub repository of a sample Python client library looks like this: 

![](/img/python-open-api-sdk-repo.jpg "GitHub repository of Python Client library generated using OpenAPI generator")

For information on uploading a project and the associated files into GitHub, please see the following [website](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github).

Now, the generated client library comes with the following files:

* The code for assisting the console API calls.
* The documentation for this console client library derived from the API spec.
* Some test codes that can be used to validate the operation of this client library.
* Examples of every endpoint available in the README.md
* The required Python dependencies (requirements.txt and test-requirements.txt) that are required for using this SDK

Now, you have all the components that are required for invoking the console API using Python scripts. To use this Data Services Cloud Console API client library, let's go through the steps that are described in the README.md:

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

Let's run a sample code that displays the access types in the console. The required parameters and the returned results for each endpoint are described under each of the endpoints in the sample code. To execute the an API call on the console, you will need:

1. The authorized access token which is generated from the HPE GreenLake API Gateway as mentioned in the blog [post](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/).
2. To install the required Python dependencies using the following command:

```shell
~$ pip install requirements.txt 
```

Below is the example code for obtaining the information about the associated user's RBAC association. This code sample will provide list of the capabilities (port.read, volume.create) that are authorized for the user to exercise. To execute this code, please substitute the **YOUR_BEARER_TOKEN** with the access token generated in your example.

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

Using the client generator tool such as described above, the client libraries for DSCC can be generated in agile manner.  As the result, the Data Services Cloud Console API client library in Python can be pushed to a GitHub repository automatically so that it will be ready to be used by any projects. Further advantage of this method is the automation using Continuous Integration/Continuous Deployment (CI/CD) pipeline which require no manual intervention in updating any projects to use the latest released version of the DSCC API. 

I hope this blog post on generating Python client libraries for Data Services Cloud Console is helpful.

More blog posts will be coming to help you taking further advantage of Data Services Cloud Console REST API capabilities. Stay tuned to the [HPE DEV](https://developer.hpe.com/blog) blog for more blog posts about Data Services Cloud Console REST API.