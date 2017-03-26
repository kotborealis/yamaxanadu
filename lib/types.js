const Types = {
	Array: Symbol('Array'),
	Number: Symbol('Number'),
	String: Symbol('String'),
	Date: Symbol('Date'),
	Object: Symbol('Object'),
	Bool: Symbol('Bool'),
	Null: Symbol('Null'),
	NotNull: Symbol('NotNull'),
	Any: Symbol('Any')
};

const get = (value) => {
	if(value && typeof value.__schemaType === 'symbol'){
		return value.__schemaType;
	}
	if(typeof value === 'boolean'){
		return Types.Bool;
	}
	if(typeof value === 'symbol'){
		return value;
	}
	if(value && typeof value === 'object' && typeof value.__schemaType === 'symbol'){
		return value.__schemaType;
	}
	if(Array.isArray(value)){
		return Types.Array;
	}
	if(typeof value === 'string'){
		return Types.String;
	}
	if(typeof value === 'number'){
		return Types.Number;
	}
	if(value instanceof Date){
		return Types.Date;
	}
	if(value === null){
		return Types.Null;
	}
	if(typeof value === 'object'){
		return Types.Object;
	}

	return undefined;
};

const compare = (ls, rs) => {
	const l = get(ls);
	const r = get(rs);

	if(l === undefined || r === undefined){
		return false;
	}

	if(l === Types.Any || r === Types.Any){
		return true;
	}

	if(r === Types.NotNull){
		return l !== Types.Null;
	}

	if(l === Types.NotNull){
		return r !== Types.Null;
	}

	return l === r;
};

module.exports = {
	Types, get, compare
}