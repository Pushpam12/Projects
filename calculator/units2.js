let num1 = null;
let num2 = null;

let form = document.querySelectorAll("form");
let numInputs = document.querySelectorAll('.input_area input[type="number"]');
let measure_1 = document.querySelectorAll('.measure_1 input[type="number"]');
let measure_2 = document.querySelectorAll('.measure_2 input[type="number"]');

let measurement_Type = document.querySelector("#measurement_Type");
let measureCalc_btns = document.querySelectorAll(".measureCalc_btn");
let add_sub_box = document.querySelector(".add_sub");
let mul_div_box = document.querySelector(".mul_div");

let output = document.querySelector(".output");
let error = document.querySelector(".units_error");
let time_mode = document.querySelectorAll(".am-pm_box");
let units_mul_option = document.querySelector(".units_mul_option");
let time_mode_input = document.querySelector('.am-pm_box input[name="mode"]');
// select_value : [ placholder_Arr, units, standard_unit, conversion_type ]

let optionsMappedArr = {
  km_m: {
    placeholder: ["km", "m"],
    units: ["kilo", "unit"],
    sys_type: "metric",
  },
  m_cm: {
    placeholder: ["m", "cm"],
    units: ["unit", "centi"],
    sys_type: "metric",
  },
  cm_mm: {
    placeholder: ["cm", "mm"],
    units: ["centi", "milli"],
    sys_type: "metric",
  },
  hr_min_sec: {
    placeholder: ["hr", "min", "sec"],
    units: ["hour", "minute", "second"],
    sys_type: "time",
  },
  l_ml: {
    placeholder: ["L", "mL"],
    units: ["unit", "milli"],
    sys_type: "metric",
  },
  kg_g: {
    placeholder: ["kg", "g"],
    units: ["kilo", "unit"],
    sys_type: "metric",
  },
  am_pm: {
    placeholder: ["hr", "min", "sec"],
    units: ["hour", "minute", "second"],
    min: [0, 0, 0],
    max: [12, 60, 60],
    mode_am_pm: "on",
    sys_type: "time",
  },
};

let units = optionsMappedArr["km_m"];
changeInputCall(units.placeholder);

measurement_Type.addEventListener("change", () => {
  let measureType = measurement_Type.value;

  for (const key in optionsMappedArr) {
    if (measureType == key) {
      changeInputCall(optionsMappedArr[key].placeholder);
      units = optionsMappedArr[key];
    }
  }

  if (units.mode_am_pm != undefined) {
    console.log("am_pm on");
    for (const ele of time_mode) {
      ele.style.display = "block";
    }
    for (let i = 0; i < measure_1.length; i++) {
      measure_1[i].setAttribute("min", units.min[i]);
      measure_1[i].setAttribute("max", units.max[i]);
      measure_1[i].setAttribute(
        "title",
        `Time must be between ${units.min[i]} & ${units.max[i]}`
      );
    }
  } else {
    console.log("am_pm off");
    for (const ele of time_mode) {
      ele.style.display = "none";
    }
    for (let i = 0; i < measure_1.length; i++) {
      measure_1[i].removeAttribute("min");
      measure_1[i].removeAttribute("max");
      measure_1[i].removeAttribute("title");
    }
  }

  if (units.sys_type == "metric") {
    units_mul_option.style.display = "block";
    let unitsOp = document.getElementsByName("unitsOp");
    for (const e of unitsOp) {
      e.addEventListener("change", () => {
        if (e.checked && e.id == "mul/div") {
          changeInput(1, ["number"], measure_2);
          mul_div_box.style.display = "block";
          add_sub_box.style.display = "none";
        } else if (e.checked && e.id == "add/sub") {
          changeInputCall(units.placeholder);
          mul_div_box.style.display = "none";
          add_sub_box.style.display = "block";
        }
      });

      if (e.checked && e.id == "mul/div") {
        changeInput(1, ["number"], measure_2);
        mul_div_box.style.display = "block";
        add_sub_box.style.display = "none";
      } else if (e.checked && e.id == "add/sub") {
        changeInputCall(units.placeholder);
        mul_div_box.style.display = "none";
        add_sub_box.style.display = "block";
      }
    }
  } else {
    units_mul_option.style.display = "none";
  }
});

for (const btn of measureCalc_btns) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    for (const ele of numInputs) {
      if (!ele.checkValidity()) {
        console.log(units.mode_am_pm);
        error.innerHTML =
          `<b>'${ele.placeholder}'</b> ` +
          ele.validationMessage +
          `<br><img src="./images/brain_confused.jpg" width="120px"> `;

        error.style.display = "block";
        setTimeout(() => {
          error.style.display = "none";
        }, 2000);
        return;
      }
    }

    let i1 = {},
      i2 = {};
    let i = 0;
    for (const k of units.units) {
      i1[k] = measure_1[i].value;
      i2[k] = measure_2[i].value;
      i++;
    }

    let mode_type = "none";
    let mode = document.getElementsByName("mode");
    for (const e of mode) {
      if (e.checked) {
        mode_type = e.id;
      }
    }

    // console.log(i1, i2, mode_type);
    if (units.sys_type == "metric") {
      if (btn.value == "Multiply" || btn.value == "Divide") {
        let inp2 = measure_2[0].value;
        res = metricOperation(i1, inp2, btn.value);
      } else if (btn.value == "Add" || btn.value == "Subtract") {
        res = metricOperation(i1, i2, btn.value);
      }
      console.log(res);
      loadEle(resString(res));
    } else if (units.sys_type == "time") {
      res = timeOperation(i1, i2, btn.value, mode_type);
      loadEle(resString(res));
    }
  });
}

