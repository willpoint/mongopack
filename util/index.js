exports.mergeOpts = function(target, source) {
	target = target || {};
	if (arguments.length < 2)
		source = arguments[0];
	Object.keys(source).forEach(function(i) {
		if (!target.hasOwnProperty(i)){
			target[i] = source[i];
		}
	})
	return target;
}

exports.flag = function(name) {
	return " --" + name + " ";
};


