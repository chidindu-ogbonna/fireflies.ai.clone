interface TranscriptionDisplayProps {
	transcription: string;
}

export function TranscriptionDisplay({
	transcription,
}: TranscriptionDisplayProps) {
	return (
		<div className="rounded-lg border p-6">
			<h3 className="text-lg font-semibold mb-4">Transcription</h3>
			<div className="prose max-w-none">
				<div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
					{transcription}
				</div>
			</div>
		</div>
	);
}
