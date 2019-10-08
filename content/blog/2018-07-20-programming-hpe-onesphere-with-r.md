---
title: Programming HPE OneSphere with R
date: 2018-07-20T08:36:28.735Z
author: agnieszka.luczak@hpe.com 
tags: ["hpe-onesphere","R","data-science","programming"]
path: programming-hpe-onesphere-with-r
---
## Summary

The Intent of this article is to give a brief description on how to use programming language R to access HPE OneSphere API.

## What’s R?

R is an object-oriented programming language used for statistical computing and graphics. You can download it from Comprehensive R Archive Network (CRAN) at http://cran.r-project.org.
To work better with R it is recommended to install R Studio from https://www.rstudio.com/ - a free and open-source development environment (available in two versions: as RStudio Desktop and RStudio Server).
Extended by thousands of user-created libraries, R is easy to integrate with other applications and systems. You can find its distributions for popular platforms – Windows, Linux and Mac. 
There are some statistical features that speak for R : wide variety of statistical and graphical techniques, including linear and nonlinear modeling, classical statistical tests, time-series analysis, classification, clustering, and others. This is why it is used by statisticians and analysts while doing statistical analysis, data visualization and predictive modeling.
R is easily extensible through functions and extensions. Advanced users can write C, C++, Java, .NET or Python code to manipulate R objects directly.
_Shiny_ package allows creating advanced and interactive web applications entirely in R. It handles the client-server communication, HTML, layout and JavaScript programming entirely. This is a means of creating web applications feasible for data analysts who are not necessarily experienced web-developers.
Other than R, there are obviously competitive solutions on the data science market like _Python_ or _Jupyter_. Libraries like _NumPy_, _Sickit-learn_ or _TensorFlow_ for deep learning allow to build application with similar functionalities. 


## HPE OneSphere Insights and the Metrics API 

HPE OneSphere is a hybrid cloud management platform that spans both private cloud as well as public clouds like AWS and Azure. An application Programming Interface (REST API) allows 3rd party applications or scripts, to interact with HPE OneSphere to retrieve some data or automate some actions. Below is the list of possible metrics to be retrieved:

- the usage costs of all the deployments based on the providers category
- the usage costs of all the deployments based on the projects category
- the total cost of all providers grouped by provider-type
- the managed utilization and the consolidated usage costs of all providers grouped by the provider-type
- the consumption - server CPU usage

## Making REST API calls from R

To access the HPE OneSphere API, you need to install the _httr_ and _jsonlite_ packages. 
Those libraries allow you to work with any REST APIs even if there is no prebuilt SDKs or dedicated package like RGA or RGoogleAnalytics created for Google Analytics.

```` R
install.packages("httr")
trying URL 'https://cran.rstudio.com/bin/windows/contrib/3.3/httr_1.3.1.zip'
Content type 'application/zip' length 302068 bytes (294 KB)
downloaded 294 KB
package ‘httr’ successfully unpacked and MD5 sums checked
The downloaded binary packages are in
	C:\Users\luczaka\AppData\Local\Temp\RtmpQLQmGi\downloaded_packages
````

Next step is to extract raw data using **GET** request from _httr_ package. There are a few more nice functions in this package that you will want to use later on such as **POST** or **DELETE**.

Instead of using https://YourHPEOneSphere.hpeonesphere.com in all the queries, you should replace it with the URL variable.

```` R
URL <- “https://YourHPEOneSphere.hpeonesphere.com”
````

