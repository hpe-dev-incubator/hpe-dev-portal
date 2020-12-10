---
title: "Understanding API basics and the value they provide "
date: 2019-12-03T16:58:32.501Z
author: Didier Lalli 
tags: []
path: understanding-api-basics-and-the-value-they-provide
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture1-1575393131999.png)

Over the course of my career, I’ve come across many technical colleagues who were experts on a given product or technology, but always from a user’s point of view. They knew how to design a solution, sell it to the customer, install it, and customize it to meet the customer’s requirements. And, sometimes, they could even debug rather difficult problems. Yet, when developers asked these technology experts about possible integration of their product with third-party software, or when they were pressed to provide scripts and automate processes, the technology experts were at a loss. They simply did not understand the product from a developer’s perspective. 

And for good reason. There’s a certain amount of magic that happens within an application done by the code itself. Many applications you work with today, on PCs, servers, or off in the cloud, include a hidden jewel called the Application Programming Interface (API). In a nutshell, an API makes it possible to interact with an application programmatically. This means that developers can integrate their application with your applications in a standardized way. This becomes very useful because it opens up a whole lot of new use cases and business opportunities. But in order for you to take advantage of these opportunities, you need to understand the product’s API well enough so that you can discuss its capabilities with developers.

## REST and HTTP

Exploring how you interact programmatically with a product is no easy task. Developers are more familiar with this exercise, but as a non-developer, you might wonder how to get started. The good news is that a de facto standard for building APIs has emerged in the last few years. It’s called REST (REpresentation State Transfer). Let me first explain what REST is, and then I’ll define a few important concepts used by REST APIs, such as HTTP and JSON.

Most of you are familiar with the terms HTTP (HyperText Transfer Protocol) and URL (Uniform Resource Locator) because you use a web browser every day. Yet you may not know how they relate to REST and APIs. REST is an architecture that uses a set of principles to describe how networked resources are defined and addressed, leveraging HTTP to build APIs. 

HTTP defines how messages are formatted and transmitted, as well as what actions Web servers should take in response to various commands. In HTTP, one uses verbs to describe an action that will apply to a given URL. When you launch a web browser, the implicit verb is GET. However, there are other verbs in the HTTP specifications such as POST, PUT, PATCH, and DELETE. REST APIs use these verbs to describe possible actions. The URL in a REST API call is, like in a browser, the target to which the verb must be applied. For example, ` GET http://google.com ` means "retrieve the content of the main index page at google.com, and render it in my browser window". 

Let’s review the most important HTTP verbs:
* GET – Retrieve object instance properties
* PUT/PATCH –Modify object instance properties (two different ways)
* POST – Create a new object instance
* DELETE - Remove an object instance 

## Passing data back and forth

When we know how to use an HTTP verb to describe an action, we can use a URL to point to something in the API, but we need a mechanism to exchange data with the application at the other end of the API. This mechanism is useful to create new items or to retrieve a list of items from the application. We use a couple of techniques to do this. The first technique uses something described by the HTTP specifications called HTTP headers. A header allows the attachment of information with the API call as a key/value pair of string. 

For example, you can add an  `Accept ` header with value ` application/json ` to tell the API to return the result in json. There is no standard for HTTP headers, but there are many well-known headers used by APIs such as Accept, Content-Type, X-API-Version, etc. Headers are useful for passing a simple text value. 

But what if you want to pass more data to your API? For this, you can use the HTTP message payload, the body of your HTTP call. This is typically used to specify the credentials to get access to an API.

## JSON

To pass data back and forth with an API, you need to make sure the client (calling the API) and the API agree on a format for this data. The most popular format nowadays is called JSON (for JavaScript Object Notation). JSON is a fairly readable machine language which typically looks like a series of Key/Value pairs separated with colons, with string values in quotes and multiple key/values separated with commas. The following is a simple example of a valid JSON snippet:


```json

{
“userName”: “foo@hpe.com”,
“password”: “super-secure-password”
}   
```

JSON is case sensitive, so make sure you have the key names right ("userName" is not the same as "username"). You can express complex values by nesting JSON values and by using square brackets to indicate a collection of similar items as shown below:


```json
{ “members”: [
                { “lastname”: “max”,
                 “firstname”: “mad”,
                 “age”: 50},
                {“lastname”: “james”,
                 “firstname”: “bond”,
                 “age”: 60}],
“count”: 2
}

```

