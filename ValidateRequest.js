function ValidateRequest(request, method) {
    this.method = method;
    this.request = request;
    this.e = [];
    this.Depth = [];
    if (!ValidationRules.hasOwnProperty(method)) {
        this.e.push("No rule defined for this method :" + method)
        return false;
    }
    var rule = ValidationRules[method];
    var request = this.request;
    this.Depth.push("Request");
    this.start_validate(rule, request);
    this.Depth.pop();
    return this;
}

ValidateRequest.prototype.start_validate = function (rule, request) {
    if (rule.KIND == "OBJECT") {
        this.validateObject(rule, request);
    } else if (rule.KIND == "ARRAY") {
        this.validateArray(rule, request);
    } else {
        debugger;
    }
}
ValidateRequest.prototype.validateObject = function (rule, request) {
    if (rule.ISMANDATORY == "N" && !request) {
        return true;
    } else if (rule.ISMANDATORY == "Y" && !request) {
        this.e.push("Missing Value/Attribute for " + this.Depth.join("."))
        return false;
    }
    for (var i = 0; i < rule.OBJECT_PROPERTIES.length; i++) {
        var element = rule.OBJECT_PROPERTIES[i];
        this.Depth.push(element);
        if (Array.isArray(rule[element])) {
            if (rule[element][1] == "Y") {
                if (!request.hasOwnProperty(element) || (typeof request[element] != "boolean" && !request[element])) {
                    this.e.push("Missing Value/Attribute for " + element);
                    return false;
                }
            } else {
                // Means it is not a Mandatory Value
                if (!request.hasOwnProperty(element) || (typeof request[element] != "boolean" && !request[element])) {
                    this.Depth.pop();
                    return true;
                }
            }
            if (typeof Attributes[rule[element][0]] == "function") {
                if (!Attributes[rule[element][0]](request[element], this.e)) {
                    this.e.push("Invalid Value for " + element);
                    return false;
                }
            } else if (Array.isArray(Attributes[rule[element][0]])) {
                if (Attributes[rule[element][0]].indexOf(request[element]) < 0) {
                    this.e.push("Invalid value for " + element);
                    return false;
                }
            } else {
                if (!request[element].toString().match(Attributes[rule[element][0]])) {
                    this.e.push("Invalid value for ::" + element);
                    return false;
                }
            }
        } else {
            this.start_validate(rule[element], request[element]);
        }
        this.Depth.pop();
    }
}
ValidateRequest.prototype.validateArray = function (rule, request) {
    var MinLength = rule.MINOCCURANCE;
    var MaxLength = rule.MAXOCCURANCE;
    var IsMandatory = rule.ISMANDATORY;
    var ElementTypes = typeof rule.ARRAY_ELEMENTS_TYPES;
    if (IsMandatory == "Y" && !request) {
        this.e.push("Missing Attribute " + this.Depth[this.Depth.length - 1]);
        return false;
    }
    if (IsMandatory == "N" && !request)
        return true;

    if (request.length < MinLength || (MaxLength > 0 && request.length > MaxLength)) {
        this.e.push("Invalid length for " + this.Depth[this.Depth.length - 1]);
        return false;
    }
    if (Array.isArray(ElementTypes)) {
        for (var i = 0; i < request.length; i++) {
            var element = request[i];
            this.Depth.push(element);
            if (Array.isArray(rule[element])) {
                if (rule[element][1] == "Y") {
                    if (!request.hasOwnProperty(element) || (typeof request[element] != "boolean" && !request[element])) {
                        this.e.push("Missing Value/Attribute for " + element);
                        return false;
                    }
                } else {
                    // Means it is not a Mandatory Value
                    if (!request.hasOwnProperty(element) || (typeof request[element] != "boolean" && !request[element])) {
                        return true;
                    }
                }
                if (typeof Attributes[rule[element][0]] == "function") {
                    if (!Attributes[rule[element][0]](request[element], this.e)) {
                        this.e.push("Invalid Value for " + element);
                        return false;
                    }
                } else if (Array.isArray(Attributes[rule[element][0]])) {
                    if (Attributes[rule[element][0]].indexOf(request[element]) < 0) {
                        this.e.push("Invalid value for " + element);
                        return false;
                    }
                } else {
                    if (!request[element].toString().match(Attributes[rule[element][0]])) {
                        this.e.push("Invalid value for " + element);
                        return false;
                    }
                }
            } else {
                this.start_validate(rule[element], request[element]);
            }
            this.Depth.pop();
        }
    } else {
        for (var i = 0; i < request.length; i++) {
            this.Depth.push(i);
            this.start_validate(rule.ARRAY_ELEMENTS_TYPES, request[i]);
            this.Depth.pop();
        }
    }
}

ValidateRequest.prototype.getResult = function () {
    if (this.e.length > 0) {
        return this.e.join(",");
    } else {
        return true;
    }
}