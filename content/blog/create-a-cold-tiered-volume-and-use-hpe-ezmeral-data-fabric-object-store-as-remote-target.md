---
title: Create a Cold-Tiered Volume and use HPE Ezmeral Data Fabric Object Store
  as remote target
date: 2023-02-18T07:02:29.335Z
author: Raymond Yan
authorimage: https://i.ibb.co/64JFMHq/mmexport1595671906156-1.png
thumbnailimage: https://i.ibb.co/rvp7d53/thumbnail-image.png
disable: false
tags:
  - hpe-ezmeral-data-fabric
  - data-tiering
  - object-store
---
## Introduction

In HPE Ezmeral Data Fabric, you can create a Cold-Tiered Volume, set corresponding Storage Policies, and periodically offload the data in the Volume to the remote object storage.

The remote object storage can be the object storage of AWS, GCP, Azure and other public clouds, or an object storage service compatible with Minio.

Of course, you can also use the Object Store of HPE Ezmeral Data Fabric as a remote target.

This article will demonstrate how to create a Cold-Tiered Volume and configure another Ezmeral Data Fabric Object Store as the remote target for offloading.

At the same time, I will also demonstrate how to create an Account, IAM user, and bucket in the HPE Ezmeral Data Fabric Object Store, and use the AWS CLI to perform a put object operation on this bucket through the above configuration.

### [](#advantages-of-using-data-tiering)Advantages of using Data Tiering

HPE Ezmeral Data Fabric (data fabric) provides rule-based automated tiering functionality that allows you to seamlessly integrate with:

* Low-cost storage as an additional storage tier in the data fabric cluster for storing file data that is less frequently accessed ("warm" data) in erasure-coded volume.
* 3rd party cloud object storage as an additional storage tier in the data fabric cluster to store file data that is rarely accessed or archived ("cold" data).

In this way, valuable on-premise storage resources can be used for more active or "hot" file data and applications, while "warm" and/or "cold" file data can be retained at minimum cost for compliance, historical, or other business reasons. HPE Ezmeral Data Fabric provides consistent and simplified access to and management of the data.

### [](#advantages-of-using-object-store)Advantages of using Object Store

HPE Ezmeral Data Fabric Object Store is a native object storage solution that efficiently stores objects and metadata for optimized access.

Underlying each Object Store bucket is a volume. Every bucket created in an Object Store account is automatically associated with a volume. You can snapshot or mirror a bucket volume for disaster recovery.

If you create an account in Object Store, specify the erasure coding scheme (ecscheme) in the storage_class. All buckets created in the account inherit the ecscheme. Underlying volumes are automatically tiered such that data in a bucket volume can be offloaded to a back-end volume to reclaim storage space.

Some potential Object Store use cases include:

* Archive data and build on-premises applications, or migrate to cloud-native applications.
* Store media for operational use; reduce costs of storing globally distributed media, such as music, video, and images.
* Run analytics on data with tools like Apache Spark, Apache Drill, Presto, and S3 Select to gain valuable insights into customers, operations, or markets.
* Maintain Spark Delta Lake time travel information. You can time travel to see different versions of the data when Object Store is configured as a data lake for Spark Delta Lake.
* Store ML model data and share the ML models in real-time with downstream applications.
* Publish S3 events to HPE Ezmeral Data Fabric Streams.

## [](#install-and-configure-object-store)Install and configure Object Store

