import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/SwipingPage.css";

export default function CardStack() {
    const [cards, setCards] = useState([]);
    const [dragX, setDragX] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null); // Modal state

    const MAX_DRAG = 150;

    // Fetch initial cards
    const fetchCards = async () => {
        try {
            const responses = await Promise.all([
                fetch("http://localhost:5000/getRandomFood"),
                fetch("http://localhost:5000/getRandomFood"),
                fetch("http://localhost:5000/getRandomFood"),
            ]);
            const data = await Promise.all(responses.map(res => res.json()));
            setCards(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Save recipe to user account when swiping right
    const saveRecipe = async (foodId) => {
        const token = localStorage.getItem("token");
        if (!token) return console.warn("No token found — user not logged in");

        try {
            const res = await fetch(`http://localhost:5000/user/saveRecipe/${foodId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message);
            console.log("✅ Recipe saved:", data.message);
        } catch (err) {
            console.error("❌ Error saving recipe:", err.message);
        }
    };


    useEffect(() => {
        fetchCards();
    }, []);

    const handleSwipe = (dir, foodId) => {
        if (dir === "right") {
            saveRecipe(foodId);
        }

        setCards(prev => prev.slice(1));

        // Fetch new card
        fetch("http://localhost:5000/getRandomFood")
            .then(res => res.json())
            .then(data => setCards(prev => [...prev, data]))
            .catch(err => console.error(err));

        setDragX(0);
    };


    if (!cards.length) return <div className="card loading">Loading...</div>;

    return (
        <div className="cardBox">
            {cards.map((card, index) => (
                <DraggableCard
                    key={index}
                    data={card}
                    onSwipe={(dir) => handleSwipe(dir, card._id)} // 👈 pass ID
                    position={index}
                    isTop={index === 0}
                    dragX={dragX}
                    setDragX={setDragX}
                    onClick={() => setSelectedCard(card)}
                    MAX_DRAG={MAX_DRAG}
                />

            ))}


        </div>
    );
}

// ---------------------------
// DraggableCard Component
// ---------------------------
function DraggableCard({ data, onSwipe, position, isTop, dragX, setDragX, onClick, MAX_DRAG }) {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [swiping, setSwiping] = useState(false);

    const handlers = useSwipeable({
        onSwiping: ({ deltaX, deltaY }) => {
            if (!isTop) return;
            setSwiping(true);
            const limitedX = Math.max(-MAX_DRAG, Math.min(deltaX, MAX_DRAG));
            setX(limitedX);
            setY(deltaY / 2);
            setDragX(limitedX);
        },
        onSwiped: ({ dir }) => {
            if (!isTop) return;
            const direction = dir === "Left" ? "left" : "right";
            setSwiping(false);

            setTimeout(() => {
                onSwipe(direction);
                setX(0);
                setY(0);
                setDragX(0);
            }, 300);
        },
        trackMouse: true,
        preventScrollOnSwipe: true,
    });

    const truncatedDescription = data.description
        ? data.description.split(" ").slice(0, 20).join(" ") +
        (data.description.split(" ").length > 20 ? "..." : "")
        : "";

    const rotate = x / 20;

    // Stack scale & next card animation
    let scale = 1 - position * 0.05;
    let nextCardOffset = 0;
    let nextCardScale = scale;
    if (position === 1 && dragX !== 0) {
        const intensity = Math.min(Math.abs(dragX) / MAX_DRAG, 1);
        nextCardOffset = 20 - intensity * 20; // moves up slightly
        nextCardScale = 0.95 + intensity * 0.05; // grows slightly
    }

    // Overlay color
    const intensity = Math.min(Math.abs(x) / MAX_DRAG, 1);
    const overlayColor = x > 0
        ? `rgba(76, 175, 80, ${intensity * 0.4})`
        : `rgba(244, 67, 54, ${intensity * 0.4})`;

    // Dynamic shadow/lift
    const shadowIntensity = Math.min(Math.abs(x) / MAX_DRAG, 1);
    const boxShadow = `0 ${10 + shadowIntensity * 20}px ${20 + shadowIntensity * 30}px rgba(0,0,0,${0.3 + shadowIntensity * 0.2})`;

    return (
        <div
            {...handlers}
            className="card"
            style={{
                transform: `translate(${x}px, ${y + nextCardOffset}px) rotate(${rotate}deg) scale(${position === 1 ? nextCardScale : scale})`,
                top: position * 10 + "px",
                zIndex: 100 - position,
                boxShadow: isTop ? boxShadow : undefined,
                transition: swiping ? "none" : "transform 0.3s ease, opacity 0.3s ease",
            }}
            onClick={() => !swiping && onClick && onClick()}
        >
            {isTop && x !== 0 && (
                <div className="cardColorOverlay" style={{ backgroundColor: overlayColor }}></div>
            )}

            {isTop && swiping && (
                <div className={`swipeOverlay ${x > 0 ? "like" : "dislike"}`}>
                    {x > 0 ? "LIKE" : "NOPE"}
                </div>
            )}

            {data.image && <img src={data.image} alt={data.name} className="cardImage" />}
            <h2 className="cardTitle">{data.name}</h2>
            <p className="cardDescription">{truncatedDescription}</p>
        </div>
    );
}
