import { useState, useRef } from 'react';
import './App.css';

const PETALS = [
  { left: '8%',  delay: '0s',    dur: '7s',  size: 18 },
  { left: '18%', delay: '1.2s',  dur: '9s',  size: 13 },
  { left: '30%', delay: '2.5s',  dur: '8s',  size: 22 },
  { left: '45%', delay: '0.6s',  dur: '10s', size: 15 },
  { left: '58%', delay: '3.1s',  dur: '7.5s',size: 19 },
  { left: '70%', delay: '1.8s',  dur: '9.5s',size: 12 },
  { left: '82%', delay: '0.3s',  dur: '8.5s',size: 16 },
  { left: '92%', delay: '2s',    dur: '11s', size: 21 },
];

const VENUE_URL = 'https://maps.app.goo.gl/F7vu6uncyGz3AUn68';

function App() {
  const [flipped, setFlipped]           = useState(false);
  const [flipping, setFlipping]         = useState(false);
  const [labelFlipped, setLabelFlipped] = useState(false);

  const handleFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setFlipped(f => !f);
    // update the label text at the halfway point when card is edge-on
    setTimeout(() => setLabelFlipped(f => !f), 425);
    setTimeout(() => setFlipping(false), 850);
  };

  const touchStart = useRef(null);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    // horizontal swipe > 40px and more horizontal than vertical
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      handleFlip();
    }
  };

  return (
    <div className="scene">
      {/* ambient petals */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            animationDuration: p.dur,
            animationDelay: p.delay,
            width:  p.size,
            height: p.size * 0.65,
          }}
        />
      ))}

      {/* card area */}
      <div className="card-entrance">
        {/* flip hint */}
        <div className={`tap-hint${flipping ? ' hidden' : ''}`}>
          {!labelFlipped ? (
            <>
              <span className="tap-hint__text">Flip to back</span>
              <svg className="tap-hint__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16M14 6l6 6-6 6"/>
              </svg>
            </>
          ) : (
            <>
              <svg className="tap-hint__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12H4M10 18l-6-6 6-6"/>
              </svg>
              <span className="tap-hint__text">Flip to front</span>
            </>
          )}
        </div>

        <div
          className={`card${flipped ? ' is-flipped' : ''}`}
          onClick={handleFlip}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card__face card__face--front">
            <img
              src={process.env.PUBLIC_URL + '/s.png'}
              alt="Wedding Invitation"
              draggable="false"
            />
          </div>
          <div className="card__face card__face--back">
            <img
              src={process.env.PUBLIC_URL + '/k.png'}
              alt="Wedding Invitation"
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* venue footer */}
      <a
        className="venue"
        href={VENUE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
      >
        <svg className="venue__pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span>View Venue</span>
      </a>
    </div>
  );
}

export default App;
