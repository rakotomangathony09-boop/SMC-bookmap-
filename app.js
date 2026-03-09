import React, { useState, useEffect, useRef } from 'react';
import { Zap, Target, Bell, Volume2, VolumeX } from 'lucide-react';

const VProTerminal = () => {
  const [price, setPrice] = useState(2158.45);
  const [signal, setSignal] = useState(null);
  const [prepAlert, setPrepAlert] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioPrep = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  useEffect(() => {
    const engine = setInterval(() => {
      const day = new Date().getDay();
      if (day === 0 || day === 6) return;

      // Simulation du flux réel connecté à la stratégie
      const newPrice = price + (Math.random() - 0.5) * 0.15;
      setPrice(newPrice);

      // Déclenchement selon stratégie (ex: zone de liquidité 2160.00)
      if (Math.abs(newPrice - 2160.00) < 0.40 && !prepAlert && !signal) {
        if (!isMuted) audioPrep.current.play().catch(() => {});
        setPrepAlert(60);
        const cd = setInterval(() => {
          setPrepAlert(p => {
            if (p <= 1) { 
              clearInterval(cd); 
              setSignal({type: 'SELL', entry: newPrice.toFixed(2), sl: (newPrice + 2.15).toFixed(2), tp: (newPrice - 6.50).toFixed(2)});
              return null; 
            }
            return p - 1;
          });
        }, 1000);
      }
    }, 1000);
    return () => clearInterval(engine);
  }, [price, prepAlert, signal]);

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans uppercase">
      <div className="max-w-xl mx-auto border border-slate-800 rounded-[3rem] p-10 bg-[#0a0d14] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <Zap className="text-blue-500 animate-pulse" />
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 border border-slate-800 rounded-lg">
            {isMuted ? <VolumeX className="text-red-500"/> : <Volume2 className="text-blue-500"/>}
          </button>
        </div>
        <div className="text-center mb-10">
          <div className="text-7xl font-black font-mono tabular-nums tracking-tighter">{price.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500 tracking-widest font-bold">XAUUSD REAL-TIME</span>
        </div>
        {prepAlert && (
          <div className="bg-blue-600 p-6 rounded-2xl animate-pulse flex justify-between items-center mb-4">
            <Bell className="animate-bounce" /> <span className="font-black">PRÉPARATION SNIPER</span>
            <span className="text-3xl font-mono">{prepAlert}s</span>
          </div>
        )}
        {signal && (
          <div className="border-t-4 border-red-500 p-6 rounded-2xl bg-red-500/10 animate-in slide-in-from-bottom">
            <div className="text-center font-black mb-4">SNIPER {signal.type} CONFIRMED</div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
              <div className="bg-black p-3 rounded">ENTRY<br/><span className="text-lg font-mono">{signal.entry}</span></div>
              <div className="bg-red-900/40 p-3 rounded">SL<br/><span className="text-lg font-mono">{signal.sl}</span></div>
              <div className="bg-green-900/40 p-3 rounded">TP<br/><span className="text-lg font-mono">{signal.tp}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VProTerminal;
