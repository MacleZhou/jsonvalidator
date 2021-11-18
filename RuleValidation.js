// This is the Prototype for Array.isArray //
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

function ValidateRule(ValidationRules) {
    this.KIND = ["OBJECT", "ARRAY"];
    this.ARRAY_ELEMENTS_TYPES = ["Array", "object"];
    this.Depth = [];
    this.e = [];
    if (typeof ValidationRules != "object") {
        this.e.push("ValidationRules is not an Object.");
        return false;
    }
    this.Depth.push("ValidationRules");
    for (var rules in ValidationRules) {
        this.Depth.push(rules);
        this.start_validate(ValidationRules[rules]);
        this.Depth.pop();
        this.ruleName = rules;
    }
    this.Depth.pop();
    return this;
}

ValidateRule.prototype.start_validate = function (rule) {
    if (typeof rule != "object") {
        this.e.push("Expected Object at " + this.Depth.join("->"));
        return false;
    }
    if (!rule.hasOwnProperty("KIND")) {
        this.e.push("Missing Property KIND at " + this.Depth.join("->"));
        return false;
    }
    if (this.KIND.indexOf(rule["KIND"]) < 0) {
        this.e.push("KIND is having Invalid Value at " + this.Depth.join("->"));
        return false;
    }
    if (rule.KIND == "OBJECT") {
        this.validateObject(rule);
    }
    if (rule.KIND == "ARRAY") {
        this.validateArray(rule);
    }
}

ValidateRule.prototype.validateObject = function (data) {
    if (!data.hasOwnProperty("OBJECT_PROPERTIES")) {
        this.e.push("Mandatory attribute OBJECT_PROPERTIES missing at " + this.Depth.join("->"));
        return;
    }
    if (!Array.isArray(data.OBJECT_PROPERTIES)) {
        this.e.push("OBJECT_PROPERTIES must be an Array at " + this.Depth.join("->"));
        return;
    }
    if (!data.hasOwnProperty("ISMANDATORY")) {
        this.e.push("Mandatory attribute ISMANDATORY missing at " + this.Depth.join("->"));
        return;
    }
    if (typeof data.ISMANDATORY != "string") {
        this.e.push("ISMANDATORY Expected as string " + this.Depth.join("->"));
    }
    if (["Y", "N"].indexOf(data.ISMANDATORY) < 0) {
        this.e.push("Invalid Value for ISMANDATORY at " + this.Depth.join("->"));
    }
    for (var i = 0; i < data.OBJECT_PROPERTIES.length; i++) {
        var element = data.OBJECT_PROPERTIES[i];
        if (!data.hasOwnProperty(element)) {
            this.e.push(element + " Missing in rule at " + this.Depth.join("->"));
        }
        if (!Array.isArray(data[element]) && (typeof data[element] != "object")) {
            this.e.push(element + " Must be either Array or Object at " + this.Depth.join("->"));
        }
        if (Array.isArray(data[element])) {
            if (data[element].length != 2) {
                this.e.push(element + " Length should be 2 at " + this.Depth.join("->"));
            }
            if (!Attributes.hasOwnProperty(data[element][0])) {
                this.e.push(" RULENAME : " + data[element][0] + " is not Valid at " + this.Depth.join("->"));
            }
            if (["Y", "N"].indexOf(data[element][1]) < 0) {
                this.e.push(element + " at index 1 can only have Y/N values at " + this.Depth.join("->"));
            }
        } else {
            this.Depth.push(element);
            this.start_validate(data[element]);
            this.Depth.pop();
        }
    }
}

ValidateRule.prototype.validateArray = function (data) {
    if (!data.hasOwnProperty("MINOCCURANCE")) {
        this.e.push("Mandatory attribute MINOCCURANCE missing.");
        return;
    }
    if (!data.hasOwnProperty("MAXOCCURANCE")) {
        this.e.push("Mandatory attribute MAXOCCURANCE missing.");
        return;
    }
    if (!data.hasOwnProperty("ARRAY_ELEMENTS_TYPES")) {
        this.e.push("Mandatory attribute ARRAY_ELEMENTS_TYPES missing.");
        return;
    }
    if (!data.hasOwnProperty("ISMANDATORY")) {
        this.e.push("Mandatory attribute ISMANDATORY missing at " + this.Depth.join("->"));
        return;
    }
    if (typeof data.ISMANDATORY != "string") {
        this.e.push("ISMANDATORY Expected as string " + this.Depth.join("->"));
    }
    if (["Y", "N"].indexOf(data.ISMANDATORY) < 0) {
        this.e.push("Invalid Value for ISMANDATORY at " + this.Depth.join("->"));
    }
    if (typeof data.ARRAY_ELEMENTS_TYPES != "object") {
        this.e.push("ARRAY_ELEMENTS_TYPES must be an Object in " + this.ruleName);
    }
    if (Array.isArray(data.ARRAY_ELEMENTS_TYPES)) {
        if (data.ARRAY_ELEMENTS_TYPES.length != 2) {
            this.e.push("ARRAY_ELEMENTS_TYPES Length should be 2");
        }
        if (!Attributes.hasOwnProperty(data.ARRAY_ELEMENTS_TYPES[0])) {
            this.e.push("ARRAY_ELEMENTS_TYPES RULENAME : " + data.ARRAY_ELEMENTS_TYPES[0] + " is not Valid.");
        }
        if (["Y", "N"].indexOf(data.ARRAY_ELEMENTS_TYPES[1]) < 0) {
            this.e.push("ARRAY_ELEMENTS_TYPES at index 1 can only have Y/N values.");
        }
    } else if (data.ARRAY_ELEMENTS_TYPES.KIND == "OBJECT") {
        this.Depth.push("ARRAY_ELEMENTS_TYPES");
        this.start_validate(data.ARRAY_ELEMENTS_TYPES);
        this.Depth.pop();
    }
}

ValidateRule.prototype.getErrors = function () {
    return this.e.join(",");
}

