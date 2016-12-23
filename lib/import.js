/*
*@param Options {options}
*@param Database <String>
*@Param Collection <String>
*@Param File <String> relative or absolute path;
*@param callback <function> with error is the first parameter
*@return typeof result from callback<String | Boolean | Number ...>
*/

var flag = require('../util').flag;
var temp = require('os').tmpDir;
var exec = require('child_process').exec;
var defaultFormat = "csv";

function importData(exec) {
	// All fields are mandatory except the callback;
	// optional options include HOST | PORT | USERNAME | PASSWORD | DESTINATION | TYPE
  return function Import(database, collection, file, options, callback) {
		var cmd = "";
		var host = options.host || "localhost"; 
		var port = options.port || 27017;
		var username = options.username || "";
		var password = options.password || "";
		var database = database;
		var file = file || ""; // if undefined, mongoimport reads from the stdin
		var type = options.type || defaultFormat;

		// use fieldFile option in place of the fields option (eg. headerline.txt) for <tsv|csv> files, 
		// place on per line ends with \x0a;
		var fieldFile = options.fieldFile ? options.fieldFile : ""; // not needed when csv|tsv has headerline
		var fields; // not needed when csv|tsv has headerline
		if (Array.isArray(options.fields)) {
			fields = options.fields.join(',');
		} else { fields = options.fields; }
		
		
		if ((username && !password) || (!username && password)) {
			throw new Error("both username and password must be provided, not one without the other!.");
		}

		// handle key options for db
		cmd += flag("host") + host 
				 + flag("port") + port 
				 + flag("db") + database
				 + flag("file") + file
				 + flag("collection") + collection
				 + flag("type") + type;

		cmd += fields ? flag("fields") + fields : "";
		cmd += username ? flag("username") + username : "";
		cmd += password ? flag("password") + password : "";
		cmd += fieldFile ? flag("fieldFile") + fieldFile : "";
		
		for (var i in options) {
			if (typeof options[i] == "boolean" && options[i] == true) {
				cmd += flag(i);
				// to ensure options already treated are not overwritten
			} else if (options[i] == ("fields" || "fieldFile" || "query" || "username" || "password" || "port" || "host" || "type" )) {
				continue;
			} else {
				cmd += options[i] ? flag(i) + options[i] : "";
			}
		}
		
		cmd = "mongoimport " + cmd;
		exec(cmd, callback);
	}
	
}

module.exports = importData(exec);
