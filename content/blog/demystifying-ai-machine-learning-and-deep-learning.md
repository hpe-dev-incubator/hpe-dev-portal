---
title: "Demystifying AI, Machine Learning and Deep Learning"
date: 2020-11-25T02:31:24.462Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","machine-learning","AI","deep-learning"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2017-08-16T12:00:00.000",
"tags": ["machine-learning","deep learning"]
```

---

Deep learning, machine learning, artificial intelligence - all buzzwords and representative of the future of analytics. In this post we will explain what is machine learning and deep learning at a high level with some real world examples. In future posts we will explore vertical use cases. The goal of this is not to turn you into a data scientist, but to give you a better understanding of what you can do with machine learning. Machine learning is becoming more accessible to developers, and Data scientists work with domain experts, architects, developers and data engineers, so it is important for everyone to have a better understanding of the possibilities. Every piece of information that your business generates has potential to add value. This and future posts are meant to provoke a review of your own data to identify new opportunities.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/mlexamples-1606272628062.png)

## What is Artificial Intelligence?

Throughout the history of AI the definition has been continuously redefined.  AI is an umbrella term, the idea started in the 50s, machine learning is a subset of AI and deep learning is a subset of ML.  

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/ai-1606272643389.png)

_Image reference: [AI/ML/DL]( https://blogs.nvidia.com/blog/2016/07/29/whats-difference-artificial-intelligence-machine-learning-deep-learning-ai/)_

In 1985, when I was a student interning at the NSA, AI was also a very hot topic. At the NSA I even took an  MIT video (VCR) class on AI, which was about expert systems. Expert systems capture an expert's knowledge in a rules engine. Rules engines have wide use in industries such as finance and healthcare, and more recently for event processing, but when data is changing, rules  can become difficult to update and maintain.  Machine learning has the advantage that it learns from the data, and it can give data driven probabilistic predictions.

![Expert System](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/system-1606272654657.png)

_Image reference: [expert-system](https://www.pcmag.com/encyclopedia/term/42865/expert-system)_

[According to Ted Dunning](https://www.foxbusiness.com/features/7-tips-for-machine-learning-success), it is better to use precise terminology, like Machine Learning or Deep Learning instead of the word AI, because before we get something to work well, we call it AI, afterwards, we always call it something else. AI is better used as a word for the next frontier.

## How Has Analytics Changed in the Last 10 Years?
According to [Thomas Davenport in the HBR](https://hbr.org/2017/06/how-analytics-has-changed-in-the-last-10-years-and-how-its-stayed-the-same), analytical technology has changed dramatically over the last decade, with more powerful and less expensive distributed computing across commodity servers, streaming analytics, and improved machine learning technologies, enabling companies to store and analyze both far more data and many different types of it.

Traditionally data was stored on a RAID system, sent to a multi-core server for processing and sent back for storage, which caused a bottleneck on data transfer, and was expensive. With file and table storage like MapR XD and MapR Database, data is distributed across a cluster, and Hadoop technologies like MapReduce, Pig, and Hive send the computing task to where the data resides.

![MapR XD](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/xd-1606272673595.png)

Technologies like Apache Spark speed up parallel processing of distributed data even more with iterative algorithms by caching data in memory across iterations and using lighter weight threads.

![Apache Spark](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-1606272692913.png)

MapR Event Store, a new distributed messaging system for streaming event data at scale, combined with Stream processing like Apache Spark streaming, or Apache Flink, speed up parallel processing of real time events with machine learning models.

![MapR Event Store](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/maprstreams-1606272706000.png)

Graphical Processing Units (GPUs) have sped up multi-core servers for parallel processing.  A GPU has a massively parallel architecture consisting of thousands of smaller, more efficient cores designed for handling multiple tasks simultaneously.  Whereas a CPU consists of a few cores optimized for sequential serial processing. [In terms of potential performance, the evolution from the Cray-1 to today’s clusters with lots of GPU’s  is roughly a million times what was once the fastest computer on the planet at a tiny fraction of the cost](https://www.kdnuggets.com/2017/06/deep-learning-demystifying-tensors.html).

![GPU](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/gpu-1606272719191.png)

_Image reference: [AI Computing](http://www.nvidia.com/object/what-is-gpu-computing.html)_

## What is Machine Learning?
Machine learning uses algorithms to find patterns in data, and then uses a model that recognizes those patterns to make predictions on new data.

![ML](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/ml-1606272731259.png)

In general, machine learning may be broken down into two types: supervised, unsupervised, and in between those two. Supervised learning algorithms use labeled data, unsupervised learning algorithms find patterns in unlabeled data. Semi-supervised learning uses a mixture of labeled and unlabeled data. Reinforcement learning trains algorithms to maximize rewards based on feedback.

![ML](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/ml2-1606272742434.png)

## Supervised Learning

Supervised algorithms use labeled data in which both the input and target outcome, or label, are provided to the algorithm.

![Supervised Learning](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/sl-1606272757444.png)

Supervised Learning is also called predictive modeling or predictive analytics, because you build a model that is capable of making predictions. Some examples of predictive modeling are classification and regression. Classification identifies which category an item belongs to (for example whether a transaction is fraud or not fraud), based on labeled examples of known items (for example transactions known to be fraud or not).  Logistic regression predicts a probability, for example the probability of fraud. Linear regression predicts a numeric value, for example the amount of fraud.

![Fraud](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/fraud-1606272770701.png)

Some examples of Classification include:

* credit card fraud detection (fraud, not fraud)
* credit card application   (good credit, bad credit)
* email spam detection (spam, not spam)
* text sentiment analysis (happy, not happy)
* Predicting patient risk  (high risk patient, low risk patient)
* classifying a tumor as malignant or not

Some examples of logistic regression (or other algorithms)  include:

* given historical car insurance fraudulent claims and features of the claims such as age of the claimant, claimed amount, severity of the accident,  predict the probability of fraud.
* given patient characteristics predict the probability of congestive heart failure.

Some examples of linear regression include:
* Given historical car insurance fraudulent claims and features of the claims such as age of the claimant, claimed amount, severity of the accident,  predict the amount of fraud.
* Given historical real estate sales prices and  features of houses(square feet, number of bedrooms, location..) predict a house’s price.
* Given historical neighborhood crime statistics, predict crime rate.

There are other Supervised and Unsupervised learning Algorithms [shown below](https://scikit-learn.org/stable/tutorial/machine_learning_map/index.html), which we won’t go over, but we will look at one example of each in more detail.

![Algorithms](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/algorithm-1606272784378.png)

_Image reference: [Supervised and Unsupervised learning Algorithms](https://scikit-learn.org/stable/tutorial/machine_learning_map/index.html)_

## Classification Example Debit Card Fraud
Classification takes a set of data with known labels and pre-determined features and learns how to label new records based on that information. Features are the “if questions” that you ask. The label is the answer to those questions.

![Duck](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/duck-1606272802082.png)

Let’s go through an example of Debit Card Fraud:

* What are we trying to predict?
  * Whether a debit card transaction is fraud or not
  * Fraud is the Label:  True or False
* What are the “if questions” or properties that you can use to make predictions?
  * Is the amount spent today > historical average?
  * Are there transactions in multiple countries today?
  * Are the number of transactions today > historical average?
  * Are the number of new merchant types today high compared to the last 3 months?
  * Are there multiple purchases today from merchants with a category code of risk?
  * Is there unusual signing activity today compared to using historically using pin?
  * Are there new state purchases compared to the last 3 months?
  * Are there foreign purchases today compared to the last 3 months?

To build a classifier model, you extract the features of interest that most contribute to the classification.

## Decision Trees
Decision trees create a model that predicts the class or label, based on several input features. Decision trees work by evaluating a question containing a feature at every node and selecting a branch to the next node, based on the answer. A possible decision tree for predicting debit card fraud is shown below. The feature questions are the nodes, and the answers “yes” or “no” are the branches in the tree to the child nodes. (Note that a real tree would have more nodes).

* Q1: Is the amount spent in 24 hours > average
  * Yes
  * Q2: Are there multiple purchases today from risky merchants?
   * Yes Fraud 90%
   * Not Fraud 50%

![Decision Tree](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/decisiontree-1606272815273.png)

Decision trees are popular because they are easy to visualize and explain. The accuracy of models can be improved by combining algorithms with ensemble methods.  An ensemble example is Random forest, which combines multiple random subsets of decision trees.  

## Unsupervised Learning

Unsupervised learning, also sometimes called descriptive analytics,  does not have  labeled data provided in advance. These algorithms discover similarities, or regularities in the input data.  An example of unsupervised learning is grouping similar customers, based on purchase data.

![Unsupervised Learning](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/ul-1606272827176.png)

## Clustering

In clustering, an algorithm classifies inputs into categories by analyzing similarities between input examples.  Some clustering use cases include:

* search results grouping
* grouping similar customers
* grouping similar patients
* Text categorization
* Network Security Anomaly detection (finds what is not similar, the outliers from clusters)

![Clustering](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/cluster-1606272838221.png)

The K-means  algorithm groups observations into K clusters in which each observation belongs to the cluster with the nearest mean from its cluster center.

![K-means](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/k-means-1606272852036.png)

An example of clustering is a company that wants to segment its customers in order to better tailor products and offerings. Customers could be grouped on features such as demographics and purchase histories. Clustering with unsupervised learning is often combined with Supervised learning in order to get more valuable results. For example in this banking customer 360 use case, customers were first segmented based on answers to a survey. The customer groups were analyzed and labeled with customer personas. These labels were then linked by customer Id with features such as types of accounts and purchases. Finally supervised machine learning was applied and tested with the labeled customers, allowing to link the survey customer personas with their banking actions and provide insights.

![Surveys](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/survey-1606272868644.png)

## Deep Learning

Deep learning is the name for multilayered neural networks, which are networks composed of several “hidden layers” of nodes between the input and output.  There are many variations of neural networks, which you can learn more about on this [neural network cheat sheet](https://www.asimovinstitute.org/neural-network-zoo/). Improved algorithms, GPUs and massively parallel processing (MPP), have given rise to networks with thousands of layers.  Each node takes input data and a weight and outputs a confidence score to the nodes in the next layer, until the output layer is reached where the error of the score is calculated. With [backpropagation](https://en.wikipedia.org/wiki/Backpropagation) inside of a process called [gradient descent](https://en.wikipedia.org/wiki/Gradient_descent), the errors are sent back through the network again and the weights are adjusted improving the model. This process is repeated thousands of times, adjusting a model’s weights in response to the error it produces, until the error can’t be reduced any more.

![Process](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/process-1606272882881.png)

During this process the layers learn the optimal features for the model, which has the advantage that features do not need to be predetermined. However this has the disadvantage that the model’s decisions are not explainable. Because explaining the decisions can be important, researchers are developing [new ways to understand the black box of deep learning](https://www.sciencemag.org/news/2017/07/how-ai-detectives-are-cracking-open-black-box-deep-learning).

There are different variations of Deep Learning Algorithms, which can be used to build data-driven applications such as the following:

![Deep Learning QSS](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/qss-1606272896542.png)

*Deep Neural Networks for Improved Traditional Algorithms*
* Finance: Enhanced Fraud Detection through identification of more complex patterns
* Manufacturing: Enhanced identification of defects based on deeper anomaly detection

*Convolutional Neural Networks for images*
* Retail: in-store activity analysis of video to measure traffic
* Satellite images: labeling terrain, classifying objects
* Automotive: recognition of roadways and obstacles
* Healthcare: diagnostic opportunities from x-rays, scans, etc.
* Insurance: estimating claim severity based on photographs

*Recurrent Neural Networks for sequenced data*
* Customer satisfaction: transcription of voice data to text for NLP analysis
* Social media: real-time translation of social and product forum posts
* Photo captioning: search archives of images for new insights
* Finance: Predicting behavior based via time series analysis (also enhanced recommendation systems

## Additional Resources and References

* [7 tips for Machine Learning Success](https://www.foxbusiness.com/features/7-tips-for-machine-learning-success)
* [The Top 10 AI And Machine Learning Use Cases Everyone Should Know About](https://www.forbes.com/sites/bernardmarr/2016/09/30/what-are-the-top-10-use-cases-for-machine-learning-and-ai/)
* [Visual Introduction to machine learning](http://www.r2d3.us/visual-intro-to-machine-learning-part-1/)
* [A Brief History of AI](https://francesco-ai.medium.com/a-brief-history-of-ai-baf0f362f5d6)
* [How artificial intelligence can deliver real value to companies](https://www.mckinsey.com/business-functions/mckinsey-analytics/our-insights/how-artificial-intelligence-can-deliver-real-value-to-companies)