import { useState } from "react";
import { RealtimeTranscriber } from "assemblyai";
import { mulaw as MuLaw } from "alawmulaw";

export const useTranscription = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState<Error | undefined>();
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [transcriber, setTranscriber] = useState<RealtimeTranscriber | null>(
        null
    );
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [sourceNode, setSourceNode] =
        useState<MediaStreamAudioSourceNode | null>(null);
    const [processorNode, setProcessorNode] =
        useState<ScriptProcessorNode | null>(null);

    const startRecording = async () => {
        try {
            const context = new AudioContext();
            setAudioContext(context);

            const nativeSampleRate = context.sampleRate;

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: nativeSampleRate,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            const response = await fetch("/api/token");
            if (!response.ok) {
                throw new Error("Failed to get transcription token");
            }
            const { token } = await response.json();

            const newTranscriber = new RealtimeTranscriber({
                sampleRate: 16000,
                encoding: "pcm_mulaw",
                token,
            });

            newTranscriber.on("transcript", (transcriptData) => {
                if (transcriptData.text) {
                    setTranscript(transcriptData.text);
                }
            });

            await newTranscriber.connect();
            setTranscriber(newTranscriber);

            const source = context.createMediaStreamSource(stream);
            setSourceNode(source);

            const processor = context.createScriptProcessor(4096, 1, 1);
            setProcessorNode(processor);

            const needsResampling = nativeSampleRate !== 16000;
            processor.onaudioprocess = (audioProcessingEvent) => {
                const inputBuffer = audioProcessingEvent.inputBuffer;
                const inputData = inputBuffer.getChannelData(0);

                let dataToProcess: Float32Array;

                if (needsResampling) {
                    // Simple downsampling (taking every n-th sample)
                    const ratio = nativeSampleRate / 16000;
                    const downsampledLength = Math.floor(
                        inputData.length / ratio
                    );
                    const downsampledData = new Float32Array(downsampledLength);

                    for (let i = 0; i < downsampledLength; i++) {
                        // Take every n-th sample (where n is the ratio)
                        downsampledData[i] = inputData[Math.floor(i * ratio)];
                    }

                    dataToProcess = downsampledData;
                } else {
                    dataToProcess = inputData;
                }

                // Convert float32 (-1.0 to 1.0) to int16 (-32768 to 32767)
                const pcmData = new Int16Array(dataToProcess.length);
                for (let i = 0; i < dataToProcess.length; i++) {
                    pcmData[i] = Math.max(
                        -32768,
                        Math.min(32767, Math.round(dataToProcess[i] * 32767))
                    );
                }

                const mulawData = MuLaw.encode(pcmData);
                newTranscriber.sendAudio(mulawData.buffer);
            };

            // Connect the nodes: source -> processor -> destination (needed for processor to work)
            source.connect(processor);
            processor.connect(context.destination);

            const recorder = new MediaRecorder(stream);
            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            console.error("Recording error:", err);
            setError(
                err instanceof Error
                    ? err
                    : new Error(`Error accessing microphone: ${err}`)
            );
        }
    };

    const stopRecording = () => {
        // Disconnect and clean up audio processing nodes
        if (processorNode && sourceNode && audioContext) {
            processorNode.disconnect();
            sourceNode.disconnect();
            // No need to close audioContext as it might be reused
        }

        // Stop and clean up media recorder
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        }

        // Disconnect transcriber
        if (transcriber) {
            transcriber.close();
        }

        setIsRecording(false);
    };

    return {
        isRecording,
        transcript,
        error,
        startRecording,
        stopRecording,
    };
};
