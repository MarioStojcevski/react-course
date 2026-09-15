/*
Complete the method/function so that it converts dash/underscore delimited words into camel casing. The first word within the output should be capitalized only if the original word was capitalized (known as Upper Camel Case, also often referred to as Pascal case). The next words should be always capitalized.

Examples
"the-stealth-warrior" gets converted to "theStealthWarrior"
"The_Stealth_Warrior" gets converted to "TheStealthWarrior"
"The_Stealth-Warrior" gets converted to "TheStealthWarrior" */


function toCamelCase(str){
  let arr = str.split(/-|_/);
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result += arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  return result;
}

console.log(toCamelCase("the-stealth-warrior")); // theStealthWarrior
console.log(toCamelCase("The_Stealth_Warrior")); // TheStealthWarrior
console.log(toCamelCase("The_Stealth-Warrior")); // TheStealthWarrior