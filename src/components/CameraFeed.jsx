import React, { useRef, useEffect } from "react";

const CameraFeed = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    const captureFrame = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL("image/jpeg");
      onCapture(frame);
    };

    const interval = setInterval(captureFrame, 200);
    return () => clearInterval(interval);
  }, [onCapture]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-auto rounded-lg"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraFeed;
