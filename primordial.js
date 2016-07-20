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
			"_package": "primordial",
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
			"fs": "fs",
			"path": "path",
			"olivant": "olivant",
			"util": "util",
			"yargs": "yargs"
		}
	@end-include
*/

var child = require( "child_process" );
var fs = require( "fs" );
var path 	= require( "path" );
var olivant = require( "olivant" );
var util = require( "util" );
var yargs = require( "yargs" );

var primordial = function primordial( option ){
	option = option || { };

	var _package = option.package;

	if( !_package ){
		Fatal( "no package given" )
			.prompt( "process exiting" );

		process.exit( 0 );
	}

	if( !_package.homepage ){
		Warning( "no home page specified" ).prompt( );
	}

	if( !_package.shell ){
		Warning( "no shell command specified" ).prompt( );
	}

	var argv = yargs
		.epilogue( "For more information go to, @help-site"
			.replace( "@help-site", _package.homepage ) )

		.usage( "Usage: @shell-command <command> <type> <level> [option]"
	 		.replace( "@shell-command", _package.shell ) )

		.command( "run <type> <level>", "Run specific app type on specific deployment level." )

		.command( "initialize", "Initialize the project." )

		.option( "type", {
			"alias": "t",
			"describe": "Server or client type application",
			"type": "string",
			"choices": [
				"server",
				"client"
			]
		} )

		.option( "level", {
			"alias": "l",
			"describe": "Level of deployment",
			"type": "string",
			"choices": [
				"local",
				"staging",
				"production"
			]
		} )

		.example( "$0 initialize", "Install necessary dependencies." )

		.example( "$0 run server local", "Run the server application on local mode." )

		.example( "$0 run server staging", "Run server application on staging mode." )

		.example( "$0 run server production", "Run server application on production mode." )

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
				.prompt( );

		}else{
			_package.local = _package.local || { };

			_package.local.template = "server/_local";
		}

		if( !( _package.local || { } ).directory ){
			Warning( "local directory not specified" )
				.remind( "using default local directory path" )
				.prompt( );

		}else{
			_package.local = _package.local || { };

			_package.local.directory = "server/local";
		}

		var templateDirectory = path.resolve( process.cwd( ), "@local-template"
			.replace( "@local-template", _package.local.template ) );

		var localDirectory = path.resolve( process.cwd( ), "@local-directory"
			.replace( "@local-directory", _package.local.directory ) );

		var localOption = path.resolve( localDirectory, "option.js" );

		var localConstant = path.resolve( localDirectory, "constant.js" );

		var templateOption = path.resolve( templateDirectory, "option.js" );

		var templateConstant = path.resolve( templateDirectory, "constant.js" );

		if( fs.existsSync( localOption ) &&
			fs.existsSync( localConstant ) )
		{
			Prompt( "local configuration has been initialized" )
				.prompt( "process exiting" );

			process.exit( 0 );

		}else if( fs.existsSync( templateOption ) &&
			fs.existsSync( templateConstant ) )
		{
			if( !fs.existsSync( localDirectory ) ){
				fs.mkdirpSync( localDirectory );
			}

			fs.copySync( templateDirectory, localDirectory );

		}else{
			Warning( "local template configuraton does not exists" )
				.prompt( "process exiting" );

			process.exit( 0 );
		}

	}else if( argv.command == "run" ){
		if( !( _package.load || { } ).file ){
			Fatal( "no load file specified" )
				.prompt( "process exiting" );

			process.exit( 0 );
		}

		var loadFile = path.resolve( process.cwd( ), _package.load.file );
		if( !fs.existsSync( loadFile ) ){
			Fatal( "load file does not exists", loadFile )
				.prompt( "process exiting" );

			process.exit( 0 );
		}

		argv[ argv.level ] = true;

		child.execSync( "node @load-file".replace( "@load-file", loadFile ),
			{
				"stdio": "inherit",
				"cwd": process.cwd( )
			} );
	}
};

module.exports = primordial;
