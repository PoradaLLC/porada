"use client";

import { useEffect, useState } from "react";

export function LocalClock() {
  const [time, setTime] = useState("—");

  useEffect(() => {
    function tick() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`LOCAL ${hh}:${mm}:${ss}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mono" style={{ marginTop: 20 }} suppressHydrationWarning>
      {time}
    </div>
  );
}
