---
title: HPE iLOrest as a PyPi package
date: 2024-04-28T07:52:27.643Z
featuredBlog: false
priority: 8
author: Rajeevalochana Kallur
authorimage: /img/rajeev_new.jpg
disable: false
tags:
  - REST
  - iLOrest
  - PyPi
  - ilo-restful-api
---
<style>
li {
   font-size: 15px;
   line-height: 33px;
   max-width: none;
}
</style>

The HPE iLOrest tool has been repackaged into both source and binary distributions and is now available on [pypi.org](https://pypi.org/project/ilorest/). This means it can be easily utilized on any operating system that has Python 3 installed. The intention is for the pypi package to replace the existing builds for macOS, Debian and Ubuntu distributions of HPE iLOrest.

Here are the steps to install HPE iLOrest from [pypi.org](https://pypi.org/project/ilorest/):

1. Ensure that [Python 3](https://www.python.org/downloads/) is installed on your operating system.
2. Check if pip3 is installed. If not, on Ubuntu or Debian, you can run:

   ```shell
   $ sudo apt install python3-pip 
   ```

      On Linux, you can use:

   ```shell
   $ wget  https://bootstrap.pypa.io/get-pip.py
   ```
3. In most cases, pip3 will already be available on macOS and Microsoft Windows.
4. Once pip3 is available, execute the following command:

   ```shell
   $ pip3 install ilorest
   ```
5. With the PyPi package installation, [ilorest_chif.dll/.so](https://developer.hpe.com/blog/chif-driver-not-found/) will also be installed in site-packages.
6. Verify local login by running

   ```shell
   $ iLOrest -v login
   ```
7. You can check the location of iLOrest using the command:
   ```shell 
   $ find / -name iLOrest
   ```
   
NOTES:

- PyPi package can also be used for ARM-based operating systems if [Python 3](https://www.python.org/downloads/) is present.

- Additionally, the HPE iLOrest PyPi package can be utilized on RHEL, SLES and Microsoft Windows platforms as long as [Python 3](https://www.python.org/downloads/) is installed (preferably version > 3.8).
   

- DMTF's [redfish](https://pypi.org/project/redfish/) library can not coexist with HPE [python ilorest library](https://pypi.org/project/python-ilorest-library/) which is a dependency for the HPE iLOrest PyPi package. So, make sure to remove the [redfish](https://pypi.org/project/redfish/) library using the command below:

   ```shell
   $ pip3 uninstall redfish
   ```

- In a air-gapped environment, the PyPi package can be downloaded from [pypi.org](https://pypi.org/project/ilorest/) and installed using the following command. Dependencies will need to be installed separately.

   ```shell
   $ pip3 install <path to the downloaded pypi package>
   ```



