"use client";

import ErrorScreen from "@/components/ErrorScreen";
import { useTranscription } from "@/hooks/useTranscription";

export default function Home() {
    const { isRecording, transcript, error, startRecording, stopRecording } =
        useTranscription();

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div className="p-4">
            <h1>Transcription</h1>
            <div className="my-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Stop Recording
                    </button>
                )}
            </div>
            <div className="mt-4">
                <h2>Transcript:</h2>
                <p>{transcript || "No transcript yet..."}</p>
            </div>
        </div>
    );
}
