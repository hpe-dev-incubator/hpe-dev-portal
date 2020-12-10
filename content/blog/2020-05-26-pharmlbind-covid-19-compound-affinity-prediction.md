---
title: "PharML.Bind COVID-19 Compound Affinity Prediction "
date: 2020-05-26T14:47:37.205Z
author: Jacob Balma 
tags: ["opensource"]
path: pharmlbind-covid-19-compound-affinity-prediction
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture1-1590504636961.png)

Hewlett Packard Enterprise (HPE), in collaboration with the Medical University of South Carolina (MUSC), recently announced the open-sourcing of PharML.Bind, a powerful plug-and-play framework for drug discovery. In addition to the codebase for training, inference, data pre-processing and visualization, we are releasing an ensemble of six Molecular-Highway Graph Neural Networks (MH-GNNs) that have been pre-trained for hundreds of hours on state-of-the-art HPE Cray Supercomputers. This announcement is expected to have far reaching implications for COVID-19 research and will ultimately affect how research for other diseases is handled. For all you data scientists out there, I thought I would take a moment to talk a little more about this initiative, offer some examples of how the research can be applied, and direct you to where you can get started with your own research. 

This document will present some examples that produce encouraging results relative to SARS-CoV-2 and point users to additional resources. It should be considered an overview of the Quick-Start Guide, which is provided on [GitHub.](https://github.com/jbalma/pharml/tree/master/docs)  

In the Quick-Start Guide, you’ll learn how to use the ensemble of pre-trained MH-GNNx5 models to make affinity predictions relative to a given structure file (PDB). The guide outlines, in (far) more detail, how users can setup PharML.Bind at home to test various compound sets against relevant COVID-19 structures and even fine-tune the pre-trained models for other interesting mappings. For this post, we’ll just discuss some examples of the framework and introduce some of its capabilities. 

>Note: Any compounds or discussion around treatments for COVID-19 should be considered just that – discussions. 

## Example Experiment
PharML.Bind is a framework for predicting compound affinity for full protein structures. It differs from other approaches concerning affinity prediction in two ways:

1. **It learns the physical rules governing binding interactions from high-resolution data**. This means that rather than approximating the rules of quantum mechanics (docking) or simulating the kinetics of the interaction through Molecular Dynamics (MD) or Quantum Chemistry (QC) based numerical methods, PharML.Bind can use whatever information is embedded in real-world data to make decisions. And it does so orders of magnitude faster than alternative approaches.
2. **It is active-site and compound-pose agnostic.** This means that it uses full-protein structure when making predictions and it doesn’t require users to specify the region of interest along the protein target for a given compound. In addition, it does not need to determine how that compound binds to a given target, just whether it does or not.

Fundamental to the capability and efficiency of PharMLbined is its use of graph neural networks and their associated graph representations used to test candidate molecules against a given protein’s conformation. The MH-GNNx5 models that were released have been trained to represent the binding behaviour across tens of thousands of proteins paired with hundreds of thousands of compounds currently approved under the FDA. These models can be put to immediate use in generating potential compounds rank-ordered by their potential affinity for COVID-19 molecular structures. 

PharML.Bind utilizes PDB files to define the spatial conformations of a protein of interest (targets), and SDF files (and CSV files) to define sets of compounds (ligands) to be tested against those proteins. You can learn about PDB files and how they are organized [here.](https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/introduction) 

For our purposes, PDB files only need to contain the biomolecular structure information for how the protein is arranged in a 3D space. The hierarchical definition of a protein in PDB format is defined from the bottom up: 

atoms -> residues -> chains -> assemblies 

The basement reality for a protein is the atom. Atoms are defined by the their type and location in X,Y,Z space – no other information is needed. The atomic resolution varies depending on the method used to gather the data (x-ray crystallography, NMR, or Cryo-EM), but typically is on the order of a few Angstroms (~ 0.1 nanometers). 

For example, using one of these pre-trained models for inference can generate affinity predictions for the well-known “spike” glycoprotein (6VSB). For this particular protein, composed of over 20,000 atoms, we can predict rank-ordered affinity across a set of more than 300,000 compounds in under 25 minutes (1314.1s) using only a single Cray CS-Storm Server containing 8 Nvidia V100 GPUs. Traditional docking methods would require weeks to produce similar results.


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture2-1590504725019.png)

With that rate in mind, we laid out an experiment to refine the set of drugs predicted to bind to the primary infection mechanism of the SARS-CoV-2 virus. 

