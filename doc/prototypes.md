# Prototypes & Inheritance

Inheritance works differently in JavaScript than in many other languages. JavaScript uses *prototypal inheritance*, which is focused on objects themselves, not classes. There are no classes in JavaScript, at least not in the same way as you may be used to in Java or C++ or other object-oriented languages. This is true even though JavaScript has a `class` keyword.

# The Prototype Chain

Every JavaScript object has an internal link to its *prototype*, the object that is its ancestor. When you ask for a property of an object in JavaScript, the object itself is checked first. If the property isn't there, the prototype is checked, and that object's prototype and so on, all the way to the end. What is the end of the chain? `Object.prototype`. Objects in JavaScript ultimately descend from `Object.prototype`. The prototype of `Object.prototype` is `null`.

You can't directly access an object's internal link to its prototype. However, you can pass the object to the function `Object.getPrototypeOf()`, which will return a reference to the object's prototype. You can pass an object to the function `Object.create()`, and it will create a new object that has the provided object as its prototype. You can use `Object.setPrototypeOf()` to change an object's prototype.

This prototype chain allows objects to inherit from other objects, but without classes. Let's say I create an object called `car` and give it a `honkHorn` function, then make it the prototype of a `sportsCar` object:

```javascript
let car = {
	hornSound: 'beep',
	honkHorn: function honkHorn () {
		console.log(this.hornSound)
	}
}

let sportsCar = Object.create(car)

Object.getPrototypeOf(sportsCar) === car    // => true
```

The `sportsCar` object will get the `honkHorn` function for free:

```javascript
typeof car.honkHorn               // => 'function'
typeof sportsCar.honkHorn         // => 'function'
```

It's not a copy or a new function with the same name, it's the same exact function:

```javascript
car.honkHorn === sportsCar.honkHorn       // => true
```

When I call `sportsCar.honkHorn()`, the `sportsCar` object will be checked for the `honkHorn` function, then its prototype (`car`) will be checked, where `honkHorn` will be found and then called. But inside the `honkHorn` function, `this` will refer to `sportsCar`, not `car`.

```javascript
car.honkHorn()                 // logs 'beep'
sportsCar.honkHorn()           // logs 'beep'

sportsCar.hornSound = 'HONK!!!'

car.honkHorn()                 // logs 'beep'
sportsCar.honkHorn()           // logs 'HONK!!!'
```

Above we see that setting `sportsCar.hornSound` will not change or remove `car.hornSound`. When an object has a property with the same name as a property of the prototype, we may say it is *shadowing* the prototype's property. Here, `sportsCar.hornSound` is shadowing `car.hornSound`.

The `hasOwnProperty` method will return `true` only if the object has the property itself. You can use this to figure out if a property is coming from the prototype chain or the object itself.

```javascript
sportsCar.hasOwnProperty('honkHorn')     // => false
car.hasOwnProperty('honkHorn')           // => true

sportsCar.hasOwnProperty('hornSound')    // => true
```

`hasOwnProperty` is a member of `Object.prototype`, so by default, every object has the `hasOwnProperty` method.

```javascript
let myCoolObject = {
	hi: 'hi'
}

Object.getPrototypeOf(myCoolObject) === Object.prototype
// => true

myCoolObject.hasOwnProperty('hi')
// => true

myCoolObject.hasOwnProperty('hasOwnProperty')
// => false

Object.prototype.hasOwnProperty('hasOwnProperty')
// => true
```

Prototypes are live objects, they are normal JavaScript objects like any other. If you add or change properties on an object, those changes will be visible to the object's descendants. 

```javascript
car.numberOfWheels
// => undefined

car.numberOfWheels = 4
sportsCar.numberOfWheels
// => 4
```

However, since `sportsCar.hornSound` is shadowing `car.hornSound`, changing `car.hornSound` will not affect `sportsCar.hornSound`:

```javascript
car.honkHorn()
// logs 'beep'

sportsCar.honkHorn()
// logs 'HONK!!!'

car.hornSound = 'bitty beep'
car.honkHorn()
// logs 'bitty beep'

sportsCar.honkHorn()
// still logs 'HONK!!!!'
```

Note:
You can create an object that has no prototype, by passing `null` to `Object.create`. The resulting object will not have `Object.prototype` as its prototype, its prototype will be `null`. It won't have any properties, even the properties that objects normally have like `toString` and `hasOwnProperty`.

# Constructors

A *constructor* is a function that sets up a new object when it is created with the `new` operator. In JavaScript, any function can be used as a constructor, even if it was not intended to be used that way. There is nothing special to the language about constructor functions. Because of this, by convention, a function that is intended to be used as a constructor has a capitalized name. Never use a capitalized name for a variable or function name unless it is meant to be used as a constructor.

Objects in JavaScript have a `constructor` property that points to their constructor function. The default constructor is `Object`. If you create an object via an object literal or `Object.create`, its constructor will be `Object`. Functions' constructor is `Function`, their prototype is `Function.prototype`. Date objects' constructor is `Date`, etc.

Since any function can be a constructor, every function automatically has a `prototype` property. This is the object that will be the prototype of all objects created with that constructor.

```javascript
function Lightbulb() {
}

let myLight = new Lightbulb()

myLight.constructor
// => function Lightbulb

Object.getPrototypeOf(myLight) === Lightbulb.prototype
// => true

Object.getPrototypeOf(Lightbulb) === Function.prototype
// => true

Object.getPrototypeOf(Lightbulb.prototype) === Object.prototype
// => true
```

