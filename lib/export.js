/*
*@param Options {options}
*@param Database <String>
*@Param Collection <String>
*@Param Destination <String> relative or absolute path;
*@return typeof result from callback<String | Boolean | Number ...>
*/

var flag = require('./util').flag;
var temp = require('os').tmpDir;
var exec = require('child_process').exec;
var defaultFormat = "csv";

function exportData(exec) {
	// All fields are mandatory except the callback;
	// optional options include HOST | PORT | USERNAME | PASSWORD | DESTINATION | TYPE
  return function Export(database, collection, destination, options, callback) {
		var cmd = "";
		var host = options.host || "localhost"; 
		var port = options.port || 27017;
		var username = options.username || "";
		var password = options.password || "";
		var database = database || "test";
		var destination = destination || temp();
		var type = options.type || defaultFormat;

		// enclosing the query with a single quote(')
		var query = options.query ? "'" + query + "'" : "";

		if ((!options.fields || !options.fieldFile) && options.type == defaultFormat) { 
			throw new Error("to export a csv file, fields or fieldFile options must be provided")
		}

		var fieldFile = options.fieldFile ? options.fieldFile : "";
		var fields;
		if (Array.isArray(options.fields)) {
			fields = options.fields.join(',');
		} else { fields = options.fields; }

		if (username && !password || !username && password) {
			throw new Error("both username and password must be provided, not one without the other!.");
		}

		// handle key options for db
		cmd += flag("host") + host 
				 + flag("port") + port 
				 + flag("db") + database
				 + flag("out") + destination
				 + flag("collection") + collection
				 + flag("fields") + fields
				 + flag("type") + type;

		cmd += username ? flag("username") + username : "";
		cmd += password ? flag("password") + password : "";
		cmd += fieldFile ? flag("fieldFile") + fieldFile : "";
		cmd += query ? flag("query") + query : "";

		for (var i in options) {
			if (typeof options[i] == "boolean" && options[i] == true) {
				cmd += flag(i);
			} else if (options[i] == ("fields" || "fieldFile" || "query" || "username" || "password" || "port" || "host" || "type" )) {
				continue;
			} else {
				cmd += options[i] ? flag(i) + options[i] : "";
			}
		}
		
		cmd = "mongoexport " + cmd;
		exec(cmd, callback);
	}
	
}

module.exports = exportData(exec);