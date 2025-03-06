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
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 w-full h-full text-center sm:px-16">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Speech to Text, live.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-wrap text-lg/8 text-gray-300">
                {transcript ||
                    'Click "Start Recording" and speak into your microphone and see the transcription live.'}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="rounded-md bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="rounded-md bg-red-800 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
                    >
                        Stop Recording
                    </button>
                )}
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
