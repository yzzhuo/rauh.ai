import React, { useRef, useEffect } from "react";

export const Waveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 400;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const draw = () => {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(data);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(0, 0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.setLineDash([0, 20]);
        context.lineCap = "round";
        context.beginPath();

        const sliceWidth = canvas.width / data.length;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
          const v = data[i] / 128.0;
          const y = Math.max((v * canvas.height) / 2, 10);

          if (i === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }

          x += sliceWidth;
        }

        context.lineTo(canvas.width, canvas.height / 2);
        context.stroke();
      };

      draw();
    });

    return () => {
      audioContext.close();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Waveform;
