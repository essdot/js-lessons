# Types

JavaScript (as of ES6) has the following types:

1. string
2. number
3. boolean
4. undefined
5. null
6. symbol
7. object

**THAT'S IT.**  
The first six are primitives, they are passed by value. When you use them with the triple-equals operator, their values are compared. 

There is only one value of type undefined. There is only one value of type null.

Objects are passed by reference. When you compare them with the triple-equals operator, their identities are compared. That means the triple-equals operator will only return `true` if both operands are the same exact object. So, `{} === {}` is false. The equality fails because they are two distinct objects.

"But wait, what about arrays?"  
Arrays are objects.

"Well what about functions?"  
Functions are objects too!

"But `typeof function() {}` returns 'function'."  
Yes, that is true. Let's talk about `typeof`.

## The `typeof` Operator

The `typeof` operator is poorly named: it does not tell you the type of
its operand. At least, not always. `typeof` can still be useful, but you should be aware that it can lie to you.

```javascript
typeof null      // returns 'object'
```

See? The type of `null` is null. Not object.

OK, so if `typeof` isn't intended to reliably tell us the actual type of its operand, what *does* it do? As per the ECMAScript spec, `typeof` looks at the type of the operand, and then returns a string according to some rules.

The rules are as follows -- you might not agree with them! In fact you might think some of them are silly.

1. If the operand's type is undefined, return 'undefined'.
2. If the operand's type is boolean, return 'boolean'.
3. If the operand's type is string, return 'string'.
4. If the operand's type is number, return 'number'.
5. If the operand's type is symbol, return 'symbol'.

   Good so far, right? Strap in, here we go.

6. If the operand's type is null, return 'object'. (What????)
7. If the operand's type is object, and the operand can be called, return 'function'. (Functions are just objects that can be called/invoked. But 'function' is not a type.)
7. If the operand is a built-in object (native to the JS engine), and it can't be called, return 'object'.
9. If the operand is an object which is not built-in, and it can't be called, return anything except 'undefined', 'boolean', 'function', 'number', 'symbol' or 'string'. (This is meant to be implementation-specific, but as far as I am aware all implementations return 'object'.)

