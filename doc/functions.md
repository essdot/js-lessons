# Functions

In Javascript, functions are objects:

```javascript
const myObj = {}
const myFunc = function myFunc () {}

myObj instanceof Object // => true
myFunc instanceof Object // => true
myFunc instanceof Function // => true
```

Unlike other JS objects, functions are callable:

```javascript
myFunc()
myObj() // => TypeError: object is not a function
```


## Arguments

Functions can accept any number of arguments, and be called with any number of arguments. It is not an error to call a function with a different number of arguments than the function declares. If you provide fewer arguments than the function declares, the unsupplied arguments will have a value of `undefined`. 

```javascript
function log3 (first, second, third) {
  console.log(first)
  console.log(second)
  console.log(third)
}

// logs 'a', undefined, undefined
log3('a')
```

Arguments in Javascript are always positional, there are no keyword args like in Python. (However, a similar effect could be achieved by having a function accept an "options" object whose properties are arguments.)

If a function is called with more arguments than it declares, the extra values will be available in the `arguments` object. `arguments` is an array-like object containing the arguments the function was called with, in order. 

You can make functions that accept any number of arguments by using the spread operator:

```javascript
function sum (...args) {
  let result = 0

  for(let i = 0; i < args.length; i++) {
    result += args[i]
  }

  return result
}

sum()                // returns 0
sum(2, 5)            // returns 7
sum(1, 1, 1, 1)      // returns 4
```

### Default arguments

As of ES6, functions can declare default arguments, so that the argument can have a value inside the function even if one is not passed in.

```javascript

function initConfig (configPath = '/some/path/to/config') {
  // ...
}

initConfig()                     // use default path value
initConfig('/some/other/path')   // override default

```


## Invocation

Functions can be called, or invoked, 4 ways:

1. As a function
2. As a method
3. With `call` or `apply`
4. With `new`

The main difference between the ways to call a function is the value of the `this` keyword inside the body of the function. `this` is sometimes called the "context" of the function. So if we say that we are calling a function in the context of a certain object, then inside the function `this` will refer to the object.


### Calling as a function

`func()`

When we call a function by itself, we may say that the function is "unbound" - it is not associated with any particular object.

When you call an unbound function, `this` is equal to the global object. (In a browser, it will be `window`. In node, it will be `global`.)

Except in strict mode -- in strict mode, `this` will be `undefined`. This feature of strict mode is an attempt to remedy one of JavaScript's worst design flaws.


### Calling as a method

`obj.method()`

If a function is a property of an object, we may say the function is a "method" of the object. When we call a function as a member of an object, we may say the function is "bound" to that object, and the function will execute in the context of that object. So, inside the function, `this` will refer to the object that the function is a property of.

The same function can be used as a method of an object, and as a plain function:

```javascript
const myObj = {}
const myFunc = function () {}

myObj.myMethod = myFunc
myObj.myMethod()         // inside myMethod, this will be myObj
myFunc()                 // inside myFunc, this will be the global object
```


### Calling with `call` or `apply`

```javascript
func.call(thisValue, arg1, arg2, arg3)
func.apply(thisValue, [arg1, arg2, arg3])
```

`call` and `apply` are functions that call a function with a given `this` value, plus arguments. They are methods of each function object, because they are members of `Function.prototype`.

`call` and `apply` do the same thing, the only difference is in how you provide the arguments. If you're using `apply`, the arguments are in an array, so `apply` accepts a total of 2 arguments. If you're using `call`, you pass the arguments directly, so `call` can take any number of arguments.

```javascript
function add3NumsToThis(a, b, c) {
  return this + a + b + c
}

add3NumsToThis.call(5, 1, 1, 1)       // returns 8
add3NumsToThis.apply(6, [1, 1, 1])    // returns 9

```

If you just have an array of values that you want to pass to a function that doesn't take its arguments as an array, use the spread operator:

```javascript

function interestingOperation (valueA, valueB, valueC) {
  return valueA + valueB + valueC
}

const myValues = [23, 56, 111]         // values from an API call, or something
interestingOperation(...myValues)

```

Before ES6, you'd have to use `apply` in this case, but the spread operator allows our code to be a little nicer and more expressive here.

### Calling with `new`

`new MyClass()`

`new` is an operator that takes a function as an operand. The `new` operator creates a new object and then invokes the function in the context of the new object. Functions that are intended to be called with `new` are called constructors, and by convention the function's name should begin with a capital letter.

