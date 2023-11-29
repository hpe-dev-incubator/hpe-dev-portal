---
title: "Provisioning Secure Access Controls in MapR Database"
date: 2020-11-02T06:21:10.782Z
author: Jimit Shah 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","JSON","opensource"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Jimit Shah",
"publish": "2016-05-27T07:00:00.000Z",
"tags": "nosql"
```

---

The ability to store and retrieve JSON documents using the OJAI standard has introduced a very powerful way to work with data in your MapR cluster. MapR Boolean Access Control Expressions (ACEs) provide a powerful, easy way to enforce authorization for providing secure access to data across the MapR Data Platform including MapR XD, MapR Event Store, and MapR Database.

## MULTIPLE LEVELS

Access control using ACEs can be administered at multiple levels, separating administration and data access operations. Permissions for operations like creating a column family, deleting a column family, or setting ACEs can be controlled by setting ACEs as a part of table properties. If you are not familiar with the concept of a column family, just think of it as a logical grouping of data elements for setting a consistent policy (like permissions, TTL, etc.) on those elements. This construct exists in the MapR Database wide column data model as well, though the underlying implementation is completely different in the JSON document model. In MapR Database JSON, a JSON document can be stored as a composite of multiple JSON sub-documents which are part of different user-defined column families. More information about column families in MapR Database JSON can be found at the [Docs site](https://docs.datafabric.hpe.com/51/MapR-DB/JSON_DB/column_families_in_json_tables.html).

Data access can be at column family and fieldpath levels within a table. In a JSON document, a field is the smallest unit that can be assigned a value which can be a scalar (integer, string, double, boolean etc) or a collection type (array, map). A fieldpath is a dot-separated set of fields. In fieldpath “address.home.street”, “address, “home” and “street” are individual fields—while “address” and “home” are map type, “street” is a scalar type.

Both column family and fieldpath level permissions work in conjunction to decide the final access privileges to a single JSON fieldpath or sub-document.

MapR Database supports three types of data access permissions:

*   READ: used for managing permissions for get and scan operations
*   WRITE: used for managing permissions for put and update operations
*   TRAVERSE: used for managing permissions for READ and WRITE access

While read and write permissions are independent of each other, traverse works in tandem with read and write permissions, which I’ll explain shortly. For now, let’s take a look at how the ACEs work at multiple levels.

In the following illustration, a JSON document is represented as a hierarchical structure with sub-documents rooted at respective column families. In this case, the JSON document has three column families: ‘default’, ‘CF1’, ‘CF2’. ‘Default’ is the root of the document. Each column family contains the data of all the fields and their descendant fields under it. While the number of column families and how they’re laid out in a document is entirely configurable by the admin, in MapR Database the ‘default’ column family is always the root of the document.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/aces-1-1604298011058.jpg)

While the boundaries between the different subcomponents of a document are invisible to the developer using MapR Database, the way these components are laid out is important for the admin to administer security and ensure good performance.

*   Permissions on column families are independent of each other. Permissions set on ‘default’ have no bearing on data access on ‘CF1’ or ‘CF2’. Likewise, permissions on ‘CF2’ have no effect on data access on ‘default’ or ‘CF1’.
*   Different column families can have different access control configurations. This way, the admin can control which parts of the document are accessible to which user, group or role.
*   Permissions set on a column family or fieldpath are applied to every row in the table that has data in that column family or fieldpath.
*   The permissions of column families and fieldpaths work in conjunction:
    *   Final Permission(Data in Column Family) = Permissions(Column Family) & Permissions(Fieldpath)
    *   If a user, group, or role doesn’t have permission to read data on CF1, then the user, group, or role cannot read any data under CF1.
    *   Likewise, if a user, group, or role has permission to read data on CF2, but has only permission to read a subset of fieldpaths in CF2, then the user, group, or role can read only that subset of fieldpaths.

## FINE-GRAINED

With support for native JSON documents, we have extended ACEs to provide the most fine-grained control over your data’s security. Now, admins can set read, write, and traverse permissions for any user, group, or role, to any part of a JSON document or a JSON subdocument, down to a single JSON fieldpath, with a scalar value. This is independent of access privileges to other parts of a document. All this is possible while preserving maximum space efficiency and performance.

## TRAVERSE PERMISSION

In order to provide the flexibility in enforcing access to data in MapR Database JSON, we introduced a new type of permission, called the ‘TRAVERSE’ permission, which will allow the admin to allow access to some users to some parts of the JSON document while masking access to the rest of the document. As the name suggests, this new type of permission allows ‘traversing’ a JSON document to be able to discover its ‘structure’ or ‘self-describing schema’, without giving away access to any part of the data without explicit permission.

*   The traverse permission has to be used with either a read or write permission. On its own, it has no effect on allowing or denying access. In a complex multi-level document, certain parts of the document are made accessible to certain users and groups while the rest are off limits and vice versa
*   Traverse permission works in tandem with read/write permission in a hierarchical manner. If a traverse permission is set at a higher level in a JSON document, and a read/write permission is set at a lower level, then the read/write operation is allowed only on a fieldpath that terminates at or after the lower level.
*   A good way of using the power of traverse permissions is to set it at the column family or at the highest field under a column family and then provide read/write access as desired at specific fieldpaths contained in the column family or top-level field.
*   For instance, let’s say traverse permission for user ‘m7user1’ is set at fieldpath “a.b” and read permission for the same user is set at fieldpath “a.b.c.d”. For user ‘m7user1’, all read operations up to path “a.b.c” are disallowed and only read operations on fieldpaths “a.b.c.d” or beginning with fieldpath “a.b.c.d” are allowed. If no write permission has been set for the user ‘m7user1’ explicitly at the column family or the fieldpath level, no writes are allowed, even though traverse permission had been set at “a.b”.
*   Now, let’s say we set a write permission for user ‘m7user1’ at “a.b.c” under a column family, all write operations are allowed at fieldpaths beginning with “a.b.c”, including “a.b.c” while all write operations at “”, “a” or “a.b” will be disallowed. Note that read operations will still be disallowed at “a.b.c” but write operations will be allowed for the user ‘m7user1’.

Another example is a simplified version of a ‘Personnel Record’ that may be used in a company-wide people database. Different business functions—such as Finance, HR, or Engineering—would use the same database. Depending on which business function an employee belongs to, she may belong to one of the following group IDs (‘gid’) on the MapR cluster: ‘finance’, ‘engineering’ or ‘hr’.

<u>‘Personnel Record’ JSON Document</u>

```json
{
    _id: "ENG12345",
    address: {
        home: {
            street: "116 Severn Dr",
            city: "Mars",
            state: "CA",
            zip: 96066
        },
        work: {
            street: "5440 5th Ave",
            city: "Cranberry",
            state: "CA",
            zip: 95213
        }
    },
    dob: {
        month: "January",
        day: "30",
        year: "1989"
    },
    name: {
        first: "John",
        last: "Doe
    },
    photo: "<binary:photo>",
    salary: 123456.00
    sex: "male"
}</binary:photo>
```

Depending on which gid a user belongs to, she may or may not have access to an employee’s information.

*   Engineering employees may be able to look at only the name, work address, sex, home city and zip, day and month of birth
*   Finance employees may be able to look at the name, home and work addresses, full date of birth, name, and read/write the salary.
*   HR employees may be able to read/write at all the fields except for salary.

The following illustration shows how the permissions may be configured. Imagine the JSON document laid out as a hierarchical structure like a tree. The ‘Personnel Database’ table has only one column family ‘default’. The admin ‘root’ manages permissions for the different groups - ‘hr’, ‘finance’ and ‘engineering’. The following is one possible way for the admin to set permissions:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/aces-2-700-1604298029724.jpg)

## COLUMN FAMILY PERMISSIONS

The admin can set independent read, write, and traverse permissions on the entire column family. When no column permissions are specified, all the columns (or fieldpaths in the JSON document) will inherit the same permissions as the column family they belong to

In the illustration, no permissions have been set for the field ‘sex’. In that case, the field is readable by the user ‘root’, or anyone belonging to groups ‘hr’ or ‘finance’ while only a member of the ‘hr’ group can modify it.

However, for the field ‘dob’, a column permission for read has been added so that anyone from ‘hr’, ‘finance’ or ‘engineering’ can read it. An additional column permission for read has been specified for ‘dob.year’ so that no one from ‘engineering’ can read it. Hence, the final read access can be computed as:

*   Fieldpath ‘default: dob.day’ is readable by anyone in groups ‘hr, ‘finance’ and ‘engineering’
*   Fieldpath ‘default: dob.month’ is readable by anyone in groups ‘hr, ‘finance’ and ‘engineering’
*   Fieldpath ‘default: dob.year’ is readable by anyone in groups ‘hr’ and ‘finance’ but not by anyone in ‘engineering’

No permission for write has been specified so the column family permission for write will prevail for ‘dob’ and its descendants. Hence, the final write access can be computed as:

*   Only user ‘root’ or any user from group ‘hr’ can insert or update a value for any fieldpath originating at ‘dob’ in the default column family​

## COLUMN PERMISSIONS

Like column family permissions, the admin can set independent read, write, and traverse permissions on a fieldpath or the predecessor of multiple fieldpaths.

In the ‘Personnel Record’ illustration, individual column permissions have been set on fieldpaths having scalar values, or fieldpaths having multiple children as documents and/or scalar values.

*   All fieldpaths beginning with ‘default:address.home’, except for ‘default:address.home.street’, are readable by anyone from ‘hr’, ‘finance’ and ‘engineering’, whereas only ‘hr’ and ‘finance’ can read data at ‘default:address.home.street’ fieldpath. Only a user with gid ‘hr’ can modify any field under ‘default:address.home’.
*   On the other hand, all the fieldpaths under ‘default:address.work’ are readable by everyone in groups ‘hr’, ‘finance’ and ‘engineering’ while only users from ‘hr’ are allowed to modify them
*   For fieldpath ‘default:salary’, only users from ‘finance’ can access the data at the fieldpath. No one from ‘hr’, ‘engineering’ or even the DB admin can read or update the value under ‘default:salary’. The column permissions at ‘default:salary’, in conjunction with column family permissions at ‘default’, effectively allow only users of group ‘finance’ to access the ‘salary’ fieldpath under ‘default’.

While this illustration is by no means the most optimal way to administer security within a MapR Database JSON document, it demonstrates how a database administrator can use ACEs along with placement of correlated data in the same column family in a hierarchical fashion so that most coarse-grained permissions may be specified at the higher levels of the document, closer to the column family, and more specific permissions administered as one goes deeper in the hierarchy of information, along the different fieldpaths.

## BEST PRACTICES

Let’s look at some really easy ways to begin using ACEs for administering access to JSON documents. In order to understand how ACE syntax works, we have some great docs over at [Docs](https://docs.datafabric.hpe.com/51/SecurityGuide/ACEs.html) explaining the different parts of an ACE Boolean Expression and how to set it for column families and fieldpaths.

I’ve categorized the most basic use cases for using ACEs. We’ll see how to use ACEs for READ access. The same methods can be applied to manage WRITE access.

Let’s take the example of a taxi trip database. The following is a simplified version of how a trip record may look.

<u>Taxi Trip Record</u>

```json
{
    trip_id: "SFO12345",
    trip_info: {
        trip_source: {
            lat: 37.40308,
            long: -121.96983,
            address: {
                street: "4900 Marie P DeBartolo Way",
                city: "Santa Clara",
                state: "CA",
                zip: 95054
            },
            name: "Levi's Stadium"
        },
        trip_destination: {
            lat: 37.418434,
            long: -121.94498,
            address: {
                street: "350 Holger Way",
                city: "San Jose",
                state: "CA",
                zip: 95134
            },
            name: "MapR Technologies"
        }
    },
    rider_id: "m7user1",
    driver_id: "uberlyftcoexist",
    vehicle: {
        VIN: "VWW12345354564D234DD",
        license: "7GTZ113",
        make: "Toyota",
        model: "Camry",
        year: "2015",
        color: "black".
        photo: < binary: jpg >
    },
    billing: {
        merchant: "Visa",
        transactionKey: "12345678901234",
        amount: "10.45"
    },
    reviews: {
        driver_review: {
            stars: 5,
            comment: "Safe, on time"
        },
        rider_review: {
            stars: 4
        }
    }
}

