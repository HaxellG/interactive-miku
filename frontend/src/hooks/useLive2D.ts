import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel, MotionPreloadStrategy, MotionPriority } from "pixi-live2d-display/cubism4";
import type { MotionGroup } from "../types/miku";

(window as any).PIXI = PIXI;

const MODEL_URL = `${import.meta.env.BASE_URL}live2d/miku/miku_sample_t04.model3.json`;

function setParameter(model: any, id: string, value: number) {
    const core = model?.internalModel?.coreModel;
    if (!core) return;
    if (typeof core.setParameterValueById === "function") {
        core.setParameterValueById(id, value);
    }
}

interface UseLive2DProps {
    mouthOpenRef: React.MutableRefObject<number>;
}

export function useLive2D({ mouthOpenRef }: UseLive2DProps) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    const modelRef = useRef<any>(null);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let disposed = false;

        async function init() {
            const host = hostRef.current;
            if (!host) return;

            const app = new PIXI.Application({
                backgroundAlpha: 0,
                resizeTo: host,
                antialias: true,
                autoStart: true,
                powerPreference: "high-performance",
            });

            appRef.current = app;
            host.appendChild(app.view as any);

            const isWebGL = (app.renderer as any).type === PIXI.RENDERER_TYPE.WEBGL;
            if (!isWebGL) {
                console.warn("WebGL not supported");
                return;
            }

            const model = await Live2DModel.from(MODEL_URL, {
                motionPreload: MotionPreloadStrategy.IDLE,
                autoInteract: false,
                autoUpdate: false,
            });

            if (disposed) return;

            if ((model as any).internalModel?.eyeBlink) {
                (model as any).internalModel.eyeBlink = undefined;
            }

            (model as any).internalModel?.on?.("beforeModelUpdate", () => {
                setParameter(model, "ParamMouthOpenY", mouthOpenRef.current);
            });

            modelRef.current = model;
            app.stage.addChild(model);

            model.updateTransform();
            const bounds = model.getBounds();
            const unscaledHeight = bounds.height;

            const updateLayout = () => {
                const targetH = app.renderer.height * 0.9;
                const scale = targetH / Math.max(1, unscaledHeight);
                model.scale.set(scale);

                model.anchor.set(0.5, 0.5);
                model.x = app.renderer.width * 0.5;
                model.y = app.renderer.height * 0.55;
            };

            updateLayout();

            app.ticker.add(() => {
                const m = modelRef.current;
                if (!m) return;
                m.update(app.ticker.elapsedMS);
            });

            app.renderer.on("resize", () => {
                const m = modelRef.current;
                if (!m) return;
                updateLayout();
            });

            setIsLoaded(true);
        }

        init().catch(console.error);

        return () => {
            disposed = true;
            const app = appRef.current;
            appRef.current = null;
            modelRef.current = null;
            if (app) app.destroy(true, { children: true, texture: true, baseTexture: true });
        };
    }, [mouthOpenRef]);

    async function playMotion(group: MotionGroup, index?: number) {
        const model = modelRef.current;
        if (!model) return;
        await model.motion(group, index, MotionPriority.NORMAL);
    }

    return {
        hostRef, // Attach this to the div
        playMotion,
        isLoaded,
    };
}
