import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, showPasswordToggle, ...props }, ref) => {
		const [isPasswordVisible, setIsPasswordVisible] = useState(false);
		const isPasswordField =
			type === "password" || (showPasswordToggle && type !== "text");
		const shouldShowToggle = isPasswordField && showPasswordToggle !== false;
		const handleTogglePasswordVisibility = () => {
			setIsPasswordVisible(!isPasswordVisible);
		};

		const getInputType = () => {
			if (isPasswordField) {
				return isPasswordVisible ? "text" : "password";
			}
			return type;
		};

		if (shouldShowToggle) {
			return (
				<div className="relative">
					<input
						{...props}
						type={getInputType()}
						className={cn(
							"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							className,
						)}
						ref={ref}
					/>
					<button
						type="button"
						className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground/70 hover:text-foreground focus:text-foreground focus:outline-none transition-colors cursor-pointer"
						onClick={handleTogglePasswordVisibility}
						aria-label={isPasswordVisible ? "Hide password" : "Show password"}
						tabIndex={-1}
					>
						{isPasswordVisible ? (
							<EyeClosed className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			);
		}

		return (
			<input
				{...props}
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
