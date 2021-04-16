---
title: "Get involved in the open source community! Part 1: Getting started with Git"
date: 2020-05-28T18:03:56.799Z
author: Didier Lalli
authorimage: /img/Avatar1.svg
thumbnailimage: https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/git-icon-1788c-1590702885345.png
tags:
  - git
  - github
  - opensource
---
Wikipedia cites: "Git is a distributed version-control system (VCS) for
tracking changes in source code during software development. It is
designed for coordinating work among programmers, but it can be used to
track changes in any set of files. Its goals include speed, data
integrity, and support for distributed, non-linear workflows. Git was
created by Linus Torvalds in 2005 for development of the Linux kernel,
with other kernel developers contributing to its initial development.
Its current maintainer since 2005 is Junio Hamano. As with most other
distributed version-control systems, and unlike most client–server
systems, every Git directory on every computer is a full-fledged
repository with complete history and full version-tracking abilities,
independent of network access or a central server. Git is free and
open-source software distributed under the terms of the GNU General
Public License version 2".

> Note: The origin of the name Git is unclear and subject to many
> interpretations :-).

Latest version is 2.25 from the 13-JAN-2020.

Competitor products include Subversion, Microsoft Team Foundation
Server, Mercurial, CVS, Perforce, Microsoft Visual SourceSafe, Rational
ClearCase. According to a survey from StackOverflow, Git was used by
87.2% of developers in 2018 and is still growing.

## GitHub

![git101-part1-github mark light 120px plus](/img/github-mark.png)

