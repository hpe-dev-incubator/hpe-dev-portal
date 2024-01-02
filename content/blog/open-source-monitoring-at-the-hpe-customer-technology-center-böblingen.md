---
title: Open Source Monitoring at the HPE Customer Technology Center Böblingen
date: 2024-01-31T08:39:46.474Z
author: "Thomas Beha "
authorimage: /img/tb10092023.jpg
disable: false
---
## **T﻿he Challenge**

<!--StartFragment-->

T﻿he HPE Customer Technology Center (CTC ) Böblingen is a customer visit center in Germany where a wide range of HPE solutions are demonstrated. The core infrastructure of the CTC, based on HPE SimpliVity,  is monitored (perfomance, capacity and uptime) already for some time using Prometheus and Grafana for the visualization. The implementation of the SimpliVity Prometheus connector was described in the [HPE SimpliVity Prometheus connector whitepaper.](https://www.hpe.com/psnow/doc/a50000514enw)   This monitoring environment was extended over time with the [HPE array exporter](https://github.com/hpe-storage/array-exporter) for HPE storage arrays (HPE Alletra 6000, HPE Alletra 9000 and HPE Alletra MP).

In the last summers we did face the challenge, that the initially planned cooling capacity was not sufficient for the new generations of server and storage that we need to deploy in the CTC. As a consequence the lab temperature was rising to a level, that caused several incidents, where HPE ProLiant server automatically shut down to avoid damages.  In order to avoid this situation we were looking for a CTC lab temperature warning system that is easy to implement. An heads up of the rising temperature in the CTC would allow us to shutdown equipment that is currently not urgently needed for customer demos - helping us to ensure that the booked customer demos could still run.

<!--EndFragment-->

## **I﻿LO Redfish Interface as a solution?**



## **B﻿uilding the monitoring script**



### **C﻿ontainerize and add Prometheus and Grafana to visualize the status**



## **C﻿onclusion**