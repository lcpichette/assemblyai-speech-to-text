"use client";

import ErrorScreen from "@/components/ErrorScreen";
import RecordButton from "@/components/RecordButton";
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
            <p className="mx-auto mt-6 max-w-xl text-wrap text-lg/8 text-gray-300">
                {transcript ||
                    'Click "Start Recording" and speak into your microphone and see the transcription live.'}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <RecordButton
                    isRecording={isRecording}
                    isConnected={isConnected}
                    onStart={startRecording}
                    onStop={stopRecording}
                />
            </div>
            <svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="absolute left-1/4 top-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            >
                <circle
                    r={512}
                    cx={512}
                    cy={512}
                    fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                    fillOpacity="0.4"
                />
                <defs>
                    <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                        <stop stopColor="#FF8C42" />
                        <stop offset={1} stopColor="#FF5733" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}
