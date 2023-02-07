## DynamoDB
Managed NoSQL DB, optimized for performance, high availability and durability. Access can be through API/ORM's and authorized through IAM. If data read patterns are known beforehand, dynamodb is an ideal db. Cost effective usage based payment model.

**Tables** are collection of **items**. Items are collection of key/value pairs.

Primary keys are partition keys and sort key. Partition key's can be duplicated if paired with sort keys. Query can be done using primary keys. Attrbutes are arbritary keys and values. 

Indexes can be added to dynamodb to make query effective. We can make **Global Secondary Indexes** to query some other columns than primary key columns similar to indexing in firebase. Otherwise, cost for reads are higher without setting such indexes.


