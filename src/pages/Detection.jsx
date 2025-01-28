import React from "react";
import CameraFeed from "../components/CameraFeed";
import PotholeDetection from "../components/PotholeDetection";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Detection = () => {
  const handleCapture = (frame) => {
    socket.emit("process_frame", frame);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Deteksi Kerusakan Jalan</h1>

      {/* Kamera */}
      <div className="relative w-[960px] h-auto">
        <CameraFeed onCapture={handleCapture} />
      </div>

      {/* Tambah jarak antara kamera dan canvas */}
      <div className="mt-4 w-[400px]">
        <PotholeDetection />
      </div>
    </div>
  );
};

export default Detection;
