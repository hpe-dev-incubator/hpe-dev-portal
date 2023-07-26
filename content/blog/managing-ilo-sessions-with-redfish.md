---
title: Managing iLO sessions with Redfish®
date: 2018-08-27T13:44:46.463Z
featuredBlog: false
priority: null
author: François Donzé
authorimage: https://gravatar.com/avatar/6f3982d1461459da475f47e3a6c89d1d?s=192
thumbnailimage: null
tags:
  - ilo-restful-api
  - Redfish
  - iLO5
  - iLOsessionmanagement
---
Updated: July 26, 2023

## Introduction

HPE Integrated Lights-Out (iLO) accepts a limited number of HTTP sessions. Reaching the maximum number of sessions can lead to embarrassing situations where server management operations are impossible until active connections are automatically disconnected after the pre-defined timeout or a manual / physical [iLO reset](https://support.hpe.com/hpsc/doc/public/display?docId=a00048134en_us) is performed.

As a companion document to a [Customer Advisory](https://support.hpe.com/hpsc/doc/public/display?docId=emr_na-a00041654en_us&docLocale=en_US) notification published earlier this year, we'd like to explain the typical contexts generating this problem as well as best practices to prevent it using the [Redfish](http://www.dmtf.org/redfish) RESTful API.

For reaching this goal, we need first to explain the two common management techniques as well as the session management object in Redfish.

## Out-of-band versus In-band management

Out-of-band (OOB) management consists of starting a management application on a system different from the managed server. Using the IP address of the managed server (or its iLO) and privileged credentials, the remote application is able to connect and perform management tasks. Server management and deployment using [Ansible](https://www.ansible.com/) scripts is a typical use case of OOB.

With the in-band management technique, you start the management application in the operating system of the managed server. The application reaches the iLO through an internal path in the server (i.e. PCIe bus). This method suits perfectly in [Chef](https://www.chef.io/) or [Puppet](https://puppet.com/) management infrastructures.

## Redfish session management basics

Session management using the Redfish RESTful API is performed with the `/redfish/v1/SessionService` Redfish object. When this service is enabled, iLO active sessions are listed below the `Sessions` sub-tree of the service. Each and every iLO successful login creates an entry at this URI.

## OOB management with basic authentication

In the following screenshot we use the popular `curl` tool and its [Basic Authentication](https://servermanagementportal.ext.hpe.com/docs/concepts/redfishauthentication/#basic-authentication) mechanism (`--user user:password`) to login and retrieve the active iLO session list. For clarity reasons, we use as well the `--silent` and `--insecure` options. However, they don't interact with our demonstration.

Each invocation of the script returns a list composed of a single but different iLO session. This is due to the Basic Authentication mechanism which deletes automatically the session after completion of the HTTP GET request.

![Get session members with curl](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/1-GetSessionMembersWithCurl.png)

As a conclusion, the basic authentication mechanism, no matter the used tool, has the advantage of self-cleaning the session list. Said differently, the risk of reaching the maximum number of iLO sessions with this technique is very low. However, basic authentication does not suite all the needs of server management.

## OOB management with OAuth 2.0 authentication

For more complex operations, a better way to connect to a Redfish server is to use the OAuth 2.0 mechanism to [create a session object](https://servermanagementportal.ext.hpe.com/docs/concepts/redfishauthentication/#session-authentication) in the Redfish session manager. A successful Redfish session creation is synonym of the creation of an iLO session. In return the Redfish server sends a unique session token and associated session location to the Redfish client. Subsequent HTTP operations will be authorized using the session token.

The [HPE `ilorest` interface tool](http://www.hpe.com/info/resttool) uses this token session mechanism and stores the token somewhere in the file system of the Redfish client. The following script illustrates the different behavior in terms of session management between the OAuth 2.0 protocol and the Basic Authentication processes.

The script starts with a login command and then retrieves twice the session list. It appears that both lists contains one identical record. This is the proof that both `ilorest` calls used the same token to authenticate.

![Get session members with `ilorest`](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/2-GetSessionMembersWithIlorest.png)

## Reaching the iLO maximum number of connections with OOB scripts

The last command of the previous script is an `ilorest logout` operation. Among other things explained further, `ilorest logout` asks the Redfish server to disconnect its iLO session and to delete the corresponding Redfish record in the Redfish session manager.

What happens if we omit this last `logout` command in a script using the Token authentication method?

In that case, the opened session will stay active in the iLO and in Redfish. During the next invocation of the script, `ilorest login` will ask again for a session creation and will overwrite the token generated during the first invocation with the new one and then perform the requested GET operations with this new token. As a result, the previous session is still active in the iLO and present in the Redfish web server although not used  by anybody anymore!

In the following screenshot, we removed the `logout` command and launched the script twice. The second invocation shows two active sessions. A third invocation would have shown three active sessions...

![Two iLOrest logins with no logout in between](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/3-IlorestNoLogout.png)

At some point of time, if you call again and again such a badly written script, you will reach the iLO maximum number of sessions and get completely locked out until the iLO is physically reset or until sessions are removed when the [`UserExpires`](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_145/ilo6_other_resourcedefns145/#oemhpeuserexpires) time is reached.

## iLO session life cycle management with Redfish

So far, we have studied OOB Redfish session management with tools like `curl` and `ilorest`. Writing your own management application, requires the knowledge of other details in the Redfish API.

In this paragraph we explain and illustrate iLO session creation, use and deletion using the [Postman API development environment](https://www.getpostman.com/). The ultimate goal is to provide the necessary knowledge to avoid reaching the maximum number of iLO sessions in an homemade Redfish script or application.

### Session Creation

To a create an iLO session via Redfish, you have to HTTP POST a new record in the `{{iloURI}}/redfish/v1/SessionService/Sessions/` URI. `{{iloURI}}` represents a Postman variable containing something similar to: `https://ilo-IP`. The headers of this POST request must contain at least the `OData-Version` and `Content-Type` headers:

![Session creation headers](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/4-CreateSessionHeaders.png)

The payload/body of this POST request must contain valid and privileged iLO username and password:

![Session creation body](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/5-CreateSessionBody.png)

Upon successful creation, the `201 Created` return code is received with the `Location` and `X-Auth-Token` keys in the response headers:

![Session creation header response](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/6-CreateSessionResponseHeaders.png)

If you want Postman to automatically store the session location as well as the associated token in specific variables, you can populate the `Tests` tab with the following javascript code:

![Postman test script to store Token and Location headers](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/7-PostmanTestScriptToStoreTokenAndSessionLocation.png)

### Using session information

Subsequent requests to the Redfish server must contain the `X-Auth-Token` header with the received token value, in addition to the `OData-Version` and `Content-Type` headers.

![`X-Auth-Token` header](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/8-GetSessionHeaders.png)

The following GET request retrieves the list of the sessions in a remote iLO using the token obtained during the previous POST request.

![List of sessions](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/9-GetSessionResponseBody.png)

If we analyse the details of the sessions part of this list, we notice the `AccessTime` and `UserExpire` properties (next picture). If this session is idle until the `UserExpire` timestamp, the session will automatically expire and the token will not be valid anymore.

![Session details](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/10-GetSessionDetails.png)

### Session deletion

To avoid any risk of session saturation, it is wise to delete active sessions at the end of the management programs. This operation is performed with an HTTP DELETE operation toward the `{{SessionLocation}}` received in the headers of the previous POST request.

Upon successful deletion, you receive a `200 Ok` return code as well as a success `MessageId` in the response body:

![Session deletion](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/11-DeleteSession.png)

## In-band management with `ilorest`

It is now time to switch from out-of-band to in-band management. As said previously, in-band management uses an internal path between the Redfish client sitting in the operating system and the Redfish server in the iLO. HPE embeds the Channel Interface (CHIF) driver in every software requiring this communication path: `ilorest`, `iSUT`, the `Agentless Management Service`...

In this paragraph we analyze the behavior of `ilorest` when included in a WinPE or LinuxPE .ISO file (as explained in a previous [article](/blog/in-band-management-with-ilorest-and-a-livecd)), or in any other general purpose operating system.

The first command of the following screenshot asks for the list of the storage controllers in the underlying server. Before displaying this list, `ilorest` automatically initiates a `login` command into the local iLO through the CHIF driver to create an iLO session. Then, it retrieves the entire Redfish tree and caches it in `/root/.iLOrest/cache` in Linux and `%USERPROFILE%\AppData\Roaming\.iLOrest` in Windows. Finally it displays the requested list.

The second `ilorest` command asks again for the list of storage controllers and the answer comes instantaneously from the cached Redfish tree. Finally, the `logout` command deletes the cached info and removes the iLO session.

![Regular `ilorest` session](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/12-RegularIlorest.png)

In some cases, (i.e. read-only operating system) you may want to specify the `--nocache` attribute telling `ilorest` to use the system memory instead of a file system for caching the session and data information.

To illustrate this case, we launch `ilorest --nocache` three times in a row to get the list of smart storage controllers. We notice that `ilorest` performs a login operation in each of the three invocation. The last `ilorest` command  retrieves the list of the active sessions made of four sessions: three for the GET operations and one for the `rawget`.

![In-band `ilorest --nocache`](https://redfish-lab.sourceforge.io/media/redfish-wiki/Managing-iLO-Sessions-With-Redfish/13-IlorestInBand--nocache.png)

Each time `ilorest` is invoked with the `--nocache` attribute, it caches session and data information in memory. When it exits, this memory area is released and becomes unreachable. However, the session is still active in Redfish and in the iLO.

Future invocations of `ilorest --nocache` will have to login again and thus, create another iLO session, which will not be removed when `ilorest` exits. In our case, the four invocations of `ilorest --nocache` resulted in four iLO sessions that will stay active until a manual delete, session expiration or an iLO reset.

### In-band session deletion

The previous example shows clearly a high risk of session saturation when using `ilorest --nocache`. To avoid this saturation you should include in your `ilorest` scripts, a formal deletion of one or several sessions before being locked out.

In an in-band management context, this can be done with `ilorest rawdelete`. You can adapt the following pseudo code and insert it in different places of your in-band scripts:

~~~
SessionList <-- ilorest rawget "/redfish/v1/SessionService/Sessions"

for Session in SessionList ; do
    ilorest rawdelete Session
done
~~~

## Conclusion

Generally speaking, iLO session saturation can be avoided by performing formal logout operations using Redfish or tools like `ilorest`. This best practice is valid in both out-of-band and in-band management contexts.