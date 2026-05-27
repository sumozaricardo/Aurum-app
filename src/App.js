import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C96A";
const GOLD_DIM = "#7A5F2A";
const BLACK = "#0A0A0A";
const SURFACE = "#111111";
const SURFACE2 = "#1A1A1A";
const SURFACE3 = "#222222";
const TEXT = "#F0EAD6";
const TEXT_DIM = "#7A7060";

const s = {
app: { fontFamily: "'Cormorant Garamond', Georgia, serif", background: BLACK, color: TEXT, minHeight: "100vh", maxWidth: 420, margin: "0 auto", position: "relative" },
nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${GOLD_DIM}33`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" },
logo: { fontSize: 22, fontWeight: 700, letterSpacing: "0.12em", color: GOLD },
logoSub: { fontSize: 9, color: TEXT_DIM, letterSpacing: "0.3em", display: "block", marginTop: -2 },
tabs: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(16px)", borderTop: `1px solid ${GOLD_DIM}33`, display: "flex", justifyContent: "space-around", padding: "10px 0 18px", zIndex: 100 },
tab: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 16px", color: TEXT_DIM, fontSize: 9, letterSpacing: "0.15em" },
tabActive: { color: GOLD },
tabIcon: { fontSize: 20 },
page: { padding: "16px 16px 100px" },
label: { fontSize: 10, letterSpacing: "0.35em", color: GOLD_DIM, textTransform: "uppercase", marginBottom: 14, marginTop: 8 },
card: { background: SURFACE, borderRadius: 2, border: `1px solid ${GOLD_DIM}22`, marginBottom: 16, overflow: "hidden" },
cardHeader: { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" },
avatar: { width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_DIM}, ${SURFACE3})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, border: `1px solid ${GOLD_DIM}55` },
cardName: { fontSize: 13, fontWeight: 600, color: TEXT },
cardTime: { fontSize: 10, color: TEXT_DIM, marginTop: 1 },
badge: (pub) => ({ fontSize: 8, letterSpacing: "0.2em", color: pub ? GOLD : TEXT_DIM, border: `1px solid ${pub ? GOLD_DIM : SURFACE3}`, borderRadius: 2, padding: "2px 6px", textTransform: "uppercase" }),
cardBody: { padding: "0 16px 14px" },
cardTitle: { fontSize: 17, fontWeight: 700, color: TEXT, lineHeight: 1.3, marginBottom: 6 },
cardText: { fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 },
cardActions: { display: "flex", borderTop: `1px solid ${GOLD_DIM}11`, padding: "0 8px" },
actionBtn: { background: "none", border: "none", cursor: "pointer", color: TEXT_DIM, fontSize: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" },
aiPanel: { background: SURFACE, borderRadius: 2, border: `1px solid ${GOLD}33`, marginBottom: 20, overflow: "hidden" },
aiHeader: { background: `linear-gradient(90deg, ${GOLD_DIM}22, transparent)`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${GOLD_DIM}22` },
aiDot: { width: 8, height: 8, borderRadius: "50%", background: GOLD, boxShadow: `0 0 8px ${GOLD}88` },
aiTitle: { fontSize: 11, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" },
aiBody: { padding: "14px 16px" },
aiText: { fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 14 },
aiRoute: { background: SURFACE2, border: `1px solid ${GOLD_DIM}22`, borderRadius: 2, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 8 },
input: { background: SURFACE2, border: `1px solid ${GOLD_DIM}33`, borderRadius: 2, padding: "12px 14px", color: TEXT, fontSize: 13, fontFamily: "inherit", width: "100%", outline: "none", marginBottom: 10 },
btn: { background: GOLD, border: "none", cursor: "pointer", color: BLACK, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 2, letterSpacing: "0.1em", width: "100%" },
btnOutline: { background: "none", border: `1px solid ${GOLD_DIM}`, cursor: "pointer", color: GOLD, fontSize: 13, padding: "10px 24px", borderRadius: 2, letterSpacing: "0.1em", width: "100%", marginTop: 8 },
msgAI: { background: SURFACE, border: `1px solid ${GOLD}22`, borderRadius: "2px 12px 12px 12px", padding: "12px 14px", maxWidth: "85%", alignSelf: "flex-start", marginBottom: 12 },
msgUser: { background: `linear-gradient(135deg, ${GOLD_DIM}44, ${GOLD_DIM}22)`, border: `1px solid ${GOLD_DIM}44`, borderRadius: "12px 2px 12px 12px", padding: "12px 14px", maxWidth: "85%", alignSelf: "flex-end", marginBottom: 12 },
msgText: { fontSize: 13, color: TEXT, lineHeight: 1.6 },
msgLabel: { fontSize: 9, color: GOLD, letterSpacing: "0.2em", marginBottom: 6 },
};

