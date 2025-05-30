// floating-icons-smooth.js
document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".floating-icon");
  const iconStates = [];

  // Place icons at random positions and initialize smoothing
  icons.forEach((icon) => {
    const x = Math.random() * 90 + 5; // 5vw to 95vw
    const y = Math.random() * 80 + 10; // 10vh to 90vh
    iconStates.push({
      x,
      y,
      driftX: 0,
      driftY: 0,
      smoothedX: x,
      smoothedY: y,
    });
    icon.style.left = x + "vw";
    icon.style.top = y + "vh";
  });

  // Track mouse position
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Helper for smoothing (exponential moving average)
  function smooth(current, target, alpha = 0.15) {
    return current + alpha * (target - current);
  }

  // Animation loop
  function animate() {
    icons.forEach((icon, i) => {
      let state = iconStates[i];

      // Calculate icon's screen position
      const iconRect = icon.getBoundingClientRect();
      const iconX = iconRect.left + iconRect.width / 2;
      const iconY = iconRect.top + iconRect.height / 2;

      // Move away from cursor if close
      const dx = iconX - mouse.x;
      const dy = iconY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120 && dist > 0) {
        // Move icon away from cursor (gentle)
        const force = (120 - dist) * 0.07; // smaller force for smoothness
        state.x += (dx / dist) * force;
        state.y += (dy / dist) * force;
      }

      // Add random drift (very gentle)
      state.driftX += (Math.random() - 0.5) * 0.03;
      state.driftY += (Math.random() - 0.5) * 0.03;
      state.driftX *= 0.9; // strong damping
      state.driftY *= 0.9;
      state.x += state.driftX;
      state.y += state.driftY;

      // Keep icons in bounds
      state.x = Math.max(2, Math.min(98, state.x));
      state.y = Math.max(5, Math.min(95, state.y));

      // Smooth the position to avoid vibration
      state.smoothedX = smooth(state.smoothedX, state.x, 0.15);
      state.smoothedY = smooth(state.smoothedY, state.y, 0.15);

      // Update icon position
      icon.style.left = state.smoothedX + "vw";
      icon.style.top = state.smoothedY + "vh";
    });

    requestAnimationFrame(animate);
  }

  animate();
});