```

For a taxi trip database table, the admin could lay out the column families as follows:

*   ‘default’ column family at root of the document
*   ‘trip_info’ column family at ‘trip_info’ JSON path
*   ‘billing_info’ column family at ‘billing’ JSON path
*   ‘reviews’ column family at ‘reviews’ JSON path

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/aces-3-1604298037997.jpg)

## INCLUDE FEW

In this use case, the admin wants to grant access to a document or part of a document to a limited set of users and/or groups.

Let’s say the parties involved in a trip are ‘user_rider’, ‘user_driver’ and groups ‘billing’, ‘navigation’, ‘traffic’, ‘crm’, ‘cust_happiness’. Each group represents a team with a specific function in the taxi company’s business: ‘billing’ is responsible for processing and bookkeeping of payments; ‘navigation’ and ‘traffic’ are responsible for analyzing, computing routes and providing navigation to drivers; and ‘cust_happiness’ and ‘crm’ are responsible for customer satisfaction and addressing grievances.

Example: The billing information should be visible only to the users in ‘billing’, while the reviews are relevant only for users in ‘cust_happiness’ and ‘crm’. The admin can set the permissions on ‘billing’ and ‘reviews’ column families to allow only ‘billing’ and ‘cust_happiness’ groups to have access to the data in respective column families.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/aces-4-1604298045986.jpg)

## EXCLUDE FEW

In this use case, the admin wants to deny access to a document or part of a document to a limited set of users and/or groups.

Example: The ‘trip_id’ is an internal unique trip identifier that should be visible to everyone using the database but the ‘user_rider’ and ‘user_driver’. The admin can set permissions on the ‘trip_id’ field to exclude access to ‘user_rider’ and ‘user_driver’ and give access to all the users and groups to read or write ‘default’ column family.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/aces-5-1604298055030.jpg)

## 1:1

In this use case, the admin wants to provide access to specific parts of a document to specific users and/or groups.

Example: Let’s give read access to both ‘user_driver’ and ‘user_rider’ to each others’ reviews but also give them write access to reviews authored by them. The admin can set permissions on the ‘reviews’ column family to allow both the users to traverse the ‘reviews’ subdocument but provide only specific permissions to be writable for these users.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/aces-6-1604298064571.jpg)

## CLOSING COMMENTS

MapR Database ACEs are a very flexible and powerful method for provisioning secure access control for your data residing on MapR Database. If you have questions about ACEs or MapR Database, feel free to ask your questions on [Ezmeral Data Fabric Community.](https://community.datafabric.hpe.com/s/)