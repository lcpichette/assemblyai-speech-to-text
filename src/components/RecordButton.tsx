interface RecordButtonProps {
    isRecording: boolean;
    isConnected: boolean;
    onStart: () => void;
    onStop: () => void;
}

export default function RecordButton({
    isRecording,
    isConnected,
    onStart,
    onStop,
}: RecordButtonProps) {
    if (!isConnected) {
        return (
            <button className="rounded-md user-none cursor-not-allowed bg-gray-500 text-gray-50 px-3.5 py-2.5 text-sm font-semibold">
                Not Connected
            </button>
        );
    }
    if (!isRecording) {
        return (
            <button
                onClick={onStart}
                className="rounded-md cursor-pointer bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
            >
                Start Recording
            </button>
        );
    }

    return (
        <button
            onClick={onStop}
            className="rounded-md cursor-pointer bg-red-800 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
        >
            Stop Recording
        </button>
    );
}
