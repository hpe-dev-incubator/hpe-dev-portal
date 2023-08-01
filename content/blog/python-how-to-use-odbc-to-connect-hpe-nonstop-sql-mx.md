---
title: Using Python and ODBC to connect HPE NonStop SQL/MX
date: 2021-05-04T06:27:49.069Z
featuredBlog: false
priority: null
author: Shanice Abigail
authorimage: /img/profile_pic-formatted-copy-2-.jpg
tags:
  - python
  - nonstop
  - sqlmx
  - odbc
  - hpe-nonstop
---
Hello World! In this tutorial, I will show you how Python can execute queries on the HPE NonStop SQL/MX Database using pyodbc and the NonStop SQL/MX ODBC driver.

This tutorial assumes that NonStop ODBC 3.x Unicode driver has already been installed. Check out the [NonStop ODBC/MX Client Drivers User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00045523en_us&docLocale=en_US) for more information on the driver.

This tutorial also assumes that on your host, NonStop SQL/MX has been installed, MXCS is running, and a MXCS data source has been added and started. Check with your administrator for the IP address, port number etc. (If you’re the administrator check out this [manual](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=emr_na-a00090054en_us).)

[Link to source code.](https://github.com/shaniceabigail/python-odbc-nonstop-sqlmx) [](https://github.com/shaniceabigail/python-odbc-nonstop-sqlmx)

Let’s get started!

# Getting Started

## Python and pip

First, [download Python,](https://www.python.org/downloads/) if you have not already done so. You can check to see if your machine already has Python installed by running the command below in the Windows command prompt. It should return Python with its version number, if it has been installed properly.

```markdown
C:\> python --version
Python 3.9.0
C:\>
```

Next, install pip (pip is the Python package manager that we will be using). Download [get-pip.py](https://bootstrap.pypa.io/get-pip.py) on your laptop. Navigate to the folder containing the file and run the following command.

```markdown
C:\Downloads> python get-pip.py
```

Once it’s complete, double check to see if pip has been installed by running the following command in Windows.

```markdown
C:\> py -m pip --version
pip 20.3.1 from C:\Miniconda3\lib\site-packages\pip (python 3.9)
C:\> 
```

## Installing pyodbc

pyodbc is an open source Python module that makes it simple to access ODBC databases. It implements the [DB API 2.0](https://www.python.org/dev/peps/pep-0249) specification (the standard interfaces for Python to access a database), but is packed with even more Pythonic convenience. TLDR; it helps you to access the databases that use ODBC drivers.

You can read more about pyodbc on its [Github wiki page](https://github.com/mkleehammer/pyodbc/wiki).

Use pip to install pyodbc.

```
C:\> pip install pyodbc
```

## Configuring your ODBC

In order for pyodbc to recognize the ODBC driver and data source to use, it will check with the ODBC Data Source Administrator on your Windows machine. Here’s how you can configure a new data source that will use the HPE NonStop SQL/MX ODBC driver.

1. Search and open the ODBC Data Source Administrator on your machine.
2. Select the “Add” button to create a new data source.

![](https://miro.medium.com/max/594/1*PWpQ3yfwfB08ITElY9IHRQ.png)

### ODBC Data Source Administrator

3. Select the HPE NonStop™  ODBCMX 3.x Unicode driver, and click “Finish”.

### ODBC Data Source Administrator — Create New Data Source

4. A new window should pop up. Write a Data Source Name for this data source that you want to connect to. Note: The data source names **must match** between those defined to MXCS on the database server and the client PCs; otherwise the connection will **FAIL.**

![](https://miro.medium.com/max/563/1*n48eArrYZ1moeC432v2gZg.png)

### Data Source Name and Description

5. Insert the IP address of the NonStop SQL/MX database, as well as the port number that has been opened up for connections.

![](https://miro.medium.com/max/564/1*4FWFtcvDezDej8zjf90jhg.png)

### IP address and Port number

6. Insert the catalog and schema that you want to connect to.

![](https://miro.medium.com/max/564/1*EPl5NDJsUHZJd6PI-U4eRA.png)

### Catalog and Schema

7. Leave the “Translate DLL” portion (DLL Name and Option), and the Localization (Replacement Character) blank for now.

![](https://miro.medium.com/max/564/1*7BZPU6fI38qaTcXR6IrIag.png)

### Leave blank

8. We will not be doing any tracing in this data source, so leave the settings as the default, and click finish.

![](https://miro.medium.com/max/564/1*DtYFoVsOh4fTpAHwG1n01w.png)

Test the connection, and click “OK”. You should see that the data source has been added to the list.

Alright, now it’s time to code!

# The code:

## The setup

Create a new .py file in any of your favourite text editors — mine is VSCode.

Import the Python package into the script.

Add your Data Source Name, UID (User ID) and Password (PWD) in the fields.

Finally, set the decoding and encoding parameters for the connection. These are database specific. NonStop SQL/MX supports “iso-8859–1”, but this varies with the database you’re using. (We set this up for good measure — so copy/paste the parameters from the code below for **NonStop SQL/MX.**)

This is what you should have so far.

```python
import pyodbc 
conn = pyodbc.connect('DSN=[DATA SOURCE NAME];UID=[USER];PWD=[PASSWORD]') 
conn.setdecoding(pyodbc.SQL_CHAR, encoding='iso-8859-1')
conn.setdecoding(pyodbc.SQL_WCHAR, encoding='iso-8859-1')
conn.setencoding(encoding='iso-8859-1') 
```

## Now onto executing an SQL query in the database.

Create a cursor variable and execute the SQL statement that you would like to have in your database.

Note that **YOU HAVE TO COMMIT THE TRANSACTION** if you make an insert or update a table statement in the Python script. You can insert the commit at the end of the set of updates or inserts.

The act of committing the transactions is how we make sure that the set of transactions / executions are properly executed, and data integrity is maintained.

```python
cursor = conn.cursor()
cursor.execute('INSERT INTO CATALOG.SCHEMA.TABLE VALUES (VALUE1, VALUE2)')
# makes sure that insert statement is a committed transaction in NonStop SQL/MX database
conn.commit() 
```

## Seeing the result / select statement

You can execute the select statement using the cursor and print the values in the cursor.

```python
# prints table to make sure that data was updated
cursor.execute('SELECT * FROM CATALOG.SCHEMA.TABLE')
for row in cursor:    
    print(row)
```

And there you have it!

The Python script should be able to insert, update, create, and select. Alright, that’s it for now. I hope you’ll have fun coding with the NonStop SQL/MX database using information you learned in this tutorial!

For more interesting posts and tutorials, keep checking back on the [HPE DEV blog](https://developer.hpe.com/blog).