The virus targets human cells in the lungs, heart, kidneys, and intestines. It does so by evolving a structure (made of protein) that fits spatially into the “active site” defined by a distinct set of proteins on the cell surface. Specifically, the shape of some parts of this spike are highly likely to “stick” to the ACE2-receptor, so long as the ACE2-receptor is also bonded to (or in “complex” with) an amino acid transporter. The conformation of this combined structure on the surface defines a high affinity “lock” for the virus to fit into via its novel “key” at the tip of these spikes. The key in this case is referred to as a Receptor Binding Domain (RBD) and serves as the primary mechanism by which the SARS-CoV-2 assembly infects its host cells. For a great overview of how SARS-CoV-2 is suspected to interact with ACE2, check out Dr Scott Klioze’s video [here.](https://www.youtube.com/watch?v=W1k1sUoLPlA&feature=youtu.be) 

Using what we learned above about how PharML.Bind works, can we use this to predict interactions between the human cell’s receptor site and the RBD of the virus’s spikes?

Yes, we can. However, because we don’t know much about the active site that the ACE2 receptor SARs-CoV-2 uses to attach to human cells, we’ll need two structures in total to make reasonable assertions about what might potentially interfere with the mechanism of action for the RBD.


![image](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/image-1590529010362.png)

Notice that items 1 & 2 listed above are of the same spike structure but were obtained from two different experiments with varied resolutions. Item 2 shows the same glycoprotein structure but with the RBD structure bound to ACE-2. This data was collected via X-Ray Crystallography and has the highest resolution. 

In order to maximize the likelihood that a subset of the compounds we test against these structures are useful for treating infection by SARS-CoV2-19, we need to carefully think through the question we’re asking PharML.Bind to solve: 

![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture4-1590504846111.png)

One of the things that makes the SARS-CoV-19 virus so dangerous is that it seems to exploit a never before observed active site of the ACE2 receptor at the surface of the cell.  Even with the advent of Cryo-EM technologies in the last few years, producing crystallized proteins appropriate for X-Ray Crystallography or atomic resolution microscopy is an incredibly complex and time-consuming process. This complexity greatly limits the size, type and interactions we can currently observe for many proteins. 

The ACE2 receptor is found on cells which make up the lungs, GI tract, kidneys and blood. It appears that there are two primary RBDs along these spike structures. Because PharML.Bind is active-site agnostic (meaning it doesn’t need information about where the active site is along a structure in order to make predictions), the spikes are a great place to start searching for potential active regions which might interact with existing drugs. We can carefully tune the test cases we run so that we end up with a short list of drugs that potentially bind with high-affinity to the RBD at the tip of the spike. This potentially could limit an infection or prevent the virus from spreading once inside a host. 

Let’s look at how the conformation of the RBD changes when it is in complex with ACE2 versus the open state. I’ve highlighted a chunk of the amino-acid sequence for a particular part of the protein (PLQSYGF) in green for reference.


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture5-1590504935947.png)



![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture6-1590504955042.png)

Now, we can clearly see that there is definitely a region along the spike’s RBD which strongly interacts with the ACE2 receptor. The change to the RBD’s shape is noticeable between the two structures. The next step is to run the entire set of FDA-approved compounds against these two structures, and attempt to make some inferences about compounds that might strongly interact with the RBD before it binds to ACE2, therebye protecting cells from infection.

The next steps are a bit more involved and require some preprocessing of the BindingDB FDA-Approved Compounds dataset, running the actual inference phase with Tensorflow in a Conda environment, and finally doing some additional post-processing. For a detailed walk-through, please visit the [Quick-Start Guide,](https://github.com/jbalma/pharml/tree/master/docs) provided on GitHub.

After running the experiment proposed above, we can immediately see that the distribution of compounds PharML.Bind predicts are not random, and, in fact, have some interesting features. 


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture5-1590505329500.png)

The histogram to the right shows compounds from the FDA-approved dataset arranged by their molecular similarity (where similarity comes from their pair-wise Tanimoto score).  If we selected compounds at random from this dataset, we would expect to see a gaussian distribution (orange). However, we see that PharML.Bind has selected non-gaussian sets of compounds as potential binders against the target protein (in this case the main protease, or Mpro). It has selected some particular compounds that are highly similar (>0.7 fingerprint similarity). This implies that PharML is detecting features present only in specific subsets or classes of compounds available in the dataset.  

We can look at the summary CSV produced after many COVID-19 structures were run against this same database. Each of the ensemble models has casted their vote for which compounds it thinks it should bind. The post-processing phase aggregates these votes, and then rank orders them by their probability to bind. The image below shows some of the interesting output for the two variations on the structure we’ve been looking at.


![screenshot bindingdb fda](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/screenshot-bindingdb-fda-1590529064031.jpg)

When rank-ordering compounds that have CHEMBL IDs, PharML.Bind will also produce a convenient web-based summary of the results. Let’s take a look at what we see for **CHEMBL20:**

![screenshot bindingdb compound](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/screenshot-bindingdb-compound-1590529046012.jpg)

Here, we can see that this is an FDA-approved drug, which goes by various trade names. It is predicted by PharML.Bind to interact with spike glycoprotein of SARS-CoV-2. Because it appears in the “open” conformation of the spike, but not in the ACE2-Bound conformation, we have some confidence that the compound will actually bind somewhere that potentially interferes with the spike’s interaction with its target receptor. Obviously, there are plenty of other structures we can now investigate just as quickly and across much larger datasets. To dig deeper into the results generated for several other structures comprising SARS-CoV-2 against the BindingDB FDA-approved dataset, visit the subdirectory on GitHub [here.](https://github.com/jbalma/pharml/tree/master/examples)

In general, we observe PharML.Bind making overlapping predictions of compounds either in clinical trials for treatment of COVID-19 or which align with docking and MD simulations, suggesting further study is warranted for many more compounds than currently in clinical trials. For more information on how these compounds were generated, and how you can use PharML.Bind in your own research, please consult the Quick-Start Guide and GitHub examples page linked above.

In this article, we showed how you can get started with plug-and-play drug discovery with the newly released Open-Therapeutics framework PharML.Bind. We reviewed how to use a pre-trained model on a new target structure (the spike protrusion of COVID-19) against a large database of FDA-approved drugs. By using an ensemble of models, we were able to assign confidence scores to each drug predicted to bind and use the results to zoom in on a few interesting FDA-approved drugs that might be viable for repurposing in the fight against COVID-19. 

Hopefully, sharing this information with you will help spark ideas on how you might apply this sort of machine learning to your activities. We will be building out more material on the HPE DEV site specific to AI and machine learning. Make sure you check back at [HPE DEV](https://developer.hpe.com/blog) for more interesting blogs as we move forward.