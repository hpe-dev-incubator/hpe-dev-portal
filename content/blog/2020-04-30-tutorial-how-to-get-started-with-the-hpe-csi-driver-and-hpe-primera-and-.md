---
title: "Tutorial: How to get started with the HPE CSI Driver and HPE Primera and 3PAR"
date: 2020-04-30T16:12:11.635Z
author: Chris Snell 
tags: ["hpe-3par-and-primera"]
path: tutorial-how-to-get-started-with-the-hpe-csi-driver-and-hpe-primera-and-
---
# Tutorial: How to get started with the HPE CSI Driver and HPE Primera and 3PAR

 With the release of the HPE Container Storage Interface (CSI) driver for Kubernetes back in January, HPE has been hard at work  on integrating additional platforms into the CSI driver framework. Initially the HPE CSI Driver for Kubernetes only supported Nimble Storage now with the latest v1.1.1 comes [support for HPE Primera and 3PAR arrays](https://community.hpe.com/t5/hpe-storage-tech-insiders/hpe-csi-driver-for-kubernetes-1-1-1-and-hpe-3par-and-hpe-primera/ba-p/7086675). In this tutorial, I will walk you through the steps of deploying the CSI driver with HPE Primera and then we will deploy a Wordpress site using persistent storage. With that, let's get going!

## Assumptions
I will be starting with an existing Kubernetes cluster. This can be a fresh install with [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) or [kubespray](https://kubernetes.io/docs/setup/production-environment/tools/kubespray/). The deployment of Kubernetes is outside of the scope of this document. If you don't have a cluster up and running, I recommend that you get started there.

Also I am assuming `kubectl` is installed and configured to communicate with the cluster and Helm 3 to deploy the HPE CSI Driver for Kubernetes. If not, here are some good resources to check out for assistance [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) and [https://helm.sh/docs/](https://helm.sh/docs/) to get setup. 

## Deploying the HPE CSI Driver and HPE 3PAR and Primera Container Storage Provider with Helm

To get started with the deployment of the HPE CSI Driver, check out the [HPE Storage Container Orchestrator Documentation](https://scod.hpedev.io/) (SCOD for short) site. SCOD is an umbrella documentation project for all Kubernetes and Docker integrations for HPE primary storage tailored for IT Ops, developers and partners. It includes HPE 3PAR, HPE Primera, HPE Cloud Volumes and HPE Nimble Storage. 

The HPE CSI Driver is deployed by using industry standard means, either a Helm chart or an Operator. For this tutorial, I will be using Helm to the deploy the CSI driver.

The official Helm chart for the HPE CSI Driver for Kubernetes is hosted on [hub.helm.sh](https://hub.helm.sh/charts/hpe-storage/hpe-csi-driver). There, you will find the configuration and installation instructions for the chart.

The first step of installing the HPE CSI Driver is creating the **values.yaml** file.

Please refer to this sample [values.yaml](https://github.com/hpe-storage/co-deployments/tree/master/helm/values/csi-driver) file.

```
vi primera-values.yaml
```

Copy the following into the file. Make sure to set the **backendType: primera3par** and the **backend** to the array IP along with the array username and password.

```
# HPE backend storage type (nimble, primera3par)
backendType: primera3par

secret:
  # parameters for specified backendType (nimble, primera3par)
  create: true
  backend: 192.168.1.10
  username: 3paradm
  password: 3pardata
  servicePort: "8080"

## For creating the StorageClass automatically:
storageClass:
  create: false
```
> **NOTE:** <br />
> The user specified will need at a minimum the **edit** role on the array.

Save and exit.

> **IMPORTANT**<br />Deploying the HPE CSI Driver with the HPE 3PAR and Primera CSP currently doesn't support the creation of the **default** `StorageClass` in the Helm chart. Make sure to set **create: false** or omit the `StorageClass` section.

### Installing the chart
To install the chart with the name hpe-csi:

Add the HPE CSI Driver for Kubernetes helm repo:

```
helm repo add hpe https://hpe-storage.github.io/co-deployments
helm repo update
```

Install the latest chart:

```
helm install hpe-csi hpe/hpe-csi-driver --namespace kube-system -f primera-values.yaml
```

Wait a few minutes as the deployment finishes.

Verify that everything is up and running correctly with the listing out the pods.

```
kubectl get pods --all-namespaces -l 'app in (primera3par-csp, hpe-csi-node, hpe-csi-controller)'
NAMESPACE     NAME                                  READY     STATUS    RESTARTS   AGE
kube-system   hpe-csi-controller-84d8569476-vt7xg   5/5       Running   0          13m
kube-system   hpe-csi-node-s4c8z                    2/2       Running   0          13m
kube-system   primera3par-csp-66f775b555-2qclg      1/1       Running   0          13m
```

```
kubectl get secret -n kube-system | grep primera3par
primera3par-secret                Opaque                                5         13m
```

If all of the components show in `Running` state, then the HPE CSI driver and the HPE 3PAR and Primera Container Storage Provider has been successfully deployed.

## Using the HPE CSI Driver and HPE 3PAR and Primera Container Storage Provider

Now, let's validate the deployment by creating a `StorageClass`, `PersistentVolumeClaim` and deploy a Wordpress site.

We need to create a `StorageClass` API object using the HPE CSI driver, along with the parameters specific to HPE 3PAR and Primera CSP, as well as the `Secret` used for the **primera3par** backend. For a full list of supported parameters, please refer to the [CSP specific documentation](https://scod.hpedev.io/container_storage_provider/hpe_3par_primera/index.html).

The below YAML declarations are meant to be created with `kubectl create`. Either copy the content to a file on the host where `kubectl` is being executed, or copy & paste into the terminal, like this:

```
kubectl create -f-
< paste the YAML >
^D (CTRL + D)
```

Create a `StorageClass` API object for a Primera Data Reduction volume.

```markdown
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: primera-reduce-sc
provisioner: csi.hpe.com
parameters:
  csi.storage.k8s.io/fstype: ext4
  csi.storage.k8s.io/provisioner-secret-name: primera3par-secret
  csi.storage.k8s.io/provisioner-secret-namespace: kube-system
  csi.storage.k8s.io/controller-publish-secret-name: primera3par-secret
  csi.storage.k8s.io/controller-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-publish-secret-name: primera3par-secret
  csi.storage.k8s.io/node-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-stage-secret-name: primera3par-secret
  csi.storage.k8s.io/node-stage-secret-namespace: kube-system
  # Uncomment for k8s 1.15 for resize support
  csi.storage.k8s.io/controller-expand-secret-name: primera3par-secret
  csi.storage.k8s.io/controller-expand-secret-namespace: kube-system
  cpg: SSD_r6
  provisioning_type: reduce
  accessProtocol: fc
```

Create a `PersistentVolumeClaim` for MariaDB for use by Wordpress. This object creates a `PersistentVolume` as defined. Make sure to reference the correct `.spec.storageClassName`.

```markdown
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: data-my-wordpress-mariadb-0
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
  storageClassName: primera-reduce-sc
```

Next, let's make another for the Wordpress application.

```markdown
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: primera-reduce-sc
```

Let's again verify the `PersistentVolume` were created successfully.

```markdown
kubectl get pv
NAME                          STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS        AGE
data-my-wordpress-mariadb-0   Bound     pvc-1abdb7d7-374e-45b3-8fa1-534131ec7ec6   50Gi       RWO            primera-reduce-sc   1m
my-wordpress                  Bound     pvc-ff6dc8fd-2b14-4726-b608-be8b27485603   20Gi       RWO            primera-reduce-sc   1m
```

The above output means that the HPE CSI Driver successfully provisioned a new volume based upon the **primera-reduce-sc** `StorageClass`. The volume is not attached to any node yet. It will only be attached to a node once a scheduled workload requests the `PersistentVolumeClaim` **pvc-nginx**. 

Now, let's use Helm to deploy Wordpress using the `PVC` created previously. When Wordpress is deployed, the volumes will be attached, formatted and mounted.

The first step is to add the Wordpress chart.

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo bitnami/wordpress
NAME                    CHART VERSION   APP VERSION     DESCRIPTION
bitnami/wordpress       9.2.1           5.4.0           Web publishing platform for building blogs and ...
```

Deploy Wordpress by setting `persistence.existingClaim=<existing_PVC>` to the `PVC` created in the previous step.

```
helm install my-wordpress bitnami/wordpress --version 9.2.1 --set service.type=ClusterIP,wordpressUsername=admin,wordpressPassword=adminpassword,mariadb.mariadbRootPassword=secretpassword,persistence.existingClaim=my-wordpress,allowEmptyPassword=false
```

Check to verify that Wordpress and MariaDB were deployed and are in the **Running** state. This may take a few minutes.

```
kubectl get pods
NAME                            READY     STATUS    RESTARTS   AGE
my-wordpress-69b7976c85-9mfjv   1/1       Running   0          2m
my-wordpress-mariadb-0          1/1       Running   0          2m
```

Finally lets take a look at the Wordpress site. You can use `kubectl port-forward` to access the Wordpress application from within the Kubernetes cluster to verify everything is working correctly.

```
kubectl port-forward svc/my-wordpress 80:80
Forwarding from 127.0.0.1:80 -> 8080
Forwarding from [::1]:80 -> 8080
```

> **NOTE:**<br />If you have something already running locally on port 80, modify the port-forward to an unused port (i.e. 5000:80).

Open a browser on your workstation to **http://127.0.0.1** and you should see, **"Hello World!"**. Access the admin console at: **http://127.0.0.1/admin** using the user/password used to deploy the Helm Chart. Happy Blogging!

## Next steps
Stay tuned to HPE DEV for future blogs regarding the HPE CSI Driver for Kubernetes. In the meantime, if you want to learn more about Kubernetes, CSI and the integration with HPE storage products, you can find a ton of Resources out on [SCOD](https://scod.hpedev.io/)! If you are already on Slack or an HPE employee, connect with us on [Slack](https://hpedev.slack.com/). If you are a new user, signup at [slack.hpedev.io](https://slack.hpedev.io/). We hang out in #kubernetes, #nimblestorage and #3par-primera.