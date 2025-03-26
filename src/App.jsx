import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  const initialCards = [
    { id: 1, title: 'Drag Me!', content: 'This card can be moved anywhere', color: '#ffadad' },
    { id: 2, title: 'Move Me', content: 'Try positioning this one somewhere else', color: '#a0c4ff' },
    { id: 3, title: 'Draggable', content: 'All these cards are fully draggable', color: '#bdb2ff' },
    { id: 4, title: 'Position Freely', content: 'Place me wherever you want', color: '#caffbf' }
  ];

  const [cards, setCards] = useState(initialCards.map((card, index) => ({
    ...card,
    position: { x: 20 + index * 50, y: 20 + index * 50 }, // Initial positions
    width: 150, // Default width of card
    height: 100 // Default height of card
  })));

  const nodeRefs = useRef(cards.map(() => React.createRef()));

  // Detect and resolve collisions (same as before)
  const resolveCollisions = (draggedCard, newX, newY) => {
    const updatedPosition = { x: newX, y: newY };

    cards.forEach((card) => {
      if (card.id !== draggedCard.id) {
        const isOverlapping =
          updatedPosition.x < card.position.x + card.width &&
          updatedPosition.x + draggedCard.width > card.position.x &&
          updatedPosition.y < card.position.y + card.height &&
          updatedPosition.y + draggedCard.height > card.position.y;

        if (isOverlapping) {
          // Snap to the right or bottom of the overlapping card
          if (Math.abs(updatedPosition.x - card.position.x) > Math.abs(updatedPosition.y - card.position.y)) {
            updatedPosition.x = card.position.x + card.width + 10; // Snap to the right
          } else {
            updatedPosition.y = card.position.y + card.height + 10; // Snap to the bottom
          }
        }
      }
    });

    return updatedPosition;
  };

  const handleDragStop = (id, e, data) => {
    const draggedCard = cards.find((card) => card.id === id);
    if (!draggedCard) return;

    // Resolve collisions and set the new position
    const newPosition = resolveCollisions(draggedCard, data.x, data.y);

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, position: newPosition } : card
      )
    );

    console.log(`Card ${id} moved to:`, newPosition);
  };

  // Auto arrange cards into a grid layout
  const autoArrange = () => {
    const containerWidth = 800; // Assume width of the drag board
    const cardWidth = cards[0].width + 10; // Width + margin
    const cardHeight = cards[0].height + 10; // Height + margin
    const cardsPerRow = Math.floor(containerWidth / cardWidth);

    const newPositions = cards.map((card, index) => ({
      ...card,
      position: {
        x: (index % cardsPerRow) * cardWidth,
        y: Math.floor(index / cardsPerRow) * cardHeight
      }
    }));

    setCards(newPositions);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Draggable Components</h1>
        <p className="subtitle">Drag and position the cards anywhere on the board</p>
        <button onClick={autoArrange} style={{ padding: '10px 20px', margin: '10px 0', cursor: 'pointer' }}>
          Auto Arrange
        </button>
      </header>

      <div
        className="drag-board"
        style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          border: '2px solid #000',
        }}
      >
        {cards.map((card, index) => (
          <Draggable
            key={card.id}
            nodeRef={nodeRefs.current[index]}
            position={card.position}
            bounds=".drag-board"
            onStop={(e, data) => handleDragStop(card.id, e, data)}
          >
            <div
              ref={nodeRefs.current[index]}
              className="drag-card"
              style={{
                backgroundColor: card.color,
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                width: card.width,
                height: card.height,
                position: 'absolute',
                cursor: 'move',
              }}
            >
              <div
                className="drag-handle"
                style={{
                  cursor: 'grab',
                  padding: '5px',
                  marginBottom: '10px',
                }}
              >
                ⋮⋮⋮
              </div>
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default App;