*(You can see the full definition of `typeof` in [the ECMAScript 6 spec, section 12.5.6.](http://www.ecma-international.org/ecma-262/6.0/#sec-typeof-operator))*

The point here isn't that `typeof` sucks. (It does kinda suck, though.) The point is just that it can lead you astray when trying to understand JS types. As an exercise, you could try writing a small library for determining the types of values. Try including functions that check whether something is an array, or a function, or `NaN`.


## Objects

All objects descend from `Object.prototype`. The prototype of `Object.prototype` is `null`. You can get an object's prototype by calling the `Object.getPrototypeOf(obj)`.

Objects' properties can be read and set with dot notation or bracket notation.

```javascript
var myObj = {}
myObj.foo = 5
myObj['foo']   // returns 5
```

Objects' keys are always strings. If you put a value in the brackets that is not a string, the value will be coerced into a string, and that will be used as the key.

```javascript
myObj[{}] = 'hello'
```

Here, the `{}` represents a new, empty object. To turn it into a string, its `toString()`method is called, which returns '[object Object]'. So this will set the property of `myObj` called "[object Object]" to the string 'hello'.

```javascript
var name_of_key = ({}).toString()      // '[object Object]'
myObj[name_of_key] === 'hello'         // returns true
```

Other values like numbers are coerced into strings too.

### Arrays

Arrays are objects. Their constructor is `Array`. Their prototype is `Array.prototype`. There are some slight differences between arrays and other objects, which JS provides to make arrays easier to work with. But it's important to understand that arrays are really just objects.

When you get or set an element of an array, you are doing the same thing as getting/setting a property of any object. The difference is that the `length`property of arrays updates automatically.

```javascript
var arr = ['a', 'b', 'c']
arr.length                    // returns 3
arr.myProperty = 62
arr[5] = 'z'                  // changes length of the array to 6
arr['5']                      // returns 'z'
arr.length                    // returns 6
arr[2]                        // returns undefined
arr[3]                        // returns undefined
arr.length = 0                // clears out the array
arr.toString()                // returns ''
arr[0]                        // returns undefined
arr['myProperty']             // still 62
```

Remember, arrays are just objects, so their keys are strings. Any time you use a numeric index on an array, it is coerced to a string.

The Array prototype defines some useful methods like `indexOf`, which come in handy. But there's really not much special going on here. You can setup a prototype with a bunch of useful methods and create objects from it too, if you want. On the other hand, you can't replicate the magic behavior of the array's `length` property.

Remember: arrays are (mostly) just objects.


### Functions

Functions are objects. Their constructor is `Function`. Their prototype is `Function.prototype`. But functions have a very special attribute that other objects do not: they can be called. In the ECMAScript spec, they are said to be "Callable".

```javascript
var myFunc = function() {}
var myObj = {}
myFunc()
myObj()    // TypeError: object is not a function
```

Syntactically, you can call a function in two ways: using the function call operator, the two parentheses, or by using `new`.

Functions have a `length` property. It represents the number of arguments the function defines.

As I mentioned, functions are objects. You can set properties on them just like other objects.

```javascript
var myFunc = function() {}
myFunc.foo = 5
myFunc['foo']   // returns 5
```

## Numbers

There is only one number type in JavaScript. Many other languages distinguish between decimal numbers and integers. Many other languages offer different levels of precision for floats and integers, or unsigned types. But JavaScript just has the Number type. 

The number type represents the set of possible number values, plus some special values: `NaN`, `Infinity`, and `-Infinity`. Any arithmetic operation that attempts to use a non-number value which can't be coerced into a number will result in `NaN`.

There are no `int`-type whole numbers in JavaScript. But if you want to ensure that you have a whole number value, you can use `Math.floor` and `Math.ceil`. `Math.floor` will round down to the next lowest integer, and `Math.ceil` will round up to the next highest integer.


### NaN (Not a Number)

`NaN` is a value. Its type is number. `NaN` is the only value in JavaScript that is not equal to itself. `NaN === NaN` is false.

`NaN` is the value that results when you try to perform a mathematical operation that is invalid, like subtracting a string from a number or dividing a number by an object. (However, either of those will succeed if the non-number value can be coerced to a number before the arithmetic is performed!)

Be careful with the built-in `isNaN()` function. Its job is to tell you whether the value you pass to it *would coerce to NaN*. This is different from telling you whether the value *is the value NaN*. 

```javascript
isNaN(NaN)            // returns true
isNaN('abc')          // returns true
isNaN(undefined)      // returns true
isNaN(null)           // returns false
```

If you need to explicitly check whether a value is `NaN`, check if it is not-equal to itself. Or, in ES6, you can compare the value to `NaN` with `Object.is`.


### Infinity

`Infinity` is a special number value that represents the positive value infinity. If you add values to it, divide it, etc, the result will be `Infinity`. There is also a `-Infinity` value, which represents the value of negative infinity, and acts similarly. `Infinity` and `-Infinity` can occur in cases of overflow.

`Infinity` and `-Infinity` may not behave as you expect in some cases.

```javascript
var inf = Infinity
var negInf = -Infinity

inf / 2                   // returns Infinity
inf + 1                   // returns Infinity
inf / inf                 // returns NaN

negInf + 5                // returns -Infinity
negInf / negInf           // returns NaN

inf / negInf              // returns NaN
inf - negInf              // returns Infinity
inf + negInf              // returns NaN
inf * negInf              // returns -Infinity

Number.MAX_VALUE          // returns 1.7976931348623157e+308
Number.MAX_VALUE * 2      // returns Infinity

```


## Type Coercion

Type coercion is the process of converting a value from one type to another type, so that the converted value can be used in some particular way. For example, if you try to subtract a string from a number, the string must be coerced into a number before the subtraction can be performed. If the string cannot be coerced into a number, it will be coerced into `NaN`, and the result of the subtraction will be `NaN`.


### Coercing to boolean

The following will coerce to `false`:

* `undefined`
* `null`
* ''
* 0
* `NaN`

Because these values will coerce to `false`, they are said to be "falsey". Everything else will coerce to `true`, and is said to be "truthy".

```javascript
if(someValue) {
  // This code will run if someValue is truthy
} else {
  // This code will run if someValue is falsey
}
```

To coerce a value to a boolean, call the `Boolean` constructor as a function, or prefix with `!!`.

```javascript
Boolean({})        // returns true
!!{}               // returns true
!!''               // returns false
```

### Coercing to number

* `null` will coerce to 0
* `false` will coerce to 0.
* `true` will coerce to 1.
* If a string can be parsed as a number, it will coerce to that number's value.
* If an object's `valueOf()` results in a number, or its `toString()` results in a string that can be parsed as a number, the object will coerce to that number. This includes arrays.

Everything else coerces to `NaN`.

To coerce a value to a number, call the `Number` constructor as a function, or subtract 0.

```javascript
Number('5')          // returns 5
Number('abc')        // returns NaN
'5' - 0              // returns 5
```

To parse a string into a number, use `parseInt` or `parseFloat`. Remember that JavaScript only has one number type -- the names of these two built-in functions refer to the argument passed to each function, not the return values. If the numeric string you're passing has a decimal point, use `parseFloat`, otherwise use `parseInt`. If the string cannot be parsed into a number value, `parseInt` and `parseFloat` return `NaN`.

`parseFloat` takes only one parameter, the string to be parsed. `parseInt` takes an optional radix parameter, because it can parse integers in any base from 2 (binary) to 36. This includes binary, octal, and decimal and hexidecimal representations. You should always supply this parameter to avoid any ambiguity in the parsing.

```javascript
parseInt('a', 16)              // returns 10
parseInt('a', 10)              // returns NaN

parseInt('9', 10)              // returns 9
parseInt('9', 8)               // returns NaN
```

### Coercing to string

* undefined coerces to 'undefined'
* null coerces to 'null'
* `true` coerces to 'true'
* `false` coerces to 'false'
* numbers coerce to a string representation of the number (this includes `Infinity` and `NaN`)
* Objects coerce to the result of calling `toString()`, or failing that, the result of calling `valueOf()`.

To coerce a value to a string, call the `String` constructor as a function, or add ''. If the value is an object, you can call its `toString()` method.

```javascript
String(6)                 // returns '6'
6 + ''                    // returns '6'

String([1, 2, 3])         // returns '1,2,3'
[1, 2, 3].toString()      // returns '1,2,3'
```

### Coercing objects to primitive types

JavaScript uses an object's `toString()` and `valueOf()` methods to coerce to primitive values. Since `Object.prototype` defines a `toString()` method, almost every object should have a `toString()` method. Objects created with the `Number` and `Boolean` constructors will have `valueOf()` methods. However, keep in mind that you can define these methods yourself on any object you like, and JS will use them during coercion.

When JS is attempting to coerce an object to a number or boolean value, the result of the `valueOf()` method will be preferred. If `valueOf()` is not present, `toString()` will be called, and its value will then be coerced into the number or boolean.

When JS is attempting to coerce an object to a string, the result of `toString()` will be preferred. If `toString()` is not present, the result of `valueOf()` will be coerced into a string.

If the object has neither `toString()` nor `valueOf()`, the coercion will fail and a TypeError will be thrown.


## Number() and String() constructors

`Number` and `String` are constructors. When you call them with `new`, they create `Number` or `String` objects.

These are object representations of primitive values -- they are *objects*, not primitive values. Howevever, they do contain an internal property that represents their primitive value. The `valueOf` method can be called to get that value. `valueOf` will also be used to coerce the object to its primitive value.

```javascript
var numObj = new Number(5)
var strObj = new String('abc')

numObj instanceof Number              // returns true
numObj instanceof Object              // returns true
strObj instanceof String              // returns true
strObj instanceof Object              // returns true

numObj.valueOf()                      // returns 5
numObj === 5                          // returns false - comparing identity
numObj == 5                           // returns true:
                                      // numObj is coerced to number value & compared with 5
```

However, you can also call `Number` and `String` as regular functions. When you call them this way, they will coerce the argument to either a number or string primitive value, and return the coerced value.

```javascript
Number('5')                       // returns 5
Number(5)                         // returns 5
Number('abc')                     // returns NaN

String(5)                         // returns '5'
String('abc')                     // returns 'abc'
String(NaN)                       // returns 'NaN'
```

## Symbols

Symbols were added in ES6, and they are another primitive type. The only non-primitive type is `object`. Symbols are immutable, like strings, but they are all not equivalent to each other, like objects.

Symbols can be used as object property keys. Normally, a value used as a property key would be coerced to a string before retrieving or setting that property of the object.

But when you use a symbol as the key for a property of an object, that property can only be retrieved by using the same symbol again. Properties of an object that use symbols as their key will not be iterated over by `Object.keys`. Instead, the new `Object.getOwnPropertySymbols` function can get a list of symbols used as property keys for an object.


```javascript
const myObj = {}
const mySymbol = Symbol('cool')

// logs []
console.log(Object.keys(myObj))

myObj[mySymbol] = 'sup'

// still logs []
console.log(Object.keys(myObj))

// logs 'sup'
console.log(myObj[mySymbol])

// logs [Symbol(cool)]
console.log(Object.getOwnPropertySymbols(myObj))
```

If you need to convert a symbol to some other type, you should do it directly instead of trying to coerce it. Coercing symbols to other primitive types might cause a `TypeError`. To convert a symbol to a string, for example, pass it to the `String` function instead of trying to concatenate it to a string with the `+` operator.


## Symbol() function

The `Symbol` function can create new symbol values. It is not a constructor and should not be called with `new`. Each time `Symbol` is called, it creates a new value, so calling it twice with the same argument will result in two symbol values which are not equivalent.
