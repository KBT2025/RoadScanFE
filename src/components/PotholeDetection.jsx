import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.APP_URL);

const PotholeDetection = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    socket.on("bbox", (data) => {
      setDetections(data);
    });

    return () => socket.off("bbox");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    // Menyinkronkan ukuran canvas dengan ukuran video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const labels = [
      "Lubang",
      "Melintang",
      "Memanjang",
      "Pinggir",
      "Retak Buaya",
      "Sambungan",
    ];

    detections.forEach((box) => {
      const label = labels[box.class] || "Unknown";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      ctx.fillStyle = "red";
      ctx.font = "12px Arial";
      ctx.fillText(label, box.x, box.y - 5);
    });
  }, [detections]);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </>
  );
};

export default PotholeDetection;
