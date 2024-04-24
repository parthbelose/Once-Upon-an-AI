import React, { useState, useEffect } from 'react';
import './App.css';
import { motion } from 'framer-motion';

function App() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-US'; 
    speech.volume = 1; 
    speech.rate = 1; 
    speech.pitch = 1; 


    speech.onstart = () => console.log('Speech started');
    speech.onend = () => console.log('Speech ended');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const generateStory = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/generate_book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ title, description }), 
          });
          const storyData = await response.json(); 
          const story=String(storyData.story)
          console.log(story)
          setStory(story); 
          speakStory(story); 
        } catch (error) {
          console.error('Error fetching story:', error);
        } finally {
          setIsLoading(false);
        }
    };

    const speakStory = (storyText) => {
        // Set the text for the speech
        speech.text = storyText;
        // Speak the text
        window.speechSynthesis.speak(speech);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
    };

    const handleResume = () => {
        window.speechSynthesis.resume();
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
    };

    return (
        <div className="kids-book-generator">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                Let's Build a Story!
            </motion.h1>
            <motion.div className="input-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" value={title} onChange={handleTitleChange} placeholder="Enter a captivating title" className="title-input" aria-required="true" />
                <label htmlFor="description">Description (optional):</label>
                <textarea id="description" value={description} onChange={handleDescriptionChange} placeholder="Give us a hint about your story" className="description-input" />
            </motion.div>
            <motion.button className="generate-button" onClick={generateStory} disabled={isLoading} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
                {isLoading ? 'Generating...' : 'Create Your Story!'}
            </motion.button>
            <motion.div className="speech-options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}>
                <button className="control-button" onClick={handlePause}>Pause</button>
                <button className="control-button" onClick={handleResume}>Resume</button>
                <button className="control-button" onClick={handleStop}>Stop</button>
            </motion.div>
            {story && (
                <motion.div className="story-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}>
                    <h2>{title}</h2>
                    {description && <p>({description})</p>}
                    <p className="story-text">{story}</p>
                </motion.div>
            )}
        </div>
    );
}

export default App;
