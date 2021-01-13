---
title: "Introducing the HPE Nimble Storage SDK for Python"
date: 2020-05-08T22:17:59.474Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage"]
path: introducing-the-hpe-nimble-storage-sdk-for-python
---
Python is by far one of the most approachable programming languages available today. Easy to read semantics, a humongous library for integrating with anything under the sun and best of all, it’s all open source, available on every popular operating system platform. Today, Hewlett Packard Enterprise (HPE) releases HPE Nimble Storage SDK for Python 1.0.0. It allows customers to extract even more value from their HPE Nimble Storage array by abstracting functionality into larger frameworks, whether it’s for custom automation, resource reporting, conformance adherence or any data the business might need to extract from the storage system in a programmatic fashion.

The software development kit (SDK) includes all public application programming interfaces (API) available via the Nimble OS REST API (REST stands for REpresentational State Transfer). It is now trivial to write both simple or intricate applications interfacing with Nimble OS. Historically, our Python users have used the popular Requests library to manipulate API resources on the array and we’ve now abstracted away that interaction to ultimately make it simpler and more structured to interface with Nimble OS. 

In this blog post, we’ll get you started with the SDK and show you how to write a simple asset reporting program to copy and paste into a spreadsheet. In a more realistic scenario, this data would’ve been inserted into an inventory and asset tracking system. 

# Getting started 
Like all Python libraries, the HPE Nimble Storage SDK for Python is hosted on PyPi, the Python Package Index. Most Python distributions come with the command line (CLI) tool, `pip`, to manage installations from PyPi. This tutorial assumes `pip` is already installed.  

From the CLI, install the SDK. 

```
pip install nimble-sdk 
``` 

**Note**: Python 3.6 or newer is required. If multiple Python distributions are installed on your system, make sure Python 3 is installed or suffix Python commands with a ‘3’, like `pip3` and `python3`. 

Let’s run an interactive example against a Nimble array and pull out a list of drives in the array. 

``` 
python3 
Python 3.7.7 (default, Mar 10 2020, 15:43:03) 
[Clang 11.0.0 (clang-1100.0.33.17)] on darwin 
Type "help", "copyright", "credits" or "license" for more information. 
>>> from nimbleclient import NimOSClient 
>>> import pprint
>>> client = NimOSClient("192.168.1.1", "admin", "admin”) 
>>> pprint.pprint(client.disks.list())
[<Disk(id=2c49686580b78e0b160001000000000a0000000100)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000200)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000300)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000400)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000500)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000600)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000700)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000800)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000900)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000a00)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000b00)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000c00)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000d00)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000e00)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000000f00)>,
 <Disk(id=2c49686580b78e0b160001000000000a0000001000)>]
``` 

Let’s pull out more info about a particular drive, in the same session. 

```
>>> pprint.pprint(client.disks.get("2c49686580b78e0b160001000000000a0000000c00").attrs)
{'array_id': '0949686580b78e0b16000000000000000000000001',
 'array_name': 'nva-test',
 'bank': 0,
 'block_type': 'block_unknown',
 'disk_internal_stat_1': '00e29a628e',
 'firmware_version': '1.0',
 'hba': 2,
 'id': '2c49686580b78e0b160001000000000a0000000c00',
 'is_dfc': False,
 'model': 'VMware Virtual S',
 'path': '/dev/sdm',
 'port': 8,
 'raid_id': 10,
 'raid_resync_average_speed': 0,
 'raid_resync_current_speed': 0,
 'raid_resync_percent': 100,
 'raid_state': 'okay',
 'serial': '/dev/sdm',
 'shelf_id': '2d49686580b78e0b16000000010000637300000013',
 'shelf_location': 'A.0',
 'shelf_location_id': 0,
 'shelf_serial': 'cs-19d266',
 'size': 39728447488,
 'slot': 12,
 'smart_attribute_list': [],
 'state': 'in use',
 'type': 'hdd',
 'vendor': 'Nimble',
 'vshelf_id': 0}
``` 

To get an idea of what APIs are available, hitting `<TAB>` in an interactive session, just before entering which resource to manipulate will list the available APIs. 

