---
title: How to create a cold-tiered volume and use HPE Ezmeral Data Fabric Object
  Store as the remote target
date: 2023-03-06T01:05:32.156Z
author: Raymond Yan
authorimage: https://i.ibb.co/64JFMHq/mmexport1595671906156-1.png
thumbnailimage: https://i.ibb.co/rvp7d53/thumbnail-image.png
disable: false
tags:
  - hpe-ezmeral-data-fabric
  - data-tiering
  - object-store
  - hpe-greenlake-for-data-fabric
---
## Introduction

### What is data tiering and why do it?


Much of your data needs to be retained, either to meet regulatory requirements or because it still has value.
Data tiering is useful for data that is not accessed frequently but needs to be retained to be stored in a more resource-efficient and cost-effective manner.


The most frequently accessed file data can be thought of as a "hot data tier, which uses normal file storage.
Data used less often can be moved to low-cost storage alternatives in different ways, depending on the relative frequency of access.
Some data is rarely accessed or modified but needs to be archived for future projects, for verification purposes in audits, or to meet regulatory requirements. This "cold" data could be tiered to low-cost object storage in the same data storage system or in a remote storage system, such as remote object storage.



In HPE Ezmeral Data Fabric, you can create a cold-tiered volume, set corresponding storage policies, and periodically offload the data in the volume to the remote object storage.
The remote object storage can be the object storage of AWS, GCP, Azure and other public clouds, or an object storage service compatible with Minio.
Of course, you can also use the Object Store of HPE Ezmeral Data Fabric as a remote target.
This article will demonstrate how to create a cold-tiered volume and configure another HPE Ezmeral Data Fabric Object Store as the remote target for offloading.
At the same time, I will also demonstrate how to create an account, IAM user, and bucket in the HPE Ezmeral Data Fabric Object Store, and use the AWS CLI to perform a **put object operation** on this bucket through the above configuration.

### [](#advantages-of-using-data-tiering)Advantages of using data tiering

HPE Ezmeral Data Fabric provides a rule-based automated tiering functionality that allows you to seamlessly integrate with:

- Low-cost storage as an additional storage tier in the data fabric cluster for storing file data that is less frequently accessed ("warm" data) in an erasure-coded volume.
- 3rd party cloud object storage as an additional storage tier in the data fabric cluster to store file data that is rarely accessed or archived ("cold" data).

In this way, valuable on-premise storage resources can be used for more active or "hot" file data and applications, while "warm" and/or "cold" file data can be retained at minimal cost for compliance, historical, or other business reasons. HPE Ezmeral Data Fabric provides consistent and simplified access to and management of the data.

### [](#advantages-of-using-object-store)Advantages of using Object Store

HPE Ezmeral Data Fabric Object Store is a native object storage solution that efficiently stores objects and metadata for optimized access.

Underlying each Object Store bucket is a volume. Every bucket created in an Object Store account is automatically associated with a volume. You can snapshot or mirror a bucket volume for disaster recovery.

If you create an account in Object Store, specify the erasure coding scheme (ecscheme) in the storage_class. All buckets created in the account inherit the ecscheme. Underlying volumes are automaticall tiered in such a way that data in a bucket volume can be offloaded to a back-end volume to reclaim storage space.

Some potential Object Store use cases include:

* Archive data and build on-premises applications, or migrate to cloud-native applications.
* Store media for operational use; reduce costs of storing globally distributed media, such as music, video, and images.
* Run analytics on data with tools like Apache Spark, Apache Drill, Presto, and S3 Select to gain valuable insights into customers, operations, or markets.
* Maintain Spark Delta Lake time travel information. You can time travel to see different versions of the data when Object Store is configured as a data lake for Spark Delta Lake.
* Store ML model data and share the ML models in real-time with downstream applications.
* Publish S3 events to HPE Ezmeral Data Fabric Streams.

## [](#install-and-configure-object-store)Install and configure Object Store

