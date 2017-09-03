/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = __webpack_require__(4);
const scopeFactory_1 = __webpack_require__(19);
class State {
    constructor(settings) {
        this.name = settings.name;
        this.url = settings.url;
        this.controller = settings.controller;
        this.template = settings.template;
        this.onEnter = settings.onEnter;
        this.onExit = settings.onExit;
        this.views = settings.views;
        this.parent = null;
        this._pathKeys = [];
        this._pathRegx = pathToRegexp(this.url, this._pathKeys);
        this._domContext = null;
        this._stateController = null;
        this._viewsControllers = [];
        this._data = null;
        this._setParent();
    }
    isRouteFulfill(path) {
        return !!this._pathRegx.exec(path);
    }
    resolvePathFromData(data) {
        return pathToRegexp.compile(this.url)(data);
    }
    resolveDataFromPath(path) {
        let data = null, results;
        if ((results = this._pathRegx.exec(path)) && results.length > 1) {
            results = results.slice(1);
            data = {};
            for (let i = 0, len = this._pathKeys.length; i < len; i++) {
                data[this._pathKeys[i].name] = results[i].toString();
            }
        }
        return data;
    }
    setData(data) {
        this._data = data;
    }
    getController() {
        return this._stateController;
    }
    activate(context) {
        if (this.onEnter) {
            this.onEnter(this);
        }
        let domContext;
        if (context) {
            domContext = context.getDOMContext();
        }
        else {
            domContext = document;
        }
        let parent = domContext.querySelector('[data-view]');
        parent.innerHTML = this.template;
        this._domContext = parent.firstChild;
        this._createController();
        this._renderViews();
    }
    getDOMContext() {
        return this._domContext;
    }
    deactivate() {
        if (this.onExit) {
            this.onExit(this);
        }
        if (this._stateController) {
            this._stateController.destroy();
            this._stateController = null;
        }
        this._data = null;
        this._domContext.parentElement.removeChild(this._domContext);
        this._domContext = null;
    }
    _createController() {
        let StateController = this.controller;
        if (StateController) {
            let scope = scopeFactory_1.default.create();
            this._stateController = new StateController(scope, this._data, this._domContext);
        }
    }
    _renderViews() {
        if (!this.views) {
            return;
        }
        Object.keys(this.views).forEach(viewName => {
            let view = this.views[viewName];
            viewName = view.name || viewName;
            let container = document.querySelector(`[data-view="${viewName}"]`);
            if (container) {
                let div = document.createElement('div');
                div.innerHTML = view.template;
                container.parentElement.replaceChild(div.firstChild, container);
                div = null;
            }
            let ViewController = view.controller;
            if (ViewController) {
                let scope = scopeFactory_1.default.create();
                this._viewsControllers.push(new ViewController(scope, this._data, container));
            }
        });
    }
    _setParent() {
        let stateParts = this.name.split('.');
        if (stateParts.length > 1) {
            this.parent = stateParts[0];
        }
    }
}
exports.State = State;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_containers_states__ = __webpack_require__(9);



window.router = new __WEBPACK_IMPORTED_MODULE_0__build__["Router"](__WEBPACK_IMPORTED_MODULE_1_containers_states__);

