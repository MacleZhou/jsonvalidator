/*Allowed Values in Attribute are:
1. Any function,
2. Any RegExp,
3. Any Array(Values should be within this Array)

ARRAY_ELEMENTS_TYPES : It can be an array or Object
*/
function IsString(value) {
    if (typeof value != "string") {
        return false
    }
    return true;
}
function IsNumber(value) {
    if (typeof value != "number") {
        return false
    }
    return true;
}
function IsNumeric(alphaa) {
    if (typeof alphaa != "string") {
        return false
    }
    for (var j = 0; j < alphaa.length; j++) {
        var alphaa = alphaa.charAt(j);
        var hh = alphaa.charCodeAt(0);
        if (!(hh > 47 && hh < 58)) {
            return false;
        }
    }
    return true;
}
function IsBoolean(Value) {
    if (typeof Value != "boolean")
        return false;
    return true;
}
function IsDate(currVal) {
    if (currVal == '') return false;

    var dtArray = currVal.split("-"); // is format OK?
    if (dtArray == null || dtArray.length != 3) return false;

    if (dtArray[0].length != 2 || dtArray[2].length != 4) {
        return false;
    }

    var dtDay = Number(dtArray[0]);
    var dtYear = Number(dtArray[2]);

    if (!dtDay || !dtYear)
        return false;
    var dtMonth = dtArray[1];
    if (typeof dtMonth != "string" && Number(dtMonth))
        return;
    // case sensitive
    switch (dtMonth.toLowerCase()) {
        case 'jan':
            dtMonth = '01';
            break;
        case 'feb':
            dtMonth = '02';
            break;
        case 'mar':
            dtMonth = '03';
            break;
        case 'apr':
            dtMonth = '04';
            break;
        case 'may':
            dtMonth = '05';
            break;
        case 'jun':
            dtMonth = '06';
            break;
        case 'jul':
            dtMonth = '07';
            break;
        case 'aug':
            dtMonth = '08';
            break;
        case 'sep':
            dtMonth = '09';
            break;
        case 'oct':
            dtMonth = '10';
            break;
        case 'nov':
            dtMonth = '11';
            break;
        case 'dec':
            dtMonth = '12';
            break;
    }
    // convert date to number
    dtMonth = Number(dtMonth);
    if (isNaN(dtMonth)) return false;
    else if (dtMonth < 1 || dtMonth > 12) return false;
    else if (dtDay < 1 || dtDay > 31) return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap)) return false;
    }
    return true;
}
function IsAlphanumeric(alphane) {
    if (typeof alphane != "string" || !alphane.length) {
        return false;
    }
    for (var j = 0; j < alphane.length; j++) {
        var alphaa = alphane.charAt(j);
        var hh = alphaa.charCodeAt(0);
        if (!(hh > 64 && hh < 91) && !(hh > 96 && hh < 123) && !(hh > 47 && hh < 58)) {
            return false;
        }
    }
    return true;
}

function IsAlphabetic(alphane) {
    if (typeof alphane != "string" || !alphane.length) {
        return false;
    }
    for (var j = 0; j < alphane.length; j++) {
        var alphaa = alphane.charAt(j);
        var hh = alphaa.charCodeAt(0);
        if (!(hh > 64 && hh < 91) && !(hh > 96 && hh < 123)) {
            return false;
        }
    }
    return true;
}

Attributes = {
    "STRING": IsString,
    "ALPHABETIC": IsAlphabetic,
    "NUMBER": IsNumber,
    "BOOLEAN": IsBoolean,
    "ALPHANUMERIC": IsAlphanumeric,
    "DATE": IsDate,
    "PRCREQUESTID": /^PRC.{1,10}$/
}

var ValidationRules = {
    DUMMY_REQUEST : {
        KIND: "OBJECT",
        ISMANDATORY: "Y",
        OBJECT_PROPERTIES: ["REQUESTID", "DATE", "DATA"],
        //RULENAME   , IsMandatory
        REQUESTID: "5", 
        DATE: ["DATE", "Y"],
        DATA: {
            KIND: "ARRAY",
            ISMANDATORY: "Y",
            MINOCCURANCE: 1,
            MAXOCCURANCE: -1,
            ARRAY_ELEMENTS_TYPES: {
                KIND: "OBJECT",
                ISMANDATORY: "Y",
                OBJECT_PROPERTIES: ["FILENAME","CONTENT"],
                FILENAME: ["STRING", "Y"],
                CONTENT: ["STRING", "Y"]
            }
        }
    }
}