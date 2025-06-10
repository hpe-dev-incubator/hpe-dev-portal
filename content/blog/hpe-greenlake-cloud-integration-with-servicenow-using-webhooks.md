---
title: HPE GreenLake cloud integration with ServiceNow using webhooks
date: 2025-06-06T14:45:12.273Z
author: Chethan B.
authorimage: /img/chethan.png
disable: false
tags:
  - webhooks
  - hpe-greenlake-cloud
---
[ServiceNow](https://servicenow.com/), as a third-party platform, provides robust capabilities to develop custom webhook handlers that can directly receive and process external events in real time. These webhook handlers can be easily integrated with HPE GreenLake webhooks, allowing for smooth communication between systems. This flexibility enables teams to automate a wide range of workflows and trigger specific actions based on customer-defined requirements. By enabling seamless integration with other tools and services, this feature significantly enhances operational efficiency, reduces manual intervention, and ensures faster response to critical business events. Below are the steps to set up ServiceNow, develop a webhook handler, and integrate with the HPE GreenLake unified events framework to receive real-time events.

## Optional step 1: Login and setup of a ServiceNow instance

> Note: You can ignore Step 1 if you already have a ServicesNow instance.

1. Create a ServiceNow developer instance in ServiceNow using the following link: https://signon.service-now.com/
2. After signing in, click on the Request Instance found at the top right corner of the screen.

![Request ServiceNow instance](/img/servicenow-webhook-blog-eceaeba3-a264-4fa7-af6b-434a1d26832d.jpeg "Request ServiceNow instance")

3. Once requested, it will take a minute to provision the instance, click on the profile to check what the status is. The status should be Online.

![Manage ServiceNow instance](/img/servicenow-webhook-blog-a8242a8f-67d7-474e-8f06-60985ab1719a.jpeg "Manage ServiceNow instance")

4. Click on Manage instance password from the INSTANCE ACTION list, as shown above. Here, you will find the details about your ServiceNow instance such as its URL, username, and password. Log in to your instance URL with the provided credentials.

![ServiceNow instance details](/img/servicenow-webhook-blog-0017ecb8-a01f-4ab8-9261-4d626d983491.jpeg "ServiceNow instance details")

## Step 2: Create a webhook endpoint

1. Once logged into your ServiceNow instance, click on All, search, and click on scripted rest api.
2. Click on New in the top-right corner and fill in the Name. Click outside the box. The App Id will automatically pop up. Then, click on submit.
3. Once it has been successfully submitted, you can search in the scripted REST API using the same name you created (ex: unified events)., Click on that record, scroll to bottom, and click on New.
4. Now, fill in the details: i.e. give it the appropriate Name and relative path, select HTTP method to POST, uncheck Require authentication, and click on Submit.

![Registering a scripted REST API handler](/img/servicenow-webhook-blog-cfb0ec5a-f2f3-4982-bf02-361f5efe9d73.jpeg "Registering a scripted REST API handler")

5. Paste the code snippet below in the Script section of the above created record (Change the secret in line 144).

```python
// Code Snippet for GreenLake Webhook handler
(function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
    var requestBody = request.body.data;
    var setAuth = gs.getProperty('setAuth');
    if (setAuth == "true") {
        var reqHeaderAuthorization = request.getHeader("Authorization");
        if (reqHeaderAuthorization == null || reqHeaderAuthorization == "") {
            response.setStatus(401);
            response.setHeader("Content-Type", "application/json");
            var respWriter = response.getStreamWriter();
            respWriter.writeString(JSON.stringify({
                httpStatusCode: "401",
                error: "Authorization header is missing"
            }));
            respWriter.writeString("\n");
            return;
        } else {
            var includesPrefixBearer = reqHeaderAuthorization.includes("Bearer");
            gs.info("includesPrefixBearer " + includesPrefixBearer);
            if (includesPrefixBearer) {
                // oauth validation
                var token = reqHeaderAuthorization.split('Bearer')[1];
                token = token ? token.trim() : '';
                var validatedToken = validateToken(token);
                if (!validatedToken) {
                    response.setStatus(401);
                    response.setHeader("Content-Type", "application/json");
                    var respWriter2 = response.getStreamWriter();
                    respWriter2.writeString(JSON.stringify({
                        httpStatusCode: "401",
                        error: "Authorization failed"
                    }));
                    respWriter2.writeString("\n");
                    return;
                }
            } else {
                // apikey validation
                var validatedResponse = checkAPIKEYValidation(reqHeaderAuthorization);
                if (!validatedResponse) {
                    response.setStatus(401);
                    response.setHeader("Content-Type", "application/json");
                    var respWriter4 = response.getStreamWriter();
                    respWriter4.writeString(JSON.stringify({
                        httpStatusCode: "401",
                        error: "Authorization failed"
                    }));
                    respWriter4.writeString("\n");
                    return response;
                }

            }
        }
    }
    eventType = requestBody.type;
    gs.info("event type " + eventType);
    eventData = requestBody.data;

    if (eventType.includes("verification")) {
        gs.info("Recieved code verification request");
        codeChallengeStr = requestBody.data.challengeRequest;
        gs.info("codeChallenege Request  :" + codeChallengeStr);
        var generated;
        var resp;
        generated, resp = getHMACSecretFromLambda(codeChallengeStr);
        if (generated == false) {
            response.setStatus(500);
            response.setContentType("application/json");
            var writer = response.getStreamWriter();
            writer.writeString(JSON.stringify({
                httpStatusCode: "500",
                error: JSON.stringify(resp)
            }));
            writer.writeString("\n");
            return;
        }
        response.setStatus(201);
        response.setHeader("Content-Type", "application/json");
        var writerResp2 = response.getStreamWriter();
        writerResp2.writeString(JSON.stringify({
            httpStatusCode: "201",
            verification: resp
        }));
        writerResp2.writeString("\n");
        pushEventToIncidentTable(JSON.stringify(eventData), eventType);
        return;
    } else if (eventType.includes("com.hpe")) {
        gs.info("Recieved event with event type : " + requestBody.type);
        hpeWebhookSignature = request.getHeader("HPE-Webhook-Signature");
        eventData = requestBody;
        var generatedSignature;
        generated, resp = getHMACSecretFromLambda(JSON.stringify(eventData));
        generatedSignature = "sha256=" + resp;
        if (generatedSignature == hpeWebhookSignature) {
            gs.info("Received webhook signature are matching");
        } else {
            gs.info("webhook signature are not same, Recieved: " + hpeWebhookSignature + " generated : " + resp);
            response.setStatus(412);
            response.setHeader("Content-Type", "application/json");
            var writerResp4 = response.getStreamWriter();
            writerResp4.writeString(JSON.stringify({
                httpStatusCode: "412",
                error: "hmac signature failed to match"
            }));
            writerResp4.writeString("\n");
            return;
        }
    } else {
        gs.warn("Not a valid request body doesn't contains type in req body");
        response.setStatus(400);
        response.setHeader("Content-Type", "application/json");
        var respWriter3 = response.getStreamWriter();
        respWriter3.writeString(JSON.stringify({
            httpStatusCode: "400",
            error: "Not a valid request body, type field is missing"
        }));
        respWriter3.writeString("\n");
        return;
    }

    // push incident to incident table
    pushEventToIncidentTable(JSON.stringify(eventData), eventType);

    response.setStatus(201);
    response.setHeader("Content-Type", "application/json");
    var writerResp3 = response.getStreamWriter();
    writerResp3.writeString(JSON.stringify({
        httpStatusCode: "200",
    }));
    writerResp3.writeString("\n");

})(request, response);

function getHMACSecretFromLambda(codechallengeReq) {
    function encodeToHex(byteArray) {
        var hexChars = "0123456789abcdef";
        var hexStr = "";
        for (var i = 0; i < byteArray.length; i++) {
            var bt = byteArray[i] & 0xFF;
            hexStr += hexChars[(bt >> 4) & 0x0F];
            hexStr += hexChars[bt & 0x0F];
        }
        return hexStr;
    }
    key = "your secret";
    var mac = new GlideCertificateEncryption();
    var base64Key = GlideStringUtil.base64Encode(key);
    var base64HMAC = mac.generateMac(base64Key, "HmacSHA256", codechallengeReq);
    var byteArray = GlideStringUtil.base64DecodeAsBytes(base64HMAC);
    var hexHMAC = encodeToHex(byteArray);
    gs.info("hmac generated sig " + hexHMAC);
    return true, hexHMAC;
}

function pushEventToIncidentTable(description, shortDescription) {
    try {
        var gr = new GlideRecord('incident');
        gr.initialize();
        gr.short_description = "HPE GLCP: " + shortDescription;
        gr.description = description;
        gr.assigned_to = "admin";
        gr.assignment_group = "HPE GLCP";
        gr.caller_id = "System Administrator";
        gr.urgency = 1;
        gr.priority = 1;
        gr.insert();
        gs.info("✅ Pushed event to Incident table: " + gr.number);
    } catch (ex) {
        gs.warn("Error in pushing event to Incident table: " + ex.message);
    }
}

function checkAPIKEYValidation(apikey) {
    var gr = new GlideRecord("u_unified_events_api_key");
    gr.query();
    var response = sn_ws_int.RESTAPIResponse
    var apiKeyValid = false;
    while (gr.next()) {
        var now = new GlideDateTime();
        var expiryTime = new GlideDateTime(gr.u_expiry_time);
        gs.info("expiryTime.after(now) " + expiryTime.after(now));
        if (apikey == gr.u_api_key && expiryTime.after(now)) {
            gs.info("API key is valid");
            apiKeyValid = true;
            break;
        }
    }
    if (!apiKeyValid) {
        gs.info(" the requested api key is not a valid key or might had expired: " + apikey);
        return false;
    }
    return true;
}


function decodeBase64Url(base64Url) {
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return GlideStringUtil.base64Decode(base64);
}

function validateToken(token) {
    var parts = token.split('.');
    if (parts.length === 3) {
        var header = decodeBase64Url(parts[0]);
        var payload = decodeBase64Url(parts[1]);
        gs.info("JWT Header: " + header);
        gs.info("JWT Payload: " + payload);
    } else {
        gs.error("Invalid JWT token format.");
        return false;
    }

    var payloadObj = JSON.parse(payload);
    gs.info("Expires At (epoch): " + payloadObj.exp);

    var now = new Date().getTime() / 1000;
    if (payloadObj.exp && payloadObj.exp < now) {
        gs.error("Token is expired.");
    } else {
        gs.info("Token is still valid");
        return false;
    }
    return true;
}
```

## Step 3: Set up the API key

1. You can set up an API Key as an authentication method, To do this, you need to create a new table.
2. Search for tables in All (header bar), look for System Definitions → Tables, and click on it, Click on New (top-right corner), fill in the details for its label name. It will auto-populate by clicking outside, Click submit. (ex: unified-events-api-key)
3. Now, search in tables with above-created name, making sure to select for text as a filter. Click on the table with matched result.

![Setting up API key](/img/servicenow-webhook-blog-4d7ccf04-4626-45a9-998f-35d9a03acf6f.jpeg "Setting up API key")

4. Now, add 2 more columnar fields to the table api_key and expiry_time, as shown below, with proper types by clicking on insert new rows.

![Adding api_key and expiry_time fields](/img/servicenow-webhook-blog-f470575f-6d7a-48d1-a98c-ef161a54a827.jpeg "Adding api_key and expiry_time fields")

5. Next, search this table for unified-events-api-key in All using the search bar. Click on new to add api-keys by generating new alphanumeric key, and select expiry time by calendar pick. One can add more API keys with other expiry time for easy rotation.(https://generate-random.org/api-key-generator?count=1&length=128&type=mixed-numbers&prefix=.)

## Step 4: Configure the incidents table to get notifications in ServiceNow.

This step will allow you to trigger notifications in ServiceNow so one can easily verify the triggered events.

1. In All section search for Business rules (System definitions → Business rules), click on and search Abort changes, and select one, as shown below.

![Configuring the incidents table](/img/servicenow-webhook-blog-b59f8ece-6b27-4b70-af46-2bc83a062a3a.jpeg "Configuring the incidents table")

2. Once you click on the abort changes on a group, uncheck the Insert, as shown below.

![Modifying abort change on group](/img/servicenow-webhook-blog-eaabb59e-9fbb-4ddc-907b-8796ecd3c5e6.jpeg "Modifying abort change on group")

3. Navigate to Business rules again and click on new to create a new rule, name it, (ex: trigger notification), select table Incident, enable checks for Active, Insert, Update, and add a filter condition (“Short description starts with HPE”), as shown below. Click on Submit.

![Adding description for event](/img/servicenow-webhook-blog-c6a22d4d-56b9-41cb-8dfa-a8fdac99ab6d.jpeg "Adding description for event")

## Step 5: Call the webhook and test it with ServiceNow

1. Get the webhook endpoint. To get the Resource path, navigate to Scripted Rest API then search with created REST API name:

   ![Example of endpoint](/img/servicenoew-webhook-note1.jpg "Example of endpoint")

> It should look like:

![Finding the endpoint URL](/img/servicenoew-webhook-note1.jpg "Finding the endpoint URL")

2. Once all the steps have been completed, call the webhook from Postman or copy the below CURL and paste it in a terminal. Make sure to change the --location url of your instance.

```shell
curl --location 'https://<dev instance>.service-now.com/api/1762185/unified_events/webhook1' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Grills",
  "status": "SOLD",
  "description": "Grills is a Beer",
  "photo_url": "http://baseurl/resourceId?action=confirm",
  "data":{"challengeRequest":"e37dc544569d43c73d088"},
  "type":"com.hpe.verification"
}'
```

3. Now you will receive events in ServiceNow. Search for Incidents in All using the search bar, click on Assigned to me, and you should see the events triggered in table.

![Receiving events from GreenLake](/img/servicenow-webhook-blog-e980f286-a395-48b7-9f8e-8596f0ab008b.jpeg "Receiving events from GreenLake")

4. Also, you will get an event notification in ServiceNow web console, as shown below.

![Event notification in web console](/img/servicenow-webhook-blog-2743dab1-f57e-4e38-9878-b9d78860ad1b.jpeg "Event notification in web console")

5. One can debug from the logs in case of any failures. To do so, search for System Log from All in the search bar, and click on All in System Log to see all levels of logs.

![events coming in](/img/servicenow-webhook-blog-5c9b0e45-419b-4cb2-ab5d-62cd1d753712.jpeg "events coming in")

6. Now, one can register the ServiceNow webhook using the secret that had been set in the script with Unified events framework, and will start receiving events in ServiceNow.

## Conclusion

Leveraging ServiceNow’s webhook handling capabilities allows us to create highly responsive, automated workflows tailored to customer needs. By integrating seamlessly with existing systems, it not only streamlines operations but also enhances agility and scalability in managing real-time events across platforms.