window.router.start();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Router_1 = __webpack_require__(3);
exports.Router = Router_1.Router;
var State_1 = __webpack_require__(0);
exports.State = State_1.State;
var Controller_1 = __webpack_require__(5);
exports.Controller = Controller_1.Controller;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = __webpack_require__(0);
const utils_1 = __webpack_require__(8);
class Router {
    constructor(states = {}) {
        this._origPushState = window.history.pushState;
        this._states = [];
        this._currentParentState = null;
        this._currentState = null;
        this._onPopState = this._onPopState.bind(this);
        this._setup();
        this._init(states);
    }
    _setup() {
        let self = this;
        window.history.pushState = function () {
            self._origPushState.apply(window.history, arguments);
            self._onPushState.apply(self, arguments);
        };
        window.addEventListener('popstate', this._onPopState, true);
    }
    _onPopState(e) {
        this._onPushState(e.state, null, window.location.pathname);
    }
    _init(states) {
        Object.keys(states).forEach(stateName => {
            let state = states[stateName];
            // in a case we're using states as object (the names are the key)
            if (!state.name) {
                state.name = stateName;
            }
            this.addState(state);
        });
    }
    _onPushState(data, title, url) {
        let state = this._findState(url);
        if (!state) {
            return;
        }
        state.setData(data);
        this._manageState(state);
    }
    _findState(urlOrName) {
        urlOrName = utils_1.trimEndSlash(urlOrName);
        // first, we want to find if there is an exact, non-parameters state url or state with the same name
        let exactState = this._states.find(x => utils_1.trimEndSlash(x.url) === urlOrName || x.name === urlOrName);
        if (exactState) {
            return exactState;
        }
        return this._states.find(x => x.isRouteFulfill(urlOrName));
    }
    _manageState(state) {
        if (this._currentState) {
            if (state.parent !== this._currentState.name) {
                this._currentState.deactivate();
            }
            else {
                this._currentParentState = this._currentState;
            }
        }
        if (state.parent && !this._currentParentState) {
            let parentState = this._findState(state.parent);
            if (parentState) {
                parentState.activate();
                this._currentParentState = parentState;
            }
        }
        else if (this._currentParentState && this._currentParentState.name !== state.parent) {
            this._currentParentState.deactivate();
            this._currentParentState = null;
        }
        this._currentState = state;
        state.activate(this._currentParentState);
    }
    get currentState() {
        return this._currentState;
    }
    go(urlOrName, data) {
        let state = this._findState(urlOrName);
        if (!state) {
            return;
        }
        let url = state.resolvePathFromData(data);
        window.history.pushState(data, null, url);
    }
    start() {
        let url = window.location.pathname;
        let state = this._findState(url);
        if (!state) {
            return;
        }
        let data = state.resolveDataFromPath(url);
        state.setData(data);
        this._manageState(state);
    }
    addState(state) {
        if (state instanceof Array) {
            state.forEach(x => this.addState(x));
        }
        else {
            this._states.push(new State_1.State(state));
        }
    }
}
exports.Router = Router;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined]
  '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = (options && options.delimiter) || '/'
  var delimiters = (options && options.delimiters) || './'
  var pathEscaped = false
  var res

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      pathEscaped = true
      continue
    }

    var prev = ''
    var next = str[index]
    var name = res[2]
    var capture = res[3]
    var group = res[4]
    var modifier = res[5]

    if (!pathEscaped && path.length) {
      var k = path.length - 1

      if (delimiters.indexOf(path[k]) > -1) {
        prev = path[k]
        path = path.slice(0, k)
      }
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
      pathEscaped = false
    }

    var partial = prev !== '' && next !== undefined && next !== prev
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = prev || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
    })
  }

  // Push any remaining characters.
  if (path || index < str.length) {
    tokens.push(path + str.substr(index))
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (data, options) {
    var path = ''
    var encode = (options && options.encode) || encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token
        continue
      }

      var value = data ? data[token.name] : undefined
      var segment

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
        }

        if (value.length === 0) {
          if (token.optional) continue

          throw new TypeError('Expected "' + token.name + '" to not be empty')
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        segment = encode(String(value))

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
        }

        path += token.prefix + segment
        continue
      }

      if (token.optional) {
        // Prepend partial segment prefixes.
        if (token.partial) path += token.prefix

        continue
      }

      throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  if (!keys) return path

  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        pattern: null
      })
    }
  }

  return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var delimiter = escapeString(options.delimiter || '/')
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|')
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      if (keys) keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a delimiter at the end of a match.
  if (!strict) {
    route += '(?:' + delimiter + '(?=' + endsWith + '))?'
  }

  if (end) {
    route += endsWith === '$' ? endsWith : '(?=' + endsWith + ')'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += '(?=' + delimiter + '|' + endsWith + ')'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys)
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
  }

  return stringToRegexp(/** @type {string} */ (path), keys, options)
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor(scope, stateData, domContext) {
        this.scope = scope;
        this.stateData = stateData || {};
    }
    destroy() {
        this.scope = null;
        this.stateData = null;
    }
}
exports.Controller = Controller;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build__);


