---
title: "Streamline and optimize ML workflows with HPE Ezmeral Unified Analytics "
date: 2023-09-27T13:00:00.000Z
author: "Abhishek Kumar Agarwal "
authorimage: /img/abbie-192x192.png
thumbnailimage: /img/developers-512x400.png
disable: false
tags:
  - "opensource hpe-ezmeral data-ml-engineer data-scientist "
---
This is part two of a blog series that showcases the capabilities of [HPE Ezmeral Unified Analytics](https://www.hpe.com/us/en/hpe-ezmeral-unified-analytics) through the real-world example of stock market predicting. In that blog post [previous blog post](https://developer.hpe.com/blog/seamless-data-engineering-for-financial-services/), we covered the data engineering aspects of Apache Spark and Superset to streamline pipelines and visualize data. In this blog, the same use case is retained, stock market forecasting, to showcase how HPE Ezmeral simplifies building, deploying, and productizing machine learning models and pipelines. 

**Model building and training**

Business problem: Forecast stock prices of different companies listed in the National Stock Exchange (NSE) of India.

Step 1 
Data Gathering
The data is streamed from external servers hosted publicly and then saved to a HPE Ezmeral Data Fabric volume as explained in the  previous blog. 

Step 2
Data Preprocessing
The stock market does not function on holidays and weekends but the model expects continuous data. For this reason, the data feature, along with the open and closing price for each stock, is being used to impute the model with the previous working day’s data.

![](/img/step2-data-preprocessing.png "Figure 1. Selecting data for preprocessing. ")

Step 3
Modeling
First, the data is divided between training and validation and then used to train a long short term memory (LSTM) model. After training, the model is evaluated on the error metric.

LSTM is a variety of [recurrent neural networks (RNNs)](https://www.techtarget.com/searchenterpriseai/definition/recurrent-neural-networks#:~:text=A%20recurrent%20neural%20network%20is,predict%20the%20next%20likely%20scenario.) capable of learning long-term dependencies, especially in sequence prediction problems.  

**Model tracking and monitoring using MLflow**

MLflow is an open-source platform designed to manage the end-to-end machine learning lifecycle. It provides tools for tracking experiments, packaging code, sharing models, and managing deployment. MLflow was developed by Databricks, a company that specializes in big data and AI. They have gained popularity within the machine learning community for their ability to streamline and organize various stages of machine learning workflows.

MLflow consists of several key components\
\
Tracking: This component allows you to record and compare different experiments, including the parameters, metrics, and artifacts (such as models, visualizations, and data) associated with each experiment. It helps keep track of the different iterations and configurations tried during the model development process.

Projects: MLflow projects provide a way to package code into a reproducible format, allowing you to define and share your machine learning projects with others. This ensures that the code and dependencies used for a particular experiment can be easily reproduced by others.

Models: MLflow model management capabilities enable you to easily log, version, and deploy machine learning models. It supports various machine learning frameworks, for example TensorFlow, PyTorch, and scikit-learn. MLflow also makes it possible to deploy models directly onto different platforms. 

Registry: The MLflow model registry provides a centralized repository for storing, versioning, and managing models. It allows teams to collaborate on model development and helps maintain a history of different model versions.

UI and APIs: MLflow makes it easy to use and integrate programmatically by offering a web-based user interface as well as APIs. 

**Experiments**

An experiment is registered in the MLflow tracking service, and different runs are carried out with different parameters and features. The parameters can then be logged into MLflow and viewed on the UI. Different runs are then compared so that the best metric can be chosen and moved into production. 

To begin, allow the experiment to access MLflow from the Jupyter notebook. Then, as we have used TensorFlow LSTM as our ML model, we use mlflow.tensorflow.autolog() to log automatically the training parameters, hyperparameters and model metrics.

![](/img/figure-1a-experiment.png "Figure 2. Creating an experiment with auto logging. ")

Once the model is ready, the run details are available via MLflow APIs like search_run(). The best run can be auto-selected as per our requirements.

![](/img/fig-1b-best-run-experiment.png "Figure 3. Selecting the best run of the experiment and loading the model.")

On the Web UI for MLflow, you can access multiple runs of the ML experiment for different parameter combinations. Details of the run can be accessed by clicking on the corresponding run name.

![](/img/fig-2-multiple-runs.png "Figure 4. Results from multiple runs made on the experiment with different parameters in each run. ")

Model performance can be obtained by comparing various runs. In the image below, all six runs have been selected and you can see that the model with epochs=20, performs best with the least loss and mean absolute error (MAE)

![](/img/fig-3-multiple-runs-compared.png "Figure 5. Comparison of all runs based on a relevant metric. ")

Now that the best model has been identified, it can be registered programmatically or through the MLflow Web UI. Once registered, the model can be deployed to the appropriate staging-production region. 

![](/img/fig-4-model-registry-different-models.png "Figure 6. Model registry with different models. ")

**Code repository**

A code repository is a storage location for code and other software development assets, such as documentation, tests, and scripts. They are often used to manage and organize a software project's codebase and collaborate with other project developers.

The source code for the model is stored in a private repository on GitHub then seamlessly pulled into the IDE using git commands. The updated model can be pushed to different branches of the source repo. 

![](/img/code-repository.png "Figure 7.  Source code for models is stored on Github in a private repository. ")

**Model deployment**

The next step is to deploy the best model chosen from the MLflow experiment. Here, Kserve, which is a standard model inference platform on Kubernetes that is build for highly scalable use cases, is being used. 

Kubeflow Serving, also known as KServe, is a component of the Kube Flow ecosystem and is designed to serve machine learning models in Kubernetes environments. Kubeflow itself is an open-source platform for deploying, monitoring, and managing machine learning models on Kubernetes. KServe provides several features and benefits:

1. Scalability: It is designed to handle serving machine learning models at scale. You can easily scale up or down based on the traffic and load requirements.
2. Multi-framework support: KServe supports serving models trained in various machine learning frameworks, such as Tensor Flow, PyTorch, scikit-learn, and others.
3. Advanced deployment strategies: KServe supports various deployment strategies, for example  Canary deployments or Blue-Green deployments,  allowing you to roll out new model versions gradually and monitor their performance.
4. Monitoring and metrics: It provides metrics and monitoring capabilities, allowing you to keep track of model performance, errors, and other relevant statistics.
5. Customization: KServe is highly customizable, allowing you to define how you want to serve your models, handle preprocessing and post-processing tasks, and even add custom logic to your serving containers.
6. Integration with Kube Flow Pipelines: If you're using Kubeflow Pipelines for end-to-end machine learning workflows, KServe can be integrated seamlessly to deploy models as part of your pipeline.

Visit the [Kserve documentation](https://kserve.github.io/website/0.10/modelserving/control_plane/) for more information.

The first step of model deployment is to define the service account with MinIO object store secrets.

![](/img/fig-1a-define-service-acct.png "Figure 8. Defining service account with MinIO secret. ")

Next, script the KServe yaml file to begin the inference service. 

![](/img/fig-1b-inference-service.png "Figure 9. The inference service is defined. ")

Next, a new model server must be created in Kubeflow and the yaml file uploaded. Once it is running, you can send your test data through REST APIs to get the response.

**Model retraining**

The models deployed into production are constantly monitored to identify inconsistencies and degradation in performance. Because models can skew to the old data used for training resulting in under performance, models should be retrained whenever performance drops below a defined threshold. To retrain a model, a pipeline is developed that could trigger all the steps associated with model retraining to occur in the appropriate sequence using Kube Flow pipelines.  

Python programs need to be modified to run as a Kubeflow pipeline because each step runs as a containerized module. The whole cycle of data collection, preprocessing, and modeling are divided into separate components with each process isolated and running as independent containers inside individual Kubernetes pods. All the dependencies of each task must be mentioned inside the task due to the isolated nature of the environment. The artifacts that are used in the process, such as input data files and model objects, are saved in specific locations and referenced by the tasks. 

To prepare the KubeFlow pipelines, define each task as a function. First “read_data()” is defined to read the input file from the data volume on the Kubeflow pipeline.

![](/img/fig-1-define-each-task.png "Figure 10. Each task is defined as a function that includes all necessary packages. ")

Once defined, functions are converted into a Kubeflow component using “create_component_from_func()”.

![](/img/fig-2-converting-each-task.png "Figure 11. Each task is converted into a component that includes base line images and packages. ")

Once each of the tasks are defined, the Kubeflow pipelines are defined to call each of the steps using DSL (Domain Specific Language).

![](/img/fig3-define-the-pipeline.png "Figure 12. Pipelines are defined along with tasks in the appropriate sequence. ")

When the Kubeflow pipeline is set up, the pipeline can run using the Kubeflow client where the required arguments and parameters are passed for the specific run.

![](/img/kubeflow-setup-run.png "Figure 13. Kubeflow client is created and executed with appropriate arguments. ")

In the Kubeflow UI, “stock\_pipeline\_run” would be triggered to provide a green-red status of each step as it executes. 

![](/img/fig-5-simplified-pipeline.png "Figure 14. Status of each pipeline step and it's status. ")

**Conclusion**

As you can see, HPE Ezmeral Unified Analytics has significantly enhanced the end-to-end pipeline of financial services use cases by providing a comprehensive platform tailored to the specific needs of ML practitioners and data scientists. 


In summary:

Seamless integration: HPE Ezmeral Unified Analytics offers seamless integration of various data engineering and ML components like Spark, EzPresto, Superset, MLflow, Kubeflow. This integration streamlines the entire ML workflow, reducing friction between dissimilar stages and enables more efficient development.

Data exploration and visualization: By seamlessly integrating Apache Superset into the Ezmeral ecosystem, organizations can harness the power of data-driven insights. Teams can easily access and visualize data, track experiment results, and make data-informed decisions to improve model quality and performance.

Reproducibility: Kubeflow ensures reproducibility by allowing users to define and version their entire ML pipelines using HPE Ezmeral Unified Analytics. This means that every step, from data preparation to model deployment, can be tracked, versioned, and replicated easily, leading to better model accountability and auditability.

Scalability: Kubeflow on HPE Ezmeral Unified Analytics excels at scaling applications. Kube Flow leverages this capability to scale ML workloads as needed, handling large datasets and complex models with ease. This scalability is crucial for training and serving models in real-world, production environments.

Model serving: HPE Unified Analytics through Kubeflow Serving (KServe) simplifies model deployment and serving. It provides features like advanced deployment strategies, model versioning, and monitoring, making it easier to roll out new models, manage production deployments, and ensure model performance and reliability.

Automated workflow orchestration: Kubeflow pipelines simplify the orchestration of ML workflows as code. With HPE Unified Analytics, this automation reduces manual effort, enhances reproducibility, and accelerates experimentation, resulting in more efficient model operations.

Contributors to this blog post include Suvralipi Mohanta (suvralipi.mohanta@hpe.com), Harikrishnan Nair (harikrishnan.nair@hpe.com), Ashok Manda (ashok.manda@hpe.com) and Joann Starke (joann.starke@hpe.com).

