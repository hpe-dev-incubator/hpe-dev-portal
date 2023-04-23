---
title: Integrating Python 3 with FIPS enabled OpenSSL 3.1
date: 2023-04-23T13:41:41.795Z
featuredBlog: true
author: Rajeevalochana Kallur
authorimage: /img/rajeev_new.jpg
disable: false
tags:
  - openssl
  - python
  - fips
---
## Introduction

Federal Information Processing Standard (FIPS) are a set of encryption algorithms and is mandatory in all computer systems and software used by non-military American government agencies, government contractors, and vendors who work with the agencies. Whenever new software is developed, it needs to be FIPS-compliant. Thus, there is a need to enable Python with FIPS, but the default Python package comes without FIPS, as shown in screenshot below.

![](/img/openssl-before.jpg)

This blog will explain step-by-step how to integrate Python 3 with the FIPS enabled OpenSSL 3.1 on  Microsoft Windows so that any new software compiled out of it is FIPS-compliant.

## 
STEPS for Microsoft Windows

## 
Step 1 Download your OpenSSL source and FIPS source from http://www.openssl.org and the Python source from http://www.python.org.

## 
Step 2 Install NASM and Perl Software and add to PATH

## 
Step 3 Install these 2 Perl modules using the commands below.

## 
`cpan -i Text::Template  
cpan -i Test::More   `

## 
Step 4 Create directory structure like below

## 
C:\SSLout\SSL, C:\SSLout\DLL\x64\Release, C:\SSLout\Lib

## 
Step 5 Unzip OpenSSL tar.gz file into C:\work\openssl-3.1.0

## 
Step 6 Build OpenSSL module using VC++ 2015 x64 the Native Tools Command prompt.

## 
`cd openssl-3.1.0 
Perl Configure VC-WIN64A --prefix=C:\SSLout\DLL\x64\Release --openssldir=c:\SSLout\SSL enable-fips
nmake
nmake install_sw 
nmake install_ssldirs 
nmake install_docs 
nmake install_fips `

## 
The OpenSSL 3.1 binaries are generated be in the C:\SSLout\DLL\x64\Release\bin.  This is shown as below