import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  next: "/boas-vindas" | "/app";
  className?: string;
};

export function BookPage({ src, alt, width, height, next, className = "" }: Props) {
  const navigate = useNavigate();
  const [turning, setTurning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  const turnPage = () => {
    if (turning) return;
    setTurning(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => {
      void navigate({ to: next });
    }, reduceMotion ? 0 : 650);
  };

  return (
    <div className={`book-perspective ${className}`}>
      <div className={turning ? "book-page book-page-turning" : "book-page"}>
        <img src={src} alt={alt} width={width} height={height} className="block w-full rounded-2xl" />
        <button
          type="button"
          onClick={turnPage}
          disabled={turning}
          className="book-page-corner"
          aria-label="Virar a página"
          title="Virar a página"
        />
      </div>
      <button
        type="button"
        onClick={turnPage}
        disabled={turning}
        className="mt-8 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {next === "/app" ? "COMEÇAR O DESAFIO" : "CONTINUAR"}
        <span aria-hidden="true" className="ml-2">→</span>
      </button>
    </div>
  );
}
