/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  let remParts = s;

  const isPair = (char1, char2) => {
    switch (char1) {
      case "(":
        return char2 === ")";
      case "[":
        return char2 === "]";
      case "{":
        return char2 === "}";
      default:
        return false;
    }
  };

  while (remParts.length > 0) {
    let newRemParts = remParts;
    for (let i = 0; i < remParts.length - 1; i++) {
      console.log(i, "->", remParts.charAt(i), ":", remParts.charAt(i + 1));
      if (isPair(remParts.charAt(i), remParts.charAt(i + 1))) {
        let slicedLeft = remParts.slice(0, i);
        let slicedRight = remParts.slice(i + 2, remParts.length);
        console.log("left:", slicedLeft, " | right:", slicedRight);
        newRemParts = slicedLeft + slicedRight;
        console.log("newReamParts:", newRemParts);
        console.log("remParts:", remParts);
        break;
      }
    }
    if (remParts === newRemParts) {
      break;
    }

    remParts = newRemParts;
  }

  return remParts ? remParts.length === 0 : true;
};
const printResult = (input) => {
  console.log("Input:", input);
  console.log("Output:", isValid(input));
};

//printResult("()[]{}");
//printResult("(]");
printResult("([])");
