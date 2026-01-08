import React from 'react';

const Header: React.FC = () => (
  <div className="text-center mb-4 flex-shrink-0 relative">
    <div className="flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-700 tracking-tighter" 
            style={{ textShadow: '2px 2px 4px rgba(163, 177, 198, 0.4), -2px -2px 4px rgba(255, 255, 255, 1)' }}>
            MIX-IMAGE
        </h1>
        
        <p className="text-[10px] font-bold mt-1 text-slate-400 tracking-[0.3em] uppercase">
            Creative Neumorphic AI Studio
        </p>
    </div>
  </div>
);

export default Header;