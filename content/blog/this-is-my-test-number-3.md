---
title: This is my test number 3
date: 2021-07-21T18:59:41.403Z
author: Denis Choukroun
authorimage: /img/Avatar1.svg
tags:
  - hpe-ezmeral-data-fabric
---
This is my test number 3

This is my edits.

Thsi is my edits incorporated as per the change reviews in github..



```markdown
code test
```

```scala
// Return the first element in this RDD
ebay.first()
//res7: Auction = Auction(8213034705,95.0,2.927373,jake7870,0,95.0,117.5,xbox,3)
// Return the number of elements in the RDD
ebay.count()
res8: Long = 10654
```

<pre>
<font color="green">// Return the first element in this RDD</font>
ebay.first()
<font color="#005CB9">//res7: Auction = Auction(8213034705,95.0,2.927373,jake7870,0,95.0,117.5,xbox,3)</font>
<font color="green">// Return the number of elements in the RDD</font>
ebay.count()
res8: Long = 10654
</pre>

## Integrating ServiceNow with HPE GreenLake for private cloud

* From HPE GreenLake Central, locate the HPE GreenLake for private cloud service card and click the Launch icon to open the HPE GreenLake for private cloud dashboard
* Navigate to Administration > Integrations
* From the NEW INTEGRATION drop-down list, select ITSM ServiceNow
* The NEW SERVICENOW INTEGRATION dialog box opens
* From the dialog box, configure the ServiceNow integration parameters
  * Name - Enter the integration name
  * ENABLED - Select to enable consumption of this ServiceNow integration in HPE GreenLake for private cloud. The integration is enabled by default
  * SERVICE NOW HOST-Enter the ServiceNow instance host URL (example: https://your.instance.service-now.com).
  * USER - Enter a ServiceNow user that has below roles
     * catalog_admin
     * itil
     * rest_service
     * import_transformer
     * xmodamorpheus_ca.integration
  * PASSWORD -- Password of above-mentioned user
  * Optional variables (CMDB CUSTOM MAPPING, CMDB CLASS MAPPING DEFAULT CMDB BUSINESS CLASS) not required for this use case
* Click SAVE CHANGES

The ServiceNow integration is now displayed in the list of integrations. Sample integration summary
