import React, { useEffect, useState } from 'react';

const Fireworks = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = [
      '#ff0844', '#ffb199', '#44e5ff', '#44ff6e', '#ffd700',
      '#ff1493', '#00ffff', '#ff4500', '#9d00ff', '#ffff00',
      '#00ff00', '#ff69b4', '#1e90ff', '#ff6347', '#adff2f'
    ];
    const newParticles = [];

    // Create MANY more firework bursts
    for (let burst = 0; burst < 25; burst++) {
      const x = 10 + Math.random() * 80; // Keep away from edges
      const y = 10 + Math.random() * 50;
      const color = colors[Math.floor(Math.random() * colors.length)];
const delay = burst * 250; // More time between bursts      const particleCount = 40 + Math.floor(Math.random() * 20); // 40-60 particles per burst

      // Create particles for each burst
const particleCount = 40 + Math.floor(Math.random() * 20); // 40-60 particles per burst
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2.5 + Math.random() * 2.5; // Faster particles
        const size = 2 + Math.random() * 3; // Varying sizes
        
        newParticles.push({
          id: `${burst}-${i}`,
          x,
          y,
          color,
          angle,
          velocity,
          delay,
          size
        });
      }
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
            animation: `firework 3s ease-out forwards`,
            animationDelay: `${particle.delay}ms`,
            '--angle': `${particle.angle}rad`,
            '--velocity': particle.velocity,
          }}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--velocity) * 150px),
              calc(sin(var(--angle)) * var(--velocity) * 150px + 250px)
            ) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Fireworks;