An API might accept more than one format, and it may also provide responses in more than one format (JSON, XML, TEXT). Therefore, the convention is to use HTTP headers to specify which format you are going to use to pass data to the API (in your payload) and what data format you expect for the response. These headers are: 
* Accept: application/json (please provide me with a response in JSON) 
* Content-Type: application/json (I’m handing out a payload in JSON)

## Putting it all together
In summary, an API uses:
* A URL. It also uses the term URI (Uniform Resource Identifier) to specify an object ID or a class of objects
* A verb to specify what action to take on that URL/URI
* One or more HTTP headers to attach certain properties on the API call, such as what format to accept for the response
* A payload to pass data to the API

Let’s look at a few examples:

* GET http(s)://myAPIendpoint/rest/servers with HEADER Accept: application/json: Retrieves the list of servers from API endpoint http(s)://myAPIendpoint in JSON format 
* POST http(s)://myAPIendpoint/rest/servers with HEADER Content-Type: application/json and appropriate JSON payload: Creates a new object of type server
* DELETE  http(s)://myAPIendpoint/rest/servers/1212138349873: Deletes server object given provided UUID
## Postman to the rescue

Since a browser can only really handle GET, it is clearly not the appropriate tool for manipulating an API. The good news is that a fantastic tool called Postman exists, which comes with a free version you can use to explore APIs. Visit http://getpostman.com to find the version that works for you (Windows, Mac and Linux). Once installed, start Postman on your machine. You do not need to sign-in to use it for exploring APIs. But since Postman is more than just a client API tool, you’ll want to check out its full feature set. 

## Let’s find a sandbox to give it a try

__Note:__ Make sure you have access to the Internet for this next section.

Millions of APIs are available on the Internet today. Most of them are fee-based and require proper authentication, but a few free APIs are still available, which you can use with or without authentication. I selected a very simple one about a weather report, which doesn’t require authentication to use. You can look up more in this list to find another API, if you prefer: https://github.com/public-apis/public-apis

The API end-point is: https://www.metaweather.com/api/. According to the documentation, we first issue a call to find a location on Earth:

1. Querying API for WOEID of a city, such as Paris

In Postman, make sure the URL is set to https://www.metaweather.com/api/location/search/?query=Paris, and that GET is the selected verb before you hit Send to issue the API call. You can see in the response section that it is, indeed provided in JSON, which is somehow readable:


```
[{"title":"Paris","location_type":"City","woeid":615702,"latt_long":"48.856930,2.341200"}]
```

From the JSON response, we can extract the woeid (Where On Earth ID) for Paris (615702) and use this value to query for a weather report in Paris: 

2. Query API for weather report in Paris using WOEID


Still in Postman, make sure the URL is set to https://www.metaweather.com/api/location/615702/ and hit Send again:


