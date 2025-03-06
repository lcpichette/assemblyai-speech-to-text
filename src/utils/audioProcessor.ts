import { mulaw as MuLaw } from "alawmulaw";

export class AudioProcessor {
    private nativeSampleRate: number;
    private targetSampleRate: number = 16000;

    constructor(nativeSampleRate: number) {
        this.nativeSampleRate = nativeSampleRate;
    }

    processAudioData(inputData: Float32Array): ArrayBuffer {
        const needsResampling = this.nativeSampleRate !== this.targetSampleRate;
        const processedData = needsResampling
            ? this.resample(inputData)
            : inputData;

        const pcmData = this.convertToPCM(processedData);
        const encodedData = MuLaw.encode(pcmData);
        // Ensure we return a proper ArrayBuffer by creating a new one if needed
        return encodedData.buffer instanceof ArrayBuffer
            ? encodedData.buffer
            : new ArrayBuffer(encodedData.buffer.byteLength);
    }

    private resample(inputData: Float32Array): Float32Array {
        const ratio = this.nativeSampleRate / this.targetSampleRate;
        const downsampledLength = Math.floor(inputData.length / ratio);
        const downsampledData = new Float32Array(downsampledLength);

        for (let i = 0; i < downsampledLength; i++) {
            downsampledData[i] = inputData[Math.floor(i * ratio)];
        }

        return downsampledData;
    }

    private convertToPCM(floatData: Float32Array): Int16Array {
        const pcmData = new Int16Array(floatData.length);
        for (let i = 0; i < floatData.length; i++) {
            pcmData[i] = Math.max(
                -32768,
                Math.min(32767, Math.round(floatData[i] * 32767))
            );
        }
        return pcmData;
    }
}
