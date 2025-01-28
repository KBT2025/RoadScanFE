import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const PotholeDetection = () => {
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    socket.on("bbox", (data) => {
      setDetections(data);
    });

    return () => socket.off("bbox");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || detections.length === 0) return;

    const ctx = canvas.getContext("2d");

    // Mengatur ukuran canvas agar sesuai dengan video
    canvas.width = 640;
    canvas.height = 480;

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
      {detections.length > 0 ? (
        <canvas
          ref={canvasRef}
          className="w-full h-auto border border-gray-300 rounded-lg"
        />
      ) : (
        <div className="w-full h-48 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400">
          Tidak ada deteksi
        </div>
      )}
    </>
  );
};

export default PotholeDetection;
