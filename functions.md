# Functions

In Javascript, functions are objects. Unlike other JS objects, they are callable. 


## Arguments

Functions can accept any number of arguments, and be called with any number of arguments. It is not an error to call a function with a different number of arguments than it is declared with. The unsupplied arguments will have a value of `undefined`.

```
function log3(first, second, third) {
  console.log(first)
  console.log(second)
  console.log(third)
}

// logs 'a', undefined, undefined
log3('a')
```

Arguments in Javascript are always positional, there are no keyword args like in Python. However, a similar effect can be achieved by having a function accept an "options" object.

In the body of a function, you can access `arguments`, which is an array-like object containing the arguments the function was called with, in order. This allows you to write functions that can accept any number of arguments:

```
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

```
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

Here the term "function" is being used as opposed to "method". By this, I just mean that the function is not "associated" with any particular object. We may say that the function is "unbound".

When you call a function as a function, `this` is equal to the global object. (In a browser, it will be `window`. In node, it will be `global`.)

Except in strict mode -- in strict mode, `this` will be `undefined`. This is an attempt to remedy one of the worst design flaws of JS.


### Calling as a method

If a function is a property of an object, and the object is present at the site of invocation, the function is called as a method of that object. Inside the function, `this` will refer to the object that the function is a property of.

`var myObj = {}`
`var myFunc = function () {}`
`var myObj.myMethod = myFunc`
`myObj.myMethod()         // inside myMethod, this will be myObj`
`myFunc()                 // inside myFunc, this will be the global object`


### Calling with `call` or `apply`

`call` and `apply` are functions that call a function with a given `this` value, plus arguments.

`call` and `apply` are much the same, the only difference is in how you provide the arguments. If you're using `apply`, the arguments are in an array. If you're using `call`, you pass the arguments directly.

myFunction.call(thisValue, arg1, arg2, arg3...)
myFunction.apply(thisValue, [argumentsArray])

```
function add3NumsToThis(a, b, c) {
  return this + a + b + c
}

add3NumsToThis.call(5, 1, 1, 1)       // returns 8
add3NumsToThis.apply(6, [1, 1, 1])    // returns 9

```


### Calling with `new`

`new` is an operator that takes a function as an operand. It creates an object and then invokes the function in the context of the newly-created object. Functions that are intended to be called with `new` are called constructors, and by convention the function's name should be capitalized.

```
// constructor for Customer objects
function Customer(name) {
  this.name = name
}  
```

The reason for this convention is simple: If you accidentally call a constructor as a function, without `new`, `this` will refer to the global object, and the constructor will do the wrong thing.

It is possible to check for this problem and correct it at runtime:

```
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

A function's `bind` method takes a `this` value, and returns a new function. When the new function is called, it will execute the original function, with `this` set to the value passed to `bind`.

```
function myFunc() { return this.num }

// returns undefined
myFunc()

var myBoundFunc = myFunc.bind({num: 5})

// returns 5
myBoundFunc()

```


### Partial Application

`bind` can also be used to "partially apply" functions. This means that `bind` can pre-fill some of the function's arguments. When the new function is called, the pre-filled arguments will be combined with the current arguments and they will all be passed to the original function.

```
function add3Nums(a, b, c) {
  return a + b + c
}

var add2Nums = add3Nums.bind(null, 0)
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

```
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

```
function myFunc() {}()
```

The solution is to put anything before `function`, so that it is no longer a function statement but a function expression, which can be invoked directly.

```
// all valid
(function myFunc() {})()
+function myFunc() {} ()
-function myFunc() {} ()
!function myFunc() {} ()
```


### Function statements

A function statement does two things: it creates a named function, and declares a variable whose value is the function. Because of this variable declaration, anonymous functions are not allowed in function statements.

```
function myFunc() {}
```

does this:

```
var myFunc = function myFunc() {}
```

## Inner functions

In Javascript, functions can be declared inside of other functions.

```
function outerFunc() {
  var x = 5

  function innerFunc() {
    //... do something
  }

  innerFunc()
}


## Closures

In Javascript, a function has access to everything in the scope in which it was created. Even after the lifetime of the outer function has passed, the inner function can still access and manipulate the variables in its enclosing scope. This is very powerful, and has many uses. It is also the only way to have truly private variables in Javascript.


```
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

When a function is declared inside another function, the inner function is said to "close over" the scope of the outer function. This means that any variables in the outer scope, which are not re-declared in the inner scope, are avaiable.

However, any variable with a name that matches the name of a variable in the outer scope, will "shadow" the outer variable. The outer variable will not be available in the inner function.



```
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


```
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

```
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

```
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


```
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