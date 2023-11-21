---
title: "Configure Jupyter Notebook for Spark 2.1.0 and Python"
date: 2020-11-05T17:04:32.594Z
author: Mathieu Dumoulin 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Mathieu Dumoulin",
"publish": "2017-07-07T12:00:00.000",
"tags": "apache-spark"
```

---

I'll guess that many people reading this have spent time wrestling with a configuration to get Python and Spark to play nicely. Having gone through the process myself, I've documented my steps and will share my knowledge, hoping it will save some time and frustration for some of you.

This article targets the latest releases of MapR 5.2.1 and the MEP 3.0 version of Spark 2.1.0. It should work equally well for earlier releases of MapR 5.0 and 5.1. In fact, I've tested this to work with MapR 5.0 with MEP 1.1.2 (Spark 1.6.1) for a customer.

The version of Jupyter is 4.3. It seems like it changed quite a bit since the earlier versions and so most of the information I found in blogs were pretty outdated. Hence my having so much trouble getting everything working to my satisfaction.

My goals:

* Run PySpark successfully from either a cluster node or an edge node
* Run python code in YARN distributed mode
* Have access to modules like numpy, scipy, pandas and others.
* Do all this using Jupyter in server mode that I access from my own laptop

I'm leaving out Jupyter server mode security, which could be the topic of a future blog, potentially. I've implemented it before and found [THE JUPYTER DOCUMENTATION](https://jupyter-notebook.readthedocs.io/en/latest/security.html) explains setting it up for encryption (HTTPS) and authentication to be pretty good.

## Installing Python
Verify your version of Python:

```python
python --version
```

If it's Python 2.6.X, it's probably a good idea to use a recent build of Python 2.7 If it's Python 2.7.X, then you'll need to choose to use the system python or not.

* System python is easier to make work, it's already there and shared everywhere.
* Isolated separate python (anaconda or a separate python) is harder to get working but will provide a more consistent environment where each user can have their own (and only their own) modules installed.

I will use Miniconda for Python 2.7 64 bits throughout. It works very well. Using Python 3 would be just the same, with the only difference being in terms of code and module compatibility. Either will work fine with Spark.

Note: Python 3.6 doesn't work with Spark 1.6.1 See [SPARK-19019](https://issues.apache.org/jira/browse/SPARK-19019).

## Installing Anaconda
There is a choice between Anaconda and Miniconda, as well as between python 2.7 and Python 3.6.

Miniconda is very nice because the download is small and you only install what you need. Anaconda is very nice for having everything installed from the start, so all needed modules will be there from the start for most needs.

Here, we show installing miniconda and Python 2.7 (64bits):

```bash
wget https://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh
bash Miniconda2-latest-Linux-x86_64.sh -b -p /opt/miniconda2
```

To install it on all nodes at once, we recommend to check out Clustershell.

```bash
#copy the file to all nodes
clush -ac Miniconda2-latest-Linux-x86_64.sh

#install on all nodes at same time:
clush -aB bash Miniconda2-latest-Linux-x86_64.sh -b -p /opt/miniconda2
```

**Important**: Get all nodes in same exact state, with python/anaconda installed **exactly** in the same location with all nodes having exactly the same modules installed. Miss that here and it guarantees weird errors that will be hard to diagnose.

## Update Spark environment to use Python 2.7:

Add to `/opt/mapr/spark/spark-2.1.0/conf/spark-env.sh`:

```bash
    export PYSPARK_PYTHON=/opt/miniconda2/bin/python
    export PYSPARK_DRIVER_PYTHON=/opt/miniconda2/bin/python
```

Update file on all nodes:

```bash
# using clustershell to copy file ("c") to all nodes ("a")
clush -ac /opt/mapr/spark/spark-2.1.0/conf/spark-env.sh
```

>Note: this is known to work on previous MEP versions. I have also tested it with MEP 1.1.2 (Spark 1.6.1) and it worked very well. just use the correct path to Spark and it will work just fine.

## Testing
For testing, let's use some Ebay auction data.

Copy the data into the folder: `/user/mapr/data`

Start pyspark and run the following code:

```markdown
>>> auctionRDD = sc.textFile("/user/mapr/data/auctiondata.csv").map(lambda line:line.split(","))
>>> auctionRDD.first()
[u'8213034705', u'95', u'2.927373', u'jake7870', u'0', u'95', u'117.5', u'xbox', u'3']
>>> auctionRDD.count()
10654
```

Ok, so now we have a working pyspark shell!

>Note: Don't do this as `root` or as user `MAPR` on a production cluster. However, for tutorials, user `MAPR` is convenient as it is a superuser and you don't need to worry about file permissions on MapR.

Errors:
* *pyspark java.io.IOException: Cannot run program "python2.7": error=2, No such file or directory*

This error is because the driver and/or the executors can't find the python executable. It's fixed by setting the PYSPARK_PYTHON (and PYSPARK_DRIVER_PYTHON) variables in `spark-env.sh` (see above)

## ipython Notebook
If you want to able to choose to use spark when launch ipython shell:

1.	Ensure SPARK_HOME env variable is defined.

```bash
export SPARK_HOME=/opt/mapr/spark/spark-2.1.0
```

2.	Install ipython with Anaconda

```bash
/opt/miniconda2/bin/conda install jupyter
```

3.	Add a ipython profile named pyspark

```bash
ipython profile create pyspark
```

4.	Add `~/.ipython/profile_pyspark/startup/00-pyspark-setup.py`:

```python
import os
import system
spark_home = os.environ.get('SPARK_HOME', None)
if not spark_home:
    raise ValueError('SPARK_HOME environment variable is not set')
