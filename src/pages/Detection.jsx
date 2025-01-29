import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("https://uas-backend-apli-ai.my.id");

socket.on("connect", () => {
  console.log("Connected to server");

  const testFrame = "data:image/jpeg;base64,<your_base64_encoded_image>";
  socket.emit("process_frame", testFrame);
});
const Detection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (video && context) {
        // Atur ukuran canvas agar sesuai dengan video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = canvas.toDataURL("image/jpeg");
        socket.emit("process_frame", frame);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("bbox", (data) => {
      setDetections(data);
    });

    return () => socket.off("bbox");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const labels = [
      "Lubang",
      "Melintang",
      "Memanjang",
      "Pinggir",
      "Retak Buaya",
      "Sambungan",
    ];

    if (detections.length > 0) {
      detections.forEach((box) => {
        const label = labels[box.class] || "Unknown";
        context.strokeStyle = "#ff0000";
        context.lineWidth = 3;
        context.strokeRect(box.x, box.y, box.width, box.height);
        context.font = "bold 16px Arial";
        context.fillStyle = "#ff0000";
        context.fillText(label, box.x, box.y - 10);
      });
    }
  }, [detections]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-4">Deteksi Kerusakan Jalan</h1>
      <div className="relative border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg w-full max-w-[1000px]">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>
    </div>
  );
};

export default Detection;
