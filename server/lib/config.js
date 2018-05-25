'use strict';

const fs = require('fs');

const Config = class{

	// constructor reads the config file
	constructor (config_path) {
		// read the provided config file
		const config_content = JSON.parse(fs.readFileSync(config_path));

		// set member variables
		this.port 	   = config_content.port;
		this.cache_dir = config_content.cache_dir
	}
}

// export the Class
module.exports = Config;
