interface RecordButtonProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
}

export default function RecordButton({ isRecording, onStart, onStop }: RecordButtonProps) {
    if (!isRecording) {
        return (
            <button
                onClick={onStart}
                className="rounded-md bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
            >
                Start Recording
            </button>
        );
    }

    return (
        <button
            onClick={onStop}
            className="rounded-md bg-red-800 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
        >
            Stop Recording
        </button>
    );
}