---
title: Templates
---

Templates provide a way to jumpstart a project by giving users the means to package a service or set of services into a reusable and distributable format.

For information on how to create and deploy templates, visit our [how-to guides for templates](how-to/use-templates).

## Kickback program

If your published template is deployed into other users' projects, you are immediately eligible for a 25% kickback, in the form of Railway credits, of the usage cost incurred by those users.  That means if a user deploys your template, and the usage of the services cost the user $100, you could receive $25 in Railway credits.

### Important things to note
- Your template must be published to the marketplace to be eligible for kickback.
- For Hobby users with a $5 discount, only usage in excess of the discount is counted in the kickback.
- Platform fees are not included in the kickback, but usage fees of the platform are included.  Examples of platform fees are:
  - Cost of Subscription Plan ($5 for Hobby, $20 for Pro)
  - Additional Team Seats
  
  As an example, if a user pays $20 in platform fees, then incurs $200 of usage from your template, you are eligible for a $50 kickback (25% of $200).
- Currently, the minimum kickback our program supports is $1, meaning usage of your template must incur at least $4 in usage after discounts and/or platform fees.  We are working to enable fractional kickbacks (< $1).
- All service types and resource usage of those services (compute, volume, egress, etc) *do count* towards the kickback.

Read more about the kickback program [here](https://railway.app/open-source-kickback).

## Updatable Templates

When you deploy any services from a template based on a GitHub repo, every time you visit the project in Railway, we will check to see if the project it is based on has been updated by its creator.

If it has received an upstream update, we will create a branch on the GitHub repo that was created when deploying the template, allowing for you to test it out within a PR deploy.

If you are happy with the changes, you can merge the pull request, and we will automatically deploy it to your production environment.

<Banner variant="info">
If you're curious, you can read more about how we built updatable templates in this <Link href="https://blog.railway.app/p/updatable-starters">blog post</Link>.
</Banner>

Note that this feature only works for services based on GitHub repositories.  At this time, we do not have a mechanism to check for updates to Docker images from which services may be sourced.