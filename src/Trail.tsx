import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Move } from './Move';

interface TrailProps {
    amount: number;
    children: React.ReactElement<{ trailIndex?: number; badgeIndex?: number }>;
    trailIndex?: number;
}

export const Trail: React.FC<TrailProps> = ({ amount, children, trailIndex = 0 }) => {
    return (
        <AbsoluteFill>
            {new Array(amount).fill(true).map((_, i) => {
                return (
                    <Sequence from={i * 5}>
                        <AbsoluteFill>
                            <Move delay={0} index={i}>
                                <AbsoluteFill
                                    style={{
                                        scale: String(1.5 - (i * 0.3) / amount),
                                    }}
                                >
                                    {React.cloneElement(children, { trailIndex, badgeIndex: i })}
                                </AbsoluteFill>
                            </Move>
                        </AbsoluteFill>
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};