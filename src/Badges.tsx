import React from 'react';
import { Sequence, random } from 'remotion';
import { Explosion } from './Explosion';
import { Growing } from './Growing';
import { Trail } from './Trail';
import { Badge } from './Badge';

const BADGE_IMAGES = [
    'badges/variant1_pink.png',
    'badges/variant1_purple.png',
    'badges/variant1_red.png',
    'badges/variant2_gold.png',
    'badges/variant2_orange.png',
    'badges/variant2_red.png',
    'badges/variant3_bronze.png',
    'badges/variant3_silver.png',
    'badges/variant3_gold.png',
    'badges/variant4_apple.png',
    'badges/variant4_book.png',
    'badges/variant4_books.png',
    'badges/variant4_cap.png',
    'badges/variant4_pencil.png',
    'badges/variant4_star.png'
];

// Create a shuffled array of all badges
const shuffledBadges = [...BADGE_IMAGES].sort(() => random('shuffle') - 0.5);

// Create a component that will render a badge with a specific image
const BadgeWithImage: React.FC<{ trailIndex?: number; badgeIndex?: number }> = ({
    trailIndex = 0,
    badgeIndex = 0
}) => {
    // Combine trail and badge indices to get a unique position in the shuffled array
    const uniqueIndex = (trailIndex * 100 + badgeIndex) % shuffledBadges.length;
    return (
        <Badge imagePath={shuffledBadges[uniqueIndex]} />
    );
};

export const Badges: React.FC = () => {
    return (
        <Explosion>
            <Trail amount={2}>
                <Growing>
                    <Sequence from={5}>
                        <BadgeWithImage />
                    </Sequence>
                </Growing>
            </Trail>
        </Explosion>
    );
};