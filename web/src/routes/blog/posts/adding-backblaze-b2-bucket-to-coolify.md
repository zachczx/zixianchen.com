---
title: 'Adding Backblaze B2 Bucket to Coolify'
description: "Config to add a Backblaze B2 bucket to Coolify's S3 storages for backup."
date: '2024-09-24'
date_updated: ''
category: 'Systems'
tags:
  - Coolify
  - Backblaze
  - B2
  - backup
  - S3
published: true
slug: adding-backblaze-b2-bucket-to-coolify
---

I recently set up a new Coolify instance and had to redo configs for Coolify's S3 storage backups. I realized that the [official docs](https://coolify.io/docs/knowledge-base/s3) don't go into the Backblaze B2 configs.

It's not difficult, but this would be useful if you don't want to do slight trial and error to get the details correct. So I wrote the short steps to add a Backblaze B2 bucket to Coolify's S3 storages for backup.

1. Create your bucket at [B2 Cloud Storage Buckets](https://secure.backblaze.com/b2_buckets.htm)

   ```text
   B2 Cloud Storage > Buckets > Create a Bucket
   ```

2. Create an application key at [Application Keys](https://secure.backblaze.com/app_keys.htm)

   ```text
   B2 Cloud Storage > Application Keys > Add a New Application Key
   ```

3. Set the application key Type of Access as "Read and Write".

4. Go to your Coolify instance and add an S3 storage

   ```text
   S3 Storages > Add
   ```

5. Grab the details from your Backblaze dashboard

   ```text
   Endpoint: Get URL from the dashboard (e.g., https://s3.us-west-002.backblazeb2.com)

   Bucket: Bucket Name

   Region: Leave it (mine is the S3 default, us-east-1)

   Access key: keyID

   Secret key: applicationKey
   ```

You're done! After this, just set your Coolify instance/project backups to this Backblaze B2 bucket.
