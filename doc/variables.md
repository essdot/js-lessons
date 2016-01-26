# Variables

Variables in Javascript are not restricted to a single type, they can have any value. The same variable can be reassigned to hold values of different types, this is legal in Javascript.

As of ES6, variables can be declared with `var` or `let`. If you are using ES6, you should always use `let` and not `var`. There is no reason to use `var` (again, assuming you're in ES6), so just don't use `var`, and always use `let`.

Also as of ES6, you can declare constants with `const`. If you need to name a value that won't change, declare it as a constant with `const`.

## Declaration

You must declare a variable before you use it. Declare variables with the `let` keyword:

`let x = 5`

The above statement actually breaks down into two:

```javascriot
let x
x = 5
```

If you declare a variable without initializing its value, the value of the variable will be `undefined`.

If you assign to a variable without declaring it with `let` first, Javascript will do a terrible thing: It will assume you're creating a new *global* variable. That is why you must always use the `let` keyword.

```
// DON'T EVER DO THIS! 
// Never, never, never ever do this, ever.
function myFunc () {
  x = 5
}
```

The exception to this is strict mode. In strict mode, the above will be an error. This is an attempt to remedy one of Javascript's biggest design flaws. It's a nasty one. 

**Always, always declare variables with `let`.**

## Block scope

Variables declared with `let` have "block scope". This means that a variable is only visible within the block (set of curly braces) in which it was defined. If you declare a variable with `let` inside an if-block, the variable will not be visible outside of the if-block.

Constants also have block scope.


## Function scope

Variables declared with `var` have "function scope". A variable declared with `var` can be seen anywhere within the function it was declared, regardless of the block it was declared in.

```
function myFunc (arg) {
  if(arg > 0) {
    // isPositive is declared here
    var isPositive = true
  }

  // isPositive is visible here, even though it was
  // declared inside an if-block
  isPositive = false

  console.log(isPositive)
}
```

But, this function has a slight problem. The variable `isPositive` is declared within an if-block, but since variables declared with `var` have function scope, `isPositive` can be seen outside of that if-block.

Because function scoping is tricky and not very useful, you should declare variables with `let` and not `var`. Declaring a variable with `let` gives it block scoping, which is more natural and predictable. There is no real reason to use `var` anymore.

## Destructuring assignment

You can use ES6 destructuring to "unpack" an object's properties into variables or constants.

```javascript
const options = {
  enableTurbo: true,
  wheels: 4,
  diesel: false
}

let {enableTurbo, wheels, diesel} = options

console.log(enableTurbo) // logs true
console.log(wheels) // logs 4
console.log(diesel) // logs false
```

## Hoisting

Javascript has a feature called "hoisting". What it means is the JS runtime will silently rearrange the code that you write, putting `var` declarations at the very top of every function, before any other code runs within the function.

If you think "the JS engine silently rewrites your code" sounds like a recipe for bugs, you are correct! This feature is somewhat dangerous, and it often trips up JS developers.

Recall from the "Functions" lesson that a function statement includes a variable declaration. This means that function statements will also be hoisted to the top of a function.

## `var` hoisting

In this function, even though the declaration of `x` is in the middle of the function body, `x` can be used throughout the function:

```
function myFunc () {
  //`var x` is hoisted up to here when myFunc runs
  x = {}
  x.num = 7
  console.log(x)

  var x

  x.num++
}
```

In this function, the variable `x` is defined within an if-block that will never run. This means that the *declaration* of `x` will be hoisted to the top of the function, but its assignment will never run.

```
function myFunc () {
  if(false) {
    var x = 5
  }
}
```

Here's what the function looks like after hoisting:

```
function myFunc () {
  var x       // hoisted - declaring the variable named x

  if(false) {
    x = 5     // assigning the value 5 to x
  }
}
```

You can see how, due to hoisting, the declaration will run, but the assignment will not.

Remember that in Javascript:

* Variables declared with `var` have function scope -- they can be seen everywhere within the function.
* `var` declarations are hoisted to the top of the function. This includes inner functions defined in the function.

(Although you should not use `var` to declare variables, and use `let` instead, you will have to read code that uses `var`. It was around for much longer than `let` and `const`. So you need to understand hoisting.)

## Function statement hoisting

Function statements are hoisted too. Here we call `innerFunc` before its declaration in the code:

```
function outerFunc () {
  let i = 2

  innerFunc()

  function innerFunc () {
    i++
    console.log(i)
  }
}
```

Hoisting moves the declaration of `innerFunc` all the way to the top of the function. That's why we successfully call `innerFunc`: the call to `innerFunc` is actually *after* the declaration of `innerFunc` after hoisting is done.

Here is a function:

```
function myFunc () {
  let x = 5

  myInnerFunc()

  function myInnerFunc (y) {
    console.log(y)
  }
}
```

And its equivalent, after hoisting is done:

```
function myFunc () {
  var myInnerFunc
  let x

  myInnerFunc = function myInnerFunc () {
    console.log(x)
  }

  x = 5
  myInnerFunc()
}
```

Function hoisting allows you to define your functions below where you use them. When you're writing a module, you can use this to have the module's "main" code call the functions it needs, with the function definitions below.
