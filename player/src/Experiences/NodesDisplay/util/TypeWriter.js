import React, { useState, useEffect } from "react";

const Typewriter = ({ text, delay, onComplete }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      //text has finished typing
      onComplete();
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

export default Typewriter;
