describe('functions', function() {
  it('Use arguments', function() {

    // Make this function return an array of strings. The strings should be
    // string representations of the arguments pased to the function.
    function strings() {
      var result

      return result
    }

    assert.deepEqual(strings(2, 4, 6), ['2', '4', '6'])
    assert.deepEqual(strings('a'), ['a'])
    assert.deepEqual(
        strings({}, [], [1, 2, 3])
      , ['[object Object', '', '1,2,3']
    )
  })

  it('Call a function as a function', function() {
    function myFunc() {
      return this
    }

    // Assign to myFuncResult the result of calling myFunc as a function.
    var myFuncResult

    assert.equal(myFuncResult === global, true)
  })

  it('Call a function as a method', function() {
    var myObj = {}

    function myFunc() {
      return this
    }

    // Make myFunc a method of myObj. Then assign to methodResult
    // the result of calling myFunc as a method of myObj.
    myObj
    var methodResult

    assert.equal(methodResult, myObj)
  })

  it('Call a function with call', function() {
    function myFunc(x, y) {
      return this + x + y
    }

    // Assign to callResult the result of calling myFunc using call().
    // Use 5 for the context, and pass two arguments: 1 and 3.
    var callResult

    assert.equal(callResult, 9)
  })

  it('Call a function with apply', function() {
    function myFunc(x, y) {
      return '' + this + x + y
    }

    // Assign to callResult the result of calling myFunc using apply().
    // Use 5 for the context, and pass two arguments: 1 and 3.
    var applyResult

    assert.equal(applyResult, '513')
  })

  it('Call a function with new', function() {
    function Car() {
      this.max_speed = 95
    }

    // Assign to newCar the result of calling Car with the new operator.
    var newCar

    assert.equal(typeof newCar, 'object')
    assert.equal(newCar.max_speed, 95)
    assert.equal(Object.getPrototypeOf(newCar), Car.prototype)
  })

  it('Bind a function to a new context', function() {
    var myObj1 = {
        chant: 'Go!'
      , go: function() {
          return this.chant
      }
    }

    var myObj2 = {
        chant: 'Go go go!'
    }

    // Re-bind myObj1.go to myObj2 and assign the result to reboundFunc.
    var reboundFunc

    // Assign to reboundFuncResult the result of calling reboundFunc.
    var reboundFuncResult

    assert.equal(typeof reboundFunc, 'function')
    assert.equal(reboundFuncResult, 'Go go go!')
  })

  it('Partial application with bind', function() {
    function makeArrayOfArgs(a, b, c) {
      return [a, b, c]
    }

    // Use bind to fill in the first argument of
    // makeArrayOfArgs with the value 1.
    var partialApplyFunc

    assert.deepEqual(partialApplyFunc(2, 3), [1, 2, 3])
    assert.deepEqual(partialApplyFunc(1, 1), [1, 1, 1])
  })

  it('Function name', function() {
    // Change myFunc from an anonymous function to a function with the name
    // myFunc.
    var myFunc = function() {}

    assert.equal(myFunc.name, 'myFunc')
  })

  it('Function name', function() {
    // Change myFunc from an anonymous function to a function with the name
    // myFunc.
    var myFunc = function() {}

    assert.equal(myFunc.name, 'myFunc')
  })

  it('Function statement', function() {
    // Change the function statement below to a function expression
    function myFunc() {}

    assert.equal(typeof myFunc, 'undefined')
  })

  it('Pass by reference', function() {
    // Change the code below so that firstObj gets replaced by secondObj.
    function myFunc(o) {
      var secondObj = {
          num: 11
      }

      o = secondObj
    }

    var firstObj = {}

    myFunc(firstObj)

    assert.equal(firstObj.num, 11)
  })
})
