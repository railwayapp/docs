---
title: Create a Bridge from Railway to AWS RDS with Tailscale
description: Learn how to securely access your AWS RDS database from Railway using a Tailscale subnet router.
---

## How can we privately send traffic from Railway to RDS?

In this tutorial, you will set up a Tailscale bridge to AWS RDS. This creates a secure tunnel between your Railway services and your AWS RDS database instances. This allows you to connect to your RDS databases privately without exposing traffic to the public internet.

### Objectives

In this tutorial, you will:

1. Deploy a Tailscale subnet router EC2 instance
1. Set up split DNS for domain resolution
1. Verify and test connectivity to your RDS instance
1. Route traffic from Railway to RDS using Railtail

This tutorial is in depth, so if it's your first time using Tailscale or setting up a bridge to your RDS instance, we'll cover every detail!

### Prerequisites

1. You will need an [AWS IAM access key or IAM Role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) to stand up resources with Terraform or OpenTofu.

   **NOTE:** While you can just put these secrets in a `~/.aws` folder or a `terraform.tfvars` file, its a good practice to avoid putting secrets on disk unencrypted. If you have 1Password, you can use [1Password Secret References](https://developer.1password.com/docs/cli/secret-references/) so that your secrets are never stored permenantly on disk. This is especially important to prevent AI tools from reading your keys and as an extra layer of protection from commiting secrets to your git repositories.

2. You'll need to install [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) or [OpenTofu](https://opentofu.org/docs/intro/install/).

3. You will need to generate a new ssh key that we can use to provision the AWS Instance.

4. You will need a [Tailscale account](https://tailscale.com/) and have [Tailscale installed](https://tailscale.com/kb/1347/installation) on your local machine. The free tier is generous and sufficient for this tutorial.

5. You will need to generate, store, and reference a [Tailscale Auth Key](https://login.tailscale.com/admin/settings/keys)

```bash
# Set your AWS credentials
export AWS_ACCESS_KEY_ID=my-access-key
export AWS_SECRET_ACCESS_KEY=my-secret-key
# or with 1Password
export AWS_ACCESS_KEY_ID=$(op read op://vault-name/aws-personal-access-key/access_key_id)
export AWS_SECRET_ACCESS_KEY=$(op read op://vault-name/aws-personal-access-key/secret_access_key)

# Generate an SSH key for the EC2 instance if you don't have one
ssh-keygen -t rsa -b 2048 -f ~/.ssh/tailscale-rds

# Set your TailScale Auth Key
# terraform.tfvars
#...
tailscale_auth_key = "tskey-auth-1234567890"
# or with 1Password
tailscale_auth_key = $(op read op://vault-name/tailscale-auth-key/credential)
```

### Generate a Tailscale Auth Key

- Head over to the [Keys](https://login.tailscale.com/admin/settings/keys) page located within the settings menu on the Tailscale dashboard.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/keys_page_vohahp.png"
alt="screenshot of the tailscale settings page"
layout="intrinsic"
width={1261} height={772} quality={100} />

- Click **Generate auth key**.

  Put in a description like "AWS RDS Subnet Router" and leave all other settings as the default.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/generate_auth_key_oxqr8m.png"
alt="screenshot of the generate auth key modal in tailscale"
layout="intrinsic"
width={602} height={855} quality={100} />

- Click **Generate key**.

  Tailscale will now show you the newly generated auth key. **Be sure to copy it down, and store it in secret store (like 1Password)**.

- Click **Done**.

## git clone the example project

We've prepared [an example project built in Terraform](https://github.com/echohack/rds-tailscale) (or OpenTofu if you prefer) to stand up all the AWS resources you'll need to test out connectivity to RDS.

```bash
git clone git@github.com:echohack/rds-tailscale.git
```

### Create terraform.tfvars

Create a `terraform.tfvars` file to store your variables:

```
aws_account = "your-aws-account-id"
rds_password = "your-secure-rds-password"
tailscale_auth_key = "tskey-your-tailscale-auth-key"
```

**!IMPORTANT**: Make sure you update your `userlist.txt` password to the same password as your new `rds_password`.

### Deploy

Initialize and apply the Terraform configuration:

```bash
terraform init
terraform plan
terraform apply
```

Review the changes and type `yes` to confirm deployment.

When the deployment completes, you'll see outputs including instructions for configuring split DNS and how to run the test script to verify your deployment.

## Configure Split DNS in Tailscale

Split DNS allows Tailscale to resolve AWS RDS domain names using AWS DNS servers, which is required for RDS connectivity.

- Go to the [Tailscale Admin Console DNS settings](https://login.tailscale.com/admin/dns)
- Click **Add Nameserver** → Choose **Custom**

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349122/docs/tutorials/tailscale-subnet-router/tailscale_nameservers_en8oma.png"
alt="screenshot of the nameservers dropdown in tailscale"
layout="intrinsic"
width={813} height={683} quality={100} />

- Enter the VPC DNS server IP: `172.16.0.2` (VPC CIDR base + 2)
- Enable **Restrict to domains**
- Enter: `us-west-2.rds.amazonaws.com` (replace `us-west-2` with your AWS region)

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349120/docs/tutorials/tailscale-subnet-router/add_nameserver_mlkk5y.png"
alt="screenshot of the add nameserver modal in tailscale"
layout="intrinsic"
width={602} height={572} quality={100} />

- Click **Save**

## Approve Advertised Subnet Routes and/or Enable Route Acceptance on Your Devices

For devices you can't install Tailscale on, you need to [approve the routes in the Tailscale admin UI](https://login.tailscale.com/admin/machines).

- You will see a `Subnets !` badge on the machine you set up. This indicates it is advertising routes but hasn't been approved.
- Click the `...` next to the machine
- Click the checkbox and click save.
- Now the `!` will be removed from the `Subnets` badge, indicating that the advertised routes are approved.

For your local devices to access the subnet routes advertised by the subnet router, you can also enable route acceptance via the CLI:

```bash
tailscale set --accept-routes=true
```

## Verify Connectivity

Run the verification script:

```bash
./verify_tailscale_routing.sh <rds_endpoint> postgres <password> rds-tailscale
```

The endpoint and other details can be found in the Terraform outputs after deployment.

If you're running into issues at this point, head down to the Troubleshooting section to help figure out what might be wrong.

## Connect to Your RDS Instance

Once the verification passes, you can connect to your RDS instance directly from your local machine using standard PostgreSQL tools or any database client:

```bash
psql -h <rds_endpoint> -U postgres -d tailscale_test_db
```

If you've never used Tailscale before, take a moment to familiarize yourself with the `tailscale` CLI and wrap your head around what's happening here. This is fantastic! We're routing traffic privately to our RDS instance from our local machine!

Similarly, you can now use this subnet router to route traffic from other devices in your Tailnet, including as a way to create a bridge between networks. Now we're ready to connect our Railway services! Let's do that next.

## Deploy Railtail into your project

Railtail is a project that will forward SOCK5 traffic for us RDS, because right now Railway containers don't allow priviledge escalation. This way we can use private IPv6 networking to Railtail and forward our traffic privately to our AWS Subnet Router, which will then route to RDS.

- In a project where you want to bridge services privately to RDS, click the Create button in the upper right corner. Then select Template -> Type in RailTail.

You will need four variables to deploy Railtail and start bridging traffic to your RDS instance:

- **LISTEN_PORT**: This is the port that Railtail listens on to forward traffic. We like `41641`, which is Tailscale's default UDP port for making peer-to-peer connections.
- **TARGET_ADDR**: The target address that Railtail will forward traffic to. In our case it should be `tailscale-test-db.<subnet>.<region>.rds.amazonaws.com`. You can grab this from the output of the terraform run we did earlier, or in the AWS console.
- **TS_AUTH_KEY**: The tailscale auth key we set up earlier. In the format: `tskey-auth-0123456789`
- **TS_HOSTNAME**: The friendly DNS name you can reference in your Tailnet. You can name this whatever you want. `railtail` or `railtail-project-name` is a good name here.

Click **Deploy Template**.

## Bridge Traffic to RDS

Now you can connect any service to your RDS backend. Add a variable to your connecting Service like: `DATABASE_URL="postgresql://USERNAME:PASSWORD@${{railtail.RAILWAY_PRIVATE_DOMAIN}}:${{railtail.LISTEN_PORT}}/postgres"`

That's it! Now you're bridging traffic privately from Railway to RDS.

<Image src="https://res.cloudinary.com/railway/image/upload/v1747163544/docs/tutorials/tailscale-subnet-router/railtail-to-rds_g10rrq.png"
alt="screenshot of railtail"
layout="intrinsic"
width={1544} height={533} quality={100} />

## Cleanup

When you're done with the tutorial, and so that AWS doesn't charge you money while your instances sit idle, you can destroy the resources you created automatically with:

```bash
terraform destroy -auto-approve
```

## Troubleshooting

If you encounter issues with connectivity check the `verify_tailscale_routing` script included with the repository. You may be encountering:

1. **DNS Resolution**:

- Verify split DNS configuration in Tailscale.
- Check that the correct AWS DNS server IP is being used.

2. **Route Acceptance**:

- Ensure subnet routes are being advertised by the subnet router and that you've approve those routes in the Tailscale Admin Console.
- Verify your client is accepting routes with `tailscale status`.

3. **Database Connection Failures**:

- Check security group rules to ensure the subnet router can access RDS.
- Confirm you're using the correct credentials. (!IMPORTANT `manage_master_user_password = false` must be set or else the RDS module will ignore using your set password)

4. **Subnet Router Issues**:

- Check that IP forwarding on is enabled with `cat /proc/sys/net/ipv4/ip_forward`.
- Verify Tailscale is running with `sudo systemctl status tailscaled`.

## Additional Resources

- [Tailscale: Subnet Routers](https://tailscale.com/kb/1019/subnets)
- [Tailscale: AWS RDS](https://tailscale.com/kb/1235/rds-aws/)
- [Tailscale: High Availability](https://tailscale.com/kb/1115/high-availability)
- [AWS RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [PgBouncer Documentation](https://www.pgbouncer.org/usage.html)
- [RDS Parameter List](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Parameters.html)
- [Terraform AWS VPC Provider](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest)
- [Terraform AWS RDS Module Provider](https://registry.terraform.io/modules/terraform-aws-modules/rds/aws/latest#input_parameters)
- [Tailscale Site-to-Site VPN Example (Terraform)](https://github.com/tailscale/terraform-aws-tailscale-site2sitevpn/tree/main)
- [Set Up a Tailscale Subnet Router on Railway](https://docs.railway.com/tutorials/set-up-a-tailscale-subnet-router)
