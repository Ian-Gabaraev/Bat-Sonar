import React, { useEffect, useRef } from 'react';

const Monitor = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const drawWave = () => {
            const width = canvas.width;
            const height = canvas.height;
            const amplitude = height / 4;
            const frequency = 1;
            const speed = 0.005;
            let offset = 0;

            const render = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.beginPath();
                ctx.moveTo(0, height / 2);

                for (let x = 0; x < width; x++) {
                    const y = height / 2 + amplitude * Math.sin((x * frequency) + offset);
                    ctx.lineTo(x, y);
                }

                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.stroke();

                offset += speed;
                animationFrameId = requestAnimationFrame(render);
            };

            render();
        };

        drawWave();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="monitor-container">
            <canvas ref={canvasRef} width={500} height={200}></canvas>
        </div>
    );
};

export default Monitor;
