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

## Steps for Microsoft Windows

Step 1 Download OpenSSL source and FIPS source from `http://www.openssl.org` and the Python source from `http://www.python.org`.

Step 2 Install NASM and Perl Software and add to PATH

Step 3 Install these 2 Perl modules using the commands below.

> `cpan -i Text::Template`\
> `cpan -i Test::More`

Step 4 Create directory structure like below

> `C:\SSLout\SSL`\
> `C:\SSLout\DLL\x64\Release`\
> `C:\SSLout\Lib`

Step 5 Unzip `openssl-3.1.0.tar.gz` file into `C:\work\openssl-3.1.0`

Step 6 Build OpenSSL module using VC++ 2015 x64 the Native Tools Command prompt.

> `cd openssl-3.1.0`\
> `Perl Configure VC-WIN64A --prefix=C:\SSLout\DLL\x64\Release --openssldir=c:\SSLout\SSL enable-fips`\
> `nmake`\
> `nmake install_sw`\
> `nmake install_ssldirs`\
> `nmake install_docs`\
> `nmake install_fips`

The OpenSSL 3.1 binaries are generated be in the `C:\SSLout\DLL\x64\Release\bin`.  

This is shown as below

![](/img/openssl_directory_structure.jpg)

Step 7 Unzip Python in Windows to `C:\work\Python311` and go into `C:\work\Python-3.11.2\PCBuild`.  

Run `get_externals.bat` file.  This will fetch the dependencies from internet into externals directory. Now create `openssl-bin-3.1.0` directory under `externals` directory as below.

Step 8 Under `externals` directory, create `amd64` depending on the CPU architecture and 
copy the as files to it as below.

> copy `C:\SSLout\DLL\x64\Release\lib\libcrypto.lib` and `libssl.lib` to `openssl-bin-3.1.0\amd64`\
> copy `C:\SSLout\DLL\x64\Release\bin\*.*` to `openssl-bin-3.1.0\amd64`\
> copy `C:\SSLout\DLL\x64\Release\include` directory to `openssl-bin-3.1.0\amd64`\
> copy `C:\SSLout\DLL\x64\Release\include\openssl\applink.c` to `openssl-bin-3.1.0\amd64\include`\
> copy `C:\SSLout\DLL\x64\Release\lib\ossl-modules\*.*` to `openssl-bin-3.1.0\amd64`

Step 9 Modify `PCbuild/openssl.props` as shown below:

![](/img/openssl_settings.jpg)

Step 10 Open `PCbuild/python.props` and change the entries as shown below:

![](/img/openssl_settings2.jpg)

Step 11 Open Python Solution under `PCbuild/pcbuild.sln` in VS 2015.
Change the Link settings of `_hashlib` and `_ssl` projects under Python as shown below:

![](/img/openssl_vs_settings.jpg)

Step 12 Now, build `_hashlib.pyd` and `_ssl.pyd` in VS 2015.
Step 13 Copy these built .pyd files from `\PCbuild\amd64\` to a Python binary installation directory `C:\python311\DLLs`.
Step 14 Start Python and use these commands to check the OpenSSL 3.1 version.

![](/img/openssl-after.jpg)

Step 15 Now, to run Python with FIPS enabled OpenSSL, create `openssl.cnf` and `fipsmodule.cnf` file using the below content in `C:\Python311` directory. By using this config file, FIPS will be enabled by default.

> #### openssl.cnf:
>
> config_diagnostics = 1\
> openssl_conf = openssl_init\
> .include .\fipsmodule.cnf\
> \[openssl_init]
> providers = provider_sect\
> alg_section = algorithm_sect\
> \[provider_sect]\
> fips = fips_sect\
> legacy = legacy_sect\
> base = base_sect\
> default = default_sect\
> \[base_sect]\
> activate = 1\
> \[legacy_sect]\
> activate = 1\
> \[default_sect]\
> activate = 1\
> \[algorithm_sect]\
> default_properties = fips=yes
>
> #### fipsmodule.cnf:
>
> \[fips_sect]\
> activate = 1\
> conditional-errors = 1\
> security-checks = 1\
> module-mac = D4:64:00:E3:CE:34:EE:CE:58:32:12:08:21:6D:64:FD:E3:A6:D4:F0:E6:38:3D:2C:0C:40:1B:50:C8:8F:39:A3

Step 16 Now open command windows as Administrator and execute 

> `set OPENSSL_CONF=C:\Python311\openssl.cnf` 

Step 17 To verify python is enabled with FIPS, both client and server needs to be FIPS mode. Client Windows OS need to be enabled with FIPS with these 2 steps.

> 1. Open `gpedit.msc` on run menu and navigate to `Computer Configuration\Windows Settings\Security Settings\Local Policies\Security Options` and enable the `System cryptography: Use FIPS compliant algorithms for encryption, hashing, and signing` setting.   
> 2. Open `regedit` on run menu and go to `HKLM\System\CurrentControlSet\Control\Lsa\FipsAlgorithmPolicy\Enabled` and set Enabled to 1.

Step 18 To verify python is enabled with FIPS, run the following commands. 

![](/img/openssl_fips_algo.jpg)

Note that the list crypto algorithms available are more than the crypto algorithms guaranteed.  But all algorithms can be used if Server where Client SSL is connecting is also configured in FIPS mode. 

The living example for OpenSSL Server is HPE iLO. 

Voila!!...  Now Python 3.11 is integrated with OpenSSL 3.1 enabled FIPS in Windows Platform.  This Python installation can be used to develop applications which are OpenSSL3/FIPS enabled!!

## Summary

In this blog, I have covered the following steps regarding integrating Python 3 with FIPS enabled OpenSSL 3.1:

* Download the required packages. 
* Compile both OpenSSL along with FIPS.
* Make required changes and compile Python along with OpenSSL 3.1 binaries copied as external dependency.
* Copy the newly generated binaries to the Python installation directory.
* Test the OpenSSL version in Python and also verify if it is FIPS is enabled.  

I hope this blog is useful to the entire developer community!! Make sure you check out our other blog posts on [HPE DEV](https://developer.hpe.com/blog/) for more useful tutorials.