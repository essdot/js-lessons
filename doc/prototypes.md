# Prototypes & Inheritance

Inheritance works differently in JavaScript than in many other languages. JavaScript uses *prototypal inheritance*, which is focused on objects themselves, not classes. There are no classes in JavaScript, at least not in the same way as you may be used to in Java or C++ or other object-oriented languages.

# The Prototype Chain

Every JavaScript object has an internal link to its *prototype*, the object that is its ancestor. When you ask for a property of an object in JavaScript, the object itself is checked first. If the property isn't there, the prototype is checked, and that object's prototype and so on, all the way to the end. What is the end of the chain? `Object.prototype`. Objects in JavaScript ultimately descend from `Object.prototype`. The prototype of `Object.prototype` is `null`.

You can't directly access an object's internal link to its prototype. However, you can pass the object to the function `Object.getPrototypeOf()`, which will return a reference to the object's prototype. Also, you can pass an object to the function `Object.create()`, and the newly-created object will have the provided object as the prototype.

This prototype chain allows objects to inherit from other objects, but without classes. Let's say I create an object called `car` and give it a `honkHorn` function, then make it the prototype of a `sportsCar` object:

```javascript
let car = {
	hornSound: 'beep',
	honkHorn: function honkHorn() {
		console.log(this.hornSound)
	}
}

let sportsCar = Object.create(car)

Object.getPrototypeOf(sportsCar) === car    // => true
```

My new `sportsCar` object will get the `honkHorn` function for free:

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

`hasOwnProperty` is a property of `Object.prototype`, so by default, every object has the `hasOwnProperty` method.

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
You can create an object that has no prototype, by passing `null` to `Object.create`. It won't have any properties, even the properties that objects normally have like `toString` and `hasOwnProperty`.

# Constructors

A *constructor* is a function that sets up a new object when it is created with the `new` operator. In JavaScript, any function can be used as a constructor, even if it was not intended to be used that way. There is nothing special to the language about constructor functions. Because of this, by convention, a function that is intended to be used as a constructor has a capitalized name. Never use a capitalized name for a variable or function name unless it is meant to be used as a constructor.

Objects in JavaScript have a `constructor` property that points to their constructor function. The default constructor is `Object`, if you create an object via an object literal or `Object.create`, its constructor will be `Object`. Functions' constructor is `Function`, their prototype is `Function.prototype`. Date objects' constructor is `Date`, etc.

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
function MyCoolConstructor() {
	if(!(this instanceof MyCoolConstructor)) {
		return new MyCoolConstructor()
	}
}
```

`instanceof` will tell us whether `this` is an object whose constructor is `MyCoolConstructor`, as we expect. If not, something has gone wrong, and we avoid mutating the global state by calling again, but this time with `new`.

This is why the convention of naming constructors with a capital letter is so important! Always do it, always always always.

## You don't need `new`

When you use the `new` operator, it forces the creation of a new object. If you decide later on that you don't want your function to be called that way, you're stuck. Your users are already calling it with `new`, you have to keep shipping a constructor or it will be a breaking change for your users. 

So there are downsides to using `new`, and yet, we already have other ways to create objects. We have `Object.create` and we have the object-literal syntax, and they don't have the downsides that `new` does. So why do we need `new`? We don't! Think about not using it at all:

```javascript
let proto = {
	myProp: '1234',
	hello: function() {
		console.log('hi')
	}
}

function factory() {
	return Object.create(proto)
}
```

Here, the `factory` function does what we're looking for in a constructor - it creates and returns an object with properties we want. And we avoid the pitfalls of `new`, and we're not locked in for the future. Later, if we decide that `factory` should return an object from an internal pool of objects, instead of creating a new one every time, we can make that change and it won't affect users of `factory` at all.

## `instanceof` operator

`instanceof` takes two operands: an object on the left, and a function on the right. `instanceof` returns `true` if the function is the constructor of the object, or any object in the prototype chain.

(Technically, it can take any value on the left side. But only objects have constructors, so if the left-hand value is not an object, it will return `false`.)


# "Subclassing"

You can use JavaScript's prototype inheritance to simulate OO-style subclass inheritance. Unfortunately, doing this is a bit clunky. To simulate subclassing, you set the "subclass" constructor's prototype to an object whose prototype is the prototype of the "super class", then you call the parent constructor in the context of the object being constructed:

```javascript

function Super() {
	this.isSubclass = false
}

function Sub() {
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

## __proto__

Some JavaScript engines *do* give you a way to directly access an object's link to its prototype, by putting a `__proto__` property on every object. This is not enforced by the ECMAScript spec, and you should not rely on it being there. But it might be!
