interface TranscriptionDisplayProps {
    transcript: string;
}

export default function TranscriptionDisplay({
    transcript,
}: TranscriptionDisplayProps) {
    return (
        <p className="mx-auto mt-6 max-w-xl text-wrap text-lg/8 text-gray-300">
            {transcript ||
                'Click "Start Recording" and speak into your microphone and see the transcription live.'}
        </p>
    );
}