class HomeController extends __WEBPACK_IMPORTED_MODULE_0__build__["Controller"] {
    constructor(scope, stateData, domContext) {
        super(scope, stateData, domContext);

        this._onProfileClick = this._onProfileClick.bind(this);
        this._onNameInputChange = this._onNameInputChange.bind(this);
        this._profileBtn = domContext.querySelector('#profileBtn');
        this._profileMeBtn = domContext.querySelector('#profileMeBtn');
        this._profileCustomBtn = domContext.querySelector('#profileCustomBtn');
        this._container = domContext.querySelector('.home-container');
        this._name = domContext.querySelector('.name');
        this._nameInput = domContext.querySelector('#name');

        this._profileBtn.addEventListener('click', this._onProfileClick, true);
        this._profileMeBtn.addEventListener('click', this._onProfileMeClick, true);
        this._profileCustomBtn.addEventListener('click', this._onProfileCustomClick, true);
        this._nameInput.addEventListener('keyup', this._onNameInputChange, true);

        scope.watch("name2", this._updateNameView, this);
    }

    _updateNameView(value, oldValue) {
        this._name.textContent = value;
    }

    _onNameInputChange(e) {
        this.scope.name2 = e.target.value;
    }

    _onProfileClick() {
        router.go('profile');
    }

    _onProfileMeClick() {
        router.go('profile.me');
    }

    _onProfileYouClick() {
        router.go('profile.you');
    }

    _onProfileCustomClick() {
        router.go('profile.user', { userId: 123456 });
    }

