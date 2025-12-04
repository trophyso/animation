import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Wifi, Signal, Battery, LucideIcon } from "lucide-react";
import { LightBackground } from "./LightBackground";

const { fontFamily } = loadFont();

interface PushNotificationPhoneProps {
    icon: LucideIcon;
    iconColor?: string;
    showStackedNotifications?: boolean;
    title?: string;
}

export const PushNotificationPhone: React.FC<PushNotificationPhoneProps> = ({
    icon: Icon,
    iconColor = "#4CC74A",
    showStackedNotifications = false,
    title,
}) => {
    return (
        <AbsoluteFill>
            <LightBackground />
            <AbsoluteFill
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Phone Frame */}
                <div
                    style={{
                        width: '562.5px',
                        height: '1083px',
                        backgroundColor: '#2C2C2E',
                        borderRadius: '75px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
                        position: 'relative',
                        top: "200px",
                        overflow: 'hidden',
                        border: '18px solid #2C2C2E',
                    }}
                >
                    {/* Screen Content */}
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f5f5f5',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Dynamic Island */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '180px',
                                height: '42px',
                                backgroundColor: '#000',
                                borderRadius: '40px',
                                zIndex: 1000,
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                            }}
                        />

                        {/* Status Bar Icons */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                height: '66px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0 40px',
                                color: '#333',
                                fontSize: '30px',
                                fontFamily: fontFamily,
                                fontWeight: '600',
                                zIndex: 100,
                            }}
                        >
                            <div style={{ width: '100px' }} />
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Signal size={24} />
                                <Wifi size={24} />
                                <Battery size={24} />
                            </div>
                        </div>

                        {/* Lock Screen Date and Time */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '90px',
                                left: '0',
                                right: '0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: '#333',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: fontFamily,
                                    fontSize: '30px',
                                    fontWeight: '600',
                                    color: '#ddd',
                                    marginBottom: '4px',
                                }}
                            >
                                Thursday, December 4
                            </div>
                            <div
                                style={{
                                    fontFamily: fontFamily,
                                    fontSize: '108px',
                                    fontWeight: '700',
                                    lineHeight: '1',
                                    color: '#ddd',
                                }}
                            >
                                9:41
                            </div>
                        </div>

                        {/* Stacked Notifications (background) */}
                        {showStackedNotifications && (
                            <>
                                {/* Third notification (furthest back) */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '340px',
                                        left: '24px',
                                        right: '24px',
                                        height: '88px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                        borderRadius: '18px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(220, 220, 220, 0.5)',
                                        zIndex: 8,
                                    }}
                                />
                                {/* Second notification (middle) */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '320px',
                                        left: '18px',
                                        right: '18px',
                                        height: '90px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                        borderRadius: '18px',
                                        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.09)',
                                        border: '1px solid rgba(220, 220, 220, 0.65)',
                                        zIndex: 9,
                                    }}
                                />
                            </>
                        )}

                        {/* Main Notification */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '300px',
                                left: '12px',
                                right: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '18px',
                                padding: '14px',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                border: '1px solid rgba(220, 220, 220, 0.8)',
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                }}
                            >
                                {/* App Icon in notification */}
                                <div
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '15px',
                                        backgroundColor: iconColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon size={30} color="white" />
                                </div>

                                {/* Notification Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '7px',
                                        }}
                                    >
                                        {title ? (
                                            <div
                                                style={{
                                                    fontFamily: fontFamily,
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#1a1a1a',
                                                }}
                                            >
                                                {title}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    fontFamily: fontFamily,
                                                    fontSize: '22px',
                                                    fontWeight: '600',
                                                    color: '#ddd',
                                                    marginBottom: '2px',
                                                    width: '50%',
                                                    height: '22px',
                                                    backgroundColor: '#e0e0e0',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        )}
                                        <span
                                            style={{
                                                fontFamily: fontFamily,
                                                fontSize: '18px',
                                                color: '#8E8E93',
                                            }}
                                        >
                                            now
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: fontFamily,
                                            fontSize: '22px',
                                            fontWeight: '600',
                                            color: '#ddd',
                                            marginBottom: '2px',
                                            width: '75%',
                                            height: '13px',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <div
                                        style={{
                                            fontFamily: fontFamily,
                                            fontSize: '22px',
                                            fontWeight: '600',
                                            color: '#ddd',
                                            marginBottom: '2px',
                                            width: '38%',
                                            height: '13px',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Swipe Up Indicator */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <div
                                style={{
                                    width: '140px',
                                    height: '5px',
                                    backgroundColor: '#333',
                                    borderRadius: '100px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

