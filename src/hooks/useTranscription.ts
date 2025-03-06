import { useState, useEffect, useRef } from "react";
import { RealtimeTranscriber } from "assemblyai";
import { AudioProcessor } from "@/utils/audioProcessor";

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
    const [isConnected, setIsConnected] = useState(false);
    const initializingRef = useRef(false);

    useEffect(() => {
        const initializeTranscriber = async () => {
            if (transcriber || initializingRef.current) return;
            initializingRef.current = true;

            try {
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
                setIsConnected(true);
            } catch (err) {
                setIsConnected(false);
                setError(
                    err instanceof Error
                        ? err
                        : new Error(`Error initializing transcriber: ${err}`)
                );
            } finally {
                initializingRef.current = false;
            }
        };

        initializeTranscriber();

        return () => {
            if (transcriber) {
                setIsConnected(false);
                transcriber.close();
            }
        };
    }, [transcriber]);

    const startRecording = async () => {
        try {
            if (!transcriber || !isConnected) {
                throw new Error("Transcription service not ready");
            }

            const context = new AudioContext();
            setAudioContext(context);

            const processor = new AudioProcessor(context.sampleRate);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: context.sampleRate,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            const source = context.createMediaStreamSource(stream);
            setSourceNode(source);

            const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
            setProcessorNode(scriptProcessor);

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData =
                    audioProcessingEvent.inputBuffer.getChannelData(0);
                const processedBuffer = processor.processAudioData(inputData);
                transcriber.sendAudio(processedBuffer);
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(context.destination);

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
        isConnected,
    };
};
