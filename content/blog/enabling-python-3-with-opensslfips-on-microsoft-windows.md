---
title: "Enabling Python 3 with OpenSSL/FIPS on Microsoft Windows"
date: 2020-12-21T08:48:53.479Z
author: Rajeev Kallur 
tags: ["Python","OpenSSL","FIPS"]
path: enabling-python-3-with-opensslfips-on-microsoft-windows
authorimage: "/img/blogs/Avatar3.svg"
---
![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/fips-compliant-1611244310749.png)


__Introduction__

Federal Information Processing Standard (FIPS) are a set of encryption algorithms and is mandatory in all computer systems and software used by non-military American government agencies, government contractors and vendors who work with the agencies.  When new software is developed, it needs to be FIPS-compliant.  Thus, there is a need to enable Python with FIPS,  but the default Python package comes without FIPS as shown in screenshot below. 

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/openssl_init-1609929682543.PNG)


This blog will explain, step-by-step, how to enable Python 3 with the OpenSSL/FIPS standard on a Microsoft Windows platform so that any new software compiled out of it, is FIPS-compliant. 

__Prerequisites__


- Cygwin environment
- Python 3
- Visual Studio 2017


__STEPS__

__Step 1__
Download the OpenSSL and FIPS source from http://www.openssl.org and the Python 3 source from http://www.python.org

__Step 2__
Convert all symlinks in the archive to regular files.  This is done in  Linux, Cygwin environment.

   Untar

   ```
   $ tar -zxvf openssl-fips-2.0.16.tar.gz
   $ tar -zxvf openssl-1.0.2u.tar.gz
   $ tar -zxvf Python-3.8.6.tgz
   ```

   Zip -9 

   ```
   $ zip -9 -r openssl-fips-2.0.16.zip openssl-fips-2.0.16
   $ zip -9 -r openssl-1.0.2u.zip openssl-1.0.2u
   $ zip -9 -r Python-3.8.6.zip Python-3.8.6
   ```

   Finally, unzip in Windows to the c:\work\ folder.

__Step 3__
Install NASM for x64 and copy the contents of C:\Program Files\NASM to the C:\work\openssl-1.0.2u\ folder. 

Note: NASM is a netwide assembler program and can be downloaded from   [https://www.nasm.us/pub/nasm/releasebuilds] 

__Step 4__
Build the FIPS module using the VS 2015 Native Tools Command prompt.

   ```
   > cd openssl-fips-2.0.16
   > ms\do_fips
   ```

   Rename the folder “out32dll” to “lib”.

   Rename the folder “util” to “bin”.

   Move “fips_standalone_sha1.exe” from “lib” to “bin”.

 This is done so that OpenSSL can compile in the next steps.

__Step 5__
Build OpenSSL module using the VS 2015 Native Tools Command prompt.

   ```
   cd openssl-1.0.2u
   perl Configure VC-WIN64A no-zlib no-idea no-mdc2 no-rc5 no-ssl2 no-ssl3 fips --with-fipslibdir=C:\usr\local\ssl\fips-2.0
   ms\do_win64a
   nmake -f ms\nt.mak all
   nmake -f ms\nt.mak install
   ```

The openssl.exe and libeay32.dll and ssleay32.dll files are generated be in the C:\usr\local\ssl\bin\ folder.

 ![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image-20201221151001541-1608549015693.png)

__Step 6__
Unzip Python in Windows and create an 'externals' directory at the root (c:\work\Python-3.8.6) folder.

Under 'externals', create a directory for openssl-1.0.2u and copy all the contents of c:\usr\local\ssl\ to this directory.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image-20201221152015627-1608548808308.png)

__Step 7__
Under 'externals', create a directory for openssl-bin-1.0.2u/amd64 and copy all the files from c:\work\openssl-1.2.u\out32dll to this directory.

Also, copy all the files from c:\work\openssl-1.2.u\inc32 to the  openssl-bin-1.0.2u/amd64/include directory.

