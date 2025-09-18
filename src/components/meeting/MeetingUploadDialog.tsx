import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinners";
import { TIME_IN_MILLISECONDS } from "@/lib/utils";
import { Check, FileText, Sparkles, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type ProgressStep =
	| "uploading"
	| "transcribing"
	| "generating"
	| "complete";

interface MeetingUploadDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onUpload: (title: string) => void;
	isUploading?: boolean;
	currentStep?: ProgressStep;
}

interface ProgressStepItemProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	status: "pending" | "active" | "complete";
}

const ProgressStepItem = ({
	icon,
	title,
	description,
	status,
}: ProgressStepItemProps) => {
	return (
		<div className="flex items-center space-x-4 p-4 rounded-lg border  text-sm transition-all duration-300 ease-in-out">
			<div
				className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
					status === "complete"
						? "bg-green-100 text-green-600"
						: status === "active"
							? "bg-blue-100 text-blue-600"
							: "bg-gray-100 text-gray-400"
				}`}
			>
				{status === "complete" ? (
					<Check className="w-5 h-5" />
				) : status === "active" ? (
					<Spinner size={5} className="w-5 h-5" />
				) : (
					icon
				)}
			</div>
			<div className="flex-1">
				<h3
					className={`font-medium transition-colors ${
						status === "active"
							? "text-blue-600"
							: status === "complete"
								? "text-green-600"
								: "text-gray-500"
					}`}
				>
					{title}
				</h3>
				<p className="text-xs text-gray-500">{description}</p>
			</div>
		</div>
	);
};

export const MeetingUploadDialog = ({
	isOpen,
	onOpenChange,
	onUpload,
	isUploading = false,
	currentStep,
}: MeetingUploadDialogProps) => {
	const [title, setTitle] = useState(
		`Meeting - ${new Date().toLocaleDateString()}`,
	);
	const [internalStep, setInternalStep] = useState<ProgressStep | undefined>(
		undefined,
	);
	const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

	// Clean up timeouts on unmount
	useEffect(() => {
		return () => {
			for (const timeout of timeoutsRef.current) {
				clearTimeout(timeout);
			}
		};
	}, []);

	/**
	 * Handle progress simulation when upload starts.
	 */
	useEffect(() => {
		if (isUploading && !internalStep) {
			/**
			 * Clear any existing timeouts.
			 */
			for (const timeout of timeoutsRef.current) {
				clearTimeout(timeout);
			}
			timeoutsRef.current = [];

			/**
			 * Start progress simulation.
			 */
			setInternalStep("uploading");

			/**
			 * After 15 seconds, move to transcribing.
			 */
			const timeout1 = setTimeout(() => {
				setInternalStep("transcribing");
			}, TIME_IN_MILLISECONDS.FIFTEEN_SECONDS);
			timeoutsRef.current.push(timeout1);

			/**
			 * After 30 seconds total (15s upload + 15s transcribing), move to generating.
			 */
			const timeout2 = setTimeout(() => {
				setInternalStep("generating");
			}, TIME_IN_MILLISECONDS.THIRTY_SECONDS);
			timeoutsRef.current.push(timeout2);
		}
	}, [isUploading, internalStep]);

	// Handle when the actual API call completes
	useEffect(() => {
		if (currentStep === "complete" && internalStep) {
			// If we're still in uploading or transcribing phase, jump to generating
			if (internalStep === "uploading" || internalStep === "transcribing") {
				setInternalStep("generating");
			}

			// Wait a moment to show generating, then complete
			const completeTimeout = setTimeout(() => {
				setInternalStep("complete");

				// Show completion for a moment before redirecting
				const redirectTimeout = setTimeout(() => {
					// This will be handled by the parent component's onSuccess
				}, 800);
				timeoutsRef.current.push(redirectTimeout);
			}, 500);
			timeoutsRef.current.push(completeTimeout);
		}
	}, [currentStep, internalStep]);

	// Reset internal state when dialog closes or upload finishes
	useEffect(() => {
		if (!isUploading) {
			setInternalStep(undefined);
		}
	}, [isUploading]);

	const handleUpload = () => {
		if (!title.trim()) {
			toast.error("Please enter a meeting title");
			return;
		}
		onUpload(title);
	};

	const getStepStatus = (
		step: ProgressStep,
	): "pending" | "active" | "complete" => {
		if (!internalStep) return "pending";

		const stepOrder: ProgressStep[] = [
			"uploading",
			"transcribing",
			"generating",
			"complete",
		];
		const currentIndex = stepOrder.indexOf(internalStep);
		const stepIndex = stepOrder.indexOf(step);

		if (stepIndex < currentIndex) return "complete";
		if (stepIndex === currentIndex) return "active";
		return "pending";
	};

	const progressSteps = [
		{
			id: "uploading" as ProgressStep,
			icon: <Upload className="w-5 h-5" />,
			title: "Uploading video",
			description: "Securely uploading your meeting recording...",
		},
		{
			id: "transcribing" as ProgressStep,
			icon: <FileText className="w-5 h-5" />,
			title: "Transcribing video",
			description: "Converting speech to text using AI...",
		},
		{
			id: "generating" as ProgressStep,
			icon: <Sparkles className="w-5 h-5" />,
			title: "Creating summary and action items",
			description: "Analyzing content and generating insights...",
		},
	];

	return (
		<Dialog open={isOpen} onOpenChange={isUploading ? () => {} : onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isUploading ? "Processing..." : "Save Recording"}
					</DialogTitle>
					<DialogDescription>
						{isUploading
							? "Please be patient while we process your recording, this could take up to 60 seconds."
							: "Give your meeting a title and save the recording and transcription."}
					</DialogDescription>
				</DialogHeader>

				{isUploading ? (
					<div className="space-y-4 py-4">
						{progressSteps.map((step) => (
							<ProgressStepItem
								key={step.id}
								icon={step.icon}
								title={step.title}
								description={step.description}
								status={getStepStatus(step.id)}
							/>
						))}

						{internalStep === "complete" && (
							<div className="text-center pt-4">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
									<Check className="w-8 h-8 text-green-600" />
								</div>
								<p className="text-lg font-medium text-green-600">All done!</p>
								<p className="text-sm text-gray-500">
									Redirecting to your meeting...
								</p>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-4">
						<div>
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter meeting title"
								disabled={isUploading}
								className="mt-2"
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isUploading}
							>
								Cancel
							</Button>
							<Button
								onClick={handleUpload}
								disabled={isUploading || !title.trim()}
								isLoading={isUploading}
							>
								Save
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
