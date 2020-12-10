---
title: "Get involved in the open source community! Part 2: Sharing with the community "
date: 2020-06-05T12:47:25.671Z
author: Didier Lalli 
tags: ["git","github","opensource"]
path: get-involved-in-the-open-source-community-part-2-sharing-with-the-commun
---
![git101-part1-git icon 1788c](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/git-icon-1788c-1590702885345.png)

In the [Part 1](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi) of my blog series, I discussed how to get started with Git and leverage some of the content provided by the open source community. We already covered use case 1 and use case 2 from the list below:
- Use case 1: I’d like to use something from the community
- Use case 2: I'd like to report an issue on a repository
- Use case 3: I'd like to share something with the community
- Use case 4: I'd like to contribute code to a repository

In this article I am covering use case 3, where we will start contributing to the community.

# Use case 3: I'd like to share something with the community
Let's try sharing something with the open source community. In this use case, you will create your first repository on GitHub. And if you don't have a GitHub account yet, it will also be a good time to create one in order to start sharing things with others. GitHub started as a place for sharing and versioning source code, but many other things can be shared on GitHub, including PDF files (tutorials, for example), config files, markdown files, and Jupyter Notebooks. So, don't be shy and start to contribute.

>Note: Anything can be shared, but Git works best on non-binary content.

## Step 1: Creating a personal account on Github
For those of you who do not have a GitHub account (or equivalent), now is a good time to create one. To do so:

1. Connect to  https://github.com/join
2. Choose a username, enter your email, and select a password



![git101-part2-signup](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/signup-1591362322035.png)

It’s as simple as that!
## Step 2: Create an empty repo called WelcomeGit

Let’s create our first repository (a.k.a. repo) using the following instructions:

1. Use the + sign next to your profile to Add a repository


![git101-part2-newrepo](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/newrepo-1591362355840.png)

2. Provide WelcomeGit for a repo name 
3. Provide a description
4. Make it Public 
5. Do not initialize a README file
6. Do not setup an ignore file
7. Select Apache License 2.0 

>Note: It is good practice to select a licensing scheme as soon as you create a repository. There are many choices, and the specificities of each scheme is beyond the scope of this article. We selected Apache License 2.0, which is a very permissive license for your code (basically, anyone can use it for any purpose and there is no requirement to share changes). You can find out more regarding open source licensing schemes [here] (https://opensource.org/licenses).


![git101-part2-createrepo](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/createrepo-1591362387371.png)

## Step 3: Working securely with GitHub

You could use your GitHub password from the CLI, but it's not considered good practice to use passwords in clear text in a terminal session. Our recommendation is to use a specifically generated token instead (which we can revoke when you don’t need it anymore). For this, we will need to follow the instructions described [here] (https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

>Note: Another popular option is to use an SSH key to access GitHub and avoid providing any password or token. Creating a public/private keypair is beyond the scope of this lab, so we will stick to HTTPS and use a token. But feel free to check how to import your SSH key [here](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account).

Let's go:

1. [Open Personal Settings]( https://github.com/settings/profile)
2. [Select the Developer settings](https://github.com/settings/apps)
3. [Select Personal access tokens](https://github.com/settings/tokens)
4. [Click Generate new token](https://github.com/settings/tokens/new)
5. Set up a note such as "Git101 Token", select "repo" for the scope and click Generate token (this will prompt you for your GitHub account password)
6. Copy the generated token to the clipboard and use it when prompted for you git password

>Note: You cannot display the value of a token once you close the window. You will need to regenerate a new token if you forgot its value.

## Step 4: Build content into your WelcomeGit repo from Git CLI

Open a terminal session (terminal on Mac, PowerShell on Windows).

1/ Create a folder called **welcomegit**


````
$ mkdir welcomegit
$ cd welcomegit
````

2/ Initialize Git on this empty folder using `git init`. After Git was initialize all changes in this folder will be monitored by Git. Your folder has become a local repo(sitory)


````
$ git init
Initialized empty Git repository in /Users/lalli/welcomegit/.git/
````

3/ Create a **README.md** file with just one line in it. For example: “This is my README file”


````
$ cat >> README.md
This is my README file
ˆD
````

4/ Let’s query the status of our local repo using `git status`

````
$ git status
On branch master
No commits yet
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	README.md
nothing added to commit but untracked files present (use "git add" to track)
````
Git tells you that a file was discovered and it needs to be added to Git to make it part of the repo.

5/ Add file to the repo with git add (` git add . ` will add all files in folder)


````
$ git add README.md
````

6/ Let’s query the status of our local repo using `git status` again

````
$ git status
On branch master
No commits yet
Changes to be committed:
  (use "git rm --cached <file>..." to unstage.
	new file:   README.md
````
We see that the new file is now part of the repo, but the changes have not yet been committed.

7/ Before we commit, let’s set a few Git environment variables

````
$ git config --global user.email <your-git-email>
$ git config --global user.name <your-git-username>
````
8/ Commit changes to repo with `git commit`

````
$ git commit -m “Added README.md to repo”
[master (root-commit) ab3adf5] Added README.md to repo
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
````
9/ Let’s now connect this local repo to our WelcomeGit repo (created in Step 2) using `git remote` 

>Note: Best practice is to call this remote: origin


````
$ git remote add origin <your-repo-URL-goes-here> -m master
````
For example:

````
$ git remote add origin https://github.com/didou06/WelcomeGit -m master
````
10/ Verify status of our remote repo with `git remote -v`

````
$ git remote -v 
origin https://github.com/Didou06/WelcomeGit.git (fetch)
origin https://github.com/Didou06/WelcomeGit.git (push)
````
11/ It’s now time to push our changes to your remote repo using git push. You should be prompted for GitHub username and password.

````
$ git push --set-upstream origin master
Username for 'https://github.com': didou06
Password for 'https://didou06@github.com': 
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 247 bytes | 247.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To https://github.com/Didou06/WelcomeGit.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
````
12/ Query status of repo one last time

````
$ git status
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
````

That’s already quite a lot of commands. There are a lot more, but these are the most important ones to learn to get started.

## Step 5: Verify WelcomeGit repo in web GUI

On your GitHub repo, you can verify that you now have a **README.md** file with some content (refresh page, if needed). Well done!


![git101-part2-readmeadded](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/readmeadded-1591365686744.png)

That's it. From now on, every change made in the WelcomeGit folder on your machine (add file with `git add`, delete file with `git rm`, rename file with `git mv`, modify content of files) will be tracked by Git. It is your choice to commit changes locally like we did in Step 4 using `git commit`. It is also your choice to push changes from your local repo to your remote repo using `git push`. You can add contributors to your project, and each will work the same way, using a local repo, then pushing back centrally. Git makes it possible to scale to hundreds of contributors as shown in the [Grommet GitHub](https://github.com/grommet/grommet), for example. 

This terminates use case 3: Congratulations! You have created your GitHub account and populated your first repo from the command line using Git. You have just become an active member of the open source community :-).

If you want to discover more about Git, I recommend the following resources:

- [The Pro Git Book](https://www.git-scm.com/book/en/v2)
- [The Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Video Git Crash Course](https://www.youtube.com/watch?v=SWYqp7iY_Tc&feature=youtu.be)

Stay tuned to [HPE DEV](https://developer.hpe.com/blog) for the last article where I will cover use case 4. In this use case, you will start contributing some code back to an existing project.
