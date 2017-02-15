const types = require('./types');

module.exports = (schema, __schemaType) => ({
	get(target, prop, reciever){
		if(prop === '__schemaType'){
			return __schemaType;
		}
		if(prop === '__valid'){
			for(let key in schema){
				if(target[key] === undefined){
					return false;
				}
			}
			return true;
		}
		if(!(prop in schema)){
			throw new ReferenceError(`Trying to get unknown prop ${prop}`, schema);
		}

		return target[prop];
	},
	set(target, prop, value){
		if(!(prop in schema)){
			throw new ReferenceError(`Trying to set unknown prop ${prop}`, schema);
		}

		const type = types.get(value);

		if(!Array.isArray(schema[prop])){
			schema[prop] = [schema[prop]];
		}

		const valid = schema[prop].reduce((res, i) => res || types.compare(type, i), false);

		if(!valid){
			throw new TypeError(`Expected property ${prop} to be of type ${
				schema[prop].map(i => i.toString()).join(',')
			}`);
		}

		target[prop] = value;
	}
});

