import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

function HomePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const generateStory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/generate_book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const { story } = await response.json();

      navigate("/story", { state: { title, description, story } });
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      <motion.section className="relative grid min-h-screen place-content-center bg-gray-950 px-4 py-24 text-gray-200">
        <div
          className="relative z-10 flex flex-col items-center w-full"
          style={{ display: "flex", padding: "30px" }}
        >
          <h1 className="max-w-l bg-gradient-to-br from-white to-gray-400 bg-clip-text text-start text-3xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight fw">
            Let's Build a Story!
          </h1>
          <motion.div
            className="input-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              padding: "30px",
              backgroundClip: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="title" className="font-bold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title"
              className="title-input"
              aria-required="true"
            />
            <label htmlFor="description" className="font-bold">
              Description (optional):
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give us a hint about your story"
              className="description-input"
            />
          </motion.div>
          <motion.button
            style={{
              border: useMotionTemplate`1px solid ${color}`,
              boxShadow: useMotionTemplate`0px 4px 24px ${color}`,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            onClick={generateStory}
            disabled={isLoading}
            className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            {isLoading ? "Generating..." : "Create Your Story!"}
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </div>
        <div className="absolute inset-0 z-0">
          <Canvas>
            <Stars radius={50} count={2500} factor={4} fade speed={2} />
          </Canvas>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;
