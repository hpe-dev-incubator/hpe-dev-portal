---
title: "Configuring threads for Optimal performance in HPE PowerShell Cmdlets"
date: 2018-12-03T07:06:34.687Z
author: Gokul Sreeramaiah 
tags: ["ilo-restful-api"]
path: configuring-threads-for-optimal-performance-in-hpe-powershell-cmdlets
---
Initially when HPE PowerShell cmdlets (1.x version) were launched it had a limit of 256 thread limit which was good for a certain range of IPs but was not sufficient for a big set of input IP data like more than 10k range. Then we re-designed the default thread limit to 64 in iLO and BIOS modules which received good feedback initially but later few customers reported that its slow performance when a big range of data is provided. Then we came up with the idea of configurable threads where on a particular PowerShell session users can configure the threads above default or below that value using Get-HPEXYZMaxThreadLimit and Set-HPEXYZMaxThreadLimit (XYZ - means module name like iLO or BIOS) cmdlets like always go for even exponential power of 2 number. For e.g., 64, 128, 256(default), 512, 1024, 2048, 4096 (Maximum).

Now the actual problem started customers does not know which thread limit they need to configure and with lack of knowledge they configure a higher limit on less capable hardware systems the result is lower performance. Even with optimal hardware many times you don't get good performance. Then we did a case study on this and found that just by increasing the thread limits will not give good performance as a lot of time is spent on switching the threads itself than doing the real job (Processing iLO IP's).

For e.g., Customer had 350 good iLO IP addresses in an input csv list with 256 threads he had below performance results compared to same input data with 64 max thread limit configured. Below the table of test data will show you how discovery and connect cmdlets took time under different max thread circumstances.  With more tests with different max thread configured it was evident that there is a mapping between input IP's and thread count configured that need to be maintained for optimal performance results. 

# Our team recommends 5:1 ratio needs to be maintained for fixed input of IP addresses (All reachable and good iLO's). 
i.e., For every 5 iLO IP addresses, one thread need to be configured is optimal. I mean if input IP count is 320 then optimal thread range you can have is 64 minimum threads. Anything more or less ( like 128 or 32) will result in not best performance results.

*Physical Server Configuration: BL460c Gen9 with 8 Core (Hyper-Threaded to 16), 32GB of memory, Network Card FlexFabric 10GB.*

| Tests | Version | Count | Total | Discovery | Connect | Disconnect | Server | MaxThread |
|-------|---------|-------|-------|-----------|---------|------------|--------|-----------|
| Test1 | 2.1     | 346   | 01:33   | 00:37  | 00:22   | 00:03  | 00:29  | 64     |
| Test2 | 2.1     | 346   | 02:34   | 00:43  | 00:29   | 00:05  | 01:15  | 256   |
| Test3 | 2.1     | 346   | 02:39   | 00:40  | 00:35   | 00:05  | 01:18  | 512   |

What if you have input data in terms of range like 192.168.10.0-255 ( means 256 IP's) or 192.168.10-12 ( means 768 IP's) that is given as input range to any of our cmdlets then the above 5:1 ratio may not hold good as in the above case customer is not sure which ones are iLO in the above range. In this case, higher max thread limit will give better performance results. Below data will give more insights. 

*Physical Server Configuration: BL460c Gen9 with 8 Core (Hyper-Threaded to 16), 32GB of memory, Network Card FlexFabric 10GB.*

| Tests | Version | Count | Total | Discovery | Connect | Disconnect | Server | MaxThread |
|-------|---------|-------|-------|-----------|---------|------------|--------|-----------|
| Test1 | 2.1     | 118   | 02:12   | 01:36  | 00:23   | 00:01  | 00:11  | 64     |
| Test2 | 2.1     | 119   | 01:49   | 01:16  | 00:18   | 00:01  | 00:12  | 256   |
| Test3 | 2.1     | 119   | 00:43   | 00:43  | 00:19   | 00:01  | 00:12  | 512   |

You can see as Max threads limit is increased the Total time taken column is reducing that means we are getting better performance results with higher thread limit which was not the case with above numbers where we had only good iLO's. 

So the bottom line is depending on the type of input IP addresses the customer has one need to decide the Max Thread limit configuration. Of course, your host hardware needs to have sufficient CPU and RAM to support higher thread configurations. I hope this will help customers who want to use a large range of IP's in their environment to choose the Max Thread limit accordingly. (Default is 256)

Note: Performance numbers taken above will depend on various factors like network (LAN\WAN) load, iLO server load at that point of time. These numbers are only for reference purpose please don't take them as ideal figures for Max thread limit.
