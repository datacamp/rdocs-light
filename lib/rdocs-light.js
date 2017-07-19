(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("rdl", [], factory);
	else if(typeof exports === 'object')
		exports["rdl"] = factory();
	else
		root["rdl"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

var css = __webpack_require__(6).toString();

var packageView = __webpack_require__(7);
var topicView = __webpack_require__(8);
var loaderView = __webpack_require__(9);
var notFoundView = __webpack_require__(10);

(function () {
  var TOOLTIP_HEIGHT = 252;
  var TOOLTIP_WIDTH = 402;
  var API_BASE_URL = "http://localhost:1337";
  var pageContainer = void 0;
  var shadowRoot = void 0;
  var tooltip = void 0;
  var onTooltip = false;
  var onLinkElement = false;
  var tooltipIsPinned = false;
  var visibleAnchorsAreHidden = false;

  var topOffset = 0;
  var autoPin = false;
  var pinOnClick = true;
  var findRDocLinks = false;
  var showTopicUsageSection = false;
  var showTopicArgumentsSection = false;

  function setAnchorsDisplay(display) {
    var anchors = shadowRoot.querySelector('#rdocs-light-tooltip-anchors');
    if (anchors !== null) {
      anchors.style.display = display;
    }
  }

  function getAnchorsDisplay() {
    var anchors = shadowRoot.querySelector('#rdocs-light-tooltip-anchors');
    if (anchors !== null) {
      return anchors.style.display;
    }
    return undefined;
  }

  function hideTooltip() {
    if (!tooltipIsPinned) {
      tooltip.style.visibility = 'hidden';
      if (getAnchorsDisplay() !== 'none') {
        setAnchorsDisplay('none');
        visibleAnchorsAreHidden = true;
      } else {
        visibleAnchorsAreHidden = false;
      }
    }
  }

  function showTooltip() {
    tooltip.style.visibility = 'visible';
    if (visibleAnchorsAreHidden) {
      setAnchorsDisplay('block');
    }
  }

  function onTooltipOverListener(event) {
    var e = event.fromElement || event.relatedTarget;
    if (e !== null) {
      do {
        if (e === this) {
          return;
        }
        e = e.parentNode;
      } while (e.parentNode !== null);
    }

    onTooltip = true;
    if (onTooltip && tooltip.style.visibility === 'hidden') {
      showTooltip();
    }
  }

  function onTooltipOutListener(event) {
    var e = event.toElement || event.relatedTarget;
    if (e === null) {
      return;
    }
    do {
      if (e === this) {
        return;
      }
      e = e.parentNode;
    } while (e.parentNode !== null);

    onTooltip = false;
    if (!onTooltip && !onLinkElement) {
      hideTooltip();
    }
  }

  function onTooltipClickListener() {
    if (pinOnClick) {
      tooltipIsPinned = true;
    }
  }

  function createTooltip(container) {
    // const div = document.createElement('div');
    // div.setAttribute('id', 'rdocs-light-tooltip');
    if (container !== undefined) {
      pageContainer = container;
    } else {
      pageContainer = document.getElementsByTagName('body')[0];
    }
    var containerDiv = document.createElement('div');
    containerDiv.setAttribute('id', 'rdocs-light-tooltip');
    pageContainer.appendChild(containerDiv);
    tooltip = document.querySelector('#rdocs-light-tooltip');
    shadowRoot = tooltip;
    if (document.head.attachShadow) {
      shadowRoot = tooltip.attachShadow({ mode: 'open' });
    }
    // shadowRoot.appendChild(div);
    // tooltip = shadowRoot.getElementById('rdocs-light-tooltip');
    tooltip.addEventListener('mouseover', function (event) {
      return onTooltipOverListener(event);
    });
    tooltip.addEventListener('mouseout', function (event) {
      return onTooltipOutListener(event);
    });
    tooltip.addEventListener('click', function () {
      return onTooltipClickListener();
    });
  }

  function getCurrentVisibleHeightAndWidth() {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth || e.clientWidth || g.clientWidth;
    var y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { x: x, y: y };
  }

  function setToolTipPosition(box) {
    var body = document.getElementsByTagName('body')[0];
    var screenSize = getCurrentVisibleHeightAndWidth();

    // Seems necessairy
    screenSize.x -= 25;

    var top = box.top + topOffset + body.scrollTop - TOOLTIP_HEIGHT;
    var left = box.left - body.scrollLeft;

    if (left + TOOLTIP_WIDTH > screenSize.x) {
      left = screenSize.x - TOOLTIP_WIDTH + body.scrollLeft;
      if (left < 0) {
        hideTooltip();
        return false;
      }
    }

    if (top < body.scrollTop) {
      top = box.bottom + body.scrollTop;
      if (top + TOOLTIP_HEIGHT > screenSize.y + body.scrollTop) {
        hideTooltip();
        return false;
      }
    }
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';

    return true;
  }

  function loadShadowStyle() {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerText = css;
    shadowRoot.appendChild(style);
  }

  function loadView(view) {
    var container = document.createElement('div');
    container.setAttribute('id', 'rdocs-light-tooltip-container');
    container.innerHTML = view;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(container);
    loadShadowStyle();
  }

  function showLoader() {
    loadView(loaderView);
    showTooltip();
  }

  function showNotFound(text) {
    loadView(notFoundView);
    shadowRoot.querySelector('#rdocs-light-tooltip-title').innerText = text;
    showTooltip();
  }

  function setNavigation(url, anchors) {
    var arrows = Array.from(shadowRoot.querySelectorAll('.rdocs-light-arrow'));
    var nav = shadowRoot.querySelector('#rdocs-light-nav');
    nav.innerHTML = '';
    var addedElements = 0;
    anchors.forEach(function (anchor) {
      if (!(anchor.title === 'usage' && showTopicUsageSection || anchor.title === 'arguments' && showTopicArgumentsSection)) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = url + '#' + anchor.anchor;
        a.target = '_blank';
        a.innerText = anchor.title;
        li.appendChild(a);
        nav.appendChild(li);
        addedElements++;
      }
    });

    if (addedElements === 0) {
      setAnchorsDisplay('none');
    } else if (addedElements <= 4) {
      setAnchorsDisplay('block');
      arrows.forEach(function (arrow) {
        arrow.style.visibility = 'hidden';
      });
    } else {
      setAnchorsDisplay('block');
      arrows[0].addEventListener('click', function () {
        nav.scrollLeft -= 75;
      });

      arrows[1].addEventListener('click', function () {
        nav.scrollLeft += 75;
      });
    }
  }

  function loadPackageData(data) {
    loadView(packageView);
    shadowRoot.querySelector('#rdocs-light-tooltip-title').innerHTML = data.title;
    shadowRoot.querySelector('#rdocs-light-tooltip-description').innerHTML = data.description || '';
    shadowRoot.querySelector('#rdocs-light-tooltip-link').href = data.uri;
    var packageVersion = shadowRoot.querySelector('#rdocs-light-tooltip-header-package');
    packageVersion.innerText = data.package_name;
    packageVersion.href = data.url;
    var version = shadowRoot.querySelector('#rdocs-light-tooltip-header-version');
    version.innerText = 'v' + data.version.version;
    version.href = data.version.url;

    setNavigation(data.url, data.anchors);
  }

  function createArgumentsList(topicArguments) {
    var html = '<dl>';
    topicArguments.forEach(function (argument) {
      html += '<dt>' + argument.name + '</dt><dd>' + argument.description + '</dd>';
    });
    html += '</dl>';

    return html;
  }

  function loadTopicData(data) {
    loadView(topicView);

    shadowRoot.querySelector('#rdocs-light-tooltip-title').innerHTML = data.title;
    shadowRoot.querySelector('#rdocs-light-tooltip-description').innerHTML = data.description || '';
    shadowRoot.querySelector('#rdocs-light-tooltip-link').href = data.url;
    var topic = shadowRoot.querySelector('#rdocs-light-tooltip-header-topic');
    topic.innerText = data.name;
    topic.href = data.url;
    var packageVersion = shadowRoot.querySelector('#rdocs-light-tooltip-header-package');
    packageVersion.innerText = data.package_version.package_name + ' v' + data.package_version.version;
    packageVersion.href = data.package_version.url;

    var usageDiv = shadowRoot.querySelector('#rdocs-light-tooltip-usage');
    if (!showTopicUsageSection || !data.usage) {
      usageDiv.style.display = 'none';
    } else {
      var usageContentDiv = shadowRoot.querySelector('#rdocs-light-tooltip-usage-content');
      usageContentDiv.innerHTML = '<code>' + data.usage + '</code>';
      usageDiv.style.display = 'block';
    }

    var argumentsDiv = shadowRoot.querySelector('#rdocs-light-tooltip-arguments');
    if (!showTopicArgumentsSection || data.arguments.length === 0) {
      argumentsDiv.style.display = 'none';
    } else {
      var argumentsContentDiv = shadowRoot.querySelector('#rdocs-light-tooltip-arguments-content');
      argumentsContentDiv.innerHTML = createArgumentsList(data.arguments);
      argumentsDiv.style.display = 'block';
    }

    setNavigation(data.url, data.anchors);
  }

  function parseVersions(part) {
    var versionRegex = new RegExp('(.*)/versions/(.*)', 'g');
    var versionMatch = versionRegex.exec(part);
    if (versionMatch === null) {
      return {
        package: decodeURIComponent(part)
      };
    }
    return {
      package: decodeURIComponent(versionMatch[1]),
      version: decodeURIComponent(versionMatch[2])
    };
  }

  function parseTopicURL(url) {
    var urlRegexString = API_BASE_URL + '/api/light/packages/(.*)/topics/(.*)';
    var urlRegex = new RegExp(urlRegexString, 'g');
    var match = urlRegex.exec(url);
    if (match !== null) {
      var result = parseVersions(match[1]);
      result.topic = decodeURIComponent(match[2]);
      return result;
    }

    return undefined;
  }

  function parsePackageURL(url) {
    var urlRegexString = API_BASE_URL + '/api/light/packages/(.*)';
    var urlRegex = new RegExp(urlRegexString, 'g');
    var match = urlRegex.exec(url);
    if (match !== null) {
      return parseVersions(match[1]);
    }

    return undefined;
  }

  function parseRequestURL(url) {
    var result = parseTopicURL(url);
    if (result !== undefined) {
      return result;
    }
    return parsePackageURL(url);
  }

  function reqLoadListener() {
    var data = JSON.parse(this.responseText);
    var requestInfo = parseRequestURL(this.responseURL);

    if (data.title !== undefined) {
      if (requestInfo.topic === undefined) {
        loadPackageData(data);
      } else {
        loadTopicData(data);
      }
      showTooltip();
    } else {
      var text = 'No documentation found for the package \'' + requestInfo.package + '\'';
      if (requestInfo.version) {
        text += ' v' + requestInfo.version;
      }
      if (requestInfo.topic) {
        text = 'No documentation found for \'' + requestInfo.package + '::' + requestInfo.topic + '\'';
        if (requestInfo.version) {
          text = 'No documentation found for \'' + requestInfo.topic + '\' in ' + requestInfo.package + ' v' + requestInfo.version;
        }
      }
      showNotFound(text);
    }
  }

  function reqErrorListener() {
    console.error('Something went wrong when retrieving the data, hiding rdocs light widget.');
  }

  function parseAttribute(attribute) {
    var splitted = attribute.split('::');
    if (splitted.length === 1) {
      return {
        package: splitted[0]
      };
    } else if (splitted.length === 2) {
      return {
        package: splitted[0],
        topic: splitted[1]
      };
    }
    return undefined;
  }

  function getLocation(href) {
    var l = document.createElement('a');
    l.href = href;
    return l;
  }

  var urlRegexes = [{ url: '/packages/(.*)/versions/(.*)/topics/(.*)', fields: ['package', 'version', 'topic'] }, { url: '/packages/(.*)/versions/(.*)', fields: ['package', 'version'] }, { url: '/packages/(.*)/topics/(.*)', fields: ['package', 'topic'] }, { url: '/packages/(.*)', fields: ['package'] }];

  function parseRDocLink(url) {
    var l = getLocation(url);
    if (!(l.hostname === 'rdocumentation.org' || l.hostname === 'www.rdocumentation.org')) {
      return false;
    }

    var valid = void 0;
    urlRegexes.some(function (urlRegexObject) {
      var urlRegex = new RegExp(urlRegexObject.url, 'g');
      var match = urlRegex.exec(l.pathname);
      if (match !== null) {
        valid = {};
        for (var i = 0; i < urlRegexObject.fields.length; i++) {
          valid[urlRegexObject.fields[i]] = match[i + 1];
        }
        return true;
      }
      return false;
    });

    return valid;
  }

  function sendRequest(data) {
    if (autoPin) {
      tooltipIsPinned = true;
    }
    showLoader();
    var oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqLoadListener);
    oReq.addEventListener('error', reqErrorListener, false);
    var url = API_BASE_URL + '/api/light/packages/' + data.package;
    if (data.version !== undefined) {
      url += '/versions/' + data.version;
    }
    if (data.topic !== undefined) {
      url += '/topics/' + data.topic;
    }
    oReq.open('get', url, true);
    oReq.send();
  }

  function linkElementMouseOverListener(DOMElement) {
    onLinkElement = true;
    var element = DOMElement;
    element.classList.add('rdocs-light-link-hovered');
    var data = void 0;
    if (element.hasAttribute('data-mini-rdoc')) {
      data = parseAttribute(element.getAttribute('data-mini-rdoc'));
      if (element.hasAttribute('data-mini-rdoc-version')) {
        data.version = element.getAttribute('data-mini-rdoc-version');
      }
    } else {
      data = parseRDocLink(element.href);
    }

    if (data !== undefined) {
      var visible = setToolTipPosition(element.getBoundingClientRect());
      if (visible) {
        sendRequest(data);
      } else {
        console.info('Not enough space, rdocs light widget not shown.');
      }
    } else {
      console.warn('Invalid attribute value.');
    }
  }

  function linkElementMouseOutListener(DOMElement) {
    var element = DOMElement;
    element.classList.remove('rdocs-light-link-hovered');
    onLinkElement = false;
    if (!onTooltip) {
      hideTooltip();
    }
  }

  function findAllRDocLightDataAttributes() {
    var links = document.querySelectorAll('[data-mini-rdoc]');

    if (links.length === 0) {
      console.info('No data-mini-rdoc attributes found.');
    }

    links.forEach(function (linkElement) {
      return linkElement.addEventListener('mouseover', function () {
        return linkElementMouseOverListener(linkElement);
      });
    });
    links.forEach(function (linkElement) {
      return linkElement.addEventListener('mouseout', function () {
        return linkElementMouseOutListener(linkElement);
      });
    });
  }

  function findAllRDocLinks() {
    if (findRDocLinks) {
      var links = Array.from(document.querySelectorAll('a'));
      if (links.length === 0) {
        console.info('No RDocumentation links found.');
      }
      links = links.filter(function (link) {
        return parseRDocLink(link.href) !== undefined;
      });
      links = links.filter(function (link) {
        return !link.hasAttribute('data-mini-rdoc');
      });
      links.forEach(function (linkElement) {
        return linkElement.addEventListener('mouseover', function () {
          return linkElementMouseOverListener(linkElement);
        });
      });
      links.forEach(function (linkElement) {
        return linkElement.addEventListener('mouseout', function () {
          return linkElementMouseOutListener(linkElement);
        });
      });
    }
  }

  function removeLinksAllRDocLinks() {
    if (findRDocLinks) {
      var links = document.querySelectorAll('a');
      links = links.filter(function (link) {
        return !link.hasAttribute('data-mini-rdoc');
      });
      links.forEach(function (linkElement) {
        return linkElement.removeEventListener('mouseover', function () {
          return linkElementMouseOverListener(linkElement);
        });
      });
      links.forEach(function (linkElement) {
        return linkElement.remvoeEventListener('mouseout', function () {
          return linkElementMouseOutListener(linkElement);
        });
      });
    }
  }

  function bodyClickListener(event) {
    if (tooltipIsPinned) {
      var e = event.toElement || event.relatedTarget;
      if (e !== null) {
        do {
          if (e === tooltip) {
            return;
          }
          e = e.parentNode;
        } while (e.parentNode !== null);
      }
      tooltipIsPinned = false;
      hideTooltip();
    }
  }

  function addBodyClickListener() {
    document.body.addEventListener('click', bodyClickListener, true);
  }

  function getLinkFromTag(attribute, versionAttribute) {
    var data = parseAttribute(attribute);
    if (versionAttribute) {
      data.version = versionAttribute;
    }
    if (data !== undefined) {
      var url = 'https://rdocumentation.org/packages/' + data.package;
      if (data.version !== undefined) {
        url += '/versions/' + data.version;
      }
      if (data.topic !== undefined) {
        url += '/topics/' + data.topic;
      }
      return url;
    }

    return undefined;
  }

  function wrap(toWrap, wrapper) {
    wrapper = wrapper || document.createElement('div');
    if (toWrap.nextSibling) {
      toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
    } else {
      toWrap.parentNode.appendChild(wrapper);
    }
    return wrapper.appendChild(toWrap);
  }

  function setWidgetsForRdocLinks(find) {
    if (find !== findRDocLinks) {
      findRDocLinks = find;
      if (findRDocLinks) {
        findAllRDocLinks();
      } else {
        removeLinksAllRDocLinks();
      }
    }
  }

  module.exports = {
    initRDocsLight: function initRDocsLight(options) {
      if (options) {
        if (options.topOffset !== undefined) {
          topOffset = options.topOffset;
        }
        if (options.autoPin !== undefined) {
          autoPin = options.autoPin;
        }
        if (options.pinOnClick !== undefined) {
          pinOnClick = options.pinOnClick;
        }
        if (options.widgetForRDocsLinks !== undefined) {
          setWidgetsForRdocLinks(options.widgetForRDocsLinks);
        }
        if (options.showTopicUsageSection !== undefined) {
          showTopicUsageSection = options.showTopicUsageSection;
        }
        if (options.showTopicArgumentsSection !== undefined) {
          showTopicArgumentsSection = options.showTopicArgumentsSection;
        }
      }
      createTooltip(options ? options.container : options);
      addBodyClickListener();
      findAllRDocLightDataAttributes();
    },
    autoLink: function autoLink() {
      var links = Array.from(document.querySelectorAll('[data-mini-rdoc]'));
      links.forEach(function (link) {
        var attribute = link.getAttribute('data-mini-rdoc');
        var versionAttribute = link.getAttribute('data-mini-rdoc-version');
        var url = getLinkFromTag(attribute, versionAttribute);
        if (url !== undefined) {
          if (link.nodeName === 'A') {
            link.href = url;
          } else {
            var a = document.createElement('a');
            a.href = url;
            wrap(link, a);
          }
        }
      });
    }
  };
})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#rdocs-light-tooltip {\n  visibility: hidden;\n  position: absolute;\n  border: 1px solid #d5eaef;\n  background-color: #ebf4f7;\n  z-index: 10;\n  height: 220px;\n  width: 370px;\n  padding: 15px;\n  border-radius: 10px;\n  font-size: 1rem !important;\n  font-family: \"Open Sans\", sans-serif !important;\n  line-height: 1.5 !important;\n  box-sizing: content-box !important;\n  overflow-y: hidden !important;\n  overflow-x: hidden  !important;\n  display: flex;\n  flex-flow: column;\n  color: #3a3a3a; }\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".rdocs-light-arrow {\n  margin: 0;\n  padding: 0;\n  display: block;\n  width: 40px;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  background-color: #d5eaef;\n  font-weight: bold;\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  z-index: 101; }\n\n#rdocs-light-tooltip-anchors {\n  width: calc(100% - 80px);\n  height: 40px;\n  background-color: #d5eaef;\n  padding: 0 40px;\n  margin-top: 15px;\n  margin-bottom: -15px;\n  margin-left: -15px;\n  margin-right: -15px;\n  font-family: helvetica;\n  overflow: hidden;\n  position: relative;\n  z-index: 99; }\n\n#rdocs-light-nav {\n  width: auto;\n  height: 40px;\n  overflow: hidden;\n  list-style-type: none;\n  white-space: nowrap;\n  transition: 2.0s;\n  margin: 0;\n  padding: 0; }\n  #rdocs-light-nav li {\n    display: inline-block;\n    height: 40px;\n    width: 35px;\n    line-height: 40px;\n    font-size: 13px;\n    padding: 0 20px; }\n  #rdocs-light-nav a {\n    text-decoration: none;\n    color: inherit;\n    border: none; }\n\n.rdocs-light-arrow:first-of-type {\n  left: 0; }\n\n.rdocs-light-arrow:nth-of-type(2) {\n  right: 0; }\n\n.rdocs-light-tooltip-outer {\n  display: table;\n  height: 100%;\n  width: 100%; }\n\n.rdocs-light-tooltip-middle {\n  display: table-cell;\n  vertical-align: middle; }\n\n.rdocs-light-tooltip-loader {\n  margin-left: auto;\n  margin-right: auto;\n  border: 16px solid #f3f3f3;\n  /* Light grey */\n  border-top: 16px solid #3498db;\n  /* Blue */\n  border-radius: 50%;\n  width: 120px;\n  height: 120px;\n  animation: spin 2s linear infinite; }\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg); }\n  100% {\n    transform: rotate(360deg); } }\n\n#rdocs-light-tooltip-container {\n  background-color: #ebf4f7;\n  font-size: 1rem !important;\n  font-family: \"Open Sans\", sans-serif !important;\n  line-height: 1.5 !important;\n  box-sizing: content-box !important;\n  overflow-y: hidden !important;\n  overflow-x: hidden  !important;\n  color: #3a3a3a; }\n  #rdocs-light-tooltip-container code {\n    display: inline-block;\n    line-height: 1;\n    margin: 0 0.25em;\n    padding: 0.2em 0.4em 0.35em 0.4em;\n    color: #3a3a3a;\n    font-family: monospace;\n    font-size: 0.8rem;\n    background-color: #eaeef3;\n    border-radius: 3px; }\n  #rdocs-light-tooltip-container dl dd {\n    margin-left: 40px;\n    margin-bottom: 1rem; }\n  #rdocs-light-tooltip-container dd p {\n    font-weight: 300; }\n  #rdocs-light-tooltip-container dl:after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  #rdocs-light-tooltip-container dl dt {\n    font-weight: bold;\n    float: left;\n    margin-right: 15px; }\n\n#rdocs-light-tooltip-content {\n  flex: 1;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding-right: 4px;\n  max-height: calc(220px - 50px); }\n  #rdocs-light-tooltip-content p {\n    -webkit-margin-before: 0px; }\n  #rdocs-light-tooltip-content h3 {\n    font-size: 1.5rem;\n    margin-top: 0.3rem;\n    -webkit-margin-after: 0px;\n    line-height: 1.5 !important; }\n\n#rdocs-light-tooltip-content::-webkit-scrollbar {\n  width: 5px;\n  margin-top: -5px; }\n\n#rdocs-light-tooltip-content::-webkit-scrollbar-track {\n  background: #ebf4f7; }\n\n#rdocs-light-tooltip-content::-webkit-scrollbar-thumb {\n  background: #d5eaef; }\n\n#rdocs-light-tooltip-header {\n  display: flex;\n  justify-content: space-between; }\n  #rdocs-light-tooltip-header a {\n    color: #a3a3a3;\n    font-size: 1em;\n    text-decoration: none;\n    border: none; }\n\n#rdocs-light-tooltip-link {\n  margin-top: 0.5rem;\n  zoom: 0.8; }\n\n.rdocs-light-tooltip-bottom {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 50px; }\n\n.rdocs-light-link-hovered {\n  color: blue; }\n\n.rdocs-light-button {\n  border: none;\n  display: inline-block;\n  text-decoration: none;\n  border-radius: 6px;\n  font-size: 1rem;\n  font-weight: 700;\n  line-height: 1.5;\n  padding: 0.5rem 1.875rem;\n  transition: background-color 150ms ease, color 150ms ease;\n  text-align: center; }\n  .rdocs-light-button:hover, .rdocs-light-button:focus, .rdocs-light-button:active:focus {\n    outline: none; }\n  .rdocs-light-button .fa {\n    margin-right: 0.5rem; }\n\n.rdocs-light-button-primary {\n  background-color: #fdc551;\n  color: #6d561e; }\n  .rdocs-light-button-primary:hover, .rdocs-light-button-primary:focus {\n    background-color: #ffe2a6;\n    color: #6d561e; }\n\n.rdocs-light-button-secondary {\n  background-color: #7ecce2;\n  color: #ffffff; }\n  .rdocs-light-button-secondary:hover, .rdocs-light-button-secondary:focus {\n    background-color: #d5eaef;\n    color: #ffffff; }\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div id=\"rdocs-light-tooltip-header\">\n  <a href=\"\" target=\"_blank\" id=\"rdocs-light-tooltip-header-package\"></a>\n  <a href=\"\" target=\"_blank\" id=\"rdocs-light-tooltip-header-version\"></a>\n</div>\n<div id=\"rdocs-light-tooltip-content\">\n  <h3 id=\"rdocs-light-tooltip-title\"></h3>\n  <div id=\"rdocs-light-tooltip-description\"></div>\n</div>\n<div class=\"rdocs-light-tooltip-bottom\">\n<a id=\"rdocs-light-tooltip-link\"\n    class=\"rdocs-light-button rdocs-light-button-secondary\" style=\"display: none\" href=\"\" target=\"_blank\">Go To Documentation</a>\n  <div id=\"rdocs-light-tooltip-anchors\">\n    <span class=\"rdocs-light-arrow\">&lt;</span>\n    <span class=\"rdocs-light-arrow\">&gt;</span>\n    <ul id=\"rdocs-light-nav\">\n    </ul>\n    </div>\n </div>\n";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<div id=\"rdocs-light-tooltip-header\">\n  <a href=\"\" target=\"_blank\" id=\"rdocs-light-tooltip-header-topic\"></a>\n  <a href=\"\" target=\"_blank\" id=\"rdocs-light-tooltip-header-package\"></a>\n</div>\n<div id=\"rdocs-light-tooltip-content\">\n  <h3 id=\"rdocs-light-tooltip-title\"></h3>\n  <div id=\"rdocs-light-tooltip-description\"></div>\n  <div id=\"rdocs-light-tooltip-usage\">\n    <div>\n      <h3>Usage</h3>\n    </div>\n    <div id=\"rdocs-light-tooltip-usage-content\"></div>\n  </div>\n  <div id=\"rdocs-light-tooltip-arguments\">\n    <div>\n      <h3>Arguments</h3>\n    </div>\n    <div id=\"rdocs-light-tooltip-arguments-content\"></div>\n  </div>\n</div>\n<div class=\"rdocs-light-tooltip-bottom\">\n<a id=\"rdocs-light-tooltip-link\"\n    class=\"rdocs-light-button rdocs-light-button-secondary\" style=\"display: none\" href=\"\" target=\"_blank\">Go To Documentation</a>\n  <div id=\"rdocs-light-tooltip-anchors\">\n    <span class=\"rdocs-light-arrow\">&lt;</span>\n    <span class=\"rdocs-light-arrow\">&gt;</span>\n    <ul id=\"rdocs-light-nav\">\n    </ul>\n    </div>\n </div>\n";

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<div class=\"rdocs-light-tooltip-outer\">\n  <div class=\"rdocs-light-tooltip-middle\">\n    <div class=\"rdocs-light-tooltip-loader\">\n\n    </div>\n  </div>\n</div>\n";

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<div id=\"rdocs-light-tooltip-content\">\n  <h3 id=\"rdocs-light-tooltip-title\"></h3>\n  <div id=\"rdocs-light-tooltip-description\">Visit the rdocumentation\n    <a href='https://rdocumenation.org'>site</a> to search yourself.</div>\n</div>\n";

/***/ })
/******/ ]);
});
//# sourceMappingURL=rdocs-light.js.map