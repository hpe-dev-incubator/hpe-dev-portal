---
title: "Simplifying code migration: The benefits of the new Ampere Porting
  Advisor for x86 to ARM64"
date: 2024-08-05T12:34:13.570Z
author: Pete Baker, Naren Nayak (Ampere Computing)
authorimage: /img/Avatar1.svg
disable: false
tags:
  - ARM
  - Ampere
  - AArch64
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

The demand for efficient software porting solutions is increasing. With the transition from legacy x86 to AArch64, and with Ampere processors gaining adoption momentum, developers are looking for ways to expedite the migration for existing codebases. Built for sustainable cloud computing, Ampere’s Cloud Native Processors (CNPs) deliver predictable high performance, platform scalability, and power efficiency unprecedented in the industry.

Today, we are announcing the Ampere Porting Advisor (APA), a new (free) software porting advisor via our [GitHub](https://github.com/AmpereComputing/ampere-porting-advisor) page promising to simplify this process.  The introduction of the new Ampere Porting Advisor provides a significant advancement in simplifying the migration of x86 code to the AArch64 architecture. By streamlining the migration process, reducing development costs, and enabling access to a wider ecosystem, the advisor empowers developers to embrace the benefits of the AArch64 architecture more quickly and effectively. 

The AArch64 architecture has gained significant traction across various software packages. By leveraging the APA, developers can tap into this expanding ecosystem and take advantage of the benefits offered by AArch64-based platforms. Migrating code from x86 to the AArch64 architecture does not have to be an intimidating process. 

The Ampere Porting Advisor tool:
* Reduces time-to-market by minimizing the need for manual intervention. Developers can allocate their time and resources to other critical aspects of the project.
* Reduces development costs by automating various tasks involved in the migration.
* Minimizes risk of post-migration issues by eliminating the need for costly debugging and re-work.

The Ampere Porting Advisor offers a streamlined migration process, allowing developers to save time and effort. It automates many of the manual steps involved in porting code, reducing the risk of errors, and ensuring consistency throughout the migration. The APA performs a comprehensive analysis and output recommendations of the source code, providing detailed insights into changes required, highlighting potential pitfalls, and recommending optimal modifications. This guidance enables developers to navigate the intricacies of transitioning between architectures more efficiently, accelerating the overall migration process.

The APA includes the following features:
* **Language support:** Python 3+, Java 8+, Go 1.11+, C, C++, Fortran
* **Architecture specific code detection:** i.e. missing corresponding AAarch64 assembly, architecture specific instructions, architecture specific flags in make files.
* **Dependency checks:** for versioning, JAR scanning, and dependency files.
* **Simple to run:** via python script, binary, or containers.
* **Multiple output formats:** terminal for quick checks, html for easy distribution, and CSV for post-processing.

The Ampere Porting Advisor will not make code modifications, nor API level recommendations, and it will not send data back to Ampere.  The APA is a static command line tool that analyzes the make environment and source code for known code patterns and dependency libraries and generates a report with incompatibilities and recommendations. 

Download and try the free Ampere Porting Advisor from [Ampere’s GitHub](https://github.com/AmpereComputing/ampere-porting-advisor).
 
To learn more about the developer efforts, find best practices, insights, you are invited to join the conversation at: [https://developer.amperecomputing.com](https://developer.amperecomputing.com), and [https://community.amperecomputing.com/](https://community.amperecomputing.com/).
