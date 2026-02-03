---
title: Manage Domains with the Public API
description: Learn how to manage domains via the public GraphQL API.
---

Here are examples to help you manage domains using the Public API.

## List domains for a service

Get all domains (both Railway-provided and custom) for a service:

<GraphQLCodeTabs query={`query domains($projectId: String!, $environmentId: String!, $serviceId: String!) {
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
}`} variables={{ projectId: "project-id", environmentId: "environment-id", serviceId: "service-id" }} />

## Service domains (*.railway.app)

### Create a service domain

Generate a Railway-provided domain:

<GraphQLCodeTabs query={`mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
  serviceDomainCreate(input: $input) {
    id
    domain
  }
}`} variables={{ input: { serviceId: "service-id", environmentId: "environment-id" } }}
optionalFields={[
  { name: "input.targetPort", type: "Int", description: "Route traffic to this port" },
]} />

### Delete a service domain

<GraphQLCodeTabs query={`mutation serviceDomainDelete($id: String!) {
  serviceDomainDelete(id: $id)
}`} variables={{ id: "service-domain-id" }} />

## Custom domains

### Check domain availability

Check if a custom domain can be added:

<GraphQLCodeTabs query={`query customDomainAvailable($domain: String!) {
  customDomainAvailable(domain: $domain) {
    available
    message
  }
}`} variables={{ domain: "api.example.com" }} />

### Add a custom domain

<GraphQLCodeTabs query={`mutation customDomainCreate($input: CustomDomainCreateInput!) {
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
}`} variables={{ input: { projectId: "project-id", environmentId: "environment-id", serviceId: "service-id", domain: "api.example.com" } }}
optionalFields={[
  { name: "input.targetPort", type: "Int", description: "Route traffic to this port" },
]} />

### Get custom domain status

Check DNS configuration status:

<GraphQLCodeTabs query={`query customDomain($id: String!, $projectId: String!) {
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
}`} variables={{ id: "custom-domain-id", projectId: "project-id" }} />

### Update a custom domain

<GraphQLCodeTabs query={`mutation customDomainUpdate($id: String!, $environmentId: String!, $targetPort: Int) {
  customDomainUpdate(id: $id, environmentId: $environmentId, targetPort: $targetPort)
}`} variables={{ id: "custom-domain-id", environmentId: "environment-id", targetPort: 8080 }} />

### Delete a custom domain

<GraphQLCodeTabs query={`mutation customDomainDelete($id: String!) {
  customDomainDelete(id: $id)
}`} variables={{ id: "custom-domain-id" }} />

## DNS configuration

After adding a custom domain, you need to configure DNS records. The required records are returned in the `status.dnsRecords` field.

### For root domains (example.com)

Add an A record or ALIAS record pointing to the Railway IP.

### For subdomains (api.example.com)

Add a CNAME record pointing to your Railway service domain.

### DNS record statuses

| Status | Description |
|--------|-------------|
| `PENDING` | DNS record not yet configured |
| `VALID` | DNS record is correctly configured |
| `INVALID` | DNS record is configured incorrectly |

### Certificate statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Certificate is being issued |
| `ISSUED` | Certificate is active |
| `FAILED` | Certificate issuance failed |
