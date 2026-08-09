---
title: 'Configuring Resend SMTP for PocketBase Email'
description: 'I configured Resend SMTP in PocketBase for verification and account emails, including the DNS, API key, sender, and application URL settings.'
date: '2024-10-13'
date_updated: ''
category: 'Dev'
tags:
  - Resend
  - SMTP
  - PocketBase
  - email
published: true
slug: using-resend-com-smtp-saas-provider-pocketbase-emails
---

I'm using PocketBase as a Backend-as-a-Service (BaaS). So far I didn't use any of the email-related features, e.g. email verification, forgot my password, email change confirmation. But I decided to try implementing email change confirmation, and needed a way to let PocketBase send emails.

## The Good Ol' Days

I'm old enough to remember the Wild West days of using PHP's mail() function or Wordpress' wp_mail() on a shared host and absolutely winging it (it worked well enough in those days).

## Using Resend.com

But it's 2024, things don't work that way anymore. I dug around and found Resend.com (and there were others like Brevo and SendGrid, which I'll come to in a minute), though any SMTP SaaS provider would work equally (or even better, given that I'm on a shared IP.)

1. Create an account on [Resend.com](https://resend.com/)

2. Verify your domain (you’ll need to go to your registrar, then add DKIM, SPF, DMARC records to your DNS records). Don't forget to click verify when you're in the domain configuration on Resend.com.

3. Since I'm using Cloudflare as my registrar, I went to their DNS > Records section to manually add the records that Resend.com wanted.

4. Get your SMTP details from Resend.

   ```text
   Settings > SMTP
   ```

5. Generate a new SMTP key in Resend.com

   ```text
   API Keys > Create API Key
   ```

6. Make sure your PocketBase config is alright. The application URL needs to be the URL of PocketBase, not the actual app. E.g. I host my PocketBase instance on https://pocketbase.yourwebsite.com, so use that instead of https://yourwebsite.com

   ```text
   PocketBase > Settings > Application
   Application URL: <<as above>>
   ```

7. Add the SMTP settings to PocketBase.

   ```text
   PocketBase > Settings > Mail Settings

   Sender name: <<I use No-Reply>>
   Sender address: <<can be anything>> (I use no-reply@mydomain.com)

   SMTP server host: smtp.resend.com
   Port: 587
   Username: resend
   Password: <<API key you created>>
   ```

8. Really easy!

## Alternatives

### _Brevo_ - Emails flagged out as Spam

I originally wrote an earlier version of this post using Brevo as the SMTP SaaS provider. Unfortunately Brevo's not good for this, despite the generous free tier (perhaps that's the cause).

The problem was the emails sent via Brevo were getting caught in spam filters. My Gmail accounts sent those straight to Spam and marked them dangerous (“This message seems dangerous”).

![Gmail warning that the Brevo test email seems dangerous](/suspicious-screenshot.webp)_Feels bad seeing my emails flagged out as dangerous._

This was most likely due to the shared IP that Brevo assigned me being blacklisted and their algorithm looks out for emails where the sender IP is different from the domain name being used.

### SendGrid - Getting banned right after creating an account

SendGrid's recommended on a few reddit threads, so I thought it'd be a good choice.

Wrong.

After creating an account, having to login twice (integrated account with Twilio), I got an email from Twilio Support:

> Hello,
>
> We appreciate your interest in Twilio SendGrid and your efforts in completing our account creation process. After a thorough review, we regret to inform you that we are unable to proceed with activating your account (unified_acct_USxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx - xxxxxxxx) at this time.
>
> Ensuring the security and integrity of our platform is our top priority, and our vetting process is designed to detect potential risks. While we understand the importance of transparency, we are not able to provide the specifics of our vetting process.
>
> We want to emphasize that our decision is based on stringent security measures and our commitment to the safety of all our users.
>
> Thank you for considering Twilio SendGrid.
>
> Sincerely,
> Onboarding & Compliance Operations

I got banned before I even logged into my account to complete registration. I didn't even get to send a test email. It's a joke.

Turns out it has been happening to people in the last year. So it's a good thing I avoided SendGrid after all, sounds like it'll be a dumpster fire of a ride even if I registered.

## Minor mistake - messed up PocketBase usage as a user

I also made some mistakes like testing with an email address that already existed in another user.

- Kept getting 400 errors but didn’t understand why. I was just relying on the sanitized error message “Something went wrong while processing your request.”
- Solved it when I dug deeper into the errors that returned from a try/catch, and it turns out err.data contained the real errors - 'User email already exists or it is invalid.'
- So this was a good reminder that it's always best practice to dig deeper into PocketBase's real error messaging.
