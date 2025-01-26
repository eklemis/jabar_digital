/**
 * @param {string} s
 * @return {number}
 */
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  const romanDict = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let sum = 0;

  for (let i = 0; i < s.length; i++) {
    // If current value is less than next value, subtract it (e.g., IV = 4)
    if (i < s.length - 1 && romanDict[s[i]] < romanDict[s[i + 1]]) {
      sum -= romanDict[s[i]];
    } else {
      sum += romanDict[s[i]];
    }
  }

  return sum;
};

const printResult = (input) => {
  console.log("Input:", input);
  console.log("Output:", romanToInt(input));
};
printResult("III");
printResult("LVIII");
printResult("MCMXCIV");
printResult("MCMXCVI");
