---
title: Explore the HPE GreenLake for Compute Ops Management REST API using Curl
  and Postman
date: 2022-11-30T12:36:05.351Z
author: Frederic Passeron  & Vincent Berger
authorimage: /img/vb-fp.png
disable: false
---
HPE GreenLake for Compute Ops Management automates and transforms complex and time-consuming compute management operations into a simplified experience across edge-to-cloud. Whether you are an IT OPS or a DEV OPS engineer, you know that automation is the key to success. And today’s automation relies heavily on APIs and how one can interact easily with them. So, let us show you how to leverage the API provided so you, too, can take advantage of what HPE GreenLake for Compute Ops Management can provide.

 



 

 

# [HPE GreenLake for Compute Ops Management REST API](<>)

HPE GreenLake for [Compute Ops](<>) <!--\[if !supportAnnotations]-->[\[RD1]](#_msocom_1)<!--\[endif]--> Management provides a Restful API to customers who want to manage their devices programmatically or through a command line interface. The API enables customers to invoke operations or tasks such as list devices, see device details, device health, manage a device's firmware and much more.

 

To learn more about HPE GreenLake for Compute Ops Management API methods and resources, you can refer to [the API reference documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/).

Here are some of the operations you can do with the HPE GreenLake for Compute Ops Management API:

<!--\[if !supportLists]-->·       <!--\[endif]-->Obtain the list of servers in your account

<!--\[if !supportLists]-->·       <!--\[endif]-->Obtain the list of firmware bundles

<!--\[if !supportLists]-->·       <!--\[endif]-->Obtain the list of job templates

<!--\[if !supportLists]-->·       <!--\[endif]-->Perform a firmware updat[e](<>)<!--\[if !supportAnnotations]-->[\[RD2]](#_msocom_2)<!--\[endif]--> 

<!--\[if !supportLists]-->·       <!--\[endif]-->Run a carbon emissions report

<!--\[if !supportLists]-->·       <!--\[endif]-->Power on/off/restart a server

A Postman collection of executable API requests for the HPE GreenLake for Compute Ops Management API can be found [HERE](https://www.postman.com/jullienl/workspace/lionel-jullien-s-public-workspace/collection/991177-10c5377d-892b-4612-9e81-23d75d6c2f0d?ctx=documentation).

 

<!--\[if gte vml 1]><v:shape id="Picture_x0020_19" o:spid="_x0000_i1046"
 type="#_x0000_t75" alt="Graphical user interface, text, application, email&#10;&#10;Description automatically generated"
 style='width:468pt;height:339.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image003.png"
  o:title="Graphical user interface, text, application, email&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Graphical user interface, text, application, email

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image004.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

 

I would like to share with you today a few examples of REST API calls that can be made through simple [curl](<>) <!--\[if !supportAnnotations]-->[\[RD3]](#_msocom_3)<!--\[endif]--> commands or Postman examples.

 

The HPE GreenLake for Compute Ops Management REST API uses the OAuth 2.0 HPE GreenLake authentication flow, where a limited lifetime access token is provided in the header of each REST API request as the authorization bearer. The process to generate this necessary access token is well described in the blog post written by Nisha Thomas, entitled [How to use an API access token for HPE GreenLake for Compute Ops Management](https://developer.hpe.com/blog/how-to-use-an-api-access-token-for-hpe-greenlake-for-compute-ops-management/). If you are not familiar with this token generation and usage,  I would strongly advise you to read it as it represents the very first and important steps to be performed prior to getting the chief benefits described above.

 

 

<!--\[if !supportLists]-->·       <!--\[endif]-->Sign up for an HPE Account

<!--\[if !supportLists]-->·       <!--\[endif]-->Connect to HPE GreenLake

<!--\[if !supportLists]-->·       <!--\[endif]-->Create API Client Credentials

<!--\[if !supportLists]-->·       <!--\[endif]-->Generate an Access Token based on your credentials and relevant connectivity endpoint (HPE GreenLake for Compute Ops Management in our case)

 

 

Once the access token is generated, it can be used to make API calls to perform any HTTP [](<>)[method](<>)<!--\[if !supportAnnotations]-->[\[RD4]](#_msocom_4)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[PF(D(x5]](#_msocom_5)<!--\[endif]-->  against the desired HPE GreenLake for Compute Ops Management resource. To do this, you simply add the access token to the HTTP header with the keyword "Authorization: Bearer {token}". The name “Bearer authentication” can be understood as “give access to the bearer of this token”.

 

There are several ways to invoke the API:

<!--\[if !supportLists]-->·       <!--\[endif]-->Using REST directly or from JavaScript

<!--\[if !supportLists]-->·       <!--\[endif]-->Using [](<>)[cURL](<>)<!--\[if !supportAnnotations]-->[\[RD6]](#_msocom_6)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[PF(D(x7]](#_msocom_7)<!--\[endif]--> 

<!--\[if !supportLists]-->·       <!--\[endif]-->Using Python

<!--\[if !supportLists]-->·       <!--\[endif]-->Using Go

<!--\[if !supportLists]-->·       <!--\[endif]-->Using PowerShell

<!--\[if !supportLists]-->·       <!--\[endif]-->Using Ansible, Terraform, etc.

 

The [HPE GreenLake for Compute Ops Management API Reference site](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) leverages an [](<>)[OpenAPI](<>) <!--\[if !supportAnnotations]-->[\[RD8]](#_msocom_8)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[PF(D(x9]](#_msocom_9)<!--\[endif]--> conformant documentation that provides a complete explanation of the operations supported by the [](<>)[URIs,](<>) <!--\[if !supportAnnotations]-->[\[RD10]](#_msocom_10)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[PF(D(x11]](#_msocom_11)<!--\[endif]--> as well as sample requests and responses.

 

If you are wondering which to use, cURL is probably a good choice if you like command line interfaces, Postman if you prefer graphical user interfaces, and PowerShell or Python if you are really into programming.

 

# Using cURL <!--\[if !supportLineBreakNewLine]--> <!--\[endif]-->

From the command prompt, use a simple cURL command like:

 

**curl -X GET https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?limit=2 -H "Authorization:Bearer ,< access_token_here>”**

 

\
Note that you must use the correct connectivity endpoint according to the region where HPE GreenLake for Compute Ops Management is deployed. Currently, these are the connectivity endpoints for the possible HPE GreenLake for Compute Ops Management regions:

 

[•](<>) [EU Central](https://eu-central1-api.compute.cloud.hpe.com)  

•    [AP Northeast](https://eu-central1-api.compute.cloud.hpe.com)

•    [US West](https://us-west2-api.compute.cloud.hpe.com)

 

 

The request uses the **GET** method for the **/compute-ops/v1beta2/servers** resource to obtain the list of the available servers as described in the [](<>)[API reference](<>)<!--\[if !supportAnnotations]-->[\[RD12]](#_msocom_12)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[PF(D(x13]](#_msocom_13)<!--\[endif]--> :

 

<!--\[if gte vml 1]><v:shape id="_x0000_i1045" type="#_x0000_t75" alt="Graphical user interface&#10;&#10;Description automatically generated"
 style='width:342pt;height:100.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image005.png"
  o:title="Graphical user interface&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Graphical user interface

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image006.jpg)<!--\[endif]-->.

 

The command uses a header parameter with keyword **"Authorization:Bearer {token}**"

 

**?limit=2** at the end of the URL is a query parameter to limit the response to a maximum of two servers as documented in the request pane of the *servers* resource:

\
<!--\[if gte vml 1]><v:shape id="_x0000_i1044"
 type="#_x0000_t75" alt="Graphical user interface, application&#10;&#10;Description automatically generated"
 style='width:310pt;height:171.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image007.png"
  o:title="Graphical user interface, application&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Graphical user interface, application

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image008.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

 

 As a result of the command, the API response lists two compute servers that are on boarded and assigned to the corresponding application for the user's account.

\
<!--\[if gte vml 1]><v:shape id="Picture_x0020_107"
 o:spid="_x0000_i1043" type="#_x0000_t75" alt="Text&#10;&#10;Description automatically generated"
 style='width:363pt;height:170pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image009.png"
  o:title="Text&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image010.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

 

To see the API response code[, add](<>) <!--\[if !supportAnnotations]-->[\[RD14]](#_msocom_14)<!--\[endif]--> -I at the end of the command:\
\
**curl -X GET https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?limit=2 -H "Authorization:Bearer <your access_token_here>” –I**

<!--\[if gte vml 1]><v:shape id="Picture_x0020_120" o:spid="_x0000_i1042"
 type="#_x0000_t75" alt="Text&#10;&#10;Description automatically generated"
 style='width:243pt;height:65pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image011.png"
  o:title="Text&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image012.jpg)<!--\[endif]-->

 

The response code displays **200 OK.** This status response code indicates that the request has succeeded. The complete list of response codes for each resource in the API reference is shown below:

**\
<!--\[if gte vml 1]><v:shape
 id="_x0000_i1041" type="#_x0000_t75" alt="Background pattern&#10;&#10;Description automatically generated"
 style='width:385.5pt;height:129.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image013.png"
  o:title="Background pattern&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Background pattern

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image014.jpg)<!--\[endif]-->**

 

The JSON response provided by the API is not formatted, which makes it difficult to read and understand the JSON content, but a tool like jq (<https://stedolan.github.io/jq/>) can prettify the content. Just add “| jq” at the end of the command to get a better visual display

\
\
<!--\[if gte vml 1]><v:shape id="Picture_x0020_106"
 o:spid="_x0000_i1040" type="#_x0000_t75" alt="Text&#10;&#10;Description automatically generated"
 style='width:338.5pt;height:243.5pt;visibility:visible;mso-wrap-style:square'>
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image015.png"
  o:title="Text&#10;&#10;Description automatically generated"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image016.jpg)<!--\[endif]-->

The API supports several query parameters depending on the resource type, such as filter, limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection).\
\
Filters provide the ability to limit the resources that take part in the action of a REST call. When a REST call includes a filter, the GET or DELETE action is restricted to a response that meets the filter requirements. Filters are specified by using the query parameter 'filter'.

 

Here is a simple example of filtering:

 

**GET <URI>?filter=powerState eq 'Off'**

 

This example shows a simple filter. The resources returned by the query are limited to results with the attribute **powerState** and the value **Off**.

 

To use a filter on a nested property name, the '**/**' separator can be specified as follows:

 

**GET /compute-ops/v1beta2/servers?filter=hardware/model eq 'ProLiant DL365 Gen10 Plus'****\
{**

 **   "offset": 0,**

 **   "count": 20,**

 **   "total": 20,**

 **   "items": [**

 **       {**

 **           "id": "P39368-B21+CN70421C51",**

 **           "type": "compute-ops/server",**

 **           "platformFamily": "PROLIANT",**

 **           "resourceUri": "/compute-ops/v1beta2/servers/P39368-B21+CN70421C51",**

 **           "name": "HPE-HOL56",**

 **           "createdAt": "2022-04-29T12:35:35.265978+00:00",**

 **           "updatedAt": "2022-10-25T19:54:36.572565+00:00",**

 **           "generation": 292,**

 **           "hardware": {**

 **               "serialNumber": "CN70421C51",**

 **               "model": "ProLiant DL365 Gen10 Plus",**

 **               "uuid": "33393350-3836-4E43-3730-343231433531",**

 **               "productId": "P39368-B21",**

 **               "powerState": "ON",**

 **               "indicatorLed": "OFF",**

 **               "health": {**

 **                   "summary": "OK",**

 **                   "healthLED": "OK",**

 **                   "fans": "OK",**

 **                   "fanRedundancy": "REDUNDANT",**

 **                   "liquidCooling": "NOT_PRESENT",**

 **                   "liquidCoolingRedundancy": "NOT_PRESENT",**

 **                   "memory": "OK",**

 **                   "network": "UNKNOWN",**

 **                   "powerSupplies": "OK",**

 **                   "powerSupplyRedundancy": "NOT_PRESENT",**

 **                   "processor": "OK",**

 **                   "storage": "OK",**

 **                   "temperature": "OK",**

 **                   "bios": "OK",**

 **                   "smartStorage": "OK"**

 **               },**

 **               "bmc": {**

 **                   "mac": "B4:7A:F1:4E:9E:92",**

 **                   "ip": "172.30.231.116",**

 **                   "hostname": "None"**



The following cURL command includes the filter



**curl -X GET “https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?filter=contains(hardware/model,'DL365')” -H "Authorization:Bearer <your access_token_here>”**

<!--\[if gte vml 1]><v:shape id="Picture_x0020_117" o:spid="_x0000_i1039"
 type="#_x0000_t75" alt="Text&#10;&#10;Description automatically generated"
 style='width:468pt;height:282pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image017.png"
  o:title="Text&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Text

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image018.jpg)<!--\[endif]-->

 

Contains is another filter option to return resources where associated **hardware/model** contains **DL365.** The result of the command shows 4 server resources whose model name contains DL365.

 

The filter query syntax supports a richer set of filters than the single operation in the previous example. Filtering syntax is broken down by Operations, Logic, and Types. In the previous exampl[e,](<>) <!--\[if !supportAnnotations]-->[\[RD15]](#_msocom_15)<!--\[endif]--> the operation was 'eq' for equality. Most comparison operations require the evaluated property name to the left of the operator [](<>) <!--\[if !supportAnnotations]-->[\[RD16]](#_msocom_16)<!--\[endif]--> and a literal to the right.

\
\
<!--\[if gte vml 1]><v:shape id="_x0000_i1038"
 type="#_x0000_t75" alt="Table&#10;&#10;Description automatically generated"
 style='width:271pt;height:116.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image019.png"
  o:title="Table&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Table

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image020.jpg)<!--\[endif]-->

 

To learn more about Filtering, see [the HPE GreenLake for Compute Ops Management guide.](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/guide/#filtering)

 

The HPE GreenLake for Compute Ops Management API supports many resources that are described in the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) document, as illustrated below:

\
<!--\[if gte vml 1]><v:shape id="Picture_x0020_118"
 o:spid="_x0000_i1037" type="#_x0000_t75" alt="Graphical user interface&#10;&#10;Description automatically generated with low confidence"
 style='width:191.5pt;height:401pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image021.png"
  o:title="Graphical user interface&#10;&#10;Description automatically generated with low confidence"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Graphical user interface

Description automatically generated with low confidence](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image022.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

Unique Resource Identifiers [(URIs)](<>) <!--\[if !supportAnnotations]-->[\[RD17]](#_msocom_17)<!--\[endif]--> are used to identify a resource. A URI is a full API path ending in an identification number. For example:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

<!--\[if !supportLists]-->·       <!--\[endif]-->/compute-ops/v1beta2/servers/{serverId}

<!--\[if !supportLists]-->·       <!--\[endif]-->/compute-ops/v1beta1/reports/{id}/data

 

**v1beta1**, **v1beta2** in the URI is the version of the resource that is being accessed.\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

One can invoke the common HTTP [](<>)[methods](<>)<!--\[if !supportAnnotations]-->[\[RD18]](#_msocom_18)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[RD19]](#_msocom_19)<!--\[endif]--> , like GET, POST, PUT, PATCH, and DELETE, on resources in the HPE GreenLake for Compute Ops Management API as shown below for the **filters** resource:

 

<!--\[if gte vml 1]><v:shape id="_x0000_i1036" type="#_x0000_t75"
 alt="A screenshot of a computer&#10;&#10;Description automatically generated"
 style='width:370pt;height:134pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image023.png"
  o:title="A screenshot of a computer&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![A screenshot of a computer

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image024.jpg)<!--\[endif]-->

 

Refer to the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) site for a complete list of [](<>)[methods](<>)<!--\[if !supportAnnotations]-->[\[RD20]](#_msocom_20)<!--\[endif]--> <!--\[if !supportAnnotations]-->[\[PF(D(x21]](#_msocom_21)<!--\[endif]-->  supported by each API resource.

 

 

# Using Postman <!--\[if !supportLineBreakNewLine]--> <!--\[endif]-->

Postman is a tool designed to build and use APIs.

 

 To get started, “create a request”, as shown below:\
\
<!--\[if gte vml 1]><v:shape id="Image_x0020_15"
 o:spid="_x0000_i1035" type="#_x0000_t75" alt="Une image contenant texte&#10;&#10;Description générée automatiquement"
 style='width:358.5pt;height:141pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image025.png"
  o:title="Une image contenant texte&#10;&#10;Description générée automatiquement"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Une image contenant texte

Description générée automatiquement](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image026.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

In the request URL field, enter the endpoint URL ﻿[](<>)**<https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?limit=2>**<!--\[if !supportAnnotations]-->[\[RD22]](#_msocom_22)<!--\[endif]--> This is the base connectivity endpoint** ﻿<https://us-west2-api.compute.cloud.hpe.com>** you have seen in earlier, followed by the resource URI you want to query ﻿**/compute-ops/v1beta2/servers** as described in the API reference table.

\
<!--\[if gte vml 1]><v:shape id="Picture_x0020_103"
 o:spid="_x0000_i1034" type="#_x0000_t75" alt="Graphical user interface&#10;&#10;Description automatically generated"
 style='width:359pt;height:105.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image005.png"
  o:title="Graphical user interface&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Graphical user interface

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image027.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

\
 In order to limit the output as documented in the request pane of the *servers* resource:, use query parameter ﻿**?limit=2**

\
\
<!--\[if gte vml 1]><v:shape id="Picture_x0020_102"
 o:spid="_x0000_i1033" type="#_x0000_t75" alt="Graphical user interface, application&#10;&#10;Description automatically generated"
 style='width:359.5pt;height:199pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image007.png"
  o:title="Graphical user interface, application&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Graphical user interface, application

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image028.jpg)<!--\[endif]-->\
<!--\[if gte vml 1]><v:shape id="Image_x0020_14"
 o:spid="_x0000_i1032" type="#_x0000_t75" alt="Une image contenant texte&#10;&#10;Description générée automatiquement"
 style='width:5in;height:133.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image029.png"
  o:title="Une image contenant texte&#10;&#10;Description générée automatiquement"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Une image contenant texte

Description générée automatiquement](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image030.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

In the *Authorization* tab[, choose](<>) <!--\[if !supportAnnotations]-->[\[RD23]](#_msocom_23)<!--\[endif]--> **Bearer Token** in the *Type* drop-down menu and paste the access token that was generated earlier in the Token field. Postman will generate the appropriate Authorization header when you send the request.

 

 

\
<!--\[if gte vml 1]><v:shape id="Image_x0020_3"
 o:spid="_x0000_i1031" type="#_x0000_t75" alt="Une image contenant texte&#10;&#10;Description générée automatiquement"
 style='width:376pt;height:145.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image031.png"
  o:title="Une image contenant texte&#10;&#10;Description générée automatiquement"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Une image contenant texte

Description générée automatiquement](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image032.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

Hit the **Send** button to get a **200 OK** status response indicating success and a JSON body with the details of two compute servers on boarded and assigned to the corresponding application for the user's account.

\
\
<!--\[if gte vml 1]><v:shape id="Image_x0020_12"
 o:spid="_x0000_i1030" type="#_x0000_t75" alt="Une image contenant texte&#10;&#10;Description générée automatiquement"
 style='width:380.5pt;height:319.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image033.png"
  o:title="Une image contenant texte&#10;&#10;Description générée automatiquement"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Une image contenant texte

Description générée automatiquement](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image034.jpg)<!--\[endif]-->\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

\
The complete list of response codes is documented for each resource in the API reference table shown below:

\
**<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_121" o:spid="_x0000_i1029" type="#_x0000_t75" alt="Background pattern&#10;&#10;Description automatically generated"
 style='width:394.5pt;height:132.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image013.png"
  o:title="Background pattern&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Background pattern

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image035.jpg)<!--\[endif]-->**\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

The API supports several query parameters depending on the resource type, such as filter, limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection).\
\
Filters provide the ability to limit the resources that take part in the action of a REST call. When a REST call includes a filter, the GET or DELETE action is restricted to a response that meets the filter requirements. Filters are specified by using the query parameter 'filter'.\
\
A simple example of filtering follows:\
\
**GET <URI>?filter=powerState eq 'Off'**This example shows a simple filter. The resources returned by the query are limited to results with the attribute **powerState** and the value **Off**.\
\
To use a filter on a nested property name, the '**/**' separator can be specified as follows:\
\
**GET /compute-ops/v1beta2/servers?filter=hardware/model eq 'ProLiant DL365 Gen10 Plus'****\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->**

To test this filter[, enter](<>) <!--\[if !supportAnnotations]-->[\[RD24]](#_msocom_24)<!--\[endif]--> the following URL in the Request field:\
\
**<https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?filter=contains(hardware/model,'DL365')>**

\
<!--\[if gte vml 1]><v:shape
 id="Image_x0020_5" o:spid="_x0000_i1028" type="#_x0000_t75" style='width:407.5pt;
 height:125.5pt;visibility:visible;mso-wrap-style:square' o:bordertopcolor="yellow pure"
 o:borderleftcolor="yellow pure" o:borderbottomcolor="yellow pure"
 o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image036.png"
  o:title=""/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image037.jpg)<!--\[endif]-->

The Authorization tab should still have your Access Token (an access token is valid for 2 hours).

 

Hit the **Send** button.\
The request should indicate success (Status is 200 OK) and, in this example, the response shows 4 server resources whose model name contains DL36[5.](<>)<!--\[if !supportAnnotations]-->[\[RD25]](#_msocom_25)<!--\[endif]--> 

\
<!--\[if gte vml 1]><v:shape id="Image_x0020_7" o:spid="_x0000_i1027"
 type="#_x0000_t75" alt="Une image contenant texte&#10;&#10;Description générée automatiquement"
 style='width:267pt;height:204pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image038.png"
  o:title="Une image contenant texte&#10;&#10;Description générée automatiquement"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Une image contenant texte

Description générée automatiquement](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image039.jpg)<!--\[endif]-->

 

The filter query syntax supports a richer set of filters than the single operation in the previous example. Filtering syntax is broken down by Operations, Logic, and Types. In the previous example[,](<>)<!--\[if !supportAnnotations]-->[\[RD26]](#_msocom_26)<!--\[endif]-->  the operation was 'eq' for equality. Most comparison operations require the evaluated property name to the left of the operato[r](<>)<!--\[if !supportAnnotations]-->[\[RD27]](#_msocom_27)<!--\[endif]--> and a literal to the right.\
\
<!--\[if gte vml 1]><v:shape id="Picture_x0020_116"
 o:spid="_x0000_i1026" type="#_x0000_t75" alt="Table&#10;&#10;Description automatically generated"
 style='width:309.5pt;height:132.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image019.png"
  o:title="Table&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![Table

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image040.jpg)<!--\[endif]-->\
\
To learn more about Filtering, see the [HPE GreenLake for Compute Ops Management guide](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/guide/#filtering).\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

Unique Resource Identifiers (URIs) are used to identify a resource. A URI is a full API path ending in an identification number. For example:\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

<!--\[if !supportLists]-->·       <!--\[endif]-->/compute-ops/v1beta2/servers/{serverId}

<!--\[if !supportLists]-->·       <!--\[endif]-->/compute-ops/v1beta1/reports/{id}/data

 

**v1beta1**, **v1beta2** in the URI is the version of the resource that is being accessed.\
<!--\[if !supportLineBreakNewLine]-->\
<!--\[endif]-->

You can invoke the common HTTP [methods](<>)<!--\[if !supportAnnotations]-->[\[RD28]](#_msocom_28)<!--\[endif]--> , like GET, POST, PUT, PATCH, and DELETE[,](<>) <!--\[if !supportAnnotations]-->[\[RD29]](#_msocom_29)<!--\[endif]--> on resources in the HPE GreenLake for Compute Ops Management API as shown below for the **filters** resource:

 

<!--\[if gte vml 1]><v:shape
 id="Picture_x0020_119" o:spid="_x0000_i1025" type="#_x0000_t75" alt="A screenshot of a computer&#10;&#10;Description automatically generated"
 style='width:468pt;height:169.5pt;visibility:visible;mso-wrap-style:square'
 o:bordertopcolor="yellow pure" o:borderleftcolor="yellow pure"
 o:borderbottomcolor="yellow pure" o:borderrightcolor="yellow pure">
 <v:imagedata src="file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image023.png"
  o:title="A screenshot of a computer&#10;&#10;Description automatically generated"/>
 <w:bordertop type="single" width="12"/>
 <w:borderleft type="single" width="12"/>
 <w:borderbottom type="single" width="12"/>
 <w:borderright type="single" width="12"/>
</v:shape><!\[endif]--><!--\[if !vml]-->![A screenshot of a computer

Description automatically generated](file:///C:\Users\passeron\AppData\Local\Temp\msohtmlclip1\01\clip_image041.jpg)<!--\[endif]-->

 

Refer to the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) site for a complete list of methods supported by each API resource.

 

 

# What’s next?

 

In this blog post, we covered how to get started with the HPE GreenLake for Compute Ops Management REST API, explained how to post simple API calls through cURL commands, and showed you how to leverage Postman to achieve the same results.  In our next article, we will show how similar calls can be performed using Python or PowerShell.

 

[Learn more about HPE GreenLake](<>)

Learn more about the HPE GreenLake for Compute Ops Management REST API

Find other tutorials and articles on HPE GreenLake on the HPE Developer blog.<!--\[if !supportAnnotations]-->[\[RD30]](#_msocom_30)<!--\[endif]--> 

<!--\[if !supportAnnotations]-->

- - -

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD1]](#_msoanchor_1)<!--\[endif]-->This “is” the official title, correct? While it may mean Operations, I believe the product name is specifically Ops.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD2]](#_msoanchor_2)<!--\[endif]-->Remove period after “update”

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD3]](#_msoanchor_3)<!--\[endif]-->Should this be written as cURL, curl, Curl, or CURL? I’ve seen it just about every different way on the internet.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD4]](#_msoanchor_4)<!--\[endif]-->Do you really mean “method”? Would “call” work better? Or “request”? or “command”?

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[PF(D(x5]](#_msoanchor_5)<!--\[endif]-->method

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD6]](#_msoanchor_6)<!--\[endif]-->Okay… if you are going to use it this way, we should be consistent throughout the blog post.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[PF(D(x7]](#_msoanchor_7)<!--\[endif]-->Agree

 

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD8]](#_msoanchor_8)<!--\[endif]-->Is this really one word? Or should it be “an open API”? Just wondering…

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[PF(D(x9]](#_msoanchor_9)<!--\[endif]-->One Word

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD10]](#_msoanchor_10)<!--\[endif]-->URIs or URLs?

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[PF(D(x11]](#_msoanchor_11)<!--\[endif]-->URIS

 

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD12]](#_msoanchor_12)<!--\[endif]-->In the API reference or “in the API reference documentation”? It just sounds a little weird, so I was wondering what you meant.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[PF(D(x13]](#_msoanchor_13)<!--\[endif]-->Doc / guide

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD14]](#_msoanchor_14)<!--\[endif]-->Don’t talk about it from the perspective of what you personally are doing. Think of it more in terms of you guiding them to do something. This helps to make it more personal and engaging with the reader.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD15]](#_msoanchor_15)<!--\[endif]-->Add a comma

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD16]](#_msoanchor_16)<!--\[endif]-->No comma required here

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD17]](#_msoanchor_17)<!--\[endif]-->Aha! You DID mean URIs earlier. It’s best to fully write it out the first time you want to use it and then use the abbreviation after that. So, for that earlier instance, could you please write it like you did here? And, you don’t actually have to use the abbreviation each time… you could leave this here as is. You just need to make sure that you’ve also done it earlier, in the first instance where you’ve used it.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD18]](#_msoanchor_18)<!--\[endif]-->Again, “methods” doesn’t feel like the right word. It seems like “commands” would work better or “calls”.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD19]](#_msoanchor_19)<!--\[endif]-->Also, don’t forget to place commas around “like GET, POST, PUT, PATCH, and DELETE”

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD20]](#_msoanchor_20)<!--\[endif]-->“calls” or “commands”?

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[PF(D(x21]](#_msoanchor_21)<!--\[endif]-->Method is fine

 

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD22]](#_msoanchor_22)<!--\[endif]-->I’m not suggesting you hotlink these URLs here because I get the impression the reader needs to see pieces of the complete URL. But if that’s not the case, you can consider writing it so that it would take a hot-linked URL.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD23]](#_msoanchor_23)<!--\[endif]-->Again, take the “I” out of the equation and talk directly to the reader.

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD24]](#_msoanchor_24)<!--\[endif]-->Remove “I”

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD25]](#_msoanchor_25)<!--\[endif]-->Don’t forget the period

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD26]](#_msoanchor_26)<!--\[endif]-->comma

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD27]](#_msoanchor_27)<!--\[endif]-->no comma required here

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD28]](#_msoanchor_28)<!--\[endif]-->“calls” or “commands”?

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD29]](#_msoanchor_29)<!--\[endif]-->Commas should be on either side of “like GET, POST, PUT, PATCH, and DELETE”

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--\[if !supportAnnotations]-->

[](<>)

<!--\[endif]-->

 <!--\[if !supportAnnotations]-->[\[RD30]](#_msoanchor_30)<!--\[endif]-->Don’t forget the appropriate hotlinks

<!--\[if !supportAnnotations]-->

<!--\[endif]-->

<!--EndFragment-->