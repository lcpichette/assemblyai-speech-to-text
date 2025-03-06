export default function BackgroundGradient() {
    return (
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
    );
}