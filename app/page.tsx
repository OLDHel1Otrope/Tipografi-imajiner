"use client";
import { IMG_H, IMG_W, products } from "@/lib/data/products";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom"; // NEW

export default function Shelf() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [inside, setInside] = useState(false); 
  const [mounted, setMounted] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const first = useRef(true);

  useEffect(() => setMounted(true), []);

  const hoveredProduct = products.find((p) => p.id === hovered);

  const tick = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
    }

    // 0.2 = snappy 0.08 =
    current.current.x += (target.current.x - current.current.x) * 0.2;
    current.current.y += (target.current.y - current.current.y) * 0.2;

    const el = tipRef.current;
    if (el) {
      const OFFSET = 10;
      const { offsetWidth: w, offsetHeight: h } = el;
      let x = current.current.x + OFFSET;
      let y = current.current.y + OFFSET;

      // flip to the other side
      if (x + w > window.innerWidth - 8) x = current.current.x - w - OFFSET;
      if (y + h > window.innerHeight - 8) y = current.current.y - h - OFFSET;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }


    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (inside) raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [inside, tick]);

  const onPointerMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
    if (first.current) {
      current.current = { ...target.current };
      first.current = false;
    }
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
    current.current = { x: e.clientX, y: e.clientY };
    setInside(true);
  };

  const onPointerLeave = () => {
    setInside(false);
    setHovered(null);
    first.current = true;
  };

  return (
    <div
      className="@container relative w-full aspect-3252/1440 cursor-none"
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <img
        src="/rack4.png"
        alt="Supermarket shelf"
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
      />

      <svg
        viewBox={`0 0 ${IMG_W} ${IMG_H}`}
        className="absolute inset-0 w-full h-full cursor-none" 
        preserveAspectRatio="xMidYMid slice"
      >
        {products.map((p) => {
          const active = hovered === p.id || selected === p.id;
          const common = {
            key: p.id,
            className: "cursor-none transition-colors",
            fill: active ? "rgba(100,100,100,0.15)" : "transparent",
            stroke: active ? "#ffffff55" : "transparent",
            strokeWidth: 3,
            onMouseEnter: () => setHovered(p.id),
            onMouseLeave: () => setHovered(null),
            onClick: () => setSelected(p.id),
            role: "button",
            "aria-label": p.name,
          };

          return p.polygon ? (
            <polygon {...common} points={p.polygon.map((pt) => pt.join(",")).join(" ")} />
          ) : (
            <rect {...common} x={p.box.x} y={p.box.y} width={p.box.w} height={p.box.h} />
          );
        })}
      </svg>


      {mounted &&
        createPortal(
          <>
            <div
              ref={cursorRef}
              className="fixed left-0 top-0 z-100 pointer-events-none will-change-transform"
              style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
            >
              <div
                className={`origin-top-left transition-all duration-150 ${inside ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" className="drop-shadow-md">
                  <path
                    d="M1 1 L1 12 L4 9 L8 9 Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>

              </div>
            </div>

            {hoveredProduct && (
              <div
                ref={tipRef}
                className="fixed left-0 top-0 z-90 pointer-events-none w-56 rounded-3xl
                            bg-stone-100/20
                           backdrop-blur-md shadow-xl p-2
                           will-change-transform"
                style={{ transform: "translate3d(-9999px, -9999px, 0)" }} 
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    bg-linear-to-b
                    from-stone-100
                    via-stone-200
                    to-stone-200
                  "
                >
                  <div className="relative z-10 flex h-full flex-col px-5 pt-5">
                    <div className="mt-7">
                      <h1
                        className="
                          font-sans
                          text-[34px]
                          font-medium
                          leading-[0.95]
                          tracking-[-1.7px]
                          text-black
                        "
                      >
                        Craft Your
                      </h1>

                      <h2
                        className="
                          mt-1
                          font-serif
                          text-[27px]
                          italic
                          leading-none
                          tracking-[-0.8px]
                          text-black
                        "
                      >
                        Imaginary Escape
                      </h2>

                      <p
                        className="
                          mt-3
                          max-w-75
                          font-sans
                          text-[13px]
                          font-medium
                          leading-tight
                          text-black
                        "
                      >
                        This is where the description of the product goes, click on the product to add it to the cart.
                      </p>
                    </div>

                    <div className="mt-auto pb-4"></div>
                  </div>
                </div>
              </div>
            )}
          </>,
          document.body
        )}

      <div
        className="absolute right-[5%] top-96 -translate-y-1/2 z-10 pointer-events-none
       w-[27%] rounded-[2.5cqw] px-[2.5cqw] py-[3cqw]
       text-white [text-shadow:0_0.2cqw_1cqw_rgba(0,0,0,0.45),0_0.05cqw_0.2cqw_rgba(0,0,0,0.5)]"
      >
        <p className="font-serif italic leading-[0.95] text-[6cqw]">
          Goodness
        </p>

        <p className="mt-[1cqw] text-[1.4cqw] uppercase tracking-[0.35em] text-white/80">
          in every
        </p>

        <p className="font-serif italic leading-none text-[6cqw]">
          <span className="">pack.</span>
        </p>
      </div>
    </div>
  );
}
// import { useRef, useState } from "react";
// const IMG_W = 3252, IMG_H = 1440;

// export default function CoordPicker() {
//   const ref = useRef<HTMLDivElement>(null);
//   const [pts, setPts] = useState<[number, number][]>([]);

//   const onClick = (e: React.MouseEvent) => {
//     const r = ref.current!.getBoundingClientRect();
//     const x = Math.round(((e.clientX - r.left) / r.width) * IMG_W);
//     const y = Math.round(((e.clientY - r.top) / r.height) * IMG_H);
//     setPts((p) => [...p, [x, y]]);
//   };

//   return (
//     <>
//       <div ref={ref} onClick={onClick} className="relative w-full aspect-3252/1440 cursor-crosshair">
//         <img src="/rack4.png" className="absolute inset-0 w-full h-full" draggable={false} />
//         <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} className="absolute inset-0 w-full h-full pointer-events-none">
//           <polygon points={pts.map((p) => p.join(",")).join(" ")}
//                    fill="rgba(59,130,246,.3)" stroke="#3b82f6" strokeWidth={4} />
//           {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill="red" />)}
//         </svg>
//       </div>
//       <button onClick={() => navigator.clipboard.writeText(JSON.stringify(pts))}>Copy polygon</button>
//       <button onClick={() => setPts([])}>Reset</button>
//     </>
//   );
// }