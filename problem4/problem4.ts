/**
 * Calculates the sum of all numbers from 1 to n using the reduce method.
 *
 * @param {number} n - Numbers to sum.
 * @return {number} The sum of all numbers from 1 to n.
 */
function sum_to_n_loop(n: number): number {
  let sum = 0;
  //In this case n can be negative or positive
  // for (let i = 1; i <= Math.abs(n); i++) {
  // 	sum += i
  // }
  // return n < 0 ? -sum : sum

  //n only positive
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sum_to_n_recursion(n: number): number {
  //In this case n can be negative or positive
  // return n === -1 ? -1 : n === 1 ? 1 : n + sum_to_n_recursion(n < 0 ? n + 1 : n - 1)

  //n only positive
  if (n === 1) {
    return 1;
  } else {
    return n + sum_to_n_recursion(n - 1);
  }
}

function sum_to_n_bitwise(n: number): number {
  //In this case n can be negative or positive
  //return n < 0 ? -(Math.abs(n) * (Math.abs(n) + 1) >>> 1) : (n * (n + 1)) >>> 1;

  //n only positive
  return (n * (n + 1)) >>> 1;
}

console.log("sum_to_n_loop", sum_to_n_loop(76));
console.log("sum_to_n_recursion", sum_to_n_recursion(30));
console.log("sum_to_n_bitwise", sum_to_n_bitwise(76));
