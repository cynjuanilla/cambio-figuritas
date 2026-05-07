import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book, RefreshCw, Star, Users, Check, Plus, Minus, Search, Shield, Key, PlusCircle, MessageSquare, LogOut, Heart, DollarSign, Coffee, List, Type, CheckSquare, Trash2, Globe, Share2, Copy, Image as ImageIcon } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection } from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'album-2026-v1';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Error en Firebase: Habilitá Google en Authentication.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setMyStickers({});
  };

  useEffect(() => {
    if (!user) return;
    const myDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubPriv = onSnapshot(myDocRef, (docSnap) => {
      if (docSnap.exists()) setMyStickers(docSnap.data().stickers || {});
    });

    const marketRef = collection(db, 'artifacts', appId, 'public', 'data', 'market');
    const unsubPub = onSnapshot(marketRef, (snapshot) => {
      const marketUsers = [];
      snapshot.forEach(doc => { if (doc.id !== user.uid) marketUsers.push({ id: doc.id, ...doc.data() }); });
      setMarketData(marketUsers);
    });
    return () => { unsubPriv(); unsubPub(); };
  }, [user]);

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
      let mList = []; let dList = [];
      for (let i = t.start; i <= t.end; i++) {
        const c = myStickers[`${t.id}-${i}`] || 0;
        if (c === 0) mList.push(i); if (c > 1) dList.push(i);
      }
      if (mList.length > 0) miss[t.id] = mList;
      if (dList.length > 0) dups[t.id] = dList;
    });
    return { miss, dups };
  }, [myStickers]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1920;
    const grd = ctx.createLinearGradient(0, 0, 1080, 1920);
    grd.addColorStop(0, '#1e3a8a'); grd.addColorStop(1, '#4c1d95');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = '#facc15'; ctx.font = 'bold 70px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🏆 MI ÁLBUM 2026', 540, 150);
    ctx.fillStyle = '#ffffff'; ctx.font = '40px sans-serif';
    ctx.fillText(user?.displayName || "Coleccionista", 540, 220);

    let y = 350;
    const draw = (title, data, x, color) => {
      ctx.fillStyle = color; ctx.font = 'bold 40px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(title, x, y);
      let localY = y + 60; ctx.font = '22px sans-serif';
      Object.entries(data).forEach(([tid, nums]) => {
        if (localY > 1850) return;
        ctx.fillStyle = '#ffffff'; ctx.fillText(`${tid}: ${nums.join(', ')}`, x, localY);
        localY += 30;
      });
    };
    draw('❌ FALTAN', shareData.miss, 80, '#fca5a5');
    draw('✅ REPETIDAS', shareData.dups, 580, '#86efac');

    const link = document.createElement('a');
    link.download = 'mis-figuritas-2026.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl max-w-sm w-full">
          <Book size={64} className="text-yellow-400 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Álbum 2026</h1>
          <p className="text-slate-300 mb-8 font-medium">La app para completar tu colección.</p>
          <button onClick={loginWithGoogle} className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-100 transition flex items-center justify-center gap-3">
             <Globe size={20}/> Entrar con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <header className="bg-indigo-900 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          {user.photoURL ? <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white/30" /> : <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">U</div>}
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">{user.displayName}</span>
            <span className="text-[10px] opacity-70 uppercase">{stats.have} / {stats.total} PEGADAS</span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><LogOut size={20}/></button>
      </header>

      <main className="p-4 max-w-2xl mx-auto w-full flex-1">
        {activeTab === 'album' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-center">
               <span className="text-2xl font-black text-indigo-900">{stats.progress}%</span>
               <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-2">
                  <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
               </div>
               <button onClick={() => setShowQuickList(true)} className="w-full mt-4 bg-indigo-50 text-indigo-700 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-100 transition">
                 <Share2 size={18}/> Compartir / Ver Faltantes
               </button>
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {TEAMS.map(t => (
                <button key={t.id} onClick={() => setSelectedTeamId(t.id)} className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold text-xs border transition-all ${selectedTeamId === t.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>
                  {t.flag} {t.name}
                </button>
              ))}
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">{selectedTeamObj?.flag}</span> {selectedTeamObj?.name}
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {selectedTeamObj && Array.from({ length: selectedTeamObj.end - selectedTeamObj.start + 1 }).map((_, i) => {
                  const num = selectedTeamObj.start + i;
                  const id = `${selectedTeamId}-${num}`;
                  const c = myStickers[id] || 0;
                  return (
                    <div key={id} className="relative">
                      <button onClick={() => updateSticker(id, 1)} className={`w-full aspect-[3/4] rounded-xl border-2 font-bold text-lg flex items-center justify-center transition-all ${c === 0 ? 'bg-slate-50 text-slate-300' : 'bg-indigo-50 text-indigo-700 border-indigo-500'}`}>
                        {num}
                      </button>
                      {c > 0 && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full flex border border-slate-200">
                          <button onClick={(e) => { e.stopPropagation(); updateSticker(id, -1); }} className="px-2 text-red-500">-</button>
                          <span className="px-1 text-[10px] font-black">{c}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateSticker(id, 1); }} className="px-2 text-green-600">+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-4">
             {marketData.length === 0 ? <p className="text-center py-10 text-slate-400">No hay otros usuarios todavía.</p> : 
               marketData.map(m => (
                 <div key={m.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col gap-3">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">{m.displayName}</span>
                      </div>
                      <a href={`mailto:${m.email}`} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Contactar</a>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-2xl flex gap-2 text-[10px]">
                      <div className="flex-1"><span className="font-black text-emerald-600 uppercase">Te da:</span><div className="text-slate-500 truncate">{m.duplicates?.join(', ')}</div></div>
                      <div className="flex-1"><span className="font-black text-indigo-600 uppercase">Le das:</span><div className="text-slate-500 truncate">{m.missing?.join(', ')}</div></div>
                   </div>
                 </div>
               ))
             }
          </div>
        )}
      </main>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      {showQuickList && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
            <h3 className="text-xl font-black mb-4 text-center">Centro de Difusión</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6">
               <p className="text-[10px] font-mono leading-tight">{JSON.stringify(shareData)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={generateImage} className="bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"><ImageIcon size={18}/> Imagen</button>
              <button onClick={() => setShowQuickList(false)} className="bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center">
        <button onClick={() => setActiveTab('album')} className={`flex flex-col items-center p-2 rounded-2xl ${activeTab === 'album' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Book size={24}/> <span className="text-[10px] mt-1 uppercase">Álbum</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center p-2 rounded-2xl ${activeTab === 'market' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <RefreshCw size={24}/> <span className="text-[10px] mt-1 uppercase">Cambio</span>
        </button>
        <button onClick={() => setActiveTab('support')} className={`flex flex-col items-center p-2 rounded-2xl ${activeTab === 'support' ? 'text-rose-600' : 'text-slate-400'}`}>
          <Heart size={24}/> <span className="text-[10px] mt-1 uppercase">Apoyar</span>
        </button>
      </nav>
    </div>
  );
}