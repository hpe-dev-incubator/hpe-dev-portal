<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>
---
title: iLORest as a Pypi package
date: 2024-04-28T07:52:27.643Z
featuredBlog: false
priority: 8
author: Rajeevalochana Kallur
authorimage: /img/rajeev_new.jpg
disable: false
tags:
  - REST
  - iLORest
  - Pypi
  - ilo-restful-api
---

The ILORest tool has been repackaged into both source and binary distributions and is now available on pypi.org. This means it can be easily utilized on any operating system that has Python 3 installed. The intention is for the pypi package to replace the existing builds for MAC, DEB, and Ubuntu distributions of ILORest.

Here are the steps to install ILORest from pypi.org:

1. Ensure that Python 3 is installed on your operating system.
2. Check if pip3 is installed. If not, on Ubuntu/Debian, you can run:

   ```shell
   $ sudo apt install python3-pip 
   ```

      On Linux, you can use:

   ```shell
   $ wget  https://bootstrap.pypa.io/get-pip.py
   ```
3. In most cases, pip3 will already be available on MAC and Windows.
4. Once pip3 is available, execute the following command:

   ```shell
   $ pip3 install ilorest
   ```
5. With the Pypi package installation, ilorest_chif.dll or ilorest_chif.so will also be installed in site-packages.
6. Verify local login by running

   ```shell
   $ ilorest -v login
   ```
7. You can check the location of ilorest using the command:
   ```shell 
   $ find / -name ilorest
   ```
   
NOTES:

- Pypi package can also be used for ARM-based operating systems if Python 3 is present.

- Additionally, the ILORest pypi package can be utilized on RHEL, SLES, and Windows platforms as long as Python 3 is installed (preferably version > 3.8).

- In a air-gapped environment, the pypi package can be downloaded from pypi.org and installed using the following command. Dependencies will need to be installed separately.

   ```shell
   $ pip3 install <path to the downloaded pypi package>
   ```



