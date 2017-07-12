(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("rdocs-light", [], factory);
	else if(typeof exports === 'object')
		exports["rdocs-light"] = factory();
	else
		root["rdocs-light"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  function createContainer(DOMElement) {
    console.log(DOMElement);
  }

  function mouseOverListener(DOMElement) {
    createContainer(DOMElement);
  }

  function findAllRDocLightDataAttributes() {
    var links = document.querySelectorAll('[data-mini-rdoc]');

    if (links.length === 0) {
      console.log('No RDocumentation links found.');
    }

    links.forEach(function (linkElement) {
      return linkElement.addEventListener('mouseover', function () {
        return mouseOverListener(linkElement);
      });
    });
  }

  function initRDocsLight() {
    findAllRDocLightDataAttributes();
  }

  function isAlreadyExecuted() {
    return typeof window.initRDocsLight === 'function';
  }

  if (!isAlreadyExecuted()) {
    window.initRDocsLight = initRDocsLight;
    if (document.readyState === 'complete' || document.readyState === 'loaded') {
      initRDocsLight();
    } else {
      document.addEventListener('DOMContentLoaded', initRDocsLight);
    }
  } else {
    console.log('Warning: tried to load RDocs Light multiple times.');
  }
})();

/***/ })
/******/ ]);
});
//# sourceMappingURL=rdocs-light.js.map