Regarding the installation of Object Store, I recommend you use the [Installer](https://docs.datafabric.hpe.com/72/MapRInstaller.html).

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

#### 1. About "keytool -noprompt -importcert" command

Please do not use this 👇 command in the original document:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias maprca -keystore ${JAVA_HOME}/lib/security/cacerts -storepass <store_password>
```

Instead, use the following command:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias maprca -cacerts -storepass <store_password>
```

If you use the Installer to install HPE Ezmeral Data Fabric on a fresh OS, then Installer will automatically install JDK 11, then "-storepass" password is "changeit".

There is another place in the documentation where keytool is used. The command is as follows:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias mosscert -keystore ${JAVA_HOME}/lib/security/cacerts -storepass changeit
```

You don't need to execute `keytool` twice to import the same **CA certificate** file.

I suggest you change "maprca" to something more recognizable.

For example, if you named the cluster "edf-cluster-a.mycompany.com" when you installed the HPE Ezmeral Data Fabric cluster, then you can use the following keytool command:

```shell
${JAVA_HOME}/bin/keytool -noprompt -importcert -file /opt/mapr/conf/ca/chain-ca.pem -alias edf-clustera-ca -keystore ${JAVA_HOME}/lib/security/cacerts - storepass <cacerts_truststore>
```

The file - /opt/mapr/conf/ca/chain-ca.pem, is a self-signed TLS certificate file created by the Installer when configuring wire-level encryption for the cluster.

Since it's a self-signed TLS certificate, the client (application, or your browser) will not be able to trust the TLS certificate of the server when accessing the HPE Ezmeral Data Fabric server.
This is because the CA certificate used by the self-signed TLS certificate is not publicly trusted.

In any scenario where a self-signed TLS certificate is used, you need to import the self-signed CA certificate into the OS system.

You can use the following command to look at things like CA certificates in your JVM:

```shell
keytool -list -v -cacerts
```

You should now see something like the following:

```dart
Alias name: digicertassuredidrootca
Creation date: Feb 2, 2023
Entry type: trustedCertEntry

Owner: CN=DigiCert Assured ID Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US
Issuer: CN=DigiCert Assured ID Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US
...
```

This is a recognized CA certificate issued by Digicert.

After you use `keytool` to import /opt/mapr/conf/ca/chain-ca.pem into the JVM, use keytool -list -v -cacerts to see something similar to the following:

```dart
Alias name: edf-clustera-ca
Creation date: Feb 16, 2023
Entry type: trustedCertEntry

Owner: CN=MapR Engineering Signing CA, OU=MapR Engineering Signing CA, O=MapR, DC=hpecorp, DC=net
Issuer: CN=MapR Engineering Root CA, OU=MapR Engineering Root CA, O=MapR, DC=hpecorp, DC=net
...
```

#### 2. About client software options

The documentation describes several client software that you can use to interact with the HPE Ezmeral Object Store. I would like to add the following clarification:

When using the `mc` command-line tool or the `s3cmd` command-line tool to interact with HPE Ezmeral Data Fabric Object Store without completing the configuration of "[Enabling S3 Virtual-Host-Style Requests](https://docs.datafabric.hpe.com/72/AdvancedInstallation/Enabling_object_store.html#concept_isb_53h_5bb__section_nnp_kr2_bvb)", some commands will not work properly.

In this case, for management operations, such as creating accounts, IAM accounts, buckets, etc., I recommend you use the `mc` command line tool.

For object listing, getting, putting, and deleting operations, I recommend you use `AWS CLI`.

#### 3. Cannot revert to HTTP mode after enabling HTTPS.

If the Object Store was installed using the Installer, the Object Store would also have security enabled, including HTTPS.

For example, although you can see the description below from HTTP Access to Object Store, this configuration change alone does not change Object Store to HTTP mode.

> To revert to http access, comment out the moss.certs.dir=/opt/mapr/conf line in the /opt/mapr/conf/moss.conf file.

☝from here - [HTTP Access to Object Store](https://docs.datafabric.hpe.com/72/AdvancedInstallation/Enabling_object_store.html#concept_isb_53h_5bb__section_bg1_zd1_vsb)
Additionally, there is nothing else in HPE Ezmeral Data Fabric's documentation on how to modify Object Store's TLS mode.
You may be able to find out how to turn off HTTPS from this document. 👉 [Using Custom Signed Certificates with Object Store](https://docs.datafabric.hpe.com/72/MapROverview/Object-Store-signed-certs.html)

### [](#create-a-bucket-in-hpe-ezmeral-data-fabric-object-store-and-upload-some-objects)Create a bucket in HPE Ezmeral Data Fabric Object Store and upload some objects

In order to create a bucket, you need to create an account, an IAM user, and finally a bucket in sequence.
While creating IAM user and bucket, you also need to prepare access policy control for who (IAM User) can perform which (list, get, put, etc.) operations on which bucket.

You can read the following document - [Entities and Resources](https://docs.datafabric.hpe.com/72/MapROverview/object_store_account_management.html) first to gain a deeper understanding of the entity model of HPE Ezmeral Data Fabric Object Store.

Below, I will demonstrate how to create the above-required entities.

#### Create an account

I choose to use the [mc](https://docs.datafabric.hpe.com/72/ReferenceGuide/mc-commands-overview.html) command line tool to create an account.

Before using the mc command line for the first time, you need to create an alias for your administrator.
An alias contains an access endpoint, such as "https://s3-us-west-1.amazonaws.com", which is an Amazon AWS S3 endpoint; another example is "http://10.10.88.198:9000", which is a Minio endpoint.
An alias also contains the access key and secret key used by your administrator or IAM User.

**1. You first use the "[mc alias list](https://docs.datafabric.hpe.com/72/ReferenceGuide/mc-alias-list.html)" command to view the default alias in the following systems.**

❗Note: If you are using self-signed TLS certificates or installed the cluster via Installer, you have to copy <ins>/opt/mapr/conf/ca/chain-ca.pem</ins> to <ins>~/.mc/certs/CAs/</ins> on the node running `mc`.
The reason for this step is the same as why you imported the self-issued CA to the keytool of the JVM earlier, `mc` also needs to import the self-issued CA to communicate with the S3server of the Object Store.

```shell
sudo -E -u mapr /opt/mapr/bin/mc alias list
```

Sample output:

```
gcs
  URL       : https://storage.googleapis.com
  AccessKey : YOUR-ACCESS-KEY-HERE
  SecretKey : YOUR-SECRET-KEY-HERE
  API       : S3v2
  Path      : dns

local
  URL       : http://localhost:9000
  AccessKey :
  SecretKey :
  API       :
  Path      : auto

play
  URL       : https://play.min.io
  AccessKey : XXXXXXXXXXXXXXXXXXXX
  SecretKey : XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  API       : S3v4
  Path      : auto

s3
  URL       : https://s3.amazonaws.com
  AccessKey : YOUR-ACCESS-KEY-HERE
  SecretKey : YOUR-SECRET-KEY-HERE
  API       : S3v4
  Path      : dns
```

**2. Generate S3 keys to authenticate your administrator**

The cluster administrator (typically the mapr user) must authenticate to the Object Store cluster and generate S3 keys (accessKey and secretKey) on the default Object Store account.
Perform this operation before performing any CLI operations in Object Store.

If the cluster is secure, use [maprlogin](https://docs.datafabric.hpe.com/72/SecurityGuide/ThemaprloginUtility.html) to authenticate the cluster administrator, and then generate the keys:

```shell
maprcli s3keys generate -domainname primary -accountname default -username mapr -json
```

🗒Note: An Object Store cluster has a domain, accounts, buckets, users, and access policies associated with it.
Installing Object Store in a cluster provides a primary domain and a default account.

Sample output:

```json
{
  "timestamp":1676472096994,
  "timeofday":"2023-02-15 10:41:36.994 GMT+0800 PM",
  "status":"OK",
  "total":1,
  "data":[
          {
            "accesskey":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "secretkey":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          }
  ]
}
```

🗒Note: If you encounter any problem when generating the S3 keys, refer to this page: [Generate S3 Keys to Authenticate Users and Applications](https://docs.datafabric.hpe.com/72/MapROverview/object-store-get-started.html#object-store-get-started__section_x4h_w13_4tb).

**3. Use the `mc alias set` command to create an alias for admin user**

```shell
mc alias set s3-admin-alias https://`hostname -f`:9000 {ACCESS_KEY} {SECRET_KEY} --api "s3v4" --path "off" --json
```

🗒Note: "s3-admin-alias" is the value of the alias parameter, you define it.
"https://`hostname -f`:9000" is the endpoint of the Object Store service.
Here, I'm running the command on the node that is running the S3server.
After created an alias, you would find the information is appended into <ins>$HOME/.mc/config.json</ins>.

**4. Create an account**

I chose to use the Object Store Web GUI to create an account.

Refer to this document - [Using the Object Store Interface](https://docs.datafabric.hpe.com/72/MapROverview/create-account.html#create_account__section_fsm_1hn_nrb).

Create an account using Object Store Web GUI - 1
<a href="https://ibb.co/SyW9MKK"><img src="https://i.ibb.co/XLNvKzz/Object-Store-Create-Account-1.png" alt="Object-Store-Create-Account-1" border="0"></a>

Enter the following in "Default Bucket Place":

```json
{
  "Version": "2012-10-17",
  "Statement": [
      {
        "Sid": "GrantAdminPutPermissions",
        "Effect": "Allow",
        "Principal": "arn:primary:default:user:mapr",
        "Action":"s3:PutObject",
        "Resource":"arn:aws:s3:::${bucket}/*"
      },
      {
        "Sid":"GrantAnonymousReadPermissions",
        "Effect":"Allow",
        "Principal": "*",
        "Action":["s3:GetObject"],
        "Resource":["arn:aws:s3:::${bucket}/*"]
      }
  ]
}
```

HPE Ezmeral Data Fabric Object Store is an on-premises object storage service compatible with Minio.
Some concepts such as Domain and Default Account do not exist in public cloud object storage services such as AWS S3.
But the policy for bucket and IAM user is compatible with the policy in public cloud object storage.
For the Bucket Policy here, you can refer to AWS S3 [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) and HPE Ezmeral Data Fabric Object Store document - [Access Policies](https://docs.datafabric.hpe.com/72/MapROverview/object-store-policies.html).

After creating the user account, you can use the below command to view it:

```shell
sudo -u mapr /opt/mapr/bin/mc admin account list {ADMIN_ALIAS} domain=primary --json
```

Sample output:

```json
{
 "name": "default",
 "id": 0,
 "admin": "mapr",
 "labelname": "default",
 "minrepl": 2,
 "desiredrepl": 3,
 "usercount": 2
}
{
  // # 👇 The account you just created.
 "name": "s3test",
 "id": 1,
 "admin": "mapr",
 "def_bucket_policy": {
  "Version": "2012-10-17",
  "Statement": [
   {
    "Sid": "GrantAdminPutPermissions",
    "Effect": "Allow",
    "Principal": {
     "AWS": [
      "arn:primary:default:user:mapr"
     ]
    },
    "Action": [
     "s3:PutObject"
    ],
    "Resource": [
     "arn:aws:s3:::${bucket}/*"
    ]
   },
   {
    "Sid": "GrantAnonymousReadPermissions",
    "Effect": "Allow",
    "Principal": {
     "AWS": [
      "*"
     ]
    },
    "Action": [
     "s3:GetObject"
    ],
    "Resource": [
     "arn:aws:s3:::${bucket}/*"
    ]
   }
  ]
 },
 "size": 22871,
 "labelname": "default",
 "topology": "/data/default-rack",
 "minrepl": 1,
 "desiredrepl": 1,
 "usercount": 1,
 "bucketcount": 1
}
```

#### Create an IAM User in the non-default account just created

In step 4, you created a non-default account named "s3test".
In HPE Ezmeral Data Fabric Object Store, you must create a non-default account to create an IAM user, and you should use the IAM User to operate buckets.

```shell
sudo -u mapr /opt/mapr/bin/mc admin user add s3-admin-alias s3-test-iam_user account=s3test domain=primary
```

🗒Note: "s3-admin-alias" is the admin alias you created in step-3, and "s3-test-iam_user" is the IAM User name.
For more information, refer to: [Create IAM Users](https://docs.datafabric.hpe.com/72/MapROverview/create-IAM-user.html).

Next, you create an IAM policy for the IAM User - s3-test-iam_user.

```shell
cat <<'EOF' > ./PolicyPublicRead.json
{
    "Version":"2012-10-17",
    "Statement": [
        {
            "Sid":"GrantAnonymousReadPermissions",
            "Effect":"Allow",
            "Principal": "*",
            "Action":["s3:GetObject"],
            "Resource":["arn:aws:s3:::${bucket}/*"]
        }
    ]
}
EOF
```

```shell
mc admin policy add s3-admin-alias PolicyPublicRead ./PolicyPublicRead.json account=s3test domain=primary
```

🗒Note: "PolicyPublicRead" is the IAM Policy's name.

You can also use the Object Store Web GUI to create the IAM Policy, like shown in the following screenshot👇.

<a href="https://ibb.co/xsH1nYH"><img src="https://i.ibb.co/n0C7XBC/Object-Store-Create-IAMPolicy-1.png" alt="Object-Store-Create-IAMPolicy-1" border="0"></a>

Let's create another IAM policy named "GrantbucketOperations"👇.
You will associate these 2 IAM Policies to the IAM User - "s3-test-iam_user" later.

```json
{
    "Version": "2012-10-17",
    "Statement":
    [
        {
            "Effect": "Allow",
            "Action":
            [
                "s3:ListAllMyBuckets",
                "s3:CreateBucket",
                "s3:GetBucketLocation"
            ],
            "Resource":
            [
                "arn:aws:s3:::*"
            ]
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::s3-test-iam-user-bucket/*"
        },
        {
            "Effect": "Allow",
            "Action":
            [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::s3-test-iam-user-bucket/*"
        }
    ]
}
```

To associate an IAM Policy to an IAM User:

```shell
sudo -u mapr /opt/mapr/bin/mc admin policy set s3-admin-alias PolicyPublicRead users='s3-test-iam_user' account='s3test' domain='primary'
sudo -u mapr /opt/mapr/bin/mc admin policy set s3-admin-alias GrantBucketOperations users='s3-test-iam_user' account='s3test' domain='primary'
```

#### Create a bucket for the IAM user

First, you need to generate the access key and secret key for the IAM User - "s3-test-iam_user".

```shell
sudo -u mapr maprcli s3keys generate -domainname primary \
  -accountname s3test \
  -username 's3-test-iam_user'
```

☝Then you would get the access key and secret key for the IAM User - "s3-test-iam_user".

```shell
sudo -u mapr mc alias set s3-test-iam_user-alias https://`hostname -f`:9000 \
{ACCESS_KEY} \
{SECRET_KEY} \
--api "s3v4" --path "off" --json

sudo -u mapr mc mb --account s3test --ignore-existing --disable-versioning --json s3-test-iam_user-alias/s3-test-iam-user-bucket
```

☝Now you have created a Bucket named "s3-test-iam-user-bucket" using the IAM User - "s3-test-iam_user".
Because "s3-test-iam_user" is inside account - "s3test", the Bucket will be also placed under account - "s3test".

To list Buckets using the `mc` command:

```shell
/opt/mapr/bin/mc ls --account s3test --versions --recursive --summarize --json s3-test-iam_user-alias
```

Sample output:

```json
{
 "status": "success",
 "type": "folder",
 "lastModified": "2023-02-16T15:22:16+08:00",
 "size": 23897893980,
 "key": "s3-test-iam-user-bucket/",
 "etag": "",
 "url": "https://m2-maprts-vm197-172.mip.storage.hpecorp.net:9000/",
 "versionOrdinal": 1
}
{
"totalObjects": 1,
"totalSize": 23897893980
}
```

#### Install the AWS CLI and put an file into the Bucket

To install the AWS CLI, refer to this Amazon AWS document 👉 [Installing or updating the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

Then you create a profile for the IAM User:

```shell
export AWS\_CA\_BUNDLE=/opt/mapr/conf/ca/chain-ca.pem
aws configure --profile s3-test-iam_user-ray-2-objstor
```

❗Note: Before using the AWS CLI, remember to export the environment AWS\_CA\_BUNDLE=/opt/mapr/conf/ca/chain-ca.pem.
Otherwise AWS CLI cannot communicate with S3server because S3server is using self-signed TLS certificates.

After inputting the above command, the AWS CLI will ask you to input the access key and secret key.
After the profile is created, the information will be stored at <ins>$HOME/.aws/config</ins> and <ins>$HOME/.aws/credentials</ins>.

Use the below command to list Buckets:

```shell
aws s3api list-buckets --endpoint-url https://`hostname -f`:9000 --profile s3-test-iam_user-ray-2-objstor
```

Use the below command to put a file into the Bucket:

```shell
aws s3api put-object --bucket s3-test-iam-user-bucket --key 'testdir/s3-test-iam-user-dir/hpe-cp-rhel-release-5.5.1-3083.bin' --body 'downloads/hpe-cp-rhel-release-5.5.1-3083.bin' --endpoint-url https://m2-maprts-vm197-172.mip.storage.hpecorp.net:9000 --profile s3-test-iam_user-ray-2-objstor
```

🗒Note: "s3-test-iam-user-bucket" is the Bucket's name that you created before.
"testdir/s3-test-iam-user-dir/hpe-cp-rhel-release-5.5.1-3083.bin" is the path that you want to put into the Bucket.
The part of "testdir/s3-test-iam-user-dir/" indicates it's under this directory, if the directory doesn't exist, it will be created.
"downloads/hpe-cp-rhel-release-5.5.1-3083.bin" is the local file path that you want to put into the Bucket.

## Create an Cold-Tiered Volume and offlad to remote Object Store

So, now we are going to create a Volume on another cluster and configure the Cold Tier remote target for this Volume.
Then we will manually offload the data in this Volume to the remote HPE Ezmeral Data Fabric Object Store.

### Create a Cold-Tiered Volume by Web GUI

First of all, you need to log in to MCS, and enter the following positions in turn at the top of the screen: Data --> Volumes👇

<a href="https://ibb.co/1Zg5RXN"><img src="https://i.ibb.co/2q9QcMr/Create-Cold-Tier-Volume-1.png" alt="Create-Cold-Tier-Volume-1" border="0"></a>

Then click "Create Volume" at the top of the screen👇.

<a href="https://ibb.co/T8SV1Mt"><img src="https://i.ibb.co/cFHGwhQ/Create-Cold-Tier-Volume-2.png" alt="Create-Cold-Tier-Volume-2" border="0"></a>

Fill in the necessary information, you can refer to this document 👉 [Creating a Volume](https://docs.datafabric.hpe.com/72/ClusterAdministration/data/volumes/CreateVols.html).

Turn on the "Data Tiering" switch and select "Remote Archiving(Cold)". Refer to the figure below to fill in the remote target information:

<a href="https://ibb.co/cyy3cWt"><img src="https://i.ibb.co/3TTdyxW/Create-Cold-Tier-Volume-3.png" alt="Create-Cold-Tier-Volume-3" border="0"></a>

* URL: The host where the S3server of the remote HPE Ezmeral Data Fabric cluster is located, and the port number is the default port 9000 of the S3server.
* Bucket: The Bucket created for IAM User in previous steps.
* Access key and secret key: The keys of the IAM User created in the previous step.

### Configure the CA certificate of the remote Object Store for the MAST Gateway of the local cluster

You should remember that in the earlier steps, we configured the CA certificate of the Object Store's self-signed TLS certificate for the JDK keystore as well as the mc command line tool and the AWS CLI.

Now we also need to configure this self-signed CA root certificate for MAST Gateway so that it can communicate with the remote Object Store.

Refer to this document - [Configuring the MAST Gateway Service](https://docs.datafabric.hpe.com/72/StorageTiers/ConfigMASTGateway.html), set the value of "mastgateway.curl.cainfo" in the configuration file.

You need to find <ins>/opt/mapr/conf/ca/chain-ca.pem</ins> from a host of the Object Store cluster first, and copy it to the MAST Gateway node.
For the convenience of management, you can rename it appropriately and configure it as the value of "mastgateway.curl.cainfo".

### Use the maprcli volume offload command to manually offload data

Now you can place some data in the Cold-Tiered Volume you just created. 
I put a 5.6GB file in it.

Then, you can use the following command to manually trigger the offload of the entire Volume.

```shell
maprcli volume offload -ignorerule true -name {VOLUME_NAME}
```

Then, you can use the following command to monitor the offload status.

```shell
watch 'maprcli volume tierjobstatus -name {VOLUME_NAME} -json'
```

🗒Note: the `watch` will execute the following string as a command every 2 seconds.

When the offload is complete, you will see the following output.

```json
{
    "timestamp": 1676564889008,
    "timeofday": "2023-02-17 12:28:09.008 GMT+0800 AM",
    "status": "OK",
    "total": 1,
    "data":
    [
        {
            "offload":
            {
                "state": "Success",
                "progress": "100%",
                "startTime": "2023-02-17 00:22:47.352 GMT+0800",
                "endTime": "2023-02-17 00:27:00.014 GMT+0800",
                "offloadedDataSize": "5697.702 MB",
                "gateway": "10.163.173.99:8660"
            }
        }
    ]
}
```

## Summary

In this article, I have demonsrated how to create a bucket in HPE Ezmeral Data Fabric Object store and upload data using the AWS CLI command line tool.
Then, I showed you how to create a cold-tiered volume and configure it to use the remote Object Store as a remote target.
Finally, I showed you how to manually trigger a volume data offload to verify that the whole work is populated.
I hope this article was helpful to you. Catch you next time!