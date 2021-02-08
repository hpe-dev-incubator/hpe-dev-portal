---
title: "HPE Composable Infrastructure API can Java too"
date: 2017-09-08T16:49:18.215Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","RESTAPI","JAVA"]
path: hpe-composable-infrastructure-api-can-java-too
---
We have seen in the previous articles, [PowerShell-defined
infrastructure at your
fingertips!](https://community.dev.hpe.com/t5/Blogs/PowerShell-defined-infrastructure-at-your-fingertips/ba-p/236848)
that we can use a scripting language to automate HPE Composable
Infrastructure, and control it in a Software-defined way. However, what
about our developer community? Some say, "Real developers don't use
scripting languages", and I will not argue and discuss the differences
between a scripting language and a programming language. Instead, this
blog introduces how to get started programming HPE Composable
Infrastructure with Java.

# We need an Eclipse

Most programmers use an Integrated Development Environment (IDE) to
write code. The most famous ones has to be Eclipse, an open source IDE
that you can get from https://eclipse.org/downloads. Other famous ones
are Microsoft Visual Studio, and its recent open source incantation
called Visual Studio Code, which you can get from
https://code.visualstudio.com/download In this article, we will use
Eclipse.

![Eclipse IDE](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/api-java-1-1505088036254.png)

# Hello HPE OneView World!

-   All programmers know this; it all starts with a Hello World! So
    let's try to write our first Java program and print on the screen
    the version of our HPE OneView appliance. To do this

-   Create a new Java Project called OneView

-   Create a new Java class called HelloOneViewWorld with all defaults
    and hit Finish

-   Cut and paste the following Java code which will be the starting
    point for our experiments


```java
	import java.io.IOException;
	import java.io.IOException;
	import java.io.InputStreamReader;
	import java.net.HttpURLConnection;
	import java.net.URL;
	public class HelloOneViewWorld {
		public static void main(String\[\] args) {
			try {
			}
			catch (IOException e) {
			e.printStackTrace();
			}
		}
	}
```

-   Within the Try {} block, create a new URL object pointing to your HP
    OneView appliance:

> URL url = **new** URL("https:///rest/version");

-   Next, create an URLConnection object. Then specify some of the
    arguments such as Method (GET), and Property
    (Accept:application/json), remember we already had to do the same
    when we used POSTman in [API version? What API version?
    ](https://community.dev.hpe.com/t5/Blogs/API-version-What-API-version/ba-p/235776)


```java	
	HttpURLConnection conn = (HttpURLConnection)url.openConnection();
	conn.setRequestMethod("GET");
	conn.setRequestProperty("Accept", "application/json");
```

-   Next, we want to read the result in a BufferedReader object with:


```java
	BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
```

-   To keep it simple, let's only continue if we received a Status code of 200


```java
	if (conn.getResponseCode() != 200) {
		System.out.println("Error from HPE OneView.... \\n");
		return;
	}
```
-   Finally, let's print the result on the console with


```java
    String output;
    System.out.println("Hello World! HPE OneView Version is: \\n");
    while ((output = br.readLine()) != null) {
		System.out.println(output);
    }
```

-   And close the connection


```java
	conn.disconnect();
```

-   Save your work

You can download the entire module from the attachments of this article.
Nevertheless, things should look like this:

![Eclipse IDE workspace structure](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/api-java-2-1505088497854.png)

When you run this code, you get the following displayed on the Eclipse
Console:

> Hello World! HPE OneView Version is:
>
> {"currentVersion":200,"minimumVersion":1}

# When SSL security strikes again…

Well maybe not… Because, unfortunately, or fortunately should I say
(security is important), if you run this code you will get a little
delay (trying to open a connection to your HPE OneView) but finally you
will get a timeout error with something like this in the stack trace:

at sun.security.ssl.SSLSocketImpl.connect(Unknown Source)

Which tells us that there was a security problem connecting to this URL,
and the reason is that by default, HPE OneView Appliances install with a
self-signed certificate, which is not considered secure by client
applications. Most developers are familiar with what has to be done at
this point:

-   Option 1: Explicitly remove all security checks from your java code
    (not advisable). There are many article describing how to do this.
    This one is the more readable one:
    http://www.nakov.com/blog/2009/07/16/disable-certificate-validation-in-java-ssl-connections/

-   Option 2: Reconfigure your HPE OneView appliance to join an existing
    corporate Public Key infrastructure (PKI)

-   Option 3: Import the self-signed certificate of the HPE OneView
    appliance, in the Eclipse certificates keystore using a utility
    called keytool (more precisely in the keystore of the Java
    environment used by Eclipse). There are plenty of articles on how to
    do this, but this one does a good job:
    http://www.grim.se/guide/jre-cert

Let's describe briefly the steps involved with option 3:

-   Locate the Java run time environment used by Eclipse (Project
    properties, then Java Build Path, Libraries)

-   Open a command prompt and change directory to the root of the Java
    run time library

-   Open a browser to the HPE OneView Appliance

-   Export certificate to the root of Java run time library with name:
    OneView.cer

-   In command promt run:

    -   cd bin

    -   keytool -import -file ../OneView.cer -alias MyOneView -keystore
        ../lib/security/cacerts

    -   when prompted for password, use: changeit

    -   review changes and make note of the DNS names associated with
        this certificate, you will use one of these as a base URL in
        your program

    -   Type yes to import certificate in keystore

    -   You can use keytool -list to verify it has been imported, and
        keytool -delete to clean up

    -   If the DNS names found in the certificate are not valid in your
        DNS environment, add a line for it in your system hosts file
        (in c:\\windows\\system32\\drivers\\etc\\).

Once the certificate is loaded in the keystore (meaning that your Java
environment now trust the HPE OneView self-signed certificate), your
Java code will proceed.

# Getting a session token

We can now move to the next logical step, which is to authenticate
against the HPE OneVew REST API and obtain a session token as we already
did in [Authenticating against HPE Composable Infrastructure
API](https://community.dev.hpe.com/t5/Blogs/Authenticating-against-HPE-Composable-Infrastructure-API/ba-p/235893).
So let's create another Java class called GetToken.java in Eclipse, and
cut/paste the code from HelloOneViewWorld.java.

-   Add another import for java.io.OutputStream

    import java.io.OutputStream;

-   Change the URL object to use:

> URL url = new URL("https:///rest/login-sessions");

-   Replace the connection properties with the following:


```java
	conn.setRequestMethod("POST");
	conn.setDoOutput(true);
	conn.setRequestProperty("Accept", "application/json");
	conn.setRequestProperty("Content-Type", "application/json");
	conn.setRequestProperty("X-API-Version", "200");
	String body = "{\\"userName\\":\\"administrator\\",\\"password\\":\\"password\\"}";
	OutputStream os = conn.getOutputStream();
	os.write(body.getBytes());
	os.flush();
```

-   Replace the Hello World string with " HPE OneView Response is: \\n"

Everything else can remain unchanged and the final code should look like
this:

![Java code to get Oneview appliance token](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/api-java-3-1505088504470.png)

You can now execute this code, which, provided you solved the SSL issue
mentioned above, will return the following:

HPE OneView Response is:


```json
	{"partnerData":{},
	"sessionID":"MjA5NjEwOTM0MTQ4bcFsogYf-fHCmOPdSsLu0259scrx\_SFV"}

# And continue from there…

Once you have a version number and a session token you can place any
call you'd like on the HPE OneView API. Remember to always use the
following connection properties:

```java
	conn.setRequestProperty("Accept", "application/json");
	conn.setRequestProperty("X-API-Version", "YourSelectedVersion");
	conn.setRequestProperty("auth", "your-sessionID-goes-here");

```

However, you should also be aware that a Java SDK for HPE OneView is
available from Github
(https://github.com/HewlettPackard/oneview-sdk-java), and this SDK
simplifies many things when doing Java programming, by creating a
lightweight level of abstraction between your Java code and the HPE
OneView API. Most important is the parsing of the resulting JSON, which
becomes simple Java properties when using the Java SDK. We will cover
this in a forthcoming article.