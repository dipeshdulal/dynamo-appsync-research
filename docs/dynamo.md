## DynamoDB
Managed NoSQL DB, optimized for performance, high availability and durability. Access can be through API/ORM's and authorized through IAM. If data read patterns are known beforehand, dynamodb is an ideal db. Cost effective usage based payment model.

**Tables** are collection of **items**. Items are collection of key/value pairs.

Primary keys are partition keys and sort key. Partition key's can be duplicated if paired with sort keys. Query can be done using primary keys. Attrbutes are arbritary keys and values. If primary keys are unique, no need to create sort keys when creating a table.

Indexes can be added to dynamodb to make query effective. We can make **Global Secondary Indexes** to query some other columns than primary key columns similar to indexing in firebase. Otherwise, cost for reads are higher without setting such indexes. GSI is not free will incur additional costs.

**Capacity mode**, on-demand simplifies billing but provisioned are used when traffic is more predictable. 

Read Capacity Units (RCU) and Write Capacity Units (WCU) are how aws knows how much read and writes we can do in dynamodb. We can set maximum capacity units and minimum capacity units. Default setting is provisioned so neeed to be careful when creating tables but can be changed later on after creating db as well. Can allocate max and min RCU and WCU before hand when selecting provisioned setting. 

Global tables are used for automatic synchronization of tables in multiple availability zones to reduce the latency of access from those regions. 

Can provide backups using PITR (Point in Time Recovery). Can restore tables in particular moment in time.  

### Scanning and Querying

Can either query or scan the table. Query will provide us with constant time lookups of the data internally might use consistent hashing. While scanning is searching through the whole table for data matching the criteria, query is performing direct lookups to a selected partition based on primary or secondary partition/hash key. Usually, Query returns results within 100ms where was scan can take a few hours to find relevant piece of data.