// AUTH VIEW
function AuthView({ onAuth }) {
const [mode, setMode] = useState("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [loading, setLoading] = useState(false);
const [msg, setMsg] = useState("");

const handle = async () => {
setLoading(true); setMsg("");
if (mode === "login") {
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) setMsg(error.message); else onAuth();
} else {
const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
if (error) setMsg(error.message); else setMsg("¡Revisa tu correo para confirmar tu cuenta!");
}
setLoading(false);
};

return (
<div style={{ ...s.page, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "80vh" }}>
<div style={{ textAlign: "center", marginBottom: 32 }}>
<div style={{ fontSize: 42, color: GOLD, letterSpacing: "0.15em", fontWeight: 700 }}>AURUM</div>
<div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: "0.3em", marginTop: 4 }}>COMUNIDAD DE CONOCIMIENTO</div>
</div>
{mode === "register" && <input style={s.input} placeholder="Tu nombre completo" value={name} onChange={e => setName(e.target.value)} />}
<input style={s.input} placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
<input style={s.input} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
{msg && <div style={{ fontSize: 12, color: GOLD, marginBottom: 10, textAlign: "center" }}>{msg}</div>}
<button style={s.btn} onClick={handle} disabled={loading}>{loading ? "..." : mode === "login" ? "ENTRAR" : "REGISTRARSE"}</button>
<button style={s.btnOutline} onClick={() => setMode(mode === "login" ? "register" : "login")}>
{mode === "login" ? "¿Sin cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
</button>
</div>
);
}

// FEED VIEW
function FeedView({ user }) {
const [posts, setPosts] = useState([]);
const [liked, setLiked] = useState({});
const [loading, setLoading] = useState(true);

useEffect(() => {
loadPosts();
}, []);

const loadPosts = async () => {
const { data } = await supabase.from("posts").select("*, profiles(username, full_name)").order("created_at", { ascending: false });
if (data) setPosts(data);
setLoading(false);
};

const toggleLike = async (postId, currentLikes) => {
const isLiked = liked[postId];
setLiked(l => ({ ...l, [postId]: !isLiked }));
await supabase.from("posts").update({ likes: currentLikes + (isLiked ? -1 : 1) }).eq("id", postId);
setPosts(p => p.map(post => post.id === postId ? { ...post, likes: currentLikes + (isLiked ? -1 : 1) } : post));
};

const timeAgo = (date) => {
const diff = Date.now() - new Date(date);
const mins = Math.floor(diff / 60000);
if (mins < 60) return `hace ${mins}min`;
const hrs = Math.floor(mins / 60);
if (hrs < 24) return `hace ${hrs}h`;
return `hace ${Math.floor(hrs / 24)}d`;
};

return (
<div style={s.page}>
<div style={s.label}>Comunidad</div>
<div style={s.aiPanel}>
<div style={s.aiHeader}><div style={s.aiDot} /><span style={s.aiTitle}>Aurum IA — Rutas sugeridas</span></div>
<div style={s.aiBody}>
<p style={s.aiText}>Rutas de aprendizaje recomendadas para ti:</p>
{[{ icon: "📐", name: "Fundamentos Matemáticos", sub: "6 lecciones · Básico" }, { icon: "🗺️", name: "Logística Avanzada", sub: "4 lecciones · Intermedio" }, { icon: "🧠", name: "Pensamiento Crítico", sub: "5 lecciones · Básico" }].map(r => (
<div key={r.name} style={s.aiRoute}>
<span style={{ fontSize: 16 }}>{r.icon}</span>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{r.name}</div>
<div style={{ fontSize: 10, color: TEXT_DIM, marginTop: 2 }}>{r.sub}</div>
</div>
<span style={{ color: GOLD_DIM }}>›</span>
</div>
))}
</div>
</div>
<div style={s.label}>Publicaciones recientes</div>
{loading && <div style={{ color: TEXT_DIM, fontSize: 13, textAlign: "center", padding: 20 }}>Cargando...</div>}
{posts.map(p => (
<div key={p.id} style={s.card}>
<div style={s.cardHeader}>
<div style={s.avatar}>👤</div>
<div style={{ flex: 1 }}>
<div style={s.cardName}>{p.profiles?.full_name || p.profiles?.username || "Miembro"}</div>
<div style={s.cardTime}>{timeAgo(p.created_at)}</div>
</div>
<span style={s.badge(p.is_public)}>{p.is_public ? "Público" : "Privado"}</span>
</div>
<div style={s.cardBody}>
<div style={s.cardTitle}>{p.title}</div>
<div style={s.cardText}>{p.content}</div>
</div>
<div style={s.cardActions}>
<button style={{ ...s.actionBtn, color: liked[p.id] ? GOLD : TEXT_DIM }} onClick={() => toggleLike(p.id, p.likes)}>♡ {p.likes}</button>
<button style={s.actionBtn}>✦ Guardar</button>
</div>
</div>
))}
</div>
);
}

