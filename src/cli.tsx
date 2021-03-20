#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
const meowHelp = require('cli-meow-help');
import App from './ui';

// const commands = {
// 	new: { desc: `Creates a new user account` },
// 	duplicate: { desc: `Duplicates a user account` }
// };

const flags = {
	random: {
		desc: `Prints random data`,
		type: 'boolean',
		default: true
	}
};

const helpText = meowHelp({
	name: `create-remax-app`,
	flags
});

const cli = meow(helpText, {
	flags: {
		name: {
			type: 'string'
		}
	}
});

render(<App name={cli.flags.name}/>);
