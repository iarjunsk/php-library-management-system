//url encodeURl  fn
exports.encode=function encode(str) {
    str = (str + '')
        .toString();
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27') .replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+').replace(/~/g, '%7E').replace(/%3D/g,'=').replace(/%26/g,'&').replace(/%0A/g,'%5C%5Cn');
}

//db real escape char fn
exports.escapestr=function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

//eplode function phpfn
exports.explode = function explodew (delimiter, string, limit) {
  //  discuss at: http://locutus.io/php/explode/
  // original by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: explode(' ', 'Kevin van Zonneveld')
  //   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]
  if (arguments.length < 2 ||
    typeof delimiter === 'undefined' ||
    typeof string === 'undefined') {
    return null
  }
  if (delimiter === '' ||
    delimiter === false ||
    delimiter === null) {
    return false
  }
  if (typeof delimiter === 'function' ||
    typeof delimiter === 'object' ||
    typeof string === 'function' ||
    typeof string === 'object') {
    return {
      0: ''
    }
  }
  if (delimiter === true) {
    delimiter = '1'
  }
  // Here we go...
  delimiter += ''
  string += ''
  var s = string.split(delimiter)
  if (typeof limit === 'undefined') return s
  // Support for limit
  if (limit === 0) limit = 1
  // Positive limit
  if (limit > 0) {
    if (limit >= s.length) {
      return s
    }
    return s
      .slice(0, limit - 1)
      .concat([s.slice(limit - 1)
        .join(delimiter)
      ])
  }
  // Negative limit
  if (-limit >= s.length) {
    return []
  }
  s.splice(s.length + limit)
  return s
}

/*
exports.exandlist=function exanli(val,keys,delimit)
var values=val.split("\'"+delimit+"\'")
  var final = {};

for(var i = 0; i < values.length; i++){
    final[keys[i]] = values[i];
}
return final
};*/
