# Yamaxanadu
Smol node.js tool for schema validation

## Example

```
const Schema = require('yamaxanadu').Schema;
const Types = require('yamaxanadu').Types;

const MySchema = Schema({
	_number: Types.Number,
    _string: Types.String,
    _date: Types.Date,
    _array: Types.Array,
    _object: Types.Object,
    _null: Types.Null,
    _notNull: Types.NotNull,
    _any: Types.Any,

    _number_or_string_or_null: [Types.Number, Types.String, Types.Null]
});

const myObj = MySchema();
myObj.nooo = 1; //throws
myObj._number = null; //throws
myObj._string = 1; //throws
myObj._number = 1;
myObj._array = []
myObj._any = 'asdasdasd';
myObj._number_or_string_or_null = null;

myObj.__valid // Returns true if all scheme props are defined
```