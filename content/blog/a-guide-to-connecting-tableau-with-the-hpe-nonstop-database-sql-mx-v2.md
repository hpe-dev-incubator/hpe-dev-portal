---
title: A guide to connecting Tableau with the HPE NonStop Database SQL/MX v2
date: 2023-08-28T11:15:01.431Z
author: Shanice Abigail
authorimage: /img/profile_pic-formatted-copy-2-.jpg
disable: false
tags:
  - Tableau
  - hpe-nonstop
---
HPE NonStop is a platform and an operating environment that turns your applications into fault-tolerant apps. Trusting in over 40 years of continued evolution and developments on the platform, financial institutions payment processors, manufacturers and retailers continue to put their most mission-critical workloads on HPE NonStop.

HPE NonStop offers a modern RDBMS, with interfaces, tools, and experts available to lead the integration into customers’ IT environments.

HPE NonStop SQL/MX is an HPE-patented database that inherits the fault-tolerant design and coherent integration between OS and the database, and adopts industry-standard features and tools.

## What does it mean to adopt industry standard features and tools?

This means that software and tools programmed to use industry-standard [Open Database Connectivity drivers (ODBC)](https://insightsoftware.com/blog/what-is-odbc/) and [Java Database Connectivity (JDBC) drivers](https://www.ibm.com/docs/en/informix-servers/12.10?topic=started-what-is-jdbc) will be able to connect to the HPE NonStop database.

There are many data visualization and analytics tools that provide such connectors, and, in this tutorial, we will be connecting the SQL/MX database to Tableau, a leading data visualization tool used for data analysis and business intelligence.

![Connecting Tableau to HPE NonStop](/img/connectingtableau-tohpenonstopaql.png "Connecting Tableau to HPE NonStop")

## What is Tableau?

Tableau is an excellent data visualization and business intelligence tool used for reporting and analysing vast volumes of data, helping users create charts, graphs, and dashboards that assist in business decision making. It helps users see and understand their data through its intuitive interface and feature-packed application. Tableau has spent a decade as a leader in the Gartner Magic Quadrant for Analytics and Business Intelligence space, and remains one of the top business intelligence platforms for graduates just out of college and [top companies, such as LinkedIn and RedHat](https://www.tableau.com/solutions/customers).

![Sample Tableau Dashboard with SQL/MX Database](/img/sampletableaudashboard-withsql.png "Sample Tableau Dashboard with SQL/MX Database")

## Connecting Tableau to the SQL/MX database

This article serves as a companion to the [existing Tableau Tutorial to their desktop client](https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-home.htm). The tutorial is quite good, so make sure you check it out and continue exploring Tableau’s features while being connected to your SQL/MX database.

This document will provide specific guidance for connecting the Tableau software to the SQL/MX database.

### Connection and ODBC prerequisites:

This tutorial assumes that HPE NonStop ODBC 3.x Unicode driver has already been installed. Check out the [HPE NonStop ODBC/MX Client Drivers User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00045523en_us&docLocale=en_US) for more information on the driver.

You can refer to this tutorial to get help in configuring your ODBC [— Getting Prerequisites > Configuring your ODBC](https://shanice-abigail.medium.com/python-how-to-use-odbc-to-connect-hpe-nonstop-sql-mx-44ca90047eb3).

This tutorial also assumes that on your host, HPE NonStop SQL/MX has been installed, MXCS is running, and a MXCS data source has been added and started. Check with your administrator for the IP address, port number etc. (If you’re the administrator you can find out more in this [manual](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=emr_na-a00090054en_us)).

### Data model and database structure:

The data for this tutorial was taken from Tableau’s tutorial and desktop client for “Superstore”. The raw data can be downloaded from Tableau’s desktop client, or through this link - [Superstore.xls from Tableau’s Tutorial (Click to Download)](https://github.com/shaniceabigail/medium-materials/raw/main/2022%20tableau%20demo/Superstore.xls).

Each excel sheet is visualized as one table in the database. To import the data into SQL/MX, you need to:

1. Save each excel sheet as a .csv file.
2. Create tables in the database through MXCI.
3. Import from OSS using the command:
   **/usr/tandem/sqlmx/bin/import** \[catalog].\[schema].\[table name] **\-I** \[table name]**.csv**. For example: */usr/tandem/sqlmx/bin/import catalog.schema.orders -I orders.csv*

## Connecting to the HPE NonStop server

Create a new workbook in Tableau and select the “Other Databases (ODBC)” option when choosing the type of connection to a server.

![New Tableau Connection](/img/newtableauconnection.png "New Tableau Connection")

### Connection requirements

Here are the details you will need:

* Database username    
* Database password    
* Catalog name    
* Schema name    



![HPE NonStop ODBC DataSource](/img/hpenonatopodbcdatasource.png "HPE NonStop ODBC DataSource")

You will see another window prompt — make sure that you select the DSN (data source name) that you have registered in your ODBC configuration.

### Server details and format of server connection string

Server attributes needed:

* IP address    
* Port number    
* Catalog name    

**Format:**   

*TCP:\[IP address]/\[Port number]*

*Database name: \[Catalog name]*



![Database server details](/img/databaseserverdetails.png "Database server details")

## Setting up tables for Tableau’s Superstore tutorial

If you’ve made it to this step, it means that your SQL/MX database has successfully connected to the Tableau software. Congratulations!

Now you can configure the relationship between the tables in this database.

![Shows a successful connection to database](/img/succesfulconnectiontodb.png "Shows a successful connection to database")

### Selecting tables for Superstore

Select the database and schema where you have created and populated the database. Click and drag the tables into the orange space indicated.

![Click and drag tables into the area](/img/dragtablesintothearea.png "Click and drag tables into the area")

### Creating relationships between tables

* Start with the “Orders” table, and then the “People” table    
* A line between the tables, and a box showing the relation between the tables will appear    
* Check the fields used to link the 2 tables together    
* Repeat with the “Returned” table and “Orders” table    



![Relationship between orders table and People table](/img/relationshiporderstable-peopletable.png "Relationship between orders table and People table")

Once completed, you should be all set. Now you can continue onto the Tableau tutorial [Step 2: Drag and Drop to take a first look](https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-drag.htm).

## Other data visualization tools that can work with SQL/MX

Tableau is not the only data visualization tool that works with HPE NonStop SQL/MX’s ODBC driver. Other applications such as Power BI, and even Excel, can also connect in a similar way to the HPE NonStop database.



![Popular data visualization tools](/img/populardatavisualizationtools.png "Popular data visualization tools")

It’s important to note that not only is HPE NonStop SQL/MX ANSI compliant, but it also adopts ODBC and JDBC standards, allowing effortless database connection with a state-of-the-art fault tolerance.

Don’t forget to check back frequently on the [HPE Developer Community portal](https://developer.hpe.com/) to find more information on HPE NonStop.