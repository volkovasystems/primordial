"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "primordial",
			"path": "primordial/primordial.js",
			"file": "primordial.js",
			"module": "primordial",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/primordial.git",
			"test": "primordial-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Default index for starting server based on standard practice.

		Never change this!
		This will always do 2 things
		1. Initialize options and dependencies.
		2. Start server through the load file.
	@end-module-documentation

	@include:
		{
			"child": "child_process",
			"falze": "falze",
			"falzy": "falzy",
			"fs": "fs-extra",
			"gnaw": "gnaw",
			"kept": "kept",
			"Olivant": "olivant",
			"path": "path",
			"persy": "persy",
			"redupe": "redupe",
			"shardize": "shardize",
			"servcon": "servcon",
			"servopt": "servopt",
			"snapd": "snapd",
			"touche": "touche",
			"truly": "truly",
			"truu": "truu",
			"yarg": "yargs"
		}
	@end-include
*/
require( "olivant" );

const falze = require( "falze" );
const falzy = require( "falzy" );
const fs = require( "fs-extra" );
const gnaw = require( "gnaw" );
const kept = require( "kept" );
const path = require( "path" );
const persy = require( "persy" );
const redupe = require( "redupe" );
const shardize = require( "shardize" );
const servcon = require( "servcon" );
const servopt = require( "servopt" );
const snapd = require( "snapd" );
const touche = require( "touche" );
const truly = require( "truly" );
const truu = require( "truu" );
const yarg = require( "yargs" );

const VERSION_PATTERN = /^\d+?\.\d+?\.\d+?$/;

