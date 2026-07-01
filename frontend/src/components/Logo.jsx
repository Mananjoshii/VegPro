export default function Logo({ className = "w-10 h-10" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
    >
      {/* Stalk */}
      <path d="M 50 30 Q 50 15 55 5 L 58 6 Q 53 15 53 30 Z" fill="#795548" />
      
      {/* Leaf */}
      <path d="M 52 20 Q 30 0 25 12 Q 35 25 52 20 Z" fill="#4CAF50" />
      
      {/* Apple Body */}
      <path 
        d="M 50 85 
           C 30 90, 15 80, 12 50 
           C 10 25, 30 20, 43 25 
           Q 47 27, 50 30 
           Q 53 27, 57 25 
           C 70 20, 90 25, 88 50 
           C 85 80, 70 90, 50 85 Z" 
        fill="#E53935" 
      />
      
      {/* Highlight for 3D feel */}
      <path 
        d="M 22 45 C 18 30 30 25 40 28 Q 30 30 25 45 Z" 
        fill="#FFCDD2" 
        opacity="0.5" 
      />

      {/* Text */}
      <text 
        x="50" 
        y="60" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontWeight="900" 
        fontSize="24" 
        fill="white" 
        textAnchor="middle"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
      >
        VPSM
      </text>
    </svg>
  );
}
