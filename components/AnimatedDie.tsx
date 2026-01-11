
import React from 'react';

interface AnimatedDieProps {
    value: number | string;
    isRolling: boolean;
}

const AnimatedDie: React.FC<AnimatedDieProps> = ({ value, isRolling }) => {
    // The key is crucial. When isRolling toggles or value changes after rolling,
    // we want to remount the element to re-trigger the final animation.
    const key = isRolling ? 'rolling' : `value-${value}`;
    const animationClass = isRolling ? 'animate-spin-die' : 'animate__animated animate__tada';

    return (
        <div className="die-container">
            <div key={key} className={`text-5xl font-black text-white ${animationClass}`}>
                {value}
            </div>
        </div>
    );
};

export default AnimatedDie;
