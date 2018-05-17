"use strict";


var AnotherYou = function () {};

AnotherYou.prototype = {
    init: function () {},
    set: function (key, value) {
        var defaultData = JSON.parse(LocalContractStorage.get(key));
        var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
        data.push({
            key: key,
            value: value
        });
        if (data.length > 1) {
            LocalContractStorage.del(key);
        };
        LocalContractStorage.set(key, JSON.stringify(data));
    },
    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return LocalContractStorage.get(key);
    }
};
module.exports = AnotherYou;
