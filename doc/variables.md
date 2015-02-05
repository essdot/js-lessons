# Variables

Variables in Javascript are not restricted to a type, they can have any value. The same variable can be reassigned to hold values of different types, this is legal in Javascript.

## Declaration

You must declare a variable before you use it. Declare variables with the `var` keyword:

`var x = 5`

The above statement actually breaks down into two:

`var x`
`x = 5`

If you declare a variable without initializing its value, the value of the variable will be `undefined`.

If you use a variable without declaring it with `var` first, Javascript will do a terrible thing: It will assume you're creating a new *global* variable. That is why you must always use the `var` keyword.

```
// DON'T EVER DO THIS! 
// Never, never, never ever do this, ever.
function myFunc() {
  x = 5
}
```

Except in strict mode -- in strict mode, the above will be an error. This is an attempt to remedy one of Javascript's biggest design flaws. It's a nasty one. 

**Always, always use `var`.**


## Scope

Variables in Javascript have function scope. If a variable can be seen anywhere within a function, it can be seen everywhere within that function. This is different from many other languages, which have block scope.


```
function myFunc(arg) {
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

But, this function has a slight problem. The variable `isPositive` is declared within an if-block, but since variables in Javascript have function scope, `isPositive` can be seen outside of that if-block.

Since variables can be seen everywhere within a function, you should always declare your variables at the top of a function. Even if you're not going to use a variable until farther down, declare it at the top. Do not declare variables within if-blocks or for-loops or other control structures. It's not an error to do so, it's just a bad idea.

There is another reason why you should declare your variables at the top: hoisting.

## Hoisting

Javascript has a feature called "hoisting". What it means is the JS runtime will  silently rearrange the code that you write, putting variable declarations at the very top of every function, before any other code runs within the function.

If you think "the JS engine silently rewrites your code" sounds like a recipe for bugs, you are correct! This feature is somewhat dangerous, and it often trips up JS developers.

Recall from the "Functions" lesson that a function statement includes a variable declaration. This means that function statements will also be hoisted to the top of a function. 

In this function, even though the declaration of `x` is in the middle of the function body, `x` can be used throughout the function:

```
function myFunc() {
  //`var x` is hoisted up to here when myFunc runs
  x = {}
  x.num = 7
  console.log(x)

  var x

  x.num++
}
```

Remember that in Javascript: 
* Variables have function scope -- they can be seen everywhere within the function.
* Variable declarations are hoisted to the top of the function. This includes inner functions defined in the function.

Function declarations are hoisted too. Here we call `innerFunc` before its declaration in the code:

```
function outerFunc() {
  var i = 2

  innerFunc()

  function innerFunc() {
    i++
    console.log(i)
  }
}
```

Hoisting moves the declaration of `innerFunc` all the way to the top of the function. That's why we successfully call `innerFunc`: the call to `innerFunc` is actually *after* the declaration of `innerFunc`.

Here is a function:

```
function myFunc() {
  var x = 5

  myInnerFunc()
  
  function myInnerFunc(y) {
    console.log(y)
  }
}
```

And its equivalent, after hoisting is done:

```
function myFunc() {
  var myInnerFunc
  var x

  myInnerFunc = function myInnerFunc() {
    console.log(x)
  }

  x = 5
  myInnerFunc()
}
```

Because of hoisting, you should not declare variables inside of if-blocks, for-loops, or other control structures. It's important to understand that hoisting happens *even within code blocks that do not actually execute*.

In the function below, the variable `x` is defined within an if-block that will never run. This means that the *declaration* of `x` will be hoisted to the top of the function, but its assignment will never run.

```
function myFunc() {
  if(false) {
    var x = 5
  }
}
```

Here's what the function looks like after hoisting:

```
function myFunc() {
  var x       // hoisted - declaring the variable named x

  if(false) {
    x = 5     // assigning the value 5 to x
  }
}
```

You can see how, due to hoisting, the declaration will run, but the assignment will not.

One more example. The function below declares a `current` variable within the body of the for-loop.

```
function myFunc() {
  var arr = [1, 2, 3, 4, 5]

  for(var i = 0; i < arr.length; i++) {
    var current = arr[i]

    console.log(current)
  }
}
```

Don't do this! Even though it does not cause an error, it is misleading. As written, the code reads as if the `current` variable is declared each time the loop runs. But as we know, because of hoisting, the declaration is actually moved out of the for-loop to the top of the function. 

We don't want misleading code, we want code that reads like what it does. So, write it this way instead:

```
function myFunc() {
  var arr = [1, 2, 3, 4, 5]
  var current

  for(var i = 0; i < arr.length; i++) {
    current = arr[i]

    console.log(current)
  }
}
```

Just to drive the point home one last time, always declare your variables at the top of the function, no matter where they are used within the function. Hoisting can come in handy but it can be clunky too!