// LESSONS VIEW
function LessonsView() {
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
supabase.from("lessons").select("*, profiles(username, full_name)").order("created_at", { ascending: false })
.then(({ data }) => { if (data) setLessons(data); setLoading(false); });
}, []);

return (
<div style={s.page}>
<div style={s.label}>Lecciones disponibles</div>
{loading && <div style={{ color: TEXT_DIM, fontSize: 13, textAlign: "center", padding: 20 }}>Cargando...</div>}
{lessons.map(l => (
<div key={l.id} style={{ ...s.card, padding: 16, cursor: "pointer" }}>
<div style={{ fontSize: 9, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: 8 }}>{l.category || "General"}</div>
<div style={s.cardTitle}>{l.title}</div>
<div style={{ display: "flex", gap: 12, marginTop: 8 }}>
<span style={{ fontSize: 11, color: TEXT_DIM }}>{l.profiles?.full_name || l.profiles?.username}</span>
{l.duration && <><span style={{ color: GOLD_DIM, fontSize: 8 }}>◆</span><span style={{ fontSize: 11, color: TEXT_DIM }}>{l.duration}</span></>}
</div>
</div>
))}
<div style={{ ...s.card, padding: 24, textAlign: "center", border: `1px dashed ${GOLD_DIM}44`, cursor: "pointer" }}>
<div style={{ fontSize: 28, marginBottom: 8 }}>＋</div>
<div style={{ fontSize: 13, color: GOLD, letterSpacing: "0.1em" }}>Crear nueva lección</div>
</div>
</div>
);
}

// AI VIEW
function AIView() {
const [msgs, setMsgs] = useState([{ from: "ai", text: "Hola. Soy tu asistente Aurum. Puedo generar resúmenes de lecciones o sugerirte rutas de estudio personalizadas. ¿En qué te ayudo?" }]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

const send = async () => {
if (!input.trim() || loading) return;
const userMsg = input.trim();
setInput("");
setMsgs(m => [...m, { from: "user", text: userMsg }]);
setLoading(true);
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 1000,
system: "Eres un asistente de aprendizaje elegante y conciso para una comunidad educativa privada llamada Aurum. Tu especialidad es generar resúmenes de contenido educativo y sugerir rutas de aprendizaje personalizadas. Responde siempre en español, de forma clara, breve y sofisticada. Máximo 3 párrafos cortos.",
messages: [{ role: "user", content: userMsg }],
}),
});
const data = await res.json();
const reply = data.content?.map(c => c.text || "").join("") || "No pude procesar tu solicitud.";
setMsgs(m => [...m, { from: "ai", text: reply }]);
} catch { setMsgs(m => [...m, { from: "ai", text: "Error al conectar. Intenta de nuevo." }]); }
setLoading(false);
};

