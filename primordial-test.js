const child = require( "child_process" );
const path = require( "path" );

child.execSync( "node ./test.js initialize && node ./test.js run server local",
 	{ "cwd": path.resolve( process.cwd( ), "test" ), "stdio": "inherit" } );

child.execSync( "node ./test.js transfer",
 	{ "cwd": path.resolve( process.cwd( ), "test" ), "stdio": "inherit" } )
