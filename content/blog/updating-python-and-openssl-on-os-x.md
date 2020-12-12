---
title: "Updating Python and Openssl on OS X"
date: 2017-12-18T18:53:11.946Z
author: Matthew Kocurek- iLOREST Developer 
tags: ["ilo-restful-api","redfish","openssl","python","ilo",""]
path: updating-python-and-openssl-on-os-x
---
# **Updating Python and Openssl on OS X**
Security is a vital part of any server. On our Enterprise servers we provide options for higher levels of security. However, Mac computers ship with an older version of Openssl, a vital component for our python-redfish-library. In this blog we will cover updating Openssl to at least 1.0.0 to allow support for our python-redfish-library.
**Higher Security Settings**

“High Security" is one of the Higher Security levels offered on our Gen10 servers. When “High Security” or other higher security settings are enabled, Openssl must be used to connect to the server. Below is a screenshot where these security settings can be changed. It can be found under Security > Encryption.

![openssl1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/12/1-1513693864107.jpg)


**Running Examples without Openssl**

Here we show an example of an attempt to execute an example script on a Mac without updated Openssl.

![openssl2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/12/2-1513693937238.png)


Note in the Terminal we are utilizing Python 2.7.11 as well as OpenSSL 0.9.8zg. Here we attempted to execute the first example, ex01_get_resource_directory.py. Since our version is outdated, we have an error in attempting to connect.

**Installing Homebrew**


To perform our upgrades, we will use Homebrew. Homebrew is a package manager for macOS. We will be using it to install the most recent version (at least v1.0) of Openssl, and then use that version to install a newer version of Python.

Homebrew installs into `/usr/local/` so it must be accessible to the user.

`sudo chown -R $(whoami) /usr/local`

The above command will give the user permissions to install to `/usr/local/`
To install Homebrew:
`/usr/bin/ruby -e "$(curl -fsSL
https://raw.githubusercontent.com/Homebrew/install/master/install`

Paste this command into your console, and Homebrew will install itself. Note that this should not be done with sudo.


![ssl3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/3-1518714501022.png)



Upon installing Homebrew, the first thing we want to do is update it.

`brew update`

Then we want to install openssl
`brew install openssl`

If you’re behind a firewall and use a proxy, add `ALL_PROXY=proxy` before your command:

`ALL_PROXY=socks5://127.0.0.1:9001 brew install openssl`

Substitute `socks5://127.0.0.1:9001 ` with your own proxy. This command can be used for both the update and install commands.



**Linking Openssl and Installing Python**


We can attempt to create symlinks through homebrew for Openssl with the following command:

`brew link openssl --force`

This first command may work in certain versions of Homebrew, but recent updates have changed how Homebrew processes openssl installation. Alternatively, we can create these symlinks manually with the following commands:

`ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib/`

`ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib/`

Now that the symlinks have been created, we can install Python:

`brew install python --with-brewed-openssl`


![ssl4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/4-1518714723500.png)


Upon completion, we will have Python installed with the new version of Openssl. In the example below, we have opened the new version of Python, as well as checked the version of Openssl, which shows as 1.0.2j.

![ssl5.2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/5-1518716804698.png)



**Setting the new Python as default**


The newly installed Python is different from the system Python that comes prepackaged on the Mac. We need to ensure that it becomes the preferred Python installation. We can use the which python command to find which installation is being used.
Often, the default directory for system Python is:

`usr/bin/python2.7`

Homebrew’s Python would be installed under something like:
`usr/local/bin/python2.7`

In order to fix this, we simply edit our etc/paths file. We want to ensure that `/usr/local/` is at the top of the list to ensure that version of Python is used first. See example paths file below:

`/usr/local/bin`
`/usr/local/sbin`
`/usr/bin`
`/bin`
`/usr/sbin`
`/sbin`

Note that we do not want to remove the system Python, since some Mac services rely on the system version of Python. Instead, we simply want to redirect it to use our new version of Python.


**Running the new Python with Openssl**


Now that we’ve updated Openssl, and integrated it with Python, we can use this new version of Python to utilize our python-redfish-library. Note that pip install may need to be run to reinstall the redfish library. (pip install python-redfish-library) In the example below, IDLE was used to run the first example again:


![6.2ssl](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/6-1518717614095.png)



As you can see, our Python has since been updated to the newest version as of writing, 2.7.12. Additionally, the example runs successfully instead of failing.

Now that we’ve successfully updated Openssl and Python on our Mac, we can now utilize the python-redfish-library to its full extent in managing remote servers via the iLO RESTful API. 
