---
title: Use Redfish and IPv6 to find lost servers
date: 2024-11-20T16:32:49.809Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
disable: false
tags:
  - iLO RESTful API
  - Redfish
---
<style> li { font-size: 27px; line-height: 35px; max-width: none; } </style>

<style> figcaption {font-style: italic; font-size: 15px; line-height: 33px; max-width: none;} </style>

## Introduction

Have you ever moved one or more servers from a Local Area Network (LAN) to another without configuring the target network detail before the move ?
Perhaps some servers in the corporate network `10.1.2.0/24` have been moved to the lab network `19.168.1.0/22`.
I am sure the answer is yes. As a result, the servers that have been moved are unreachable and could just as well be expensive bricks!

This blog post presents a procedure to recover from this unpleasant situation with the help of the
<a href="https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.6" target="_blank">IPv6 link local address</a> of the affected iLO network ports. I will also explain what an IPv6 link local is.

## Prerequisites

The [recovery process](#recovery-process) presented below is suitable for both the dedicated and the shared iLO network ports of lost iLOs. In this post, it is assumed that access to a system connected to the same LAN as the affected iLOs is possible. This system is called the "brick-saver" throughout of this blog post. During my tests, I used a Linux brick-saver, but I am convinced that Microsoft Windows or Apple macOS could have used it as well.

In this post, it is also assumed that it is not possible to change the brick-saver network configuration to match the LAN settings of lost iLOs. If that is not the case, this article is not relevant.

When the Media Access Control (MAC) address of impacted iLOs is unknown, an operator must be able to access and manipulate iLO cables and power buttons of the affected servers.

Then, in order to re-program the network configuration of lost iLOs, you must have the credentials of a privileged user in each of them. This user could be the factory administrator account and associated password mentioned on the "toe-tag" present on the front panel of HPE servers.

> TIP:<br>
> If you know that the Link Layer Discovery Protocol (<a href="https://standards.ieee.org/standard/802_1AB-2005.html" target="_blank">LLDP</a>) is enabled in lost iLOs (<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_changelog/#schema-updates"
> target="_blank">iLO 6</a>
> and later) and you have a mean to collect LLDP information, save their `ManagementAddressIPv6` property in a list. It contains their link local address. With this list, the recovery process is shorter.
> The next screenshot shows the content of an LLDP transmit object sent
> over the network by an HPE iLO 6.

![Figure 1: Link local address in LLDP transmit object](/img/fig1-lldp-transmit.png "Figure 1: Link local address in LLDP transmit object")

<figcaption>Figure 1: Link local address in LLDP transmit object</figcaption>

## IPv6 basics

If you are already familiar with IPv6, link local, and multicast pre-defined addresses like `FF02::1%ZoneId`, you can skip this paragraph and go directly to the [Recovery process](#recovery-process) section.

The basic IPv6 architecture is described in Request For Comments (RFC) <a href="https://datatracker.ietf.org/doc/html/rfc4291" target="_blank">4291</a>.
Briefly, IPv6 addresses are 128 bit long with the colon (":") character
separating eight chunks of sixteen bits. Each chunk is represented by four hexadecimal digits (i.e. `2001:1890:1109:4110:9618:82FF:FE71:D01E`).

Contiguous chunks of zeros can be compressed and represented with "::".
Moreover, leading zeros can be omitted.
As an example, `2001:0DB8:0000:0000:0008:0800:200C:417A` can be represented as `2001:DB8::8:800:200C:417A`.

IPv6 addresses are made of two parts: a subnet prefix and an identifier on the subnet. The
text representation of subnet prefixes has the form `IPv6-Address/subnet-prefix-length`, which is similar to the Classless Inter-Domain
Routing <a href="https://datatracker.ietf.org/doc/html/rfc1519" target="_blank">(CIDR)</a> representation of IPv4 addresses.

With this in mind, `2001:1890:1109:4110:9618:82FF:FE71:D01E/64` is the text representation of subnet prefix `2001:1890:1109:4110::/64`
and identifier `9618:82FF:FE71:D01E`.

### IPv6 link local addresses

The recovery process presented in this blog post is entirely based on IPv6 link local addresses.
Hence, it is important to fully understand what they are and how to use them.

IPv6 link local addresses are also defined in
<a href="https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.6"
target="_blank">RFC 4291</a>.
They are called "link local" because packets coming from or going to such addresses cannot be forwarded to external networks.
They must stay on the same physical link.

When IPv6 is enabled in an Operating System (OS),
network interfaces autoconfigure using the
well known prefix `FE80::/10` and the MAC address, as explained in the
<a href="https://datatracker.ietf.org/doc/html/rfc4862#section-5.3"
target="_blank">IPv6 Stateless Address Autoconfiguration</a> (SLAAC)
RFC.

Other link local autoconfiguration methods exist.
<a href="https://datatracker.ietf.org/doc/html/rfc8981" target="_blank">RFC 8981</a>
describes a temporary address creation that is used by Microsoft Windows
on personal computers to make them harder to find. This RFC is not implemented in HPE iLOs.

Then, <a href="https://datatracker.ietf.org/doc/html/rfc7217" target="_blank">RFC 7217</a>
proposes a method for generating opaque interface identifiers. This RFC is implemented in
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_161/ilo6_network_resourcedefns161/#oemhpeipv6"
target="_blank">modern versions</a> of iLO 6 and later, but disabled by default.

IPv6 is enabled in the HPE iLO OS kernel and cannot be disabled. This is by design. Hence, the configured
management interface (dedicated or shared) autoconfigures as soon as it is physically connected to a network.
By default, the link local autoconfiguration process transforms the MAC address into an
<a href="https://standards.ieee.org/faqs/regauth/" target="_blank">IEEE EUI-64</a> address.
Simply explained, this process consists of stretching the MAC address from 48 bits to 64 bits by inserting `FF:FE` in one place
and inverting the universal/local bit of the MAC address. Refer to Appendix A of
<a href="https://datatracker.ietf.org/doc/html/rfc4291" target="_blank">RFC 4291</a> for more detail.

The following two examples retrieve the EUI-64 link local address of a
dedicated iLO 6 network port, its MAC address and the value of the
`RFC7217Enabled` property. Notice the `FF:FE` string in the link
local address and the similarity between the identifier and the
MAC address.

```shell
# iLOrest example
ilorest login ilo-lio365g11-1 -u <username> -p password
ilorest get IPv6Addresses/Address MACAddress Oem/Hpe/IPv6/RFC7217Enabled  \
        --select EthernetInterface.                                       \
        --filter Name="Manager Dedicated*" --json

{
  "IPv6Addresses": [
    {
      "Address": "FE80::5EED:8CFF:FE01:D7C"
    }
  ],
  "MACAddress": "5C:ED:8C:01:0D:7C",
  "Oem": {
    "Hpe": {
      "IPv6": {
        "RFC7217Enabled": false
      }
    }
  }
}
ilorest logout
```

```shell
# Same example with cURL
curl --noproxy \* --insecure --silent --location --user <ilo-user>:password  \
     https://ilo-lio365g11-1/redfish/v1/Managers/1/EthernetInterfaces/1 |    \
     jq '{"MACAddress":.MACAddress, "IPv6Address":.IPv6Addresses[].Address, "RFC7217Enabled": .Oem.Hpe.IPv6.RFC7217Enabled}'

{
  "MACAddress": "5C:ED:8C:01:0D:7C",
  "IPv6Address": "FE80::5EED:8CFF:FE01:D7C",
  "RFC7217Enabled": false
}
```

The following example retrieves the same properties as in the previous
example, but against an iLO with the `RFC7217Enabled` property set
to `true`. In this example, the link local address does not contain
the `FF:FE` string and the identifier has no similarities with the MAC address.

```shell
ilorest login ilo-lio365g11-2 -u <username> -p password
ilorest get IPv6Addresses/Address MACAddress Oem/Hpe/IPv6/RFC7217Enabled  \
        --select EthernetInterface.                                       \
        --filter Name="Manager Dedicated*" --json
{
  "IPv6Addresses": [
    {
      "Address": "FE80::8751:5A51:F30F:F676"
    }
  ],
  "MACAddress": "5C:ED:8C:01:0E:BE",
  "Oem": {
    "Hpe": {
      "IPv6": {
        "RFC7217Enabled": true
      }
    }
  }
}
ilorest logout
```

### How to completely disable IPv6 in iLO?

This question is a bit aside of the core subject of this blog post, but, as it is
a recurrent question and there is enough information to answer it clearly in this blog post, I thought I would answer it here.

The answer is: *Disable DHCPv6 as well as SLAAC* as shown in Figure 1 below.
I can hear you reply that you did that, but you still can see the link local address
like in Figure 1 below. This is expected.

As stated previously, SLAAC is always enabled in the iLO OS kernel, and cannot be disabled.
As a consequence, the IPv6 link local SLAAC address is always present in both the iLO Graphical User Interface (GUI),
and Redfish responses. However, you will not find any SLAAC addresses resulting of an
<a href="https://radvd.litech.org/" target="_blank">advertised prefix</a> or a DHCP server.

![Figure 2: SLAAC link local visible when SLAAC disabled](/img/fig2-ipv6-link-local.png "Figure 2: SLAAC link local visible when SLAAC disabled")

<figcaption>Figure 2: SLAAC link local visible when SLAAC disabled</figcaption>

### How to compute an EUI-64 link local

The easiest method to compute the EUI-64 link local address using a MAC address
is with the `ipv6calc`
<a href="https://www.deepspace6.net/projects/ipv6calc.html"
target="_blank">utility</a>. Use your favorite package installer on modern Linux
systems or compile the sources on Microsoft Windows to make it work.

The following block of code transforms a MAC address into its EUI-64 equivalent.
By prepending `FE80::` to the output of the `ipv6calc` command,
you will get the complete SLAAC link-local address (second command of next example).

```shell
ipv6calc --quiet --in mac 94:18:82:71:A0:7A --out eui64
9618:82ff:fe71:a07a

echo -n "fe80::" ; ipv6calc --quiet --in mac 94:18:82:71:A0:7A --out eui64
fe80::9618:82ff:fe71:a07a
```

### Zone indexes

From your brick-saver, when you want to initiate a communication with a link-local IPv6 address,
you will have to tell the operating system the network interface to use to send the packets.
The reason is because addresses starting with the `FE80::/10` prefix are present on all
the networks directly connected to the system.

You can retrieve the zone indexes (also called interface indexes) used by your brick-saver
with the following Windows PowerShell command:
`Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object Name, InterfaceIndex`.
The output is generally an integer.

The equivalent on Linux is:
`ip link list | awk -F: '/LOWER_UP/ {print $2}'`. The output is generally a string like `eth0`, `eno2` or `enp1s0f4u4`.

Once you have identified the interface to go through, the complete URL representation of a lost iLO IPv6 target is:
`https://[ip:v6::address%IZoneIndex]:PortNumber`

Although this syntax is standard, most browsers (Chrome, Brave, Firefox, Edge) don't support it. They don't consider this string as a valid URL that
they should follow, but as a string to search on the Internet.

However, command line tools like `cURL`,
<a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest"
target="_blank">HPE iLOrest</a>,
the `Invoke-WebRequest` and `Invoke-RestMethod` PowerShell Cmdlets support it. Here are some examples that retrieve the IPv4 configuration of the iLO dedicated
network port using the IPv6 link local address and zone index.

```shell
curl --noproxy \* --insecure --silent --location \
     --user username:password                    \
     https://[FE80::9618:82FF:FE71:A07B%eno1]/redfish/v1/Managers/1/EthernetInterfaces/1 | \
     jq '.IPv4Addresses[]'
{
  "Address": "192.168.1.45",
  "AddressOrigin": "Static",
  "Gateway": "192.168.1.1",
  "SubnetMask": "255.255.252.0"
}
```

```shell
ilorest login https://[FE80::9618:82FF:FE71:A07B%eno1] -u <username> -p password
ilorest select EthernetInterface.
ilorest get Ipv4Addresses --filter Name="Manager Dedicated*" --json
{
  "IPv4Addresses": [
    {
      "Address": "192.168.1.45",
      "AddressOrigin": "Static",
      "Gateway": "192.168.1.1",
      "SubnetMask": "255.255.252.0"
    }
  ]
}

ilorest logout
```

```shell
# Use of PowerShell core (7) and Redfish basic authentication
$Credentials = "username:password"
$base64EncodedCreds = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Credentials))
$Headers = @{}
$Headers["Content-Type"] = "application/json"
$Headers["Authorization"] = "Basic $base64EncodedCreds"

$Ipv6Address="FE80::9618:82FF:FE71:A07B%22"
$Uri="https://[$Ipv6Address]/redfish/v1/Managers/1/EthernetInterfaces/1"

$response = Invoke-WebRequest -Uri $Uri -Method GET -Headers $Headers -SkipCertificateCheck
$JsonResponse = $response.Content | ConvertFrom-Json
$JsonResponse.IPv4Addresses
Address      AddressOrigin Gateway     SubnetMask
-------      ------------- -------     ----------
192.168.1.47 Static        192.168.1.1 255.255.252.0
```

### Multicast addresses

An important concept in IPv6 is the absence of broadcast addresses. Instead, IPv6 uses multicast addresses. The exhaustive list of the pre-defined multicast addresses is present in <a href="https://datatracker.ietf.org/doc/html/rfc4291#section-2.7.1" target="_blank">RFC 4291</a>. Among them is the all nodes `FF02::1` address.

From you brick-saver, when you issue a `ping FF02::1%Index` command, each and every IPv6 interfaces present on the LAN must reply with their link local address.
By doing so, you can build the table of all your IPv6 neighbors. You will find more detail on how to use this table in the second scenario below.

## Recovery process

The recovery process presented in this blog post relies entirely on EUI-64 IPv6 link local addresses, and thus on MAC addresses. If you don't have
the list of the affected iLO MAC addresses, you need to go through the next paragraph.

If you have that list and your systems are iLO 5 based or later with
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_161/ilo6_network_resourcedefns161/#oemhpeipv6"
target="_blank">RFC7217</a>
disabled, you can skip the next paragraph and study the second scenario.

### MAC address discovery

The lost iLOs MAC address discovery is performed with the IPv6 neighbor table maintained in your brick-saver.

The overall method used is the following:

1. Make sure affected servers are powered on. This step can only be done by a human being present in the computer room. Then, hide their iLO port from the network by physically disconnecting the network cable. You could unplug the server power cables to achieve this goal, but this would also hide OS interfaces connected to the management LAN. Those interfaces would then re-appear in step 5 below, although they are not iLO interfaces and alter the discovered MAC address list.
2. Connect to your brick-saver, flush the neighbor table, solicitate IPv6 neighbors and save the table in a file.

   ```shell
   # Interface `eno1` is connected to the management network
   ip -6 neigh flush dev eno1  # Flush interface eno1's neighbor table
   ping -6 -c 3 ff02::1%eno1   # Start neighbor solicitation
   sleep 15                    # Wait for solicitation process to finish
   ip -6 neigh show dev eno1 | \
      sort -u  > File1.txt     # Sort neighbor table and save it
   ```

3. Reconnect affected iLO cables.
4. Repeat step 2.

   ```shell
   # Interface `eno1` is connected to the management network
   ip -6 neigh flush dev eno1  # Flush interface eno1 neighbor table
   ping -6 -c 3 ff02::1%eno1   # Start neighbor solicitation
   sleep 15                    # Wait for neighbor solicitation to finish
   ip -6 neigh show dev eno1 | \
      sort -u  > File2.txt     # Sort neighbor table and save it
   ```

5. The list of affected iLO link local and MAC addresses is obtained by computing the difference of the files saved in steps 2 and 4.

   ```shell
   # The following command stores discovered link local IPv6 addresses
   # in variable LL_LIST
   LL_LIST=$(diff File1.txt File2.txt | awk '/^>/ {print $2}')
   echo $LL_LIST
   fe80::5eed:8cff:fe01:d7c fe80::4645:c007:6bc2:bac6 fe80::5eed:8cff:fe6b:617
   ```

6. You should verify that the list collected above contains Redfish conformant addresses and only
   Redfish conformant addresses.
   This can be done by performing a GET request toward each IPv6 link-local
   and extract their `RedfishVersion` property. If the list contains a non-redfish conformant address,
   the following `cURL/jq` commands will report an error.

   ```shell
   for ll in $LL_LIST ; do
     curl --proxy \* --insecure --silent https://[${ll}%eno1]/redfish/v1 | \
     jq '.RedfishVersion'
   done
   "1.20.0"
   parse error: Invalid numeric literal at line 1, column 10
   "1.13.0"
   ```

If your brick-saver is running Microsoft Windows, here are some hints
to perform the above procedure.

```shell
# Start a privileged PowerShell session and retrieve Zone indexes
Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object Name, InterfaceIndex

# Show neighbors:
netsh interface ipv6 show neighbors interface=22 > File.txt

# Delete neighbor table
netsh interface ipv6 delete neighbors interface=22

# Populate neighbor table
Test-Connection -Count 1 -ComputerName ff02::1%22

Compare-Object (Get-Content File1.txt) (Get-Content File2.txt) |  Where-Object { $_.SideIndicator -eq '=>' } | Select-Object InputObject
```

### Known MAC addresses and RFC 7217 disabled

If you have the list of lost MAC addresses and you know that
<a href="https://datatracker.ietf.org/doc/html/rfc7217" target="_blank">RFC 7217</a>
is set to disabled, you just have to compute the corresponding IPv6 link-local addresses with the `ipv6calc`
tool and verify their accuracy.

> NOTE: RFC 7217 is disabled by default as explained [above](#ipv6-link-local-addresses).

The following example computes and stores IPv6 link local addresses
in a variable. Then it tests whether they correspond to a
Redfish conformant (iLO) address by requesting the property `RedfishVersion` from the
`ServiceRoot` URI.

```shell
MacList="5C:ED:8C:01:0D:7C 5C:ED:8C:6B:06:17"
LL_LIST="$(for mac in $MacList ;
              do echo -n "fe80::" ; ipv6calc --quiet --in mac $mac --out eui64
           done
         )"

for ll in $LL_LIST ; do
    curl --noproxy \* --insecure --silent https://[${ll}%eno1]/redfish/v1 | \
         jq '.RedfishVersion'
done
"1.20.0"
"1.13.0"
```

You can use iLOrest to verify that the computed list of link local addresses
corresponds to iLO addresses.
However, you will need to provide credentials, even for accessing the Redfish root URI.

```shell
u="ilo-user"
p="ilo-password"

for ll in $LL_LIST ; do
    ilorest --nologo login [${ll}%eno1] -u $u -p $p >/dev/null
    ilorest --nologo get RedfishVersion --select ServiceRoot
    ilorest --nologo logout >/dev/null
done
RedfishVersion=1.20.0
RedfishVersion=1.13.0
```

### Configuration recovery

The last step to completely recover from the lost iLOs is to re-configure their
network parameters. From the brick-saver, the following example
shows a generic PATCH request and its associated payload
to configure a minimal static IPv4 configuration of a lost iLO.

With the previous examples, it should be easy for you to adapt it
for iLOrest, cURL or PowerShell. Other examples for configuring iLO network
parameters are presented in the
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/examplecommandsscripts/#configure-ilo-ip-addresses"
target="_blank">documentation</a>.

```text
PATCH request URL
https://[FE80::9618:82FF:FE71:A07B%eno1]/redfish/v1/Managers/1/EthernetInterfaces/1/

Payload:

{
    "DHCPv4": {
        "DHCPEnabled": false,
        "UseDNSServers": false,
        "UseDomainName": false,
        "UseGateway": false,
        "UseNTPServers": false,
        "UseStaticRoutes": false
    },
    "IPv4StaticAddresses": [
        {
            "Address": "192.168.1.44",
            "Gateway": "192.168.1.1",
            "SubnetMask": "255.255.252.0"
        }
    ]
}
```

## Conclusion

This article presented a method with simple PowerShell and Linux commands
to find lost servers after a
move from one network to another without any configuration preparation prior to the move.

As this method uses IPv6, many of its concepts have been introduced,
including its autoconfiguration process. If you like more detail on autoconfiguration,
I would suggest to read the corresponding section I wrote some time ago in the
<a href="https://ipj.dreamhosters.com/wp-content/uploads/issues/2004/ipj07-2.pdf"
target="_blank">Internet Protocol Journal</a>.

And don't forget to check out some of my other
<a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a>
on the HPE Developer portal to learn more about Redfish tips and tricks.