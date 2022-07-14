"use strict";
exports.__esModule = true;
exports.Methods = exports.Enums = void 0;
var Enums;
(function (Enums) {
    var SortedBy;
    (function (SortedBy) {
        SortedBy["Updoots"] = "updoots";
        SortedBy["Downdoots"] = "downdoots";
        SortedBy["UploaderID"] = "uploaderID";
        SortedBy["CSHUsername"] = "cshUsername";
        SortedBy["DootDifference"] = "dootDifference";
        SortedBy["AbsoluteDootDifference"] = "absoluteDootDifference";
    })(SortedBy = Enums.SortedBy || (Enums.SortedBy = {}));
    var Direction;
    (function (Direction) {
        Direction["Ascending"] = "ascending";
        Direction["Descending"] = "descending";
    })(Direction = Enums.Direction || (Enums.Direction = {}));
})(Enums = exports.Enums || (exports.Enums = {}));
var stringToPrimitive = function (string, desiredPrimitive) {
    return {
        boolean: function () { return string === "true"; },
        number: function () { return Number(string); },
        bigint: function () { return BigInt(string); },
        string: function () { return string; },
        symbol: function () { return Symbol(string); },
        object: function () { return JSON.parse(string); }
    }[desiredPrimitive]();
};
var Methods;
(function (Methods) {
    Methods.reqMsg = function (varName) {
        return "".concat(varName, " required, please configure your environment variables");
    };
    Methods.parseEnvVar = function (failureDefault) {
        var possibleEnvVarNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            possibleEnvVarNames[_i - 1] = arguments[_i];
        }
        var desiredPrimitive = typeof failureDefault;
        for (var _a = 0, possibleEnvVarNames_1 = possibleEnvVarNames; _a < possibleEnvVarNames_1.length; _a++) {
            var envVarName = possibleEnvVarNames_1[_a];
            var envVar = process.env[envVarName];
            if (typeof envVar !== "undefined") {
                console.log(envVar);
                return stringToPrimitive(envVar, desiredPrimitive);
            }
        }
        return failureDefault;
    };
    Methods.pathJoin = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return parts.join("/").replace(new RegExp("^/(?!//)([/{1,}]+)$", "g"), "/");
    };
    Methods.addEventListeners = function (types, callbacks) {
        if (Array.isArray(callbacks) && callbacks.length > 1) {
            if (types.length !== callbacks.length)
                throw new Error("Length of types and length of callback provided to Utility.addEventListeners not equal");
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
    Methods.mousePositionFromEvent = function (evt) {
        if (evt.type.includes("mouse")) {
            return [evt.clientX, evt.clientY];
        }
        else if (evt.type.includes("touch")) {
            var touch = evt.touches[0] || evt.changedTouches[0];
            return [touch.pageX, touch.pageY];
        }
    };
    Methods.sortedByToString = function (sortedBy) {
        if (sortedBy === Enums.SortedBy.CSHUsername)
            return "CSH Username";
        else if (sortedBy === Enums.SortedBy.UploaderID)
            return "Uploader ID";
        return sortedBy
            .split(/(?=[A-Z])/)
            .map(function (str) { return str[0].toUpperCase() + str.substring(1, str.length); })
            .join(" ");
    };
    Methods.directionToString = function (direction) {
        return direction[0].toUpperCase() + direction.substring(1, direction.length);
    };
    Methods.directionEnumToSQL = function (input) {
        return input === "ascending" ? "ASC" : input === "descending" ? "DESC" : "DESC";
    };
})(Methods = exports.Methods || (exports.Methods = {}));
