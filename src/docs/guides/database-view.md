---
title: Using the Database View
---

Baked into the four, one-click database templates that Railway provides, is a Database Management Interface, this allows you to perform common actions on your Database such as viewing and editing the contents of your database services in Railway.

## SQL Interfaces

<Image src="https://res.cloudinary.com/railway/image/upload/v1701904581/docs/databases/dataTab_vtj7me.png"
alt="Screenshot of Postgres Service Panel"
layout="intrinsic"
width={995} height={528} quality={80} />

For MySQL and Postgres, Railway displays the tables contained within an instance by default; this is called the Table View.

Shift-clicking on one or multiple tables exposes additional options such as the ability to delete the table(s).

### Creating a Table

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/table_create_kuvnjg.png"
alt="Screenshot of Create Table interface"
layout="intrinsic"
width={928} height={396} quality={80} />

Under the Table View, clicking the Create Table button at the bottom right of the interface navigates users to the Create Table interface.

For each column a user wants to add to the database, the interface accepts a `name`, `type`, `default_value` and `constraints`. Depending on the SQL database that is used, valid types and constraints may vary.

### Viewing and Editing Entries

When a table is clicked, the interface navigates into the Entries View.

Under the Entries View, selecting an existing entry exposes the ability to edit the entry. When button that allows one to add entries to the table.

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/edit_row_tobmdh.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={803} height={457} quality={80} />

### Add SQL Column

Selecting the add column in the entries view opens a modal that prompts you to add a new column to the table.

## NoSQL Interfaces

For non-structured data, Railway has interfaces that permit users to add and edit data within the service.

### Redis View

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/redis_view_jna8ho.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={732} height={419} quality={80} />

With Redis, Railway displays the keys contained within a database instance by default.

### MongoDB Document View

With MongoDB, Railway displays a list of document collections. Users can add additional collections or add/edit documents within the collection.

### Adding MongoDB Databases

<Image src="https://res.cloudinary.com/railway/image/upload/v1636424673/docs/add_mongo_db_ujjcgr.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={552} height={516} quality={80} />

Within the Collections View, clicking the plus icon next to the top dropdown allows you to create a new Database.
