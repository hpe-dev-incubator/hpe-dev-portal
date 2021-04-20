---
title: Managing Multiple Instances of Python in Microsoft Windows
date: 2021-04-06T09:08:53.864Z
author: Jean-François Larvoire
authorimage: /img/Avatar1.svg
tags:
  - python
  - windows
---
I use many Microsoft Windows systems for development and testing; both real systems and VMs. Most of them have one or more versions of Python installed. Several have many versions. And, over the years, I've experienced a lot of problems:



* Old programs, not compatible with Python 3, breaking on some systems.


* New programs, not compatible with Python 2, breaking on others. (Yes, I know that Python 2 is obsolete, but the reality is that I still have mission-critical tools that depend on it!)


* The py.exe tool not detecting some installed versions of Python.


* The python.exe command not always starting the most recent version of Python installed on a system.


* Etc.



Finally, I decided to get to the bottom of it. In this blog post, I'll share with you what I learned.




## Where to get Python for Microsoft Windows




Recent versions of Microsoft Windows 10 have a python.exe stub pre-installed that gets you directly to a Microsoft Store page. From there you can download a free version of Python officially supported by Microsoft. Just run `python` at the command prompt and follow the instructions on the Microsoft Store page.



An alternative is to go to `https://www.python.org/downloads/`, and get the official Python releases for Microsoft Windows. Advantage: Their version is slightly more recent than the one supported by Microsoft.