sys.path.insert(0, os.path.join(spark_home, 'python'))
sys.path.insert(0, os.path.join(spark_home, 'python/lib/py4j-0.10.4-src.zip'))
exec(open(os.path.join(spark_home, 'python/pyspark/shell.py')).read())
```

5. Launch

```bash
/opt/miniconda2/bin/ipython --profile=pyspark
```

Try the sample code above. It should also work without issue.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/ipythonsamplecode-1604596105535.png)

## Jupyter Notebook
Now on to Jupyter. In this case, we're looking to have the notebook run on an edge node (less ideally, on a cluster node) in server mode and access it from our development laptop.

The following instructions assume the user `MAPR`, but should work equally well for any other user. For production use, never use `MAPR` user as it is a superuser with read-write access to all data in MapR.

With Anaconda:

```bash
clush -aB /opt/miniconda2/bin/conda install jupyter -y
```

1. Allow remote login to a notebook:

  Generate a profile:

  ```bash
 	/opt/miniconda2/bin/jupyter notebook --generate-config
  ```

 	This generates the following file: 

`$HOME/.jupyter/jupyter_notebook_config.py` In this file, we're going to update the following setting: `c.NotebookApp.ip`

  The setting for this is “c.notebookapp.ip”. The default value is ‘localhost’, meaning you can’t login remotely.  Setting it to ‘\*’ means it is accessible from anywhere, which is fine for development, but not so good for production.

  ```bash
 	# c.NotebookApp.ip = '*'
  ```

  **About Security:**

 	It's a good time to remind you about security. It's pretty easy to configure Jupyter to use https and have a password. See [Jupyter documentation](https://jupyter-notebook.readthedocs.io/en/latest/public_server.html#securing-a-notebook-server). Basic auth with https are a reasonable minimum security level for a production system.

 	Important: the user which runs the notebook is meaningful, as that user’s permissions are used to access files on MapR. If you run it as user mapr, then everything is accessible as it’s a superuser account. For production, you want to run it as a less privileged user.

2. The startup script from the ipython step is helpful:

```bash
  [mapr@ip-10-0-0-180 ~]$ cat .ipython/profile_default/startup/00-default-setup.py
  import os
  import sys
  spark_home = os.environ.get('SPARK_HOME', None)
  if not spark_home:
      raise ValueError('SPARK_HOME environment variable is not set')
  sys.path.insert(0, os.path.join(spark_home, 'python'))
  sys.path.insert(0, os.path.join(spark_home, 'python/lib/py4j-0.10.4-src.zip'))
  execfile(os.path.join(spark_home, 'python/pyspark/shell.py'))
```

  This step is essential or else the kernel won't initialize properly. Alternatively, you can past the code above in the first cell to initialize pyspark first. Another alternative is to use the module `findspark`, which probably does something similar to this, but with less code.

3. Add a PySpark Kernel. create the `kernel.json` file in the location as shown below:

```bash
[mapr@ip-10-0-0-20 ~]$ cat .ipython/kernels/pyspark/kernel.json
{
 "display_name": "pySpark (Spark 2.1.0)",
 "language": "python",
 "argv": [
  "/opt/miniconda2/bin/python",
  "-m",
  "ipykernel",
  "-f",
  "{connection_file}"
 ],
"env": {
        "CAPTURE_STANDARD_OUT": "true",
        "CAPTURE_STANDARD_ERR": "true",
        "SEND_EMPTY_OUTPUT": "false",
        "SPARK_HOME": "/opt/mapr/spark/spark-2.1.0"
    }
}
```

4. Start a notebook and have fun with Spark and Python!

```bash
  jupyter notebook --no-browser
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/jupyternotebook-nobrowser-1604596122293.png)

  Open your browser to the indicated link and... Success!

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/browsersuccess-1604596151125.png)

## Launch Jupyter notebook instead of pyspark

1.	Update `$SPARK_HOME/conf/spark-env.sh`:

```bash
  [mapr@ip-10-0-0-20 ~]$ tail /opt/mapr/spark/spark-2.1.0/conf/spark-env.sh
  export PYSPARK_DRIVER_PYTHON=/opt/miniconda2/bin/jupyter

  # Setup env variable for Jupyter + Pyspark
  export PYSPARK_DRIVER_PYTHON_OPTS="notebook --no-browser"
```

2.	Launch pyspark, it will launch a Jupyter notebook

```bash
  $SPARK_HOME/bin/pyspark
```

## Thanks
[Dong Meng's blog](https://mengdong.github.io/2016/08/08/fully-armed-pyspark-with-ipython-and-jupyter/) proved to be a life saver. Check him out: https://mengdong.github.io