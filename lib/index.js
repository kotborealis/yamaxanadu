const handler = require('./handler.js');
const Types = require('./types.js').Types;

module.exports.Schema = (schema = {}) => 
	(data = {}) => {
		const _ = new Proxy({}, handler(schema));
		Object.keys(data).forEach(prop => _[prop] = data[prop]);
		return _;
	}

module.exports.Types = Types;