function resString(resArr) {
  let resString = ``;

  for (const key in resArr) {
    if (units.sys_type == "metric" && resArr[key]) {
      for (let i = 0; i < units.placeholder.length; i++) {
        if (key == units.units[i]) {
          resString += `${resArr[key]} ${units.placeholder[i]} `;
        }
      }
    } else if (units.sys_type == "time" && resArr[key]) {
      for (let i = 0; i < units.placeholder.length; i++) {
        if (key == units.units[i]) {
          resString += `${resArr[key]} ${units.placeholder[i]} `;
        }
      }
      if (key == "mode") {
        resString += `<p>${resArr[key]}</p>`;
      }
    }
  }
  return resString;
}

function changeInputCall(arr) {
  // placeholder array
  changeInput(arr.length, arr, measure_1);
  changeInput(arr.length, arr, measure_2);
}

// // ____________________________________________________
// // LOGIC GOES ON

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
  for (let i = 1; i <= numberInputs.length; i++) {
    if (i > n) {
      numberInputs[i - 1].style.display = "none";
    } else {
      numberInputs[i - 1].style.display = "block";
      numberInputs[i - 1].placeholder = placeValue[i - 1];
    }
  }
}

// Conversion FUNCTIONS
// _________________________________________________

const metricSys = {
  mega: 10 ** 6,
  kilo: 10 ** 3,
  unit: 1,
  centi: 10 ** -2,
  milli: 10 ** -3,
  micro: 10 ** -6,
  nano: 10 ** -9,
};

const dataSys = {
  bit: 2 ** -3,
  byte: 1,
  kilobyte: 2 ** 10,
  megabyte: 2 ** 20,
  gigabyte: 2 ** 30,
  terabyte: 2 ** 40,
};

const TimeSys = {
  hour: 3600, // (3600 sec/hr)
  minute: 60,
  second: 1,
};

function converter(val, u1, u2, sys = metricSys) {
  let res = val;
  for (const key in sys) {
    if (key == u1) {
      res = res * sys[key];
    } else if (key == u2) {
      res = res / sys[key];
    }
  }
  return res;
}

function valOf(arr, sys = metricSys, base = "unit") {
  //default metric sys_type
  let val = 0;
  for (const key in arr) {
    val += converter(arr[key], key, base, sys);
  }
  return val;
}

// console.log(valOf({hour:10,second:1000}, TimeSys, 'second'));
// console.log(converter(5, 'hour','minute',TimeSys));
console.log(
  toNormalUnits(37000, { hour: 0, minute: 10, second: 40 }, TimeSys, "second")
);

function toNormalUnits(val, modelArr, sys = metricSys, base = "unit") {
  let res = 0,
    resArr = {},
    keys = Object.keys(modelArr);

  console.log(keys);
  for (let i = 0; i < keys.length; i++) {
    res = Math.floor(converter(val, base, keys[i], sys));
    val -= converter(res, keys[i], base, sys);
    resArr[keys[i]] = res;

    if (val <= 0) {
      return resArr;
    }
  }
  // res = converter( val, base, keys[keys.length - 1], sys ) ;
  // val -= converter( res, keys[keys.length - 1], base, sys );
  // resArr[keys[keys.length - 1]] = res;
  return resArr;
}

function metricOperation(inp1, inp2, op) {
  // input2 can be number and array based on conditions (multiply / divide)
  // all 4 operations
  let res = 0;
  let val1 = valOf(inp1, metricSys, "unit");
  let val2 = 0;

  if (op == "Multiply" || op == "Divide") {
    val2 = Number(inp2);
    if (op == "Multiply") {
      res = val1 * val2;
    } else {
      res = val1 / val2;
    }
  } else if (op == "Add" || op == "Subtract") {
    val2 = valOf(inp2, metricSys, "unit");
    if (op == "Subtract") {
      res = val1 - val2;
    } else {
      res = val1 + val2;
    }
  }

  console.log(res);
  console.log(inp1);
  console.log(toNormalUnits(res, inp1, metricSys, "unit"));
  let resArr = toNormalUnits(res, inp1, metricSys, "unit");
  return resArr;
}

function valOfTime(time_arr, mode = "none") {
  let res = valOf(time_arr, TimeSys, "second");
  if (mode == "pm") {
    res += 12 * 3600;
  }
  return res;
}

// console.log(valOfTime({hour:10,second:1000}));
// console.log(converter(5, 'hour','minute',TimeSys));
// console.log( toTimeUnits(50000) );

function toTimeUnits(val, mode = "none") {
  let time = { hour: 0, minute: 0, second: 0, mode: "am" };
  let duration = toNormalUnits(
    val,
    { hour: 0, minute: 0, second: 0 },
    TimeSys,
    "second"
  );
  time.hour = duration.hour % 24;
  time.minute = duration.minute;
  time.second = duration.second;

  if (time.hour >= 12) {
    time.hour -= 12;
    time.mode = "pm";
  }

  let res;
  let resString = ``;
  if (mode != "none") {
    return time;
  } else {
    return duration;
  }
}

// console.log( timeOperation(
//       {hour:1,minute:20,second:0},
//       {hour:0,minute:200,second:0},
//       'Add') );
// console.log( toTimeUnits(16800));

function timeOperation(inp1, inp2, op, time_mode = "none") {
  // input1 can be time or duration based on conditions (am/pm) or normal
  // only 2 operations
  let res = 0;
  // duration
  let val2 = valOfTime(inp2, "none");
  let val1 = valOfTime(inp1, time_mode);

  if (op == "Add") {
    res = val1 + val2;
  } else if (op == "Subtract") {
    res = val1 - val2;
  }

  return toTimeUnits(res, time_mode);
}

// let var1 = {minute:120, hour: 1}, var2 = {kilo: 12, unit: 500}
// console.log(Object.keys(var1));
// console.log(valOf(var1, TimeSys, 'second'));
