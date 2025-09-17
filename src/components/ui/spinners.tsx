import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface ISVGProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
	className?: string;
}

export const Spinner = ({ size = 4, className }: ISVGProps) => {
	return (
		<Loader
			className={cn(`w-${size} h-${size} animate-spin text-primary`, className)}
		/>
	);
};
