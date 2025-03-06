"use client";

import BackgroundGradient from "@/components/BackgroundGradient";
import ErrorScreen from "@/components/ErrorScreen";
import RecordButton from "@/components/RecordButton";
import TranscriptionDisplay from "@/components/TranscriptionDisplay";
import { useTranscription } from "@/hooks/useTranscription";

export default function Home() {
    const {
        isRecording,
        transcript,
        error,
        startRecording,
        stopRecording,
        isConnected,
    } = useTranscription();

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 w-full h-full text-center sm:px-16">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Speech to Text, live.
            </h2>
            <TranscriptionDisplay transcript={transcript} />
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <RecordButton
                    isRecording={isRecording}
                    isConnected={isConnected}
                    onStart={startRecording}
                    onStop={stopRecording}
                />
            </div>
            <BackgroundGradient />
        </div>
    );
}
