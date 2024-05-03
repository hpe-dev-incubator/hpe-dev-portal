---
title: Bulk onboarding of users in HPE GreenLake edge-to-cloud platform
date: 2024-04-24T13:44:40.533Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
tags:
  - API
  - hpe-greenlake
  - hpe-greenlake-platform
---
## HPE GreenLake API to the rescue

The use case covered in this document is part of what we call the Day 0 activities; tasks that must be done to onboard users to HPE GreenLake platform. When a customer decides to use HPE GreenLake, it is critical that all customer collaborators who require access to HPE GreenLake platform are invited to join. Using the HPE GreenLake console to invite hundreds of collaborators can be tedious and error prone - this is when an API comes to the rescue. The API allows you to write a script that reads a list of users from an Excel spreadsheet and automatically invites these users to access the HPE GreenLake platform.

## What are the HPE GreenLake edge-to-cloud platform APIs

The foundational APIs for common HPE GreenLake platform services allow IT administrators and IT operators to programmatically operate and manage users and resources in an HPE GreenLake platform workspace.   

This set of APIs for common platform services includes APIs for workspace management, identity and access management, device and subscription, locations, audit logs, and wellness.  

*Note: The [HPE GreenLake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs leverages OpenAPI specifications and associated reference material. The documentation provides a complete explanation of the operations supported by these APIs for common HPE GreenLake platform services, as well as sample requests and responses.*  

The following blog posts are an excellent way to learn more about the APIs using Postman:

* [Get started with the foundational APIs for the HPE GreenLake edge-to-cloud platform – Part 1: Introduction to the APIs](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/)
* [Get started with the foundational APIs for the HPE GreenLake edge-to-cloud platform – Part 2: Configuring and managing a workspace](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-2-configuring-and-managing-a-workspace/)
* [Get started with the foundational APIs for the HPE GreenLake edge-to-cloud platform – Part 3: Tracking activities and monitoring health](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-3-tracking-activities-and-monitoring-health/)

In this blog post, I will focus on one specific API call, part of Identity Management. The call is `POST /identity/v1/users`, which invites users to an HPE GreenLake workspace. Full documentation on this API call can be found in the [HPE GreenLake developer portal](https://developer.greenlake.hpe.com/docs/greenlake/services/iam/workspaces/public/openapi/workspaces-v1/operation/invite_user_to_account_identity_v1_users_post/).

## Providing the right data to the script

Before writing any code, it’s important to understand what data is required to invite a user. You only need the email address of the invited user- that’s easy! In the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/iam/workspaces/public/openapi/workspaces-v1/operation/invite_user_to_account_identity_v1_users_post/), you'll also see that there is no way to select a workspace to invite the user to. The reason for this is that the API credentials used to make the call is workspace specific, so it implicitly provides the workspace to which the user will be invited to. This means that you need to collect API access credentials for every workspace that you're adding users to. For the script I am writing here, in the Workspaces tab, I have stored the Client Id corresponding to API Access of a given Workspace. Because I don’t want to save Client Secrets, I will prompt for them and store them in memory.

So, my Excel file contains the following 2 sheets:

![Users tab in Excel](/img/bulkimport-blog-picture-1.png "Users tab in Excel")

![Workspaces tab in Excel](/img/bulkimport-blog-picture-2.png "Workspaces tab in Excel")

## High-level algorithm

Let’s look at the steps necessary to invite users from my spreadsheets:

1. Read command parameters to get the Excel filename
2. Open spreadsheet to retrieve data
3. For each workspace in Workspaces sheet

   * Prompt for Client Secret that matches the Client Id
   * Retrieve a session token using those credentials
4. For each user in Users sheet

   * Lookup Client Id using workspace name
   * Call POST /identity/v1/users for user using email 
   * Increase counter of invited users
5. Display list of users invited in each workspace

## Putting things together in PowerShell

I decided to use PowerShell to write this script because it provides easy native access to Excel spreadsheets.

### Step 1 – Reading the parameter from the command line.

```powershell
Param($XLFile)

if ($Null -eq $XLFile)
{
    if ($env:XLFile -eq $Null)
    {
        $XLFile = read-host "Enter name of the Excel file" 
    }
}
```

### Step 2 – Importing data from the 2 sheets of my spreadsheet.

```powershell
$tokens =@{}
$invited=@{}

if ($XLFile)
{
    $users_excel  =   import-excel -path $XLFile -dataonly -worksheetname Users
    $workspaces_excel = Import-Excel -path $XLFile -dataonly -worksheetname Workspaces  
```

Note that I initialized 2 hash tables, one called $tokens that will store the token for a given Client Id (i.e Workspace) and another called $invited for storing the number of invited users for a given Client Id.

### Step 3 – Iterating over the Workspaces sheet to collect client secrets, and retrieve access tokens.

```powershell
# Ask for client_Secret of each workspace in Excel file
    foreach ($workspace in $workspaces_excel ) {   
        $client_id = $workspace.'Client Id'    
        if ($tokens[$client_id] -eq $null) {
            # We don't have a token for this client_id yet
            # We need to ask the Client secret for this workspace
            $workspace_name = $workspace.'Workspace Name'
            $client_id = $workspace.'Client Id'

            $secClientSecret = read-host  "Enter HPE GreenLake Client Secret for Workspace $workspace_name" -AsSecureString
            $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secClientSecret)
            $secret = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
                        
            # use Client Id and Client Secret to retrieve a token
            $body = "grant_type=client_credentials&client_id=" + $client_id + "&client_secret=" + $secret
            $headers = @{} 
            $headers["Content-Type"] = "application/x-www-form-urlencoded"
            
            try {
                $response = Invoke-webrequest "https://sso.common.cloud.hpe.com/as/token.oauth2" -Method POST -Headers $headers -Body $body
                # store the token for future use
                $AccessToken = ($response.Content  | Convertfrom-Json).access_token
                $tokens.Add($client_id,$AccessToken)
            }
            catch {
                Write-Host "Error retrieving access token for workspace $workspace_name!" -ForegroundColor Red 
                exit
            }
        }
    }
```

Note that, at the end of this loop, I have a hash table of tokens indexed by Client Id, which I will use to call the API in the next section.

### Step 4 – Iterating over Users sheet to invite each of them.

```powershell
# Now walk the list of users to add
    $invited.Add($client_id,0)
    foreach ($user in $users_excel ) {
        $workspace_name = $user.'Workspace Name'
        # Get client id from workspace name
        $result = $workspaces_excel | Where-Object { $_.'Workspace Name'  -eq $workspace_name }
        if ($result.Count -eq 0)
        {
            Write-Host "Workspace not found for user " $user.email -ForegroundColor Red
            exit
        }
        $client_id = $result[0].'Client Id'
        
        Write-Host "Inviting user" $user.email "to workspace./" $workspace_name
        $AccessToken = $tokens[$client_id]

        # Create header for next API calls 
        $headers = @{} 
        $headers["Authorization"] = "Bearer $AccessToken"
        $headers["Accept"] = "application/json"
        $headers["Content-Type"] = "application/json"
        
        # Build body for next API call         
        $_body = @{
            "email"             = $user.email
            "sendWelcomeEmail"  = $true
        }
        
        $Body = $_body | ConvertTo-Json
        
        # Call GLP API to invite user
        try {
            $response = Invoke-webrequest -Uri "https://global.api.greenlake.hpe.com/identity/v1/users" -Method POST -Headers $headers -Body $Body
            $invited[$client_id]++
        }
        catch {
            Write-Host "Error sending invite for" $user.Email"! Already onboarded?"  -ForegroundColor Red
            Write-Host $Error[0]  -ForegroundColor Red
            continue
        }  
        sleep 15
    }
}
```

Note that before the loop, I initialized to zero the count of invited users for a given workspace. Also note the sleep 15 (seconds) at the end of the loop to avoid issues with rate limiting constraints  which might raise a status code 429.

*Note: Rate Limiting is a mechanism employed to control and restrict the rate at which requests or interactions are permitted to occur between clients and a service.*

### Step 5: Displaying list of users invited in each workspace.

```powershell
else 
{
    write-host 'Mailing list file not provided nor found....'
    exit
}
Write-host "Done processing Excel file $XLFile!"

# ------------------------ Query GL to get list of users for each workspace ------------------------
foreach ($workspace in $workspaces_excel ) {
    $workspace_name = $workspace.'Workspace Name'
    $client_id = $workspace.'Client Id'
    # Create header for next API calls 
    $headers = @{} 
    $AccessToken = $tokens[$client_id]
    $headers["Authorization"] = "Bearer $AccessToken"
    $headers["Accept"] = "application/json"
    $headers["Content-Type"] = "application/json"
    try {
        $response = Invoke-webrequest "https://global.api.greenlake.hpe.com/identity/v1/users?filter=&limit=300&offset=0" -Method GET -Headers $headers
    }
    catch {
        Write-Host "Cannot get list of users!!" 
        exit
    }
    $invited_users=$invited[$client_id]
    Write-Host $invited_users "user(s) invited to workspace" $workspace_name
    Write-Host "List of users in workspace:" $workspace_name
    
    $_list                     = $response.Content | ConvertFrom-Json
    if ($null -ne $_list)
    {
        $_users_list        =  [System.Collections.ArrayList]::new()
        
        foreach ($_u in $_list.Items)
        {
            
            $_users_list        += @{
                'Username'      = $_u.Username
                'Status'        = $_u.userStatus
                'id'            = $_u.Id
            }
        }
        
    }
    
    $_users_list | select Username, Status | ft -AutoSize
    
}
```

## Try it!

Let’s run this script, making sure to reference the right Excel spreadsheet: 

```markdown
PS /Volumes/Dev/GreenLake/GLP-API-Tooling/Scripts> ./bulk_invite.ps1 -XLfile userlist.xlsx                                                 
Enter HPE GreenLake Client Secret for Workspace HPEDEV -GLCP- Hackshack: ********************************
Enter HPE GreenLake Client Secret for Workspace Super Awesome Company: ********************************                 
Inviting user xxx@gmail.com to workspace  HPEDEV -GLCP- Hackshack                                              
Inviting user yyy@lalli.fr to workspace  HPEDEV -GLCP- Hackshack                                                     
Error sending invite for yyy@lalli.fr ! Already onboarded?
Inviting user zzz@lalli.fr to workspace  Super Awesome Company
Inviting user www@gmail.com to workspace  Super Awesome Company                                                
Error sending invite for www@gmail.com ! Already onboarded?
Done processing Excel file userlist.xlsx!

1 user(s) invited to workspace HPEDEV -GLCP- Hackshack                                                                  
List of users in workspace: HPEDEV -GLCP- Hackshack

Username                     Status
--------                     ------
<email>                     VERIFIED
…
yyy@lalli.fr	            VERIFIED
…
xxx@gmail.com               UNVERIFIED
…
<email>                     VERIFIED

1 user(s) invited to workspace Super Awesome Company                                                                    
List of users in workspace: Super Awesome Company

Username                          Status
--------                          ------
<email>                          VERIFIED
…
www@gmail.com 	                 VERIFIED
…
xxx@lalli.fr                     UNVERIFIED
…
<email>                          VERIFIED
```

As you can see, the script has invited 1 user in each workspace, the second email being already a member of the workspace (thus no action is necessary). 

## What’s next?

Through this post, I have shown you how it is possible to integrate with HPE GreenLake platform using the most popular scripting languages, such as PowerShell. You can get the source code for these scripts from [our community tooling repository](https://github.com/hpe-dev-incubator/GLP-API-Tooling).  

If you’re interested in trying out what I just discussed, you might first want to check out one of our hands-on Workshops-on-Demand that lets you play with the HPE GreenLake APIs mentioned in this blog post. The workshops are free, available 24/7, and very easy to use. They give you a real-world experience without any risk. Check out our [catalog of workshops](https://developer.hpe.com/hackshack/workshops), register for the one you’re interested in and go! It’s as simple as that. 

If you still have any questions regarding the HPE GreenLake platform APIs, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion on our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We are always here to help.