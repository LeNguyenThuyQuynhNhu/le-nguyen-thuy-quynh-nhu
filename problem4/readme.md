# Problem 4: Three ways to sum to n

Input will always produce a result lesser than Number.MAX_SAFE_INTEGER

## 1: sum_to_n_loop

The first way that everyone thinks, but `the complexity is bit high`

Loop and add to total through the numbers from 1 to n:

- Time complexity: `O(n)`: loop times = n
- Space complexity: `O(1)`: just need variable `sum`

## 2: sum_to_n_recursion

Short, but `the complexity is high`

Calls itself recursively n times, down by 1 element with each recursive call until basic case (n = 1):

- Time complexity: `O(n)`: number of times calls itself = n
- Space complexity: `O(n)`: newArr[n] less elements each times

=> Consumes space

## 3: sum_to_n_bitwise

You must know the formula for calculating **arithmetic progressions** and **bitwise operator** but the `complexity is minimal`

**Summary of Arithmetic progressions:**

1 to n like arithmetic progressions with arithmetical ratio = 1 (1, 2, 3, ...)

Sn = n _ (U1 + Un) / 2 => n _ (U1 + Un) >>> 1

Instead of dividing by 2, use Bitwise Zero Fill Right Shift is faster (cause one zero bits are pushed in from the left, and the rightmost bits fall off, don't need complicated division). But must be a `positive integer so dividing by 2 is equal to >>> 1:

- Time complexity: `O(1)`: doesn't depend on the input size n, just use the formula one times
- Space complexity: `O(1)`: doesn't require more variable, just return result
