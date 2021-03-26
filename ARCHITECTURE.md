This document explains architecture of this project.

## Tiers

We split the project into four tiers: domain, infrastructure, application, and presentation. Dependencies among these tiers are as follows:

![dependency of tiers](./tiers.png)

<!--
```graphviz
# https://sketchviz.com/new
digraph G {
    compound=true;
    node [fontname = "Handlee"];
    edge [fontname = "Handlee"];

    subgraph cluster_domain {
        label = "Domain"
        color = gray
        "Repository (interface)" -> Entity -> ValueObject
        "Repository (interface)" -> ValueObject
        { rank = same; Entity; ValueObject; }
    }
    subgraph cluster_infrastructure {
        label = "Infrastructure"
        color = gray
        "Repository (implementation)" -> "Repository (interface)" [label="implements"]
        "Repository (implementation)" -> "Repository (interface)" [lhead=cluster_domain];
    }
    subgraph cluster_application {
        label = "Application"
        color = gray
        ApplicationService -> "Repository (interface)" [lhead=cluster_domain];
        ApplicationService -> "Repository (implementation)" [label ="useClass", style="dashed"]
    }
    subgraph cluster_presentation {
        label = "Presentation"
        color = gray
        Controller -> DTO
        Controller -> ApplicationService
        { rank = same; Controller; DTO; }
    }
}
```
-->

### Domain

This tier represents the domain of target business. In this layer, we put the following codes:

- Value object (VO) like UserId
- Entity like User
- Domain Service
- Specification, and
- Repository interface

### Infrastructure

This tier represents the infrastructure implementation of repository. In this layer, we put the Repository implementation.

Ideally, this tier can be replaced with similar implementation that supports another datastore, without updating other tiers.

### Application

This tier represents use cases of each domain. Use cases are grouped per target domain and named ApplicationService.

All required operations are able to handle in this tier.

### Presentation

This tier provides RESTful interface to handle feature in the application tier. Note that this tier should not refer API in domain and infrastructure tier: only application services are visible to this tier.

This presentation tier also provides [OpenAPI definition and documentation](https://docs.nestjs.com/openapi).
