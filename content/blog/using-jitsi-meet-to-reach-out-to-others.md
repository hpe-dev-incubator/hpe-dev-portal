---
title: "Using Jitsi Meet to reach out to others"
date: 2020-04-15T21:37:50.843Z
author: Frederic Passeron 
tags: ["opensource"]
path: using-jitsi-meet-to-reach-out-to-others
---
![picture11](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture11-1586988196990.png)

Along with half of the world’s population, I find myself working from home due to sheltering requirements imposed on us by the COVID-19 pandemic. In these troubled times, communication with my friends and family have become critical. I found that I needed ways to stay in touch with them easily. Of course, mobile apps offer a great diversity of options to stay in touch with one another. But conducting a multi-user video conference on a mobile phone is not very easy nor is it convenient.

There are many people today who are looking for ways to virtually connect through video conferencing. From a more professional standpoint, teachers need to be able to instruct and stay in touch with their students. Small companies could use it for meetings. Doctor/patient interactions could also benefit from such a tool. But it would need to be very inexpensive (i.e. free) and easy to use.

As a Hewlett Packard Enterprise (HPE) employee, the company offers us many ways to video conference one another, i.e. through Teams, Skype, and Zoom. Even though these technologies try to make it easy for everyone to use and affordable, I thought I might check on the open source side of the world to see what was available there as well.

Zoom is free for 40 minutes. That’s nice, but is it enough? Looking a little deeper, I found [Jitsi Meet.](https://jitsi.org/jitsi-meet/) Jitsi is free and ready to go whenever you want. Just open the [link](https://meet.jit.si/) and start your meeting. That’s all it takes.

For those who are a bit more technical, you may want consider setting up your own Jitsi Meet server at home. This could be a service you could deliver to your family and friends that would offer you a bit more control and privacy, as you wouldn’t have to rely on an external provider. To help those of you who may be interested in setting up your own Jitsi Meet instance, I thought I’d share my experience. In this post, I’ll run you through the installation process and show you how to use it.

## What is Jitsi?

Jitsi is a set of open-source projects that allows you to easily build and deploy secure videoconferencing solutions. At the heart of Jitsi are two projects, Jitsi Videobridge and Jitsi Meet. These projects allow you to have conferences on the internet, while other projects in the community enable features such as audio, dial-in, recording, and simulcasting.

## Why Jitsi?

Why was I interested in finding an open source-based solution? I wanted a living project with a community behind it in case I ran into issues or required support. I also needed a solution that I could set up myself and would not require too many resources. 

Official minimum hardware requirements for the Jitsi Meet server are very low. One gigabyte of memory and one CPU core plus 25 gigabytes of storage should be enough when used on a Linux platform. It can be set up directly on your own hardware or on a virtual machine hosted by your favorite Cloud provider.

I own a ProLiant Microserver Gen8 at home. It runs a hypervisor and hosts several virtual machines (OPNsense Firewall and Nextcloud server). I use this server to perform tests on new operating systems and software stacks. Since I had some room left on the system, I decided to create a new VM for this new project.

My home network looks like this:


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture2-1586988219313.png)

I followed several guides on how to perform the installation:

Jitsi-Meet official install guide: 
https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md

https://vitux.com/how-to-install-jitsi-meet-video-conference-platform-on-ubuntu/

HA Proxy – Let’s Encrypt:
https://forum.opnsense.org/index.php?topic=12126.0

Advanced Configuration: Behind NAT configuration
https://github.com/jitsi/jitsi-meet/blob/master/doc/quick-install.md

Secure Domain: First four steps only.
https://github.com/jitsi/jicofo#secure-domain

## Installing Jitsi Meet

My VM requirements:
CPU 1
RAM 2 GB
HDD 25 GB
Nic 1

## Initial Setup

Jitsi Meet requirements:
A server running Ubuntu 18.04 LTS
A non-root user with sudo privileges
Before starting, update your operating system with the latest version with the following command:


```

sudo apt-get update -y
sudo apt-get upgrade -y

```

Once your system is up-to-date, restart your system to apply the changes.
Next, you will need to set up a relevant hostname (node1 in this example) and FQDN to your system. You can do this by running the following commands:

`sudo hostnamectl set-hostname node1`

Next, open /etc/hosts file and add FQDN.

`sudo nano /etc/hosts`

Add the following line and adapt to your host and domain names:

`127.0.1.1 node1.example.com node1`

Add the public IP and the relevant domain name, too.

`X.X.X.X node1.example.com node1`

Save and close the file. Then, verify the hostname with the following command:

`hostname -f`

## Swap Adjustment

With a limited set of resources, I needed to adapt and adjust the swap file.


```

sudo dd if=/dev/zero of=/swapfile count=2048 bs=1M
sudo chmod600 /swapfile
sudo makeswap /swapfile
sudo swapon /swapfile
echo ‘/swapfile none swap sw 0 0’ | sudo tee –a /etc/fstab

```

