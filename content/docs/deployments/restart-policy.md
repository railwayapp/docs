---
title: Restart Policy
description: Learn how to configure the restart policy so that Railway can automatically restart your service if it crashes.
---

The restart policy dictates what action Railway should take if a deployed service stops, e.g., exits with a non-zero exit code.

**Note:** For services with multiple replicas, a restart will only affect the replica that crashed, while the other replica(s) continue handling the workload until the restarted replica is back online.

The default is `On Failure` with a maximum of 10 restarts.

To configure a different restart policy, go to the Service settings and select a different policy from the dropdown.

#### What does each policy mean?

- `Always`: Railway will automatically restart your service every time it stops, regardless of the reason.

- `On Failure`: Railway will only restart your service if it stops due to an error (e.g., crashes, exits with a non-zero code).

- `Never`: Railway will never automatically restart your service, even if it crashes.

#### Plan limitations

Users on the Free plan and those trialing the platform have some limitations on the restart policy:

- `Always` Is not available.

- `On Failure` is limited to 10 restarts.

Users on paid plans can set any restart policy with any number of restarts.
