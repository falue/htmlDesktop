(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    baseURL: "http://www.animexxsandbox/"
};

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _easter = require("./modules/specials/easter");

var _easter2 = _interopRequireDefault(_easter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
    _createClass(Main, [{
        key: "onReady",
        value: function onReady() {
            //new EasterEggSearch();
        }
    }]);

    function Main() {
        _classCallCheck(this, Main);

        this.onReady();
    }

    return Main;
}();

new Main();

},{"./modules/specials/easter":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajax = require("./../../tools/ajax");

var _ajax2 = _interopRequireDefault(_ajax);

var _layer = require("./../../tools/layer");

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EasterEggSearch = function () {
    _createClass(EasterEggSearch, [{
        key: "showPrize",
        value: function showPrize() {
            // do all the ajax stuff

            var ajax = new _ajax2.default({
                url: '/osteraktion.php?action=updatePrize',
                error: function error(_error) {
                    console.log(_error);
                },
                success: function success(data) {
                    console.log(data);
                }
            });
            ajax.call({ data: this.prize });

            var text = {
                yolk: {
                    title: 'Mist nur ein Dotter. Weitersuchen!'
                },
                bunny: {
                    title: 'Wow, direkt ein Hase!'
                },
                golden_bunny: {
                    title: 'Wahnsinn, Du hast den Hauptpreis gefunden!'
                },
                platypus: {
                    title: 'Super ein Schnabeltier mehr!'
                }
            };

            var options = {
                title: text[this.prize].title,
                html: '<img src="/img/easter_action/' + this.prizeImage + '"/>',
                buttonText: 'Schliessen'
            };
            new _layer2.default(options);
        }
    }, {
        key: "hitOnEgg",
        value: function hitOnEgg() {
            console.log('hitonEgg');
            var that = this;
            this.eggHits++;
            console.log(this.eggHits);
            if (this.eggHits === 1) {
                that.template.attr('src', that.eggsImagesPath + that.eggsImagesCrack1[that.eggIndex]);
            }

            if (this.eggHits === 3) {
                that.template.attr('src', that.eggsImagesPath + that.eggsImagesCrack2[that.eggIndex]);
            }

            if (this.eggHits === 5) {
                this.template.remove();
                this.showPrize();
            }
        }
    }, {
        key: "showEgg",
        value: function showEgg() {

            var _template = $('<img src="' + this.eggsImagesPath + this.egg + '"/>');
            _template.css({
                'position': 'fixed',
                'z-index': '9999999999',
                'left': Math.floor(Math.random() * $(window).width()) + 'px',
                'top': Math.floor(Math.random() * $(window).height()) + 'px',
                'max-width': '100px'
            });
            var that = this;
            _template.on('click', function () {
                console.log('click');
                that.hitOnEgg();
            });
            this.template = _template;

            $('body').append(that.template);
        }
    }]);

    function EasterEggSearch() {
        _classCallCheck(this, EasterEggSearch);

        //TODO get ajax golden_bunny_still_in_game
        var that = this;
        var ajax = new _ajax2.default({
            url: '/osteraktion.php?action=getGoldenStatus',
            error: function error(_error2) {
                console.log(_error2);
            },
            success: function success(data) {
                console.log('data: ' + data);
                var golden_bunny_still_in_game = !data;

                that.found = Math.random() >= 0.1;

                var easter_start = new Date('2017-04-16').getTime();
                var easter_end = new Date('2017-04-18').getTime();
                var golden_bunny_in_game = new Date('2017-04-17').getTime();
                var now = new Date().getTime();

                console.log('jetzt: ' + now);
                console.log('easter_start: ' + easter_start);
                console.log('easter_end: ' + easter_end);

                if ($('body').hasClass('logged_in') && easter_end > now && easter_start < now || location.href.indexOf('osterblubb') !== -1) {
                    if (that.found) {
                        //ei anzeigen
                        that.eggHits = 0;
                        var min = 1;
                        var max = 1000;
                        var result = Math.floor(Math.random() * (max - min + 1)) + min;

                        that.eggsImagesPath = "/img/easter_action/";
                        that.eggsImages = ['Eier/01.png', 'Eier/02.png', 'Eier/03.png', 'Eier/04.png', 'Eier/05.png', 'Eier/06.png', 'Eier/07.png', 'Eier/08.png', 'Eier/09.png', 'Eier/10.png', 'Eier/11.png', 'Eier/12.png'];

                        that.eggsImagesCrack1 = ['Eier_Riss_1/01_Riss_1.png', 'Eier_Riss_1/02_Riss_1.png', 'Eier_Riss_1/03_Riss_1.png', 'Eier_Riss_1/04_Riss_1.png', 'Eier_Riss_1/05_Riss_1.png', 'Eier_Riss_1/06_Riss_1.png', 'Eier_Riss_1/07_Riss_1.png', 'Eier_Riss_1/08_Riss_1.png', 'Eier_Riss_1/09_Riss_1.png', 'Eier_Riss_1/10_Riss_1.png', 'Eier_Riss_1/11_Riss_1.png', 'Eier_Riss_1/12_Riss_1.png'];

                        that.eggsImagesCrack2 = ['Eier_Riss_2/01_Riss_2.png', 'Eier_Riss_2/02_Riss_2.png', 'Eier_Riss_2/03_Riss_2.png', 'Eier_Riss_2/04_Riss_2.png', 'Eier_Riss_2/05_Riss_2.png', 'Eier_Riss_2/06_Riss_2.png', 'Eier_Riss_2/07_Riss_2.png', 'Eier_Riss_2/08_Riss_2.png', 'Eier_Riss_2/09_Riss_2.png', 'Eier_Riss_2/10_Riss_2.png', 'Eier_Riss_2/11_Riss_2.png', 'Eier_Riss_2/12_Riss_2.png'];

                        that.dotterImages = ['Eier_Riss_3_Animation/01_Animation.gif', 'Eier_Riss_3_Animation/02_Animation.gif', 'Eier_Riss_3_Animation/03_Animation.gif', 'Eier_Riss_3_Animation/04_Animation.gif', 'Eier_Riss_3_Animation/05_Animation.gif', 'Eier_Riss_3_Animation/06_Animation.gif', 'Eier_Riss_3_Animation/07_Animation.gif', 'Eier_Riss_3_Animation/08_Animation.gif', 'Eier_Riss_3_Animation/09_Animation.gif', 'Eier_Riss_3_Animation/10_Animation.gif', 'Eier_Riss_3_Animation/11_Animation.gif', 'Eier_Riss_3_Animation/12_Animation.gif'];

                        that.bunnyImages = ['Hasen/01.png', 'Hasen/02.png', 'Hasen/03.png', 'Hasen/04.png', 'Hasen/05.png', 'Hasen/06.png', 'Hasen/07.png', 'Hasen/08.png', 'Hasen/09.png', 'Hasen/10.png', 'Hasen/11.png', 'Hasen/12.png', 'Hasen/13.png', 'Hasen/14.png', 'Hasen/15.png', 'Hasen/16.png', 'Hasen/17.png', 'Hasen/18.png', 'Hasen/19.png', 'Hasen/20.png', 'Hasen/21.png', 'Hasen/22.png', 'Hasen/23.png'];

                        that.platypusImages = ['Schnabeltiere/01_Schnabeltier.png', 'Schnabeltiere/02_Schnabeltier.png', 'Schnabeltiere/03_Schnabeltier.png', 'Schnabeltiere/04_Schnabeltier.png'];

                        that.eggIndex = Math.round(Math.random() * (that.eggsImages.length - 1));
                        that.bunnyIndex = Math.round(Math.random() * (that.bunnyImages.length - 1));
                        that.platypusIndex = Math.round(Math.random() * (that.platypusImages.length - 1));
                        that.egg = that.eggsImages[that.eggIndex];
                        that.prize = "";
                        if (result < 500) {
                            //dotter
                            that.prize = 'yolk';
                            that.prizeImage = that.dotterImages[that.eggIndex] + "?cachebuster=" + (Math.floor(Math.random() * 600000) + 1);
                        } else if (result > 500 && result <= 900) {
                            //schnabeltier
                            that.prize = 'platypus';
                            that.prizeImage = that.platypusImages[that.platypusIndex];
                        } else if (result > 900 && result <= 999) {
                            //hase
                            that.prize = 'bunny';
                            that.prizeImage = that.bunnyImages[that.bunnyIndex];
                        } else if (result === 1000) {
                            //goldener hase
                            if (golden_bunny_still_in_game && now > golden_bunny_in_game) {
                                that.prize = 'golden_bunny';
                                that.prizeImage = 'Hasen/00.png';
                            } else {
                                that.prize = 'platypus';
                                that.prizeImage = that.platypusImages[that.platypusIndex];
                            }
                        }

                        that.showEgg();
                    }
                }
            }
        });

        ajax.call();
    }

    return EasterEggSearch;
}();

exports.default = EasterEggSearch;
;

},{"./../../tools/ajax":4,"./../../tools/layer":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _globals = require("../globals.js");

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ajax = function () {
    _createClass(Ajax, [{
        key: "call",
        value: function call(postData) {
            var url = typeof this.obj_options.url !== "undefined" ? this.obj_options.url : _globals2.default.baseURL + "V2/scripts/ajax/call.php?call_arguments=" + obj_options.class + "|" + obj_options.method;
            var _success = typeof this.obj_options.success !== "undefined" ? this.obj_options.success : function (data) {
                console.log(data);
            };
            var _error = typeof this.obj_options.error !== "undefined" ? this.obj_options.error : function (error) {
                console.log(error);
            };
            var _always = typeof this.obj_options.always !== "undefined" ? this.obj_options.always : function (data) {
                console.log('AJAX-CALL');
            };

            $.ajax({
                "method": "POST",
                "url": url,
                "dataType": "json",
                "data": typeof postData !== "undefined" ? postData : ""
            }).done(function (data, textStatus, jqXHR) {
                _success(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _error(errorThrown);
            }).always(function (response) {
                _always(response);
            });
        }
    }]);

    function Ajax(obj_options) {
        _classCallCheck(this, Ajax);

        this.obj_options = obj_options;
    }

    return Ajax;
}();

exports.default = Ajax;

},{"../globals.js":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layer = function () {
    _createClass(Layer, [{
        key: 'open',
        value: function open() {
            $('body').append(this.template);
            $('body').find('#layer span, #layer button').on('click', function () {
                $('body').find('#layer').remove();
            });
        }
    }]);

    function Layer(obj_options) {
        _classCallCheck(this, Layer);

        console.log('obj_options');
        console.log(obj_options);

        var _template = '' + '<div id="layer">' + '<div class="layer">' + '<span class="icon-cancel-circle"></span>' + '<h2>' + obj_options.title + '</h2>' + '<div class="layer_content">' + obj_options.html + '</div>' + '<button>' + obj_options.buttonText + '</button>' + '</div>' + '</div>';

        this.template = $(_template);
        this.open();
    }

    return Layer;
}();

exports.default = Layer;
;

},{}]},{},[2]);

//# sourceMappingURL=main.js.map
