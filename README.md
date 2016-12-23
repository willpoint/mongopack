## Description
  Toolbox to for mongodb backup and restore. Makes import and export to and from file smooth.
  Supports imports from json|tsv|csv and export to csv|json.

### Export API:

```
var mongoexport = require('mongopack').mongoexport;
var database = "company",
		collection = "awesome",
		destination = "cmp/backup",
		options = {
		type: "json", // default is csv
		pretty: true, // gives a pretty formatted json in output file
		field: ['_id', 'name', 'email', 'address', 'milestone'],
  };		
// perform export
mongoexport(database, collection, destination, options, function(err) {
	if (err) throw new Error();
  // yaay! export done!
	console.log("export completed, check output to verify");
})
```

### Import API:
```
var mongoimport = require('mongopack').mongoimport;
var database = "company",
		collection = "awesome",
		file = "cmp/backup";
// perform import
mongoimport(database, collection, file, options, function(err, querydb) {
	if (err) throw new Error();
  querydb(); // just to verify import is done!
	console.log("import completed and verified");
})

```

## Controlling import or export behaviour

* --ssl --if the mongod process has TLS/SSL support enabled
  * --sslCAFile -- the file name of the .pem file using relative or absolute paths
  * --sslPEMKEYFile -- the .pem file that containes both the TLS/SSL certificate and key
  * --sslPEMKeyPassword -- the password
  * --sslCRLFile -- the filename
  * --sslAllowInvalidCertificates bypass the validataion checks for server certificates and allows the use of invalid certificates (mongodb logs a warning for this)
  * --sslFIPSMode directs the mongoexport to use FIPSMode of the installed OpenSSL library
  * --username <username> to be used when operating on an authenticated in conjunction with --password
  * --password <password> to be used in conjection with --username above
  * --authenticatedDatabase <dbname> when not used mongodb assumes that the db specified to export holds the user's credentials
  * --authenticationMechanism <name> Default:SCRAM-SHA-1, others supported are PLAIN  and MONGODB-X509 authentication mechanism

## Controlling export behaviour peculiar to data export
The following parameters are mandatory for `mongoexport(params)` as shown in the [documentation]('https://docs.mongodb.com/v3.2/reference/program/mongoexport/#bin.mongoexport')

  * --host <host>
  * --port <port>
  * --fields--ipv6 --- always enable since 3.0 
  * --db <database>, -d <databas>
  * --collection <collection>, -c<database>
  * --fields <field1[,field2]>, -f<field1[,field2]>
  * --fieldFile <filename> to be used when the fieldnamese are large and placed in a seperate file
  * --query <JSON>, -q<JSON> to be used in querying the data to be exported
  * --type <string> specify the data type (eg. for csv -> --type=csv) -- default is json when it is a csv file,--fields or --fieldFile must be provided
  * --out <file>, -o<file>
  * --jsonArray this command tells mongoexport to export the entire data as an array of JSON files
  * --pretty to export the data in a pretty-printed format JSON
  * --slaveOk, -k (depracted in 3.2) use if version is before 3.2 to (see --readPreference)
  * --readPreference <string> (--slaveOk, -k is depracated in 3.2), cannot specify both in a command it sets the read preference to the nearest when using a replica set, enabling mongoexport to read from the secondary replica set members

## Controlling import behaviour peculiar to data import
The following parameters are mandatory for `mongoimport(params)` as shown in the [documentation]('https://docs.mongodb.com/v3.2/reference/program/mongoimport/#bin.mongoimport')

  * --ignoreBlanks <boolean> ignores empty fields in csv and tsv exports. if not specified `mongoimport` creates fields without values in imported documents
  * --drop <boolean> tells mongoimport to drop the collection before operating on it.
  * --headerline <boolean> tells mongoimport to use the first line in the input file as the field names
  * --fields To use if the input file does not contain the fields to be used as headers
  * --fieldFile <filename> to be used when the fieldnames are large and placed in a seperate file (to be placed one per line)
  * --upsert Modifies the import process to update existing objects in teh db if they match an imported object, while inserting other objects
  * --upsertFields <field1[,field2]>Specifies the list of fields for the query portion of the upsert (Since mongodb 3.0 upsertFields now implies upsert, so you may choose to use --upsertFields rather than --upsert)
  * --bypassDocumentValidation as name suggests, no document validation is done during the operation (new in 3.2.1)