Regarding the installation of Object Store, I recommend you to use the [Installer](https://docs.datafabric.hpe.com/72/MapRInstaller.html).

When using the Installer to install HPE Ezmeral Data Fabric 7.0.0 or higher, you must enable security.

Even for POC environments, I recommend you enable and configure basic security.

If you have ever used the ecological components of Apache Hadoop, or other commercial big data suites, then I think you already have the basic concepts of authentication, authorization, audit, and encryption of the Hadoop ecosystem.

The rationale for the security of HPE Ezmeral Data Fabric is the same as an open-source Hadoop ecosystem.

For example, SASL (MapR-SASL, Kerberos) is used for authentication, Ranger is used for authorization, and TLS is used for encryption.

Use the Installer to install HPE Ezmeral Data Fabric, which can automatically create a series of TLS-related certificates, and automatically configure core components and various HPE Ezmeral Ecosystem Pack components to enable security.

### [](#post-installation-configuration-for-object-store)Post-installation configuration for Object Store

Some post-installation steps must be performed before you can use the HPE Ezmeral Data Fabric Object Store.

You should refer to this document - [Enabling the HPE Ezmeral Data Fabric Object Store](https://docs.datafabric.hpe.com/72/AdvancedInstallation/Enabling_object_store.html) for post-installation configuration.

For the above document, I have a few supplementary notes, which should make your configuration smoother.

1. About the "keytool -noprompt -importcert" command in the docs.

Please do not use this 👇 command in the original document:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias maprca -keystore ${JAVA_HOME}/lib/security/cacerts -storepass <cacerts_truststore>
```

Instead, use the following command:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias maprca -cacerts -storepass <cacerts_truststore>
```

If you use the Installer to install Ezmeral Data Fabric on a fresh OS, then Installer will automatically install JDK 11, then "-storepass" password is "changeit".

There is another place in the documentation where keytool is used, the command is as follows:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias mosscert -keystore ${JAVA_HOME}/lib/security/cacerts -storepass changeit
```

You don't need to execute `keytool` twice to import the same cacert certificate file.

I suggest you change "maprca" to something more recognizable.

For example, if you named the cluster "edf-cluster-a.mycompany.com" when you installed the HPE Ezmeral Data Fabric cluster, then you can use the following keytool command:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias edf-clustera-ca -keystore ${JAVA_HOME}/lib/security/cacerts - storepass <cacerts_truststore>
```

The file - /opt/mapr/conf/ca/chain-ca.pem, is a self-signed TLS certificate file created by the Installer when configuring wire-level encryption for the cluster.

Since it's a self-signed TLS certificate, the client (application, or your browser) will not be able to trust the TLS certificate of the server when accessing the HPE Ezmeral Data Fabric server.

This is because the CA certificate used by the self-signed TLS certificate is not publicly trusted.

In any scenario where a self-signed TLS certificate is used, you need to import the self-signed CA certificate into the OS system.

You can use the following command:

```shell
keytool -list -v -cacerts
```

to look at things like CA certificates in your JVM.

You'll find something like the following:

```
Alias name: digicertassuredidrootca
Creation date: Feb 2, 2023
Entry type: trustedCertEntry

Owner: CN=DigiCert Assured ID Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US
Issuer: CN=DigiCert Assured ID Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US
...
```

This is a recognized CA certificate issued by Digicert.

So, after you use `keytool` to import /opt/mapr/conf/ca/chain-ca.pem into the JVM, use keytool -list -v -cacerts to see something similar to the following:

```
Alias name: edf-clustera-ca
Creation date: Feb 16, 2023
Entry type: trustedCertEntry

Owner: CN=MapR Engineering Signing CA, OU=MapR Engineering Signing CA, O=MapR, DC=hpecorp, DC=net
Issuer: CN=MapR Engineering Root CA, OU=MapR Engineering Root CA, O=MapR, DC=hpecorp, DC=net
...
```

2. The documentation describes several client software that you can use to interact with the HPE Ezmeral Object Store. I would like to add the following clarification:

When using the `mc` command-line tool or the `s3cmd` command-line tool to interact with HPE Ezmeral Data Fabric Object Store without completing the configuration of "[Enabling S3 Virtual-Host-Style Requests](https://docs.datafabric.hpe.com/72/AdvancedInstallation/Enabling_object_store.html#concept_isb_53h_5bb__section_nnp_kr2_bvb)", some commands will not work properly.

In this case, for management operations, such as creating accounts, IAM accounts, buckets, etc., I recommend you use the `mc` command line tool.

For object listing, getting, putting, and deleting operations, I recommend you use `AWS CLI`.

3. Cannot revert to HTTP mode after enabling HTTPS.

If the Object Store was installed using the Installer, the Object Store will also have security enabled, including HTTPS.

Although you can see the below description:

> To revert to http access, comment out the moss.certs.dir=/opt/mapr/conf line in the /opt/mapr/conf/moss.conf file.

from here - [HTTP Access to Object Store](https://docs.datafabric.hpe.com/72/AdvancedInstallation/Enabling_object_store.html#concept_isb_53h_5bb__section_bg1_zd1_vsb), but this configuration change alone does not change Object Store to HTTP mode, and there is nothing else in HPE Ezmeral Data Fabric's documentation on how to modify Object Store's TLS mode.

### [](#create-a-bucket-in-hpe-ezmeral-data-fabric-object-store-and-upload-some-objects)Create a bucket in HPE Ezmeral Data Fabric Object Store and upload some objects

...to be continued...