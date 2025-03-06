class PCMProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input.length > 0) {
            const pcmData = new Int16Array(input[0].length);
            for (let i = 0; i < input[0].length; i++) {
                // Convert Float32 to Int16
                pcmData[i] = Math.max(
                    -32768,
                    Math.min(32767, Math.floor(input[0][i] * 32768))
                );
            }
            this.port.postMessage({ pcmData });
        }
        return true;
    }
}

registerProcessor("pcm-processor", PCMProcessor);
