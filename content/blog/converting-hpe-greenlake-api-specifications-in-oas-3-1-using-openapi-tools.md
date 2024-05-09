---
title: Converting HPE GreenLake API specifications in OAS 3.1 using OpenAPI tools
date: 2024-05-09T12:05:06.187Z
author: Ron Dharma
authorimage: /img/face-portraitlarge.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
tags:
  - hpe-greenlake
  - api
  - data-services-cloud-console
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

## What is HPE GreenLake APIs for data services?

The HPE GreenLake APIs are the family of the set of APIs to enable client users to perform manipulation of the REST API resources that are available as part of data services on HPE GreenLake. The data services on HPE GreenLake can be discovered under the Services’ [catalogue](https://common.cloud.hpe.com/services/service-catalog) that is named as the Storage as shown in below figure. Additionally, there is also HPE GreenLake Private Cloud  Business Edition service under the Services’ catalogue named as Private Cloud as shown in figure below.

![List of data services in the HPE GreenLake's Service-Catalog](/img/data-services-for-hpe-greenlake-list.png)

*The above figure shows the list of HPE GreenLake services part of the data services on HPE GreenLake family (snippets of the HPE GreenLake Service-catalogues)*

As of this publication of this blog post (May 2024), these are the list of those data services:

1. HPE DataOps Manager
2. HPE Block Storage service
3. HPE GreenLake for File Storage
4. HPE GreenLake for Storage Fabric Management
5. HPE GreenLake for Backup and Recovery
6. HPE GreenLake for Disaster Recovery
7. HPE GreenLake Private Cloud Business Edition

The REST APIs to support the services listed above, are documented in [this](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00003533en_us&page=ps_api_dscc.html) HPE GreenLake documentation for REST API as shown in figure below.

![Menu that lists the GL OpenAPI documentation location](/img/openapi-top-documentation-available-at-hpe-support.png)

*The above figure shows the API documentation and the links to each set of HPE GreenLake APIs family for data services on HPE GreenLake.*

From the documentation above, you can recognize that all these services APIs were provided as OpenAPI specification files in either JSON or YAML format. Furthermore, you also notice that a single set of the HPE GreenLake API called Data Services Cloud Console is based on the OpenAPI Standard 3.0; however, the rest of the HPE GreenLake API set are based on the OpenAPI Standard 3.1. 

These APIs’ resources as of this blog post are ongoing development cycle where each of the existing APIs will be updated, deprecated, or new resources will be introduced. The information about the versioning for the APIs based on the OpenAPI Standard 3.1 is available at this [link](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/). For more information on the family of HPE GreenLake APIs, please see the following blog posts in HPE Developer forum: [Data Services Cloud Console](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api), [Data Services](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/), [Virtualization](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-virtualization/), and [Backup and Recovery.](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-backup-and-recovery/)

## First tool of the day: a converter from OpenAPI Standard 3.1 to the OpenAPI Standard 3.0

The OpenAPI initiative provides a framework to describe any APIs so that these APIs can be consumed by different organizations for documentation, client side, server-side mocks, and many other opportunities. This framework has evolved from standard version 3.0 to version 3.1 with all the benefits as described in this [video](https://www.youtube.com/live/Sflpzh_cAcA?si=zkAKqGNYQz-5C6oe).  As described in this blog post, the top advantages of using the OpenAPI is to provide a way for a community to widely adopt the HPE GreenLake API by efficiently creating client libraries while in same time as the updates to HPE GreenLake API specs are happening. 

To accommodate the conversion, there are a couple of blog posts that have been created to explain the process for conversion of any HPE GreenLake spec file to [Python](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/) client library and conversion from any HPE GreenLake spec file to [PowerShell ](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-powershell-sdk/)client library. However, the challenge is that the open source [tool](https://openapi-generator.tech/) that is used to generate this client library can only facilitate the OpenAPI Standard version 3.0 spec file as the input; however, majority of the HPE GreenLake API sets that are written using the OpenAPI Standard version 3.1.

In this blog post, let me introduce a tool to convert the spec file in OpenAPI standard 3.1 to a spec file in OpenAPI standard 3.0 to enable conversion using the [openapi-generator-cli.](https://www.npmjs.com/package/@openapitools/openapi-generator-cli)  Let me introduce you to this open source tool named **apiture/openapi-down-convert** by David Biesack and Mike Ralphson which is documented in this GitHub [site](https://github.com/apiture/openapi-down-convert) and shown in figure below.

![openapi-down-convert Github website](/img/github-to-openapi-down-convert.png)

*The above figure shows the Github website for the documentation of the openapi-down-convert.*

To install this tool, you can follow the instructions at the Github [README](https://github.com/apiture/openapi-down-convert) using the JavaScript package manager called the **npm**.

I found that a lot of tools, that we are going to be using as part of this blog post, are easier to use if we are using the npm (JavaScript) software deployment method. Below are the steps that I recommend so that you can deploy the npm for JavaScript package management into a Microsoft Windows desktop environment so that you can deploy the openapi-down-convert tool.

1. I made sure that my Microsoft Windows desktop had access to the internet and can connect to the websites that I provided in below steps. In some cases, you may need to define the internet proxy so that you can connect to these websites.
2. First, I deployed the Java SDK library into my Microsoft Windows desktop. My recommendation is to deploy the Microsoft Build version of the OpenJDK that is available in the Microsoft [website](https://learn.microsoft.com/en-us/java/openjdk/download) using the instruction provided from the website.  By the way, prior to deploying this OpenJDK, I removed any older version of the Java SDK or JRE from my Microsoft Windows environment so I could ensure the correct Java version used for all the steps below.
3. Afterward, I set the `JAVA_HOME` system variable to `C:\Program Files\Eclipse Adoptium\jdk-21.0.1.12-hotspot` using the following instruction. This step ensured that any applications which require Java would use the OpenJDK by default. 
4. Following the step above, I deployed the NodeJS package into my Microsoft Windows environment downloaded from the nodejs.org website. I also ensured that I included the **npm package manager** option as shown in one of the steps from the NodeJS installation wizard as shown in figure below.

![The wizard section to deploy npm package manager](/img/nodejs-deployment-ensure-npm-is-available.png)

5. Once the deployment of NodeJS completed, I was able to issue the npm CLI to perform the installation of the `openapi-down-convert` in the Microsoft Windows command line interface shown below.

```shell
C:\>npm I -g @apiture/openapi-down-convert
added 5 packages in 4s
npm notice
npm notice New minor version of npm available! 10.5.0 -> 10.7.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.7.0
npm notice Run npm install -g npm@10.7.0 to update!
npm notice
C:\>
```

6. After the above steps, I had the tool to convert any HPE GreenLake API spec files from OpenAPI Standard 3.1 to OpenAPI Standard 3.0.

## Second tool of the day: deploying the openapi-generator-cli using the npm JavaScript

This time, I also wanted to introduce a version of the openapi-generator that can be executed just like any other command line interface, [@openapitools/openapi-generator-cli](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) shared by the OpenAPI Initiative team. Because we have already deployed the npm package deployment tool as I have shared above, I can then proceed to deploy this tool very quickly. Below are the steps that I took to deploy openapi-generator-cli:

1. I opened a Microsoft Windows command line interface and issued the following npm CLI command:

```shell
C:\Users\Administrator>npm install -g @openapitools/openapi-generator-cli

added 116 packages in 36s

23 packages are looking for funding
  run `npm fund` for details

C:\Users\Administrator>
```

2. Afterward, I tested the deployed openapi-generator-cli to validate the version of the generator that was used. I believed that it was automatically defaulted to the latest published version which was 7.5.0 as shown below:

```shell
   C:>openapi-generator-cli
   Download 7.5.0 ...
   Downloaded 7.5.0
   Did set selected version to 7.5.0
   Usage: openapi-generator-cli <command> [<args>]

Options:
  --openapitools <openapitools.json>  Use the specified openapi-generator-cli configuration file
  --custom-generator <generator>      Custom generator jar

Commands:
  version-manager                     Manage used / installed generator version
  author                              Utilities for authoring generators or customizing templates.
  batch                               Generate code in batch via external configs.
  config-help                         Config help for chosen lang
  generate \[options]                  Generate code with the specified generator.
  help                                Display help information about openapi-generator
  list                                Lists the available generators
  meta                                MetaGenerator. Generator for creating a new template set and configuration for
                                      Codegen.  The output will be based on the language you specify, and includes
                                      default templates to include.
  validate                            Validate specification
  version                             Show version information used in tooling

  C:>
```

3. After the above steps, I had the tool to convert any HPE GreenLake APIs in OpenAPI Standard 3.0 to a client libraries for any popular scripting or programming languages as listed in the [website](https://openapi-generator.tech/docs/generators).

## But wait! What about converting those OpenAPI Standard 3.1 spec files to a client library?

Nope, I am not going to leave you guys stranded. 😊 

Now, we have the required tools to create the pipeline for the conversion from the OpenAPI Standard 3.1 spec files to the client library for my choice of scripting languages. The process will be in a sequence from downloading the OpenAPI spec file from the HPE GreenLake developer website, convert that spec file to OpenAPI Standard 3.0 spec file, and then convert that 3.0 spec file to the client library. Let me give you an example for converting the HPE GreenLake API for Data Services file spec to a PowerShell client library.

1. I downloaded the HPE GreenLake API for Data Services OpenAPI Standard 3.1 spec file from the HPE GreenLake Developer website using the UI shown below:

![Download OpenAPI 3.1 JSON spec file from HP GL Data Services](/img/download-the-openapi-3.1-spec-data-services-from-developer-website.png)

1. Afterward, I changed the name of the downloaded file from `swagger.json` to `GL-dataservices-31.json` so that I could recognize this OpenAPI Standard 3.1 spec file from HPE GreenLake APIs for Data Services. Eventually, I followed by using the `openapi-down-convert` tool to convert the OpenAPI Standard 3.1 to OpenAPI Standard 3.0 using the following command shown below.

```shell
   PS C:\Users\Administrator\Downloads> move .\swagger.json ..\Scripting\GL-dataservices-31.json
   PS C:\Users\Administrator\Downloads> cd ..\Scripting\
   PS C:\Users\Administrator\Scripting> dir
Mode                LastWriteTime         Length Name

- - -

\-a----         5/2/2024   2:46 PM         171264 GL-dataservices-31.json

PS C:\Users\Administrator\Scripting> openapi-down-convert -i .\GL-dataservices-31.json -o .\GL-dataservices-30.json
PS C:\Users\Administrator\Scripting>
```

3. Now it’s the time to convert this OpenAPI Standard 3.0 spec file to the PowerShell client library using the \`openapi-generator tool\`. Additionally, I also changed the name of the generated package from standard naming \`OpenAPITools\` to specific \`name GLdataservices\` using the special arguments such as shown below.

```shell
   PS C:\Users\Administrator\Scripting> openapi-generator-cli generate -g powershell --additional-properties="packageName"="GLdataservices" -i .\GL-dataservices-30.json -o Posh-GL-dataservices
```

4. As the result from this conversation, I found a new folder named `Posh-GL-dataservices` with some files inside this folder as shown below. It looks like that I have a mark-down file called `README.md`. I would now use my favorite development editor Microsoft Visual Studio Code to investigate this generated PowerShell module. The information on how to install Microsoft Visual Studio Code is available at the Visual Studio Code [website](https://code.visualstudio.com/).

```shell
   PS C:\Users\Administrator\Scripting> cd .\Posh-GL-dataservices\
   PS C:\Users\Administrator\Scripting\Posh-GL-dataservices> dir
```

```
Mode                LastWriteTime         Length Name

- - -

d-----         5/2/2024   5:00 PM                .openapi-generator
d-----         5/2/2024   5:00 PM                docs
d-----         5/2/2024   5:40 PM                src
d-----         5/2/2024   5:00 PM                tests
-a----         5/2/2024   5:00 PM           1040 .openapi-generator-ignore
-a----         5/2/2024   5:40 PM           1224 appveyor.yml
-a----         5/2/2024   5:40 PM           2100 Build.ps1
-a----         5/2/2024   5:40 PM          12794 README.md

PS C:\Users\Administrator\Scripting\Posh-GL-dataservices>
```

5. Using the Microsoft Visual Studio Code, I opened the folder where the modules were located, and I could see the list of the files that were generated by the openapi-generator.  The first file that I opened is the README.md and using the combination key of `CTRL + Left Shift + v`, I was able to convert the README.md into the clear readable format. That was a great step because I found out the instructions on installation, uninstallation, and detail information on how to use this PowerShell module.

![HPE GL Data Services POSH README.md](/img/hpe-gl-dataservices-posh-readme-md.png)

> I could then click on the link on the README.md to display the information on how to use the API such as the `Invoke-ListAsyncOperations` shown below:

![HPE GL Data Services list async operations](/img/hp-gl-data-services-help-for-async-events-list.png)

6. To exercise this PowerShell module, I followed the instructions to install module into a PowerShell workstation as described in the \`README.md\` file.

```shell
To install from the source, run the following command to build and install the PowerShell module locally:
C:> Build.ps1
C:> Import-Module -Name '.\src\GLdataservices' -Verbose
```

7. Once this module was loaded, I was able to create a short script based on PowerShell to exercise an API called `Invoke-ListAsyncOperations` and to use that API to display a list of the tasks that was completed. 

```shell
$fileName = "..\myCredential-rrd1.json"
$secretFile = Get-Content -Path $fileName | ConvertFrom-Json

# general setting of the PowerShell module, e.g. base URL, authentication, etc
$Configuration = Get-Configuration
$Configuration.BaseUrl = "https://us1.data.cloud.hpe.com"
$Configuration.Username = $secretFile | select-object -ExpandProperty myId
$Configuration.Password = $secretFile | select-object -ExpandProperty mySecret
$token_url = "https://sso.common.cloud.hpe.com/as/token.oauth2"
$AuthenticationResult = Invoke-WebRequest $token_url -Method Post -Body @{
    grant_type = "client_credentials"
    client_id = $Configuration.Username
    client_secret = $Configuration.Password
}
$Configuration.AccessToken = $AuthenticationResult.Content | ConvertFrom-Json | select-object -ExpandProperty access_token

# general setting of the PowerShell module, e.g. base URL, authentication, etc
$Filter = "'backup-and-recovery' in services" # String | The UUID of the object
$Select = 'associatedResources,services,displayName,logMessages' # String | A list of properties to include in the response. (optional)

# Returns details of a specific async-operation
try {
    $Result = Invoke-ListAsyncOperations -Offset 0 -Limit 10 -Filter $Filter -Select $Select
} catch {
    Write-Host ("Exception occurred when calling Invoke-ListAsyncOperations: {0}" -f ($_.ErrorDetails | ConvertFrom-Json))
    Write-Host ("Response headers: {0}" -f ($_.Exception.Response.Headers | ConvertTo-Json))
}
$Result.items | ConvertTo-Json
```

> **Note** that the above script was reading my client-credentials file so that I could gain authorization to my HPE GreenLake workspace. This file called \`myCredentials-rrd1.json\` which contains the JSON structure shown below. For more information on providing this client-credentials information please see the HPE GreenLake Developer website. There is also a blog post in HPE Developer Forum website that discuss the process as well.

```JSON
{
  "myWorkspace": "xxxxxxxxxx-yyyy-yyyy-yyyy-zzzzzzzzzzzz", 
  "myId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", 
  "mySecret": "06cffff699deeeee9f1d92f7gggggggg"
}
```

> As expected, the execution of the above script completed successfully, and the API response returned the list of tasks based on the filtering and selection of the properties from the example above.  These were task lists from my workspace that were created by the backup-and-recovery services in my workspace.

```JSON
[
  {
    "associatedResources": [],
    "services": [
      "backup-and-recovery"
    ],
    "displayName": "Create_individual_file_backup",
    "logMessages": [
      "@{message=Performing incremental copy.; timestamp=04/27/2024 09:01:22}",
      "@{message=Resources acquired, volume copy preparation done.; timestamp=04/27/2024 09:01:23}",
      "@{message=Submitted all copy jobs to data mover.; timestamp=04/27/2024 09:02:31}",
      "@{message=Initiated Vmdk copy operation.; timestamp=04/27/2024 09:02:33}",
      "@{message=Failed with retryable error code: -3403. Retrying after 1 minutes.; timestamp=04/27/2024 09:07:17}",
      "@{message=Performing optimized copy since Invalid parent backup: Parent backup with id 61c86d49-2b7c-4e0a-9619-dc9bda08586d is in Reading state.; timestamp=04/27/2024 09:08:18}",
      "@{message=Resetting retries as data movement successfully progressed after previous failure.; timestamp=04/27/2024 09:21:55}",
      "@{message=Failed with retryable error code: -3403. Retrying after 15 minutes.; timestamp=04/27/2024 09:30:26}",
      "@{message=Allocation map collection took 0.002743 seconds with 1 threads.; timestamp=04/27/2024 10:58:21}",
      "@{message=Successfully completed copy operation; timestamp=04/27/2024 10:58:22}",
      "@{message=Backup operation completed.; timestamp=04/27/2024 10:58:23}"
    ]
  },
  {
    "associatedResources": [
      "@{name=0-VM-01-VVOL-DS; resourceUri=/hybrid-cloud/v1beta1/virtual-machines/1d1438c2-3ae2-52e0-b5a1-fa643903f526; type=hybrid-cloud/virtual-machine}"
    ],
    "services": [
      "backup-and-recovery"
    ],
    "displayName": "Delete backup [0-VM-01-VVOL-DS - 13/04/2024 03:48:59]",
    "logMessages": [
      "@{message=Job execution started.; timestamp=04/16/2024 08:03:26}",
      "@{message=Deleting local backup.; timestamp=04/16/2024 08:03:28}",
      "@{message=Deleting backup successful.; timestamp=04/16/2024 08:03:30}",
      "@{message=Job execution completed.; timestamp=04/16/2024 08:03:31}"
    ]
  },
  {
    "associatedResources": [],
    "services": [
      "backup-and-recovery"
    ],
    "displayName": "Delete MSSQL snapshot [Array_Snapshot_2024-04-27-21:35:19-K1cqhLAg - 2024-04-28T01:36:25.000Z]",
    "logMessages": [
      "@{message=Updating snapshot state; timestamp=04/30/2024 02:01:05}",
      "@{message=Deleting volume(s) snapshot.; timestamp=04/30/2024 02:01:06}",
      "@{message=Deleting snapshot; timestamp=04/30/2024 02:01:18}",
      "@{message=Job execution completed.; timestamp=04/30/2024 02:01:18}"
    ]
  },
```

## Conclusion

With the introduction of new HPE GreenLake APIs on March 2024, HPE GreenLake APIs embraces OpenAPI Standard 3.1 for the specification files. Those HPE GreenLake APIs spec file for the API set such as Data Services, Virtualization, Backup and Recovery, and Private Cloud Business Edition were released based on OpenAPI Standard 3.1. 

This blog post introduces the tools to enable any adopter to use the open-source software openapi-generator to convert these spec files after the conversion from the OpenAPI Standard 3.1 to OpenAPI Standard 3.0. In this blog post, I provided an example on how to convert the HPE GreenLake API for Data Services into a PowerShell client library. Furthermore, I also provided an example on how to use this client library to display the list of the tasks from HPE GreenLake for Backup and Recovery from my workspace.


Please don’t hesitate to explore this new set of APIs for Cloud Data Services on HPE GreenLake and see how you can improve your agility in managing your data. Any questions on HPE GreenLake Data Services Cloud Console API? Please join the HPE Developer Community Slack [Workspace](https://developer.hpe.com/slack-signup/), and start a discussion in our [\#hpe-greenlake-data-services](https://hpedev.slack.com/archives/C02D6H623JP) Slack channel.