    destroy() {
        this._profileBtn.removeEventListener('click', this._onProfileClick, true);
        this._profileMeBtn.removeEventListener('click', this._onProfileMeClick, true);
        this._profileCustomBtn.removeEventListener('click', this._onProfileCustomClick, true);

        this._profileBtn = null;
        this._profileMeBtn = null;
        this._profileCustomBtn = null;
        this._container = null;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HomeController;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div class=\"home-container container\"> <div class=row> <div class=col-md-12> <div>Hello World!</div> <div><button id=profileBtn>Profile</button></div> <div><button id=profileMeBtn>Profile Me</button></div> <div><button id=profileCustomBtn>Profile Custom</button></div> <div><input type=text id=name /></div> <div class=name></div> </div> </div> </div>";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hasOwn = Object.prototype.hasOwnProperty;
exports.cloneDeep = (obj = {}) => JSON.parse(JSON.stringify(obj));
exports.shallowEqual = (a, b) => {
    if (a === b) {
        return true;
    }
    let countA = 0;
    let countB = 0;
    for (const key in a) {
        if (hasOwn.call(a, key) && a[key] !== b[key]) {
            return false;
        }
        countA++;
    }
    for (const key in b) {
        if (hasOwn.call(b, key)) {
            countB++;
        }
    }
    return countA === countB;
};
exports.trimEndSlash = (str) => {
    if (str.lastIndexOf('/') == str.length - 1) {
        return str.substr(0, str.length - 1);
    }
    return str;
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_homeState__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "homeState", function() { return __WEBPACK_IMPORTED_MODULE_0__home_homeState__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__profile_profileState__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "profileState", function() { return __WEBPACK_IMPORTED_MODULE_1__profile_profileState__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_me_meState__ = __webpack_require__(15);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "profileMeState", function() { return __WEBPACK_IMPORTED_MODULE_2__profile_me_meState__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__profile_user_userState__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "profileUserState", function() { return __WEBPACK_IMPORTED_MODULE_3__profile_user_userState__["a"]; });






/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HomeController__ = __webpack_require__(6);


/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'home',
    url: '/',
    controller: __WEBPACK_IMPORTED_MODULE_0__HomeController__["a" /* default */],
    template: __webpack_require__(7)
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProfileController__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UserInfoController__ = __webpack_require__(13);



/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'profile',
    url: '/profile',
    controller: __WEBPACK_IMPORTED_MODULE_0__ProfileController__["a" /* default */],
    template: __webpack_require__(14),
    views: {
        user_info: {
            controller: __WEBPACK_IMPORTED_MODULE_1__UserInfoController__["a" /* default */],
            template: `<div>Im a user info component :)</div>`
        }
    }
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build__);


class ProfileController extends __WEBPACK_IMPORTED_MODULE_0__build__["Controller"] {
    constructor() {
        super();

        this._onHomeClick = this._onHomeClick.bind(this);
        this._container = document.querySelector('.profile-container');
        this._homeBtn = document.querySelector('#homeBtn');

        this._container.classList.add('profile-page');

        this._homeBtn.addEventListener('click', this._onHomeClick, true);
    }

    _onHomeClick() {
        router.go('home');
    }

    destroy() {
        this._container = null;

        this._homeBtn.removeEventListener('click', this._onHomeClick, true);
        this._homeBtn = null;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProfileController;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build__);


class UserInfoController extends __WEBPACK_IMPORTED_MODULE_0__build__["Controller"] {

}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserInfoController;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<div class=\"profile-container container\"> <div class=row> <div class=col-md-8> <div>Profile Page!</div> <div><button id=homeBtn>Home</button></div> <div data-view></div> </div> <div class=col-md-4> <div data-view=user_info></div> </div> </div> </div>";

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProfileMeController__ = __webpack_require__(16);


/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'profile.me',
    url: '/profile/me',
    controller: __WEBPACK_IMPORTED_MODULE_0__ProfileMeController__["a" /* default */],
    template: `<div>I'm the Me view :)</div>`
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build__);


class ProfileMeController extends __WEBPACK_IMPORTED_MODULE_0__build__["Controller"] {
    constructor(stateData, rootDom) {
        super(stateData, rootDom);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProfileMeController;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProfileUserController__ = __webpack_require__(18);


/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'profile.user',
    url: '/profile/:userId',
    controller: __WEBPACK_IMPORTED_MODULE_0__ProfileUserController__["a" /* default */],
    template: `<div>I'm the Custom view :)</div>`
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__build__);


class ProfileUserController extends __WEBPACK_IMPORTED_MODULE_0__build__["Controller"] {
    constructor(stateData, rootDom) {
        super(stateData, rootDom);

        console.log(this.stateData)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProfileUserController;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EventDispatcher_1 = __webpack_require__(20);
class Scope extends EventDispatcher_1.default {
    watch(prop, handler, scope) {
        this.on(prop, handler, scope);
    }
    unwatch(prop, handler, scope) {
        this.un(prop, handler, scope);
    }
}
exports.Scope = Scope;
function createScope() {
    let scope = new Scope();
    return new Proxy(scope, {
        get: function (target, key) {
            return target[key];
        },
        set: function (target, key, value) {
            let oldVal = target[key];
            target[key] = value;
            scope.dispatch(key, value, oldVal);
            return true;
        },
        deleteProperty: function (target, key) {
            delete target[key];
            return true;
        }
    });
}
exports.default = {
    create: () => createScope()
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class EventDispatcher {
    on(name, fn, scope) {
        if (!this._eventDispatcherCallbacks) {
            this._eventDispatcherCallbacks = {};
        }
        let callbacks = this._eventDispatcherCallbacks[name];
        if (!callbacks) {
            this._eventDispatcherCallbacks[name] = callbacks = [];
        }
        callbacks.push({
            fn: fn,
            scope: (scope || this),
        });
        return this;
    }
    un(name, fn, scope) {
        if (this._eventDispatcherCallbacks) {
            let callbacks = this._eventDispatcherCallbacks[name];
            if (callbacks && callbacks.length > 0) {
                for (let i = callbacks.length - 1; i >= 0; i--) {
                    let callback = callbacks[i];
                    if (callback.fn === fn && callback.scope === (scope || this)) {
                        callbacks.splice(i, 1);
                    }
                }
            }
        }
        return this;
    }
    dispatch(name, ...args) {
        if (this._eventDispatcherCallbacks) {
            let callbacks = this._eventDispatcherCallbacks[name];
            if (callbacks) {
                for (let i = callbacks.length - 1; i >= 0; i--) {
                    let callback = callbacks[i];
                    if (callback && callback.fn && callback.scope) {
                        callback.fn.apply((callback.scope || this), args);
                    }
                }
            }
        }
    }
    removeAllListeners() {
        for (let event in this._eventDispatcherCallbacks) {
            let callbacks = this._eventDispatcherCallbacks[event];
            callbacks.length = 0;
        }
        this._eventDispatcherCallbacks = {};
    }
}
exports.default = EventDispatcher;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map