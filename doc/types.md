# Types

Javascript has the following types:

1. string
2. number
3. boolean
4. undefined
5. null
6. object


**THAT'S IT.**  
The first five are primitives, they are passed by value. When you use them with the triple-equals operator, their values are compared. 

There is only one value of type undefined. There is only one value of type null.

Objects are passed by reference. When you use them with the triple-equals operator, their identities are compared. That means the triple-equals operator will only return `true` if both operands are the same object. That means that `{} === {}` will return `false`. The equality fails because even though they're really the same, they're two distinct objects.

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
typeof null    // returns 'object'
```

See? The type of `null` is null. Not object.

OK, so if `typeof` isn't intended to reliably tell us the actual type of its operand, what *does* it do? As per the ECMAScript spec, `typeof` looks at the type of the operand, and then returns a string according to some rules.

The rules are as follows -- you might not agree with them! In fact you might think some of them are silly.

1. If the operand's type is undefined, return 'undefined'.
2. If the operand's type is string, return 'string'.
3. If the operand's type is boolean, return 'boolean'.

Good so far, right? Strap in, here we go.

4. If the operand's type is null, return 'object'. (What????)
5. If the operand's type is object, and the operand can be called, return 'function'. (Functions are just objects that can be called. But 'function' is not a type.)
6. If the operand is a built-in (native) object, and it can't be called, return 'object'.
7. If the operand is an object which is not built-in, and it can't be called, return anything except 'undefined', 'boolean', 'number', and 'string'. (This is meant to be implementation-specific, but as far as I am aware all implementations return 'object'.)

*(You can see the full definition of `typeof` in [the ECMAScript 5 spec, section 11.4.3.](http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.3))*

The point here isn't that `typeof` sucks. (It does kinda suck, though.) The point is just that it can lead you astray when trying to understand JS types.


## Objects

All objects descend from `Object.prototype`. The prototype of `Object.prototype` is `null`. You can get an object's prototype by using the built-in function `Object.getPrototypeOf()`.

Objects' properties can be read and set with dot notation or bracket notation.

`var myObj = {}`
`myObj.foo = 5`
`myObj['foo']   // returns 5`

If you put something in the brackets that is not a string, it will be coerced into a string, and that will be used as the key.

`myObj[{}] = 'hello'`

The `{}` represents a new, empty object. To turn it into a string, its `toString()`method is called, which returns '[object Object]'. So this will set the property of `myObj` called "[object Object]" to the string 'hello'.

`var name_of_key = '[object Object]'`
`myObj[name_of_key] === 'hello'    // returns true`


## Arrays

Arrays are objects. Their constructor is `Array`. Their prototype is `Array.prototype`. There are some slight differences between arrays and other objects, to make it easier to work with them, but it's important to understand that arrays are really just objects.

When you get or set an element of an array, you are doing the same thing as getting/setting a property of an object. The difference is that with an array, if you do things with properties whose keys are numbers, the `length` property will update itself, and vice versa.

`var arr = ['a', 'b', 'c']`
`arr.length                    // returns 3`
`arr['myProperty'] = 62`
`arr[5] = 'z'                  // changes length of the array to 6`
`arr.length                    // returns 6`
`arr[2]                        // returns undefined`
`arr[3]                        // returns undefined`
`arr.length = 0                // clears out the array`
`arr.toString()                // returns ''`
`arr[0]                        // returns undefined`
`arr['myProperty']             // still 62`

The array prototype defines a bunch of useful methods like `indexOf`, and they are wonderful. But there's really not much special going on here. You can setup a prototype with a bunch of useful methods and create objects from it too. Remember: arrays are just objects.


## Functions

Functions are objects. Their constructor is `Function`. Their prototype is `Function.prototype`. But functions have a very special attribute that other objects do not: they can be called. In the ECMAScript spec, they are said to be "Callable".

```javascript
var myFunc = function() {}
var myObj = {}
myFunc()
myObj()    // TypeError: object is not a function
```

