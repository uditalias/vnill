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
        this._isActive = false;
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
    getData() {
        return this._data;
    }
    isActive() {
        return this._isActive;
    }
    getController() {
        return this._stateController;
    }
    activate(context) {
        if (this.onEnter) {
            this.onEnter(this);
        }
        this._isActive = true;
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
        this._isActive = false;
        if (this._stateController) {
            this._stateController.destroy();
            this._stateController = null;
        }
        if (this._viewsControllers.length) {
            for (let i = 0, len = this._viewsControllers.length; i < len; i++) {
                this._viewsControllers[i].destroy();
                this._viewsControllers[i] = null;
            }
            this._viewsControllers.length = 0;
        }
        this._data = null;
        if (this._domContext) {
            this._domContext.parentElement.removeChild(this._domContext);
            this._domContext = null;
        }
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
            let container = this._domContext.querySelector(`[data-view="${viewName}"]`);
            if (container) {
                let div = document.createElement('div');
                div.innerHTML = view.template;
                container.parentElement.replaceChild(div.firstChild, container);
                div = null;
                let ViewController = view.controller;
                if (ViewController) {
                    let scope = scopeFactory_1.default.create();
                    this._viewsControllers.push(new ViewController(scope, this._data, container));
                }
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
const tslib_1 = __webpack_require__(21);
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._currentState) {
                if (state.parent !== this._currentState.name) {
                    yield this._currentState.deactivate();
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
                yield this._currentParentState.deactivate();
                this._currentParentState = null;
            }
            this._currentState = state;
            state.activate(this._currentParentState);
        });
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
    template: `<div>I'm the Custom view :)</div>`,
    onEnter: (state) => {

        console.log(state.getData())

        return new Promise((resolve) => setTimeout(resolve, 3000));
    }
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


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map