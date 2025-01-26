/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  const sortedStrs = strs.sort((a, b) => a.length - b.length);
  console.log("Sorted:", sortedStrs);
  let prefix = sortedStrs[0];
  let lastIdx = prefix.length - 1;
  while (lastIdx >= 0) {
    let missed = false;
    for (let i = 1; i < sortedStrs.length; i++) {
      if (!sortedStrs[i].startsWith(prefix)) {
        prefix = prefix.substring(0, prefix.length - 1);
        lastIdx = prefix.length - 1;
        missed = true;
        break;
      }
    }
    if (!missed) {
      break;
    }
  }
  return prefix;
};

const printResult = (input) => {
  console.log("Input:", input);
  console.log("Output:", longestCommonPrefix(input));
};

printResult(["flower", "flow", "flight"]);
printResult(["dog", "racecar", "car"]);
printResult(["reflower", "flow", "flight"]);
