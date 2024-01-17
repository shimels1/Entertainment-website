const b = require("bcryptjs");

function palendren(str) {
  for (var key = 0; key < str.length / 2; key++) {
    if (str[key] != str[str.length - (key + 1)]) return "not palendrem";
  }
  return "is palendrem";
}
// /console.log(palendren("abdsba"));
function smallest(v) {
  var sml = v[0];
  var sml2 = v[1];
  for (var i = 1; i < v.length; i++) {
    if (sml > v[i]) {
      sml2 = sml;
      sml = v[i];
    } else if (sml2 > v[i]) {
      sml2 = v[i];
    }
  }
  return sml2;
}

//console.log(smallest([5, 3, 5, 1, 8]))

function sort(v, upto) {
  for (var i = 0; i < v.length; i++) {
    for (var j = 0; j < v.length; j++) {
      if (v[i] < v[j] && v[i] <= upto) {
        var temp = v[i];
        v[i] = v[j];
        v[j] = temp;
      }
    }
  }
  return v;
}

//console.log("sorted value : ",sort([5, 3, 44, 1, 8],44))

async function by() {
  const salt = await b.genSalt();
  const hash = await b.hash("123", salt);
  console.log(hash);
}
by();
