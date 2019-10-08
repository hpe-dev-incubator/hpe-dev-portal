---
title: Using HPE OneSphere C++ Package
date: 2018-09-25T13:28:47.798Z
author: Matthew Jeong  
tags: ["Javascript","HPE-OneSphere","GettingStarted","API"]
path: using-hpe-onesphere-c-package
---
## Summary
In previous articles we covered [Getting Started with HPE OneSphere Programming](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API](https://developer.hpe.com/blog/authenticating-against-hpe-onesphere-api). In these articles, we discovered HPE OneSphere's API through an essential API development tool known as Postman. In this article, we will cover the basics of the [HPE OneSphere C++ package](https://github.com/HewlettPackard/hpe-onesphere-cpp) by creating a C++ application.
## Why C++
As one of the most popular programming languages, C++ is known for its speed and efficiency, being used often in back-end oriented programming such as software infrastructure.  When dealing with resource-constraints or performance optimization, C++ is often the preferred programming language. While being lower-level means less quality of life features at times, proficiency in C++ allows for the ability to write very fast code that is more “lean.”
## Dependencies
### nlohmann
For this example, we’ll be using Visual Studio to build our project and help us install libcurl. The C++ language binding uses the nlohmann JSON library and libcurl to handle http requests.  The JSON library, nlohmann, is relatively easy to install, as it is contained in a single .h header file. Before we continue, we should make a Visual Studio project so we have a place to move the new files. Go to your new project folder (the subdirectory of the outer project folder, not the one with the .sln file), and first add an nlohmann folder to the project directory. Once you add the new folder, add the json.hpp file you downloaded to that folder. In Visual Studio, go to the project tab, then add existing item and select json.hpp. 
### Libcurl
Now that we have added our JSON library, we should start installing libcurl. Installing libcurl is more involved, as we need to utilize the VC command prompt to build the files. To start, we need to open the VC command prompt and navigate to the winbuild subdirectory in the downloaded curl folder. Now we can call nmake /f Makefile.vc mode=dll VC=15, which should then start the make process. Go to the builds folder in your curl folder and look for the newly generated files. There should be a folder called libcurl-vc15-x86-release-dll-ipv6-sspi-winssl that has a bin, include, and lib folder. In the lib folder that was generated, we want to take the libcurl.lib file and put it in the project folder. From the include folder, we need to take the curl folder and place it in the project folder. Finally, we also need the libcurl.dll from the bin folder in our project folder. Now that all the files are set up, go to the project tab and go to properties. In VC++ Directories, change the include path to the curl folder address and library directories to point to the project folder. In linker, then input, change the additional dependencies and add libcurl.lib as a new dependency. At this point, you should be able to add the .cpp and .h files from the C++ binding library github. Add them as existing items like you did for the json.hpp, and you should be able to do #include “osbinding.h” and compile successfully.
## Usage
We can use the C++ language binding by making an OSClient object and passing our host url, username, and password as parameters. The OSClient automatically posts a session in its constructor, so we can now make requests to any of the APIs. When we make a request, like doing GetProjects for example, the function returns a JSON object to us. If we want to print the output, we can use the .dump() method, with an optional indent parameter for readability. The sample code, for instance, makes an OSClient object, then does get requests for several APIs, dumping the results once it gets the JSON.
Example code:
````C++
int main() {
    OSClient client("https://onesphere-host-url", "username", "password");

    cout << "GetStatus: " + (client.GetStatus()).dump() << endl;
    cout << "GetConnectApp: " + (client.GetConnectApp()).dump() << endl;
    cout << "GetSession: " + (client.GetSession()).dump() << endl;
    cout << "GetAccount: " + (client.GetAccount()).dump() << endl;
    cout << "GetProviderTypes: " + (client.GetProviderTypes()).dump() << endl;
    cout << "GetZoneTypes: " + (client.GetZoneTypes()).dump() << endl;
    cout << "GetServiceTypes: " + (client.GetServiceTypes()).dump() << endl;
    cout << "GetRoles: " + (client.GetRoles()).dump() << endl;
    cout << "GetUsers: " + (client.GetUsers()).dump() << endl;
    cout << "GetTagKeys: " + (client.GetTagKeys()).dump() << endl;
    cout << "GetTags: " + (client.GetTags()).dump() << endl;

    return 0;
}
````
## Next Steps
Now that you know how to setup and use the C++ language binding, you can start exploring the OneSphere API routes with the interactive API guide.  If you are already a OneSphere customer, you can use the https://my-instance-name.hpeonesphere.com/docs/api/ URL to see your own fully interactive API guide. If not you can use [HPE DEV Portal](https://developer.hpe.com/api/onesphere/) for this. If you would like to try something else, you can also explore our GO, Javascript, Python, or PowerShell language bindings too.
