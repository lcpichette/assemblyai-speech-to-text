import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = new AssemblyAI({
            apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY || "",
        });

        const token = await client.realtime.createTemporaryToken({
            expires_in: 6000,
        });

        return NextResponse.json({ token });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to generate token: ${error}` },
            { status: 500 }
        );
    }
}
