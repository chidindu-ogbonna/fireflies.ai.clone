import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: ZodError | Error | unknown): string => {
	if (error instanceof ZodError) {
		const errorMessages = error.issues.map((issue) => {
			const path = issue.path.join(".");
			return `${path}: ${issue.message}`;
		});
		return errorMessages.join(", ");
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "Unknown error";
};

export const TIME_IN_SECONDS = {
	ONE_DAY: 24 * 60 * 60,
	ONE_WEEK: 7 * 24 * 60 * 60,
	ONE_MONTH: 30 * 24 * 60 * 60,
	ONE_YEAR: 365 * 24 * 60 * 60,
	FIVE_MINUTES: 5 * 60,
	FIFTEEN_SECONDS: 15,
	THIRTY_SECONDS: 30,
	SIXTY_SECONDS: 60,
	SEVEN_DAYS: 7 * 24 * 60 * 60,
};

export const TIME_IN_MILLISECONDS = {
	ONE_DAY: TIME_IN_SECONDS.ONE_DAY * 1000,
	ONE_WEEK: TIME_IN_SECONDS.ONE_WEEK * 1000,
	ONE_MONTH: TIME_IN_SECONDS.ONE_MONTH * 1000,
	ONE_YEAR: TIME_IN_SECONDS.ONE_YEAR * 1000,
	FIVE_MINUTES: TIME_IN_SECONDS.FIVE_MINUTES * 1000,
	FIFTEEN_SECONDS: TIME_IN_SECONDS.FIFTEEN_SECONDS * 1000,
	THIRTY_SECONDS: TIME_IN_SECONDS.THIRTY_SECONDS * 1000,
	SIXTY_SECONDS: TIME_IN_SECONDS.SIXTY_SECONDS * 1000,
	SEVEN_DAYS: TIME_IN_SECONDS.SEVEN_DAYS * 1000,
};
