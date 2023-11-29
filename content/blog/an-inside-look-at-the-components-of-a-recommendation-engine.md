---
title: "An Inside Look at the Components of a Recommendation Engine"
date: 2021-01-22T06:01:22.914Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","Elasticsearch"]
authorimage: "/img/blogs/Avatar6.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2015-04-09T07:00:00.000Z",
"tags": "machine-learning"
```

---

Recommendation engines help narrow your choices to those that best meet your particular needs. In this post, we’re going to take a closer look at how all the different components of a recommendation engine work together. We’re going to use collaborative filtering on movie ratings data to recommend movies. The key components are a collaborative filtering algorithm in <a target='\_blank'  href='http://mahout.apache.org/'>Apache Mahout</a> to build and train a machine learning model and search technology from <a target='\_blank'  href='https://www.elastic.co/elasticsearch/'>Elasticsearch</a> to simplify deployment of the recommender.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/recommendation-engine-video-1611295605722.png)

## What is Recommendation?

Recommendation is a class of machine learning that uses data to predict a user's preference for or rating of an item.  Recommender systems are used in industry to recommend:

*   Books and other products (e.g. Amazon)
*   Music (e.g. Pandora)
*   Movies (e.g. Netflix)
*   Restaurants (e.g. Yelp)
*   Jobs (e.g. LinkedIn)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/netflix-recommendation-engine-1611295620220.png)

The recommender relies on the following observations:

1.  Behavior of users is the best clue to what they want.
2.  Co-occurrence is a simple basis that allows Apache Mahout to compute significant indicators of what should be recommended.
3.  There are similarities between the weighting of indicator scores in output of such a model and the mathematics that underlie text retrieval engines.
4.  This mathematical similarity makes it possible to exploit text-based search to deploy a Mahout recommender using a search engine like Elasticsearch.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/recommendation-engine-architecture-1611295634594.png)

## Architecture of the Recommendation Engine

The architecture of the recommendation engine is shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/architecture-recommendation-engine-1611295647852.png)

1.  Movie information data is reformatted and then stored in Elasticsearch for searching.
2.  An item-similarity algorithm from Apache Mahout is run with user movie ratings data to create recommendation indicators for movies. These indicators are added to the movie documents in Elasticsearch.  
3.  Searches of a user's preferred movies among the indicators of other movies will return a list of new films sorted by relevance to the user's taste.

## Collaborative Filtering with Mahout

A Mahout-based collaborative filtering engine looks at what users have historically done and tries to estimate what they might likely do in the future, if given a chance. This is accomplished by looking at a history of which items users have interacted with. In particular, Mahout looks at how items co-occur in user histories.  Co-occurrence is a simple basis that allows Apache Mahout to compute significant indicators of what should be recommended. Suppose that Ted likes movie A, B, and C. Carol likes movie A and B. To recommend a movie to Bob, we can note that since he likes movie B and since Ted and Carol also liked movie B, movie A is a possible recommendation. Of course, this is a tiny example. In real situations, we would have vastly more data to work with.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/recommendation-grid-1611295660227.png)

In order to get useful indicators for recommendation, Mahout’s ItemSimilarity program builds three matrices from the user history:

**1\. History matrix:**  contains the interactions between users and items as a user-by-item binary matrix.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/history-matrix-1611295671003.png)

**2\. Co-occurrence matrix:**  transforms the history matrix into an item-by-item matrix, recording which items co-occur or appear together in user histories.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/co-occurrence-matrix-1611295696721.png)

In this example movie A and movie B co-occur once, while movie A and movie C co-occur twice. The co-occurrence matrix cannot be used directly as recommendation indicators because very common items will tend to occur with lots of other items simply because they are common.  

**3\. Indicator matrix:** The indicator matrix retains only the anomalous (interesting) co-occurrences that will serve as clues for recommendation. Some items (in this case, movies) are so popular that almost everyone likes them, meaning they will co-occur with almost every item, which makes them less interesting (anomalous) for recommendations.  Co-occurrences that are too sparse to understand are also not anomalous and thus are not retained. In this example, movie A is an indicator for movie B.    

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/indicator-matrix-1611295706790.png)

Mahout runs multiple MapReduce jobs to calculate the co-occurrences of items in parallel. (Mahout 1.0 runs on Apache Spark). Mahout’s ItemSimilarityJob uses the log likelihood ratio test (LLR) to determine which co-occurrences are sufficiently anomalous to be of interest as indicators. The output gives pairs of items with a similarity greater than the threshold you provide.

The output of the Mahout ItemSimilarity job gives items that identify interesting co-occurrences, or that indicate recommendation, for each item. For example, the Movie B row shows Movie A is indicated, and this means that liking Movie A is an indicator that you will like Movie B.  

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/indicator-matrix-2-1611295716322.png)

## Elasticsearch Search Engine

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/elasticsearch-search-engine-1611295728868.png)

Elasticsearch is an open-source search engine built on top of Apache Lucene™, a full-text search engine library. Full-text search uses precision and recall to evaluate search results:

*   Precision = proportion of top-scoring results that are relevant
*   Recall = proportion of relevant results that are top-scoring

Elasticsearch stores documents, which are made up of different fields. Each field has a name and content. Fields can be indexed and stored to allow documents to be found by searching for content found in fields.

For our recommendation engine, we store movie meta data such as id, title, genre, and also movie recommendation indicators, in a JSON document:

```json
{
"id": "65006",
"title": "Electric Horseman",
"year": "2008",
"genre": ["Mystery","Thriller"]
}
```

The output row from the indicator matrix that identified significant or interesting co-occurrence is stored in the Elasticsearch movie document indicator field. For example, since Movie A is an indicator for Movie B, we will store Movie A in the indicator field in the document for Movie B. That means that when we search for movies with Movie A as an indicator, we will find Movie B and present it as a recommendation.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/recommendation-matrix-1-1611295740359.png)

Search engines are optimized to find a collection of fields by similarity to a query. We will use the search engine to find movies with the most similar indicator fields to a query.