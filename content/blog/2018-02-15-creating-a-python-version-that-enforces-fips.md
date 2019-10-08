---
title: Creating a Python version that enforces FIPS
date: 2018-02-15T18:04:25.100Z
author: Matthew Kocurek - iLOREST Developer 
tags: ["ssl","ilo-restful-api","redfish","openssl","python","ilo","fips",""]
path: creating-a-python-version-that-enforces-fips
---
# **Creating a Python version that enforces FIPS**


Version 2.2 and later of our python-redfish-utility can enforce the FIPS mode of the operating system it is used on. If an OS is in FIPS mode, but uses a non-FIPS encryption algorithm, Python will crash. If used with a FIPS-validated module such as the OpenSSL FIPS module, a project can be FIPS-compliant. By default, Python does not ship with a FIPS version of OpenSSL, so we must build Python from source to meet the OpenSSL FIPS requirement. In this blog post, we cover building Python 2.7 from source with a FIPS version of OpenSSL in Windows and Linux. In addition, we provide instructions for adding extra functions to the Python SSL library to set and get the OpenSSL FIPS mode.
 **Patching Python with our FIPS mode functions**

Before building Python from source, we must add extra functions so we can get and set OpenSSL FIPS mode. To add this functionality, we must change the `_ssl.c` and `ssl.py` source files. A patch file that adds the required functions is available [here] (https://github.com/HewlettPackard/python-redfish-utility/tree/master/patches)

 **Building Python in Linux**

When you build Python from source, it uses the version of OpenSSL on the local system. If you already have a FIPS version of OpenSSL that you are comfortable with, you can use that. If not, you must update OpenSSL. You can also install an alternate version of OpenSSL and use it with some modifications to the Python setup files. Use an OpenSSL version with shared objects, because that is what Python uses to build its `pyd` and 
`lib` files.

Once you have the OpenSSL you want on the system, you can install Python with the required modifications. If you are using an OpenSSL FIPS from `/usr/local/ssl/`, you do not need to modify the setup files. If you are using an alternate installation of OpenSSL or one in a different location, changes are required. You must configure Python with the location of the OpenSSL `include` and `lib` files in the `setup.py` file. Additionally, you must configure Python with the OpenSSL location, and uncomment code in the `Modules/Setup.dist file. The following example shows a patch file with the required changes. The file locations differ based on the location of the OpenSSL version you want to use.



![7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/7-1518719833337.png)

After the required changes are complete (if any), we can build Python just as we normally would. Once Python is successfully installed, you can use the extra SSL functions to enable FIPS mode in OpenSSL. **Building Python in Windows**

Windows does not come with a version of OpenSSL, which complicates things. Each installation of Python on Windows comes with its own non-FIPS version of OpenSSL, so we will use our own. To make things even more interesting, Python 2.7 only has Visual Studio projects up to 9.0 (Visual Studio 2008 Professional). The easiest way to get the required runtimes is to build using this version of Visual Studio. If using this version is not an option, and you need a more recent version, there are resources available to describe how to do that.

To begin, we must build a FIPS version of OpenSSL in Windows. Make sure that you build OpenSSL with shared objects, because that is what Python uses to build its pyd and lib files. Documentation is available online if you need assistance building OpenSSL with the FIPS module.

After a FIPS version of OpenSSL is built on the system, we can start building Python. Before building Python, a few changes in the Python source are required. The first change is in the pyproject.vsprops file located in the `PC\(VS version)\` location of the Python source code. We must update the location of OpenSSL to our new version. In the following example, you can see that Visual Studio looks for an OpenSSL folder from the externalsDir, and the externalsDir is two folders above from our current location named externals. This folder does not exist by default, so we must create it and add our OpenSSL folder.


![8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/8-1518719845111.png)



![9](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/9-1518719854112.png)

Next, change the location to our new OpenSSL.

![10](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/10-1518719873936.png)

The next files to change are the _`hashlib.vcproj` and `_ssl.vcproj` files, located in the same directory, for building the `_hashlib.pyd` and `_ssl.pyd` files. We must update both files with the locations we compile and link to when building. Find the configuration you intend to build python with in each file, and navigate to the **VCPreBuildEventTool** entry. The following example shows the Release|x64 configuration. Since we already built OpenSSL, we do not need to run the build_ssl.py script, so you can remove the **CommandLine** entry.

![11](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/11-1518719882829.png)

Since we are not building using build_ssl.py, the libraries and include files might not be in the location Python is expecting. To fix this issue, change the **VCCLCompilerTool** entry. This entry must point to the `include` folder of your built OpenSSL.

![12](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/12-1518719933237.png)

We also must change the **VCLinkerTool** entry to our new library locations.

![13](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/13-1518720063593.png)

After you make these changes, you should be able to successfully build Python, `_ssl.pyd`, and `_hashlib.pyd`. You might get errors building other extensions, but solving those issues is beyond the scope of this blog. If you want to update only `_ssl.pyd` and `_hashlib.pyd`, there is a shortcut you can take. Instead of building all of Python, right-click on both the **_hashlib** project and **_ssl** project respectively, and then select **Build** in Visual Studio.

![14](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/14-1518720073858.png)

This action will provide the `pyd` files that you need. Install Python by using the installer from the Python website, and then replace the `_ssl.pyd` and `_hashlib.pyd` files in the `DLLs` folder with your new versions.

![15](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/15-1518720081531.png)

You also must replace the `ssl.py` file in the `Lib` folder with your new version.

![16](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/16-1518720090640.png)

**Using our FIPS mode functions**

Now that we have our new FIPS version of `_ssl` and `_hashlib`, we can make sure that they work correctly in the Python shell. 
Importing ssl and checking the OpenSSL version, we can confirm that it has been updated with a FIPS version of SSL.


![17](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/17-1518720097685.png)

We can now try one of our newly added functions. Let’s check the **FIPS mode** of OpenSSL using our first function, FIPS_mode. This function returns a long type 0 for not enforcing FIPS, and 1 for enforcing FIPS. It is important to note that whether or not the OS is in a FIPS mode, when we start Python, OpenSSL is not enforcing FIPS mode.

![18](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/18-1518720288533.png)

**FIPS_mode** returned a 0, so we are not enforcing FIPS. Using a hash that is not FIPS-compliant will work.

![19](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/19-1518720279167.png)

Let’s set Python’s OpenSSL to enforce FIPS mode, by using our second new function **FIPS_mode_set** and passing it a long value of 1. After we set it, let’s verify that OpenSSL is enforcing FIPS by using the previous function again.

![20](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/20-1518720318403.png)

Now that we are enforcing FIPS mode in OpenSSL, if we try to use a hash that is not FIPS-compliant Python will crash with the following error:

![21](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/21-1518720331286.png)

If you want to enforce FIPS, make sure that you use OpenSSL hash functions, and not Python hash functions. This means using the **new** constructor instead of directly calling a hash function that Python already knows. 

![22](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/22-1518720342935.png)

Now that Python is updated to use a FIPS version of OpenSSL, and we included extra functions to set OpenSSL to enforce FIPS, we can make sure that we are using only FIPS algorithms and hashes. If you want to enforce the OS FIPS mode, check for specific Environment Variables or Registries. For examples, see our GitHub for the [python-redfish-utility](https://github.com/HewlettPackard/python-redfish-utility).