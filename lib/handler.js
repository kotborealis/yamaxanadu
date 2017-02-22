const types = require('./types');

const _T = (_) => typeof _ === 'symbol' ? 'symbol' : _.toString();

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

		if(prop === Symbol.toStringTag){
			return 'Schema;' + Object.keys(schema).map(i => i.toString()).join(',');
		}

		if(!(prop in schema)){
			return undefined;
		}

		return target[prop];
	},
	set(target, prop, value){
		if(!(prop in schema)){
			throw new ReferenceError(`Trying to set unknown prop ${_T(prop)}`);
		}

		const type = types.get(value);

		if(!Array.isArray(schema[prop])){
			schema[prop] = [schema[prop]];
		}

		const valid = schema[prop].reduce((res, i) => res || types.compare(type, i), false);

		if(!valid){
			throw new TypeError(`Expected property ${_T(prop)} to be of type ${
				schema[prop].map(i => i.toString()).join(',')
			}`);
		}

		target[prop] = value;
	},
	enumerate(target){
		console.log('called enumerate'. Object.keys(schema));
		return Object.keys(schema)[Symbol.iterator]();
	}
});