```javascript
// constructor for Customer objects
function Customer(name) {
  this.name = name
}  
```

The reason for this convention is simple: If you accidentally call a constructor as a function, without `new`, `this` will refer to the global object, and the constructor will do the wrong thing. The capitalized name is a clue that the function is a constructor, intended to be called with `new`.

It is possible to check for this problem and correct it at runtime:

```javascript
// constructor for Customer objects
function Customer(name) {
  if(!(this instanceof Customer)) {
    
    // Constructor was called without new.
    // Call it again with new & pass the argument in
    return new Customer(name)
  }

  this.name = name
}  

Customer('Bob')
```

Here we check to see if `this` is what we are expecting -- an object whose constructor is the function we're currently in. If not, something has gone wrong, and we fix it by correctly calling the constructor with `new`.


## Bind

"Binding" a function means to associate that function with a particular object. After a function is bound to an object, calling the function will run the function in the context of that object. So, inside the function, `this` refers to the object the function is bound to.

Remember how functions are objects? Function-objects have a method called `bind`, which performs this operation. `bind` accepts a `thisValue` as an argument and returns a new function. This new function is the original function, but bound to the `this` value that was passed in. So when the new function is called, `this` will always refer to the `thisValue` passed to `bind`, no matter how the function is invoked.

```javascript
function myFunc () { return this.num }

// returns undefined
myFunc()

const myBoundFunc = myFunc.bind({num: 5})

// returns 5 - myBoundFunc is bound to
// the object that was passed to bind
myBoundFunc()

```


### Partial Application

`bind` can also be used to "partially apply" functions. This means that `bind` can pre-fill some of the function's arguments. When used this way, `bind` returns a new function that accepts the rest of the arguments. When the new function is called, the pre-filled arguments will be combined with the new function's arguments and they will all be passed to the original function.


```javascript
function add3Nums (a, b, c) {
  return a + b + c
}

// pre-filling in the first argument, a, with the value 0
const add2Nums = add3Nums.bind(null, 0)

// pre-filling in the first two arguments, 
// a with the value 0, and b with the value 7
const add7 = add3Nums.bind(null, 0, 7)

// returns 7
add2Nums(5, 2)

// returns 9
add7(2)

// returns 11
add7(4)
```

## "Fat arrow" syntax

The "fat arrow" (`=>`) syntax for defining functions was added in ES6. Using it is shorter than `function`, and mostly equivalent. However, when you declare a function in fat-arrow syntax, it is *lexically bound*. More on that in a moment. Also, functions declared with the arrow syntax are always anonymous.

Parentheses should surround the list of arguments for the function being defined, but if there is only one argument, you can omit the parentheses.

```javascript
const rakeLeaves = rake => {
  rake.pickUp()
  rake.use()
}
```

Curly braces should surround the lines of the function, but if there is only one line, you can omit the curly braces. If you omit the curly braces, the `return` keyword is implied, and the value of the statement will be returned.

```javascript
const addThree = (a, b, c) => a + b + c


// returns 11
addThree(2, 3, 6)
```

### Lexical binding

Fat arrow functions are *lexically bound*: when you declare a fat-arrow function, the value of `this` inside the fat-arrow function will be the same as the value of `this` when the function was defined.

The value of `this` inside a fat-arrow function cannot be changed by calling the fat-arrow function with `.call` or `.apply`.

```javascript
let obj1 = {num: 1}
let obj2 = {num: 2}

function outerFunc () {
  const innerArrowFunc = () => this.num

  return innerArrowFunc
}

let innerFunc1 = outerFunc.call(obj1)
let innerFunc2 = outerFunc.call(obj2)

// returns 1
innerFunc1()

// returns 2
innerFunc2()

// returns 2
innerFunc2.call(obj1)
```

Here, we call `outerFunc` in the context of each object, `obj1` and `obj2`. Each time `outerFunc` is called, `innerArrowFunc` gets re-defined and bound to the context of the `outerFunc`. So when the `innerArrowFunc` is called, it runs in the same context as `outerFunc` when it was defined.


## Function Names

Functions can have names, or they can be anonymous. 

```javascript
// function named myFunc, assigned to variable "x"
const x = function myFunc () {}

// true
x.name === 'myFunc'

// anonymous function, assigned to variable "y"
const y = function () {}    
```

