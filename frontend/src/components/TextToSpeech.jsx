import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, StopCircle } from "lucide-react";

function TextToSpeech({ html }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const utteranceRef = useRef(null);
  const wordRefs = useRef([]);
  const containerRef = useRef();

  const plainText = html.replace(/<[^>]*>/g, "");
  const allWords = plainText.trim().split(/\s+/);
  const maxWords = 100;

  const startSpeech = () => {
    if (!window.speechSynthesis) return alert("Speech not supported");

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1;
    utterance.lang = "en-US";

    utterance.onboundary = (e) => {
      if (e.name === "word") {
        let count = 0;
        let runningLength = 0;
        for (let word of allWords) {
          runningLength += word.length + 1;
          if (runningLength > e.charIndex) break;
          count++;
        }
        setCurrentWordIndex(count);
        const el = wordRefs.current[count];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
      setCurrentWordIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handlePlay = () => {
    if (speaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else if (!speaking) {
      startSpeech();
    }
  };

  const handlePause = () => {
    if (speaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setCurrentWordIndex(null);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const renderWrappedHTML = () => {
    const container = document.createElement("div");
    container.innerHTML = html;

    let wordIndex = 0;

    const wrapNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/(\s+)/);

        return words.map((word, i) => {
          if (word.trim() === "") return word;

          if (!showAll && wordIndex >= maxWords) return null;

          const el = (
            <span
              key={wordIndex}
              ref={(el) => (wordRefs.current[wordIndex] = el)}
              className={`transition-all duration-150 ${
                wordIndex === currentWordIndex
                  ? "bg-yellow-300 rounded px-1 font-semibold"
                  : ""
              }`}
            >
              {word}
            </span>
          );
          wordIndex++;
          return el;
        });
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const voidElements = ["br", "hr", "img", "input", "meta", "link"];
        const tag = node.tagName.toLowerCase();

        if (voidElements.includes(tag)) {
          return React.createElement(tag, {});
        }

        const children = Array.from(node.childNodes).map(wrapNode);
        return React.createElement(tag, {}, children);
      }

      return null;
    };

    return Array.from(container.childNodes).map(wrapNode);
  };

  return (
    <div className="mb-6">
      <div className="flex gap-3 mb-4">
        <button
          onClick={handlePlay}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          <Play className="w-4 h-4" /> {paused ? "Resume" : "Play"}
        </button>
        {speaking && (
          <>
            <button
              onClick={handlePause}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>

            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            >
              <StopCircle className="w-4 h-4" /> Stop
            </button>
          </>
        )}
      </div>
      {allWords.length > maxWords && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 text-sm hover:underline mt-2"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
      <div
        ref={containerRef}
        className={`relative bg-white p-4 rounded-md leading-8 text-lg prose max-w-none text-gray-800 whitespace-pre-wrap transition-all duration-300 font-segoe ${
          showAll ? "" : "max-h-[300px] overflow-hidden"
        }`}
      >
        {renderWrappedHTML()}
        {!showAll && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {allWords.length > maxWords && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 text-sm hover:underline mt-2"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

export default TextToSpeech;
