import { useRef, useState, useEffect } from "react";
import axios from "axios";

// === Lipsync tuning ===
const GAIN = 16.0;
const THRESHOLD = 0.02;
const ATTACK = 0.45;
const RELEASE = 0.12;
const CURVE = 0.55;
const MAX_OPEN = 1.0;

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export function useAudioLipsync() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const isSpeakingRef = useRef(false);
    const mouthOpenRef = useRef(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);
    const envRef = useRef(0);
    const playIdRef = useRef(0);

    useEffect(() => {
        return () => {
            stopAudioAndLipSync();
        };
    }, []);

    function stopAudioAndLipSync(expectedPlayId?: number) {
        if (expectedPlayId != null && expectedPlayId !== playIdRef.current) return;

        setIsSpeaking(false);
        isSpeakingRef.current = false;

        mouthOpenRef.current = 0;
        envRef.current = 0;

        if (rafRef.current != null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        const audio = audioRef.current;
        audioRef.current = null;
        if (audio) {
            try {
                audio.pause();
            } catch { }
            if (audio.src.startsWith("blob:")) URL.revokeObjectURL(audio.src);
            audio.src = "";
        }

        const ctx = audioCtxRef.current;
        audioCtxRef.current = null;
        analyserRef.current = null;
        if (ctx) ctx.close().catch(() => { });
    }

    async function startLipSyncFromAudioElement(audio: HTMLAudioElement, playId: number) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AudioCtx();
        audioCtxRef.current = ctx;

        if (ctx.state === "suspended") {
            try {
                await ctx.resume();
            } catch { }
        }

        const srcNode = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.7;
        analyserRef.current = analyser;

        srcNode.connect(analyser);
        analyser.connect(ctx.destination);

        const buf = new Uint8Array(analyser.fftSize);

        const tick = () => {
            if (playId !== playIdRef.current) return;
            if (!analyserRef.current || !isSpeakingRef.current) return;

            analyser.getByteTimeDomainData(buf);

            let sum = 0;
            for (let i = 0; i < buf.length; i++) {
                const v = (buf[i] - 128) / 128;
                sum += v * v;
            }
            const rms = Math.sqrt(sum / buf.length);

            // Gate
            let level = rms - THRESHOLD;
            if (level < 0) level = 0;

            // Gain + curve
            let x = Math.min(1, level * GAIN);
            x = Math.pow(x, CURVE);

            // Attack/Release smoothing
            const prev = envRef.current;
            const k = x > prev ? ATTACK : RELEASE;
            const smooth = prev + k * (x - prev);
            envRef.current = smooth;

            mouthOpenRef.current = Math.min(MAX_OPEN, Math.max(0, smooth));

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
    }

    async function ttsAndPlay(textToSpeak: string) {
        playIdRef.current += 1;
        const myPlayId = playIdRef.current;

        stopAudioAndLipSync();
        setIsSpeaking(true);
        isSpeakingRef.current = true;

        try {
            const res = await axios.post(
                `${API_BASE}/tts`,
                { text: textToSpeak, model_id: "eleven_multilingual_v2" },
                { responseType: "arraybuffer" }
            );

            if (myPlayId !== playIdRef.current) return;

            const blob = new Blob([res.data], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => stopAudioAndLipSync(myPlayId);
            audio.onerror = () => stopAudioAndLipSync(myPlayId);

            await startLipSyncFromAudioElement(audio, myPlayId);

            try {
                await audio.play();
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                throw e;
            }
        } catch (e) {
            console.error("TTS Error", e);
            stopAudioAndLipSync(myPlayId);
        }
    }

    return {
        isSpeaking,
        mouthOpenRef,
        playAudio: ttsAndPlay,
        stopAudio: stopAudioAndLipSync,
    };
}
