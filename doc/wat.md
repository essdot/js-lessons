# Wat

I like JavaScript a lot. JS makes it easy to create and do things to objects, pass around functions, and closures are a killer feature. But, there are some poor design decisions that have been made along the way.

# Global namespace


# Coercion

To be effective working in JavaScript, you unfortunately need to know how coercion works. If you don't, it will bite you. Coercion is the process by which JavaScript turns a value of one type into a value of a different type.

For example, the expression `5 - '1'` will coerce the string '1' into a number, whose value is 1, then it will subtract the 1 from the 5 and return 4.

## String coercion



## + operator

The + operator adds two numbers, or concatenates two strings. If both operands on either side of the `+` are numbers, they will be added. Otherwise, the operands will be coerced into strings and concatenated.