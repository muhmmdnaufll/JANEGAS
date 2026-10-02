import React from "react";

export default function JanegasLogo({ size = 36, style = {}, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={{
        display: "inline-block",
        borderRadius: "50%",
        flexShrink: 0,
        verticalAlign: "middle",
        ...style,
      }}
    >
      <circle cx="16" cy="16" r="15" fill="#2d6a4f" />
      <path
        d="M16 6 C12 12, 8 16, 8 20 C8 24.4, 11.6 28, 16 28 C20.4 28, 24 24.4, 24 20 C24 16, 20 12, 16 6 Z"
        fill="#52b788"
      />
      <path
        d="M16 13 C14 16.5, 12 19, 12 21.5 C12 23.7, 13.8 25.5, 16 25.5 C18.2 25.5, 20 23.7, 20 21.5 C20 19, 18 16.5, 16 13 Z"
        fill="#d8f3dc"
      />
    </svg>
  );
}
