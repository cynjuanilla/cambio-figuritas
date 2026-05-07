import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book, RefreshCw, Star, Users, Check, Plus, Minus, Search, Shield, Key, PlusCircle, MessageSquare, LogOut, Heart, DollarSign, Coffee, List, Type, CheckSquare, Trash2, Globe, Share2, Copy, Image as ImageIcon, Zap } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection } from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
// RECUERDA: Pegar aquí tus claves reales de la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBs53SqxkZym3MR2Sy0-sKNLz6bYbw_SgQ",
  authDomain: "cambiofiguritas-d26bf.firebaseapp.com",
  projectId: "cambiofiguritas-d26bf",
  storageBucket: "cambiofiguritas-d26bf.firebasestorage.app",
  messagingSenderId: "118837830333",
  appId: "1:118837830333:web:cf474d0071460a8ab60dd4",
  measurementId: "G-CX5LX6X6TR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'album-2026-v1';

// --- DATA DEL ÁLBUM BASADO EN EL PDF OFICIAL ---
const TEAMS = [
  { id: 'FWC', name: 'Especiales', flag: '🌟', start: 0, end: 8, isGolden: true },
  { id: 'CC', name: 'Coca-Cola', flag: '🥤', start: 1, end: 14, isGolden: true },
  { id: 'MEX', name: 'México', flag: '🇲🇽', start: 0, end: 11 }, { id: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', start: 0, end: 11 }, { id: 'KOR', name: 'Corea Sur', flag: '🇰🇷', start: 0, end: 11 }, { id: 'CZE', name: 'Rep. Checa', flag: '🇨🇿', start: 0, end: 11 },
  { id: 'CAN', name: 'Canadá', flag: '🇨🇦', start: 0, end: 11 }, { id: 'BIH', name: 'Bosnia', flag: '🇧🇦', start: 0, end: 11 }, { id: 'QAT', name: 'Qatar', flag: '🇶🇦', start: 0, end: 11 }, { id: 'SUI', name: 'Suiza', flag: '🇨🇭', start: 0, end: 11 },
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', start: 0, end: 11 }, { id: 'MAR', name: 'Marruecos', flag: '🇲🇦', start: 0, end: 11 }, { id: 'HAI', name: 'Haití', flag: '🇭🇹', start: 0, end: 11 }, { id: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', start: 0, end: 11 },
  { id: 'USA', name: 'EE.UU.', flag: '🇺🇸', start: 0, end: 11 }, { id: 'PAR', name: 'Paraguay', flag: '🇵🇾', start: 0, end: 11 }, { id: 'AUS', name: 'Australia', flag: '🇦🇺', start: 0, end: 11 }, { id: 'TUR', name: 'Turquía', flag: '🇹🇷', start: 0, end: 11 },
  { id: 'GER', name: 'Alemania', flag: '🇩🇪', start: 0, end: 11 }, { id: 'CUW', name: 'Curazao', flag: '🇨🇼', start: 0, end: 11 }, { id: 'CIV', name: 'Costa Marfil', flag: '🇨🇮', start: 0, end: 11 }, { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', start: 0, end: 11 },
  { id: 'NED', name: 'P. Bajos', flag: '🇳🇱', start: 0, end: 11 }, { id: 'JPN', name: 'Japón', flag: '🇯🇵', start: 0, end: 11 }, { id: 'SWE', name: 'Suecia', flag: '🇸🇪', start: 0, end: 11 }, { id: 'TUN', name: 'Túnez', flag: '🇹🇳', start: 0, end: 11 },
  { id: 'BEL', name: 'Bélgica', flag: '🇧🇪', start: 0, end: 11 }, { id: 'EGY', name: 'Egipto', flag: '🇪🇬', start: 0, end: 11 }, { id: 'IRN', name: 'Irán', flag: '🇮🇷', start: 0, end: 11 }, { id: 'NZL', name: 'N. Zelanda', flag: '🇳🇿', start: 0, end: 11 },
  { id: 'ESP', name: 'España', flag: '🇪🇸', start: 0, end: 11 }, { id: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', start: 0, end: 11 }, { id: 'KSA', name: 'A. Saudita', flag: '🇸🇦', start: 0, end: 11 }, { id: 'URU', name: 'Uruguay', flag: '🇺🇾', start: 0, end: 11 },
  { id: 'FRA', name: 'Francia', flag: '🇫🇷', start: 0, end: 11 }, { id: 'SEN', name: 'Senegal', flag: '🇸🇳', start: 0, end: 11 }, { id: 'IRQ', name: 'Irak', flag: '🇮🇶', start: 0, end: 11 }, { id: 'NOR', name: 'Noruega', flag: '🇳🇴', start: 0, end: 11 },
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', start: 0, end: 11 }, { id: 'ALG', name: 'Argelia', flag: '🇩🇿', start: 0, end: 11 }, { id: 'AUT', name: 'Austria', flag: '🇦🇹', start: 0, end: 11 }, { id: 'JOR', name: 'Jordania', flag: '🇯🇴', start: 0, end: 11 },
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', start: 0, end: 11 }, { id: 'COD', name: 'RD Congo', flag: '🇨🇩', start: 0, end: 11 }, { id: 'UZB', name: 'Uzbekistán', flag: '🇺🇿', start: 0, end: 11 }, { id: 'COL', name: 'Colombia', flag: '🇨🇴', start: 0, end: 11 },
  { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', start: 0, end: 11 }, { id: 'CRO', name: 'Croacia', flag: '🇭🇷', start: 0, end: 11 }, { id: 'GHA', name: 'Ghana', flag: '🇬🇭', start: 0, end: 11 }, { id: 'PAN', name: 'Panamá', flag: '🇵🇦', start: 0, end: 11 }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('album');
  const [myStickers, setMyStickers] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [showQuickList, setShowQuickList] = useState(false);
  const canvasRef = useRef(null);

  const selectedTeamObj = useMemo(() => TEAMS.find(t => t.id === selectedTeamId), [selectedTeamId]);

  // --- MANEJO DE SESIÓN ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Error en Firebase: Asegurate de agregar el dominio de Vercel en la consola de Firebase.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setMyStickers({});
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (!user) return;
    const myDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubPriv = onSnapshot(myDocRef, (docSnap) => {
      if (docSnap.exists()) setMyStickers(docSnap.data().stickers || {});
    });

    const marketRef = collection(db, 'artifacts', appId, 'public', 'data', 'market');
    const unsubPub = onSnapshot(marketRef, (snapshot) => {
      const users = [];
      snapshot.forEach(doc => { if (doc.id !== user.uid) users.push({ id: doc.id, ...doc.data() }); });
      setMarketData(users);
    });
    return () => { unsubPriv(); unsubPub(); };
  }, [user]);

  // --- GUARDADO ---
  const saveData = async (stickers) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), { stickers, lastUpdated: new Date().toISOString() }, { merge: true });
    
    const dups = []; const miss = [];
    TEAMS.forEach(t => {
      for (let i = t.start; i <= t.end; i++) {
        const id = `${t.id}-${i}`;
        if (!stickers[id]) miss.push(id);
        if (stickers[id] > 1) dups.push(id);
      }
    });

    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'market', user.uid), {
      displayName: user.displayName, email: user.email, photoURL: user.photoURL,
      duplicates: dups, missing: miss, lastActive: new Date().toISOString()
    }, { merge: true });
  };

  const updateSticker = (id, delta) => {
    const next = { ...myStickers };
    const count = (next[id] || 0) + delta;
    if (count <= 0) delete next[id]; else next[id] = count;
    setMyStickers(next); 
    saveData(next);
  };

  const stats = useMemo(() => {
    let total = 0; let have = 0; let dups = 0;
    TEAMS.forEach(t => total += (t.end - t.start + 1));
    Object.values(myStickers).forEach(c => { 
      if (c > 0) have++; 
      if (c > 1) dups += (c - 1); 
    });
    return { total, have, dups, progress: Math.round((have / total) * 100) || 0 };
  }, [myStickers]);

  const shareData = useMemo(() => {
    let miss = {}; let dups = {};
    TEAMS.forEach(t => {
      let mL = []; let dL = [];
      for (let i = t.start; i <= t.end; i++) {
        const c = myStickers[`${t.id}-${i}`] || 0;
        if (c === 0) mL.push(i); if (c > 1) dL.push(i);
      }
      if (mL.length > 0) miss[t.id] = mL;
      if (dL.length > 0) dups[t.id] = dL;
    });
    return { miss, dups };
  }, [myStickers]);

  // --- GENERADOR DE IMAGEN PARA REDES ---
  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1920;
    const grd = ctx.createLinearGradient(0, 0, 1080, 1920);
    grd.addColorStop(0, '#1e3a8a'); grd.addColorStop(1, '#4c1d95');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath(); ctx.arc(100, 200, 300, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#facc15'; ctx.font = 'bold 70px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🏆 MI ÁLBUM 2026', 540, 150);
    ctx.fillStyle = '#ffffff'; ctx.font = '40px sans-serif';
    ctx.fillText(user?.displayName || "Coleccionista", 540, 220);

    let y = 350;
    const draw = (title, data, x, color) => {
      ctx.fillStyle = color; ctx.font = 'bold 45px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(title, x, y);
      let localY = y + 70; ctx.font = '28px sans-serif';
      Object.entries(data).forEach(([tid, nums]) => {
        if (localY > 1850) return;
        ctx.fillStyle = '#ffffff'; ctx.fillText(`${tid}: ${nums.join(', ')}`, x, localY);
        localY += 35;
      });
    };
    draw('❌ FALTAN', shareData.miss, 80, '#fca5a5');
    draw('✅ REPETIDAS', shareData.dups, 580, '#86efac');

    const link = document.createElement('a');
    link.download = `Figuritas_${user?.displayName || '2026'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-2xl max-w-sm w-full">
            <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3">
                <Book size={48} className="text-blue-900" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Álbum 2026</h1>
            <p className="text-blue-100 mb-10 font-medium leading-relaxed">Organizá tus repetidas y completá tu álbum de forma inteligente.</p>
            <button onClick={loginWithGoogle} className="w-full bg-white text-indigo-900 font-bold py-5 rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg">
                <Globe size={22}/> Entrar con Google
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      {/* CABECERA VIBRANTE */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {user.photoURL ? <img src={user.photoURL} className="w-11 h-11 rounded-full border-2 border-white/30 shadow-md" alt="perfil" /> : <div className="w-11 h-11 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-bold shadow-md">U</div>}
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">{user.displayName}</span>
            <span className="text-[10px] text-blue-200 uppercase font-black mt-1 tracking-wider">{stats.have} / {stats.total} PEGADAS</span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90 border border-white/10"><LogOut size={20}/></button>
      </header>

      <main className="p-4 max-w-2xl mx-auto w-full flex-1">
        {/* RESUMEN DE PROGRESO */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center mb-6">
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-3xl font-black text-indigo-900">{stats.progress}%</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">Repes: {stats.dups}</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
            </div>
            <button onClick={() => setShowQuickList(true)} className="w-full mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-indigo-800 font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 uppercase tracking-wide">
              <Share2 size={18}/> Compartir / Ver Faltantes
            </button>
        </div>

        {/* SELECTOR DE EQUIPOS */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide mb-4">
          {TEAMS.map(t => (
            <button key={t.id} onClick={() => setSelectedTeamId(t.id)} className={`px-5 py-3 rounded-2xl whitespace-nowrap font-bold text-xs border transition-all ${selectedTeamId === t.id ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
              {t.flag} {t.name}
            </button>
          ))}
        </div>

        {/* GRILLA DE FIGURITAS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="text-3xl">{selectedTeamObj?.flag}</span> {selectedTeamObj?.name}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {selectedTeamObj && Array.from({ length: selectedTeamObj.end - selectedTeamObj.start + 1 }).map((_, i) => {
              const num = selectedTeamObj.start + i;
              const id = `${selectedTeamId}-${num}`;
              const c = myStickers[id] || 0;
              
              // Colores dinámicos
              let btnStyle = "bg-slate-50 text-slate-300 border-dashed border-slate-200";
              if (c === 1) btnStyle = "bg-blue-50 text-blue-700 border-blue-500 shadow-sm ring-1 ring-blue-500/20";
              if (c > 1) btnStyle = "bg-green-50 text-green-700 border-green-500 shadow-md ring-1 ring-green-500/20";

              return (
                <div key={id} className="relative group">
                  <button onClick={() => updateSticker(id, 1)} className={`w-full aspect-[3/4] rounded-2xl border-2 font-black text-xl flex items-center justify-center transition-all active:scale-90 ${btnStyle}`}>
                    {num}
                  </button>
                  {c > 0 && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full flex border border-slate-200 overflow-hidden z-10">
                      <button onClick={(e) => { e.stopPropagation(); updateSticker(id, -1); }} className="px-3 py-1.5 text-red-500 hover:bg-slate-50 border-r border-slate-100 font-bold">-</button>
                      <span className="px-2 py-1.5 text-xs font-black bg-slate-50 min-w-[1.5rem] text-center">{c}</span>
                      <button onClick={(e) => { e.stopPropagation(); updateSticker(id, 1); }} className="px-3 py-1.5 text-green-600 hover:bg-slate-50 border-l border-slate-100 font-bold">+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      {/* MODAL DE DIFUSIÓN */}
      {showQuickList && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 transform animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black mb-6 text-center text-slate-800">Centro de Difusión</h3>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-8 pr-2 scrollbar-hide">
               <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100"><h4 className="font-black text-rose-700 text-xs mb-3 uppercase tracking-widest">Me Faltan</h4><p className="text-[11px] font-mono leading-relaxed text-rose-900 break-words">{Object.entries(shareData.miss).map(([t,n]) => `${t}: ${n.join(',')}`).join(' | ')}</p></div>
               <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100"><h4 className="font-black text-emerald-700 text-xs mb-3 uppercase tracking-widest">Tengo Repes</h4><p className="text-[11px] font-mono leading-relaxed text-emerald-900 break-words">{Object.entries(shareData.dups).map(([t,n]) => `${t}: ${n.join(',')}`).join(' | ')}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={generateImage} className="bg-indigo-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"><ImageIcon size={20}/> Descargar</button>
              <button onClick={() => setShowQuickList(false)} className="bg-slate-100 text-slate-600 font-black py-5 rounded-2xl text-sm hover:bg-slate-200 transition-all active:scale-95 tracking-wide">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 p-3 flex justify-around items-center z-[60] pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab('album')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'album' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
          <Book size={26} strokeWidth={activeTab === 'album' ? 3 : 2} /> <span className={`text-[10px] mt-1 uppercase tracking-tighter ${activeTab === 'album' ? 'font-black' : 'font-bold'}`}>Mi Álbum</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'market' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
          <Zap size={26} strokeWidth={activeTab === 'market' ? 3 : 2} /> <span className={`text-[10px] mt-1 uppercase tracking-tighter ${activeTab === 'market' ? 'font-black' : 'font-bold'}`}>Cambio</span>
        </button>
        <button onClick={() => setActiveTab('support')} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeTab === 'support' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-slate-400'}`}>
          <Heart size={26} strokeWidth={activeTab === 'support' ? 3 : 2} /> <span className={`text-[10px] mt-1 uppercase tracking-tighter ${activeTab === 'support' ? 'font-black' : 'font-bold'}`}>Apoyar</span>
        </button>
      </nav>
    </div>
  );
}