``` 
>>> client.<TAB> 
client.access_control_records           client.folders                          client.snapshot_collections 
client.active_directory_memberships     client.groups                           client.snapshots 
client.alarms                           client.initiator_groups                 client.software_versions 
client.application_categories           client.initiators                       client.space_domains 
client.application_servers              client.jobs                             client.subnets 
client.arrays                           client.key_managers                     client.support 
client.audit_log                        client.master_key                       client.tokens 
client.chap_users                       client.network_configs                  client.user_groups 
client.controllers                      client.network_interfaces               client.user_policies 
client.disks                            client.performance_policies             client.users 
client.events                           client.pools                            client.versions 
client.fibre_channel_configs            client.protection_schedules             client.volume_collections 
client.fibre_channel_initiator_aliases  client.protection_templates             client.volumes 
client.fibre_channel_interfaces         client.protocol_endpoints               client.witnesses 
client.fibre_channel_ports              client.replication_partners 
client.fibre_channel_sessions           client.shelves 
``` 

How to interact with each of these resources is available in the [documentation](https://hpe-storage.github.io/nimble-python-sdk) hosted on GitHub.

# Hello World 
Running Python interactively is practical to use as a sidekick when developing a new script to find attributes and other syntax minutia. Let’s write a real “Hello World” Python program that extracts some array meta data that is used to track inventory.  

``` 
#!/usr/bin/env python3

# Import the required modules
import argparse
from nimbleclient import NimOSClient

# The NimbleInventory class
class NimbleInventory:
    def __init__(self, username, password, arrays):
        self.inventory = {}
        self.username = username
        self.password = password
        self.arrays = arrays
        self.fetch()

    # Loop over requested arrays and gather the data
    def fetch(self):
        for array in self.arrays:
            try:
                api = NimOSClient(array, self.username, self.password)
                entry = api.arrays.get()
                self.inventory[entry.attrs.get('name')] = [entry.attrs.get('version'), 
                                           entry.attrs.get('extended_model'),
                                           entry.attrs.get('serial')]
            except:
                self.inventory[array] = ['n/a', 'n/a', 'n/a']

    # Print the list of arrays in a spreadsheet friendly manner
    def report(self):
        for xlsout in self.inventory:
            print ("{name}\t{version}\t{model}\t{serial}".format(name=xlsout, 
                                                         version=self.inventory[xlsout][0],
                                                         model=self.inventory[xlsout][1], 
                                                         serial=self.inventory[xlsout][2]))

# If called directly
if __name__ == '__main__':
    # Parse CLI arguments
    parser = argparse.ArgumentParser(description='Nimble array inspector')
    parser.add_argument('--username', required=True,
                    type=str, help='Nimble OS username')
    parser.add_argument('--password', required=True, 
                    type=str, help='Nimble OS password')
    parser.add_argument('--array', required=True, type=str, 
                    help='Nimble array hostname or IP address', nargs='+')
    args = parser.parse_args()

    # New inventory
    data = NimbleInventory(args.username, args.password, args.array)

    # Report 
    data.report()
``` 

Running the program against a set of arrays will produce something like the following (includes the syntax): 

``` 
./nimble_inventory.py --username admin --password admin --array nimble-array1 nimble-array2 nimble-array3 nimble-array4 
nimble-array1    5.1.3.100-668356-opt    Virtual-6G-12T-320F    cs-XXXXX 
nimble-array2    5.1.4.0-683149-opt    AF3000-2P-11T    AF-XXXXX 
nimble-array3    5.1.3.0-663613-opt    CS3000-2P-21T-1440F    AF-XXXXX 
nimble-array4    5.0.7.300-644174-opt    AF5000-2F-46T    AF-XXXXX 
``` 

> **Note:** If this would’ve been a real-world use case, a read-only user account would’ve been appropriate to set up on the targeted systems. 

# Next steps 
The HPE Nimble Storage SDK for Python source code and documentation links have been added to the HPE DEV portal [platform page for HPE Nimble Storage](https://developer.hpe.com/platform/hpe-nimble-storage/home), which makes it easy to find in the future. 

- [Source code](https://github.com/hpe-storage/nimble-python-sdk) on GitHub
- [Documentation](https://hpe-storage.github.io/nimble-python-sdk) hosted on GitHub Pages
- [Python package](https://pypi.org/project/nimble-sdk/) hosted on PyPi

Come hang out with us on our Slack community. HPE employees may sign up directly at [hpedev.slack.com](https://hpedev.slack.com), partners and customers need to signup at [slack.hpedev.io](https://slack.hpedev.io) first. Also, watch this space for future releases around software development kits for HPE Nimble Storage. There’s plenty of really exciting projects in the works. Stay tuned! 