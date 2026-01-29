import React from 'react';

interface AnimatedDieProps {
    value: number | string;
    isRolling: boolean;
    size?: 'sm' | 'lg';
}

const AnimatedDie: React.FC<AnimatedDieProps> = ({ value, isRolling, size = 'sm' }) => {
    let cubeClasses = 'die-cube';
    if (isRolling) {
        cubeClasses += ' rolling';
    } else if (typeof value === 'number' && value >= 1 && value <= 6) {
        cubeClasses += ` show-${value}`;
    }

    const perspectiveClasses = `die-perspective ${size === 'lg' ? 'die-perspective-lg' : ''}`;

    // Helper to render pips
    const Pip = () => <span className="pip" />;

    return (
        <div className={perspectiveClasses}>
            <div className={cubeClasses}>
                {/* Face 1: Center */}
                <div className="die-face face-1">
                    <div style={{ gridArea: '2 / 2 / 3 / 3' }}><Pip /></div>
                </div>
                
                {/* Face 2: Top-Left, Bottom-Right */}
                <div className="die-face face-2">
                    <div style={{ gridArea: '1 / 1 / 2 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 3 / 4 / 4' }}><Pip /></div>
                </div>

                {/* Face 3: Diagonal */}
                <div className="die-face face-3">
                    <div style={{ gridArea: '1 / 1 / 2 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '2 / 2 / 3 / 3' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 3 / 4 / 4' }}><Pip /></div>
                </div>

                {/* Face 4: Corners */}
                <div className="die-face face-4">
                    <div style={{ gridArea: '1 / 1 / 2 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '1 / 3 / 2 / 4' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 1 / 4 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 3 / 4 / 4' }}><Pip /></div>
                </div>

                {/* Face 5: Corners + Center */}
                <div className="die-face face-5">
                    <div style={{ gridArea: '1 / 1 / 2 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '1 / 3 / 2 / 4' }}><Pip /></div>
                    <div style={{ gridArea: '2 / 2 / 3 / 3' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 1 / 4 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 3 / 4 / 4' }}><Pip /></div>
                </div>

                {/* Face 6: Two Columns */}
                <div className="die-face face-6">
                    <div style={{ gridArea: '1 / 1 / 2 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '1 / 3 / 2 / 4' }}><Pip /></div>
                    <div style={{ gridArea: '2 / 1 / 3 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '2 / 3 / 3 / 4' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 1 / 4 / 2' }}><Pip /></div>
                    <div style={{ gridArea: '3 / 3 / 4 / 4' }}><Pip /></div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedDie;