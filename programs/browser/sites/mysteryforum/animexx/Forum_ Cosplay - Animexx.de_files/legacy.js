/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"legacy": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./js/legacy.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/legacy.js":
/*!**********************!*\
  !*** ./js/legacy.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

var _foundation = __webpack_require__(/*! foundation-sites/js/foundation.core */ "./node_modules/foundation-sites/js/foundation.core.js");

var _foundationUtil = __webpack_require__(/*! foundation-sites/js/foundation.util.keyboard */ "./node_modules/foundation-sites/js/foundation.util.keyboard.js");

var _foundationUtil2 = __webpack_require__(/*! foundation-sites/js/foundation.util.mediaQuery */ "./node_modules/foundation-sites/js/foundation.util.mediaQuery.js");

var _foundationUtil3 = __webpack_require__(/*! foundation-sites/js/foundation.util.triggers */ "./node_modules/foundation-sites/js/foundation.util.triggers.js");

var _foundationUtil4 = __webpack_require__(/*! foundation-sites/js/foundation.util.motion */ "./node_modules/foundation-sites/js/foundation.util.motion.js");

var _foundation2 = __webpack_require__(/*! foundation-sites/js/foundation.reveal */ "./node_modules/foundation-sites/js/foundation.reveal.js");

var _GameBubblePuzzle = __webpack_require__(/*! ./modules/legacy/GameBubblePuzzle */ "./js/modules/legacy/GameBubblePuzzle.js");

var _GameBubblePuzzle2 = _interopRequireDefault(_GameBubblePuzzle);

var _GameHunt = __webpack_require__(/*! ./modules/legacy/GameHunt */ "./js/modules/legacy/GameHunt.js");

var _GameHunt2 = _interopRequireDefault(_GameHunt);

var _GameEasterEggs = __webpack_require__(/*! ./modules/legacy/GameEasterEggs */ "./js/modules/legacy/GameEasterEggs.js");

var _GameEasterEggs2 = _interopRequireDefault(_GameEasterEggs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_foundation.Foundation.addToJquery(_jquery2.default);

_foundation.Foundation.Keyboard = _foundationUtil.Keyboard;
_foundation.Foundation.MediaQuery = _foundationUtil2.MediaQuery;
_foundation.Foundation.Triggers = _foundationUtil3.Triggers;
_foundation.Foundation.Reveal = _foundation2.Reveal;
_foundation.Foundation.Motion = _foundationUtil4.Motion;

window.jq = _jquery2.default;

if ((0, _jquery2.default)('[data-reveal]').length) {
	new _foundation.Foundation.Reveal((0, _jquery2.default)('[data-reveal]'));

	(0, _jquery2.default)('.reveal-overlay').wrap('<div class="rewind"></div>');
}

if ((0, _jquery2.default)('[data-game-bubble-puzzle]').length) {
	_GameBubblePuzzle2.default.init();
}

if ((0, _jquery2.default)('[data-game-hunt]').length) {
	_GameHunt2.default.init();
}

if ((0, _jquery2.default)('[data-game-easter-eggs]').length) {
	_GameEasterEggs2.default.init();
}

/***/ }),

/***/ "./js/modules/legacy/GameBubblePuzzle.js":
/*!***********************************************!*\
  !*** ./js/modules/legacy/GameBubblePuzzle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var GameBubblePuzzle = {
	init: function init() {

		var audio;

		jq.ajax({
			url: '/advent/bubble-puzzle/check-game',
			method: 'POST'
		}).done(function (response) {
			if (response.success) {
				if (response.enabled === true) {
					// define main container
					var container = document.querySelectorAll('.rewind');
					container = container[container.length - 1];
					var amountOfBubbles = Math.floor(Math.random() * 5) + 1;

					if (jq('.js-blubber-info').length) {
						jq('.js-blubber-info').html('Die Blasen sind gleich da!');
					}

					audio = new Audio('/images/advent/bubbles/blubb.wav');

					setTimeout(function () {
						createBubble(container, amountOfBubbles, 0);
					}, 2000);
				}
			}
		});

		jq('.js-advent-show-progress').on('click', function () {
			jq('.js-advent-content').html('');

			jq.ajax({
				url: '/advent/bubble-puzzle/progress',
				method: 'POST'
			}).done(function (response) {
				if (response.success) {
					jq('.js-advent-content').html(response.data.html).foundation('open');
				}
			});
		});

		function createBubble(container, amountOfBubbles, created) {
			// define bubble colors
			var colors = {
				0: 'blue',
				1: 'green',
				2: 'violet'
			};

			// create random bubble
			var elementContainer = document.createElement('div');
			elementContainer.classList.add('bubble-container');
			//elementContainer.setAttribute('data-open', 'advent-puzzle-suche');
			elementContainer.style.top = (created === 0 ? 100 : getRandomArbitrary(100, 150)) + '%';
			elementContainer.style.left = getRandomArbitrary(10, 90) + '%';

			var element = document.createElement('div');
			element.classList.add('bubble', 'bubble-' + colors[Math.floor(Math.random() * 3)]);

			elementContainer.appendChild(element);

			container.appendChild(elementContainer);

			elementContainer.classList.add('bubble-animation');
			element.classList.add('bubble-animation');

			elementContainer.addEventListener('click', function (event) {
				splashBubble(event.target);
			});

			elementContainer.addEventListener('touchstart', function (event) {
				splashBubble(event.target);
			});

			created++;

			if (created < amountOfBubbles) {
				setTimeout(function () {
					createBubble(container, amountOfBubbles, created);
				}, 3000);
			}
		}

		// prepare splash function
		function splashBubble(bubble) {
			jq('.js-advent-content').html('');
			audio.play();

			bubble.classList.remove('bubble-animation');
			bubble.classList.add('splash-animation');

			jq.ajax({
				url: '/advent/bubble-puzzle/splash',
				method: 'POST'
			}).done(function (response) {
				if (response.success) {
					jq('.js-advent-content').html(response.data.html).foundation('open');
				}
			});

			setTimeout(function () {
				bubble.parentNode.remove();
			}, 1000);
		}

		function getRandomArbitrary(min, max) {
			return Math.random() * (max - min) + min;
		}

		// add moving effect
		function moveBubble() {
			var bubbles = document.querySelectorAll('.bubble-container');

			for (var i = 0; i < bubbles.length; i++) {
				var currentBubble = bubbles[i];

				var position = currentBubble.style.top.replace('%', '');

				if (position < -50) {
					position = 120;
				}

				currentBubble.style.top = position - 0.33 + '%';
			}

			window.requestAnimationFrame(moveBubble);
		}

		window.requestAnimationFrame(moveBubble);
	}
};

exports.default = GameBubblePuzzle;

/***/ }),

/***/ "./js/modules/legacy/GameEasterEggs.js":
/*!*********************************************!*\
  !*** ./js/modules/legacy/GameEasterEggs.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var GameEasterEggs = {
	init: function init() {
		jq.ajax({
			url: '/easter/game/check-game',
			method: 'POST'
		}).done(function (response) {
			if (response.success) {
				if (response.enabled === true) {
					// define main container
					var container = document.querySelectorAll('.rewind');
					container = container[container.length - 1];

					if (jq('.js-game-info').length) {
						jq('.js-game-info').html('Das Ei ist gleich da!');
					}

					createEgg(container, response.data.number, response.token);
				}
			}
		});

		jq('.js-game-show-progress').on('click touchstart', function () {
			jq('.js-advent-content').html('');

			jq.ajax({
				url: '/easter/game/progress',
				method: 'POST'
			}).done(function (response) {
				if (response.success) {
					jq('.js-advent-content').html(response.data.html).foundation('open');
				}
			});
		});

		function createEgg(container, number, token) {
			var element = document.createElement('div');
			element.classList.add('easter-egg');
			element.style.top = getRandomArbitrary(10, 80) + 'vh';
			element.style.left = getRandomArbitrary(10, 80) + 'vw';
			element.style.display = 'none';

			var image = document.createElement('img');
			image.src = '/images/easter/eggs/ei-' + number + '.png';
			image.alt = 'Osterei';
			image.setAttribute('data-number', number);
			image.setAttribute('data-token', token);
			element.appendChild(image);

			container.appendChild(element);
			jq(element).fadeIn(200);
			element.classList.add('easter-egg-animation');

			element.addEventListener('click', function (event) {
				foundEgg(event.target);
			});
		}

		// prepare splash function
		function foundEgg(target) {
			jq('.js-advent-content').html('');

			jq.ajax({
				url: '/easter/game/found-egg',
				method: 'POST',
				data: {
					'number': target.getAttribute('data-number'),
					'token': target.getAttribute('data-token')
				}
			}).done(function (response) {
				jq('.js-advent-content').html(response.data.html).foundation('open');
			});

			setTimeout(function () {
				target.remove();
			}, 1000);
		}

		function getRandomArbitrary(min, max) {
			return Math.random() * (max - min) + min;
		}
	}
};

exports.default = GameEasterEggs;

/***/ }),

/***/ "./js/modules/legacy/GameHunt.js":
/*!***************************************!*\
  !*** ./js/modules/legacy/GameHunt.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var GameHunt = {
	init: function init() {
		jq.ajax({
			url: '/advent/hunt/check-game',
			method: 'POST',
			data: {
				'hunt-path': document.location.pathname
			}
		}).done(function (response) {
			if (response.success) {
				if (response.enabled === true) {
					// define main container
					var container = document.querySelectorAll('.rewind');
					container = container[container.length - 1];

					createLetter(container, response.data.letter, response.data.file);
				}
			}
		});

		jq('.js-hunt-show-progress').on('click touchstart', function () {
			jq('.js-advent-content').html('');

			jq.ajax({
				url: '/advent/hunt/progress',
				method: 'POST'
			}).done(function (response) {
				if (response.success) {
					jq('.js-advent-content').html(response.data.html).foundation('open');
				}
			});
		});

		function createLetter(container, letter, file) {
			// define bubble colors
			var colors = {
				0: 'gold',
				1: 'green',
				2: 'red',
				3: 'blue'
			};

			var currentColor = colors[Math.floor(Math.random() * 4)];

			var element = document.createElement('div');
			element.classList.add('letter' /*, 'letter-'+ currentColor*/);
			element.setAttribute('data-color', currentColor);
			element.style.top = getRandomArbitrary(10, 80) + 'vh';
			element.style.left = getRandomArbitrary(10, 80) + 'vw';
			element.style.display = 'none';

			var image = document.createElement('img');
			image.src = '/images/advent/letter/' + file;
			image.alt = letter;
			element.appendChild(image);

			container.appendChild(element);
			jq(element).fadeIn(200);
			element.classList.add('letter-animation');

			element.addEventListener('click', function (event) {
				foundLetter(event.target);
			});
		}

		// prepare splash function
		function foundLetter(letter) {
			jq('.js-advent-content').html('');

			jq.ajax({
				url: '/advent/hunt/found-letter',
				method: 'POST',
				data: {
					'hunt-path': document.location.pathname,
					'letter-color': letter.getAttribute('data-color')
				}
			}).done(function (response) {
				if (response.success) {
					jq('.js-advent-content').html(response.data.html).foundation('open');
				}
			});

			setTimeout(function () {
				letter.remove();
			}, 1000);
		}

		function getRandomArbitrary(min, max) {
			return Math.random() * (max - min) + min;
		}
	}
};

exports.default = GameHunt;

/***/ })

/******/ });
//# sourceMappingURL=legacy.js.map