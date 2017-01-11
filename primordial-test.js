"use strict";

const primordial =  require( "./primordial.js" );

primordial( {
	"name": "lire",
	"version": "0.2.0",
	"description": "Read file.",
	"main": "lire.js",
	"scripts": {
	"test": "mocha lire-test.js"
	},
	"repository": {
	"type": "git",
	"url": "git+https://github.com/volkovasystems/lire.git"
	},
	"keywords": [
	"read",
	"file",
	"lire"
	],
	"author": "Richeve S. Bebedor <richeve.bebedor@gmail.com>",
	"contributors": [
	"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
	],
	"license": "MIT",
	"bugs": {
	"url": "https://github.com/volkovasystems/lire/issues"
	},
	"homepage": "https://github.com/volkovasystems/lire#readme",
	"dependencies": {
	"falzy": "^0.7.0",
	"kept": "^0.8.0",
	"letgo": "^0.6.0",
	"protype": "^0.8.0",
	"zelf": "^0.4.0"
	}
} );
