# Objects and Prototypes

## Prototypal Inheritance

Inheritance in JavaScript is prototypal. Instead of classes, like in C# or Java, objects inherit from other objects. In JavaScript, there are no instances of classes, there are only objects. Each object has an implicit "link" to its parent object, its prototype.

The link to an object's prototype is not directly accessible. However, there is a function to get a reference to it: `Object.getPrototypeOf(obj)`. You can create a new object and supply its prototype with `Object.create(proto)`.

When looking up a property on an object, the object's own properties are checked first, then the prototype, then its prototype, and so on. The "prototype chain" stops at Object.prototype, the ultimate prototype of all objects.

```javascript
var protoProto = {
	isObject: true
}

var proto = Object.create(protoProto)
var obj = Object.create(proto)

proto.myStr = 'protoObj'
proto.myNum = 3

obj.myStr = 'obj'

obj.myStr                         // returns 'obj'
obj.myNum                         // returns 3
obj.isObject                      // returns true

proto.myStr                       // returns 'protoObj'
proto.myNum                       // returns 3
proto.isObject                    // returns true

proto.hasOwnProperty('isObject')  // returns false
obj.hasOwnProperty('myNum')       // returns false
obj.hasOwnProperty('myStr')       // returns true
```

You can create an object that has no prototype by calling `Object.create(null)`. This can be useful if you need an object that has no properties at all, for example to use as a dictionary/hash table.

## Constructors

Constructors are just functions, that are intended to be called with the `new` keyword. The `new` keyword creates a new object and then calls the constructor function in the context of the new object. Inside the body of the function, `this` refers to the newly-created object. Constructors can also have a `prototype` property. The new object's prototype will be equal to the constructor's `prototype`.

An object's `constructor` property will give you a reference to the constructor function.

```javascript

function Ctor() {}

var ctorObj = new Ctor()
var literalObj = {}

ctorObj.constructor === Ctor            		    // returns true
Object.getPrototypeOf(ctorObj) ===   						// returns true
		Ctor.prototype     

literalObj.constructor === Object               // returns true
Object.getPrototypeOf(literalObj) ===           // returns true
		Object.prototype  
```

### Classical Inheritance

The above can be used to mimic inheritance with classes. You write a constructor function, as you always do when creating classes in object-oriented programming. Then you add methods to the prototype. Now, every time you call `new Constructor()`, you have new objects that all have the same methods!

However, subclassing is a bit trickier. You need to make sure the parent constructor is called in the context of the new object. You also need to create a prototype object from the parent's prototype, so that instances of the subclass get the properties that the parent class has.

```javascript

function Car() {
	this.type = "Car"
	this.hasEngine = true
}

Car.prototype.honk = function honk() {
	beep()
}

// SportsCar inherits from Car
function SportsCar() {
	Car.call(this)

	this.type = "SportsCar"
	this.goesFast = true
}

SportsCar.prototype = Object.create(Car.prototype)
```

Don't set the prototype to a new instance of the parent class:

```javascript
// don't do this!
SportsCar.prototype = new Car()
```

Doing this would cause the constructor function at the time the module is imported. Maybe that could cause side effects we don't want. The  subclass may never be instantiated.

In Node, you can use `util.inherits(subclass, parentClass)` to do inheritance.