'use strict';

import $ = require('jquery');

export default class Console {

    public constructor() {

        var consoleWrapper = $('<div>').appendTo($('body'));

        console.error = console.log = console.info = console.debug = function () {
            let s = '';
            for (let i = 0; i < arguments.length; i++) {
                s += toString(arguments[i]) + ' ';
            }
            consoleWrapper.append(`<p>${s}</p>`);
            // while (consoleDiv.children().length > 10) {
            //     consoleDiv.children().first().remove();
            // }
            // alert("console: " + s);
            // $.ajax({
            //     url: 'http://192.168.1.99:9999/log/',
            //     type: 'POST',
            //     data: {
            //         text: s
            //     }
            // });
        }

        function toString(x) {
            if (isPrimitive(x)) {
                return x;
            }
            var simpleObject = {};
            for (var attr in x) {
                var value = x[attr];
                if (isPrimitive(value)) {
                    simpleObject[attr] = value;
                } else {
                    simpleObject[attr] = `--${typeof value}--`;
                }
            }

            var t = JSON.stringify(simpleObject);
            return t.replace(/:/g, ': ');
        }

        function isPrimitive(value) {
            return typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean';
        }

    }

}
