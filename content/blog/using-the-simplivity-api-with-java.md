---
title: "Using the SimpliVity API with Java"
date: 2018-08-03T16:27:34.727Z
author: HPE DEV staff 
tags: ["hpe-simplivity.java","api"]
path: using-the-simplivity-api-with-java
---
# **Using the SimpliVity API with Java**
This sample Java code performs authentication, issues example GET requests, performs a POST operation (in this case, renaming a backup), and monitors the status of the operation using a task instance. 
```java
package main.java;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.net.ssl.SSLSession;
import javax.net.ssl.HostnameVerifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

public class RestClient {

    private static String access_token;
    private String BASE_URL;
    static final String HMS_USERNAME = "HMS_USER";
    static final String HMS_PASSWORD = "HMS_PASS";
    public RestClient(String hostIp)
    {
        BASE_URL = "https://"+hostIp+"/api/";
    }

    // Create a trust manager that does not validate certificate chains.
    private void enableSSL()
    {
        TrustManager[] trustAllCerts = new TrustManager[]
        { new X509TrustManager()
        {
            public X509Certificate[] getAcceptedIssuers()
            {
                return new X509Certificate[0];
            }
            public void checkClientTrusted(X509Certificate[] certs, String authType)
            {
            }
            public void checkServerTrusted(X509Certificate[] certs, String authType)
            {
            }
        } };
        try {
            SSLContext sc = SSLContext.getInstance("TLSv1.2");
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });

        } catch (Exception e) {
        }
    }

    /*
     * Authenticate user and retrieve access token.
     */
     public String getAccessToken()
    {
        enableSSL();

        String encoding = Base64.encode("simplivity:".getBytes());

        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
        body.add("username", HMS_USERNAME);
        body.add("password", HMS_PASSWORD);
        body.add("grant_type", "password");
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("Authorization", "Basic " + encoding);
        HttpEntity<?> entity = new HttpEntity<Object>(body, headers);
        ResponseEntity<String> res = restTemplate.exchange(
            BASE_URL+"oauth/token", HttpMethod.POST, entity,
            String.class);
        JSONObject jsonObj = new JSONObject(res.getBody());
        access_token = (String) jsonObj.get("access_token");
        System.out.println("Authenticated user and retrieved access token: "+ access_token);
        return access_token;
    }

    /*
     * Issue a GET request: GET /policies.
     */
    public Object getPolicies()
    {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.set("Authorization", "Bearer " + access_token);
        HttpEntity<?> entity = new HttpEntity<Object>("parameters", headers);
        ResponseEntity<String> res = restTemplate.exchange(BASE_URL+"policies", HttpMethod.GET, entity, String.class);
        JSONObject jsonObj = new JSONObject(res.getBody());
        Object policies=  jsonObj.get("policies");
        System.out.println(policies.toString());
        return policies;
    }

    /*
     * Issue a GET request with sorting and filtering:
     * GET the first 100 policies
     * sorted in ascending order by name
     * and show only the name and rules fields.
     */
    public Object getFirst100Policies()
    {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("Authorization", "Bearer " + access_token);
        HttpEntity<?> entity = new HttpEntity<Object>("parameters", headers);
        ResponseEntity<String> res = restTemplate.exchange(BASE_URL+"policies?fields=name,rules&limit=100&offset=0&sort=name&order=ascending",
            HttpMethod.GET, entity, String.class);
        JSONObject jsonObj = new JSONObject(res.getBody());
        Object policies=  jsonObj.get("policies");
        System.out.println(policies.toString());
        System.out.println("Limit: "+ jsonObj.get("limit"));
        System.out.println("Count: "+ jsonObj.get("count"));
        return policies;
    }

    /*
     * Issue a POST request: Create a new policy.
     */
    public void createNewPolicy()
    {
        RestTemplate restTemplate = new RestTemplate();
        // Set a custom media type.
        MediaType myMediaType = new MediaType("application", "vnd.simplivity.v1+json");

        // Set the headers.
        HttpHeaders headers = new HttpHeaders();   
        headers.setAccept(Arrays.asList(myMediaType));
        headers.setContentType(myMediaType);
        headers.set("Authorization", "Bearer " + access_token);

        // Form the POST body.
        String policyMo =  "{\"name\": \"randomPolicyName4\"}";
        HttpEntity<?> entity = new HttpEntity<String>(policyMo, headers);

        // Issue the POST operation and expect a task object in return.
        ResponseEntity<String> res = restTemplate.exchange(BASE_URL+"policies", HttpMethod.POST, entity, String.class);
        JSONObject jsonObj = new JSONObject(res.getBody());
        Object task = jsonObj.get("task");
        JSONObject taskJson = new JSONObject(task.toString());
        String taskId = taskJson.getString("id");
        String state = taskJson.getString("state");

        // Monitor the status of the policy creation operation by using a loop to query
        // the task while this task is IN_PROGRESS.
        // The state field in the JSON response body indicates the status.
        while(state.equals("IN_PROGRESS"))
        {
            // Wait one second.
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            res = restTemplate.getForEntity(BASE_URL+"tasks/"+taskId, String.class);
            jsonObj = new JSONObject(res.getBody());
            task = jsonObj.get("task");
            taskJson = new JSONObject(task.toString());
            state = taskJson.getString("state");
        }
        System.out.println("Task object: " +task.toString());    
    }

    public static void main(String[] args)
    {
        RestClient restClient = new RestClient("10.150.1.71");
        // Authenticate user and retrieve access token.
        restClient.getAccessToken();
        // GET policies.
        restClient.getPolicies();
        // GET first 100 policies sorted in ascending order by name 
        // and showing only the name and rules fields.
        restClient.getFirst100Policies();
        // POST /policies: Create a new policy.
        restClient.createNewPolicy();
    }
}
```