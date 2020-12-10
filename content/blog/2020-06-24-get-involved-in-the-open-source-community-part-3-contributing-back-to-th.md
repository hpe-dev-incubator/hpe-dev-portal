---
title: "Get involved in the open source community! Part 3: Contributing back to the community"
date: 2020-06-24T08:06:31.204Z
author: Didier Lalli 
tags: ["git","github","opensource"]
path: get-involved-in-the-open-source-community-part-3-contributing-back-to-th
---
![git101-part1-git icon 1788c](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/git-icon-1788c-1590702885345.png)

In the [Part 1](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi) of my blog series, I discussed how to get started with Git and leverage some of the content provided by the open source community. In [Part 2](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-2-sharing-with-the-commun) of the series, I covered how to create and populate your first repo on GitHub. So far, we have covered use cases 1, 2 and 3 from the list below:

- Use case 1: I’d like to use something from the community
- Use case 2: I'd like to report an issue on a repository
- Use case 3: I'd like to share something with the community
- Use case 4: I'd like to contribute code to a repository

In this article, I’m covering the last use case, where we will modify code from an existing repo and submit it back to its owner.

# Use case 4: I'd like to contribute code to a repo

In use case 1, we saw that we could use code from the community using `git clone`. In use case 2, we reported an issue on a repo that we cloned and used. But what if you would like to contribute back to this project? For example, you might have discovered a bug that you have already fixed in your copy of the code and would like to share this fix. Or maybe you have enhanced a section of the code or fixed the documentation. Basically, anything that belongs to the project can be contributed back. In cases like this, the best approach is to `fork` the original repository into your own GitHub account (which we have created in use case 3) and work on this private copy. Let's see how this works.

## Step 1: Forking a repo into your own GitHub account

In this lab, we would like to fork the https://github.com/Didier-Lalli/WelcomeGitDidier repo in order to improve it. This step is done from the GUI of GitHub and requires that you own a GitHub account yourself and are logged into it.

1.	Make sure you are connected to your GitHub account
2.	Then, open https://github.com/Didier-Lalli/WelcomeGitDidier

![git-part3-welcomegit](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/welcomegit-1592986241565.png)

3.	Click on the Fork button in the upper right corner
4.	After a while (depending on the size of the repo), you’ll be redirected to your own GitHub account. There, you will find your own copy of the WelcomeGitDidier repo, mentioning that it was forked from another source.


![git-part3-forkedrepo](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/forkedrepo-1592986346589.png)

## Step 2: Cloning the forked repo

In order to start making changes to this repo, we need to clone it locally like we did in [Part1](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi).

Open a terminal session (terminal on Mac, PowerShell on Windows).

1/ Clone your copy of the WelcomeGitDidier


```bash
$ git clone https://github.com/<YourGitHubUsername>/WelcomeGitDidier
```
For example, for me it’s: 

```bash
$ git clone https://github.com/didou06/WelcomeGitDidier
```

2/ Check files part of the repo


```bash
$ cd WelcomeGitDidier
$ ls -l
total 16
-rw-r--r--  1 lalli  staff  20 May 25 18:11 README.md
-rw-r--r--  1 lalli  staff  79 May 25 18:11 helloworld.py
```

3/ Check content of Python file


```bash
$ cat helloworld.py
# This is part of lab 4 of our Git101 Jupyter Notebook 
print("Hello world !")
```

4/ Check status of repo 


```bash
$ git status
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
```

## Step 3: Making changes to the cloned repo

Let's say that we would like to make a contribution to the Python script. For example, we would like to change that "Hello world!" into "Hello World!" or, even better, add another line that prints your name or “hello world” in a different language. You decide, but please make sure you keep what was already there in the file. Just keep adding to it.

1/ Edit helloworld.py with your favorite editor and add a line at the end of the file with something like:


```bash
print("Hello Didou06, many thanks for the contribution")
```

Save the file

2/ Check status of repo


```bash
$ git status
On branch master
Your branch is up to date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)
	modified:   helloworld.py
no changes added to commit (use "git add" and/or "git commit -a")
```

You can see that Git is telling us in the `git status` output that changes have been made to a file (helloworld.py) that have not been staged (nor committed) yet. We are going to commit those changes, but if you would like to cancel the changes you made and revert back to the original content of the clone repo (from master branch at origin), you can use `git checkout -f`.

3/ Before you commit those changes, make sure the new code works fine. This is very important. You should not commit non-working code. We can run the Python code with:


```bash
$ python helloworld.py 
Hello world !
Hello Didou06, many thanks for the contribution
```

Now that we are happy about this new version of the code, let's add the file and commit the changes like we did in [Part 2](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-2-sharing-with-the-commun) blog:

4/ Commit changes locally using `git add` and `git commit` and verify that Git has picked up the change using `git status`


```bash
$ git add helloworld.py
$ git commit -m "Updated helloworld for Part 3 blog3"
[master 0a7dbb0] Updated helloworld for Part 3 blog
 1 file changed, 1 insertion(+)
$ git status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)
nothing to commit, working tree clean
```

## Step 4: Working in your own branch

At this point we are ready to `git push` our changes. But before we do this, let's discuss branches. Branches are a key concept that are at the heart of Git.

> Note: Mastering branches is beyond the scope of this lab, but you can read more about it [here](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell).

It is not considered good practice to push changes to the master branch, which is the default when first cloning a repo (note all the "On branch master" messages in the output from the git commands). Instead, developers would typically create a branch (in most cases corresponding to a theme that they have worked on, such as a new feature or a fix) and push the changes to a new branch. Git allows as many branches as you'd like. Git also provides the tooling to merge branches with the master branch when all validation checks have been successful.

