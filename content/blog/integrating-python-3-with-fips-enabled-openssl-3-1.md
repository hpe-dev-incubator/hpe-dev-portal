---
title: Integrating Python 3 with FIPS enabled OpenSSL 3.1
date: 2023-04-23T13:41:41.795Z
featuredBlog: true
author: Rajeevalochana Kallur
authorimage: /img/rajeev_new.jpg
disable: false
---
Introduction
Federal Information Processing Standard (FIPS) are a set of encryption algorithms and is mandatory in all computer systems and software used by non-military American government agencies, government contractors, and vendors who work with the agencies. Whenever new software is developed, it needs to be FIPS-compliant. Thus, there is a need to enable Python with FIPS, but the default Python package comes without FIPS, as shown in screenshot below.