__Step 8__
Patch/Add/Modify these codes to files as shown below under Python-3.8.6 source (c:\work\Python-3.8.6).

   Lib\ssl.py:

   ```py
   try:
       from _ssl import FIPS_mode, FIPS_mode_set
       print('successful import')
   except ImportError as e:
       print('error in importing')
       print(e)   
   ```

   Modules/_ssl.c:

   ```py
   static PyObject *
   _ssl_FIPS_mode_impl(PyObject *module) {
       return PyLong_FromLong(FIPS_mode());
   }
   
   static PyObject *
   _ssl_FIPS_mode_set_impl(PyObject *module, int n) {
       if (FIPS_mode_set(n) == 0) {
           _setSSLError(ERR_error_string(ERR_get_error(), NULL) , 0, __FILE__, __LINE__);
           return NULL;
       }
       Py_RETURN_NONE;
   }
   
   static PyMethodDef PySSL_methods[] = {
       _SSL__TEST_DECODE_CERT_METHODDEF
       _SSL_RAND_ADD_METHODDEF
       _SSL_RAND_BYTES_METHODDEF
       _SSL_RAND_PSEUDO_BYTES_METHODDEF
       _SSL_RAND_EGD_METHODDEF
       _SSL_RAND_STATUS_METHODDEF
       _SSL_GET_DEFAULT_VERIFY_PATHS_METHODDEF
       _SSL_ENUM_CERTIFICATES_METHODDEF
       _SSL_ENUM_CRLS_METHODDEF
       _SSL_TXT2OBJ_METHODDEF
       _SSL_NID2OBJ_METHODDEF
       _SSL_FIPS_MODE_METHODDEF
       _SSL_FIPS_MODE_SET_METHODDEF
       {NULL,                  NULL}            /* Sentinel */
   }; 
   ```

   Modules/clinic/_ssl.c.h:

   ```py
   PyDoc_STRVAR(_ssl_FIPS_mode__doc__,
   "FIPS Mode");
   
   #define _SSL_FIPS_MODE_METHODDEF    \
       {"FIPS_mode", (PyCFunction)_ssl_FIPS_mode, METH_NOARGS, _ssl_FIPS_mode__doc__},    
   
   static PyObject *
   _ssl_FIPS_mode_impl(PyObject *module);
   
   static PyObject *
   _ssl_FIPS_mode(PyObject *module, PyObject *Py_UNUSED(ignored))
   {
       return _ssl_FIPS_mode_impl(module);
   }
   
   PyDoc_STRVAR(_ssl_FIPS_mode_set_doc__,
   "FIPS Mode Set");
   
   #define _SSL_FIPS_MODE_SET_METHODDEF    \
       {"FIPS_mode_set", (PyCFunction)_ssl_FIPS_mode_set, METH_O, _ssl_FIPS_mode_set_doc__},   
   
   static PyObject *
   _ssl_FIPS_mode_set_impl(PyObject *module, int n);
   
   static PyObject *
   _ssl_FIPS_mode_set(PyObject *module, PyObject *arg)
   {
       PyObject *return_value = NULL;
       int n;
   
       if (!PyArg_Parse(arg, "i:FIPS_mode_set", &n)) {
           goto exit;
       }
       return_value = _ssl_FIPS_mode_set_impl(module, n);
   
   exit:
       return return_value;
   }
   ```

The above code is used to enable functions ssl.FIPS_mode() and ssl.FIPS_mode_set().

Reference: https://stackoverflow.com/questions/49493537/how-to-implement-fips-mode-and-fips-mode-set-in-python-3-6s-ssl-module.

__Step 9__
Modify PCbuild/openssl.props as shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/openssl-1608656128730.PNG)

__Step 10__
Open PCbuild/python.props and change entries as shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image-20201221155609284-1608549075946.png)

__Step 11__
Open Python Solution under PCbuild/pcbuild.sln in VS 2017/2015.

Change the link settings of _hashlib and _ssl projects under Python as shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image-20201221155243791-1608549098426.png)

Change compile settings _hashlib and _ssl projects as shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image-20201221155403908-1608549116108.png)

__Step 12__
Now, build _hashlib.pyd and _ssl.pyd in VS 2017/2015.

__Step 13__
Copy these built pyd files to a Python binary installation directory c:\python38\DLLs folder.

    Copy ssl.py to c:\python38\Lib folder.

    Copy OpenSSL DLLs (libeay32.dll and ssleay32.DLL) to the c:\python38\DLLs folder.

__Step 14__
Start Python and use these commands to check the OpenSSL/FIPS version.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image-20201221161218408-1608549142246.png)

Voila...now Python 3.8 has OpenSSL with FIPS.

__Summary__

In this blog, I have covered the following steps in regards to enabling Python 3 with FIPS.

- Download the required packages.
- Compile both OpenSSL and FIPS and link them both.
- Make the required changes to Python source before linking to the new OpenSSL and compile.
- Copy the newly generated binaries to the installed Python location.
- Test the version and check if FIPS is enabled.

I hope this blog is useful to the entire developer community!! Make sure you check out other blog posts on [HPE DEV](https://developer.hpe.com/blog) for more useful tutorials. 