So, let's create a branch for this update called <yourname\>/AddedMyName.

This next script will do the following:

1/ Create a branch called <yourname\>/AddedMyName using `git branch`


```bash
$ git branch didou06/AddedMyName
```

2/ Switch to using that new branch instead of the master using `git checkout`


```bash
$ git checkout didou06/AddedMyName
Switched to branch 'didou06/AddedMyName'
```

You can see that you are now operating from this new branch, but still within your local repo. It's now time to push your changes back to our remote repo using a `git push` command.

3/ Push changes to your own remote repo using `git push`. You will be prompted for your GitHub username and password.


```bash
$ git push origin didou06/AddedMyName
Username for 'https://github.com': didou06
Password for 'https://didou06@github.com': 
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 413 bytes | 413.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
remote: 
remote: Create a pull request for 'didou06/AddedMyName' on GitHub by visiting:
remote:      https://github.com/Didou06/WelcomeGitDidier/pull/new/didou06/AddedMyName
remote: 
To https://github.com/Didou06/WelcomeGitDidier.git
 * [new branch]      didou06/AddedMyName -> didou06/AddMyName
```

4/ Verify that Git has picked up the change using `git status`


```bash
$ git status
On branch didou06/AddedMyName
nothing to commit, working tree clean
```

5/ Now, open GitHub and verify that you have a new branch (in addition to master) in the branches section of the repo page


![git-part3-branches](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/branches-1592986802278.png)

You can drill down to the content of **helloworld.py** to verify that your changes are there.

![git-part3-updatedpython](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/updatedpython-1592986856289.png)


6/ At this stage, your only remote repo is WelcomeGitDidier on your own GitHub account. You can verify this using the command `git remote -v`


```bash
$ git remote -v
origin https://github.com/Didou06/WelcomeGitDidier.git (fetch)
origin https://github.com/Didou06/WelcomeGitDidier.git (push)
```

But what would happen if the original repo that you forked was to change? It is possible that, if you forked something a while ago, things have evolved on the original master branch, and your branch is now out of synch. One way to fix this is to add the original repo as an additional remote repo to your local repo using git remote. This is a best practice and we usually name that remote repo: **upstream**.

7/ Let's do this now using `git remote add` and check again using `git remote -v`


```bash
$ git remote add upstream https://github.com/Didier-Lalli/WelcomeGitDidier
$ git remote -v
origin	https://github.com/Didou06/WelcomeGitDidier.git (fetch)
origin	https://github.com/Didou06/WelcomeGitDidier.git (push)
upstream	https://github.com/Didier-Lalli/WelcomeGitDidier (fetch)
upstream	https://github.com/Didier-Lalli/WelcomeGitDidier (push)
```

8/ If you need to integrate some recent changes made upstream, you can do it using the `git merge` command. 

This git merge might generate merge conflicts as multiple changes may have been made on the same section of one of the files. Git will do its best to automatically merge the changes, but in impossible cases, it will tell you and you would have to fix those by hand (in a text editor) before committing changes to your repo. You can use `git status` to check if this is the case.


```bash
$ git merge upstream/master 
Already up to date.
```

This is not the case in our example. 

## Step 5: Opening a Pull Request

It's now time to contribute back these changes to the original DidierWelcomeGit repo. This is done by opening a so-called **Pull Request** (often abbreviated PR by developers). This action tells the owner of the repo that you forked (that's me) that you are proposing some changes and you are asking the owner to review and pull those changes (thus the Pull Request term) into the shared repo master copy. These pull requests are created from the GitHub web page. 

1/ In GitHub, list the branches available to identify the one that you have just created (<yourname\>/AddedMyName)


![git-part3-branches](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/branches-1592986802278.png)

2/ Use the `New pull request` button to open a new PR. Notice that this is opening a pull request on the original repo we forked earlier in the lab. Put a simple comment with your email, check that the changes you made are part of the pull request at the bottom of the page, and hit the Create pull request button.

![git-part3-openingpr](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/openingpr-1592986965058.png)

3/ You can now see your **Pull Request** (there might be other ones already there). This now requires approval from the owner and might lead to an exchange between the owner and the contributor, until he/she accepts the PR (or not).

![git-part3-viewingpr](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/viewingpr-1592987054957.png)

> Note: You can continue to make updates to this branch (and by default this Pull Request) until it is accepted by the owner of the repo.

This terminates use case 4: You should now be able to open a Pull Request to enhance a public repo. Congratulations. You are now a real open source contributor. Welcome to the community!

# Where do I go from here?

We only touched the surface of Git in these three blog posts. We showed you some typical use cases in order to illustate the most important Git actions:

1. Cloning an existing public repo (covered in [Part 1](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi))
2. Opening an issue on a public repo (covered in [Part 1](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi))
3. Creating your GitHub account and populating a first public repo (covered in [Part 2](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-2-sharing-with-the-commun))
4. Forking a public repo and opening a pull request (covered here)

If you want to discover more about Git, I recommend the following resources:

- [The Pro Git Book](https://www.git-scm.com/book/en/v2)
- [The Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Video Git Crash Course](https://www.youtube.com/watch?v=SWYqp7iY_Tc&feature=youtu.be)

Stay tuned to [HPE DEV](https://developer.hpe.com/blog) for the last article where I will cover use case 4. In this use case, you will start contributing some code back to an existing project.


