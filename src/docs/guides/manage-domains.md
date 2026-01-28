---
title: Manage Domains with the Public API
description: Learn how to manage domains via the public GraphQL API.
---

Here are examples to help you manage domains using the Public API.

## List Domains for a Service

Get all domains (both Railway-provided and custom) for a service:

<CodeTabs query={`query domains($projectId: String!, $environmentId: String!, $serviceId: String!) {
  domains(
    projectId: $projectId
    environmentId: $environmentId
    serviceId: $serviceId
  ) {
    serviceDomains {
      id
      domain
      suffix
      targetPort
    }
    customDomains {
      id
      domain
      status {
        dnsRecords {
          hostlabel
          requiredValue
          currentValue
          status
        }
      }
    }
  }
}`} variables={{ projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>" }} />

## Service Domains (*.railway.app)

### Create a Service Domain

Generate a Railway-provided domain:

<CodeTabs query={`mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
  serviceDomainCreate(input: $input) {
    id
    domain
  }
}`} variables={{ input: { serviceId: "<your-service-id>", environmentId: "<your-environment-id>" } }} />

### Create with Custom Port

Route traffic to a specific port:

<CodeTabs query={`mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
  serviceDomainCreate(input: $input) {
    id
    domain
  }
}`} variables={{ input: { serviceId: "<your-service-id>", environmentId: "<your-environment-id>", targetPort: 8080 } }} />

### Delete a Service Domain

<CodeTabs query={`mutation serviceDomainDelete($id: String!) {
  serviceDomainDelete(id: $id)
}`} variables={{ id: "<your-service-domain-id>" }} />

## Custom Domains

### Check Domain Availability

Check if a custom domain can be added:

<CodeTabs query={`query customDomainAvailable($domain: String!) {
  customDomainAvailable(domain: $domain) {
    available
    message
  }
}`} variables={{ domain: "api.example.com" }} />

### Add a Custom Domain

<CodeTabs query={`mutation customDomainCreate($input: CustomDomainCreateInput!) {
  customDomainCreate(input: $input) {
    id
    domain
    status {
      dnsRecords {
        hostlabel
        requiredValue
        status
      }
    }
  }
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", domain: "api.example.com" } }} />

### Add Custom Domain with Target Port

<CodeTabs query={`mutation customDomainCreate($input: CustomDomainCreateInput!) {
  customDomainCreate(input: $input) {
    id
    domain
    status {
      dnsRecords {
        hostlabel
        requiredValue
        status
      }
    }
  }
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", domain: "api.example.com", targetPort: 3000 } }} />

### Get Custom Domain Status

Check DNS configuration status:

<CodeTabs query={`query customDomain($id: String!, $projectId: String!) {
  customDomain(id: $id, projectId: $projectId) {
    id
    domain
    status {
      dnsRecords {
        hostlabel
        requiredValue
        currentValue
        status
      }
      certificateStatus
    }
  }
}`} variables={{ id: "<your-custom-domain-id>", projectId: "<your-project-id>" }} />

### Update a Custom Domain

<CodeTabs query={`mutation customDomainUpdate($id: String!, $environmentId: String!, $targetPort: Int) {
  customDomainUpdate(id: $id, environmentId: $environmentId, targetPort: $targetPort)
}`} variables={{ id: "<your-custom-domain-id>", environmentId: "<your-environment-id>", targetPort: 8080 }} />

### Delete a Custom Domain

<CodeTabs query={`mutation customDomainDelete($id: String!) {
  customDomainDelete(id: $id)
}`} variables={{ id: "<your-custom-domain-id>" }} />

## DNS Configuration

After adding a custom domain, you need to configure DNS records. The required records are returned in the `status.dnsRecords` field.

### For Root Domains (example.com)

Add an A record or ALIAS record pointing to the Railway IP.

### For Subdomains (api.example.com)

Add a CNAME record pointing to your Railway service domain.

### DNS Record Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | DNS record not yet configured |
| `VALID` | DNS record is correctly configured |
| `INVALID` | DNS record is configured incorrectly |

### Certificate Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Certificate is being issued |
| `ISSUED` | Certificate is active |
| `FAILED` | Certificate issuance failed |
