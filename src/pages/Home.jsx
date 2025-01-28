import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/lubang2.jpg"; // Gunakan path public
import sampleVideo from "../assets/video.mp4"; // Gunakan path public

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl font-bold mb-6 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
        RoadScan: Deteksi Lubang Jalan
      </h1>

      {/* Video */}
      <video
        src={sampleVideo}
        className="w-3/4 max-w-2xl rounded-lg shadow-lg"
        controls
        autoPlay
        loop
        muted
      />

      {/* Tombol Mulai Deteksi */}
      <button
        onClick={() => navigate("/detection")}
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
      >
        Mulai Deteksi
      </button>
    </div>
  );
};

export default Home;
