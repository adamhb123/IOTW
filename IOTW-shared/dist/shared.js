"use strict";
exports.__esModule = true;
exports.directionEnumToSQL = exports.directionToString = exports.uploadColumnIDToString = exports.mousePositionFromEvent = exports.addEventListeners = exports.pathJoin = exports.parseEnvVar = exports.reqMsg = exports.isUploadsResponseStructure = exports.Direction = exports.UploadColumnID = exports.typeguardValidator = exports.isValidatableProperty = exports.ValidatableProperty = exports.stringToDataType = exports.isDataTypeString = void 0;
var isDataTypeString = function (x) {
    return typeof x === "string" &&
        ["boolean", "number", "bigint", "string", "symbol", "object"].includes(x);
};
exports.isDataTypeString = isDataTypeString;
var stringToDataType = function (string, desiredDataType) {
    return {
        boolean: function () { return string === "true"; },
        number: function () { return Number(string); },
        bigint: function () { return BigInt(string); },
        string: function () { return string; },
        symbol: function () { return Symbol(string); },
        object: function () { return JSON.parse(string); }
    }[desiredDataType]();
};
exports.stringToDataType = stringToDataType;
var ValidatableProperty = function (name, type) { return ({
    name: name,
    type: type
}); };
exports.ValidatableProperty = ValidatableProperty;
var isValidatableProperty = function (x) {
    var prop = x;
    return (typeof prop.name === "string" &&
        typeof prop.type === "string" &&
        (0, exports.isDataTypeString)(prop.type));
};
exports.isValidatableProperty = isValidatableProperty;
var typeguardValidator = function (validatee, propertiesToValidate) {
    var props = Array.isArray(propertiesToValidate)
        ? propertiesToValidate
        : [propertiesToValidate];
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        if (!((0, exports.isValidatableProperty)(prop) &&
            Object.prototype.hasOwnProperty.call(validatee, prop.name)))
            return false;
    }
    return true;
};
exports.typeguardValidator = typeguardValidator;
var UploadColumnID;
(function (UploadColumnID) {
    UploadColumnID["Updoots"] = "updoots";
    UploadColumnID["Downdoots"] = "downdoots";
    UploadColumnID["UploaderID"] = "uploaderID";
    UploadColumnID["CSHUsername"] = "cshUsername";
    UploadColumnID["DootDifference"] = "dootDifference";
    UploadColumnID["AbsoluteDootDifference"] = "absoluteDootDifference";
})(UploadColumnID = exports.UploadColumnID || (exports.UploadColumnID = {}));
var Direction;
(function (Direction) {
    Direction["Ascending"] = "ascending";
    Direction["Descending"] = "descending";
})(Direction = exports.Direction || (exports.Direction = {}));
var isUploadsResponseStructure = function (x) {
    return (0, exports.typeguardValidator)(x, [
        (0, exports.ValidatableProperty)("id", "string"),
        (0, exports.ValidatableProperty)("uploaderID", "string"),
        (0, exports.ValidatableProperty)("cshUsername", "string"),
        (0, exports.ValidatableProperty)("apiPublicFileUrl", "string"),
        (0, exports.ValidatableProperty)("imageUrl", "string"),
        (0, exports.ValidatableProperty)("imageMimetype", "string"),
        (0, exports.ValidatableProperty)("thumbnailUrl", "string"),
        (0, exports.ValidatableProperty)("thumbnailMimetype", "string"),
        (0, exports.ValidatableProperty)("updoots", "number"),
        (0, exports.ValidatableProperty)("downdoots", "number"),
        (0, exports.ValidatableProperty)("dootDifference", "number"),
        (0, exports.ValidatableProperty)("absoltueDootDifference", "number"),
    ]);
};
exports.isUploadsResponseStructure = isUploadsResponseStructure;
var reqMsg = function (varName) {
    return "".concat(varName, " required, please configure your environment variables");
};
exports.reqMsg = reqMsg;
var parseEnvVar = function (failureDefault) {
    var possibleEnvVarNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        possibleEnvVarNames[_i - 1] = arguments[_i];
    }
    var desiredData = typeof failureDefault;
    for (var _a = 0, possibleEnvVarNames_1 = possibleEnvVarNames; _a < possibleEnvVarNames_1.length; _a++) {
        var envVarName = possibleEnvVarNames_1[_a];
        var envVar = process.env[envVarName];
        if (typeof envVar !== "undefined") {
            return (0, exports.stringToDataType)(envVar, desiredData);
        }
    }
    return failureDefault;
};
exports.parseEnvVar = parseEnvVar;
var pathJoin = function () {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return parts.join("/").replace(new RegExp("^/(?!//)([/{1,}]+)$", "g"), "/");
};
exports.pathJoin = pathJoin;
var addEventListeners = function (types, callbacks) {
    if (Array.isArray(callbacks) && callbacks.length > 1) {
        if (types.length !== callbacks.length) {
            throw new Error("Length of types and length of callback provided to Utility.addEventListeners not equal");
        }
        for (var i = 0; i < types.length; i++)
            document.addEventListener(types[i], callbacks[i]);
    }
    else {
        if (Array.isArray(callbacks))
            callbacks = callbacks[0];
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            document.addEventListener(type, callbacks);
        }
    }
};
exports.addEventListeners = addEventListeners;
var mousePositionFromEvent = function (evt) {
    if (evt.type.includes("mouse")) {
        return [evt.clientX, evt.clientY];
    }
    else if (evt.type.includes("touch")) {
        var touch = evt.touches[0] || evt.changedTouches[0];
        return [touch.pageX, touch.pageY];
    }
};
exports.mousePositionFromEvent = mousePositionFromEvent;
var uploadColumnIDToString = function (uploadColumnID) {
    if (uploadColumnID === UploadColumnID.CSHUsername)
        return "CSH Username";
    else if (uploadColumnID === UploadColumnID.UploaderID)
        return "Uploader ID";
    return uploadColumnID
        .split(/(?=[A-Z])/)
        .map(function (str) { return str[0].toUpperCase() + str.substring(1, str.length); })
        .join(" ");
};
exports.uploadColumnIDToString = uploadColumnIDToString;
var directionToString = function (direction) {
    return direction[0].toUpperCase() + direction.substring(1, direction.length);
};
exports.directionToString = directionToString;
var directionEnumToSQL = function (input) {
    return input === "ascending" ? "ASC" : input === "descending" ? "DESC" : "DESC";
};
exports.directionEnumToSQL = directionEnumToSQL;
