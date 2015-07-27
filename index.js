var moment = require('moment');

var addPadding = function(number) {
  if (number<=999) { number = ("00"+number).slice(-3); }
  return number;
};

var checksum = function(d, n) {
  d = "" + d;
  n = "" + n;

  // Information about checksum generation: http://www.fnrinfo.no/Teknisk/KontrollsifferSjekk.aspx
  var c1 = 11 - ((3*d[0] + 7*d[1] + 6*d[2] + 1*d[3] + 8*d[4] + 9*d[5] + 4*n[0] + 5*n[1] + 2*n[2]) % 11);
  if (c1 === 11){
    c1 = 0;
  }
  if (c1 === 10){
    return "INVALID";
  }

	var c2 = 11 - ((5*d[0] + 4*d[1] + 3*d[2] + 2*d[3] + 7*d[4] + 6*d[5] + 5*n[0] + 4*n[1] + 3*n[2] + 2*c1) % 11);
  if (c2 === 11){
    c2 = 0;
  }
  if (c2 === 10){
    return "INVALID";
  }

  return "" + c1 + c2;
};

var generate = function(dateOfBirth, sex){
  var result = [];
  var dateComponent = moment(dateOfBirth);

  var fullYear = dateComponent.format('YYYY');
  var year = dateComponent.format('YY');
  var month = dateComponent.format('MM');
  var day = dateComponent.format('DD');
  var prefix = day + month + year;

  var i;
  var pnr = [];
  var fnr = [];
  var nextNumber = function(){
    i = i-1;
  }

  if (sex) {
    if (sex.toLowerCase()[0] === 'm'){
      nextNumber = function(){
        if(i % 2 === 0) i=i-1;
        i=i-2;
      };
    } else if(sex.toLowerCase()[0] == 'f') {
      nextNumber = function(){
        if (i % 2 === 0) i=i-2;
        i=i-1;
      };
    }
  }

  if (fullYear >= 1854 && fullYear <= 1899){
    for(i = 749; i >= 500; nextNumber(i)){
      pnr.push(addPadding(i));
    }
  }

  if (fullYear >= 1900 && fullYear <= 1999){
    for(i = 499; i >= 000; nextNumber(i)){
      pnr.push(addPadding(i));
    }
  }

  if (fullYear >= 1940 && fullYear <= 1999){
    for(i = 999; i >= 900; nextNumber(i)){
      pnr.push(addPadding(i));
    }
  }

  if (fullYear >= 2000 && fullYear <= 2039){
    for(i = 999; i >= 500; nextNumber(i)){
      pnr.push(addPadding(i));
    }
  }

  pnr.forEach(function(n){
    var number = prefix + n + checksum(prefix, n);
    if (number.length === 11) fnr.push(number);
  });

  return fnr;
};

module.exports = { generate: generate };