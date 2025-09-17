import prisma from "@/lib/datastore";
import { ServerError } from "@/lib/server/api.error";
import {
	makeResponse,
	validateDataOrThrow,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import type { NextRequest } from "next/server";
import { z } from "zod";

const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().optional(),
});

export const POST = withRouterErrorHandler(async (request: NextRequest) => {
	const { email, password, name } = validateDataOrThrow({
		data: await request.json(),
		schema: RegisterSchema,
	});
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});
	if (existingUser) {
		throw new ServerError("User already exists", StatusCodes.BAD_REQUEST);
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	const user = await prisma.user.create({
		data: { email, password: hashedPassword, name },
	});
	return makeResponse({ data: { userId: user.id } });
});
