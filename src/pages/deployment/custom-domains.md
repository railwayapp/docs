---
title: Custom Domains
---

Custom domains can be configures inside of the Deployment -> Domains tab

Press edit, type in your domain, and we'll prompt you to update your CNAME

<NextImage  src="/images/domain.png" 
            alt="Screenshot of Custom Domain"
            layout="responsive"
            width={2040} 
            height={1806}
            quality={100} />

Once the domain is set, head over to your favorite registrar and add the DNS record as directed

NOTE! Sometimes this takes a while due to DNS

## Provider Specific Instructions

If you have proxying enabled on Cloudflare (the orange cloud), you MUST set your SSL/TLS settings to full or above. Otherwise, Cloudflare will not be able to connect to Railway.

<NextImage  src="/images/cloudflare.png" 
            alt="Screenshot of Custom Domain"
            layout="responsive"
            width={1205} 
            height={901}
            quality={100} />
