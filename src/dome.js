window.dome = (function () {
    function Dome(els) {
        for(var i = 0; i < els.length; i++ ) {
            this[i] = els[i];
        }
        this.length = els.length;
    }
    // ========= UTILS =========
    Dome.prototype.forEach = function (callback) {
        this.map(callback);
        return this; 
    };
    Dome.prototype.map = function (callback) {
        var results = [];
        for (var i = 0; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results; //.length > 1 ? results : results[0];
    };
    Dome.prototype.mapOne = function (callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    // ========== DOM MANIPULATION ==========
    Dome.prototype.text = function (text) {
        if (typeof text !== "undefined") {
            return this.forEach(function (el) {
                el.innerText = text;
            });
        } else {
            return this.mapOne(function (el) {
                return el.innerText;
            });
        }
    };

    Dome.prototype.html = function (html) {
        if (typeof html !== "undefined") {
            return this.forEach(function (el) {
                el.innerHTML = html;
            });
        } else {
            return this.mapOne(function (el) {
                return el.innerHTML;
            });
        }
    };
    var dome = {
        get: function (selector) {
            var els;
            if (typeof selector === 'string') {
                els = document.querySelectorAll(selector);
            } else if (selector.length) { 
                els = selector;
            } else {
                els = [selector];
            }
            return new Dome(els);
        }
    };
    return dome;
}());
