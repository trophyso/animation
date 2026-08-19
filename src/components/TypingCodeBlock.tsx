import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CODE_FONT_SIZE = 26;
const FILENAME_FONT_SIZE = 24;
/** Approx advance width for Menlo/Consolas monospace at 1px font-size. */
const MONO_CHAR_WIDTH_RATIO = 0.6;
const CONTENT_PADDING_X = 12; // 0.75rem
const HIGHLIGHTER_PADDING_X = 12;
const LINE_NUMBER_MIN_WIDTH_EM = 2.5;
const LINE_NUMBER_PADDING_RIGHT_EM = 1;

/** vscDarkPlus hardcodes 13px on pre/code — override so fontSize actually applies. */
const codeTheme: { [key: string]: CSSProperties } = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        fontSize: CODE_FONT_SIZE,
        background: "transparent",
        margin: 0,
        padding: `${HIGHLIGHTER_PADDING_X}px`,
        whiteSpace: "pre-wrap",
        wordBreak: "normal",
        overflowWrap: "anywhere",
    },
    'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        fontSize: CODE_FONT_SIZE,
        whiteSpace: "pre-wrap",
        wordBreak: "normal",
        overflowWrap: "anywhere",
    },
};

const getMaxCharsPerLine = (availableWidth: number) => {
    const lineNumberGutter =
        CODE_FONT_SIZE * (LINE_NUMBER_MIN_WIDTH_EM + LINE_NUMBER_PADDING_RIGHT_EM);
    const textWidth = Math.max(
        40,
        availableWidth -
        CONTENT_PADDING_X * 2 -
        HIGHLIGHTER_PADDING_X * 2 -
        lineNumberGutter,
    );
    return Math.max(8, Math.floor(textWidth / (CODE_FONT_SIZE * MONO_CHAR_WIDTH_RATIO)));
};

/**
 * Soft-wrap each source line to fit maxChars, preferring breaks at spaces.
 * Long tokens with no spaces are hard-wrapped.
 */
export const wrapCodeLines = (code: string, maxChars: number): string[] => {
    const sourceLines = code.replace(/\n$/, "").split("\n");
    const wrapped: string[] = [];

    for (const line of sourceLines) {
        if (line.length <= maxChars) {
            wrapped.push(line);
            continue;
        }

        let remaining = line;
        while (remaining.length > maxChars) {
            const window = remaining.slice(0, maxChars + 1);
            const lastSpace = window.lastIndexOf(" ");
            // Only break on space if it isn't too early (keeps indent blocks readable).
            const breakAt =
                lastSpace > Math.floor(maxChars * 0.4) ? lastSpace : maxChars;

            wrapped.push(remaining.slice(0, breakAt));
            remaining = remaining.slice(breakAt);
            // Drop a single leading space introduced by the break.
            if (remaining.startsWith(" ")) {
                remaining = remaining.slice(1);
            }
        }

        wrapped.push(remaining);
    }

    return wrapped;
};

type TypingCodeBlockProps = {
    code: string;
    language?: string;
    filename?: string;
    /**
     * Pixel width of this component's box (before internal padding).
     * Used to compute how many characters fit per line.
     */
    availableWidth: number;
    /** Frames to wait before typing begins. */
    delayInFrames?: number;
    /** Frames between each line starting to type. */
    framesPerLine?: number;
    /** Frames for a single line to fully type out. */
    lineTypingFrames?: number;
    style?: React.CSSProperties;
};

export const TypingCodeBlock: React.FC<TypingCodeBlockProps> = ({
    code,
    language = "typescript",
    filename = "client.ts",
    availableWidth,
    delayInFrames = 0,
    framesPerLine = 12,
    lineTypingFrames = 22,
    style,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const maxChars = getMaxCharsPerLine(availableWidth);
    const lines = wrapCodeLines(code, maxChars);

    const visibleCode = lines
        .map((line, index) => {
            const lineStart = delayInFrames + index * framesPerLine;
            const progress = interpolate(
                frame,
                [lineStart, lineStart + lineTypingFrames],
                [0, 1],
                {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                },
            );
            const visibleChars = Math.floor(line.length * progress);
            return line.slice(0, visibleChars);
        })
        .join("\n");

    // Keep the editor chrome visible even before the first characters appear.
    const showContent =
        frame >= delayInFrames - Math.round(fps * 0.05) || delayInFrames === 0;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                minHeight: 0,
                backgroundColor: "#1E1E1E",
                borderRadius: 20,
                overflow: "hidden",
                opacity: showContent ? 1 : 0,
                ...style,
            }}
        >
            <div
                style={{
                    flexShrink: 0,
                    backgroundColor: "#2D2D2D",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid #3D3D3D",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                <div style={{ display: "flex", gap: "0.65rem" }}>
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: "#FF5F56",
                        }}
                    />
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: "#FFBD2E",
                        }}
                    />
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: "#27C93F",
                        }}
                    />
                </div>
                <div
                    style={{
                        color: "#8B8B8B",
                        fontSize: FILENAME_FONT_SIZE,
                        fontFamily: "monospace",
                        marginLeft: "0.5rem",
                    }}
                >
                    {filename}
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                    padding: `${CONTENT_PADDING_X}px`,
                }}
            >
                <SyntaxHighlighter
                    language={language}
                    style={codeTheme}
                    customStyle={{
                        margin: 0,
                        borderRadius: 8,
                        padding: `${HIGHLIGHTER_PADDING_X}px`,
                        height: "100%",
                        background: "transparent",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                    }}
                    codeTagProps={{
                        style: {
                            fontSize: CODE_FONT_SIZE,
                            fontFamily:
                                'Menlo, Monaco, Consolas, "Courier New", monospace',
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                        },
                    }}
                    showLineNumbers
                    wrapLines
                    wrapLongLines
                    lineNumberStyle={{
                        color: "#858585",
                        minWidth: `${LINE_NUMBER_MIN_WIDTH_EM}em`,
                        paddingRight: `${LINE_NUMBER_PADDING_RIGHT_EM}em`,
                        textAlign: "right",
                        userSelect: "none",
                        fontSize: CODE_FONT_SIZE,
                    }}
                >
                    {visibleCode || " "}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

/** Total frames needed for the given code to finish typing (after wrapping). */
export const getTypingCodeDurationInFrames = ({
    code,
    availableWidth,
    delayInFrames = 0,
    framesPerLine = 12,
    lineTypingFrames = 22,
    holdFrames = 45,
}: {
    code: string;
    availableWidth: number;
    delayInFrames?: number;
    framesPerLine?: number;
    lineTypingFrames?: number;
    holdFrames?: number;
}) => {
    const maxChars = getMaxCharsPerLine(availableWidth);
    const lineCount = Math.max(wrapCodeLines(code, maxChars).length, 1);
    return (
        delayInFrames +
        (lineCount - 1) * framesPerLine +
        lineTypingFrames +
        holdFrames
    );
};
