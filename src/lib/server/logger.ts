import { pino } from "pino";

const formatter = {
	write(msg: string) {
		try {
			const obj = JSON.parse(msg);

			const levelMapping: { [key: number]: string } = {
				10: "TRACE",
				20: "DEBUG",
				30: "INFO",
				40: "WARN",
				50: "ERROR",
				60: "FATAL",
			};
			const levelLabel =
				levelMapping[obj.level] || obj.level.toString().toUpperCase();

			// Create the base output string
			let output = `${levelLabel} (${obj.name}/${obj.pid}): ${obj.msg}`;

			// Identify and append any additional properties
			const ignoreKeys = new Set([
				"level",
				"time",
				"pid",
				"hostname",
				"name",
				"msg",
			]);
			const extraProps = Object.keys(obj)
				.filter((key) => !ignoreKeys.has(key))
				.map((key) => `${key}=${JSON.stringify(obj[key])}`)
				.join(" ");

			if (extraProps) {
				output += `\n\t${extraProps}`;
			}
			output += "\n";

			if (!process.env?.NODE_ENV?.includes("production")) {
				// Add colors in development mode
				const colors: { [key: string]: string } = {
					TRACE: "\x1b[90m", // Gray
					DEBUG: "\x1b[36m", // Cyan
					INFO: "\x1b[32m", // Green
					WARN: "\x1b[33m", // Yellow
					ERROR: "\x1b[31m", // Red
					FATAL: "\x1b[35m", // Magenta
					RESET: "\x1b[0m", // Reset
				};

				const color = colors[levelLabel] || "";
				output = output.replace(
					levelLabel,
					`${color}${levelLabel}${colors.RESET}`,
				);
			}
			process.stdout.write(output);
		} catch (err) {
			// If parsing fails, write the original message.
			process.stdout.write(msg);
		}
	},
};

export const logger = pino({ name: "fela", timestamp: false }, formatter);
export type Logger = typeof logger;
