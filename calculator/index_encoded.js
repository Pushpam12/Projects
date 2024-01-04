let output = document.querySelector(".output");
let options = document.querySelector(".option_box");
let music = document.querySelector(".music_box");

// from index.html page

let nums_box = document.querySelector(".nums_box");
let numberInputs = document.querySelectorAll(".nums_box input");

let simple_arithmetic = document.querySelector(".simple_arithmatic");
let arithmetic_btn = document.querySelectorAll(".cal_btn");
let calculate_btn = document.querySelector(".calculate_btn");
let reset_btn = document.querySelector(".reset-btn");

// console.log(nums_box,numberInputs,options,simple_arithmetic,arithmetic_btn,calculate_btn);

let num1 = null;
let num2 = null;

options.addEventListener("change", (e) => {
  for (const e of numberInputs) {
    e.removeAttribute("min");
    e.setAttribute("type", "number");
    e.removeAttribute("pattern");
    e.classList.remove("check");
  }

  if (options.value == "Measurement") {
    window.open("./units.html", "_self");
  } else if (options.value == "Simple") {
    calculate_btn.style.display = "none";
    simple_arithmetic.style.display = "block";
  } else {
    calculate_btn.style.display = "block";
    simple_arithmetic.style.display = "none";
  }

  let inputArr = numberInputs;

  if (options.value == "Table" || options.value == "Factors") {
    changeInput(1, [""], inputArr);
  } else if (options.value == "IsLeapYear") {
    changeInput(1, ["Year"], inputArr);
    numberInputs[0].min = 0;
    numberInputs[0].classList.add("check");
  } else if (options.value == "Percent") {
    changeInput(2, ["Value", "Total"], inputArr);
  } else if (options.value == "PercentOfValue") {
    changeInput(2, ["Percent", "Total"], inputArr);
  } else if (options.value == "SimpleInterest") {
    changeInput(3, ["Principle", "Rate", "Time"], inputArr);
  } else if (options.value == "CompoundInterest") {
    changeInput(
      4,
      ["Principle", "Rate", "Time (no. of years)", "No. of times/year"],
      inputArr
    );
  } else if (options.value == "LCM" || options.value == "HCF") {
    changeInput(1, ["Enter numbers comma separated."], inputArr);
    numberInputs[0].type = "text";
    numberInputs[0].pattern = "^[0-9]+(,[0-9]+)*$";
  } else {
    changeInput(2, ["", ""], inputArr);
  }
});

for (const btn of arithmetic_btn) {
  btn.addEventListener("click", () => {
    let num1Value = Number(numberInputs[0].value);
    let num2Value = Number(numberInputs[1].value);
    let num3Value = Number(numberInputs[2].value);
    let num4Value = Number(numberInputs[3].value);

    if (music.value != "null") {
      const note = btn.dataset["musicKey"].split(",");
      let note_index = Number(music.value);
      const audio = new Audio(`./assets/piano keys/${note[note_index]}.mp3`);
      audio.play();
    }
    let val = calculator(
      window[btn.value],
      num1Value,
      num2Value,
      num3Value,
      num4Value
    );
    loadEle(val);
  });
}

nums_box.addEventListener("click", () => {
  if (music.value != "null") {
    const note = nums_box.dataset["musicKey"].split(",");
    let note_index = Number(music.value);
    const audio = new Audio(`./assets/piano keys/${note[note_index]}.mp3`);
    audio.play();
  }
});

calculate_btn.addEventListener("click", (e) => {
  e.preventDefault();
  let val = 0;
  if (options.value == "HCF" || options.value == "LCM") {
    let numsArr = numberInputs[0].value.split(",");
    numsArr = numsArr.map((e) => Number(e));
    val = calculator(window[options.value], numsArr);
  } else {
    let num1Value = Number(numberInputs[0].value);
    let num2Value = Number(numberInputs[1].value);
    let num3Value = Number(numberInputs[2].value);
    let num4Value = Number(numberInputs[3].value);
    val = calculator(
      window[options.value],
      num1Value,
      num2Value,
      num3Value,
      num4Value
    );
  }
  loadEle(val);
});

// ____________________________________________________
// LOGIC GOES ON

output.addEventListener("click", () => {
  numberInputs[0].value = num1;
  numberInputs[1].value = num2;
});

function calculator(fun, ...vals) {
  return fun(...vals);
}

function loadEle(data) {
  let prevResult = document.querySelector(".result");
  if (prevResult != null) {
    output.removeChild(prevResult);
  }

  let result = document.createElement("div");
  result.classList.add("result");
  result.innerHTML = data;

  output.appendChild(result);
}

function changeInput(n, placeValue, numberInputs) {
  // placeValue needs to be array;
  let counter = 0;
  for (let i = 1; i <= numberInputs.length; i++) {
    if (i > n) {
      numberInputs[i - 1].style.display = "none";
    } else {
      numberInputs[i - 1].style.display = "block";
      numberInputs[counter].placeholder = placeValue[counter];
      counter++;
    }
  }
}

