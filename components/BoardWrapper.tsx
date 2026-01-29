import React, { useState, useRef, useCallback } from 'react';

const BoardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const isPanning = useRef(false);
    const lastPointerPosition = useRef({ x: 0, y: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    // For pinch-to-zoom
    const activePointers = useRef(new Map());
    const lastPinchDistance = useRef(0);

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    
    const applyTransform = (newTransform: Partial<typeof transform>) => {
        setTransform(prev => {
            const scale = newTransform.scale ?? prev.scale;
            const x = newTransform.x ?? prev.x;
            const y = newTransform.y ?? prev.y;

            if (!wrapperRef.current) return { scale, x, y };

            const rect = wrapperRef.current.getBoundingClientRect();
            const maxPanX = (rect.width * scale - rect.width) / (2 * scale) || 0;
            const maxPanY = (rect.height * scale - rect.height) / (2 * scale) || 0;
            
            return {
                scale: clamp(scale, 1, 3),
                x: clamp(x, -maxPanX, maxPanX),
                y: clamp(y, -maxPanY, maxPanY),
            };
        });
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.005;
        applyTransform({ scale: transform.scale + delta });
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        
        if (activePointers.current.size === 1 && transform.scale > 1) {
            isPanning.current = true;
            lastPointerPosition.current = { x: e.clientX, y: e.clientY };
            (e.target as HTMLElement).style.cursor = 'grabbing';
        } else if (activePointers.current.size === 2) {
            isPanning.current = false; // Stop panning when a second finger is down
            const pointers = Array.from(activePointers.current.values());
            const [p1, p2] = pointers as { x: number, y: number }[];
            lastPinchDistance.current = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        }
    };
    
    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (activePointers.current.has(e.pointerId)) {
            activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        }

        if (activePointers.current.size === 2) {
            // Pinch-to-zoom logic
            const pointers = Array.from(activePointers.current.values());
            const [p1, p2] = pointers as { x: number, y: number }[];
            const currentPinchDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            const delta = (currentPinchDistance - lastPinchDistance.current) * 0.008; // Sensitivity factor
            
            applyTransform({ scale: transform.scale + delta });
            lastPinchDistance.current = currentPinchDistance;

        } else if (isPanning.current && wrapperRef.current && activePointers.current.size === 1) {
            // Pan logic
            const dx = e.clientX - lastPointerPosition.current.x;
            const dy = e.clientY - lastPointerPosition.current.y;
            
            applyTransform({
                x: transform.x + dx / transform.scale,
                y: transform.y + dy / transform.scale,
            });
            
            lastPointerPosition.current = { x: e.clientX, y: e.clientY };
        }
    }, [transform.scale, transform.x, transform.y]);
    
    const handlePointerUp = (e: React.PointerEvent) => {
        activePointers.current.delete(e.pointerId);

        if (activePointers.current.size < 2) {
            lastPinchDistance.current = 0;
        }
        if (activePointers.current.size < 1) {
            isPanning.current = false;
            (e.target as HTMLElement).style.cursor = transform.scale > 1 ? 'grab' : 'default';
        } else if (activePointers.current.size === 1) {
            // If one finger is lifted, reset panning to the remaining finger's position
             const lastPointer = Array.from(activePointers.current.values())[0] as { x: number, y: number };
             lastPointerPosition.current = { x: lastPointer.x, y: lastPointer.y };
             isPanning.current = true;
        }
    };
    
    React.useEffect(() => {
        const upHandler = (e: PointerEvent) => {
            if (activePointers.current.has(e.pointerId)) {
                 handlePointerUp(e as unknown as React.PointerEvent);
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', upHandler);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', upHandler);
        };
    }, [handlePointerMove, transform.scale]);

    return (
        <div 
            ref={wrapperRef}
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none', cursor: transform.scale > 1 ? 'grab' : 'default' }}
        >
            <div 
                style={{ 
                    transform: `scale(${transform.scale}) translateX(${transform.x}px) translateY(${transform.y}px)`,
                    transition: isPanning.current ? 'none' : 'transform 0.1s ease-out'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default BoardWrapper;