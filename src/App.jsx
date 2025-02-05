import { useState, useEffect } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

const cardImages = [
  { src: "/images/apple.jpg", matched: false },
  { src: "/images/banana.jpg", matched: false },
  { src: "/images/orange.jpg", matched: false },
  { src: "/images/pear.jpg", matched: false },
  { src: "/images/pineapple.jpg", matched: false },
  { src: "/images/watermelon.jpg", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  //suffle cards (when starts the game)
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);

    setCards(shuffledCards);
    setTurns(18);
    setHasWon(false)
  };

  useEffect(() => {
    shuffleCards();
    setTurns(18);
  }, []);

  //handle choice
  const handleChoice = (card) => {
    //if choiceOne is not null, then updates choiceTwo
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      // Prevent other cards from turning
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });

        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }

    // Verificar si todas las cartas están emparejadas
    setCards((prevCards) => {
      const allMatched = prevCards.every((card) => card.matched);
      if (allMatched) {
        setHasWon(true);
      }
      return prevCards;
    });
  }, [choiceOne, choiceTwo]);

  console.log(cards);

  //reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    //increase the turns
    setTurns((prevTurns) => prevTurns - 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>

      {turns === 0 ? (
        <div className="game-over">Game over! You lost!</div>
      ) : hasWon ? (
        <div className="game-over">Congrats! You won!</div>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      )}
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
