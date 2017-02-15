const handler = require('./handler.js');
const Types = require('./types.js').Types;

module.exports.Schema = (schema = {}) => {
	const __schemaType = Symbol(Object.keys(schema)
		.map(i => i.toString())
		.join(',')
	);
	return new Proxy(
		(data = {}) => {
			if(data.__schemaType === __schemaType){
				return data;
			}
			
			const _ = new Proxy({}, handler(schema, __schemaType));
			Object.keys(data).forEach(prop => _[prop] = data[prop]);
			return _;
		}, 
		{
			get(target, prop){
				if(prop === '__schemaType'){
					return __schemaType;
				}
				else{
					return undefined;
				}
			}
		}
	);
}

module.exports.Types = Types;