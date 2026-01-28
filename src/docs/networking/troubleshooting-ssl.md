---
title: Troubleshooting SSL
description: Learn how to diagnose and fix common SSL certificate issues on Railway.
---

Railway automatically provisions free SSL certificates via Let's Encrypt for all domains. Most of the time this works seamlessly, but occasionally issues can arise. This guide helps you diagnose and resolve common SSL problems.

## How Railway SSL Works

When you add a domain to your service, Railway automatically:

1. Initiates a certificate request with Let's Encrypt
2. Completes domain validation challenges
3. Issues and installs the certificate
4. Renews certificates automatically when 30 days of validity remain (certificates are valid for 90 days)

Certificate issuance typically completes within an hour, though it can take up to 72 hours in some cases.

## Quick Reference

| Symptom | Section |
|---------|---------|
| Certificate stuck on "Validating Challenges" | [Certificate Stuck on "Validating Challenges"](#certificate-stuck-on-validating-challenges) |
| ERR_TOO_MANY_REDIRECTS | [Cloudflare SSL Errors](#err_too_many_redirects) |
| Error 526: Invalid SSL Certificate | [Cloudflare SSL Errors](#error-526-invalid-ssl-certificate) |
| Error 525: SSL Handshake Failed | [Cloudflare SSL Errors](#error-525-ssl-handshake-failed) |
| SSL works for some users but not others | [Connection Issues for Some Users](#connection-issues-for-some-users) |
| Certificate shows `*.up.railway.app` | [Certificate Shows Wrong Domain](#certificate-shows-wrong-domain) |

## Before You Troubleshoot

Many SSL issues are actually browser cache issues. Before diving into troubleshooting, try these steps first:

1. **Verify your service is deployed and running:** a stopped service cannot respond to certificate validation challenges
2. **Clear your browser cache** or test in an incognito/private window
3. **Flush your local DNS cache:**
   - macOS: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - Windows: `ipconfig /flushdns`
   - Linux: `sudo resolvectl flush-caches` (or `sudo systemd-resolve --flush-caches` on older systems)
4. **Test from a different device or network** to rule out local issues
5. **Wait at least an hour** after adding a domain before investigating

If the issue persists after these steps, continue with the troubleshooting sections below.

<Banner variant="warning">
**Avoid repeatedly deleting and re-adding your domain.** Let's Encrypt enforces strict rate limits (5 duplicate certificates per domain per week). If you hit this limit, you will be blocked from issuing a certificate for that domain for 7 days, even after fixing the underlying issue.
</Banner>

## Certificate Stuck on "Validating Challenges"

If your domain shows that the Certificate Authority is validating challenges for an extended period, the certificate issuance process is not completing successfully.

### Why This Happens

- DNS records have not propagated yet
- DNS records are incorrect
- CAA records are blocking Let's Encrypt
- DNSSEC is misconfigured
- Cloudflare proxy settings are interfering

### Solutions

#### Check DNS Propagation

Verify your DNS records have propagated using a tool like [dnschecker.org](https://dnschecker.org). Enter your domain and check that the CNAME record points to your Railway-provided value (e.g., `abc123.up.railway.app`).

**Note:** If you are using Cloudflare Proxy (orange cloud), DNS lookup tools will show Cloudflare IP addresses instead of the Railway CNAME. This is expected behavior. In this case, verify your DNS settings directly in your Cloudflare dashboard instead.

DNS changes can take up to 72 hours to propagate worldwide, though most propagate within a few hours.

<Collapse title="Using a root domain (apex domain)?">

If you're configuring a root domain (e.g., `example.com` without `www`), standard DNS does not allow CNAME records at the apex. Your DNS provider must support **CNAME Flattening**, **ALIAS records**, or **ANAME records** to work around this limitation.

Most modern DNS providers (Cloudflare, Namecheap, Vercel DNS, etc.) support this. If your provider does not, you have two options:
- Switch to a DNS provider that supports CNAME flattening
- Use a subdomain like `www.example.com` instead

</Collapse>

#### Check for CAA Records

CAA (Certificate Authority Authorization) records specify which certificate authorities are allowed to issue certificates for your domain. If you have CAA records that don't include Let's Encrypt, certificate issuance will fail.

To check for CAA records:

```bash
dig CAA yourdomain.com
```

If you have CAA records, ensure Let's Encrypt is included:

```
yourdomain.com.  CAA  0 issue "letsencrypt.org"
```

If you don't have any CAA records, this is not your issue. The absence of CAA records allows any CA to issue certificates.

#### Check DNSSEC Configuration

DNSSEC can interfere with certificate validation if misconfigured. To check DNSSEC status:

1. Visit [dnsviz.net](https://dnsviz.net) and enter your domain
2. Look for any errors or warnings in the DNSSEC chain

If DNSSEC is misconfigured, you'll need to either fix the configuration or disable DNSSEC through your domain registrar.

#### Cloudflare-Specific Issues

If you're using Cloudflare, ensure:

- The DNS record is proxied (orange cloud) for regular domains
- For wildcard domains, the `_acme-challenge` record must NOT be proxied (grey cloud)
- SSL/TLS mode is set to **Full** (not Full Strict)

**The Toggle Trick:** If your certificate is stuck on "Validating Challenges," try temporarily turning the Cloudflare proxy OFF (grey cloud), wait for Railway to issue the certificate (you'll see a green checkmark in Railway), then turn the proxy back ON (orange cloud). This removes Cloudflare from the validation path and allows Railway's Let's Encrypt challenge to reach the origin directly.

See the [Cloudflare SSL Errors](#cloudflare-ssl-errors) section for more details.

## Cloudflare SSL Errors

When using Cloudflare with Railway, specific SSL configurations are required. **Use Full mode.** It encrypts all traffic while tolerating the temporary certificate states that occur during Railway's automatic certificate management.

### ERR_TOO_MANY_REDIRECTS

This typically happens when Cloudflare's SSL mode doesn't match Railway's configuration.

**Solution:** Set Cloudflare SSL/TLS mode to **Full**.

If you have SSL mode set to "Flexible", Cloudflare sends unencrypted requests to Railway, but Railway redirects HTTP to HTTPS, causing an infinite redirect loop.

### Error 526: Invalid SSL Certificate

This error means Cloudflare cannot validate the SSL certificate on Railway's origin server.

**Solution:** Set your Cloudflare SSL/TLS mode to **Full** (not Full Strict).

1. Go to your domain in Cloudflare dashboard
2. Navigate to SSL/TLS > Overview
3. Select **Full**

<Banner variant="warning">
Do not use **Full (Strict)** mode with Railway. Strict mode requires the origin certificate to be issued by a publicly trusted CA and match the hostname exactly, which can fail during certificate renewal windows.
</Banner>

<Collapse title="Why Full mode instead of Full (Strict)?">

This is not a security compromise. Full mode still encrypts all traffic between Cloudflare and Railway.

The difference is that Strict mode requires the origin certificate to match the exact hostname requested. During certificate provisioning or renewal, Railway may temporarily serve its default `*.up.railway.app` certificate. Strict mode rejects this as a hostname mismatch, while Full mode accepts it since the traffic is still encrypted.

Since your DNS points directly to Railway's infrastructure, there is no man-in-the-middle risk.

</Collapse>

### Error 525: SSL Handshake Failed

This error indicates Cloudflare could not complete an SSL handshake with Railway.

**Possible causes:**
- Railway has not yet issued a certificate for your domain
- There's a temporary issue with certificate provisioning

**Solutions:**
1. Wait for certificate issuance to complete (check your domain status in Railway)
2. Ensure your domain's DNS is correctly configured
3. Try toggling proxy off and on in Cloudflare

### Wildcard Domain Certificate Issues

For wildcard domains on Cloudflare:

1. The `_acme-challenge` CNAME record **must not be proxied** (use grey cloud / DNS only)
2. Enable [Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/) in Cloudflare
3. For nested wildcards (e.g., `*.subdomain.example.com`), you need Cloudflare's Advanced Certificate Manager

## Connection Issues for Some Users

If SSL works for most users but not others, the issue is likely on the user's end.

### Why This Happens

- Outdated browsers or operating systems that don't support modern TLS
- Corporate firewalls or proxies interfering with connections
- ISP-level filtering or outdated DNS resolvers
- Antivirus software intercepting HTTPS connections

### How to Diagnose

Ask affected users to:

1. Try a different browser
2. Try a different network (e.g., mobile data instead of WiFi)
3. Disable antivirus temporarily
4. Check if they're behind a corporate proxy

If the issue only affects users on a specific ISP or network, it's likely a network-level issue outside Railway's control.

### Testing from Your Side

You can test SSL connectivity using command-line tools:

```bash
# Test SSL connection
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate details
echo | openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | openssl x509 -noout -dates
```

## Certificate Shows Wrong Domain

If your browser shows a certificate for `*.up.railway.app` instead of your custom domain, the certificate for your domain hasn't been issued yet.

### Solutions

1. **Check domain status in Railway:** ensure it shows as verified (green checkmark)
2. **Verify DNS configuration:** your CNAME should point to the Railway-provided value
3. **Wait for issuance:** if you just added the domain, wait up to an hour
4. **Check for conflicting records:** ensure you don't have both A and CNAME records for the same hostname

## Using the Network Diagnostics Tool

If you're still having issues, Railway provides a [Network Diagnostics tool](/reference/network-diagnostics) that can help identify connectivity problems between your location and Railway's infrastructure.

Download and run the tool, then share the results with Railway support if needed.

## When to Contact Support

Contact Railway support if:

- Certificate issuance has been stuck for more than 72 hours
- You've verified DNS is correct and there are no CAA/DNSSEC issues
- The Network Diagnostics tool shows problems
- You're experiencing issues that this guide doesn't address

You can reach support through [Central Station](https://station.railway.com) by creating a thread in the Questions topic.