```

{
    "consolidated_weather": [
        {
            "id": 6618427756118016,
            "weather_state_name": "Showers",
            "weather_state_abbr": "s",
            "wind_direction_compass": "W",
            "created": "2019-11-06T12:36:06.334166Z",
            "applicable_date": "2019-11-06",
            "min_temp": 8.605,
            "max_temp": 12.215,
            "the_temp": 11.875,
            "wind_speed": 4.475518589403219,
            "wind_direction": 277.3125549075835,
            "air_pressure": 1005.5,
            "humidity": 75,
            "visibility": 10.535348564383998,
            "predictability": 73
        },
        {
            "id": 5413015522377728,
            "weather_state_name": "Light Rain",
            "weather_state_abbr": "lr",
            "wind_direction_compass": "SW",
            "created": "2019-11-06T12:36:09.637230Z",
            "applicable_date": "2019-11-07",
            "min_temp": 7.0,
            "max_temp": 10.62,
            "the_temp": 10.41,
            "wind_speed": 8.787927365497495,
            "wind_direction": 230.868718440178,
            "air_pressure": 1000.0,
            "humidity": 68,
            "visibility": 15.52930883639545,
            "predictability": 75
        },
        {
            "id": 6503888796516352,
            "weather_state_name": "Showers",
            "weather_state_abbr": "s",
            "wind_direction_compass": "ESE",
            "created": "2019-11-06T12:36:12.628582Z",
            "applicable_date": "2019-11-08",
            "min_temp": 4.395,
            "max_temp": 9.465,
            "the_temp": 9.11,
            "wind_speed": 3.1676953831490766,
            "wind_direction": 119.31121355342638,
            "air_pressure": 1005.5,
            "humidity": 76,
            "visibility": 13.218118686868687,
            "predictability": 73
        },
        {
            "id": 6070183267401728,
            "weather_state_name": "Light Rain",
            "weather_state_abbr": "lr",
            "wind_direction_compass": "SW",
            "created": "2019-11-06T12:36:15.316626Z",
            "applicable_date": "2019-11-09",
            "min_temp": 4.02,
            "max_temp": 9.68,
            "the_temp": 9.61,
            "wind_speed": 4.867012487862881,
            "wind_direction": 224.66670428043918,
            "air_pressure": 1012.5,
            "humidity": 73,
            "visibility": 12.878850015907101,
            "predictability": 75
        },
        {
            "id": 5082031551676416,
            "weather_state_name": "Showers",
            "weather_state_abbr": "s",
            "wind_direction_compass": "WNW",
            "created": "2019-11-06T12:36:18.342176Z",
            "applicable_date": "2019-11-10",
            "min_temp": 4.32,
            "max_temp": 9.120000000000001,
            "the_temp": 9.379999999999999,
            "wind_speed": 5.455819375540178,
            "wind_direction": 286.2336385713633,
            "air_pressure": 1006.5,
            "humidity": 72,
            "visibility": 12.235109460749225,
            "predictability": 73
        },
        {
            "id": 6399005695148032,
            "weather_state_name": "Showers",
            "weather_state_abbr": "s",
            "wind_direction_compass": "W",
            "created": "2019-11-06T12:36:21.245629Z",
            "applicable_date": "2019-11-11",
            "min_temp": 4.1850000000000005,
            "max_temp": 8.07,
            "the_temp": 6.65,
            "wind_speed": 2.8226837270341205,
            "wind_direction": 267.5,
            "air_pressure": 1009.0,
            "humidity": 77,
            "visibility": 9.999726596675416,
            "predictability": 73
        }
    ],
    "time": "2019-11-06T14:45:55.699444+01:00",
    "sun_rise": "2019-11-06T07:44:50.213694+01:00",
    "sun_set": "2019-11-06T17:23:01.239529+01:00",
    "timezone_name": "LMT",
    "parent": {
        "title": "France",
        "location_type": "Country",
        "woeid": 23424819,
        "latt_long": "46.71,1.72"
    },
    "sources": [
        {
            "title": "BBC",
            "slug": "bbc",
            "url": "http://www.bbc.co.uk/weather/",
            "crawl_rate": 360
        },
        {
            "title": "Forecast.io",
            "slug": "forecast-io",
            "url": "http://forecast.io/",
            "crawl_rate": 480
        },
        {
            "title": "HAMweather",
            "slug": "hamweather",
            "url": "http://www.hamweather.com/",
            "crawl_rate": 360
        },
        {
            "title": "Met Office",
            "slug": "met-office",
            "url": "http://www.metoffice.gov.uk/",
            "crawl_rate": 180
        },
        {
            "title": "OpenWeatherMap",
            "slug": "openweathermap",
            "url": "http://openweathermap.org/",
            "crawl_rate": 360
        },
        {
            "title": "Weather Underground",
            "slug": "wunderground",
            "url": "https://www.wunderground.com/?apiref=fc30dc3cd224e19b",
            "crawl_rate": 720
        },
        {
            "title": "World Weather Online",
            "slug": "world-weather-online",
            "url": "http://www.worldweatheronline.com/",
            "crawl_rate": 360
        }
    ],
    "title": "Paris",
    "location_type": "City",
    "woeid": 615702,
    "latt_long": "48.856930,2.341200",
    "timezone": "Europe/Paris"
}

```

As you can see, a fair amount of information is provided by the API, including latitude, longitude, temperature, and weather conditions in Paris (which is not great at the moment by the way). As a developer, you could parse this JSON response and use it in your own application. 

## Now what?

Congratulations! You have placed your first API calls using Postman. This simple API only accepted GET calls, so one might argue everything could have been handled by a standard browser. The advantage of using Postman is that you can save your calls and start building collections of API calls that are useful in your job. We used a very limited API to get the weather report in Paris, but the exact same technique (using Postman) could be applied with other REST APIs, such as the ones from HPE OneView, HPE SimpliVity or HPE iLO. I plan on discussing these in future articles.

If you have questions or want to connect, you can reach me on Twitter [@DidierLalli.](https://twitter.com/DidierLalli) In addition, don’t forget to keep an eye out on the [HPE DEV blog site](https://developer.hpe.com/blog) for future articles on this topic. 