import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.css";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

function StoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, description, story } = location.state || {};

  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);
  // Set default language for speech synthesis
  const speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";
  speech.volume = 1;

  const handleStartSpeech = (tone) => {
    if (!isSpeaking) {
      switch (tone) {
        case "happy":
          speech.pitch = 2;
          speech.rate = 1.2;
          break;
        case "sad":
          speech.pitch = 0.7;
          speech.rate = 0.9;
          break;
        case "funny":
          speech.pitch = 1.8;
          speech.rate = 0.8;
          break;
        default:
          speech.pitch = 1;
          speech.rate = 1;
      }
      speech.text = story;
      window.speechSynthesis.speak(speech);
      setIsSpeaking(true);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsSpeaking(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid place-content-center bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          {title}
        </h1>
        <span
          className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-m"
          style={{ marginTop: "15px" }}
        >
          {description}
        </span>
        <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "15px",
          }}
        >
          <button
            className="btn"
            type="button"
            onClick={() => handleStartSpeech("happy")}
          >
            <strong>Happy</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => handleStartSpeech("sad")}
          >
            <strong>Sad</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => handleStartSpeech("funny")}
          >
            <strong>Funny</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
          <button
            className="btn"
            type="button"
            onClick={handleStop}
            disabled={!isSpeaking}
          >
            <strong>Stop</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div class="circle"></div>
            </div>
          </button>
          <button
            className="btn"
            type="button"
            onClick={handlePause}
            disabled={!isSpeaking}
          >
            <strong>Pause⏸️</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
          <button
            className="btn"
            type="button"
            onClick={handleResume}
            disabled={isSpeaking}
          >
            <strong>Resume▶️</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => {
            navigate(-1);
            window.speechSynthesis.cancel();
          }}
        >
          <strong>Go Back</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
        <p className="my-6 max-w-xxl text-center text-base text-xl">{story}</p>
      </div>
    </motion.section>
  );
}

export default StoryPage;
