// const describe = describe
// const it = it

describe('functions', function() {
	it.only('has own property', function() {
		const protoObj = {
			protoHi: 'hi'
		}
		const obj = Object.create(protoObj)

		obj.hi = 'hi!'

		assert.equal(hasOwn(obj, 'hi'), true)
		assert.equal(hasOwn(protoObj, 'protoHi'), true)
		assert.equal(hasOwn(protoObj, 'hi'), false)
		assert.equal(hasOwn(protoObj, 'hasOwnProperty'), false)


		// Write an implementation of Object.prototype.hasOwnProperty.

		function hasOwn(object, propName) {
			if(object === null || typeof object !== 'object') {
				return false
			}

			const proto = Object.getPrototypeOf(object)

			if(proto) {
				return proto[propName] !== object[propName]
			}

			return objectPropVal !== undefined

			// if(objectPropVal !== undefined) {
			// 	return true
			// }

			// const objectPropVal = object[propName]
			// let current = Object.getPrototypeOf(object)

			// while(!!current) {


			// }

			// do {

			// } while(current !=)
		}

	})
})
