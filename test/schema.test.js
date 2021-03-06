const expect = require('chai').expect;

const Schema = require('../').Schema;
const Types = require('../').Types;

describe('Schema', () => {
    const TestSchema = Schema({
        _number: Types.Number,
        _string: Types.String,
        _date: Types.Date,
        _array: Types.Array,
        _null: Types.Null,
        _notNull: Types.NotNull,
        _any: Types.Any,

        _number_string: [Types.Number, Types.String]
    });

    const test = TestSchema({});

    it('should throw when trying to assign wrong types', () => {
        expect(()=>test._number = null).to.throw(TypeError);
        expect(()=>test._number = '').to.throw(TypeError);
    });

    it('should not throw when trying to assign right types', () => {
        expect(()=>test._number = 1).to.not.throw(TypeError);
        expect(()=>test._string = '').to.not.throw(TypeError);
    });

    it('should not throw when trying to assign to `any` type', () => {
        expect(()=>test._any = 1).to.not.throw(TypeError);
        expect(()=>test._any = null).to.not.throw(TypeError);
        expect(()=>test._any = 'fafafaf').to.not.throw(TypeError);
    });

    it('should properly set props', () => {
        test._number = 1337;
        expect(test._number).eql(1337);
        test._any = 1337;
        expect(test._any).eql(1337);
    });

    it('should properly handle NotNull type', () => {
        expect(()=>test._notNull = null).to.throw(TypeError);
        expect(()=>test._notNull = '').to.not.throw(TypeError);
    });

    it('should work with multiple types', () => {
        expect(()=>test._number_string = null).to.throw(TypeError);
        expect(()=>test._number_string = '').to.not.throw(TypeError);
        expect(()=>test._number_string = 1).to.not.throw(TypeError);
    });

    it('should validate object', () => {
        const obj1 = TestSchema({});
        expect(obj1.__valid).eql(false);

        const obj2 = TestSchema({
            _number: 1,
            _string: '',
            _date: new Date,
            _array: [],
            _null: null,
            _notNull: 2,
            _any: {},

            _number_string: ''
        });
        expect(obj2.__valid).eql(true);
    });

    it('should work properly with schemas in schema', () => {
        const b = Schema({
            _: Types.NotNull
        });
        const c = Schema({
            _: Types.NotNull
        });

        const b_instance = b({_: 1});
        const c_instance = c({_: 1});

        const a = Schema({
            obj: b.__schemaType
        });

        expect(() => a({obj: b_instance})).to.not.throw(Error);
        expect(() => a({obj: a_instance})).to.throw(Error);
    });

    it('fix for falsish return value for set trap', () => {
        const b = Schema({
            _: Types.String
        });

        const b_instance = b();

        expect(() => b_instance._ = '').to.not.throw(Error);
    });

    it('bool test', () => {
        const b = Schema({
            _: Types.Bool
        });

        const b_instance = b();

        expect(() => b_instance._ = null).to.throw(Error);
        expect(() => b_instance._ = true).to.not.throw(Error);
    });

    it('json', () => {
        const obj = {
            _number: 1,
            _string: '1',
            _date: new Date,
            _array: [],
            _null: null,
            _notNull: true,
            _any: false,

            _number_string: 'ass we can'         
        };
        const test = TestSchema(obj);

        expect(JSON.stringify(test)).to.equal(JSON.stringify(obj));
    });

    it('updated schema-in-schema', () => {
        const A = Schema();
        const B = Schema({a: A});
        const a = A();
        expect(() => B({a})).to.not.throw(Error);
    });
});