It's very important to understand how this works: above, `Lightbulb.prototype` is *not* the prototype of `Lightbulb`. `Lightbulb.prototype` is the prototype of *all objects constructed by Lightbulb*. `Lightbulb` is a function, so its prototype is `Function.prototype`. The prototype of `Lightbulb.prototype` is `Object.prototype`.

## `new` operator

Constructors are functions that are intended to be invoked with the `new` operator. The `new` operator tells JavaScript to create a new object, and then invoke the constructor function. In the constructor, `this` will refer to the newly-created object.

There are two problems here: 

- What if you use `new` with a function not intended as a constructor? 
- What if you call a constructor without `new`?

If you use `new` with a function that was not intended as a constructor, your function will run as normally invoked, except that `this` will refer to the newly-created object. That's a bit weird, and anything expecting `this` to refer to a different object may break.

If you call a constructor without `new`, `this` will refer to the global object. So if you set properties on `this` in your constructor, you're scribbling on the global object. This is a disaster.

There is a bit of boilerplate you can add to a constructor to make sure this doesn't happen:

```javascript
function MyCoolConstructor () {
	if (!(this instanceof MyCoolConstructor)) {
		return new MyCoolConstructor()
	}
}
```

`instanceof` will tell us whether `this` is an object whose constructor is `MyCoolConstructor`, as we expect. If not, something has gone wrong, and we avoid mutating the global state by calling again, but this time with `new`.

This is why the convention of naming constructors with a capital letter is so important! Always do it, always always always.


## `instanceof` operator

`instanceof` takes two operands: an object on the left, and a function on the right. `instanceof` returns `true` if the function is the constructor of the object, or any object in the prototype chain.

(Technically, it can take any value on the left side. But only objects have constructors, so if the left-hand value is not an object, it will return `false`.)


## You don't need `new`

When you use the `new` operator, it forces the creation of a new object. If you make a module that exports a constructor and then decide later on that you don't want your function to be called that way, you're stuck. Your users are already calling it with `new`, you have to keep shipping a constructor or it will be a breaking change for your users.

Instead of exporting a constructor, you can just export a function that calls `new` itself if the functionality of your module is implemented in an object-oriented fashion.

## Creating objects without `new`

JavaScript has other ways to create objects: `Object.create` and the object-literal syntax. These can be used instead of constructors and `new`. `Object.create` creates a new object, and the new object's prototype is the argument you pass to `Object.create`.

```javascript
let proto = {
	myProp: '1234',
	hello: function () {
		console.log('hi')
	}
}

function factory () {
	return Object.create(proto)
}
```

Here, the `factory` function does what we're looking for in a constructor - it creates and returns an object with properties we want. When you call this function, you get a new object back. If the implementation of creating that object changes, it doesn't matter -- callers just care that they call the function and get an object back.

This is another way to create objects without constructors and `new`. With this way, notice how simple it is to create an object with a given prototype. Instead of setting the `prototype` property of a function and then calling the function with `new` (clumsy and error-prone), we just call `Object.create`. Keep this in mind when designing modules that create objects.

# "Subclassing"

You can use JavaScript's prototypal inheritance to simulate OO-style subclass inheritance. Unfortunately, doing this is a bit clunky. To simulate subclassing, you:

1. set the "subclass" prototype to an object whose prototype is the "superclass" prototype. This link is what makes the "subclass" inherit from the "superclass" -- all the "subclass" objects descend from an object that descends from the "superclass".
1. call the "superclass" constructor in the context of the object being constructed. This ensures that any setup that happens in the "superclass" constructor happens to the "subclass" objects too.

```javascript

function Super () {
	this.isSubclass = false
}

function Sub () {
	Super.call(this)

	this.isSubclass = true
}

Sub.prototype = Object.create(Super.prototype)

(new Super()).isSubclass
// => false

(new Sub()).isSubclass
// => true
```

The important parts are the `Object.create` call, and `Super.call(this)`. `Super.call(this)` allows the "super class" constructor to run in the context of the object being constructed, and then the "subclass" constructor can change the object however it wants. And there you have it, fake subclassing: any object constructed with `Sub` will have all the properties of `Super.prototype`.

As you can see, doing this is a bit clunky in JavaScript. Sometimes it's the right thing, but you should consider whether what you're building really needs this sort of inheritance. 

## ES6 Classes

ES6 adds some new syntax for declaring classes. The `class` keyword was added, and in between the curly braces defining the class, you can define methods, properties, and a constructor.

```javascript
class MyClass {
	constructor () {
		this.name = 'MyClass'
	}
	sayHi () {
		return 'hi'
	}
	get name () {
		return this.name
	}
}
```

The "class object" created by this keyword is simply the constructor function. Remember that all functions are objects. The "methods" and getters/setters you define will be added to the prototype.

ES6 also gives the `extends` keyword to do subclassing. If you use `extends` to make a class inherit from another class, you need to use the `super` keyword to call the superclass constructor from the subclass constructor.

```javascript

class MySubclass extends MyClass {
	constructor () {
		super()

		this.name = 'MySubclass'
	}
}
```

You can do "static methods" with the `static` keyword. This adds methods to the class itself rather than the class instances.

```javascript
class SomeClass {
	static isCool () {
		return true
	}
}

//returns true
SomeClass.isCool()
```