return (
<div style={{ ...s.page, display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
<div style={s.label}>Asistente Aurum IA</div>
<div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
{msgs.map((m, i) => (
<div key={i} style={m.from === "ai" ? s.msgAI : s.msgUser}>
{m.from === "ai" && <div style={s.msgLabel}>AURUM IA</div>}
<div style={s.msgText}>{m.text}</div>
</div>
))}
{loading && <div style={s.msgAI}><div style={s.msgLabel}>AURUM IA</div><div style={{ ...s.msgText, color: GOLD_DIM }}>Pensando...</div></div>}
</div>
<div style={{ display: "flex", gap: 10, alignItems: "center", background: SURFACE, border: `1px solid ${GOLD_DIM}33`, borderRadius: 2, padding: "10px 14px", marginTop: 12 }}>
<input style={{ flex: 1, background: "none", border: "none", outline: "none", color: TEXT, fontSize: 13, fontFamily: "inherit" }} placeholder="Pregunta algo o pide un resumen..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
<button style={{ background: GOLD, border: "none", cursor: "pointer", color: BLACK, fontSize: 14, width: 32, height: 32, borderRadius: "50%", fontWeight: 700 }} onClick={send}>›</button>
</div>
</div>
);
}

// PROFILE VIEW
function ProfileView({ user, onLogout }) {
const [profile, setProfile] = useState(null);

useEffect(() => {
if (user) supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => { if (data) setProfile(data); });
}, [user]);

return (
<div style={{ paddingBottom: 100 }}>
<div style={{ background: `linear-gradient(180deg, ${SURFACE2} 0%, ${BLACK} 100%)`, padding: "30px 20px 24px", textAlign: "center", borderBottom: `1px solid ${GOLD_DIM}22` }}>
<div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: `2px solid ${GOLD}`, boxShadow: `0 0 24px ${GOLD}33` }}>👤</div>
<div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>{profile?.full_name || profile?.username || "Miembro"}</div>
<div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", marginTop: 4 }}>◆ MIEMBRO AURUM</div>
{profile?.bio && <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 10 }}>{profile.bio}</div>}
</div>
<div style={s.page}>
<button style={{ ...s.btnOutline, marginTop: 0 }} onClick={onLogout}>Cerrar sesión</button>
</div>
</div>
);
}

const TABS = [{ id: "feed", label: "INICIO", icon: "⬡" }, { id: "lessons", label: "LECCIONES", icon: "◈" }, { id: "ai", label: "IA", icon: "✦" }, { id: "profile", label: "PERFIL", icon: "◎" }];

export default function App() {
const [active, setActive] = useState("feed");
const [user, setUser] = useState(null);
const [checking, setChecking] = useState(true);

useEffect(() => {
supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user || null); setChecking(false); });
supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null));
}, []);

const logout = async () => { await supabase.auth.signOut(); setUser(null); };

if (checking) return <div style={{ background: BLACK, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontSize: 22, letterSpacing: "0.2em" }}>AURUM</div>;
if (!user) return <div style={s.app}><AuthView onAuth={() => {}} /></div>;

return (
<div style={s.app}>
<div style={s.nav}>
<div><span style={s.logo}>AURUM</span><span style={s.logoSub}>COMUNIDAD DE CONOCIMIENTO</span></div>
<div style={{ display: "flex", gap: 18 }}>
<button style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_DIM, fontSize: 18 }}>🔔</button>
</div>
</div>
<div style={{ overflowY: "auto", height: "calc(100vh - 58px)" }}>
{active === "feed" && <FeedView user={user} />}
{active === "lessons" && <LessonsView />}
{active === "ai" && <AIView />}
{active === "profile" && <ProfileView user={user} onLogout={logout} />}
</div>
<div style={s.tabs}>
{TABS.map(t => (
<button key={t.id} style={{ ...s.tab, ...(active === t.id ? s.tabActive : {}) }} onClick={() => setActive(t.id)}>
<span style={s.tabIcon}>{t.icon}</span>{t.label}
</button>
))}
  </div>
</div>
);
}