/*;
	@option:
		{
			"package": "package.json",
			"rootPath": "process.cwd( )"
		}
	@end-option
*/
const primordial = function primordial( option ){
	/*;
		@meta-configuration:
			{
				"option:required": "object"
			}
		@end-meta-configuration
	*/

	option = option || { };

	let box = option.package;
	if( falze( box ) ){
		Fatal( "configuration is empty" )
			.remind( "process exiting" );

		return;
	}

	box.option = box.option || { };

	let rootPath = option.rootPath || process.cwd( );

	if( falzy( box.homepage ) ){
		Warning( "no home page specified" )
			.silence( )
			.prompt( );
	}

	if( falzy( box.option.shell ) ){
		Warning( "no shell command specified" )
			.remind( "reusing project name as shell namespace" )
			.silence( )
			.prompt( );

		box.option.shell = shardize( box.name );
	}

	Prompt( "You are working under", rootPath )
		.remind( "Please make sure this is the correct directory" );

	let boxPath = path.resolve( rootPath, "package.json" );
	if( !kept( boxPath, true ) ){
		Fatal( "configuration file does not exists" )
			.remind( "process exiting" );

		return;
	}

	let parameter = yarg
		.epilogue( ( box.homepage )?
			`For more information go to, ${ box.homepage }` :
			"Please read usage and examples carefully." )

		.usage( `Usage: ${ box.option.shell } <command> <type> <level> [option]` )

		.command( "run <type> <level> [service]",
			"Run specific app type on specific deployment level." )

		.command( "initialize", "Initialize the project." )

		.command( "transfer", "Transfer configuration." )

		.option( "type", {
			"alias": "t",
			"describe": "Server or client type application",
			"type": "string",
			"default": "server",
			"choices": [
				"server",
				"client"
			]
		} )

		.option( "level", {
			"alias": "l",
			"describe": "Level of deployment",
			"type": "string",
			"default": "local",
			"choices": [
				"local",
				"staging",
				"production"
			]
		} )

		.option( "service", {
			"alias": "s",
			"describe": "Name of service to deploy",
			"type": "string"
		} )

		.example( "$0 initialize",
			"Install necessary dependencies." )

		.example( "$0 transfer",
			"Transfer configuration from meta to local." )

		.example( "$0 run server local",
			"Run the server application on local mode." )

		.example( "$0 run server staging",
			"Run server application on staging mode." )

		.example( "$0 run server production",
			"Run server application on production mode." )

		.example( "$0 run server production static",
			"Run static server application on production mode." )

		.help( "help" )

		.version( function version( ){
			return box.version;
		} )

		.wrap( null )

		.argv;

	let token = parameter._;
	parameter.command = token[ 0 ];

	if( parameter.command === "initialize" ){
		if( falzy( box.option.meta ) ){
			Warning( "local meta directory not specified" )
				.remind( "using default local meta directory path" )
				.silence( )
				.prompt( );

			box.option.meta = "server/meta";
		}

		if( falzy( box.option.local ) ){
			Warning( "local directory not specified" )
				.remind( "using default local directory path" )
				.silence( )
				.prompt( );

			box.option.local = "server/local";
		}

		let metaDirectory = path.resolve( rootPath, box.option.meta );
		let metaOption = path.resolve( metaDirectory, "option.json" );
		let metaConstant = path.resolve( metaDirectory, "constant.json" );

		if( !kept( metaDirectory, true ) ){
			Prompt( "meta directory does not exists" )
				.remind( "creating meta directory" );

			fs.mkdirpSync( metaDirectory );
		}

		if( !kept( metaOption, true ) ){
			touche( metaOption, true );

			persy( metaOption, servopt( ), true );
		}

		if( !kept( metaConstant, true ) ){
			touche( metaConstant, true );

			persy( metaConstant, { }, true );
		}

		let localDirectory = path.resolve( rootPath, box.option.local );
		let localOption = path.resolve( localDirectory, "option.json" );
		let localConstant = path.resolve( localDirectory, "constant.json" );

		if( !kept( localDirectory, true ) ){
			Prompt( "local directory does not exists" )
				.remind( "creating local directory" );

			fs.mkdirpSync( localDirectory );
		}

		if( kept( localOption, true ) && kept( localConstant, true ) ){
			Prompt( "local configuration has been initialized" )
				.remind( "process exiting" );

			return;
		}

		let initialOption = servopt( require( metaOption ) );

		try{
			touche( localOption, true );

			persy( localOption, initialOption, true );

		}catch( error ){
			Fatal( error )
				.remind( "cannot initialize local option" )
				.remind( "process exiting" );

			return;
		}

		let defaultConstant = servcon( initialOption );

		let initialConstant = redupe( require( metaConstant ), defaultConstant, true );

		try{
			touche( localConstant, true );

			persy( localConstant, initialConstant, true );

		}catch( error ){
			Fatal( error )
				.remind( "cannot initialize local constant" )
				.remind( "process exiting" );

			return;
		}

		try{
			persy( boxPath, box, true );

		}catch( error ){
			Fatal( error )
				.remind( "cannot save configuration" )
				.remind( "process exiting" );

			return;
		}

		Prompt( "local configuration initialized" )
			.remind( "process exiting" );

	}else if( parameter.command == "transfer" ){
		if( falzy( box.option.meta ) ){
			Fatal( "local meta directory not specified" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		if( falzy( box.option.local ) ){
			Fatal( "local directory not specified" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		let metaDirectory = path.resolve( rootPath, box.option.meta );
		let metaOption = path.resolve( metaDirectory, "option.json" );
		let metaConstant = path.resolve( metaDirectory, "constant.json" );

		if( !kept( metaDirectory, true ) ){
			Fatal( "meta directory does not exists" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		if( !kept( metaOption, true ) ){
			Fatal( "meta option does not exists" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		if( !kept( metaConstant, true ) ){
			Fatal( "meta constant does not exists" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		let initialOption = { };
		try{
			initialOption = require( metaOption );

		}catch( error ){
			Fatal( error )
				.remind( "cannot load meta option" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" );

			return;
		}

		let initialConstant = { };
		try{
			initialConstant = require( metaConstant );

		}catch( error ){
			Fatal( error )
				.remind( "cannot load meta constant" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" );

			return;
		}

		let localDirectory = path.resolve( rootPath, box.option.local );
		let localOption = path.resolve( localDirectory, "option.json" );
		let localConstant = path.resolve( localDirectory, "constant.json" );

		if( !kept( localDirectory, true ) ){
			Fatal( "local directory does not exists" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		if( !kept( localOption, true ) ){
			Fatal( "local option does not exists" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		if( !kept( localConstant, true ) ){
			Fatal( "local constant does not exists" )
				.remind( "cannot transfer data" )
				.remind( "process exiting" )
				.silence( );

			return;
		}

		try{
			var customOption = require( localOption );

		}catch( error ){
			Fatal( error )
				.remind( "cannot read local option" )
				.remind( "cannot transfer local option" )
				.remind( "process exiting" );
		}

		customOption = redupe( customOption, initialOption );

		try{
			persy( localOption, customOption, true );

		}catch( error ){
			Fatal( error )
				.remind( "cannot transfer local option" )
				.remind( "process exiting" );

			return;
		}

		let defaultConstant = servcon( customOption );

		try{
			var customConstant = require( localConstant );

		}catch( error ){
			Fatal( error )
				.remind( "cannot read local constant" )
				.remind( "cannot transfer local constant" )
				.remind( "process exiting" );
		}

		customConstant = redupe( customConstant, initialConstant, defaultConstant );

		try{
			persy( localConstant, customConstant, true );

		}catch( error ){
			Fatal( error )
				.remind( "cannot transfer local constant" )
				.remind( "process exiting" );

			return;
		}

		Prompt( "local configuration transferred" )
			.remind( "process exiting" );

	}else if( parameter.command === "run" && parameter.type === "server" ){
		if( falzy( box.option.load ) ){
			Fatal( "no load file specified" )
				.remind( "process exiting" );

			return;
		}

		let loadFile = path.resolve( rootPath, box.option.load );
		if( !kept( loadFile, true ) ){
			Fatal( "load file does not exists", loadFile )
				.remind( "process exiting" );

			return;
		}

		parameter[ parameter.level ] = true;

		let nodeEngine = "node";
		if( truu( box.engines ) &&
			truly( box.engines.node ) &&
			VERSION_PATTERN.test( box.engines.node ) )
		{
			nodeEngine = `n use ${ box.engines.node }`;
		}

		let command = `${ nodeEngine } ${ loadFile } --${ parameter.level || "local" }`;

		process.env.NODE_ENV = parameter.level;

		if( truly( parameter.service ) ){
			command = `${ command } --service=${ parameter.service }`;
		}

		Prompt( "running", command );

		Prompt( "node server process started", parameter.level );

		snapd( function delay( ){
			try{
				gnaw( command, {
					"stdio": "inherit",
					"cwd": rootPath,
					"env": process.env
				}, true );

			}catch( error ){
				Issue( "error encountered running application", error )
					.silence( )
					.prompt( );
			}
		} );
	}
};

module.exports = primordial;
