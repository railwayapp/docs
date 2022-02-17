---
title: Database View
---

Railway has a built in Database Management Interface, this allows you to perform common actions on your Database such as viewing and editing the contents of your database plugins in Railway.

### Database Management

We expose two high level administrative actions through the interface for Plugin interface.

- Reset Plugin Credentials
- Wipe Plugin Data

## SQL Interfaces

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/table_select_subfar.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={995} height={628} quality={80} />

For MySQL and Postgres, Railway displays the tables contained within a plugin instance by default. This is called the Table View.

Shift-clicking on one or multiple tables exposes additional options such as the ability to delete the table(s).

### Creating a Table

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/table_create_kuvnjg.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={928} height={396} quality={80} />

Under the Table View, clicking the Create Table button at the bottom right of the interface navigates users to the Create Table interface.

For each column a user wants to add to the plugin, the interface accepts a `name`, `type`, `default_value` and `constraints`. Depending on the SQL database that is used, valid types and constraints may vary.

### Viewing and Editing Entries

When a table is clicked, the interface navigates into the Entries View.

Under the Entries View, selecting an existing entry exposes the ability to edit the entry. When button that allows one to add entries to the table.

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/edit_row_tobmdh.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={803} height={457} quality={80} />

### Add SQL Column

Selecting the add column in the entries view opens a modal that prompts you to add a new column to the table.

### Raw SQL Queries

<video autoPlay controls>
<source src="https://res.cloudinary.com/railway/video/upload/v1636424680/docs/raw_sql_queries_dlrgqn.mp4" type="video/mp4" />
</video>

Under the Query tab - there is an option to input raw queries against your SQL databases with context-aware autocompletion. (Currently only available for Postgres)

## NoSQL Interfaces

For non-structured data, Railway has interfaces that permit users to add and edit data within the plugin.

### Redis View

<Image src="https://res.cloudinary.com/railway/image/upload/v1636426105/docs/redis_view_jna8ho.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={732} height={419} quality={80} />

For Redis, Railway displays the keys contained within a plugin instance by default.

### MongoDB Document View

With MongoDB plugins, Railway displays a list of document collections. Users can add additional collections or add/edit documents within the collection.

### Adding MongoDB Databases

<Image src="https://res.cloudinary.com/railway/image/upload/v1636424673/docs/add_mongo_db_ujjcgr.png"
alt="Screenshot of Expanded Project Usage Pane"
layout="intrinsic"
width={552} height={516} quality={80} />

Within the Collections View, clicking the plus icon next to the top dropdown allows you to create a new Database.
