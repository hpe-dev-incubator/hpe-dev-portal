---
title: " Introducing HPE Nimble Storage SDK for Go"
date: 2020-11-25T18:25:52.171Z
author: Michael Mattsson 
tags: []
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
In the cloud-native, API-first economy, the infrastructure platform relevance increases when gauged against how well it integrates with others. The Go Programming Language is considered to be the language of choice for the cloud and the building microservices. Many large, recognized open source projects use Go, such as Kubernetes, Docker, InfluxDB and Terraform. Some of the most successful companies in the new API economy use Go, including Uber, Netflix, Google, and of course, Hewlett Packard Enterprise (HPE). Go was invented by Google and designed to scale concurrency across networked systems and support large codebases, which many of the successful projects can attest to.

Today HPE introduces the HPE Nimble Storage SDK for Go. Built on top of the robust REST API available in NimbleOS, developers may take advantage of the full suite of APIs to build robust applications utilizing HPE Nimble Storage features and capabilities.

# Example usage

There are some more elaborate examples available [in the GitHub repo](https://github.com/hpe-storage/nimble-golang-sdk/tree/master/examples), but let's see a how a complete example program could work. Instructions on how to install Go on your computer is [available here](https://golang.org/doc/install).

Save this file to `createvolume.go`:

```go
package main

import (
	"fmt"
	"flag"
	"github.com/hpe-storage/nimble-golang-sdk/pkg/client/v1/nimbleos"
	"github.com/hpe-storage/nimble-golang-sdk/pkg/service"
)

func main() {

	// Input parameters
	groupParam      := flag.String("g", "myarray", "Nimble group `IP/hostname`")
	usernameParam   := flag.String("u", "admin", "Nimble array `username`")
	passwordParam   := flag.String("p", "admin", "Nimble array `password`")
	volumeNameParam := flag.String("v", "myvol", "Volume `name` to create")
	volumeSizeParam := flag.Int64("s", 5120, "Volume `size in MB`")

	// Parse flags
	flag.Parse()

	// Create new group service
	groupService, err := service.NewNsGroupService(
		*groupParam,
		*usernameParam,
		*passwordParam,
		"v1",
		true)

	if err != nil {
		fmt.Printf("Unable to connect to group, %+v\n", err.Error())
		return
	}

	// Logout when finished
	defer groupService.LogoutService()

	// Set mandatory volume attributes
	newVolume := &nimbleos.Volume{
		Name:	volumeNameParam,
		Size:	volumeSizeParam,
	}

	// Assign volume service instance
	volSvc := groupService.GetVolumeService()

	// Create volume
	volume, err := volSvc.CreateVolume(newVolume)

	if err != nil {
		fmt.Printf("Failed to create volume, %+v\n", err.Error())
		return
	}

	// Volume created
	fmt.Printf("Volume \"%s\" created (%s)\n", *volume.Name, *volume.ID)
}
```

Go is a compiled language, so, in order to run the example, it needs to be compiled:

```
go build createvolume.go
```

Now, we have the ability to create volumes from a remote command-line:

```
./createvolume -h
Usage of ./createvolume:
  -g IP/hostname
    	Nimble group IP/hostname (default "myarray")
  -p password
    	Nimble array password (default "admin")
  -s size in MB
    	Volume size in MB (default 5120)
  -u username
    	Nimble array username (default "admin")
  -v name
    	Volume name to create (default "myvol")
```

Let's create a new volume:

```
./createvolume -g myarray1.example.com -u admin -p admin -v myvol1 -s 10240
Volume "myvol1" created (06412618225c784ec900000000000000000000000b)
```

And that is how simple it is with only a few lines of code to create a custom CLI for a common operation.

> **Note:** It's extremely bad practice to use a password on the command-line, please use other means to supply the password to the SDK in a production scenario.

# Available endpoints

Each of the API endpoints available on the REST service is available to the SDK and is mapped from the plural version of the endpoint to the singular version of the service. For example, `v1/volumes` is accessible on `myService.GetVolumeService()` (`myService` being a `GroupService` object).

These are the currently available services in the SDK.

```
AccessControlRecordService		MasterKeyService
ActiveDirectoryMembershipService	NetworkConfigService
AlarmService				NetworkInterfaceService
ApplicationCategoryService		PerformancePolicyService
ApplicationServerService		PoolService
ArrayService				ProtectionScheduleService
AuditLogService				ProtectionTemplateService
ChapUserService				ProtocolEndpointService
ControllerService			ReplicationPartnerService
DiskService				ShelfService
EventService				SnapshotCollectionService
FibreChannelConfigService		SnapshotService
FibreChannelInitiatorAliasService	SoftwareVersionService
FibreChannelInterfaceService		SpaceDomainService
FibreChannelPortService			SubnetService
FibreChannelSessionService		TokenService
FolderService				UserGroupService
GroupService				UserService
InitiatorGroupService			VersionService
InitiatorService			VolumeCollectionService
JobService				VolumeService
```

The list of services will grow as new versions of NimbleOS introduce new features.

# Start writing code

The SDK is available immediately and we encourage feedback and collaboration. Check out the following resources to learn more.

- HPE Nimble Storage SDK for Go [on GitHub](https://github.com/hpe-storage/nimble-golang-sdk)
- [Learn Go](https://tour.golang.org/) from the official language creators
- Learn more about HPE Nimble Storage on [the HPE DEV platform page](https://developer.hpe.com/platform/hpe-nimble-storage/home)

The HPE Nimble Storage team hangs out on the HPE DEV Slack community in [#NimbleStorage](https://hpedev.slack.com/archives/C7TTAHRUN). Sign up at [slack.hpedev.io](https://slack.hpedev.io) and login to the Slack at [hpedev.slack.com](https://hpedev.slack.com). Please tell us what you're building!