Some commercial companies are providing Source Code Management (SCM)
solutions based on Git. One of the most popular is GitHub
(<http://github.com>). It was bought by Microsoft in

2018. From Wikipedia, “as of January 2020, GitHub reports having over 40
      million users and more than 100 million repositories (including at least
      28 million public repositories), making it the largest host of source
      code in the world.”

Competitors to GitHub include: Bitbucket, Microsoft Team Foundation
Server, Gitlab, Phabricator, Assembla, Beanstalk, Helix Core, Gerrit,
SourceForge. We can safely claim that Git is a key component of the open
source community and has contributed to its success.

## Git Command Line Interface (CLI)

Most developers interact with Git using its command line interface (CLI)
in a terminal/command window. But for those of you not comfortable with
CLI, lots of Git graphical user interfaces (GUIs) exist and most of them
are open source. Choosing one is generally a matter of personal
preference. This
[site](https://en.wikipedia.org/wiki/Comparison_of_Git_GUIs) might help
you choose one. Even if you choose to use a Git GUI, it’s best to learn
the basics of Git using the CLI. We will be using the CLI in this blog
series.

## Installing Git on your machine

There are multiple ways to install Git on your machine. For Windows
platforms, one option is to install from
<https://gitforwindows.org/>. For Mac, the
easiest is to use brew: brew install git. Both will install the command
line interface (CLI) to Git. If you prefer graphical user interfaces,
you have plenty of options, too. A recommended one, for both Windows and
Mac, is GitHub Desktop . This being said, you might not need any of
these as there is a very good integration of Git in most code editors.
For example, Visual Studio Code, which has now become a very popular
open source Integrated Development Environment (IDE), has very good
support for Git.

## Getting involved in the open source community

To get you involved in the open source community, we will take you
through four typical use cases involving Git:

* Use case 1: I’d like to use something from the community
* Use case 2: I'd like to report an issue on a repository
* Use case 3: I'd like to share something with the community
* Use case 4: I'd like to contribute code to a repository

To help you get started using Git, I will cover use cases 1 and 2 in
this blog post. In my next post, Part 2, I will cover how to create your
own GitHub account to share something with the community. And in my
final post, Part 3, I will cover how to contribute code to an existing
repository.

## Use case 1: I’d like to use something from the community

This is probably the most frequent use case. While looking for a
solution to a problem, you discover that someone has already provided a
great open source solution with a GitHub repository pointer. How can you
take advantage of this? There are actually 2 options: you can clone this
repo or you can fork it. You would most likely clone the repository
locally if all you want is to take a look at the content and try it. You
should fork a repository to your own GitHub account in the case where
you would like to modify the content and contribute it back to the
original project. I will show you how to fork in use case 4. In this use
case, we will use git clone.

### Step 1: Cloning a repo locally

Let's imagine that you have found a great repo at
<https://github.com/Didier-Lalli/WelcomeGitDidier>
and you'd like to use the Python program shared by its author.

![git101-part1-welcomegit](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/welcomegit-1590699942819.png)

The **Clone or download** button shows the URL of the repo. Copy it to
the clipboard. Open a terminal session (terminal on Mac, PowerShell on
Windows).

1/ Clone repo in that folder with `git clone`

```
$ git clone <PasteClipboardContentHere>
```

It should look like:

```
$ git clone https://github.com/Didier-Lalli/WelcomeGitDidier.git
Cloning into 'WelcomeGitDidier'...
remote: Enumerating objects: 11, done.
remote: Counting objects: 100% (11/11), done.
remote: Compressing objects: 100% (7/7), done.
remote: Total 11 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (11/11), done.
```

2/ Change to that folder and list the content

```
$ cd WelcomeGitDidier
$ ls -l
-rw-r--r--  1 lalli  staff  20 May 25 18:11 README.md
-rw-r--r--  1 lalli  staff  79 May 25 18:11 helloworld.py
```

You can now see that there are two files and one of them is
**helloworld.py**. That’s the code we’d like to execute.

### Step 2: Running shared code

You can now use the Python program with: `python helloworld.py`

Note: you need to have a Python environment running on your machine. If
this is not the case, check
<https://www.python.org/> to get started.

1/ Let’s take a quick look at the code

```
$ cat helloworld.py 
# This is part of labs of our Git101 Jupyter Notebook 
print("Hello world!")
```

2/ Execute code

```
$ python helloworld.py 
Hello world!
```

3/ Check the status of your copy of the repo with `git status`

```
$ git status
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
```

This terminates use case 1: You should now be able to clone a public
repo and execute a code provided by the author. But there will be cases
where you will want to modify some of the code that was provided by the
author. When this happens, you have two options:

1/ Contact the author and ask him/her to make the change and `git clone`
it again

2/ Make the change yourself in your private copy of the repo and then
tell the author about it

I’ll tackle the second option in another post, where we’ll look at
contributing code to a project (use case 4). But for now, let’s cover
the first option in our next use case.

## Use case 2: I'd like to report an issue on a repo

There are many ways to get involved in the open source community. Most
of them involve writing code, such as when you’re designing new features
or fixing bugs, which we will cover in use case 4 in another post. There
is another way to contribute, which is to open an issue (think of it as
a opening a ticket) to either signal a problem you have found in the
code or propose ideas for new features or enhancements. GitHub offers
this capability in each project/repo web page.

Let's imagine that, in the **WelcomeGitDidier** repo from use case 1 we
would like to ask the owner to change the Python code, for example, to
display "Hello World!" instead of "Hello world!".

## Opening an issue on WelcomeGitDidier

Go back to
**<https://github.com/Didier-Lalli/WelcomeGitDidier>**
and locate the **Issues** tab. Create a new issue, set a title and a
description for it, and click **Submit new issue**.

![git101-part1-newissuecreated](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/newissuecreated-1590699914277.png)

That's it! The owner(s) of the project will use this issue list to track
feedback from the community and, hopefully, take action.

> Note: Taking a look at the activity in the Issues section of a project
> is always a good way to sense its level of activity and its level of
> openness.

This terminates use case 2: You should now be able to open an issue on a
public repo.

If you want to discover more about Git, I recommend the following
resources:

* [The Pro Git Book](https://www.git-scm.com/book/en/v2)
* [The Git
  Handbook](https://guides.github.com/introduction/git-handbook)
* [Video Git Crash Course](https://youtu.be/SWYqp7iY_Tc)

Stay tuned to [HPE DEV](https://developer.hpe.com/blog) for the next
articles where I will cover use case 3 and use case 4 where you will
start contributing to the community.