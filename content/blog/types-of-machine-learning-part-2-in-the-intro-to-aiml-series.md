---
title: "Types of Machine Learning – Part #2 in the Intro to AI/ML Series"
date: 2020-12-09T07:38:36.968Z
author: Saira Kennedy 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","machine-learning","AI"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Saira Kennedy",
"publish": "2018-09-28T07:00:00.000Z",
"tags": "machine-learning"
```

---

Based on MapR Academy course, [Introduction to Artificial Intelligence and Machine Learning](https://learn.ezmeral.software.hpe.com/bus-introduction-to-artificial-intelligence-and-machine-learning)

In this post – second in the Intro to AI/ML Series – we discuss the different methods of machine learning and some of the most common algorithms available for your projects. [Read the first blog in this series here](/blog/kkLZ0mNpXqhQMZLRJQqr/artificial-intelligence-and-machine-learning-what-are-they-and-why-are-t).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image12-1607499687612.jpg)

## Types of Machine Learning

There are a few different types of machine learning, but they generally fall into these main groups. Supervised and unsupervised learning are the primary learning types, along with semi-supervised learning.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image8-1607499695694.jpg)

Other methods sit in the middle or outskirts of these methodologies, such as reinforcement learning, which describes a machine that creates a cyclical learning cycle as it continuously trains itself from its own results. These results are then fed back into itself as input data. We won't be going into much detail on these other techniques, but further information can be found online.

First, let's understand what differentiates each of these learning types from each other and how they work.

## Supervised Learning: Defined

Supervised learning uses labeled data to train machines to learn the relationships between given inputs and outputs.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image4-1607499702919.jpg)

A label is a known description given to objects in the data, which trains the machine on what to look for. Labels also provide the structure of the algorithm output, as any result must be one of these labels. Therefore, you can think of labels as a schema, defining the possible output that we want the machine to look for.

Think of supervised learning as the algorithm to use when data scientists have labeled input data and when the type of behavior to predict is known. We want the machine to learn the patterns used to classify this data and apply those patterns to classify new data.

## How Supervised Learning Works

* First, labeled or classified data is loaded into the system. The preparation of labeled data makes this step the most time-consuming, as it is often done by a human trainer.
* The model is trained and connections to inputs and outputs are made.
* As new data is introduced, the algorithm is applied.
* Output is categorized data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image9-1607499710729.jpg)

In the previous post, where we provided the cat example on labeled data, the trained labels include ears, nose, tail, paws, and cat, which the algorithm then applies to presented data, in this case an image of a cat, and returns the results of known output as "cat," yes.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image10-1607499718508.jpg)

## Pros and Cons of Supervised Learning

Supervised learning always has a clear objective and can be easily measured for accuracy. The training of the machine is also tightly controlled, which leads to very specific behavioral outcomes.

On the downside, it is often very labor-intensive, as all data needs to be labeled before the model is trained, which can take hundreds of hours of specialized human effort. The costs can become astronomical. This creates an overall slower training process and may also limit the data that it can work with.

| Pros | Cons |
| --- | --- |
| Very clear objective | Often labor-intensive |
| Easy to measure accuracy | Limited data to work with |
| Controlled training | Limited insights |

Finally, insights may be more limited, as the predicted behavior is described in advance. There is no freedom for the machine to explore other possibilities, as we will see with unsupervised learning.

In supervised learning, there are primarily two categories of algorithms: classification and regression.

A classification algorithm organizes input data as belonging to one of several predefined classes. This algorithm is the most useful for providing categorical results that fit within the predefined labels. It is very effective with well-calculated if-then rules and distinguishes one class of objects from another.

| Type | Algorithm or Task |
| --- | --- |
| Supervised | Classification (used to predict a categorical result) |
| Supervised | Regression (used to predict the output value given the input value) |

## Supervised Algorithms

## Classification: Used to predict a categorical result

Some common use cases for classification algorithms include credit card fraud detection and email spam detection, both of which are binary classification problems, meaning there are only two possible output values. Data is labeled, for example, as fraud/non-fraud or spam/non-spam.

Generally, if the question we are asking of a model is open-ended or if the potential answers are not categorical, then we aren't dealing with a classification problem, but more likely a regression one.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image13-1607499726836.jpg)

A regression algorithm attempts to predict the output value given the input value. Regression problems are predictive of a continuous numerical, as opposed to categorical, result.

Think of this continuous value as a range or average, something that is estimating the relationship between variables.

## Regression: Used to predict the output value given the input value

For example, this type of algorithm can be used to determine how profitable a credit card model is. It is also used to predict customer or employee churn models.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image2-1607499735202.jpg)

Regression algorithms determine the strength of correlation between two attributes, allowing you to find a predictive range of likelihood.

## Supervised Algorithms Table

This table depicts some of the most common algorithms used with supervised learning types. It is important to understand that many machine learning data models will use more than one, and sometimes many, different algorithms for a project.

| Type | Algorithm or Task |
| --- | --- |
| Classification | Naïve Bayes |
| Classification | Logistic Regression |
| Classification | Support Vector Machines (SVMs) |
| Regression | Linear Regression |
| Both | Decision Trees/Random Forest |
| Both | *k*-Nearest Neighbors (*k*-NN) |
| Both | Gradient Boosting Algorithms |

## Unsupervised Learning: Defined

While supervised learning involves having labeled data to find input-output relationships during the training phase, unsupervised learning has no knowledge of the output label. In this type of ML, the machine finds groups and patterns in the data on its own, and there is no specific outcome or target to predict.

Think of unsupervised learning as the algorithm to use when we don't know how to classify the data and we want the machine to classify or group it for us.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image11-1607499742282.jpg)

## How Unsupervised Learning Works

Here are the steps of how the unsupervised learning algorithm works:

* First, unlabeled raw data is loaded into the system.
* Next, the algorithm analyzes the data.
* It looks for patterns on its own.
* Then, it identifies and groups patterns of behavior and provides output results.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image1-1607499749885.jpg)

## Pros and Cons of Unsupervised Learning

Compared to supervised learning, unsupervised learning projects are much faster to implement, as no data labeling is required. In this regard, it uses fewer human resources. It also interprets data on its own and has the potential to provide unique, disruptive insights for a business to consider.

However, unsupervised learning can be difficult to measure for accuracy because there is no expected result to compare it to. It can require more experimentation and tuning to get meaningful results.

Lastly, unsupervised learning does not natively handle high-dimensional data, or massively large datasets with considerable variance, well. This is known as the curse of dimensionality. In some cases, the dimensions, or number of variables, may need to be reduced for it to work effectively. This requires human-intensive data cleansing.

| Pros | Cons |
| --- | --- |
| Very fast to start | Difficult to measure accuracy |
| Disruptive insights | Requires more experience |
|  | Curse of dimensionality |

## Common Use Cases for Unsupervised Algorithms

Let's take a look at a common use case example using cluster analysis. Cluster analysis has the goal of organizing raw data into related groups and is often used for anomaly detection.

A security company uses it to identify unusual patterns in network traffic, indicating potential signs of a security breach or intrusion.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image5-1607499758343.jpg)

## Unsupervised Learning Use Case – Anomaly Detection

Recall the steps of how this type of algorithm works.

* First, the security company streams in raw network traffic data.
* Next, the algorithm analyzes the data on its own and looks for unusual patterns.
* Then, it identifies patterns of behavior as either normal or suspect.
* When suspect behavior is identified, the output is provided and the company is notified.

With this example using anomaly detection, a scatter plot may return results looking something like the image below. The green dots indicate behavior that is grouped together as normal, and the red dots show the potential outliers that are sent back as suspect.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image14-1607499766291.jpg)

This table depicts some unsupervised learning algorithms. The most common algorithm here is *k*-means, for cluster analysis, which is what we've just focused on with our security use case example on anomaly detection.

| Type | Algorithm or Task |
| --- | --- |
| Unsupervised | \_k\_\-Means: Cluster Analysis |
| Unsupervised | Association Rule Learning |
| Unsupervised | Dimensionality Reduction Techniques (PCA, SVD) |

## Semi-Supervised Learning: Defined

Semi-supervised learning includes a combination of supervised and unsupervised learning types together. Usually, this means that only a part of the provided input data is labeled, which the machine is trained on. It then learns to create additional labels and classifiers for raw data, on its own, which in turn gets added back to the original training data set.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image6-1607499774519.jpg)

## How Semi-Unsupervised Learning Works

As a combination of the previous two learning types, let's look at how a common self-training algorithm, from the semi-supervised learning method, works:

* First, an initial set of labeled input training data is loaded into the system.
* The model is trained on the data. Then, a new data set of unlabeled data is presented.
* The algorithm infers new labels and classifiers to apply to the new data. High\-confidence data, or data that scores well based on the algorithm, is added back to the original labeled data set. From here, the machine progressively adapts and learns in an iterative process.
* In some cases, when the labels and the rule-based engine conflicts, a human is needed for verification.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image15-1607499782353.jpg)

## Semi-Supervised Algorithms Table

This table depicts some semi-supervised learning algorithms.

| Type | Algorithm or Task |
| --- | --- |
| Semi-Supervised | Self-Training Algorithms |
| Semi-Supervised | Generative Model – Gaussian Mixture Model |
| Semi-Supervised | Graph-Based Algorithms – Label Propagation |

## Check your Knowledge

Classify the items listed below as a supervised, semi-supervised, or unsupervised learning method:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image16-1607499789317.png)

Answer Key:

Works on both labeled data and raw data: Semi-supervised

Easiest data preparation method: Unsupervised

Only uses labeled input data: Supervised

Infers patterns on its own: Unsupervised

Output is predefined: Supervised

Can be used to automate data labeling: Semi-supervised

## More Resources:  Machine Learning Libraries

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/image3-1607499796807.jpg)

## Where do we go from here

Keep your eyes out for the next post in this series, discussing real world use cases for AI and ML.