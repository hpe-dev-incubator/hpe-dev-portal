---
title: "Architecting the World’s Largest Biometric Identity System: The Aadhaar Experience"
date: 2021-01-07T23:06:37.255Z
author: Michele Nemschoff 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Michele Nemschoff",
"publish": "2015-02-13T08:00:00.000Z",
"tags": "use-case"
```

---

Dr. Pramod Varma, Chief Architect and Technology Advisor to Unique Identification Authority of India (UIDAI), gave an informative talk titled “Architecting World's Largest Biometric Identity System - Aadhaar Experience” at the Strata + Hadoop World 2014 conference held in New York.

Dr. Varma began his talk by talking about why the Aadhaar project was created. In India, the inability to prove one’s identity is one of the biggest barriers that prevents the poor from accessing benefits and subsidies. India is a country with 1.2 billion residents in over 640,000 villages. The Indian government spends $50 billion on direct subsidies (food coupons for rice, cooking gas, etc.) every year. Both public and private agencies in India require proof of identity before providing services or benefits to those living in India.

Until the introduction of the Aadhaar program, there was no verifiable identity number program that both residents and agencies could use. As a result, every time Indian residents tried to receive benefits, they had to undergo an arduous personal identification process. What made it even more difficult was that the various service providers had different document and information requirements. This made it especially hard for India’s poor residents, who often lacked documentation and found it difficult to access services.

The <a target='\_blank'  href='http://en.wikipedia.org/wiki/Unique_Identification_Authority_of_India'><u>Unique Identification (Aadhaar) project</u></a> was created in order to provide every resident of India with a unique identification number that can be used to access a variety of services and benefits. The project enables residents in India to receive food coupons, receive cooking gas deliveries, open checking accounts, apply for loans, insurance, pensions, property deeds, etc. In addition, the program makes it possible for the Indian government to make sure that welfare benefits go directly to the right person.

They are using MapR to build the project’s biometric database (the largest in the world), which can verify a person’s identity within 200 milliseconds. The database includes an iris scan, digital fingerprints, a digital photo, and text-based data for every resident.

The uniqueness of an Aadhaar identity makes it possible to eliminate fake and duplicate accounts, and the online authentication system provides a mechanism for the paperless, electronic and instantaneous verification of a person’s identity. Currently, over 690 million Aadhaars (IDs) have been issued so far, with 10 million new IDs issued every 10 days. The target is to complete 1 billion IDs by 2015.

![Aadhaar Project ID Number](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/aadhaar-number-id-1610061218903.png)

**Architecture at a Glance**

The entire technology architecture behind Aadhaar is based on principles of openness, linear scalability, strong security, and most importantly vendor neutrality. The backbone of the Aadhaar technology was developed using the following principles:

**Open architecture** – Building the Aadhaar system with true openness meant that they relied on open standards to ensure interoperability; the platform approach with open APIs made it possible for the ecosystem to build on top of Aadhaar APIs; vendor neutrality was ensured across the application components by using open and standard interfaces. The identity system was designed to work with any device, any form factor, and on any network.

**Design for scale** – The Aadhaar system is expected to issue more than 1.2 billion identities, and will continue to grow as the resident population expands. Since every new enrollment requires biometric de-duplication across the entire system, every component needs to scale to very large volumes. This meant that the system needed to be able to handle hundreds of millions of transactions across billions of records doing hundreds of trillions of biometric matches every day. In addition all online services such as Aadhaar authentication, e-KYC services, and update services must work with high availability and sub-second performance. In order to achieve such massive scalability, the program established network and data center load balancing and a multi-location distributed architecture for horizontal scale.

**Data Security** – The security and privacy of one’s data is a foundation of the Aadhaar system. The system uses 2048-bit PKI encryption and tamper detection using HMAC in order to ensure that no one can decrypt and misuse the data. Resident data and raw biometrics are always kept encrypted, even within UIDAI data centers. In addition, the system does not keep track of any transactional data.

**Enrollment**

Since the Aadhaar system launched four years ago, the Aadhaar platform has grown in capability. Over 690 million Aadhaar numbers have been issued so far using the system, making it the largest biometric identity repository in the world, resulting in 600+ trillion biometric matches every day. They are on target to complete 1 billion Aadhaars by 2015.

The amount of biometric data that is collected per person is approximately 3-5MB per person, which maps to a total of 10-15 petabytes of data.

60,000-80,000 small laptops that include the installed Aadhaar system are used in remote villages. Laptops, generators, chairs and tables are transported to the villages via donkeys, and the systems are then set up in each camp. There are currently 150,000 certified operators and supervisors who are trained and certified to operate the enrollment station. On average, each station enrolls about 50 people per day, resulting in approximately 1 million new enrollments every day.

**Authentication**

The Aadhaar authentication system provides multi-factor authentication, based on “what you have” (something the user uniquely has, such as a mobile phone or laptop that accesses email, etc.) and “who you are” using resident fingerprints patterns, iris scans, a signature, or handwriting. By combining one or more factors, the resident’s authentication could be strengthened. In addition, Authentication User Agency (AUA)-specific factors such as ATM cards or smart cards or passwords may also be used in conjunction with Aadhaar authentication to further strengthen user authentication.

![Aadhaar project server provider](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/aadhaar-project-server-provider-1610061236041.png)

_Authentication Overview_

**Aadhaar in Action**

![Aadhaar in action](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/aadhaar-action-1-1610061249888.png)

**Payments through micro ATMs**

![Aadhaar project in action](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/aadhaar-action-2-1610061264885.png)

**Future Plans**

Future plans call for Aadhaar to be used for digital signatures, electronic documents and digital locker services. Also, Aadhaar could also be used for college/university certificates, as well as credit registries. Dr. Varma emphasized that the Aadhaar system is a great example of using Hadoop technology to make a difference to every resident of India. The Aadhaar identity platform and Aadhaar-enabled applications are helping a billion people in India to participate in the digital economy, and benefit from government, public and private sector services that are tailored to them.