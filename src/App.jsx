import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");
const App = () => {
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = canvas.toDataURL("image/jpeg");
        socket.emit("process_frame", frame);
      }
    }, 200);

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
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.strokeRect(box.x, box.y, box.width, box.height);
        context.font = "12px Arial";
        context.fillStyle = "red";
        context.fillText(label, box.x, box.y - 5);
      });
    }
  }, [detections]);

  return (
    <div>
      <h1>Deteksi Kerusakan Jalan</h1>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default App;
