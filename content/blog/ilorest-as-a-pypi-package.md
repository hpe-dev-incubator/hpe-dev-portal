---
title: HPE iLOrest as a PyPI package
date: 2024-05-15T07:52:27.643Z
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
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

Good news!!! The HPE iLOrest tool has been repackaged into both source and binary distributions and is now available on [PyPI](https://pypi.org/project/ilorest/). This means it can be easily utilized on any operating system that has Python 3 installed. The intention is for the PyPI package to replace the existing builds for macOS, Debian and Ubuntu distributions of HPE iLOrest.

Here are the steps to install HPE iLOrest from [PyPI](https://pypi.org/project/ilorest/):

1. Ensure that [Python 3](https://www.python.org/downloads/) is installed on your operating system.

2. Check if pip3 is installed. If not, on Ubuntu or Debian, you can run the following command:

   ```shell
   $ sudo apt install python3-pip 
   ```

   On Linux, you can use:

   ```shell
   $ wget  https://bootstrap.pypa.io/get-pip.py
   ```

3. In most cases, pip3 will already be available on macOS and Microsoft Windows.

4. Once `pip3` is installed, and before installing HPE iLOrest, make sure the DMTF Redfish Library is not installed, as mentioned in the <a href="(https://servermanagementportal.ext.hpe.com/docs/redfishclients/python-redfish-library/installationguide/#pip-install" target="_blank">HPE iLOrest user guide</a> and then install the HPE iLOrest PyPi package using the following commands:

      ```shell
      $ pip3 uninstall redfish
      $ pip3 install ilorest
      ```

5. With the PyPi package installation, [ilorest_chif.dll/.so](https://developer.hpe.com/blog/chif-driver-not-found/) will also be installed in site-packages.
6. If you installed the HPE iLOrest PyPI package on an iLO based server you can verify the local (in-band) login by running:

   ```shell
   $ iLOrest -v login
   ```

7. You can check the location of iLOrest using the command:
   ```shell 
   $ find / -name iLOrest
   ```
   
## Notes:

* PyPI package can also be used for ARM-based operating systems if [Python 3](https://www.python.org/downloads/) is present.

* Additionally, the HPE iLOrest PyPI package can be utilized on RHEL, SLES and Microsoft Windows platforms as long as [Python 3](https://www.python.org/downloads/) is installed (preferably version > 3.8).

* DMTF's [Redfish](https://pypi.org/project/redfish/) library can not coexist with HPE [Python ilorest library](https://pypi.org/project/python-ilorest-library/) which is a dependency for the HPE iLOrest PyPI package. So, make sure to remove any [Redfish](https://pypi.org/project/redfish/) library you may have installed prior to installing the HPE Python iLOrest library using the command shown below:


   ```shell
   $ pip3 uninstall redfish
   ```

* In an air-gapped environment, the HPE iLOrest PyPI package can be downloaded from the <a href="https://pypi.org/project/ilorest/" target="_blank">PyPI repository</a> and installed using the following command. Dependencies may need to be installed separately.

   ```shell
   $ pip3 install <path to the downloaded PyPI package>  
   ```
  
* To perform a clean removal of the HPE iLOrest PyPI package, don't forget to uninstall the associated Python library as mentioned in the following command:

   ```shell
   $ pip3 uninstall --yes python-ilorest-library ilorest  
   ```
  
## Summary:

By following the instructions I've outlined above, you can simplify the installation of and start using the HPE iLOrest tool on PyPI rather than using rpm or msi. It's really quick and easy to get started. For more information on HPE iLO, along with some tips and tricks in working with it, make sure you check out the HPE [Developer](https://developer.hpe.com/blog/) blog regularly.



