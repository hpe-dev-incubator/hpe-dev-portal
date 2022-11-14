---
title: HPE Ezmeral Data Fabric for Predictive Maintenance
date: 2022-02-15T05:31:46.014Z
author: Ian Downard
authorimage: /img/Avatar1.svg
thumbnailimage: /img/dataflow.png
tags:
  - hpe-ezmeral-data-fabric
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit <https://www.hpe.com/us/en/software/ezmeral-data-fabric.html>

This project is intended to show how to build predictive maintenance applications on MapR. Predictive maintenance applications place high demands on data streaming, time-series data storage, and machine learning. Therefore, this project focuses on data ingest with MapR Streams, time-series data storage with MapR-DB and OpenTSDB, and feature engineering with MapR-DB and Apache Spark.

## Overview:

Predictive maintenance requires a cutting-edge data platform that handles fast streams of Internet of Things (IoT) data with the processing required for on-the-fly feature engineering and the flexibility required for data science and machine learning.

## Ingesting Factory IoT Data

Predictive maintenance applications rely heavily on ingesting multiple data sources, each with its own format and throughput. MapR Streams can ingest data, regardless of format or speed, with standard Kafka and RESTful APIs.

## Machine Learning on Factory IoT Data

The "predictive" aspects of predictive maintenance applications are usually realized through machine learning. Feature engineering is often considered the most important aspect of machine learning (as opposed to neural network design, for example). Feature engineering places high demands on the data layer because of the amount of data that IoT data streams generate. The tendency for failures to occur infrequently and without warning means vast amounts of raw time-series data must be stored. Not only must it be stored, but it must also be possible to retroactively update the lagging features necessary in order to label failures for the purposes of supervised machine learning. MapR-DB and Spark can work together to provide the capabilities required to put machine learning into practice for predictive maintenance.

In summary:

* MapR Streams provide a convenient way to ingest IoT data because it is scalable and provides convenient interfaces.
* The integration of MapR DB with Spark provides a convenient way to label lagging features needed for predicting failures via supervised machine learning.
* Drill provides a convenient way to load ML data sets into Tensorflow for unsupervised and supervised machine learning

## Implementation Summary

There are two objectives relating to predictive maintenance implemented in this project. The first objective is to visualize time-series data in an interactive real-time dashboard in Grafana. The second objective is to make raw data streams and derived features available to machine learning frameworks, such as Tensorflow, in order to develop algorithms for anomaly detection and predictive maintenance. These two objects are realized using two seperate data flows:

1. The first flow, located on the top half of the image below, is intended to persist IoT data and label training data for sequence prediction and anomaly detection of time-series data in Tensorflow. 

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/bi_pipeline.png" width="100%">

2. The second flow, located on the bottom half, is intended to persist time-series IoT data in OpenTSDB for visualization in a Grafana dashboard. 

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/ml_pipeline.png" width="100%">

Put together, these data pipelines look like this. The APIs used for reading and writing data are shown in red.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/dataflow.png" width="100%">

## Preliminary Steps