## Install Java

Next, you will need to install Java to your system. You can install OpenJDK JRE 8 by running the following command:

`sudo apt-get install -y openjdk-8-jre-headless -y`

Once Java is installed, verify the Java version with the following command:

`java -version`

Output:


```

openjdk version "10.0.2" 2018-07-17
OpenJDK Runtime Environment (build 10.0.2+13-Ubuntu-1ubuntu0.18.04.3)
OpenJDK 64-Bit Server VM (build 10.0.2+13-Ubuntu-1ubuntu0.18.04.3, mixed mode)

```

## Install Nginx

Jitsi Meet uses Nginx as a reverse proxy. So you will need to install it to your system. You can install it with the following command:

`sudo apt-get install nginx -y`

Once Nginx is installed, you can check the Nginx service with the following command:

`sudo systemctl status nginx`

Output:


```

? nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2018-11-14 10:06:01 UTC; 1h 4min ago
     Docs: man:nginx(8)
 Main PID: 16734 (nginx)
    Tasks: 2 (limit: 1114)
   CGroup: /system.slice/nginx.service
           ??16734 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           ??18709 nginx: worker process

Nov 14 10:06:01 node1 systemd[1]: Starting A high performance web server and a reverse proxy server...

```

## Install Jitsi Meet

By default, Jitsi Meet is not available in the Ubuntu 18.04 default program repository. So, you will need to add the Jitsi Meet download server to the Ubuntu program repository.

You can do this by running the following command:


```
wget -qO - https://download.jitsi.org/jitsi-key.gpg.key | sudo apt-key add -
sudo sh -c "echo 'deb https://download.jitsi.org stable/' > /etc/apt/sources.list.d/jitsi.list"

```

Next, update the repository and install Jitsi Meet with the following command:


```

sudo apt-get update -y
sudo apt-get install jitsi-meet -y

```

During the installation process, you will need to provide your hostname as shown below:

![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture4-1586988248790.png)

Provide your hostname and click on the __OK__ button. You will be asked to select the SSL certificate as shown below:

![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture6-1586988261662.png)

## Local Firewall Update
Jitsi Meet requires ports 80 and 433 (TCP) and a range from 10000 to 20000 (UDP) to be opened locally and on your network to work properly. Consider also opening SSH for remote access You update the firewall rules by running the following commands:

Ubuntu Firewall rules:

Allow SSH for remote access:

`sudo ufw allow ssh`

Allow Ports 80, 443, and range from 10000 to 20000 for Jitsi Meet.


```

sudo ufw allow http
sudo ufw allow https
sudo ufw allow in 10000:20000/udp

```

Enable firewall rules.

`sudo ufw enable`

## Local Area Network Firewall Rules (OPNsense)
As I had already set up several servers behind my firewall, I had to use HA Proxy to distribute the different HTTP / HTTPS requests to the different servers (Nextcloud, Jitsi Meet).

I followed the thread below to set everything up. https://forum.opnsense.org/index.php?topic=12126.0

The thread actually covered the HA Proxy and the Let’s Encrypt topics. This proved to be very helpful in the end. Certificates are now handled by the HA Proxy layer in front of the different servers.

## Secure Meeting Room Access
By default, anyone who has access to your Jitsi instance will be able to start a conference. If your server is open to the world, anyone can have a chat with anyone else. (Unfortunately, I don’t have unlimited resources. Therefore, I needed to set some limits.)

If you want to limit the ability to start a conference to registered users only, set up a "secure domain". Follow the instructions at https://github.com/jitsi/jicofo#secure-domain. 

Follow the first 4 steps and you’ll be ready to go! This will allow you to set up a user with credentials with the necessary rights to create a room. 

## Access Jitsi Meet
If you have followed my instructions, Jitsi Meet is now up and listening on port 443. Open your web browser and type the URL `https://node1.example.com` or `https://your-server-ip.` You will be redirected to the following page:


![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture7-1586988283022.png)

Here, provide the room name you desire and click on the __GO__ button. You should see the following on your screen:

![picture8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture8-1586988303937.png)

Click on the __Allow__ button to start the live video conference.

## Some last comments

After a few hours of work, I had the server ready to go and I could open my first room. If you’ve followed my instructions, you should now be all set to easily meet with your friends, family, and colleagues! 

Keeping a social link is very important during these times. That’s why simple solutions like Jitsi Meet can really be helpful. Jitsi Meet offers an easy way for people to connect. 

There are so many possible applications for this technology. Educators can use this solution with the relevant hardware configuration so that a complete class could easily attend a course. Small companies meetings could be hosted via a dedicated server, too. 

For those who might find technology a little more daunting or less accessible, Jitsi Meet still can be easily used with a simple browser. Think how this could help the elderly keep in touch and interact with their families.

Stay tuned to the [HPE DEV blog site](https://developer.hpe.com/blog) for more helpful tutorials.
