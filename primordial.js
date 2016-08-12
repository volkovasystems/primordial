"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/primordial.git",
			"test": "primordial-test.js",
			"global": true,
			"class": true
		}
	@end-module-configuration

	@module-documentation:
	@end-module-documentation

	@include:
		{
			"child": "child_process",
			"fs": "fs-extra",
			"kept": "kept",
			"path": "path",
			"Olivant": "olivant",
			"util": "util",
			"yargs": "yargs"
		}
	@end-include
*/

var child = require( "child_process" );
var fs = require( "fs-extra" );
var kept = require( "kept" );
var path 	= require( "path" );
var Olivant = require( "olivant" );
var util = require( "util" );
var yargs = require( "yargs" );

var primordial = function primordial( option ){
	option = option || { };

	var _package = option.package;

	if( !_package ){
		Fatal( "no package given" )
			.remind( "process exiting" );

		return;
	}

	if( !_package.homepage ){
		Warning( "no home page specified" )
			.silence( )
			.prompt( );
	}

	if( !_package.shell ){
		Warning( "no shell command specified" )
			.silence( )
			.prompt( );
	}

	var argv = yargs
		.epilogue( "For more information go to, @help-site"
			.replace( "@help-site", _package.homepage ) )

		.usage( "Usage: @shell-command <command> <type> <level> [option]"
	 		.replace( "@shell-command", _package.shell ) )

		.command( "run <type> <level> [service]", "Run specific app type on specific deployment level." )

		.command( "initialize", "Initialize the project." )

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

		.example( "$0 initialize", "Install necessary dependencies." )

		.example( "$0 run server local", "Run the server application on local mode." )

		.example( "$0 run server staging", "Run server application on staging mode." )

		.example( "$0 run server production", "Run server application on production mode." )

		.example( "$0 run server production static", "Run static server application on production mode." )

		.help( "help" )

		.version( function version( ){
			return _package.version;
		} )

		.wrap( null )

		.argv;

	argv.command = argv._[ 0 ];

	if( argv.command == "initialize" ){
		if( !( _package.local || { } ).template ){
			Warning( "local template directory not specified" )
				.remind( "using default local template directory path" )
				.silence( )
				.prompt( );

			_package.local = _package.local || { };

			_package.local.template = "server/_local";
		}

		if( !( _package.local || { } ).directory ){
			Warning( "local directory not specified" )
				.remind( "using default local directory path" )
				.silence( )
				.prompt( );

			_package.local = _package.local || { };

			_package.local.directory = "server/local";
		}

		var templateDirectory = path.resolve( process.cwd( ), "@local-template"
			.replace( "@local-template", _package.local.template ) );

		var localDirectory = path.resolve( process.cwd( ), "@local-directory"
			.replace( "@local-directory", _package.local.directory ) );

		var localOption = path.resolve( localDirectory, "_option.js" );

		var localConstant = path.resolve( localDirectory, "_constant.js" );

		var templateOption = path.resolve( templateDirectory, "_option.js" );

		var templateConstant = path.resolve( templateDirectory, "_constant.js" );

		if( kept( localOption, true ) &&
			kept( localConstant, true ) )
		{
			Prompt( "local configuration has been initialized" )
				.remind( "process exiting" );

			return;

		}else if( kept( templateOption, true ) &&
			kept( templateConstant, true ) )
		{
			if( !kept( localDirectory, true ) ){
				fs.mkdirpSync( localDirectory );
			}

			fs.copySync( templateDirectory, localDirectory );

			Prompt( "local configuration initialized" )
				.remind( "process exiting" );

		}else{
			Warning( "local template configuraton does not exists" )
				.prompt( "process exiting" );

			return;
		}

	}else if( argv.command == "run" &&
		argv.type == "server" )
	{
		if( !( _package.load || { } ).file ){
			Fatal( "no load file specified" )
				.remind( "process exiting" );

			return;
		}

		var loadFile = path.resolve( process.cwd( ), _package.load.file );
		if( !kept( loadFile, true ) ){
			Fatal( "load file does not exists", loadFile )
				.remind( "process exiting" );

			return;
		}

		argv[ argv.level ] = true;

		var nodeEngine = "node";
		if( _package.nodeVersion ){
			nodeEngine = "n use @node-version"
				.replace( "@node-version", _package.nodeVersion );
		}

		var command = [ nodeEngine, loadFile,
			"--@level".replace( "@level", argv.level || "local" )
		].join( " " );

		process.env.NODE_ENV = argv.level;

		if( argv.service ){
			command = [ command,
				"--service=@service"
				.replace( "@service", argv.service ) ].join( " " );
		}

		Prompt( "node server process started", argv.level );

		try{
			child.execSync( command, {
				"stdio": "inherit",
				"cwd": process.cwd( ),
				"env": process.env
			} );

		}catch( error ){
			Issue( "error encountered running application", error )
				.silence( )
				.prompt( );
		}
	}
};

module.exports = primordial;
