import { useEffect, useState } from "react";
import "./Typewriter.css";

const Typewriter = () => {
  const [text, setText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const lines = [
    "There are only 10 types of people in the world:",
    "Those who understand binary, and those who don't",
  ];
  const typingSpeed = 100; // ms delay between characters
  const scrollAt = 20; // start scrolling after this many lines
  const lineDelay = 500; // ms delay between lines

  useEffect(() => {
    const type = () => {
      // Display all completed lines
      let content = "";
      const startRow = Math.max(0, currentLineIndex - scrollAt);

      for (let i = startRow; i < currentLineIndex; i++) {
        content += lines[i] + "<br />";
      }

      // Add current line with typed characters
      const currentLine = lines[currentLineIndex];
      content += currentLine.substring(0, currentCharIndex) + "_";

      setText(content);

      // Check if we've finished the current line
      if (currentCharIndex === currentLine.length) {
        // Move to next line if available
        if (currentLineIndex < lines.length - 1) {
          setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
          }, lineDelay);
        }
      } else {
        // Continue typing current line
        setTimeout(() => {
          setCurrentCharIndex((prev) => prev + 1);
        }, typingSpeed);
      }
    };

    type();
  }, [currentLineIndex, currentCharIndex]);

  return (
    <div
      id="typedtext"
      style={{
        fontFamily: "'Waiting for the Sunrise', cursive",
        fontSize: "18px",
        letterSpacing: "6px",
        // fontWeight: "bold",
        color: "white",
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default Typewriter;
