/**
 * @param {string} s
 * @return {string}
 */
var isPalindrome = function (s) {
  if (!s) {
    return false;
  }
  let offset = 0;
  let middlePosition = s.length / 2 - 1;
  while (offset <= middlePosition) {
    let leftChar = s.charAt(offset);
    let rightChar = s.charAt(s.length - 1 - offset);
    if (leftChar !== rightChar) {
      return false;
    }
    offset++;
  }
  return true;
};
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (!s) return "";

  let start = 0,
    maxLength = 1;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    // Odd length palindromes
    let len1 = expandAroundCenter(i, i);

    // Even length palindromes
    let len2 = expandAroundCenter(i, i + 1);

    let currentMaxLength = Math.max(len1, len2);

    if (currentMaxLength > maxLength) {
      start = i - Math.floor((currentMaxLength - 1) / 2);
      maxLength = currentMaxLength;
    }
  }

  return s.substring(start, start + maxLength);
};
console.log(longestPalindrome("a"));
console.log(longestPalindrome("aa"));
console.log(longestPalindrome("ac"));
console.log(longestPalindrome("babad"));
console.log(longestPalindrome("cbbd"));
console.log(
  longestPalindrome(
    "jglknendplocymmvwtoxvebkekzfdhykknufqdkntnqvgfbahsljkobhbxkvyictzkqjqydczuxjkgecdyhixdttxfqmgksrkyvopwprsgoszftuhawflzjyuyrujrxluhzjvbflxgcovilthvuihzttzithnsqbdxtafxrfrblulsakrahulwthhbjcslceewxfxtavljpimaqqlcbrdgtgjryjytgxljxtravwdlnrrauxplempnbfeusgtqzjtzshwieutxdytlrrqvyemlyzolhbkzhyfyttevqnfvmpqjngcnazmaagwihxrhmcibyfkccyrqwnzlzqeuenhwlzhbxqxerfifzncimwqsfatudjihtumrtjtggzleovihifxufvwqeimbxvzlxwcsknksogsbwwdlwulnetdysvsfkonggeedtshxqkgbhoscjgpiel",
  ),
);
console.log(
  longestPalindrome(
    "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  ),
);
