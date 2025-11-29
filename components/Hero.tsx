/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { DevicePhoneMobileIcon, CommandLineIcon, PaintBrushIcon, RocketLaunchIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { CubeIcon, Square3Stack3DIcon, CodeBracketSquareIcon } from '@heroicons/react/24/solid';

// Component that simulates drawing a wireframe then filling it with life
const DrawingTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number
}) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Drawing, 2: Alive

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); // Start drawing
      setTimeout(() => setStage(2), 3500); // Come alive
    };

    // Initial delay
    const startTimeout = setTimeout(() => {
      cycle();
      // Repeat cycle
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-24 h-44 md:w-32 md:h-60 rounded-2xl backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-zinc-800/40 border-zinc-500/50 shadow-2xl scale-110 -translate-y-4' : 'bg-zinc-900/10 border-zinc-800 scale-100 border border-dashed'}`}>
        
        {/* Label tag that appears in stage 2 */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white border border-blue-400 text-[8px] md:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          
          {/* Stage 1: Wireframe / Prompt */}
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-8 h-8 md:w-12 md:h-12 text-zinc-600 stroke-1" />
             {/* Wireframe lines */}
             <div className="mt-4 w-12 h-1 bg-zinc-700/50 rounded"></div>
             <div className="mt-2 w-16 h-1 bg-zinc-700/50 rounded"></div>
             <div className="mt-2 w-10 h-1 bg-zinc-700/50 rounded"></div>
          </div>

          {/* Stage 2: Alive/App */}
          <div className={`absolute inset-0 transition-all duration-700 flex flex-col ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'}`}>
             {/* Mock App Header */}
             <div className="h-6 w-full border-b border-zinc-700/50 flex items-center px-2 space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
             </div>
             {/* Mock App Content */}
             <div className="flex-1 p-2 flex flex-col items-center justify-center">
                 <FinalIcon className="w-10 h-10 md:w-14 md:h-14 text-blue-500 mb-3" />
                 <div className="w-full h-8 bg-zinc-700/30 rounded-lg flex items-center px-2 mb-2">
                    <div className="w-1/2 h-2 bg-zinc-600/50 rounded"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="h-12 bg-zinc-700/30 rounded-lg"></div>
                    <div className="h-12 bg-zinc-700/30 rounded-lg"></div>
                 </div>
             </div>
             {/* Mock Nav Bar */}
             <div className="h-8 w-full border-t border-zinc-700/50 flex justify-around items-center px-2">
                <div className="w-4 h-4 bg-zinc-600/50 rounded-sm"></div>
                <div className="w-4 h-4 bg-blue-500/50 rounded-sm"></div>
                <div className="w-4 h-4 bg-zinc-600/50 rounded-sm"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <>
      {/* Background Transformation Elements - Fixed to Viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left: Prompt -> Social App */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={ChatBubbleBottomCenterTextIcon} 
            finalIcon={RocketLaunchIcon} 
            label="SOCIAL APP"
            delay={0} 
            x="5%" 
            y="10%"
            rotation={-5} 
            />
        </div>

        {/* Bottom Right: Sketch -> Ecommerce */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={PaintBrushIcon} 
            finalIcon={CubeIcon} 
            label="STORE"
            delay={3000} 
            x="85%" 
            y="70%"
            rotation={3} 
            />
        </div>

        {/* Top Right: Code -> Dashboard */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={CommandLineIcon} 
            finalIcon={Square3Stack3DIcon} 
            label="FINTECH"
            delay={6000} 
            x="85%" 
            y="15%"
            rotation={2} 
            />
        </div>

        {/* Bottom Left: Wireframe -> Tool */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={DevicePhoneMobileIcon} 
            finalIcon={CodeBracketSquareIcon} 
            label="UTILITY"
            delay={4500} 
            x="8%" 
            y="65%"
            rotation={-3} 
            />
        </div>
      </div>

      {/* Hero Text Content */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-4 pt-4 md:pt-12">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1]">
          AI Mobile App <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Designer</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
          Generate complete <span className="text-white font-medium">Mobile App Design Systems</span> instantly. <br className="hidden sm:block" />
          Get full screen flows, interactive prototypes, and downloadable code.
        </p>
      </div>
    </>
  );
};