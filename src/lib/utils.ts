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
