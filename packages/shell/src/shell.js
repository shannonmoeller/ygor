import { shell as execa } from 'execa';
import escape from 'any-shell-escape';

function compileShell(options) {
	options = {
		stdio: 'inherit',
		...options,
	};

	return (strings, ...values) => {
		function toCommand(command, rawString, i) {
			const value = values[i];

			if (value === null || value === undefined) {
				return command + rawString;
			}

			return command + rawString + escape([].concat(value));
		}

		const compiledCommand = strings.raw.reduce(toCommand, '');

		return execa(compiledCommand, options);
	};
}

export default function shell(...args) {
	if (Array.isArray(args[0])) {
		return compileShell()(...args);
	}

	return compileShell(...args);
}
