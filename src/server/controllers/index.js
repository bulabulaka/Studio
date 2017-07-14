"use strict";
exports.__esModule = true;
function sum(num1, num2, callback) {
    var total = num1 + num2;
    if (isNaN(total)) {
        var error = 'Something went wrong!';
        callback(error);
    }
    else {
        callback(null, total);
    }
}
exports.sum = sum;
