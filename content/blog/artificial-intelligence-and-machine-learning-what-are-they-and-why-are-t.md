---
title: "Artificial Intelligence and Machine Learning: What Are They and Why Are They Important?"
date: 2020-11-12T08:03:23.804Z
author: Saira Kennedy 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","machine-learning","AI"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information

```
"authorDisplayName": "Saira Kennedy",
"publish": "2018-09-21T07:00:00.000Z",
"tags": "machine-learning"
```

---

Editor's Note: This post is based on the MapR Academy course, [_Introduction to Artificial Intelligence and Machine Learning_](https://learn.ezmeral.software.hpe.com/bus-introduction-to-artificial-intelligence-and-machine-learning).

This post will give you a basic background on artificial intelligence and machine learning. It's a good place to gain an intro-level, working understanding of the categories, how they fit together, and their differences.

In this post, we begin by defining the differences between artificial intelligence and machine learning and what these terms mean. In future posts, we will discuss the different methods of machine learning and some of the most common algorithms available for your projects. After that, you'll learn about real-world use cases, utilizing this technology, and the unique value MapR solutions provide for machine learning endeavors.

## Where do AI and ML fit in data science?

Before we get into the finer details of artificial intelligence and machine learning, let's see how it fits in the larger world of data science. Because this field is rapidly changing, some people may be confused or disagree about the overall landscape and terms being used in the industry, so let's clarify how we will be defining them in this blog.

Think of a series of Russian nesting dolls, but now imagine them as futuristic robot dolls, like the ones pictured below. With this analogy, we can have multiple robot dolls nested within each level.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image6-1605168354596.jpg)

With these nesting robot dolls, version 2.0, the largest doll represents the entire field of data science. The second doll represents artificial intelligence, and the next doll represents machine learning. A fourth doll, for deep learning, can also be nested within the machine learning doll, but we won't be going into much depth on that topic in this post.

## What is Data Science?

Both artificial intelligence and machine learning nest under the largest doll of data science, whose purpose is to extract insights from data. Data science analyzes large amounts of data to deliver value and give businesses a competitive edge across all industries. As an example, retail businesses analyze buyer habits to better target recommendations and promotions to their customers.

In the growing world of big data, it is important to have an effective data science strategy to help make informed business decisions. All these fields have become more prominent, as the attempts to meet the growing demand for finding more efficient ways to extract value from data at scale has increased.

Using artificial intelligence to accomplish these goals is a natural outgrowth of the big data movement.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image13-1605168362957.jpg)

## What is Artificial Intelligence?

Artificial intelligence describes a machine that is capable of imitating and performing intelligent human behavior. Some of these tasks could include problem-solving and decision-making or specific activities requiring acute perception, recognition, or translation abilities.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image11-1605168371076.jpg)

Remember from the robot nesting doll example that machine learning is nested within artificial intelligence; therefore, all machine learning counts as AI, but not all AI counts as machine learning. Other robot dolls within classic AI, without machine learning, would include expert systems using symbolic artificial intelligence and AI Planning.

## Symbolic Artificial Intelligence

Symbolic artificial intelligence is one of the first approaches to AI, which is based on the assertion that human intelligence can be achieved through the manipulation of symbols. This is the basis for physical symbol systems, also called formal systems, which center around three basic concepts that follow human thinking abilities:

* Symbols, like the plus sign as the physical joining of two perpendicular lines, are first encoded in our brains.
* Thoughts are the structures, like the plus sign means to add things together.
* The manipulation process is the act of thinking, or applying the symbol and its structure together, like when we use the plus sign in a mathematical equation for one plus two equals three.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image15-1605168382441.jpg)

To understand this concept more clearly, let's take a look at a couple of specific examples. Physical Symbol System examples include algebra, formal logic, and even chess.

## Physical Symbol Example:  Algebra

In algebra, the numbers and mathematical operators of plus, x, equals, et cetera, are the symbols. The equations and formulas are the expressions, and the calculation is the manipulated expression response.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image1-1605168391109.jpg)

## Physical Symbol System Example:  Formal Logic

