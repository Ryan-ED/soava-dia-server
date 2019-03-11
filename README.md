# Getting Started

## Requirements
* Docker and Docker Compose need to be installed
	* Docker Compose comes with Docker for Windows, but is downloaded separately on Linux
	* Generally Docker commands require sudo on Linux (if the user has not been added to the 'docker' group)
* NodeJS needs to be installed, and at least a version over version 8
* NPM over version 5 is required
* Gulp is required to be installed globally via NPM. Usually `sudo npm install -g gulp` will work
* Mocha is also required to be installed globally. Usually `sudo npm install -g mocha"`will work

## Setup Steps
* `sudo docker volume create couchbase_data`
* Then `sudo docker pull couchbase/server:community`
	* required for the container to work
* Next, run `npm install` to get the project dependencies
* Sample data will need to be added: https://github.com/matthew-rindel/soava-dia-server/blob/master/insert-sample-data.sql
* From the main project directory, `sudo gulp docker-up` will start the Couchbase Server instance
	* Access http://localhost:8091 to access the Couchbase web admin console
	* On first setup, you need to set a username and password. Administrator is fine as a default username. The password can be "password" or any other easy to remember password.
	* For the rest of the settings use the defaults
	* Create a bucket which matches the name of your project (either soava-dia, task-lion or social-mogul)
	* Set the memory allocation to around 100MB
     * Create a user called `test` with a password `test1234`
	* Go to the Queries section and create a primary index on the bucket, by executing ```CREATE PRIMARY INDEX ON `bucket-name` ```
	* ```SELECT * FROM `bucket-name` ``` should work without any errors, except there will be no data 
	* Use ```INSERT INTO `bucket-name` VALUES("someKey", { "docType": "example", "someJsonValue ": 45})``` to add sample data based on required document structures (explained in other documents)
* Finally, to launch the REST API, you can use `gulp serve` (for code watching) or `node webServer.js`

# Application Structure

commands/ - where all of the dynamically loaded JS functions go
database/ - code managing the Couchbase interactions as well as query and command loading
docker/ - docker configurations needed for a Couchbase Server instance
queries/ - where all of the dynamically loaded SQL files go
server/ - code which handles HTTP processing
tests/ - Mocha unit tests


# General application operation

## Summary
The server is a REST API which exposes a set of queries as URLs which, when requested, serve JSON data coming from a Couchbase Server instance.

Commands are also exposed as URLs, and their purpose is to modify data going into the database, or perform general logic outside the scope of a SQL/N1QL query.

## Queries

Queries are simply N1QL queries FOR Couchbase Server stored in SQL files in the server directory.

Every query can be parameterized with either an array of parameters which map to $1, $2 etc or an object of parameters which map to $someParam, $randomParam, etc (the object property names will be the same as the parameter names)

	Note - for array parameters, the names in the query start from 1. So, for the value of someArray[0] will map to $1 and so on.

Every query will be exposed as an HTTP endpoint based on the name of the query or additional metadata. Every HTTP endpoint will simply serve the result of the query as Json with no additional changes.

In addition, requests have to be authenticated and the user information will be added on as the final parameter of every query or to named parameters as $currentUserId

For sequencial parameters, they are automatically extracted after the query name by default. The following HTTP path will have the following parameters: /someQuery/stringParam/stringParamAgain/32

["stringParam", "stringParamAgain", "32"]

When an HTTP request has a query string, then those parameters will be converted to an object which is passed onto the query.

There are special comments which can be added to the SQL file to add Metadata to the query.

These are:

* singleResult
	* Because N1QL queries always return arrays. Thus, this parameter will lead to a single return value being extracted from the result set, and responding with a 404 if no result if available.

*publicQuery
	* This describes if a query can be accessed publically without authentication (the name may be changed in the future to avoid confusion with hidden/internal)
route:/someUrl/{someParam} OR route:/someUrl/somePath
	* Defines how the query is accessible though a URL
* hidden (not yet implemented, may be changed to "internal" instead")
	* This describes a query which must not be exposed as an HTTP endpoint


## Commands
Coming soon
# Commands
