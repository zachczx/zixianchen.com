---
title: 'Extending an OCI Ubuntu Boot Volume with growpart'
description: 'I resized my boot volume on Oracle Cloud using growpart, not oci-growfs.'
date: '2024-07-07'
date_updated: '2026-08-30'
category: 'Systems'
tags:
  - Coolify
  - Oracle
  - OCI
  - Ubuntu
published: true
slug: oracle-cloud-infrastructure-oci-resize-extend-boot-volume-size
---

I'm using [Oracle Cloud Infra (OCI)'s](https://www.oracle.com/sg/cloud/free/#free-cloud-trial) generous free tier to deploy Coolify and I had a separate VM for my Python/Django stuff from some time back. Though I really liked the feeling of apt update / apt upgrade, it made sense to manage everything within Coolify.

A few container images and a lot of caching later, I started running out of space though. It was time to resize my boot volume to make it larger. Oracle gives up to 200GB storage space in the free tier, so I was well within the limits to extend the current one.

## The Problem - I'm using Ubuntu, not Oracle Linux

Maybe it's a skill issue, but it took me way too long to sort it out. This should've been a 5 min thing but it took me too long to install OCI CLI, trying growfs etc.

Oracle's docs were all about Oracle Linux. I tried Googling and every blog post (which looked like everyone just copied from one another) just repeated this Oracle Linux setup.

[Oracle](https://docs.oracle.com/en-us/iaas/Content/Block/Tasks/extendingbootpartition.htm) and every blog suggested to use OCI Utilities' _oci-growfs_. But in reality OCI Utilities and oci-growfs aren't available for Ubuntu/Debian, at least not typically. [So this person might be right but it's definitely a workaround, not Oracle's guidance.](https://www.reddit.com/r/oraclecloud/comments/121m1jp/50gb_ampere_ubuntu_instance_can_i_expand_the/)

## The Easier Process for Ubuntu

1. Edit the boot volume size from the OCI user

2. OCI gives you commands to rescan the disk after resizing it. Run them separately:

```bash
sudo dd iflag=direct if=/dev/oracleoci/oraclevda of=/dev/null count=1

echo "1" | sudo tee /sys/class/block/$(readlink /dev/oracleoci/oraclevda | cut -d'/' -f 2)/device/rescan
```

3. Do _lsblk_ to see the partition number/name

```bash
$ lsblk
```

4. Use growpart on the partition. For me it was

```bash
$ sudo growpart /dev/sda 1
```

5. One last thing is to resize the filesystem, otherwise [the system info for _/_ will still show the old size](https://serverfault.com/questions/701296/ive-just-increased-the-disks-size-but-the-old-size-is-still-display-what-coul).

Don't be like me: I initially ran `resize2fs /dev/sda 1`, which is the `growpart` syntax and is wrong here. `resize2fs` takes the partition device itself:

```bash
$ sudo resize2fs /dev/sda1
```

6. That's all, the OCI Utils thing made it 10x longer than needed. 😔
