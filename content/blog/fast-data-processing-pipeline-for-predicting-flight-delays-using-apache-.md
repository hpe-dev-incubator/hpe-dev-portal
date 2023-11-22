---
title: "Fast data processing pipeline for predicting flight delays using Apache APIs: Kafka, Spark Streaming and Machine Learning (part 1)"
date: 2020-10-21T05:53:58.578Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","Machine-Learning","Spark","opensource", "data-scientist", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
""authorDisplayName": "Carol McDonald",
"publish": "2018-01-10T10:30:00.000Z",
"tags": "use-cases"
```

---

According to [Thomas Davenport in the HBR](https://hbr.org/2017/06/how-analytics-has-changed-in-the-last-10-years-and-how-its-stayed-the-same), analytical technology has changed dramatically over the last decade, with more powerful and less expensive distributed computing across commodity servers, streaming analytics, and improved machine learning technologies, enabling companies to store and analyze both far more data and many different types of it. Werner Vogel stated in his recent [keynote at AWS re:invent](https://www.infoq.com/news/2017/12/vogels-21st-century-architecture) that key technology drivers of today are data, the Internet of Things (IoT), and machine learning.

Leveraging the huge amounts of data coming from the Internet of Things requires processing events in real time, applying machine learning to add value, and scalable fast storage. This is the first in a series of blogs, which discusses the architecture of an end-to-end application that combines streaming data with machine learning and fast storage. In this first post, I’ll help you get started using Apache Spark’s [ML pipelines](https://spark.apache.org/docs/latest/ml-pipeline.html) with a [Decision Tree Classifier](https://spark.apache.org/docs/latest/ml-classification-regression.html#decision-tree-classifier) to predict flight delays.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/spark-rdd-based-api-1603259821463.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/machine-learning-logistics-and-streaming-architecture-1603259842484.png)

## What is Machine Learning?

Machine learning uses algorithms to find patterns in data, and then uses a model that recognizes those patterns to make predictions on new data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/predictions-1603259860781.png)

There are typically two phases in machine learning with real-time data:

* Data Discovery: The first phase involves analysis on historical data to build the machine learning model.
* Analytics Using the Model: The second phase uses the model in production on live events. (Note that Spark does provide some streaming machine learning algorithms, but you still often need to do an analysis of historical data.)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/historical-data-1603259872698.png)

In general, machine learning may be broken down into two-three types: supervised, unsupervised, and in between those two.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/machine-learning-1603259887263.png)

Supervised algorithms use labeled data in which both the input and target outcome, or label, are provided to the algorithm.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/labeled-data-1603259898645.png)

Supervised Learning is also called predictive modeling or predictive analytics, because you build a model that is capable of making predictions.

Unsupervised learning algorithms find patterns in unlabeled data. Semi-supervised learning uses a mixture of labeled and unlabeled data. Reinforcement learning trains algorithms to maximize rewards based on feedback.

## Three Categories of Techniques for Machine Learning

Three common categories of machine learning techniques are Classification, Clustering and Collaborative Filtering.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/three-common-catgories-1603259911430.png)

* Classification: Gmail uses a machine learning technique called classification to designate if an email is spam or not, based on the data of an email: the sender, recipients, subject, and message body. Classification takes a set of data with known labels and learns how to label new records based on that information.
* Clustering: Google News uses a technique called clustering to group news articles into different categories, based on title and content. Clustering algorithms discover groupings that occur in collections of data.
* Collaborative Filtering: Amazon uses a machine learning technique called collaborative filtering (commonly referred to as recommendation), to determine which products users will like based on their history and similarity to other users.

In this example we will be using a supervised machine learning algorithm for classification of flight delays.

## CLASSIFICATION

Classification is a family of supervised machine learning algorithms that identify which category an item belongs to (e.g., whether a transaction is fraud or not fraud), based on labeled examples of known items (e.g., transactions known to be fraud or not). Classification takes a set of data with known labels and pre-determined features and learns how to label new records based on that information. Features are the “if questions” that you ask. The label is the answer to those questions. In the example below, if it walks, swims, and quacks like a duck, then the label is "duck."

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/duck-1603259924086.png)

Let’s go through an example for flight delays:

* What are we trying to predict?
  * Whether a flight will be delayed or not.
  * Delayed is the Label: True or False
* What are the “if questions” or properties that you can use to make predictions?
  * What is the Originating Airport?
  * What is the Destination Airport?
  * What is the Scheduled time of departure?
  * What is the schedule time of arrival?
  * What is the day of the week?
  * What is the Airline Carrier?

## DECISION TREES

Decision trees create a model that predicts the label (or class) by evaluating a set of rules that follow an IF THEN ELSE…pattern. The If then ELSE feature questions are the nodes, and the answers True or false are the branches in the tree to the child nodes. A decision tree model estimates the minimum number of true/false questions needed, to assess the probability of making a correct decision. Below is an example of a simplified decision tree for flight delays:

* Q1: If the scheduled departure time < 10:15 AM
  * T:Q2: If the originating airport is in the set {ORD, ATL,SFO}
    * T:Q3: If the day of the week is in {Monday, Sunday}
      * T:Delayed=1
      * F: Delayed=0
    * F: Q3: If the destination airport is in the set {SFO,ORD,EWR}
      * T: Delayed=1
      * F: Delayed=0
  * F :Q2: If the originating airport is not in the set {BOS . MIA}
    * T:Q3: If the day of the week is in the set {Monday , Sunday}
      * T: Delayed=1
      * F: Delayed=0
    * F: Q3: If the destination airport is not in the set  {BOS . MIA}
      * T: Delayed=1
      * F: Delayed=0

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/decision-tree-1603259936871.png)

## EXAMPLE USE CASE DATA SET

Our data is from [http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time](http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time). We are using flight information for January, February, March, April and May 2017. For each flight, we have the following information:

| **Field** | **Description** | **Example Value** |
| --- | --- | --- |
| id | Unique identifier: composed of carrier code, date, origin, destination, flight number | AA\_2017-02-22\_SFO\_ORD\_150 |
| dofW (Integer) | Day of week (1=Monday 7=Sunday) | 1 |
| carrier (String) | Carrier code | AA |
| origin(String) | Origin Airport Code | JFK |
| dest(String | Destination airport code | LAX |
| crsdephour(Integer) | Scheduled departure hour | 9 |
| crsdeptime(Double) | Scheduled departure time | 900.0 |
| depdelay (Double) | Departure delay in minutes | 40.0 |
| crsarrtime (Double) | Scheduled arrival time | 1230.0 |
| arrdelay (Double) | Arrival delay minutes | 40.0 |
| crselapsedtime (Double) | Elapsed time | 390.0 |
| dist  (Double) | Distance | 2475.0 |

I have already cleaned up, limited the number of airports and carriers, and transformed the data into 2 JSON files, one for training and one for testing. (you can see the code for the cleanup in the github repository). The JSON file has the following format:

```json
{
    "_id": "AA_2017-01-01_ATL_LGA_1678",
    "dofW": 7,
    "carrier": "AA",
    "origin": "ATL",
    "dest": "LGA",
    "crsdephour": 17,
    "crsdeptime": 1700,
    "depdelay": 0.0,
    "crsarrtime": 1912,
    "arrdelay": 0.0,
    "crselapsedtime": 132.0,
    "dist": 762.0
}
```

You can run the [code for this example](https://github.com/caroljmcdonald/spark-ml-flightdelay) with MapR 5.2.1 or MapR 6.0 (which includes Spark 2.1).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/zepplin-notebook-1603259951128.png)

## Load The Data From a File Into a Dataframe

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/scala-case-class-1603259961799.png)

We use a Scala case class and [Structype](http://spark.apache.org/docs/latest/sql-programming-guide.html#programmatically-specifying-the-schema) to define the schema, corresponding to a line in the JSON data file.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/define-schema-for-json-file-data-1603259974595.png)

Below we [specify the data source, schema and class to load into a Dataset](http://spark.apache.org/docs/latest/sql-programming-guide.html#manually-specifying-options). We load the data from January and February, which we will use for training the model. (Note that specifying the schema when loading data into a DataFrame will [give better performance](http://data-informed.com/6-steps-to-get-top-performance-from-the-changes-in-spark-2-0/) than schema inference.}

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/read-data-json-file-into-dataset-1603259991766.png)

The Dataframe show method displays the first 20 rows:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/dataframe-show-method-1603260003975.png)

Here we load data from March and April which we will use for testing the model:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/march-april-data-1603260015870.png)

## Summary Statistics

Spark DataFrames include some [built-in functions](https://spark.apache.org/docs/latest/api/python/pyspark.sql.html#pyspark.sql.DataFrame) for statistical processing. The describe() function performs summary statistics calculations on all numeric columns and returns them as a DataFrame.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/perform-summary-statistics-1603260030384.png)

## Data Exploration

We can use Spark SQL to explore the dataset. Here are some example queries using the Spark SQL:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/register-dataset-as-a-temporary-view-1603260043715.png)

Below we display information for the longest departure delays:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/top-5-longest-departure-delays-1603260056308.png)

Below we display the average departure delay by Carrier:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/average-departure-delay-1603260067246.png)

We want to predict flight delays where depdelay > 40 minutes, so let’s explore this data. Below we see that United Airlines and Delta have the highest count of flight delays for Jan & Feb 2017 (the training set).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/count-of-departure-delays-by-carrier-1603260084783.png)

In the query below we see that Monday and Sunday have the highest count of flight delays.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/count-of-departure-delays-by-day-of-the-week-1603260094738.png)

In the query below we see that the hours between 13:00-19:00 have the highest count of flight delays.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/count-of-departure-delays-by-hour-of-day-1603260105210.png)

In the query below we see that the origin airports Chicago and Atlanta have the highest count of flight delays.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/count-of-departure-delays-by-origin-1603260115273.png)

In the query below we see that the destination airports San Francisco and Newark have the highest count of flight delays.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/count-of-departure-delays-by-destination-1603260125772.png)

In the query below we see the count of departure delays by Origin and destination. The routes ORD->SFO and DEN->SFO have the highest delays, maybe because of weather in January and February? Adding weather to this dataset would give better results, but that is left as an exercise for the reader.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/delays-by-origin-destination-1603260137188.png)

In the code below a Spark [Bucketizer](https://spark.apache.org/docs/2.2.0/ml-features.html#bucketizer) is used to split the dataset into delayed and not delayed flights with a delayed 0/1 column. Then the resulting total counts are displayed. Grouping the data by the delayed field and counting the number of instances in each group shows that there are roughly 8 times as many not delayed samples as delayed samples.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/add-labels-for-delayed-flights-1603260149465.png)

In the query below we see the count of not delayed (0=dark blue) and delayed (1=light blue) flights by origin.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/delays-by-origin-1603260162630.png)

## Stratified Sampling

In order to ensure that our model is sensitive to the delayed samples we can put the two sample types on the same footing using stratified sampling. The DataFrames sampleBy() function does this when provided with fractions of each sample type to be returned. Here, we're keeping all instances of delayed, but downsampling the not delayed instances to 29%, then displaying the results

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/stratify-the-sampling-to-fewr-not-delayed-1603260173743.png)

## FEATURES ARRAY

To build a classifier model, you extract the features that most contribute to the classification. In this scenario, we will build a tree to predict the label of delayed or not based on the following features:

* Label → delayed = 0
  - Delayed = 1  if delay > 40 minutes
* Features → {day of the week, scheduled departure time, scheduled arrival time, carrier, scheduled elapsed time, origin, destination, distance}

| **delayed** | **dofW** | **crsdepTime** | **crsArrTime** | **carrier** | **elapTime** | **origin** | **dest** | **dist** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.0/0.0 | 1 | 1015 | 1230 | AA | 385.0 | JKF | LAX | 2475.0 |

In order for the features to be used by a machine learning algorithm, they must be transformed and put into Feature Vectors, which are vectors of numbers representing the value for each feature.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/reference-learning-spark-1603260186018.png)

## USING THE SPARK ML PACKAGE

The [ML package](http://spark.apache.org/docs/latest/ml-guide.html) is the newer library of machine learning routines. [Spark ML provides a uniform set of high-level APIs built on top of DataFrames.](http://spark.apache.org/docs/latest/ml-pipeline.html#pipeline-components)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/ml-pipeline-1603260196123.png)

We will use an ML Pipeline to pass the data through transformers in order to extract the features and an estimator to produce the model.

- Transformer: A Transformer is an algorithm which transforms one DataFrame into another DataFrame. We will use a transformer to get a DataFrame with a features vector column.
- Estimator: An Estimator is an algorithm which can be fit on a DataFrame to produce a Transformer. We will use a an estimator to train a model which can transform data to get predictions.
- Pipeline: A Pipeline chains multiple Transformers and Estimators together to specify a ML workflow.

## Feature Extraction and Pipelining

The ML package needs the label and feature vector to be added as columns to the input dataframe. We set up a pipeline to pass the data through transformers in order to extract the features and label.  We use a StringIndexer to encode a string columns to a column of number indices. We use a OneHotEncoder to map a number indices column to a column of binary vectors, with at most a single one-value. Encoding categorical features allows decision trees to treat categorical features appropriately, improving performance. An example of StringIndexing and OneHotEncoding for carrier is shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/example-stringindexing-1603260208808.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/combination-stringindexer-onehotencoder-1603260221098.png)

Below a Bucketizer is used to add a label of delayed 0/1. The VectorAssembler combines a given list of columns into a single feature vector column.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/vectorassembler-transformer-1603260233625.png)

The result of running these transformers in a pipeline will be to add a label and features column to the dataset as shown below.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/add-label-features-column-1603260245500.png)

The final element in our pipeline is an estimator (a decision tree classifier), training on the vector of labels and features.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/create-decision-tree-estimator-1603260259278.png)

Below we chain the indexers and tree in a Pipeline.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/chain-indexers-1603260267909.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/tree-pipeline-1603260278538.png)

## TRAIN THE MODEL

We would like to determine which parameter values of the decision tree produce the best model. A common technique for model selection is k-fold cross validation, where the data is randomly split into k partitions. Each partition is used once as the testing data set, while the rest are used for training. Models are then generated using the training sets and evaluated with the testing sets, resulting in k model performance measurements. The model parameters leading to the highest performance metric produce the best model.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/ml-cross-validation-process-1603260289452.png)

Spark ML supports k-fold cross validation with a transformation/estimation pipeline to try out different combinations of parameters, using a process called grid search, where you set up the parameters to test, and a cross validation evaluator to construct a model selection workflow.

Below, we use a ParamGridBuilder to construct the parameter grid. We define an Evaluator, which will evaluate the model by comparing the test label column with the test prediction column. We use a CrossValidator for model selection.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/setup-crossvalidator-with-parameters-1603260303905.png)

The CrossValidator uses the Estimator Pipeline, the Parameter Grid, and the Classification Evaluator to fit the training data set and returns a model.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/use-cross-validator-estimator-1603260318523.png)

The CrossValidator uses the ParamGridBuilder to iterate through the maxDepth parameter of the decision tree and evaluate the models, repeating 3 times per parameter value for reliable results.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/crossvalidator-1603260329067.png)

Next, we can get the best decision tree model, in order to print out the decision tree and feature importances. (Note that the OneHotEncoders increases the number of features. In order to understand this printout better I built a tree without the encoders, which gave a slightly lower accuracy)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/get-the-best-decision-tree-model-1603260338670.png)

We find that the best tree model produced using the cross-validation process is one with a depth of 6. The toDebugString() function provides a print of the tree's decision nodes and final prediction outcomes at the end leaves. Below is a partial printout of the decision tree:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/treemodel-todebugstring-1603260350331.png)

The features numbers correspond to the following:

`( 0=carrierIndexed, 1=destIndexed, 2=originIndexed, 3=dofW, 4=crsdephour, 5=crselapsedtime, 6=crsarrtime, 7=crsdeptime, 8=dist)`

Below we can see that the feature importance in order is

1. scheduled departure time  (feature 7)
2. destination  (feature 1)
3. origin (feature 2)
4. scheduled arrival time (feature 6)
5. day of the week  (feature 3)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/featureimportances-1603260369952.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/features-importances-1603260389746.png)

Decision trees are often used for feature selection because they provide an automated mechanism for determining the most important features (those closest to the tree root).

## Predictions and Model Evaluation

The actual performance of the model can be determined using the test data set that has not been used for any training or cross-validation activities.

We transform the test Dataframe with the model pipeline, which will tranform the features according to the pipeline, estimate and then return the label predictions in a column of a new dataframe.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/dataframe-1603260403535.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/get-predictions-from-test-dataset-1603260414077.png)

The evaluator will provide us with the score of the predictions. Accuracy is measured by the area under the ROC curve. The area measures the ability of the test to correctly classify true positives from false positives. A random predictor would have .5 accuracy. The closer the value is to 1 the better its predictions are. In this case, the evaluation returns 81% precision.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/evaluator-predictions-1603260427433.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/evaluate-predictions-accuarcy-1603260438521.png)

Below, we calculate some more metrics. The number of false/true positive and negative predictions is also useful:

- True positives are how often the model correctly predicted delayed flights.
- False positives are how often the model incorrectly predicted delayed flights.
- True negatives indicate how often the model correctly predicted not delayed flights.
- False negatives indicate how often the model incorrectly predicted not delayed flights.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/calculate-some-more-metrics-1603260455772.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/calculate-some-more-metrics-2-1603260464963.png)

## SAVE THE MODEL

We can now save our fitted Pipeline for later use with streaming events. This saves both the feature extraction stage and the decision tree model chosen by model tuning.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/save-model-to-file-system-1603260479132.png)

The result of saving the pipeline model is a JSON file for metadata and a Parquet for model data. We can re-load the model with the load command , the original and re-loaded models are the same:

`val sameCVModel = CrossValidatorModel.load(“../cfModel")`

## Code

- You can download the code and data to run these examples from here: [https://github.com/caroljmcdonald/spark-ml-flightdelay](https://github.com/caroljmcdonald/spark-ml-flightdelay)
- [Zeppelin Notebook for the code](https://github.com/caroljmcdonald/spark-ml-flightdelay/blob/master/notebooks/sparkmlpipelineflightdelays.json)

## Running the Code

All of the components of the use case architecture we just discussed can run on the same cluster with the MapR Data Platform.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/mapr-cdp-1603260494864.png)