These steps explain how to set up this tutorial using the [MapR Container for Developers](https://docs.datafabric.hpe.com/62/MapRContainerDevelopers/MapRContainerDevelopersOverview.html) on macOS.

## Allocate 12GB to Docker

This project requires a lot of memory. We recommend allocating 12GB RAM, 4GB swap, and 2 CPUs to the Docker Community Edition for macOS.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/docker_config.png" width="100%">

## Start the MapR sandbox (Now known as the [Development Environment for HPE Ezmeral Data Fabric](https://docs.datafabric.hpe.com/62/MapRContainerDevelopers/RunMapRContainerDevelopers.html))

Download and run the `./mapr_devsandbox_container_setup.sh` script.

```console
git clone https://github.com/mapr-demos/mapr-db-60-getting-started
cd mapr-db-60-getting-started
./mapr_devsandbox_container_setup.sh
```

## Run the `init.sh` script

Run the `init.sh` script to install Spark, OpenTSDB, Grafana, and some other things necessary to use the sample applications in this tutorial. SSH to the sandbox container, with password "mapr" and run the following commands. This should take about 20 minutes.

```console
ssh -p 2222 root@localhost
wget https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/init.sh
chmod 700 ./init.sh
sudo ./init.sh
```

## Import the Grafana dashboard

```console
sudo /opt/mapr/server/configure.sh -R -OT `hostname -f`
sudo /opt/mapr/opentsdb/opentsdb-2.4.0/etc/init.d/opentsdb start
```

Open Grafana data sources, with a URL like <http://maprdemo:3000/datasources/edit/1>, and add OpenTSDB as a new data source.

Load the `Grafana/IoT_dashboard.json` file using Grafana's dashboard import functionality, and specify "MaprMonitoringOpenTSDB" as the data source, as shown below:

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/grafana_import.png" width="100%">

<hr>

## Predictive Maintenance Demo Procedure

For learning or debugging purposes you should run each of the following steps manually, but if you just want to see data show up in Grafana then just run `./run.sh`.

## Step 1 - Simulate HVAC data stream:

We have provided a dataset captured from a real-world heating, ventilation, and air conditioning (HVAC) system in the `sample_dataset` folder. Run the following command to replay that HVAC stream to `/apps/factory:mqtt`.

```console
cat ~/predictive-maintenance/sample_dataset/mqtt.json | while read line; do echo $line | sed 's/{/{"timestamp":"'$(date +%s)'",/g' | /opt/mapr/kafka/kafka-*/bin/kafka-console-producer.sh --topic /apps/factory:mqtt --broker-list this.will.be.ignored:9092; sleep 1; done
```

## Step 2 - Save IoT data stream to MapR-DB:

In the next step, we'll save the IoT data stream to OpenTSDB so we can visualize it in Grafana, but in this step, we save that stream to MapR-DB so we can apply labels necessary for supervised machine learning, as discussed in Step 4.

Run the following command to persist messages from stream `/apps/factory:mqtt` to MapR-DB table `/apps/mqtt_records`. 

```console
/opt/mapr/spark/spark-*/bin/spark-submit --class com.mapr.examples.MqttConsumer ~/predictive-maintenance/target/predictive-maintenance-1.0-jar-with-dependencies.jar /apps/factory:mqtt /apps/mqtt_records
```

Run this command to see how the row count increases:

```console
/opt/mapr/drill/drill-*/bin/sqlline -u jdbc:drill: -n mapr
    select count(*) from dfs.`/apps/mqtt_records`;
```

## Step 3 - Save IoT data stream to OpenTSDB:

In this step, we save the IoT data stream to OpenTSDB so we can visualize it in Grafana. 

Update `localhost:4242` with the hostname and port of your OpenTSDB server before running the following command:

```console
/opt/mapr/kafka/kafka-*/bin/kafka-console-consumer.sh --new-consumer --topic /apps/factory:mqtt --bootstrap-server not.applicable:0000 | while read line; do echo $line | jq -r "to_entries | map(\"\(.key) \(.value | tostring)\") | {t: .[0], x: .[]} | .[]" | paste -d ' ' - - | awk '{system("curl -X POST --data \x27{\"metric\": \""$3"\", \"timestamp\": "$2", \"value\": "$4", \"tags\": {\"host\": \"localhost\"}}\x27 http://localhost:4242/api/put")}'; echo -n "."; done
```

After you have run that command you should be able to visualize the streaming IoT data in Grafana.  Depending on where you have installed Grafana, this can be opened with a URL like <http://maprdemo:3000>:

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/grafana_screenshot_2.png" width="100%" align="center">

## Step 4 - Update lagging features in MapR-DB for each failure event:

This process will listen for failure events on a MapR Streams topic and retroactively label lagging features in MapR-DB when failures occur, as well as render the failure event in Grafana. Update "http://localhost:3000" with the hostname and port for your Grafana instance.

```console
/opt/mapr/spark/spark-*/bin/spark-submit --class com.mapr.examples.UpdateLaggingFeatures ~/predictive-maintenance/target/predictive-maintenance-1.0-jar-with-dependencies.jar /apps/factory:failures /apps/mqtt_records http://localhost:3000
```

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/lagging_features_explanation.png" width="100%" align="center">

This particular step probably says the most about the value of MapR. Consider this scenario: You have a factory instrumented by IoT devices reporting hundres of metrics per machine per second and you're tasked with the challenge of saving all that data until one day, often months into the future, you finally experience a machine failure. At that point, you have to retroactively go back and update all those records as being "about to fail" or "x days to failure"  so that you can use that data for training models to predict those lagging features.  That's one heck of a DB update, right? The only way to store all that data is with a distributed database. This is what makes Spark and MapR-DB such a great fit. Spark - the distributed processing engine for big data, and MapR-DB - the distributed data store for big data, working together to process and store lots of data with speed and scalability. 

## Step 5 - Simulate a failure event:

To simulate a device failure, run this command:

```java
echo "{\"timestamp\":"$(date +%s -d '60 sec ago')",\"deviceName\":\"Chiller1\"}" | /opt/mapr/kafka/kafka-*/bin/kafka-console-producer.sh --topic /apps/factory:failures --broker-list this.will.be.ignored:9092
```

This will trigger the Spark process you ran in the previous step to update lagging features in the MapR-DB table "/apps/mqtt_records". Once it sees the event you simulated, you should see it output information about the lagging features it labeled, like this:

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/UpdateLagging_screenshot.png?raw=true" width="100%" align="center" alt="Update Lagging Features screenshot">

## Step 6 - Validate that lagging features have been updated:

```java
$ mapr dbshell
find /apps/mqtt_records --where '{ "$eq" : {"_Chiller1AboutToFail":"true"} }' --f _id,_Chiller1AboutToFail,timestamp
```

Here are a few example commands to look at that table with `mapr dbshell`:

```java
$ mapr dbshell
find /apps/mqtt_records --f timestamp
find --table /apps/mqtt_records --orderby _id --fields _Chiller2RemainingUsefulLife,_id
find --table /apps/mqtt_records --where '{"$gt" : {"_id" : "1523079964"}}' --orderby _id --fields _Chiller2RemainingUsefulLife,_id
find --table /apps/mqtt_records --where '{"$gt" : {"timestamp" : "1523079964"}}' --fields _Chiller2RemainingUsefulLife,timestamp
```

Here's an example of querying IoT data records table with Drill:

```java
/opt/mapr/drill/drill-*/bin/sqlline -u jdbc:drill: -n mapr
    select * from dfs.`/apps/mqtt_records` limit 2;
```

## Step 7 - Synthesize a high-speed data stream:

This command simulates a high-speed data stream from a vibration sensor sampling once per 10ms.

```java
java -cp ~/predictive-maintenance/target/predictive-maintenance-1.0-jar-with-dependencies.jar com.mapr.examples.HighSpeedProducer /apps/fastdata:vibrations 10
```

## Why are we simulating a vibration sensor?

Degradation in machines often manifests itself as a low rumble or a small shake. These unusual vibrations give you the first clue that a machine is nearing the end of its useful life, so it's very important to detect those anomalies. Vibration sensors measure the displacement or velocity of motion thousands of times per second. Analyzing those signals is typically done in the frequency domain. An algorithm called "fast Fourier transform" (FFT) can sample time-series vibration data and identify its component frequencies. In the next step, you will run a command the converts the simulated vibration data to the frequency domain with an FFT and raises alarms when vibration frequencies vary more than a predefined threshold.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/vibration_analysis.png?raw=true" width="100%" align="center" alt="vibration analysis">

This demonstrates the capacity of MapR to ingest and process high-speed streaming data. Depending on the hardware, you will probably see MapR Streams processing more than 40,000 messages per second in this step.

## Step 8 - Process high-speed data stream:

This will calculate FFTs on the fly for the high-speed streaming data, and render an event in Grafana when FFTs changed more than 25% over a rolling window. This simulates anomaly detection for a vibration signal. Update "http://localhost:3000" with the hostname and port for your Grafana instance.

```bash
/opt/mapr/spark/spark-*/bin/spark-submit --class com.mapr.examples.StreamingFourierTransform ~/predictive-maintenance/target/predictive-maintenance-1.0-jar-with-dependencies.jar /apps/fastdata:vibrations 25.0 http://localhost:3000
```

## Step 9 - Visualize data in Grafana

By now, you should be able to see streaming IoT data, vibration faults, and device failures in the Grafana dashboard.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/grafana_screenshot.png" width="100%" align="center">

## Step 10 - Explore IoT data with Apache Drill

[Apache Drill](https://drill.apache.org/) is a Unix service that unifies access to data across a variety of data formats and sources. MapR is the primary contributor to Apache Drill, so naturally, it is included in the MapR platform. Here's how you can use it to explore some of the IoT data we've gathered so far in this tutorial. 

Open the Drill web interface. If you're running MapR on your laptop then that's probably at <http://localhost:8047>. Here are a couple of useful queries:

## Show how many messages have arrived cumulatively over days of the week:

```sql
SELECT _day_of_week_long, count(_day_of_week_long) FROM dfs.`/apps/mqtt_records` group by _day_of_week_long;
```

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/drill_query_1.png" width="100%">
<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/drill_result_1.png" width="100%">

## Count how many faults have been detected:

```java
WITH x AS
(
SELECT _id, _day_of_week_long, _Chiller1AboutToFail, ROW_NUMBER() OVER (PARTITION BY _Chiller1AboutToFail ORDER BY _id) as fault FROM dfs.`/apps/mqtt_records`
)
SELECT * from x WHERE _Chiller1AboutToFail = 'true' and fault = 1;
```

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/drill_query_2.png" width="100%">
<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/drill_result_2.png" width="100%">

Drill can also be used to load data from MapR-DB into data science notebooks. Examples of this are shown in the following section.

## References for Machine Learning techniques for Predictive Maintenance

This tutorial focuses on data engineering - i.e. getting data in the right format and in the right place in order to take advantage of machine learning (ML) for predictive maintenance applications. The details of ML are beyond the scope of this tutorial but to better understand ML techniques commonly used for predictive maintenance, check out the provided Jupyter notebook for [LSTM predictions for About To Fail](https://github.com/mapr-demos/predictive-maintenance/blob/master/notebooks/jupyter/LSTM%20For%20Predictive%20Maintenance-ian01.ipynb). This notebook not only talks about how to use Long Short Term Memory (LSTM) but also how to generate a sample dataset with [logsynth](https://github.com/tdunning/log-synth) that resembles what you might see in a real factory. This notebook is great because it explains how to experiment with LSTMs entirely on your laptop.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/lstm-about_to_fail-50.png?raw=true" width="100%" alt="LSTM About To Fail prediction">

Here are some of the other notebooks included in this repo that demonstrate ML concepts for predictive maintenance:

* [LSTM predictions for Remaining Useful Life](https://github.com/mapr-demos/predictive-maintenance/blob/master/notebooks/jupyter/LSTM%20predictions%20for%20Remaining%20Useful%20Life.ipynb) shows how to train a point regression model using an LSTM neural network in Keras to predict the point in time when an airplane engine will fail.
* [LSTM time-series predictions from OpenTSDB](https://github.com/mapr-demos/predictive-maintenance/blob/master/notebooks/jupyter/LSTM%20time%20series%20prediction%20from%20OpenTSDB.ipynb) shows how to train a model to predict the next value in a sequence of numbers, which in this case, is a time-series sequence of numbers stored in OpenTSDB. This notebook also shows how to load training data into Tensorflow using the REST API for OpenTSDB.
* [RNN time-series predictions from OpenTSDB](https://github.com/mapr-demos/predictive-maintenance/blob/master/notebooks/jupyter/RNN%20time%20series%20prediction%20from%20OpenTSDB.ipynb) also shows how to train a model to predict the next value in a sequence of numbers, except it uses an RNN model instead LSTM.
* [RNN predictions for MapR-DB data via Drill](https://github.com/mapr-demos/predictive-maintenance/blob/master/notebooks/jupyter/RNN%20predictions%20on%20MapR-DB%20data%20via%20Drill.ipynb) also shows how to train a model to predict the next value in a sequence of numbers, except it reads time-series data from MapR-DB using Drill as a SQL engine.

## StreamSets Demonstration

To give you an idea of what dataflow management tools do, I’ve prepared a simple StreamSets project that you can run on a laptop with Docker. This project demonstrates a pipeline that streams time-series data recorded from an industrial HVAC system into OpenTSDB for visualization in Grafana. 

Create a docker network to bridge containers:

```console
docker network create mynetwork
```

Start StreamSets, OpenTSDB, and Grafana:

```console
docker run -it -p 18630:18630 -d --name sdc --network mynetwork \
streamsets/datacollector
docker run -dp 4242:4242 --name hbase --network mynetwork \
petergrace/opentsdb-docker
docker run -d -p 3000:3000 --name grafana --network mynetwork \
grafana/grafana
```

Open Grafana at http://localhost:3000 and login with admin / admin

Add http://hbase:4242 as an OpenTSDB datasource to Grafana. If you don’t know how to add a data source, refer to Grafana docs. Your datasource definition should look like this:

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/grafana_opentsdb_config.png" width="100%" align="center">

Download the following Grafana dashboard file:

```console
wget https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/Grafana/IoT_dashboard.json
```

Import that file into Grafana. If you don’t know how to import a dashboard, see Grafana docs. The Grafana import dialog should look like this:

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/grafana_dashboard_config.png" width="100%" align="center">

Download, unzip, and copy the MQTT dataset to the StreamSets container:

```console
wget https://github.com/mapr-demos/predictive-maintenance/raw/master/sample_dataset/mqtt.json.gz
unzip mqtt.json.gz
docker cp mqtt.json sdc:/tmp/mqtt.json
```

Open StreamSets at http://localhost:18630 and login with admin / admin

Download and import the following pipeline into StreamSets. If you don’t know how to import a pipeline, refer to StreamSets docs.

```console
wget https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/StreamSets/MQTT%20File%20Tail.json
```

You will see a warning about a missing library in the “Parse MQTT JSON” stage. Click that stage and follow the instructions to install the Jython library.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/streamSets_warning.png" width="100%" align="center">

Finally, run the StreamSets pipeline.

<img src="https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/images/grafana_streamset_animation.gif" width="100%" align="center">

Hopefully, by setting up this pipeline and exploring StreamSets you’ll get the gist of what dataflow management tools can do.