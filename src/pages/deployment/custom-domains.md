---
title: Custom Domains
---

Custom domains can be configures inside of the Deployment -> Domains tab

Press edit, type in your domain, and we'll prompt you to update your CNAME

<NextImage  src="/images/domain.png" 
            alt="Screenshot of Custom Domain"
            layout="responsive"
            width={1205} 
            height={901}
            quality={100} />

Once the domain is set, head over to your favorite registrar and add the DNS record as directed

NOTE! Sometimes this takes a while due to DNS

## Provider Specific Instructions

Enabling OrangeCloud Proxy

If you're on CloudFlare, you MUST set your DNS settings to full or above. Otherwise, Railway will fail to perform a secure handshake and proxy your DNS

<NextImage  src="/images/cloudflare.png" 
            alt="Screenshot of Custom Domain"
            layout="responsive"
            width={1205} 
            height={901}
            quality={100} />