### POST 
```` R
# get a session token
POST(paste(URL,"rest/session",sep="/"),body='{"userName":" Here you need to type your username ","password":" Here you need to type your password "}',content_type_json(),accept_json())
Response [https:// xxxxxxxxxxxxxxxxxxxxxxxx]
  Date: 2018-07-19 11:13
  Status: 200
  Content-Type: application/json; charset=utf-8
  Size: 231 B
````

### GET 
```` R
#get the status of HPE OneSphere
GET(paste(URL,"rest/status",sep="/"), accept_json())

Response [https:// xxxxxxxxxxxxxxxxxxxxxxxx]
  Date: 2018-07-19 11:17
  Status: 200
  Content-Type: application/json; charset=utf-8
  Size: 30 B
````
Status 20x is a standard response for successful HTTP requests.  Any other response needs to be checked (e.g. for URL type mistakes).

```` R
#get the list of projects
GET (paste (URL, "rest/projects", sep="/"), add_headers("Authorization"=( call_token_parsed$token)),accept_json())
Response [https:// xxxxxxxxxxxxxxxxxxxxxxxx]
  Date: 2018-07-19 14:32
  Status: 200
  Content-Type: application/json; charset=utf-8
  Size: 5.43 kB
````

### DELETE
```` R
#delete current session
DELETE (paste (URL, "rest/session", sep="/"),add_headers("Authorization"=( call_token_json$token)),accept_json()) 
Response [https:// xxxxxxxxxxxxxxxxxxxxxxxx]
  Date: 2018-07-19 14:34
  Status: 204
  Content-Type: <unknown>
<EMPTY BODY>
````

## HPE OneSphere Authentication from R

In order to use any of the calls from the HPE OneSphere API (except `/rest/status`), you need to authenticate against the API to obtain a valid session token.

Set the variables for username and password.
```` R
username <- "Here you need to type your username"
password <- " Here you need to type your password "
````

By using POST call on the session object you can get the token (valid only for 24h)
```` R
#get a token
call_token <-POST(paste(URL,"rest/session",sep="/"),body='{"userName":" Here you need to type your username ","password":" Here you need to type your password "}',content_type_json(),accept_json())

> call_token
Response [https:// xxxxxxxxxxxxxxxxxxxxxxxx]
  Date: 2018-07-19 11:21
  Status: 200
  Content-Type: application/json; charset=utf-8
  Size: 231 B
````

Now, you have two options to retrieve the token:

- Shorter : is to parse response into an R object : list 
```` R
call_token_parsed <- content(call_token,"parsed")

> call_token_parsed
$token
[1] "gAAAAABbUHRHD-kXwca_Ot5n6FI5e3tN75DsnZeSj0l9y6JoGCzcLbCaO-M2o7HVoMQePmT-rfQIMIl1jWKBLBBBVbkG991fwZEXk9trrM3WrI7S4OSbEXU5i9ND_DSupXXkyqF-DcqG0_93ZOW2YRyeC9zvkbCZHA"
$userUri
[1] "/rest/users/7769f59a25764207ba0a86460dd1315e"
````
Access token by: `call_token_parsed$token`

```` R
> call_token_parsed$token
[1] "gAAAAABbUHRHD-kXwca_Ot5n6FI5e3tN75DsnZeSj0l9y6JoGCzcLbCaO-M2o7HVoMQePmT-rfQIMIl1jWKBLBBBVbkG991fwZEXk9trrM3WrI7S4OSbEXU5i9ND_DSupXXkyqF-DcqG0_93ZOW2YRyeC9zvkbCZHA"
```` 

- Longer: deserialize step by step, first by converting to character vector format, then to parse the JSON using fromJSON.

```` R
 # get a character
call_token_text <- content(call_token, "text")
> call_token_text
[1] "{\"token\":\"gAAAAABbUHRHD-kXwca_Ot5n6FI5e3tN75DsnZeSj0l9y6JoGCzcLbCaO-M2o7HVoMQePmT-rfQIMIl1jWKBLBBBVbkG991fwZEXk9trrM3WrI7S4OSbEXU5i9ND_DSupXXkyqF-DcqG0_93ZOW2YRyeC9zvkbCZHA\",\"userUri\":\"/rest/users/7769f59a25764207ba0a86460dd1315e\"}"

# get a list
call_token_json <- fromJSON(call_token_text, flatten=TRUE)
> call_token_json
$token
[1] "gAAAAABbUHRHD-kXwca_Ot5n6FI5e3tN75DsnZeSj0l9y6JoGCzcLbCaO-M2o7HVoMQePmT-rfQIMIl1jWKBLBBBVbkG991fwZEXk9trrM3WrI7S4OSbEXU5i9ND_DSupXXkyqF-DcqG0_93ZOW2YRyeC9zvkbCZHA"
$userUri
[1] "/rest/users/7769f59a25764207ba0a86460dd1315e"

#token
> call_token_json$token
[1] "gAAAAABbUHRHD-kXwca_Ot5n6FI5e3tN75DsnZeSj0l9y6JoGCzcLbCaO-M2o7HVoMQePmT-rfQIMIl1jWKBLBBBVbkG991fwZEXk9trrM3WrI7S4OSbEXU5i9ND_DSupXXkyqF-DcqG0_93ZOW2YRyeC9zvkbCZHA"
````

Your token can be accessed by variable: `call_token_json$token`


## Parsing JSON Data from R

To parse data from its raw form through JavaScript Object Notification (JSON) into a usable format data frame you may use:

- Httr 

There are currently three ways to retrieve the contents of a request: as a raw object (as = "raw"), as a character vector, (as = "text"), and as parsed into an R object where possible, (as = "parsed"). If you don’t specify it, the default as=”parsed” is used.
If you want to check what the data type of the response is, function http_type() allows you to extract the content type of a response.

- Jsonline

If you know your response is JSON (which is always the case with HPE OneSphere API), you may want to use fromJSON() directly. In addition to converting JSON data from/to R objects, _jsonlite_ contains functions to stream, validate, and prettify JSON data.

```` R
# set the URL and get the status
URL <- "https://<YourHPEOneShere>.hpeonesphere.com "
info<- GET(paste(URL,"rest/status", sep="/"))
> info
Response [https:// xxxxxxxxxxxxxxxxxxxxxxxx]
  Date: 2018-07-19 11:28
  Status: 200
  Content-Type: application/json; charset=utf-8
  Size: 30 B

# identifying a JSON response
http_type(info)
 [1] "application/json"

# examine returned raw data with content ()
info_raw <- content (info, as = "raw")
> info_raw
 [1] 7b 22 73 65 72 76 69 63 65 22 3a 22 4f 4b 22 2c 22 64 61 74 61 62 61 73 65 22 3a
[28] 22 22 7d

# examine returned text with content ()
info_text <- content (info, as = "text")
> info_text
[1] "{\"service\":\"OK\",\"database\":\"\"}"

# Parse response with content ()
info_parsed <- content (info, as="parsed")
> info_parsed
$service
[1] "OK"

$database
[1] ""

# Parse returned text with fromJSON()
info_json <- fromJSON(info_text, flatten=TRUE)
> info_json
$service
[1] "OK"

$database
[1] ""

# convert json format to data frame format
info_df <- as.data.frame(info_json)
> info_df

|    | service 	| database 	|
|--- |---------	|----------	|
| 1  | OK      	|        	|
````

## Collecting HPE OneSphere Insights from R

Here are the examples of R code to retrieve each of the metrics.
For all the calls we are retrieving data for the **period** of four months: 01.04.2018 – 30.07.2018. **PeriodStart** should always be the first day of the following month (2018-08-01), while **Count** (-4) is how many months you want to get the data back.

- The usage costs of all the deployments based on the providers category:
```` R
metric <- GET(paste(URL, "rest/metrics?name=cost.usage&period=month&periodStart=2018-08-01T00%3A00%3A00Z&periodCount=-4&category=providers&view=full",sep="/") ,add_headers("Authorization"=( call_token_json$token)),accept_json())
````

- The usage costs of all the deployments based on the projects category:
```` R
metric <- GET( paste(URL, "rest/metrics?name=cost.usage&period=month&periodStart=2018-08-01T00%3A00%3A00Z&periodCount=-4&category=projects&view=full" ,sep="/"),add_headers("Authorization"=( call_token_json$token)) ,accept_json())
````

- The total cost of all providers grouped by provider-type:

```` R
metric <- GET(paste(URL, "rest/metrics?name=cost.total&period=month&periodStart=2018-08-01T00%3A00%3A00Z&periodCount=-4&category=providers&groupBy=providerTypeUri&view=full",sep="/"),add_headers("Authorization"=( call_token_json$token)),accept_json())
````

- The managed utilization and the consolidated usage costs of all providers grouped by the provider-type:

```` R
metric <- GET( paste(URL, "rest/metrics?name=cost.total&name=cost.efficiency&name=cost.usage&period=month&periodStart=2018-07-01T00%3A00%3A00Z&periodCount=1&category=providers&groupBy=providerTypeUri&view=full",sep="/"), add_headers("Authorization"=( call_token_json$token)),accept_json())
````

- Consumption - server CPU usage

```` R
metric <- GET(paste(URL,"rest/metrics?name=server.cpu.usage&resourceUri=/rest/provider-types/ncs&period=day&periodCount=-90&view=full",sep="/"),add_headers("Authorization"=( call_token_json$token)),accept_json())
````

Let’s analyze the last metric.

You can see using structure function str(metric) how complex the structure of the metrics is.
There, you will find almost every possible R data type: integers, nested data frames and lists.

```` R
> str(metric)
List of 4
 $ total  : int 1
 $ start  : int 0
 $ count  : int 1
 $ members:'data.frame':	1 obs. of  7 variables:
  ..$ name        : chr "server.cpu.usage"
  ..$ resourceUri : chr "/rest/provider-types/ncs"
  ..$ category    : chr "provider-types"
  ..$ units       : chr "cores"
  ..$ description : chr "Average server cpu usage over the time period in cores"
  ..$ associations:List of 1
  .. ..$ : list()
  ..$ values      :List of 1
  .. ..$ :'data.frame':	38 obs. of  3 variables:
  .. .. ..$ value: num [1:38] 1.17 1.2 1.19 1.12 1.14 ...
  .. .. ..$ start: chr [1:38] "2018-06-11T00:00:00Z" "2018-06-12T00:00:00Z" "2018-06-13T00:00:00Z" "2018-06-14T00:00:00Z" ...
  .. .. ..$ end  : chr [1:38] "2018-06-12T00:00:00Z" "2018-06-13T00:00:00Z" "2018-06-14T00:00:00Z" "2018-06-15T00:00:00Z" ...

metric_text <- content(metric, "text")
metric<- fromJSON(metric_text, simplifyMatrix = TRUE, flatten = TRUE)
metric_dataframe <- as.data.frame(metric)
````
__Table before unnesting__

|   | total 	| start 	| count 	| members.name 	| members.resourceUri 	| members.category         	| members.units  	| members.description 	| members.associations                                   	| members.values 	|                                                     	|
|---|-------	|-------	|-------	|--------------	|---------------------	|--------------------------	|----------------	|---------------------	|--------------------------------------------------------	|----------------	|-----------------------------------------------------	|
| 1     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| list()         	| list(value = c(1.1724493593, 1.2017285714, 1.185192 	|

```` R
metric_dataframe_unnest <- unnest(metric_dataframe, metric_dataframe $members.values)
````

__Table after unnesting ( shows only first sixteen results)__

|   | total 	| start 	| count 	| members.name 	| members.resourceUri 	| members.category         	| members.units  	| members.description 	| value                                                  	| start1   	| end                  	|                      	|
|---|-------	|-------	|-------	|--------------	|---------------------	|--------------------------	|----------------	|---------------------	|--------------------------------------------------------	|----------	|----------------------	|----------------------	|
| 1     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.172449 	| 2018-06-11T00:00:00Z 	| 2018-06-12T00:00:00Z 	|
| 2     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.201729 	| 2018-06-12T00:00:00Z 	| 2018-06-13T00:00:00Z 	|
| 3     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.185193 	| 2018-06-13T00:00:00Z 	| 2018-06-14T00:00:00Z 	|
| 4     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.119696 	| 2018-06-14T00:00:00Z 	| 2018-06-15T00:00:00Z 	|
| 5     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.139548 	| 2018-06-15T00:00:00Z 	| 2018-06-16T00:00:00Z 	|
| 6     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.124632 	| 2018-06-16T00:00:00Z 	| 2018-06-17T00:00:00Z 	|
| 7     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.120552 	| 2018-06-17T00:00:00Z 	| 2018-06-18T00:00:00Z 	|
| 8     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.124595 	| 2018-06-18T00:00:00Z 	| 2018-06-19T00:00:00Z 	|
| 9     	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.140923 	| 2018-06-19T00:00:00Z 	| 2018-06-20T00:00:00Z 	|
| 10    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.194125 	| 2018-06-20T00:00:00Z 	| 2018-06-21T00:00:00Z 	|
| 11    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.136412 	| 2018-06-21T00:00:00Z 	| 2018-06-22T00:00:00Z 	|
| 12    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.161722 	| 2018-06-22T00:00:00Z 	| 2018-06-23T00:00:00Z 	|
| 13    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.183104 	| 2018-06-23T00:00:00Z 	| 2018-06-24T00:00:00Z 	|
| 14    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.169196 	| 2018-06-24T00:00:00Z 	| 2018-06-25T00:00:00Z 	|
| 15    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.170152 	| 2018-06-25T00:00:00Z 	| 2018-06-26T00:00:00Z 	|
| 16    	| 1     	| 0     	| 1            	| server.cpu.usage    	| /rest/provider-types/ncs 	| provider-types 	| cores               	| Average server cpu usage over the time period in cores 	| 1.336804 	| 2018-06-26T00:00:00Z 	| 2018-06-27T00:00:00Z 	|


## Visualizing data with R

_Shiny_ and _shinydashboard_ allows R users to create web applications with fully customized data visualizations. 
There are many fantastic libraries designed to build interactive graphs like _ggplot2_, _flexdashboard_, _plotly_ and used in our work – _highcharter_ - R wrapper for Highcharts javascript library.
Please note, that library is free only for non-commercial use. If you plan to use highcharter in R for commercial use, please purchase Highcharts at https://shop.highsoft.com/


To summarize previous steps, in order to draw the graph, you will need to:
- Step 1: Extract the metrics
- Step 2: Parse the data into R object
- Step 3: Manipulate the data with libraries like dplyr, tidyr to obtain reformulated source data
- Step 4: Visualize data 

### The usage costs of all the deployments based on the provider’s category:

- Step 1: EXTRACTING METRIC

```` R
Metric <- GET(paste(URL, "rest/metrics?name=cost.usage&period=month&periodStart=2018-08-01T00%3A00%3A00Z&periodCount=-4&category=providers&view=full",sep="/") ,add_headers("Authorization"=( call_token_json$token)),accept_json())
````

- Step 2: PARSING INTO R OBJECT

```` R
Metric_text <- content(Metric, "text") 
Metric_json <- fromJSON(Metric_text,simplifyMatrix = TRUE,flatten = TRUE)
Metric_df <- as.data.frame(Metric_json)
Metric_df_unnest <- unnest(Metric_df, Metric_df$members.values)
````

- Step 3: DATA WRANGLING

```` R
Graphic_table <- Metric_df_unnest %>%
  mutate(end=as.Date(gsub("T.*$","", Metric_df_unnest$end)))%>%
  mutate(start1=as.Date(gsub("T.*$","", Metric_df_unnest$start1)))%>%
  mutate(provider=members.resource.providerType.name)%>%
  select(provider,value,start1,end)%>%
  mutate(value=as.numeric(value))%>%
  group_by(provider)%>%
  summarise("Provider_Cost"=sum(value))%>%
  ungroup()

|   | provider 	          | Provider_Cost |
|---|---------------------|---------------|
| 1 | Amazon Web Services | 4351.0226     |
| 2 | Azure Web Services  | 541.3373      |
| 3 | Private Cloud       | 2731.5525     |

````

- Step 4: DRAWING CHART

```` R
highchart() %>%
  hc_chart(type = "pie") %>% 
  hc_title(text = "Costs of all the deployments based on the providers category") %>%
  hc_subtitle(text = "Provider vs. value") %>%
  hc_plotOptions(
   allowPointSelect=TRUE,
    cursor="pointer") %>% 
  hc_add_series_labels_values(Graphic_table$provider, Graphic_table$Provider_Cost,name = "Pie",colorByPoint = TRUE, type = "pie")%>%
  hc_tooltip(valueDecimals = 2,
             pointFormat = " Value : {point.y}",split = FALSE, shared = TRUE, borderColor = "#dddddd") %>%
  hc_legend(enabled = TRUE)%>%
  hc_credits(enabled = TRUE, text = "Source pls click here",href = "") 
````
![](/uploads/media/2018/7/pic1-1532075753977.jpg "Cost of all deployments based on providers category")


## What’s next

Creating a highly-customized web application that allows the user to see historical changes in costs and CPU usage across hybrid cloud is possible. Forecast of costs or future CPU usage based on previous values is only one of the options to follow.

![](/uploads/media/2018/7/pic2-1532075771622.jpg "Server CPU usage")

## Sources:

- https://www.programmableweb.com/news/how-to-access-any-restful-api-using-r-language/how-to/2017/07/21
- https://campus.datacamp.com/courses/working-with-web-data-in-r/handling-json-and-xml?ex=13
- https://developer.hpe.com/platform/hpe-onesphere/home
- http://stcorp.nl/R_course/tutorial_shiny.html

