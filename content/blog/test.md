---
title: Test
date: 2022-10-12T17:54:28.045Z
author: Didier Lalli
authorimage: /img/Avatar1.svg
thumbnailimage: /img/didier-lalli.png
---
<style>
ul li{
 font-size:24px;
}
i { 
  color: grey; }
</style>

<style>
li {
    font-size: 27px;
    line-height: 33px;
    max-width: none;
}
</style>

This is a paragraph of text for testing:

* This is a list item
* another
* a last one

This another paragraph

* Orange
* Green
* Blue

<font size="3"> *Apache® and Apache Spark™ are either registered trademarks or trademarks of the Apache Software Foundation in the United States and/or other countries. No endorsement by the Apache Software Foundation is implied by the use of these marks.* </font>

*greenlake_audit_events_facts* - Get details of audit events

*greenlake_host* - Manage host

*greenlake_host_facts -* Get details of a host

*greenlake_host_group -* Manage host group

<br />
 ﻿   
<style>
table {
    display: block;
    width: max-content !important;
    max-width: 100%;
    overflow: auto;
     -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border:1px solid grey;
}
td {
   -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border:1px solid grey;
    text-align: left !important;
     font-weight: normal !important;
    padding: 10px !important;
}
thead tr:first-child td {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  border:1px solid grey;
  text-align: center !important;
  padding: 20px !important;
  font-weight: bold !important;
}
</style>



```markdown
import IO;
import Map.map as map;
import Set.set;
import Sort;
import Regex.regex;
import ArgumentParser;

proc countUniqueWarnings(ref warningsMap: map(string, ?t), inputFileReader: IO.fileReader(?)) where t == (int, set(string)){
  // A pattern of a typical warning line
  // Ex: filename.chpl:lineNumber: warning message blah
  const warningRegex = new regex("(.*.chpl|<command-line arg>):\\d+: (.*)\n"); // Anything inside ( ) is a capture group
  var warning : string;
  var fileName: string;
  for (fullMatch, fileNameMatch, warningMatch) in inputFileReader.matches(warningRegex, captures=2) {
    inputFileReader.extractMatch(warningMatch, warning);
    inputFileReader.extractMatch(fileNameMatch, fileName);
    // Check if the string mentions that something is unstable
    // If so, add it to the map
    if !containsUnstableWarning(warning) then
      continue;
    warning = anonymizeWarning(warning);
    if warningsMap.contains(warning) {
      warningsMap[warning][0] += 1;
    } else {
      warningsMap[warning][0] = 1;
    }
    warningsMap[warning][1].add(fileName); // Add the fileName to the set of files that have this warning
  }
}

proc containsUnstableWarning(warning: string) : bool {
  // Check if the string mentions that something is unstable
  return warning.find("unstable") != -1 || warning.find("enum-to-bool") != -1 ||
         warning.find("enum-to-float") != -1;
}
```

| Date          | Title                             | Speaker           | Webinar Link                                                                                            | Early Access Link                                                                         |
| ------------- | --------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **10-Nov-22** | **HPE GreenLake for Data Fabric** | **Alaric Thomas** | **[Register to Webinar](https://hpe.zoom.us/webinar/register/1016631597484/WN_xLR2ynonSi6SojUswkVmRw)** | **[Sign up for Early Access](https://connect.hpe.com/HPEGreenLakeEarlyAccessDataFabric)** |
| 17-Nov-22     | HPE Ezmeral Unified Analytics     | Terry Chiang      | [Register to Webinar](https://hpe.zoom.us/webinar/register/7516631596092/WN_qEWHxuucTa-UilEnOqmByg)     | [Sign up for Early Access](https://connect.hpe.com/HPEEzmeralEarlyAccessUnifiedAnalytics) |

- - -

- - -

<br />

| Date          | Title                             | Speaker           | Webinar Link                                                                                            | Early Access Link                                                                         |
| ------------- | --------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **10-Nov-22** | **HPE GreenLake for Data Fabric** | **Alaric Thomas** | **[Register to Webinar](https://hpe.zoom.us/webinar/register/1016631597484/WN_xLR2ynonSi6SojUswkVmRw)** | **[Sign up for Early Access](https://connect.hpe.com/HPEGreenLakeEarlyAccessDataFabric)** |
| 17-Nov-22     | HPE Ezmeral Unified Analytics     | Terry Chiang      | [Register to Webinar](https://hpe.zoom.us/webinar/register/7516631596092/WN_qEWHxuucTa-UilEnOqmByg)     | [Sign up for Early Access](https://connect.hpe.com/HPEEzmeralEarlyAccessUnifiedAnalytics) |