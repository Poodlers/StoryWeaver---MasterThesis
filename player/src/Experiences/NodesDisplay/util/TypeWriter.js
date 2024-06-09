import React, { useState, useEffect, useRef } from "react";

const Typewriter = ({ text, delay, onComplete, skipToEnd }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeOut = useRef(null);

  useEffect(() => {
    if (skipToEnd) {
      setCurrentText(text);
      setCurrentIndex(text.length);
      clearTimeout(timeOut.current);
    }
  }, [skipToEnd]);

  useEffect(() => {
    if (currentIndex < text.length) {
      timeOut.current = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeOut.current);
    } else if (onComplete) {
      //text has finished typing
      onComplete();
    }
  }, [currentIndex, delay, text]);

  return <span style={{ whiteSpace: "pre-wrap" }}>{currentText}</span>;
};

export default Typewriter;
