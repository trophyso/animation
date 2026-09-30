import React from "react";
import { Battery, Signal, Wifi } from "lucide-react";
import { sansFont } from "../fonts";

export const PHONE_WIDTH = 480;
export const PHONE_HEIGHT = 980;
const BEZEL = 16;

/** iPhone-style shell with dynamic island and status bar. Children fill the screen. */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  screenColor?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}> = ({ children, screenColor = "#f6f7f9", fontFamily = sansFont, style }) => {
  return (
    <div
      style={{
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        borderRadius: 72,
        backgroundColor: "#1c1c1e",
        padding: BEZEL,
        boxSizing: "border-box",
        boxShadow: [
          "0 0 0 2px #3a3a3c inset",
          "0 30px 60px -12px rgba(15, 23, 42, 0.35)",
          "0 60px 120px -24px rgba(15, 23, 42, 0.25)",
        ].join(", "),
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 58,
          overflow: "hidden",
          backgroundColor: screenColor,
          fontFamily,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 128,
            height: 36,
            borderRadius: 999,
            backgroundColor: "#000",
            zIndex: 100,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 36px",
            fontSize: 19,
            fontWeight: 600,
            color: "#000",
            zIndex: 90,
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Signal size={18} strokeWidth={2.5} />
            <Wifi size={18} strokeWidth={2.5} />
            <Battery size={22} strokeWidth={2} />
          </div>
        </div>
        {children}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 150,
            height: 5,
            borderRadius: 999,
            backgroundColor: "#0f172a",
            zIndex: 100,
          }}
        />
      </div>
    </div>
  );
};

export const PHONE_SCREEN_WIDTH = PHONE_WIDTH - BEZEL * 2;
