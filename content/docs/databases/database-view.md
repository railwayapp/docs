---
title: Using the Database View
description: Learn how to read, insert and edit data via the database view on Railway.
---

Baked into the four, one-click database templates that Railway provides, is a Database Management Interface, this allows you to perform common actions on your Database such as viewing and editing the contents of your database services in Railway.

## SQL interfaces

<Image src="https://res.cloudinary.com/railway/image/upload/v1701904581/docs/databases/dataTab_vtj7me.png"
alt="Screenshot of Postgres Service Panel"
layout="intrinsic"
width={995} height={528} quality={80} />

For MySQL and Postgres, Railway displays the tables contained within an instance by default; this is called the Table View.

Shift-clicking on one or multiple tables exposes additional options such as the ability to delete the table(s).

### Creating a table

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/table_create_kuvnjg.png"
alt="Screenshot of Create Table interface"
layout="intrinsic"
width={928} height={396} quality={80} />

Under the Table View, clicking the Create Table button at the bottom right of the interface navigates users to the Create Table interface.

For each column a user wants to add to the database, the interface accepts a `name`, `type`, `default_value` and `constraints`. Depending on the SQL database that is used, valid types and constraints may vary.

### Viewing and editing entries

When a table is clicked, the interface navigates into the Entries View.

Under the Entries View, selecting an existing entry lets you edit it. The view also includes a button for adding new entries to the table.

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/edit_row_tobmdh.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={803} height={457} quality={80} />

### Add SQL column

Selecting the add column in the entries view opens a modal that prompts you to add a new column to the table.

## Nosql interfaces

For non-structured data, Railway has interfaces that permit users to add and edit data within the service.

### Redis view

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/redis_view_jna8ho.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={732} height={419} quality={80} />

With Redis, Railway displays the keys contained within a database instance by default.

### MongoDB document view

With MongoDB, Railway displays a list of document collections. Users can add additional collections or add/edit documents within the collection.

### Adding MongoDB databases

<Image src="https://res.cloudinary.com/railway/image/upload/v1636424673/docs/add_mongo_db_ujjcgr.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={552} height={516} quality={80} />

Within the Collections View, clicking the plus icon next to the top dropdown allows you to create a new Database.

## Config tab

The Config tab holds the settings for a database service, grouped into Connection, High Availability, Connection Pooling, and Extensions sections. Use **Filter Settings** to search for a setting by name, or jump between sections using the list on the right.

### Connection

The Connection section shows the username and password for the database, and allows you to safely regenerate the password while keeping the database and environment variables synchronized, avoiding manual variable edits that can cause authentication mismatches.

Regenerate changes the password inside the database and updates the password variable and everything that references it (such as the database URL). A standalone database is redeployed so it starts with the new password. By default, every running service in the environment that references the password through Railway variables is then redeployed, one at a time, so your services pick up the new password without a manual redeploy. Uncheck **Redeploy services that use this database** in the Regenerate dialog to skip that step: the database still gets the new password, and your services keep the previous one until you redeploy them.

Services that hold a copy of the password instead of a reference, services in other projects, and applications outside Railway are not updated. Give them the new password yourself, or their connections fail with an authentication error.

Regenerate is the supported way to change a database password. Use it instead of the two manual routes, which change only one side each:

- Editing the password variable does not change the password inside the database. A database keeps its credentials in its data directory, and only reads the variable when it initializes an empty one — so a running database with a volume ignores the edit, and every redeploy after it keeps ignoring it.
- Running `ALTER USER` (or its equivalent) against the database does not change the variable, so Railway and everything reading the variable keep presenting the old password.

Either one on its own leaves the database and the variable out of sync, and every connection fails with an authentication error — from your app, the CLI, and this Data tab alike.

<Banner variant="info">If you have already changed one side, set the variable back to the password the database actually holds and redeploy the services that use it. Both sides match again, and Regenerate works from there.</Banner>

<Image src="/images/database-config-connection.png"
alt="Screenshot of the Connection section in the database Config tab"
layout="intrinsic"
width={1205} height={840} quality={100} />

#### Regenerate on a high availability cluster

On a high availability cluster ([PostgreSQL](/databases/postgresql-ha), [MySQL](/databases/mysql-ha), [Redis](/databases/redis-ha), or [MongoDB](/databases/mongo-ha)), Regenerate rotates the password on every member of the cluster in a coordinated way. Members adopt the new password without restarting, so the cluster keeps serving connections while the rotation runs. It takes a few minutes, and the dialog shows the current phase and the member it is working on until it finishes.

The rotation runs in this order:

1. The primary and every replica are asked whether they accept the current password and can take a new one. If any member refuses, nothing is changed and the previous password stays in place.
2. The password changes on the live primary, then on each replica, one at a time (on PostgreSQL, on the etcd nodes as well).
3. The password variable is committed, and the cluster's etcd and proxy nodes are redeployed one at a time so they connect with the new password.
4. Running services that reference the password are redeployed one at a time, unless you unchecked **Redeploy services that use this database**.
5. Every member is checked to confirm it rejects the previous password.

If anything fails before the variable is committed, the rotation restores the previous password on every member and nothing changes for your services. After the commit, the new password is in effect, and the dialog names anything that still has to be redeployed.

A member running an older build of its image is redeployed before the rotation starts. If that member is the primary, leadership moves to a replica first, with the same brief write interruption as a [failover](/databases/postgresql-ha#failover). This is the only interruption a rotation causes.

### Extensions

For Postgres databases, the Extensions section enables extension management. You can view, install, and uninstall extensions that are available in the official Railway Postgres image.

Extensions that aren't available need to be deployed from templates, since they require additional features in the database's image, like pgvector.

<Image src="/images/database-config-extensions.png"
alt="Screenshot of the Extensions section in the database Config tab"
layout="intrinsic"
width={1205} height={840} quality={100} />
