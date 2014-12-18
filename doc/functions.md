# Functions

In Javascript, functions are objects:

```javascript
var myObj = {}
var myFunc = function myFunc() {}

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
function log3(first, second, third) {
  console.log(first)
  console.log(second)
  console.log(third)
}

// logs 'a', undefined, undefined
log3('a')
```

Arguments in Javascript are always positional, there are no keyword args like in Python. (However, a similar effect could be achieved by having a function accept an "options" object whose properties are arguments.)

If a function is called with more arguments than it declares, the extra values will be available in the `arguments` object. `arguments` is an array-like object containing the arguments the function was called with, in order. This allows you to write functions that can accept any number of arguments:

```javascript
function sum() {
  var result = 0

  for(var i = 0; i < arguments.length; i++) {
    result += arguments[i]
  }

  return result
}

// returns 5
sum(2, 5)

// returns 4
sum(1, 1, 1, 1)
```

Use `arguments` in a read-only way, do not try to manipulate its contents. If you need to do that sort of thing, make a copy of it first. But since `arguments` is  not really an array, you have to get a little creative:

```javascript
var argsCopy = [].slice.call(arguments)
```


## Invocation

Functions can be called, or invoked, 4 ways:

1. As a function
2. As a method
3. With `call` or `apply`
4. With `new`

The main difference between the ways to call a function is the value of the `this` keyword inside the body of the function. `this` is sometimes called the "context" of the function. So if we say that we are calling a function in the context of a certain object, then inside the function `this` will refer to the object.


### Calling as a function

When we call a function by itself, we may say that the function is "unbound" - it is not associated with any particular object.

When you call an unbound function, `this` is equal to the global object. (In a browser, it will be `window`. In node, it will be `global`.)

Except in strict mode -- in strict mode, `this` will be `undefined`. This feature of strict mode is an attempt to remedy one of JavaScript's worst design flaws.


### Calling as a method

If a function is a property of an object, we may say the function is a "method" of the object. When we call a function as a member of an object, we may say the function is "bound" to that object, and the function will execute in the context of that object. So, inside the function, `this` will refer to the object that the function is a property of.

The same function can be used as a method of an object, and as a plain function:

```javascript
var myObj = {}
var myFunc = function () {
var myObj.myMethod = myFunc
myObj.myMethod()         // inside myMethod, this will be myObj
myFunc()                 // inside myFunc, this will be the global object
```


### Calling with `call` or `apply`

`call` and `apply` are functions that call a function with a given `this` value, plus arguments.

`call` and `apply` are much the same, the only difference is in how you provide the arguments. If you're using `apply`, the arguments are in an array. If you're using `call`, you pass the arguments directly.

Using `call` looks like this: 
```javascript
myFunction.call(thisValue, arg1, arg2, arg3...)
```

Using `apply` looks like this: 
```javascript
myFunction.apply(thisValue, [argumentsArray])
```

```javascript
function add3NumsToThis(a, b, c) {
  return this + a + b + c
}

add3NumsToThis.call(5, 1, 1, 1)       // returns 8
add3NumsToThis.apply(6, [1, 1, 1])    // returns 9

```


### Calling with `new`

`new` is an operator that takes a function as an operand. It creates an object and then invokes the function in the context of the newly-created object. Functions that are intended to be called with `new` are called constructors, and by convention the function's name should be capitalized.

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

"Binding" a function means to associate that function with a particular object. After a function is bound to an object, calling the function will run the function in the context of that object. So, inside the function, `this` refers to the object to which the function is bound.

Functions have a method called `bind`, which performs this operation. `bind` accepts a `this` value as an argument and returns a new function. This new function is the original function, but bound to the `this` value that was passed in. So when this new function is called, `this` will always refer to the `this` value passed to `bind`, no matter how the function is invoked.

```javascript
function myFunc() { return this.num }

// returns undefined
myFunc()

var myBoundFunc = myFunc.bind({num: 5})

// returns 5 - myBoundFunc is bound to
// the object that was passed to bind
myBoundFunc()

```


### Partial Application

`bind` can also be used to "partially apply" functions. This means that `bind` can pre-fill some of the function's arguments. When the new function is called, the pre-filled arguments will be combined with the current arguments and they will all be passed to the original function. 


```javascript
function add3Nums(a, b, c) {
  return a + b + c
}

// pre-filling in the first argument, a, with the value 0
var add2Nums = add3Nums.bind(null, 0)

// pre-filling in the first two arguments, 
// a with the value 0, and b with the value 7
var add7 = add3Nums.bind(null, 0, 7)

// returns 7
add2Nums(5, 2)

// returns 9
add7(2)

// returns 11
add7(4)
```

