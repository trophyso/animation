import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { cn } from "../lib/utils";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
    squareSize?: number;
    gridGap?: number;
    flickerChance?: number;
    color?: string;
    width?: number;
    height?: number;
    className?: string;
    maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
    squareSize = 4,
    gridGap = 6,
    flickerChance = 0.3,
    color = "rgb(0, 0, 0)",
    width: widthProp,
    height: heightProp,
    className,
    maxOpacity = 0.3,
    ...props
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frame = useCurrentFrame();
    const { width: compositionWidth, height: compositionHeight, fps } =
        useVideoConfig();

    const width = widthProp ?? compositionWidth;
    const height = heightProp ?? compositionHeight;

    const memoizedColor = useMemo(() => {
        const toRGBA = (inputColor: string) => {
            if (typeof window === "undefined") {
                return `rgba(0, 0, 0,`;
            }
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return "rgba(255, 0, 0,";
            ctx.fillStyle = inputColor;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
            return `rgba(${r}, ${g}, ${b},`;
        };
        return toRGBA(color);
    }, [color]);

    const drawGrid = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            canvasWidth: number,
            canvasHeight: number,
            cols: number,
            rows: number,
            dpr: number,
        ) => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const index = i * rows + j;
                    const flickerSeed = `flicker-${index}-${frame}`;
                    const opacitySeed = `opacity-${index}-${frame}`;
                    const baseOpacitySeed = `base-opacity-${index}`;

                    const shouldFlicker =
                        random(flickerSeed) < flickerChance / fps;
                    const opacity = shouldFlicker
                        ? random(opacitySeed) * maxOpacity
                        : random(baseOpacitySeed) * maxOpacity;

                    ctx.fillStyle = `${memoizedColor}${opacity})`;
                    ctx.fillRect(
                        i * (squareSize + gridGap) * dpr,
                        j * (squareSize + gridGap) * dpr,
                        squareSize * dpr,
                        squareSize * dpr,
                    );
                }
            }
        },
        [
            frame,
            flickerChance,
            fps,
            maxOpacity,
            memoizedColor,
            squareSize,
            gridGap,
        ],
    );

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d") ?? null;
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const cols = Math.ceil(width / (squareSize + gridGap));
        const rows = Math.ceil(height / (squareSize + gridGap));

        drawGrid(ctx, canvas.width, canvas.height, cols, rows, dpr);
    }, [drawGrid, width, height, squareSize, gridGap]);

    return (
        <div className={cn("h-full w-full", className)} {...props}>
            <canvas
                ref={canvasRef}
                className="pointer-events-none"
                style={{
                    width,
                    height,
                }}
            />
        </div>
    );
};