With formal logic problems, words like "if," "or," and "not," are the symbols. The structures are true or false statements, and the process manipulation are the rules of logical deduction, which result in the final expression. So, we could say "If a primarily healthy adult has a fever, then they may have the flu."

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image5-1605168398975.jpg)

## Physical Symbol System Example:  Chess

And in games, such as chess, the defined number of pieces are the symbols, and the legal chess moves are the structures. The manipulated expressions are the resulting positions of the pieces on the board after each move.

This AI approach states that machines are capable of mimicking this behavior. Though interest in this approach has faded over time, it led to the development of expert systems, which are widely considered to be one of the first successful forms of artificial intelligence.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image10-1605168407973.jpg)

## Expert Systems

An expert system is a computer system that is designed to solve problems by imitating the decision-making abilities of a human expert. This system uses two subsystems: a knowledge base and an inference engine.

Input data is presented to an expert system for training. This data is then reasoned through production, or If-Then, rules. Together, the data and reasoning production rules create the knowledge base of an expert system.

The inference engine applies the rules to the data and facts in the knowledge base, and then deduces new facts from it.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image2-1605168415913.jpg)

## AI Planning

Automated planning and scheduling, also known as AI Planning, is another branch of classic AI. AI Planning can be done in known environments, and it describes a system that coordinates strategies or action sequences from an initial state, in order to achieve a specified goal state. The actions may be executed by autonomous robots, intelligent agents, or unmanned vehicles, or a combination of them.

This field has such a wide variety of project scopes with varying complexity that the level of programming effort and the human resources required for AI Planning became too much for most organizations to support.

Today, machine learning has taken over this field, as it offers a much more agile approach.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image3-1605168423145.jpg)

## Artificial Intelligence Examples

As we now realize, artificial intelligence varies greatly in its potential complexity.

It includes both piles of if-then statements, as with the simple rule-based, expert systems used in classic AI, along with more complex statistical models that use learning algorithms to generate predictions.

Then, there is also the Hollywood version of AI: super-fancy computer systems, specialized robots, and advanced androids.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image7-1605168431287.jpg)

It may all seem a bit campy, but every day we get closer and closer to this type of reality. Mainly, this is because we are now teaching machines how to learn, and grow, on their own.

## What is Machine Learning?

Now that we know about artificial intelligence, how about machine learning? This is where AI really starts to get interesting.

Machine learning describes machines that are taught to learn and make decisions by examining large amounts of input data. It makes calculated suggestions and/or predictions based on analyzing this information and performs tasks that are considered to require human intelligence. This includes activities like speech recognition, translation, visual perception, and more.

The field of machine learning also encompasses the area of deep learning. The key difference between machine learning and artificial intelligence is the term "learning."

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image9-1605168439805.jpg)

## Why is Machine Learning Important?

Machines learn and provide intelligent insights through a sophisticated use of learning algorithms.

To provide business value, the machine is trained to learn patterns from data and then can proceed autonomously on new and changing data. This creates a dynamic feedback loop, which allows it to efficiently generate more models to gain further insights, even more accurately, without requiring additional resources or human interaction.

With continuous advancement in this field, machines are becoming increasingly self-healing, self-organizing, and self-architecting, seamlessly producing greater value for businesses.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image12-1605168447402.png)

## What is Deep Learning?

Also known as artificial neural networks, deep learning is one of the most talked about sub-areas of machine learning.

Deep learning performs machine learning in a hierarchy of layers, where the output of decisions from one layer feeds into the next layer. This model is loosely patterned after the brain's neural networks and has been setting new records of accuracy when applied to sound and image recognition.

The term "deep" describes the number of layers in a network and some go deeper than others by using many layers, versus just one layer.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image4-1605168455124.jpg)

## Where do we go from here?

Next in this series, we'll discuss the different learning methods used in machine learning, such as supervised, unsupervised, and semi-supervised types, along with some of the most common algorithms available for your projects.

For more information on this course, please visit: [_Introduction to Artificial Intelligence and Machine Learning_](https://learn.ezmeral.software.hpe.com/bus-introduction-to-artificial-intelligence-and-machine-learning).