You can call a function by using the function-call operator, the two parentheses, as above. You can also use `call` or `apply`. You can also use `new`.

Functions have a `length` property too. It represents the number of arguments the function accepts.

But again, functions are objects. You can set properties on them just like other objects.

```javascript
var myFunc = function() {}
myFunc.foo = 5
myFunc['foo']   // returns 5
```


## Numbers

There is only one number type in Javascript. Many other languages distinguish between decimal numbers and integers. Many other languages offer different levels of precision for floats and integers, or unsigned types. But Javascript just has the number type.

When dealing with numbers in Javascript, you need to watch out for `NaN` and `Infinity`. 

```javascript
1 / 0         // returns Infinity
-1 / 0        // returns -Infinity
0 / 0         // returns NaN
5 - 'abc'     // returns NaN
```

Any arithmetic operation that attempts to use a non-number value which can't be coerced into a number will result in `NaN`.


## NaN

`NaN` is a value. Its type is number. `NaN` is the only value in Javascript that is not equal to itself. `NaN === NaN` is false.

Be careful with the built-in `isNaN()` function. Its job is to tell you whether the value *would coerce to NaN*. This is different from telling you whether the value *is NaN*. 

```javascript
isNaN(NaN)            // returns true
isNaN('abc')          // returns true
isNaN(undefined)      // returns true
```

If you need to explicitly check whether a value is `NaN`, check if it is not-equal to itself.


## Type Coercion

Type coercion is the process of converting a value from one type to another type, so that the converted value can be used in some particular way. For example, if you try to subtract a string from a number, the string must be coerced into a number before the subtraction can be performed. If the string cannot be coerced into a number, it will be coerced into `NaN`, and the result of the subtraction will be `NaN`.

JS type coercion is a bit crazy. There's a lot to it, and it often bites JS programmers, experts included.


### Boolean

The following will coerce to false:

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

### Number

* `null` will coerce to 0
* `false` will coerce to 0.
* `true` will coerce to 1.
* If a string can be parsed as a number, it will coerce to that number's value.
* If an object's `toString()` results in a string that can be parsed as a number, the object will coerce to that number. This includes arrays.

Everything else coerces to `NaN`.

To coerce a value to a number, call the `Number` constructor as a function, or subtract 0.

```javascript
Number('5')          // returns 5
Number('abc')        // returns NaN
'5' - 0              // returns 5
```

### String

* undefined coerces to 'undefined'
* null coerces to 'null'
* `true` coerces to 'true'
* `false` coerces to 'false'
* numbers coerce to a string representation of the number (this includes Infinity and NaN)
* Objects coerce to the result of calling `toString()`. `Array.prototype.toString()` returns the elements of the array separated by commas.

To coerce a value to a string, call the `String` constructor as a function, or add ''. If the value is an object, you can call its `toString()` method.

```javascript
String(6)         // returns '6'
6 + ''            // returns '6'
String([1, 2, 3]) // returns '1,2,3'
```


## Number() and String() constructors

`Number` and `String` are constructors. When you call them with `new`, they create `Number` or `String` objects.

These objects are object representations of primitive values -- they are *objects*, not primitive values. Howevever, they do contain an internal property that represents their primitive value. The `valueOf` method can be called to get that value. `valueOf` will also be used to coerce the object to its primitive value.

```javascript
var numObj = new Number(5)
var strObj = new String('abc')


// returns true
numObj instanceof Number

// returns true
numObj instanceof Object

// returns true
strObj instanceof String

// returns true
strObj instanceof Object


// returns 5
numObj.valueOf()

// returns false - comparing identity
numObj === 5

// returns true - numObj is coerced to number primitive value & compared with 5
numObj == 5

```

However, you can also call `Number` and `String` as regular functions. When you call them this way, they will coerce the argument to either a number or string primitive value, and return the coerced value.

```javascript

// returns 5
Number('5')

// returns 5
Number(5)

// returns NaN
Number('abc')

// returns '5'
String(5)

// returns 'abc'
String('abc')

// returns 'NaN'
String(NaN)
```
