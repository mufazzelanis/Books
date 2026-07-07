import { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      da: (Math.random() - 0.5) * 0.005,
    }));

    const connections = [];
    for (let i = 0; i < 40; i++) {
      connections.push({
        a: Math.floor(Math.random() * stars.length),
        b: Math.floor(Math.random() * stars.length),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      stars.forEach(s => {
        s.x += s.dx;
        s.y += s.dy;
        s.alpha += s.da;
        if (s.alpha > 0.6 || s.alpha < 0.05) s.da *= -1;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${s.alpha})`;
        ctx.fill();
      });

      connections.forEach(c => {
        const sa = stars[c.a];
        const sb = stars[c.b];
        const dist = Math.hypot(sa.x - sb.x, sa.y - sb.y);
        if (dist < 250) {
          ctx.beginPath();
          ctx.moveTo(sa.x, sa.y);
          ctx.lineTo(sb.x, sb.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dist / 250) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Gradient mesh background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(-45deg, #0a0f1e, #0f172a, #0c1929, #061121)',
          backgroundSize: '400% 400%',
          animation: 'gradient-drift 20s ease infinite',
        }}
      />

      {/* Canvas particles */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />

      {/* Glowing orbs */}
      <div
        className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
          animation: 'orb-float 18s ease-in-out infinite',
        }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-[600px] h-[600px] rounded-full -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)',
          animation: 'orb-float-2 22s ease-in-out infinite',
        }}
      />
      <div
        className="fixed top-1/3 -right-20 w-[300px] h-[300px] rounded-full -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          animation: 'orb-float 15s ease-in-out infinite reverse',
        }}
      />
      <div
        className="fixed bottom-1/4 -left-20 w-[350px] h-[350px] rounded-full -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
          animation: 'orb-float-2 20s ease-in-out infinite',
        }}
      />

      {/* Floating book icons */}
      {['📖', '📕', '📗', '📘', '📙', '📚', '📓', '📔'].map((emoji, i) => (
        <div
          key={i}
          className="fixed -z-10 pointer-events-none select-none"
          style={{
            left: `${5 + i * 12}%`,
            bottom: '-30px',
            fontSize: `${14 + (i % 3) * 6}px`,
            opacity: 0.06,
            animation: `book-float ${18 + i * 4}s linear ${i * 3}s infinite`,
          }}
        >
          {emoji}
        </div>
      ))}
    </>
  );
};

export default AnimatedBackground;