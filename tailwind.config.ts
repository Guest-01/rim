import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        rim: {
          "primary": "#6366f1",        // Indigo - 주요 액션
          "primary-content": "#ffffff", // Primary 버튼 텍스트 색상
          "secondary": "#8b5cf6",      // Purple - 보조 액션
          "secondary-content": "#ffffff", // Secondary 버튼 텍스트 색상
          "accent": "#14b8a6",         // Teal - 강조
          "accent-content": "#ffffff",  // Accent 버튼 텍스트 색상
          "neutral": "#3d4451",        // 기본 텍스트
          "neutral-content": "#ffffff", // Neutral 버튼 텍스트 색상
          "base-100": "#ffffff",       // 메인 배경
          "base-200": "#f3f4f6",       // 사이드바 배경
          "base-300": "#e5e7eb",       // 카드 테두리
          "info": "#3b82f6",           // 정보 (파란색)
          "info-content": "#ffffff",    // Info 버튼 텍스트 색상
          "success": "#10b981",        // 성공 (완료, 수락)
          "success-content": "#ffffff", // Success 버튼 텍스트 색상
          "warning": "#f59e0b",        // 경고 (대기)
          "warning-content": "#ffffff", // Warning 버튼 텍스트 색상
          "error": "#ef4444",          // 에러
          "error-content": "#ffffff",   // Error 버튼 텍스트 색상
        }
      }
    ]
  },
};

export default config;