// Functions for maths calculations
// _______________________________________________________

function Add(a, b) {
  let val = a + b;
  num1 = val;
  return val;
}
function Subtract(a, b) {
  let val = a - b;
  num1 = val;
  return val;
}
function Multiply(a, b) {
  let val = a * b;
  num1 = val;
  return val;
}
function Divide(a, b) {
  let val = a / b;
  num1 = val;
  return `${val} <p> Quotient : ${Math.floor(val)} </p><p>Remainder : ${
    a % b
  } </p>`;
}
function Power(a, b) {
  let val = a ** b;
  num1 = val;
  return val;
}
function HCF_2nums(a, b) {
  let min = 0,
    hcf;
  a > b ? (min = b) : (min = a);
  for (let i = 1; i <= min; i++) {
    if (a % i == 0 && b % i == 0) {
      hcf = i;
    }
  }
  num1 = hcf;
  return hcf;
}
function HCF(digits) {
  let hcf = 1;
  let factors = []; // factors of every number
  let commonFactors = [];
  digits.forEach((num, index) => {
    factors[index] = [];
    for (let i = 1; i <= num / 2; i++) {
      if (num % i == 0) {
        factors[index].push(i);
      }
    }
    factors[index].push(num);
  });
  commonFactors = factors[0].filter((elem) =>
    factors.every((array) => array.includes(elem))
  );
  commonFactors = commonFactors.sort((a, b) => a - b);
  // console.log(commonFactors);
  hcf = commonFactors[commonFactors.length - 1];
  num1 = hcf;
  return hcf;
}
function LCM_2nums(a, b) {
  let lcm = (a * b) / HCF_2nums(a, b);
  num1 = lcm;
  return lcm;
}
function LCM(digits) {
  let lcm = 1,
    res = 1;
  let product = 1;
  let hcf_product = 1;
  digits = digits.sort((a, b) => a - b);
  digits.forEach((e, index) => {
    product *= e;
    if (index < digits.length - 1) {
      hcf_product *= HCF_2nums(e, digits[index + 1]);
    }
  });
  res = product / hcf_product;
  res_factors = [];
  for (let i = 2; i <= res / 2; i++) {
    if (res % i == 0 && i >= digits[digits.length - 1]) {
      res_factors.push(i);
    }
  }
  res_factors.push(res);
  for (let i = 0; i < res_factors.length; i++) {
    let isLCM = true;
    for (let j = 0; j < digits.length; j++) {
      if (res_factors[i] % digits[j] != 0) {
        isLCM = false;
      }
    }
    if (isLCM) {
      lcm = res_factors[i];
      num1 = lcm;
      return lcm;
    }
  }
  num1 = lcm;
  return lcm;
}

function Table(num) {
  // returns value in string form to be used in html
  let val = "";
  for (let i = 1; i <= 10; i++) {
    val += `<p> ${num} ✖️ ${i} 🟰 ${num * i} </p>`;
  }
  return val;
}

function Factors(num) {
  // returns value in string form to be used in html
  let val = "";
  for (let i = 1; i <= num / 2; i++) {
    if (num % i == 0) {
      val += `${i} , `;
    }
  }
  val += `${num}`;

  let nums = val.split(",");

  if (nums.length == 2) {
    return val + `<p><b>Prime</b></p>`;
  } else {
    let primes = [];
    for (let i = 1; i < nums.length; i++) {
      let count = 0;
      for (let j = 0; j < nums.length; j++) {
        if (nums[i] % nums[j] == 0) {
          count++;
        }
      }
      if (count <= 2) {
        primes.push(nums[i]);
      }
    }
    return val + `<p><b>Composite</b></p><p>Prime factors : ${primes}.`;
  }

  return val;
}

function CompoundInterest(p, r, t, n) {
  let compoundInterest = 0;
  compoundInterest = p * (1 + r / (100 * n)) ** (n * t);
  num1 = numberInputs[1].value;
  num2 = compoundInterest;
  return compoundInterest;
}

function SimpleInterest(p, r, t) {
  let interest = (p * r * t) / 100;
  num1 = numberInputs[1].value;
  num2 = interest;
  return interest;
}

function Percent(val, total) {
  let percent = (val / total) * 100;
  num1 = numberInputs[1].value;
  num2 = percent;
  return `${percent} %`;
}
function PercentOfValue(percent, total) {
  let val = (percent / 100) * total;
  num1 = numberInputs[1].value;
  num2 = val;
  return val;
}

function IsLeapYear(year) {
  if (
    (year % 100 == 0 && year % 4 != 0) ||
    (year % 100 != 0 && year % 4 == 0)
  ) {
    return `${year}<br>Leap Year`;
  }
  return `${year}<br>Not a Leap Year`;
}