Another possibility is to use a third party build for Microsoft Windows, like the [ActivePython](https://www.activestate.com/products/python/downloads/) distribution maintained by [ActiveState](https://www.activestate.com). If you still need Python 2.7, their ActivePython 2.7 is an all-batteries included distribution, with all modules that you can think of built-in.  


>Caution: These ActivePython distributions are free for development use, but not for production use.


There are many other possible alternatives, the ones above being just some of the most common.



This diversity is proof of the vitality of the Python ecosystem...
But this is also the source of many problems, as different versions make different, sometimes conflicting, installation choices!




## The py.exe launcher tool




The _py.exe_ launcher tool is a critically important tool that comes with Python 3 distributions for Microsoft Windows. Unfortunately its installation is optional and usually _not_ selected by default. If you ever install more that one Python version on your system (Python 2.7 and Python 3.x maybe), then it's a no-brainer: You **must** select it and install it.



First and foremost, py.exe is a front end to python.exe. By default, it runs the latest installed version of python.exe. But it has options to select another version at will. Usage:  
`py [py.exe options] [python.exe options and arguments]`


Example:
  
```markdown
C:\Temp>py --version
Python 3.9.2

C:\Temp>py -2 --version
Python 2.7.12

C:Temp>
```



Here, in both cases, the `--version` option was interpreted by python.exe, *not* by py.exe.  
In the first case, it was python.exe version 3.9.2 that ran. In the second, it was python.exe version 2.7.12 that did.



The `-2` option is a py.exe option that tells it to run the latest Python 2 version.  
You can also specify the minor version, like `-3.5`, or even the target processor size, i.e. `-3-32` or `-3.8-64`.



The `-0` option tells py.exe to just list the available instances:
  
```markdown
C:\Temp>py -0
Installed Pythons found by py Launcher for Windows
 -3.9-64 *
 -3.8-32
 -3.7-64
 -3.6-64
 -3.5-64
 -2.7-64


C:\Temp>
```



There's also a `-0p` option to list both the version and pathname of the python.exe instances it can use: 
 
```markdown
C:\Temp>py -0p
Installed Pythons found by py Launcher for Windows
 -3.9-64        C:\Program Files\Python39\python.exe *
 -3.8-32        C:\Users\Larvoire\AppData\Local\Programs\Python\Python38-32\python.exe
 -3.7-64        C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python37_64\python.exe
 -3.6-64        C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python36_64\python.exe
 -3.5-64        C:\Program Files\Python35\python.exe
 -2.7-64        C:\Program Files\Python27\python.exe


C:\Temp>
```



### Python instances not seen by py.exe



Sometimes, py.exe does not see some installed versions of Python. This is often the case with Python 2.7 instances. The root cause is that the setup program for these instances did not create the necessary registry keys used by py.exe to enumerate the installed instances.



To fix that, you need to manually create one of these registry keys and values:



 * For user-specific instances (Installed in C:\Users\YOURNAME\AppData\Local\Programs\Python), the base key is:  
   `HKEY_CURRENT_USER\Software\Python\PythonCore\MAJOR.MINOR\InstallPath\...`


 * For system-wide instances (Installed in C:\Program Files\python*, or even in C:\Python*), the base key is:  
   `HKEY_LOCAL_MACHINE\Software\Python\PythonCore\MAJOR.MINOR\InstallPath\...`



In each of these keys, there are three values needed:



| Value name              | Content                                       |
| ----------------------- | --------------------------------------------- |
| @ (In the key itself)   | The Python installation directory name        |
| ExecutablePath          | The full pathname of the python.exe instance  |
| WindowedExecutablePath  | The full pathname of the pythonw.exe instance |



For example, for my Python 2.7 installation, I had to add keys and values from this .reg file: 
 

```markdown
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\Software\Python\PythonCore\2.7]

[HKEY_LOCAL_MACHINE\Software\Python\PythonCore\2.7\InstallPath]
@="C:\\Program Files\\Python27\\"
"ExecutablePath"="C:\\Program Files\\Python27\\python.exe"
"WindowedExecutablePath"="C:\\Program Files\\Python27\\pythonw.exe"
```



### Automatically running Python 2 or Python 3 for scripts that need it



Another great feature of py.exe is that it interprets the Python scripts shebang. The shebang is the special #! comment on the first line of a script. This comment is intended to be used by Unix shells to select which interpreter to run. 
 

Problem: There is no such mechanism in Microsoft Windows shells (cmd or PowerShell). That's where py.exe steps in: Based on that shebang, it selects the right Python interpreter to use in Microsoft Windows.



| Shebang                  | py.exe action                                     |
| ------------------------ | ------------------------------------------------- |
| `#!/usr/bin/env python`  | Select the most recent Python version available   |
| `#!/usr/bin/env python2` | Select the most recent Python 2 version available |
| `#!/usr/bin/env python3` | Select the most recent Python 3 version available |



Use the first generic shebang *only* if your scripts is compatible with both Python 2 and Python 3. In the most common case where your script is compatible with just one of the two, use the right one for that version.



Example:
  

```markdown
C:\Temp>type testpy2.py
#!/usr/bin/env python2
import platform;
print(platform.sys.version);

C:\Temp>py testpy2.py
2.7.12 (default, Dec 19 2016, 15:56:45) [MSC v.1500 64 bit (AMD64)]

C:\Temp>type testpy3.py
#!/usr/bin/env python3
import platform;
print(platform.sys.version);

C:\Temp>py testpy3.py
3.9.2 (tags/v3.9.2:1a79785, Feb 19 2021, 13:44:55) [MSC v.1928 64 bit (AMD64)]

C:\Temp>
```



Note that this tip is good for Unix also. With the right shebang, the script will use the right Python version both in Unix and Microsoft Windows. 

One last important note about this: Unix shells choke on Python scripts created in Microsoft Windows with CRLF at the end of lines. If you want your Python script to be portable to Mac and Linux systems, use Unix LF line endings, even in Microsoft Windows.




## Running Python scripts based on the .py extension




### The local machine configuration



Microsoft Windows can select interpreters based on the file extension. This should be setup correctly by recent versions of Python 3, but may not be so with old versions of Python 2! If you install an old Python 2.7 _after_ a recent Python 3, this may bite you! To check if the configuration is correct, run `assoc.exe`, then `ftype.exe`, as shown here:
 
```markdown
C:\Temp>assoc .py
.py=Python.File

C:\Temp>ftype Python.File
Python.File=C:\Windows\py.exe "%L" %*

C:\Temp>
```


The `assoc` command must show that extension .py is associated with class `Python.File`. If it's not, run `assoc .py=Python.File` to correct it. And the `ftype` command must show that the `Python.File` class is associated with the py.exe command, or if py.exe is not available on your (very old) system, to the latest python.exe command available.
  
The `"%L" %*` arguments tell the shell to append the script full pathname, and all its arguments if any. 

>Note that I've seen cases where this command was corrupt, with a long string of garbage characters instead. If it's incorrect or corrupt, correct it by running:
 `ftype Python.File=C:\Windows\py.exe "%L" %*`



### The current user configuration



However this is not always sufficient. If you've installed a Python instance for yourself only, not for all users, the system-wide extension-to-class and class-to-command associations are overridden by user-specific HKCU registry keys:
  
```markdown
C:\Temp>reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.py\UserChoice" /v Progid

HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.py\UserChoice
    Progid    REG_SZ    Python.File


C:\Temp>reg query HKCU\Software\Classes\Python.File\shell\open\command /ve
ERROR: The system was unable to find the specified registry key or value.

C:\Temp>
```


In my case, the first key is defined with the same value as the global system-wide association, which is fine. If they're not defined, as with my second key, this is also fine, as the system-wide version will be used. But again, these two keys may be incorrect or corrupt. If they are, correct them with regedit.exe or delete them altogether.



### Other failure causes



* ftype.exe stores its data in the regitry in key `HKEY_LOCAL_MACHINE\Software\Classes\Python.File\shell\open\command`  
If that key contains sub-keys (I've seen this), then Microsoft Windows shells get confused. If that happens, remove the sub-keys.


* There's also a python.exe association in `HKEY_LOCAL_MACHINE\Software\Classes\Applications\%EXE%\shell\open\command`.  
 If defined, it should contain: `C:\Windows\py.exe "%1"` (The argument `"%L" %*` also works, not sure which is best.)


* The above two have counterparts in `HKEY_CURRENT_USER\Software\Classes\...`. Same remarks.


* File type associations can also be overridden by global policies, including some set by your Domain Controller. I've never seen this, but be aware it's possible.




## Finding python.exe in the PATH



The Python setup optionally adds the Python and Python Scripts installation directories to the PATH. This allows starting interactive Python sessions by typing `python` at the command prompt. Likewise, this allows starting `pip`, or tools installed by pip into the Scripts directory just by typing their name.

>Note that this is optional, because as explained above, if you have the py.exe command available, you'll get the same result by typing `py`, or `py -n pip`, etc.



Having the Python and Python Scripts directories in the PATH makes things a bit more intuitive and similar to how they work in Unix. The drawback is that this makes the ridiculously long Microsoft Windows PATH even longer, and so potentially slows down
your system a little bit.



But a worse problem may occur when you have several versions of Python installed. You may find situations where an old version was installed with the PATH updated and a newer version without. The result is that the `py` and `python` commands do not start the same version of Python, which can lead to problems. If this happens, you must correct your local, user, and system PATH to make sure the latest version of Python runs in
all cases.



### Tools for managing the Microsoft Windows PATH



#### paths.bat



As the Microsoft Windows PATH is extremely long, it's often difficult to tell if a given directory is in the list and where. The open source [paths.bat](https://github.com/JFLarvoire/SysToolsLib/blob/master/Batch/paths.bat) tool makes is easy
to review, and optionally correct, your local or system PATH. By default, it displays all entries in your local PATH, one per line. This makes it much easier to review what's in there. This also allows filtering the output using command-line filtering tools. For example:


```markdown
C:\Temp>paths | findstr /i python
C:\Program Files\Python39
C:\Program Files\Python39\scripts

C:\Temp>
```


Run `paths -?` to display a help screen describing all available options. The following options will be particularly useful for fixing problems with your Python configuration:


 * `-s` tells it to manage the system PATH, instead of the local shell PATH by default.


 * `-u` tells it to manage the user PATH, instead of the local shell PATH by default.


 * `-r DIRECTORY` tells it to remove that DIRECTORY from the managed PATH.


 * `-m DIR1 -b DIR2` tells it to move a DIRECTORY 1 just before DIRECTORY 2.



#### Other System Tools Library tools



The [System Tools Library](https://github.com/JFLarvoire/SysToolsLib/releases/latest/download/SysTools.zip) contains paths.bat and other tools for managing the PATH:



 * `which.exe` includes the best of Unix which and Microsoft Windows where.exe and some more. For a detailed description of which.exe features, see [this post](https://www.dostips.com/forum/viewtopic.php?f=3&t=9058).


 * [paths](https://github.com/JFLarvoire/SysToolsLib/blob/master/Bash/paths) is a simple Posix Shell script for doing the same things in Unix shells as paths.bat does in Microsoft Windows shells.



### Interference with the Microsoft Store link



In recent Microsoft Windows 10 versions, Microsoft installs a python.exe stub, that redirects you to the Microsoft Store, where you can download their distribution of Python. This stub is stored in `%LOCALAPPDATA%\Microsoft\WindowsApps` (cmd) or `$env:LOCALAPPDATA\Microsoft\WindowsApps` (PowerShell).


Problem: If you install a non-Microsoft distribution and add its location in the Microsoft Windows PATH, it sometimes ends up in the PATH _behind_ the Microsoft stub!

Running `python` will open the Microsoft Store instead of the Python instance you just installed.


Quick workaround: Use py.exe instead of python.exe. Py.exe does not use the PATH to locate instances, and will find your latest python.exe anyway.


Long term solution: Move the Python directories in the system PATH _before_ "%LOCALAPPDATA%\Microsoft\WindowsApps". Then restart the open shells to get the modified PATH.


Below is an example of a system that has this problem: (Using the `paths` tool described in the previous section.)


```markdown
C:\Temp>where python
C:\Users\Larvoire\AppData\Local\Microsoft\WindowsApps\python.exe
C:\Program Files\Python39\python.exe

C:\Temp>paths | findstr /i /c:python /c:WindowsApps
C:\Users\Larvoire\AppData\Local\Microsoft\WindowsApps
C:\Program Files\Python39
C:\Program Files\Python39\scripts

C:\Temp>
```


In this case, to move the above two directories before "%LOCALAPPDATA%\Microsoft\WindowsApps", run:


```markdown
C:\Temp>paths -m "C:\Program Files\Python39" -b "%LOCALAPPDATA%\Microsoft\WindowsApps"
[Outputs the updated PATH contents]
C:\Temp>paths -m "C:\Program Files\Python39\scripts" -b "%LOCALAPPDATA%\Microsoft\WindowsApps"
[Outputs the updated PATH contents]
C:\Temp>paths | findstr /i /c:python /c:WindowsApps
C:\Program Files\Python39
C:\Program Files\Python39\scripts
C:\Users\Larvoire\AppData\Local\Microsoft\WindowsApps

C:\Temp>
```




## Finding Python scripts in the PATH without specifying their extension




Microsoft Windows shells search for commands using a list of implicit extensions defined in the PATHEXT environment variable. This allows running a script by entering just its base name _without_ the extension. For example on my system, reusing the testpy2.py and testpy3.py scripts described above:


```markdown
C:\Temp>set PATHEXT
PATHEXT=.PY;.PY3;.PYC;.PYO;.PYW;.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC

C:\Temp>testpy3
3.9.2 (tags/v3.9.2:1a79785, Feb 19 2021, 13:44:55) [MSC v.1928 64 bit (AMD64)]

C:\Temp>testpy2
2.7.12 (default, Dec 19 2016, 15:56:45) [MSC v.1500 64 bit (AMD64)]

C:\Temp>
```


If your PATHEXT does not contain .PY or .py (This is case-independant, so the two are equivalent), then add it into both the system PATHEXT and your local shell PATHEXT. Example for the cmd.exe shell:


```markdown
setx PATHEXT ".PY;%PATHEXT%" -m
set PATHEXT=.PY;%PATHEXT%
```


and for PowerShell:


```markdown
$SystemPathExt = [Environment]::GetEnvironmentVariable('PATHEXT', 'Machine')
[Environment]::SetEnvironmentVariable('PATH', ".PY;$SystemPathExt", 'Machine')
$env:PATHEXT = ".PY;$env:PATHEXT"
```




## Automating all of this




If all the above gives you a headache (it definitely does for me!), there is a way to do everything automatically. The Open Source [System Tools Library](https://github.com/JFLarvoire/SysToolsLib/releases/latest/download/SysTools.zip)
contains a tool called [PySetup.bat](https://github.com/JFLarvoire/SysToolsLib/blob/master/Python/PySetup.bat). This tool checks all the information documented above and, optionally, fixes it.


First run `pysetup` without any option to check the current configuration. Then, if anything is wrong, and you agree with the proposed changes, run `pysetup -s`.



When everything is correct, pysetup.bat outputs all green <span style="color:green">[OK]</span> statuses:
  

```markdown
C:\Temp>pysetup

Testing the "C:\Program Files\Python39\python.exe" configuration
Using C:\Windows\py.exe

The .py extension is globally associated with class: Python.File
[OK]
The .py extension is associated for user Larvoire with class: Python.File
[OK]
The open command for class Python.File is: C:\Windows\py.exe "%L" %*
[OK]
There's no additional command for class Python.File
[OK]
The open command for application python.exe is: C:\Windows\py.exe "%L" %*
[OK]
The Python InstallPath registration is: "C:\Program Files\Python39\"
[OK]
The Python PythonPath registration is: "C:\Program Files\Python39\Lib\;C:\Program Files\Python39\DLLs\"
[OK]
The PATH contains C:\Program Files\Python39
[OK]
The PATH contains C:\Program Files\Python39\scripts
[OK]
Other Python directories in the PATH:
[OK]
The global system PATH contains C:\Program Files\Python39
[OK]
The global system PATH contains C:\Program Files\Python39\scripts
[OK]
Other Python directories in the global system PATH:
[OK]
The global environment variable PATHEXT is: .PY;.PY3;.PYC;.PYO;.PYW;.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
[OK]
The local environment variable PATHEXT is: .PY;.PY3;.PYC;.PYO;.PYW;.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
[OK]
Verifying that 'python' starts "C:\Program Files\Python39\python.exe"
[OK]
Verifying that 'python.exe' starts "C:\Program Files\Python39\python.exe"
[OK]

The setup is good.

C:\Temp>
```



### Fixing missing instances that py.exe does not see



Another feature of pysetup.bat is that it can scan known places on the disk for Python instances, and optionally register missing entries so that py.exe knows about them.



* First run `pysetup -l` to list instances. (This may take some time if you have a slow disk.)

       C:\Temp>pysetup -l
       #0   3.9.2    AMD64   C:\Windows\py.exe
       #1   2.7.12   AMD64   C:\Program Files\Python27\python.exe
       #2   3.5.2    AMD64   C:\Program Files\Python35\python.exe
       #3   3.7.4    AMD64   C:\Program Files\Python37\python.exe
       #4   3.9.2    AMD64   C:\Program Files\Python39\python.exe
       #5   3.6.6    AMD64   C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python36_64\python.exe
       #6   3.7.8    AMD64   C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python37_64\python.exe
       #7   3.8.7    x86     C:\Users\Larvoire\AppData\Local\Programs\Python\Python38-32\python.exe
       
       C:\Temp>



* Compare that to the output of the `py -0p` command.

       C:\Temp>py -0p
       Installed Pythons found by py Launcher for Windows
        -3.9-64        C:\Program Files\Python39\python.exe *
        -3.8-32        C:\Users\Larvoire\AppData\Local\Programs\Python\Python38-32\python.exe
        -3.7-64        C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python37_64\python.exe
        -3.6-64        C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python36_64\python.exe
        -3.5-64        C:\Program Files\Python35\python.exe
           
       C:\Temp>



* If any one is missing (As is the case here for Python 2.7.12), then run `python -r VERSION` to fix the issue. Ex:



       C:\Temp>pysetup -r 2.7.12
       reg add "HKLM\Software\Python\PythonCore\2.7\InstallPath" /ve /d "C:\Program Files\Python27\\" /f
       The operation completed successfully.
       reg add "HKLM\Software\Python\PythonCore\2.7\InstallPath" /v ExecutablePath /d "C:\Program Files\Python27\python.exe" /f
       The operation completed successfully.
       reg add "HKLM\Software\Python\PythonCore\2.7\InstallPath" /v WindowedExecutablePath  /d "C:\Program Files\Python27\pythonw.exe" /f
       The operation completed successfully.
       
       C:\Temp>py -0p
       Installed Pythons found by py Launcher for Windows
        -3.9-64        C:\Program Files\Python39\python.exe *
        -3.8-32        C:\Users\Larvoire\AppData\Local\Programs\Python\Python38-32\python.exe
        -3.7-64        C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python37_64\python.exe
        -3.6-64        C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python36_64\python.exe
        -3.5-64        C:\Program Files\Python35\python.exe
        -2.7-64        C:\Program Files\Python27\python.exe
         
       C:\Temp>




## Conclusion




I hope you found this post helpful when dealing with some of the issues that can occur when you are configuring multiple instances of Python in Microsoft Windows environments. For more informative tutorials, make sure you keep checking back on the [HPE DEV blog](https://developer.hpe.com/blog).
