type Props = {
    error?: Error;
};

// update this to work with generic Error objects
const errorTitles: Record<string, string> = {
    // HTTP Error codes
    "404": "Page not found",
    "500": "Internal server error",
    "503": "Service unavailable",
    "504": "Gateway timeout",
    "508": "Loop detected",
    "511": "Network authentication required",
    // Common Error types
    Error: "An error occurred",
    TypeError: "Type error occurred",
    ReferenceError: "Reference error occurred",
    SyntaxError: "Syntax error occurred",
    RangeError: "Range error occurred",
    NetworkError: "Network error occurred",
    PermissionError: "Permission denied",
};

export default function ErrorScreen({ error }: Props) {
    return (
        <>
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-indigo-600">
                        404
                    </p>
                    <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                        {error && error.name
                            ? errorTitles[error.name]
                            : "Page not found"}
                    </h1>
                    <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                        {error
                            ? error.message
                            : "Sorry, we couldn't find the page you were looking for."}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Go back home
                        </a>
                        <a
                            href="#"
                            className="text-sm font-semibold text-gray-900"
                        >
                            Contact support{" "}
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
