import type { StatusCodes } from "http-status-codes";

export class ServerError extends Error {
	statusCode: StatusCodes;

	constructor(message: string, statusCode: StatusCodes) {
		super(message);
		this.name = "ServerError";
		this.statusCode = statusCode;
	}

	static fromError(error: unknown, statusCode: StatusCodes) {
		if (ServerError.isServerError(error)) {
			return error;
		}
		if (error instanceof Error) {
			return new ServerError(error.message, statusCode);
		}
		return new ServerError("Unknown error", statusCode);
	}

	static isServerError(error: unknown) {
		return error instanceof ServerError;
	}
}
