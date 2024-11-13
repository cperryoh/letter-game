"use client";
import {useState, useEffect} from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function calculateGridSize(width: number, height: number) {
  // Each letter box is 20px wide/high + 10px margin (5px on each side)
  const itemTotalWidth = 30; // 20px + 5px margin on each side
  const itemTotalHeight = 30;

  // Calculate how many items can fit in each row and column
  const itemsPerRow = Math.floor(width / itemTotalWidth);
  const rows = Math.floor(height / itemTotalHeight);

  // Total number of items that can fit on screen
  return itemsPerRow * rows;
}
function randomLetterArray(
  count: number,
  correctIndex: number,
  letterPair: string[],
) {
  let correctLetter = letterPair[0];
  let incorrectLetter = letterPair[1];
  if (Math.random() > 0.5) {
    correctLetter = letterPair[1];
    incorrectLetter = letterPair[0];
  }
  const newLetters = Array<string>(count).fill(incorrectLetter);
  newLetters[correctIndex] = correctLetter;
  return newLetters;
}
export default function Home() {
  const shake = (e: React.MouseEvent<HTMLButtonElement>) => {
    const element = e.currentTarget;
    element.classList.add("shake");
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove("shake");
      },
      {once: true},
    );
  };
  const {width, height} = useWindowSize();
  const [highlight, setHighlight] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [letters, setLetters] = useState(Array(0));
  const regenPuzzle = () => {
    const letter_pairs = [
      // Mirror pairs (horizontal reflection)
      ["b", "d"],
      ["p", "q"],
      ["n", "u"],

      // Mirror pairs (vertical reflection)
      ["M", "W"],
      ["V", "A"],

      // Number/Letter confusion
      ["Z", "2"],
      ["O", "0"],
      ["l", "1"],  // lowercase L vs one
      ["S", "5"],
      ["B", "8"],
      ["g", "9"],

      // Similar shapes
      ["C", "G"],
      ["O", "Q"],
      ["P", "R"],
      ["I", "l"],  // capital I vs lowercase L
      ["U", "V"],

      // Rotated letters
      ["N", "Z"],
      ["M", "E"],
      ["W", "E"],

      // Similar lowercase pairs
      ["a", "o"],
      ["e", "c"],
      ["h", "n"],
      ["v", "y"],

      // Number pairs
      ["6", "9"],
      ["3", "8"],
      ["2", "5"]
    ];
    const totalItems = calculateGridSize(width, height - 60);
    const newCorrectIndex = getRandomInt(0, totalItems);
    const newLetterPairIndex = getRandomInt(0, letter_pairs.length);
    setCorrectIndex(newCorrectIndex);
    setLetters(
      randomLetterArray(
        totalItems,
        newCorrectIndex,
        letter_pairs[newLetterPairIndex],
      ),
    );
  };
  useEffect(regenPuzzle, [width, height]);
  return (
    <div className="text-3xl font-bold min-h-screen">
      <div className="flex flex-row flex-wrap justify-center">
        {letters.map((value, index) => (
          <button
            className={`m-[5px] ${highlight && index === correctIndex ? "bg-amber-500" : ""} w-[20px] h-[20px] cursor-pointer select-none flex items-center justify-center`}
            key={index}
            onClick={(e) => {
              if (index != correctIndex) {
                const errorAudio = new Audio("/sounds/error.mp3");
                errorAudio.play();
                shake(e);
              } else {
                const successAudio = new Audio("/sounds/success.mp3");
                successAudio.play();
                setHighlight(false);
                setLetters(Array(0).fill(""));
                setTimeout(regenPuzzle, 500);
              }
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <button
        className="absolute bottom-2 right-2 bg-black text-white p-3 rounded-xl"
        onClick={() => setHighlight(true)}
      >
        Help
      </button>
    </div>
  );
}
