---
title: How to Configure iSUT and AMS for vLCM-Based Firmware Updates on HPE
  Gen12 Servers (High Security Mode)
date: 2025-10-01T14:30:17.312Z
author: Vijayakannan M
authorimage: /img/Avatar1.svg
disable: false
tags:
  - OV4VC
  - VLCM
  - COM4VC
  - HPE OneView
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

HPE Gen12 servers introduce enhanced security by supporting only High Security modes (SecureStandard, CNSA, FIPS). This impacts how you configure **iSUT** (Intelligent System Update Tool) and **AMS** (Agentless Management Service) for **vSphere Lifecycle Manager (vLCM)** based firmware updates. Unlike previous generations, configuration via the vLCM Pre-Check page is not available in these modes due to credential requirements. Instead, you must manually configure AMS and iSUT by creating an application account and providing valid HPE iLO credentials.

- - -

## **Prerequisites**

* HPE Gen12 server with iLO 7
* vSphere environment with vLCM enabled
* iLO credentials with sufficient privileges
* Access to server CLI (SSH or local console)

- - -

## **Step 1: Create an Application Account on iLO 7**

Application accounts are service accounts in iLO 7, used by host applications (like iSUT and AMS) to securely authenticate and communicate with iLO.

**To create an application account using CLI:**

```shell
sut appaccount create -u <ilo_username> -p <ilo_password>
```

**Alternatively, To proceed without creating an application account, provide the iLO credentials using the following CLI command:**



```shell
sut -set ilousername=<ilo_username> ilopassword=<ilo_password>
```

- - -

## **Step 2: Set iSUT Mode to AutoDeploy**

Set the iSUT mode to `AutoDeploy` to enable automated firmware updates:

```shell
sut -set mode=AutoDeploy
```

- - -

## **Step 3: Configure AMS Application Account (for VMware)**

For VMware environments, create the AMS application account:

```shell
amsdCli appaccount create -u <ilo_username> -p <ilo_password>
```

- - -

## **Step 4: Verify Application Account in iLO**

1. Open the **iLO GUI**.
2. Navigate to **iLO Settings** > **User Management** > **Users**.
3. Select **Application Account**.
4. Confirm the application account details are present.

- - -

## **Step 5: Check AMS Status in iLO GUI**

* Ensure AMS status is reported as **Available** in the iLO GUI.

- - -

## **Step 6: Verify iSUT and AMS Status in vSphere**

1. Log in to **VMware vSphere**.
2. Select the required **cluster** and click the **Configure** tab.
3. In the left panel, go to **Cluster > Configure > HPE Server Hardware**.
4. On the **vLCM Pre-Check** panel, check the **iSUT mode** and **AMS state**.
5. Refresh the page and confirm both statuses are **green**.

- - -

## **Conclusion**

With AMS and iSUT properly configured, you are ready to proceed with vLCM-based firmware updates on HPE Gen12 servers, including both **ProLiant** and **Synergy** models. This ensures secure, automated, and compliant lifecycle management in high-security environments.

- - -

**Tip:** Always refer to the latest HPE and VMware documentation for updates on security practices and supported configurations.