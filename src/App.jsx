import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book, RefreshCw, Star, Users, Check, Plus, Minus, Search, Shield, Key, PlusCircle, MessageSquare, LogOut, Heart, Coffee, Type, CheckSquare, Trash2, Globe, Share2, Copy, Image as ImageIcon, Zap, Printer, X } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection } from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
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
const appId = 'album-2026-pro';

// --- DATA DEL ÁLBUM BASADO EN EL PDF OFICIAL (980 FIGURITAS) ---
const TEAMS = [
  { id: 'FWC', name: 'Especiales', flag: '🌟', start: 0, end: 9, isGolden: true },
  { id: 'CC', name: 'Coca-Cola', flag: '🥤', start: 1, end: 10, isGolden: true },
  { id: 'MEX', name: 'México', flag: '🇲🇽', start: 1, end: 20 }, { id: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', start: 1, end: 20 }, { id: 'KOR', name: 'Corea Sur', flag: '🇰🇷', start: 1, end: 20 }, { id: 'CZE', name: 'Rep. Checa', flag: '🇨🇿', start: 1, end: 20 },
  { id: 'CAN', name: 'Canadá', flag: '🇨🇦', start: 1, end: 20 }, { id: 'BIH', name: 'Bosnia', flag: '🇧🇦', start: 1, end: 20 }, { id: 'QAT', name: 'Qatar', flag: '🇶🇦', start: 1, end: 20 }, { id: 'SUI', name: 'Suiza', flag: '🇨🇭', start: 1, end: 20 },
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', start: 1, end: 20 }, { id: 'MAR', name: 'Marruecos', flag: '🇲🇦', start: 1, end: 20 }, { id: 'HAI', name: 'Haití', flag: '🇭🇹', start: 1, end: 20 }, { id: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', start: 1, end: 20 },
  { id: 'USA', name: 'EE.UU.', flag: '🇺🇸', start: 1, end: 20 }, { id: 'PAR', name: 'Paraguay', flag: '🇵🇾', start: 1, end: 20 }, { id: 'AUS', name: 'Australia', flag: '🇦🇺', start: 1, end: 20 }, { id: 'TUR', name: 'Turquía', flag: '🇹🇷', start: 1, end: 20 },
  { id: 'GER', name: 'Alemania', flag: '🇩🇪', start: 1, end: 20 }, { id: 'CUW', name: 'Curazao', flag: '🇨🇼', start: 1, end: 20 }, { id: 'CIV', name: 'Costa Marfil', flag: '🇨🇮', start: 1, end: 20 }, { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', start: 1, end: 20 },
  { id: 'NED', name: 'P. Bajos', flag: '🇳🇱', start: 1, end: 20 }, { id: 'JPN', name: 'Japón', flag: '🇯🇵', start: 1, end: 20 }, { id: 'SWE', name: 'Suecia', flag: '🇸🇪', start: 1, end: 20 }, { id: 'TUN', name: 'Túnez', flag: '🇹🇳', start: 1, end: 20 },
  { id: 'BEL', name: 'Bélgica', flag: '🇧🇪', start: 1, end: 20 }, { id: 'EGY', name: 'Egipto', flag: '🇪🇬', start: 1, end: 20 }, { id: 'IRN', name: 'Irán', flag: '🇮🇷', start: 1, end: 20 }, { id: 'NZL', name: 'N. Zelanda', flag: '🇳🇿', start: 1, end: 20 },
  { id: 'ESP', name: 'España', flag: '🇪🇸', start: 1, end: 20 }, { id: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', start: 1, end: 20 }, { id: 'KSA', name: 'A. Saudita', flag: '🇸🇦', start: 1, end: 20 }, { id: 'URU', name: 'Uruguay', flag: '🇺🇾', start: 1, end: 20 },
  { id: 'FRA', name: 'Francia', flag: '🇫🇷', start: 1, end: 20 }, { id: 'SEN', name: 'Senegal', flag: '🇸🇳', start: 1, end: 20 }, { id: 'IRQ', name: 'Irak', flag: '🇮🇶', start: 1, end: 20 }, { id: 'NOR', name: 'Noruega', flag: '🇳🇴', start: 1, end: 20 },
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', start: 1, end: 20 }, { id: 'ALG', name: 'Argelia', flag: '🇩🇿', start: 1, end: 20 }, { id: 'AUT', name: 'Austria', flag: '🇦🇹', start: 1, end: 20 }, { id: 'JOR', name: 'Jordania', flag: '🇯🇴', start: 1, end: 20 },
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', start: 1, end: 20 }, { id: 'COD', name: 'RD Congo', flag: '🇨🇩', start: 1, end: 20 }, { id: 'UZB', name: 'Uzbekistán', flag: '🇺🇿', start: 1, end: 20 }, { id: 'COL', name: 'Colombia', flag: '🇨🇴', start: 1, end: 20 },
  { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', start: 1, end: 20 }, { id: 'CRO', name: 'Croacia', flag: '🇭🇷', start: 1, end: 20 }, { id: 'GHA', name: 'Ghana', flag: '🇬🇭', start: 1, end: 20 }, { id: 'PAN', name: 'Panamá', flag: '🇵🇦', start: 1, end: 20 }
];

// --- COMPONENTE DE PUBLICIDAD ADSENSE ---
const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense Error", e);
    }
  }, []);

  return (
    <div className="w-full bg-slate-200 border-2 border-dashed border-slate-300 text-slate-500 flex flex-col items-center justify-center py-4 px-2 rounded-xl text-center shadow-inner my-4 min-h-[100px] overflow-hidden">
      {/* CUANDO TENGAS ADSENSE APROBADO, DESCOMENTÁ ESTAS LÍNEAS Y PONÉ TUS DATOS */}
      {/* <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      */}
      <span className="text-xs uppercase font-bold tracking-widest mb-1">Espacio Publicitario</span>
      <span className="text-[10px]">Tus anuncios de AdSense aparecerán aquí.</span>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('album');
  const [myStickers, setMyStickers] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [myGroups, setMyGroups] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');

  const [showQuickList, setShowQuickList] = useState(false);
  const [quickInputStr, setQuickInputStr] = useState('');
  const canvasRef = useRef(null);

  // --- FILTROS Y BÚSQUEDAS ---
  const filteredTeams = useMemo(() => TEAMS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);
  const selectedTeamObj = useMemo(() => TEAMS.find(t => t.id === selectedTeamId) || TEAMS[0], [selectedTeamId]);

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
      alert("Error en Firebase: Asegurate de agregar tu dominio en Firebase Authentication > Dominios autorizados.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setMyStickers({});
    setMyGroups([]);
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (!user) return;
    const myDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubPriv = onSnapshot(myDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMyStickers(data.stickers || {});
        setMyGroups(data.groups || []);
      }
    });

    const marketRef = collection(db, 'artifacts', appId, 'public', 'data', 'market');
    const unsubPub = onSnapshot(marketRef, (snapshot) => {
      const users = [];
      snapshot.forEach(doc => { if (doc.id !== user.uid) users.push({ id: doc.id, ...doc.data() }); });
      setMarketData(users);
    });
    return () => { unsubPriv(); unsubPub(); };
  }, [user]);

  // --- GUARDADO GENERAL ---
  const saveData = async (stickers, groupsToSave) => {
    if (!user) return;
    const currentGroups = groupsToSave || myGroups;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), { stickers, groups: currentGroups, lastUpdated: new Date().toISOString() }, { merge: true });
    
    const dups = []; const miss = [];
    TEAMS.forEach(t => {
      for (let i = t.start; i <= t.end; i++) {
        const id = `${t.id}-${i}`;
        if (!stickers[id] || stickers[id] === 0) miss.push(id);
        if (stickers[id] > 1) dups.push(id);
      }
    });

    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'market', user.uid), {
      displayName: user.displayName, email: user.email, photoURL: user.photoURL,
      duplicates: dups, missing: miss, groups: currentGroups.map(g => g.id), lastActive: new Date().toISOString()
    }, { merge: true });
  };

  // --- ACTUALIZACIONES DE FIGURITAS (ACÁ ESTÁ LA CORRECCIÓN DE BORRADO) ---
  const updateSticker = (id, delta) => {
    const next = { ...myStickers };
    const count = (next[id] || 0) + delta;
    
    // CORRECCIÓN: Si llega a 0, le asignamos 0 en vez de hacer "delete". 
    // Así Firebase actualiza el valor correctamente y lo limpia.
    next[id] = count <= 0 ? 0 : count;
    
    setMyStickers(next); 
    saveData(next);
  };

  const bulkUpdateTeam = (action) => {
    if (!user) return;
    if (action === 'clear' && !window.confirm(`¿Borrar todas las figuritas de ${selectedTeamObj.name}?`)) return;

    const next = { ...myStickers };
    for (let i = selectedTeamObj.start; i <= selectedTeamObj.end; i++) {
      const id = `${selectedTeamId}-${i}`;
      if (action === 'mark_all') next[id] = Math.max(1, next[id] || 0);
      else if (action === 'clear') next[id] = 0; // CORRECCIÓN: Asignamos 0
    }
    setMyStickers(next); 
    saveData(next);
  };

  const processQuickInput = () => {
    if (!quickInputStr.trim() || !user) return;
    const numbers = quickInputStr.match(/\d+/g);
    if (!numbers) return;

    const next = { ...myStickers };
    let added = 0;
    numbers.forEach(numStr => {
      const num = parseInt(numStr, 10);
      if (num >= selectedTeamObj.start && num <= selectedTeamObj.end) {
        next[`${selectedTeamId}-${num}`] = (next[`${selectedTeamId}-${num}`] || 0) + 1;
        added++;
      }
    });

    if (added > 0) {
      setMyStickers(next); saveData(next); setQuickInputStr(''); 
      alert(`Agregadas ${added} figuritas a ${selectedTeamObj.name}.`);
    }
  };

  // --- LÓGICA DE GRUPOS ---
  const createGroup = async () => {
    if (!newGroupName.trim() || !user) return;
    const groupId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const updated = [...myGroups, { id: groupId, name: newGroupName }];
    setMyGroups(updated); setNewGroupName('');
    saveData(myStickers, updated);
  };

  const joinGroup = async () => {
    if (!joinCode.trim() || !user) return;
    const code = joinCode.toUpperCase();
    if (myGroups.some(g => g.id === code)) return alert("Ya estás en el grupo.");
    const updated = [...myGroups, { id: code, name: `Grupo ${code}` }];
    setMyGroups(updated); setJoinCode('');
    saveData(myStickers, updated);
  };

  // --- CÁLCULOS GLOBALES ---
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

  const matches = useMemo(() => {
    let mMissing = []; let mDups = [];
    Object.keys(shareData.miss).forEach(t => shareData.miss[t].forEach(n => mMissing.push(`${t}-${n}`)));
    Object.keys(shareData.dups).forEach(t => shareData.dups[t].forEach(n => mDups.push(`${t}-${n}`)));

    return marketData
      .filter(u => marketFilter === 'all' || (u.groups || []).includes(marketFilter))
      .map(u => {
        const iNeedFromThem = (u.duplicates || []).filter(id => mMissing.includes(id));
        const theyNeedFromMe = (u.missing || []).filter(id => mDups.includes(id));
        return { ...u, iNeedFromThem, theyNeedFromMe, matchScore: iNeedFromThem.length + theyNeedFromMe.length };
      })
      .filter(m => m.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
  }, [marketData, shareData, marketFilter]);

  // --- REDES Y COMPARTIR ---
  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1920;
    
    // Fondo vibrante
    const grd = ctx.createLinearGradient(0, 0, 1080, 1920);
    grd.addColorStop(0, '#1e3a8a'); grd.addColorStop(1, '#4c1d95');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath(); ctx.arc(100, 200, 300, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(900, 1600, 400, 0, 2 * Math.PI); ctx.fill();

    // Cabecera
    ctx.fillStyle = '#facc15'; ctx.font = 'bold 70px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🏆 ÁLBUM MUNDIAL 2026', 540, 150);
    ctx.fillStyle = '#ffffff'; ctx.font = '40px sans-serif';
    ctx.fillText(`Coleccionista: ${user?.displayName || "Anónimo"}`, 540, 220);

    const getLineCount = (data) => {
        let lines = 0;
        Object.values(data).forEach(numbers => {
            lines += 1;
            if (numbers.length > 5) lines += 1; 
            if (numbers.length > 10) lines += 1; 
        });
        return lines;
    };

    const maxLines = Math.max(getLineCount(shareData.miss), getLineCount(shareData.dups));
    let titleSize = 45; let textSize = 32; let lineSpace = 50;
    if (maxLines > 45) { titleSize = 28; textSize = 18; lineSpace = 24; }
    else if (maxLines > 35) { titleSize = 32; textSize = 22; lineSpace = 30; }
    else if (maxLines > 25) { titleSize = 36; textSize = 26; lineSpace = 36; }

    const startY = 320;
    
    const draw = (title, data, x, isMissing) => {
      if (Object.keys(data).length === 0) return;
      ctx.fillStyle = isMissing ? '#fca5a5' : '#86efac'; 
      ctx.font = `bold ${titleSize}px sans-serif`; ctx.textAlign = 'left';
      
      let currentY = startY;
      ctx.fillText(title, x, currentY);
      currentY += lineSpace + 10;
      
      ctx.font = `${textSize}px sans-serif`;
      Object.entries(data).forEach(([tid, nums]) => {
          const team = TEAMS.find(t => t.id === tid);
          const flag = team ? team.flag : '';
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${flag} ${tid}:`, x, currentY);
          ctx.fillStyle = isMissing ? '#fecaca' : '#bbf7d0';
          
          const words = nums.join(', ').split(', ');
          let line = '';
          let labelX = x + (textSize * 4.5); 
          
          for(let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ', ';
            let testWidth = ctx.measureText(testLine).width;
            if (testWidth > (440 - (textSize * 4.5)) && n > 0) {
              ctx.fillText(line.replace(/, $/, ''), labelX, currentY);
              line = words[n] + ', ';
              currentY += lineSpace - (textSize * 0.2); 
            } else { line = testLine; }
          }
          ctx.fillText(line.replace(/, $/, ''), labelX, currentY);
          currentY += lineSpace;
      });
    };

    draw('❌ ME FALTAN', shareData.miss, 80, true);
    draw('✅ REPETIDAS', shareData.dups, 580, false);

    // Footer
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 35px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('¡Ayudame a completar mi álbum!', 540, 1800);
    ctx.fillStyle = '#93c5fd'; ctx.font = '30px sans-serif';
    ctx.fillText('Generado en tu-album-2026.app', 540, 1850);

    const link = document.createElement('a');
    link.download = `Figuritas_${user?.displayName || '2026'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareToSocial = async () => {
    const format = (d) => Object.entries(d).map(([t, n]) => {
      const team = TEAMS.find(tm => tm.id === t);
      return `${team?.flag || ''} *${t}:* ${n.join(', ')}`;
    }).join('\n');
    
    let text = `🏆 ¡Hola! Estoy juntando figuritas del Mundial 2026.\n\n`;
    if(Object.keys(shareData.dups).length > 0) text += `✅ *TENGO REPETIDAS:*\n${format(shareData.dups)}\n\n`;
    if(Object.keys(shareData.miss).length > 0) text += `❌ *ME FALTAN:*\n${format(shareData.miss)}\n\n`;
    text += `🔄 ¡Cambiemos! Entra a la app web: https://tualbum2026.com`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Cambiemos Figuritas', text: text });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(text);
      alert("Lista copiada al portapapeles. ¡Pégala en WhatsApp!");
    }
  };

  const copyTextOnly = () => {
    const format = (d) => Object.entries(d).map(([t, n]) => {
      const team = TEAMS.find(tm => tm.id === t);
      return `${team?.flag || ''} *${t}:* ${n.join(', ')}`;
    }).join('\n');

    let text = `🏆 ¡Hola! Estoy juntando figuritas del Mundial 2026.\n\n`;
    if(Object.keys(shareData.dups).length > 0) text += `✅ *TENGO REPETIDAS:*\n${format(shareData.dups)}\n\n`;
    if(Object.keys(shareData.miss).length > 0) text += `❌ *ME FALTAN:*\n${format(shareData.miss)}\n\n`;
    text += `🔄 ¡Cambiemos! Entra a la app web: https://tualbum2026.com`;
    navigator.clipboard.writeText(text);
    alert("Lista copiada al portapapeles. ¡Pégala en WhatsApp!");
  };

  // --- RENDER: PANTALLA DE LOGIN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white pt-16 pb-20 px-6 relative overflow-hidden text-center flex flex-col justify-center">
            <div className="relative z-10 max-w-lg mx-auto">
                {/* --- IMAGEN DE EJEMPLO DEL LOGO --- */}
                <img 
                  src="/img/favico.png" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/facc15/1e3a8a?text=Logo"; }}
                  alt="Logo de la App" 
                  className="w-32 h-32 object-cover rounded-[2rem] mx-auto mb-8 shadow-2xl transform rotate-3 border-4 border-white/20"
                />

                <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Tu Álbum 2026,<br/> <span className="text-yellow-400">Completado.</span></h1>
                <p className="text-lg text-blue-100 mb-8 font-medium">No gastes de más. Unete a la comunidad y cambia figuritas de forma inteligente y segura.</p>
                <button onClick={loginWithGoogle} className="w-full sm:w-auto bg-white text-indigo-900 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-50 transition shadow-lg mx-auto active:scale-95">
                    <Globe size={22}/> Entrar con Google (Seguro)
                </button>
            </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12 relative z-20 flex-1">
            <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition">
                    <CheckSquare size={32} className="text-blue-600 mb-3"/>
                    <h3 className="font-black text-slate-800 text-lg">Control Total</h3>
                    <p className="text-slate-500 text-sm mt-1">Llevá la cuenta exacta de tus figuritas pegadas y repetidas en todos los equipos.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition">
                    <Shield size={32} className="text-teal-600 mb-3"/>
                    <h3 className="font-black text-slate-800 text-lg">Comunidades Seguras</h3>
                    <p className="text-slate-500 text-sm mt-1">Creá grupos cerrados para intercambiar solo con tu colegio, familia o club.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition">
                    <Zap size={32} className="text-purple-600 mb-3"/>
                    <h3 className="font-black text-slate-800 text-lg">Matches Mágicos</h3>
                    <p className="text-slate-500 text-sm mt-1">El sistema cruza tus faltantes con las repetidas de otros y te avisa con quién cambiar.</p>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: APLICACIÓN PRINCIPAL ---
  return (
    <>
    {/* --- VISTA DE IMPRESIÓN (Solo visible al imprimir) --- */}
    <div className="hidden print:block text-black bg-white p-8 w-full">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-black uppercase">Intercambio - Mundial 2026</h1>
            <p className="text-lg mt-2">Coleccionista: <strong>{user.displayName || '___________________'}</strong></p>
        </div>
        <div className="flex justify-between gap-8">
            <div className="flex-1 border-r border-gray-300 pr-8">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 text-center border border-gray-400">❌ ME FALTAN</h2>
                <div className="columns-2 gap-4 text-sm font-mono leading-relaxed">
                    {Object.keys(shareData.miss).length === 0 ? <p>¡Álbum Completo!</p> : 
                        Object.entries(shareData.miss).map(([t, n]) => {
                          const team = TEAMS.find(tm => tm.id === t);
                          return (
                            <div key={`print-m-${t}`} className="mb-3 break-inside-avoid">
                                <span className="font-bold border-b border-black text-base">{team?.flag} {t}:</span>
                                <span className="ml-1">{n.join(', ')}</span>
                            </div>
                          );
                        })
                    }
                </div>
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 text-center border border-gray-400">✅ TENGO REPETIDAS</h2>
                <div className="columns-2 gap-4 text-sm font-mono leading-relaxed">
                    {Object.keys(shareData.dups).length === 0 ? <p>Ninguna por ahora.</p> : 
                        Object.entries(shareData.dups).map(([t, n]) => {
                          const team = TEAMS.find(tm => tm.id === t);
                          return (
                            <div key={`print-d-${t}`} className="mb-3 break-inside-avoid">
                                <span className="font-bold border-b border-black text-base">{team?.flag} {t}:</span>
                                <span className="ml-1">{n.join(', ')}</span>
                            </div>
                          );
                        })
                    }
                </div>
            </div>
        </div>
    </div>

    {/* --- VISTA WEB APP --- */}
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 font-sans print:hidden">
      {/* CABECERA */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {user.photoURL ? <img src={user.photoURL} className="w-11 h-11 rounded-full border-2 border-white/30 shadow-md" alt="perfil" /> : <div className="w-11 h-11 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-bold shadow-md">U</div>}
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">{user.displayName}</span>
            <span className="text-[10px] text-blue-200 uppercase font-black mt-1 tracking-wider">{stats.have} / {stats.total} PEGADAS</span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90 border border-white/10"><LogOut size={20}/></button>
      </header>

      <main className="p-4 max-w-4xl mx-auto w-full flex-1 flex flex-col gap-5">
        
        {/* PESTAÑA: ÁLBUM */}
        {activeTab === 'album' && (
          <>
            <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-2">
                <div className="flex justify-between items-end mb-4 px-2">
                    <div>
                        <div className="text-3xl font-black text-indigo-900 leading-none">{stats.progress}%</div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Completado</div>
                    </div>
                    <div className="text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight block mb-1">Repes: {stats.dups}</span>
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Faltan: {stats.total - stats.have}</div>
                    </div>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
                </div>
                <button onClick={() => setShowQuickList(true)} className="w-full mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-indigo-800 font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 uppercase tracking-wide">
                  <Share2 size={18}/> Compartir / Imprimir Faltantes
                </button>
            </div>

            {/* BÚSQUEDA Y SELECTOR DE EQUIPOS */}
            <div className="relative mb-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar equipo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm font-medium" />
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {filteredTeams.map(t => (
                <button key={t.id} onClick={() => setSelectedTeamId(t.id)} className={`px-5 py-3 rounded-2xl min-w-[5rem] whitespace-nowrap border transition-all flex flex-col items-center justify-center gap-0.5 ${selectedTeamId === t.id ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xl leading-none">{t.flag}</span>
                    <span className="font-black text-sm leading-none uppercase">{t.id}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-medium leading-none tracking-wide">{t.name}</span>
                </button>
              ))}
            </div>

            {/* GRILLA DE FIGURITAS */}
            <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <span className="text-3xl">{selectedTeamObj.flag}</span> {selectedTeamObj.name}
                  </h2>
                  
                  {/* PANEL DE CARGA RÁPIDA */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex-1 sm:flex-none focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                       <span className="pl-3 text-slate-400"><Type size={16}/></span>
                       <input type="text" placeholder={`Ej: ${selectedTeamObj.start}, ${selectedTeamObj.start+1}`} value={quickInputStr} onChange={(e) => setQuickInputStr(e.target.value)} className="bg-transparent w-full sm:w-40 px-3 py-2 text-sm focus:outline-none font-medium text-slate-700" />
                       <button onClick={processQuickInput} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 text-xs font-black transition uppercase tracking-wider">Cargar</button>
                    </div>
                    <div className="flex gap-2 ml-auto sm:ml-0">
                        <button onClick={() => bulkUpdateTeam('mark_all')} className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-xl text-xs font-bold hover:bg-green-100 transition"><CheckSquare size={16}/> Llenar</button>
                        <button onClick={() => bulkUpdateTeam('clear')} className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition"><Trash2 size={16}/> Limpiar</button>
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
                {Array.from({ length: selectedTeamObj.end - selectedTeamObj.start + 1 }).map((_, i) => {
                  const num = selectedTeamObj.start + i;
                  const id = `${selectedTeamId}-${num}`;
                  const c = myStickers[id] || 0;
                  const isGolden = selectedTeamObj.isGolden || num === selectedTeamObj.start;
                  
                  // Estilos Dinámicos
                  let btnStyle = "bg-slate-50 text-slate-300 border-dashed border-slate-200";
                  if (c === 0 && isGolden) btnStyle = "bg-yellow-50/50 text-yellow-600/40 border-dashed border-yellow-300"; 
                  if (c === 1 && !isGolden) btnStyle = "bg-blue-50 text-blue-800 border-blue-400 shadow-sm ring-1 ring-blue-400/20";
                  if (c === 1 && isGolden) btnStyle = "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-600 shadow-md ring-1 ring-yellow-500/30"; 
                  if (c > 1 && !isGolden) btnStyle = "bg-green-50 text-green-800 border-green-500 shadow-md ring-1 ring-green-500/30"; 
                  if (c > 1 && isGolden) btnStyle = "bg-gradient-to-br from-emerald-300 to-green-500 text-green-900 border-green-700 shadow-lg ring-1 ring-green-500/40";

                  return (
                    <div key={id} className="relative group flex flex-col items-center">
                      <button onClick={() => updateSticker(id, 1)} className={`w-full aspect-[3/4] rounded-2xl border-2 font-black text-xl flex items-center justify-center transition-all active:scale-95 ${btnStyle}`}>
                        {num}
                        {isGolden && c === 0 && <Star size={14} className="absolute top-2 right-2 opacity-30" />}
                        {isGolden && c > 0 && <Star size={14} className="absolute top-2 right-2 text-white/70" fill="currentColor" />}
                      </button>
                      {c > 0 && (
                        <div className="absolute -bottom-3 flex bg-white shadow-xl rounded-full border border-slate-200 overflow-hidden z-10">
                          <button onClick={(e) => { e.stopPropagation(); updateSticker(id, -1); }} className="px-3 py-1.5 text-red-500 hover:bg-slate-50 border-r border-slate-100 font-bold">-</button>
                          <span className="px-2 py-1.5 text-xs font-black bg-slate-50 min-w-[1.5rem] text-center flex items-center justify-center">{c}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateSticker(id, 1); }} className="px-3 py-1.5 text-green-600 hover:bg-slate-50 border-l border-slate-100 font-bold">+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <AdBanner />
          </>
        )}

        {/* PESTAÑA: GRUPOS / COMUNIDADES */}
        {activeTab === 'groups' && (
           <div className="flex flex-col gap-4">
             <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-[2rem] p-8 shadow-md">
               <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Shield size={32}/> Comunidades Seguras</h2>
               <p className="text-teal-50 font-medium text-lg">Cambiá figuritas en un entorno cerrado (tu colegio, oficina o club).</p>
             </div>
             <div className="grid md:grid-cols-2 gap-5">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2"><PlusCircle size={20} className="text-teal-600"/> Crear nuevo grupo</h3>
                 <div className="flex gap-2">
                   <input type="text" placeholder="Ej: Club Atlético..." value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition" />
                   <button onClick={createGroup} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl text-sm font-black transition uppercase tracking-wide">Crear</button>
                 </div>
               </div>
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2"><Key size={20} className="text-blue-600"/> Unirse con código</h3>
                 <div className="flex gap-2">
                   <input type="text" placeholder="Ingresá el código..." value={joinCode} onChange={e => setJoinCode(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm uppercase font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" maxLength={6} />
                   <button onClick={joinGroup} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-black transition uppercase tracking-wide">Unirse</button>
                 </div>
               </div>
             </div>
             <h3 className="text-xl font-black text-slate-800 mt-4 px-2">Mis Comunidades</h3>
             {myGroups.length === 0 ? <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500 font-medium">Aún no estás en ningún grupo privado.</div> : 
               <div className="grid sm:grid-cols-2 gap-4">
                 {myGroups.map(group => (
                   <div key={group.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition">
                     <div>
                       <div className="font-black text-slate-800 text-lg">{group.name}</div>
                       <div className="text-xs text-slate-500 font-medium mt-1">CÓDIGO: <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{group.id}</span></div>
                     </div>
                     <button onClick={() => { setMarketFilter(group.id); setActiveTab('market'); }} className="bg-indigo-50 text-indigo-700 px-5 py-3 rounded-xl font-black text-xs hover:bg-indigo-100 transition uppercase tracking-wide">Ver Matches</button>
                   </div>
                 ))}
               </div>
             }
             <AdBanner />
           </div>
        )}

        {/* PESTAÑA: CAMBIO / MARKET */}
        {activeTab === 'market' && (
          <div className="space-y-5">
             <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
               <span className="text-xs text-slate-500 font-bold uppercase tracking-wider pl-3">Filtrar por:</span>
               <button onClick={() => setMarketFilter('all')} className={`px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ${marketFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>🌍 Mercado Global</button>
               {myGroups.map(g => (
                 <button key={g.id} onClick={() => setMarketFilter(g.id)} className={`px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap flex items-center gap-2 transition-all ${marketFilter === g.id ? 'bg-teal-600 text-white shadow-md' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}><Shield size={16}/> {g.name}</button>
               ))}
             </div>

             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-[2rem] shadow-lg">
                <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><RefreshCw size={32}/> Matches Inteligentes</h2>
                <p className="text-indigo-100 text-lg font-medium">Coleccionistas que tienen exactamente lo que buscás, y buscan lo que vos tenés.</p>
             </div>

             {matches.length === 0 ? (
                 <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-slate-100">
                   <Users size={64} className="text-slate-300 mx-auto mb-6" />
                   <h3 className="text-2xl font-black text-slate-700 mb-2">No hay coincidencias</h3>
                   <p className="text-slate-500 font-medium">Nadie en este grupo tiene figuritas que te sirvan (o vos no tenés repetidas que les sirvan a ellos). ¡Volvé más tarde!</p>
                 </div>
               ) : (
               <div className="grid gap-5">
                 {matches.map(m => (
                   <div key={m.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-5 hover:shadow-lg transition-all duration-300">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {m.photoURL ? <img src={m.photoURL} className="w-14 h-14 rounded-full border-2 border-indigo-100" alt="profile"/> : <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-xl">U</div>}
                          <div>
                             <span className="font-black text-slate-800 text-lg block leading-tight">{m.displayName}</span>
                             {marketFilter !== 'all' ? <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-lg uppercase tracking-wider mt-1 inline-block">Grupo Privado</span> : <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg uppercase tracking-wider mt-1 inline-block">Global</span>}
                          </div>
                        </div>
                        <a href={`mailto:${m.email}?subject=Intercambio%20de%20Figuritas%202026`} className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-black shadow-md transition-all active:scale-95 flex items-center gap-2"><MessageSquare size={16}/> Contactar</a>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-200">
                        <div className="flex-1">
                            <span className="font-black text-emerald-600 uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2"><Check size={16}/> Te da ({m.iNeedFromThem.length}):</span>
                            <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm font-mono text-sm text-slate-700 whitespace-normal break-words leading-relaxed">{m.iNeedFromThem.join(', ')}</div>
                        </div>
                        <div className="flex-1">
                            <span className="font-black text-indigo-600 uppercase text-xs tracking-wider flex items-center gap-1.5 mb-2"><Zap size={16}/> Le das ({m.theyNeedFromMe.length}):</span>
                            <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm font-mono text-sm text-slate-700 whitespace-normal break-words leading-relaxed">{m.theyNeedFromMe.join(', ')}</div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* PESTAÑA: APOYAR */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
               <Heart size={64} className="mx-auto mb-6 text-rose-200 relative z-10" fill="currentColor" />
               <h2 className="text-3xl font-black mb-4 tracking-tight relative z-10">¿Te ayudamos a completar el álbum?</h2>
               <p className="text-rose-100 text-lg mb-8 font-medium relative z-10 max-w-md mx-auto leading-relaxed">Esta aplicación es 100% gratuita y sin publicidad invasiva. Si lograste tus objetivos gracias a los intercambios, ayudanos a mantener los servidores invitándonos un cafecito.</p>
               {/* --- ACÁ REEMPLAZÁ CON TU LINK DE CAFECITO --- */}
               <a href="https://cafecito.app/TU_USUARIO_ACA" target="_blank" rel="noreferrer" className="bg-slate-900 text-white font-black py-5 px-10 rounded-2xl inline-flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 text-lg relative z-10">
                 <Coffee size={24}/> Invitar un Cafecito
               </a>
            </div>
            <AdBanner />
          </div>
        )}
      </main>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      {/* MODAL DE DIFUSIÓN */}
      {showQuickList && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 transform animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">Centro de Difusión</h3>
              <button onClick={() => setShowQuickList(false)} className="bg-slate-100 p-2.5 rounded-full text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-90"><X size={20}/></button>
            </div>
            
            {/* CONTENEDOR SCROLL CON CAJITAS DE PAÍSES */}
            <div className="space-y-6 overflow-y-auto mb-8 pr-2 scrollbar-hide flex-1">
               
               {/* SECCIÓN: FALTAN */}
               <div className="bg-rose-50 p-4 sm:p-5 rounded-3xl border border-rose-100 flex flex-col max-h-[40vh]">
                  <h4 className="font-black text-rose-700 text-sm mb-3 uppercase tracking-widest flex items-center gap-2 sticky top-0 bg-rose-50 z-10"><Book size={18}/> Me Faltan</h4>
                  <div className="overflow-y-auto scrollbar-hide">
                    {Object.keys(shareData.miss).length === 0 ? (
                      <p className="text-sm font-medium text-rose-900">¡Álbum completo!</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(shareData.miss).map(([t,n]) => {
                          const team = TEAMS.find(tm => tm.id === t);
                          return (
                            <div key={`m-${t}`} className="bg-white/80 px-3 py-2 rounded-xl border border-rose-200/50 shadow-sm text-sm font-mono flex items-center">
                              <span className="text-base mr-1.5">{team?.flag}</span>
                              <span className="font-bold text-rose-800 mr-2">{t}:</span>
                              <span className="text-slate-700">{n.join(', ')}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
               </div>

               {/* SECCIÓN: REPETIDAS */}
               <div className="bg-emerald-50 p-4 sm:p-5 rounded-3xl border border-emerald-100 flex flex-col max-h-[40vh]">
                  <h4 className="font-black text-emerald-700 text-sm mb-3 uppercase tracking-widest flex items-center gap-2 sticky top-0 bg-emerald-50 z-10"><RefreshCw size={18}/> Tengo Repes</h4>
                  <div className="overflow-y-auto scrollbar-hide">
                    {Object.keys(shareData.dups).length === 0 ? (
                      <p className="text-sm font-medium text-emerald-900">Ninguna repetida.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(shareData.dups).map(([t,n]) => {
                          const team = TEAMS.find(tm => tm.id === t);
                          return (
                            <div key={`d-${t}`} className="bg-white/80 px-3 py-2 rounded-xl border border-emerald-200/50 shadow-sm text-sm font-mono flex items-center">
                              <span className="text-base mr-1.5">{team?.flag}</span>
                              <span className="font-bold text-emerald-800 mr-2">{t}:</span>
                              <span className="text-slate-700">{n.join(', ')}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* BOTONERA INFERIOR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 border-t border-slate-100 pt-6">
              <button onClick={copyTextOnly} className="bg-slate-100 text-slate-700 font-black py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-200 transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-wide"><Copy size={18}/> Texto</button>
              <button onClick={generateImage} className="bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white font-black py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-wide"><ImageIcon size={18}/> Imagen Insta</button>
              <button onClick={() => window.print()} className="bg-slate-800 text-white font-black py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-md transition-all hover:bg-black active:scale-95 text-[10px] sm:text-xs uppercase tracking-wide"><Printer size={18}/> Imprimir</button>
              <button onClick={handleShareToSocial} className="bg-indigo-600 text-white font-black py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-indigo-700 transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-wide shadow-md"><Share2 size={18}/> Compartir</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR ESTILO APP */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-2 sm:p-3 flex justify-around items-center z-[60] pb-safe shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab('album')} className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'album' ? 'bg-indigo-50 text-indigo-700 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <Book size={24} strokeWidth={activeTab === 'album' ? 3 : 2} /> <span className={`text-[10px] mt-1.5 uppercase tracking-tighter ${activeTab === 'album' ? 'font-black' : 'font-bold'}`}>Mi Álbum</span>
        </button>
        <button onClick={() => setActiveTab('groups')} className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'groups' ? 'bg-teal-50 text-teal-700 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <Shield size={24} strokeWidth={activeTab === 'groups' ? 3 : 2} /> <span className={`text-[10px] mt-1.5 uppercase tracking-tighter ${activeTab === 'groups' ? 'font-black' : 'font-bold'}`}>Grupos</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'market' ? 'bg-indigo-50 text-indigo-700 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <Zap size={24} strokeWidth={activeTab === 'market' ? 3 : 2} /> <span className={`text-[10px] mt-1.5 uppercase tracking-tighter ${activeTab === 'market' ? 'font-black' : 'font-bold'}`}>Cambio</span>
        </button>
        <button onClick={() => setActiveTab('support')} className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 ${activeTab === 'support' ? 'bg-rose-50 text-rose-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <Heart size={24} strokeWidth={activeTab === 'support' ? 3 : 2} /> <span className={`text-[10px] mt-1.5 uppercase tracking-tighter ${activeTab === 'support' ? 'font-black' : 'font-bold'}`}>Apoyar</span>
        </button>
      </nav>
    </div>
    </>
  );
}