When an exception is thrown inside a function, the function's name will appear in the stack trace. This is why you should get in the habit of naming your functions -- it makes it much easier to tell where problems are happening in your code.

Names are also needed for recursion; if you need to call a function inside its body it has to have a name.


## Function statements & expressions

JavaScript's grammar has two ways of defining functions: the function statement and the function expression. By the rules of JavaScript's syntax, if the first token in a statement is `function`, it is a function statement. Otherwise it is a function expression.

A function expression evaluates to the function. A function statement, on the other hand, does not. So function statements cannot be directly invoked.

This means that the following results in a syntax error:

```javascript
function myFunc () {} ()
```

The solution is to put anything before `function`, so that the first token is not `function`. Then the function statement becomes a function expression, which can be invoked directly. A set of parentheses around the function is commonly used.

```javascript
// all valid
(function myFunc () {})()
```

This is sometimes called an "IIFE", immediately-invoked function expression.


### Function statements

A function statement does two things: it creates a named function, and declares a variable whose value is the function. Because of this variable declaration, anonymous functions are not allowed in function statements.

```javascript
function myFunc () {}
```

does this:

```javascript
var myFunc 
myFunc = function myFunc () {}
```

## Inner functions

In JavaScript, functions can be declared inside of other functions.

```javascript
function outerFunc () {
  let x = 5

  function innerFunc () {
    //... do something
  }

  innerFunc()
}
```

## Closures

In JavaScript, a function has access to everything in the scope in which it was created. Even after the outer function has finished running, the inner function can still access the variables in its enclosing scope. This is very powerful, and has many uses. For example, it is the only way to have truly private variables in JavaScript.

```javascript
function outerFunc () {
  var x = 5

  function innerFunc () {
    x++
    console.log(x)
  }

  return innerFunc
}


// when called, outerFunc() returns its innerFunc()
var inner = outerFunc()

// logs 6
inner()

// logs 7
inner()
```

In the above example, `innerFunc` can see `x` and alter it, but outside code cannot.

When a function is declared inside another function, the inner function is said to "close over" the scope of the outer function. This means that any variables in the outer scope, which are not re-declared in the inner scope, are available while the inner function runs.

However, any variable declared in the inner scope with the same name as a variable in the outer scope, will "shadow" the outer variable. The outer variable will not be available in the inner function.


```javascript
function outerFunc () {
  let x = 5

  function innerFunc () {
    let x = 0

    return x
  }

  return innerFunc
}


// when called, outerFunc() returns its innerFunc()
const inner = outerFunc()

// returns 0
inner()
```

The same would be true if `x` was a parameter to `innerFunc` rather than declared within the body of `innerFunc`:


```javascript
function outerFunc () {
  let x = 5

  function innerFunc (x) {
    console.log(x)
  }

  return innerFunc
}


// when called, outerFunc() returns its innerFunc()
const inner = outerFunc()

// logs undefined
inner()

// logs 5
inner(5)
```

## Pass by reference & pass by value

Primitive values are passed to functions by value. Objects are passed to functions by reference. This means that, when a primitive value is passed to a function as an argument, the value is copied and the function receives the copy. When you call a function and pass it a primitive value, that value will be the same after the function returns.

```javascript
function changeIt (arg) {
  arg = 27
}

let x = 23

changeIt(x)

// logs 23
console.log(x)
```

However, if an object is passed into a function, the object is not copied. Instead, the function receives a copy of the *reference* to the object.

The function will be able to mutate the object: properties of the object can be deleted, or replaced, or new properties added to the object (unless the object is sealed or frozen). After the function returns, those changes will still be there:

```javascript
function changeIt(o) {
  o.num = 11
  delete o.str
  o.newThing = {}
}

var o = {str: 'hi', num: 4}

changeIt(o)

// o.num has now changed to 11, o.str has been
// deleted, and o.newThing has been added

```

But the object itself cannot be replaced inside the function:

```javascript
function replaceIt (o) {
  const myNewObj = {
    a: [1, 2, 3],
    func: function () {}
  }

  o = myNewObj
}

let o = {}

replaceIt(o)

// o is still an object with no properties.
// It has not been replaced.
```

The line `o = myNewObj` simply *rebinds* the variable `o` in the body of `replaceIt` to a new value: the reference to `myNewObj`. It is not altering the reference to the object that was passed in to `replaceIt`. After `replaceIt` has finished running, `o` still refers to the same object as before `replaceIt` was called.