## Function Names

Functions can have names, or they can be anonymous. 

```javascript
// function named myFunc, assigned to variable "x"
var x = function myFunc() {}

// true
x.name === 'myFunc'

// anonymous function, assigned to variable "y"
var y = function() {}    
```

When an exception is thrown inside a function, the function's name will appear in the stack trace. This is why you should get in the habit of naming your functions -- it makes it much easier to tell where the problem is.

Names are also needed for recursion. If you need to call your function from within itself, you should name it.


## Function statements & expressions

Syntactically, Javascript has two ways of expressing functions: the function statement and the function expression. By the rules of Javascript parsing, if the first token in a statement is `function`, it is a function statement. Otherwise it is a function expression.

A function expression evaluates to the function. A function statement, on the other hand, does not. So function statements cannot be directly invoked.

This means that the following results in a syntax error:

```javascript
function myFunc() {}()
```

The solution is to put anything before `function`, so that the function statement becomes a function expression, which can be invoked directly.

```javascript
// all valid
(function myFunc() {})()
+function myFunc() {} ()
-function myFunc() {} ()
!function myFunc() {} ()
```


### Function statements

A function statement does two things: it creates a named function, and declares a variable whose value is the function. Because of this variable declaration, anonymous functions are not allowed in function statements.

```javascript
function myFunc() {}
```

does this:

```javascript
var myFunc 
myFunc = function myFunc() {}
```

## Inner functions

In Javascript, functions can be declared inside of other functions.

```javascript
function outerFunc() {
  var x = 5

  function innerFunc() {
    //... do something
  }

  innerFunc()
}
```

## Closures

In Javascript, a function has access to everything in the scope in which it was created. Even after the outer function has finished running, the inner function can still access the variables in its enclosing scope. This is very powerful, and has many uses. It is also the only way to have truly private variables in Javascript.


```javascript
function outerFunc() {
  var x = 5

  function innerFunc() {
    x++
    console.log(x)
  }

  return innerFunc
}


// when called, outerFunc() returns its innerFunc()
var inner = outerFunc()

// logs 6
innerFunc()

// logs 7
innerFunc()
```

In the above example, `innerFunc` can see `x` and alter it, but outside code cannot.

When a function is declared inside another function, the inner function is said to "close over" the scope of the outer function. This means that any variables in the outer scope, which are not re-declared in the inner scope, are available.

However, any variable with a name that matches the name of a variable in the outer scope, will "shadow" the outer variable. The outer variable will not be available in the inner function.



```javascript
function outerFunc() {
  var x = 5

  function innerFunc() {
    var x = 0
    console.log(x)
  }

  return innerFunc
}


// when called, outerFunc() returns its innerFunc()
var inner = outerFunc()

// logs 0
innerFunc()

// logs 0
innerFunc()
```

The same would be true if `x` was a parameter to `innerFunc` rather than declared within the body of `innerFunc`:


```javascript
function outerFunc() {
  var x = 5

  function innerFunc(x) {
    console.log(x)
  }

  return innerFunc
}


// when called, outerFunc() returns its innerFunc()
var inner = outerFunc()

// logs undefined
innerFunc()

// logs undefined
innerFunc()
```


## Pass by reference & pass by value

Primitive values are passed to functions by value. Objects are passed to functions by reference. This means that, for primitive values, the value is copied and the function receives the copy. No matter what happens inside the function, the value will be the same after the function returns, because it got a copy of the value.

```javascript
function logIt(arg)
  console.log(arg)

  arg[1] = 'z'
}

var x = 'hi'

// logs 'hi'
logIt(x)

// logs 'hi' again.
// x has not changed
console.log(x)

```

If an object is passed into a function, it is not copied. The function receives a reference to the object. However, the reference itself cannot be altered. This is important! 

The state inside the object can be mutated: properties of the object can be deleted, or replaced, or new properties added to the object. After the function returns, those changes will still be there:

```javascript
function changeIt(o) {
  o.num = 11
  delete o.str
  o.newThing = {}
}

var o = {str: 'hi', num: 4}

changeIt(o)

// o.num has now changed, o.str has been deleted,
// and o.newThing has been added

```

But the object itself cannot be replaced inside the function:

```javascript
function replaceIt(o) {
  var myNewObj = {
    a: [1, 2, 3],
    func: function() {}
  }

  o = newObj
}

var o = {}

replaceIt(o)

// o is still an object with no properties.
// It has not been replaced.
```

The line `o = newObj` simply *rebinds* the variable `o` to a new value, the value of `newObj`. It is not replacing the reference to the object that was passed in to `replaceIt`.

