import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, MapPin, Star, Heart, Shield, Wifi, Wind, ChefHat, Car,
  Waves, Dumbbell, Trees, CheckCircle, X, Home, User, BookOpen,
  LogOut, ArrowRight, Phone, Mail, Lock, Eye, EyeOff, Bed, Bath,
  Users, Calendar, CreditCard, ChevronLeft, ChevronRight, Bell,
  Trophy, SlidersHorizontal, Plus, Minus, Clock, Globe, Building,
  AlertCircle, Check, Trash2, Camera, Upload, FileText, TrendingUp,
  LayoutDashboard, Settings, ChevronDown, Menu, Zap, Award, Image,
  MessageSquare, DollarSign, BarChart3, Send, RefreshCw,
  LogIn, UserPlus, Activity
} from "lucide-react";

// ─── DESIGN TOKENS ───────────────────────────────────────
const C = {
  primary: "#C4622D",
  primaryDark: "#9B4A20",
  primaryLight: "#E8A87C",
  primaryFaint: "rgba(196,98,45,0.08)",
  dark: "#1C1209",
  darkMid: "#3D2210",
  brown: "#5C3317",
  brownMid: "#7A4A2E",
  muted: "#9B8070",
  border: "#EDE5DC",
  bg: "#FBF6F1",
  white: "#FFFFFF",
  success: "#16A34A",
  error: "#DC2626",
  warning: "#D97706",
  info: "#2563EB",
};

// ─── TANZANIAN UNSPLASH IMAGES ────────────────────────────
const PROPS = [
  {
    id: 1, title: "Masaki Ocean Penthouse", location: "Masaki, Dar es Salaam",
    neighborhood: "Masaki",
    price: 185000, type: "Entire Home", rating: 4.9, reviewCount: 38,
    verified: true, available: true,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    ],
    amenities: ["WiFi","AC","Pool","Parking","Kitchen","Security"],
    beds: 3, baths: 2, maxGuests: 6,
    description: "Breathtaking penthouse with panoramic Indian Ocean views. Steps from Masaki's best restaurants, embassies and the waterfront. Rooftop terrace perfect for sunset evenings.",
    hostId: 2, hostName: "Rehema J.",
  },
  {
    id: 2, title: "Kariakoo Heritage Room", location: "Kariakoo, Dar es Salaam",
    neighborhood: "Kariakoo",
    price: 42000, type: "Private Room", rating: 4.6, reviewCount: 52,
    verified: true, available: true,
    image: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    ],
    amenities: ["WiFi","AC","Security"],
    beds: 1, baths: 1, maxGuests: 1,
    description: "Clean, centrally-located private room in the heart of Kariakoo. Surrounded by vibrant markets, street food, daladala stands. Ideal for business travelers on a budget.",
    hostId: 2, hostName: "Juma K.",
  },
  {
    id: 3, title: "Mikocheni Garden Villa", location: "Mikocheni, Dar es Salaam",
    neighborhood: "Mikocheni",
    price: 110000, type: "Entire Home", rating: 4.8, reviewCount: 21,
    verified: true, available: true,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    amenities: ["Garden","WiFi","Parking","Kitchen","Washer","AC"],
    beds: 2, baths: 2, maxGuests: 4,
    description: "Tranquil villa with lush private garden and open-plan living. Quiet compound with 24hr security. Popular with families visiting Muhimbili Hospital and Aga Khan.",
    hostId: 2, hostName: "Fatuma N.",
  },
  {
    id: 4, title: "Oyster Bay Beachfront", location: "Oyster Bay, Dar es Salaam",
    neighborhood: "Oyster Bay",
    price: 295000, type: "Entire Home", rating: 5.0, reviewCount: 14,
    verified: true, available: true,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    ],
    amenities: ["Beach Access","Pool","WiFi","AC","Kitchen","Parking","Security","Gym"],
    beds: 4, baths: 3, maxGuests: 8,
    description: "Spectacular beachfront estate with private pool and direct Indian Ocean access. Sunrise views over the water. The ultimate luxury stay in Dar es Salaam.",
    hostId: 2, hostName: "Rehema J.",
  },
  {
    id: 5, title: "Sinza Executive Studio", location: "Sinza, Dar es Salaam",
    neighborhood: "Sinza",
    price: 72000, type: "Entire Home", rating: 4.7, reviewCount: 29,
    verified: true, available: true,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    amenities: ["WiFi","AC","Kitchen","Security"],
    beds: 1, baths: 1, maxGuests: 2,
    description: "Modern fully-furnished studio in quiet Sinza residential area. High-speed WiFi, 24hr security, easy access to main road and Mwenge market.",
    hostId: 2, hostName: "Mohamed A.",
  },
  {
    id: 6, title: "Upanga City Loft", location: "Upanga, Dar es Salaam",
    neighborhood: "Upanga",
    price: 65000, type: "Entire Home", rating: 4.5, reviewCount: 33,
    verified: true, available: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    ],
    amenities: ["WiFi","Kitchen","AC","City View"],
    beds: 1, baths: 1, maxGuests: 2,
    description: "Stylish loft with panoramic Dar es Salaam skyline views. Walking distance to the city business district, TANESCO offices and ferries to Zanzibar.",
    hostId: 2, hostName: "Grace M.",
  },
];

const REVIEWS_DB = {
  1: [{ id:1, name:"Amina M.", avatar:"AM", rating:5, comment:"Penthouse ya ndoto! Maoni ya bahari asubuhi yalikuwa ya kipekee kabisa. Nitaleta familia yangu hapa tena.", date:"Jun 2026" }],
  2: [{ id:2, name:"Peter O.", avatar:"PO", rating:5, comment:"Value ya pesa nzuri sana. Mahali pazuri pa kusimama ukifanya biashara Kariakoo.", date:"May 2026" }],
  3: [{ id:3, name:"Fatuma N.", avatar:"FN", rating:5, comment:"Bustani nzuri sana. Watoto wangu walifurahia. Ulinzi wa saa 24 ulinifanya nikae salama.", date:"Jun 2026" }],
  4: [{ id:4, name:"Sarah T.", avatar:"ST", rating:5, comment:"Absolutely unreal. Woke up to ocean waves. Nothing compares to this in all of Dar!", date:"Apr 2026" }],
  5: [{ id:5, name:"David M.", avatar:"DM", rating:5, comment:"Nadhifu sana na wififast. Perfect kwa remote work. Nitarudi tena bila shaka.", date:"Jun 2026" }],
  6: [{ id:6, name:"James K.", avatar:"JK", rating:4, comment:"Great location for business. Close to everything. Clean and well managed.", date:"May 2026" }],
};

const WC_BADGE = () => (
  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 10px", background:"linear-gradient(90deg,#1a1a2e,#16213e)", borderRadius:20, flexShrink:0 }}>
    <span style={{ fontSize:"13px" }}>⚽</span>
    <span style={{ fontSize:".62rem", fontWeight:800, color:"white", letterSpacing:.8, whiteSpace:"nowrap" }}>FIFA WC 2026</span>
  </div>
);

const LANDLORD_STATUS_META = {
  active: { label:"Active Host", bg:"#DCFCE7", color:C.success },
  approved: { label:"Approved", bg:"#DCFCE7", color:C.success },
  pending: { label:"Pending Verification", bg:"#FEF3C7", color:C.warning },
  rejected: { label:"Rejected", bg:"#FEE2E2", color:C.error },
};

const PAYMENTS = ["AzamPesa","M-Pesa","Tigo Pesa","Airtel Money","HaloPesa","Kadi (Visa/Mastercard)"];
const isCardMethod = m => m === "Kadi (Visa/Mastercard)";
const fmtCardNum = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})(?=.)/g,'$1 ');
const fmtExpiry  = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>2?d.slice(0,2)+'/'+d.slice(2):d; };
const cardBrand  = n => { const d=n.replace(/\s/g,'')[0]; return d==='4'?'VISA':d==='5'?'MC':d==='3'?'AMEX':'CARD'; };
const AREAS = ["All Areas","Masaki","Kariakoo","Mikocheni","Oyster Bay","Sinza","Upanga","Mbezi Beach","Tegeta","Kijitonyama"];
const AMENITY_ICONS = { WiFi:<Wifi size={13}/>, AC:<Wind size={13}/>, Kitchen:<ChefHat size={13}/>, Pool:<Waves size={13}/>, Gym:<Dumbbell size={13}/>, Parking:<Car size={13}/>, Garden:<Trees size={13}/>, Security:<Shield size={13}/>, "Beach Access":<Waves size={13}/>, "City View":<Building size={13}/>, Washer:<Zap size={13}/>, Restaurant:<ChefHat size={13}/>};
const CATEGORIES = [
  { id:"all", label:"All Stays", icon:<Globe size={18}/>, test:()=>true },
  { id:"entire", label:"Entire Homes", icon:<Home size={18}/>, test:p=>p.type==="Entire Home" },
  { id:"room", label:"Private Rooms", icon:<Bed size={18}/>, test:p=>p.type==="Private Room" },
  { id:"beach", label:"Beachfront", icon:<Waves size={18}/>, test:p=>p.amenities.includes("Beach Access") },
  { id:"top", label:"Top Rated", icon:<Star size={18}/>, test:p=>p.rating>=4.8 },
  { id:"budget", label:"Budget Friendly", icon:<DollarSign size={18}/>, test:p=>p.price<=75000 },
];
const fmt = n => new Intl.NumberFormat("sw-TZ").format(n);
const todayStr = new Date().toISOString().split("T")[0];
const tmrStr = new Date(Date.now()+86400000).toISOString().split("T")[0];

// ─── ANIMATION HOOK ───────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, dir = "up", className }) {
  const [ref, inView] = useInView();
  const transforms = { up:"translateY(32px)", down:"translateY(-32px)", left:"translateX(-32px)", right:"translateX(32px)", none:"none" };
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : transforms[dir],
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── TOAST HOOK ───────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return [toasts, show];
}

// ─── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([1, 4]);
  const [bookings, setBookings] = useState([{
    id: 1, propertyId: 1, checkIn:"2026-06-25", checkOut:"2026-06-28",
    guests:2, nights:3, total:555000, serviceFee:27750,
    status:"confirmed", paymentMethod:"M-Pesa",
    propertyTitle:"Masaki Ocean Penthouse", propertyImage:PROPS[0].image,
  }]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, showToast] = useToast();

  // Landlord submission requests (in-memory "database")
  const [propertyRequests, setPropertyRequests] = useState([
    { id: 1, title:"Msasani Studio", location:"Msasani, Dar es Salaam", hostName:"Ahmed S.", phone:"0712345678", email:"ahmed@gmail.com", status:"pending", date:"2026-06-10", price:80000, type:"Entire Home", description:"Modern studio near Msasani beach.", beds:1, baths:1, maxGuests:2, amenities:["WiFi","AC","Parking"], images:[] },
  ]);
  const [reviews, setReviews] = useState(REVIEWS_DB);

  const toggleSaved = id => {
    setSaved(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
    showToast(saved.includes(id) ? "Removed from wishlist" : "Saved to wishlist!");
  };

  const nav = [
    { label:"Home", p:"home", icon:<Home size={15}/> },
    { label:"Properties", p:"properties", icon:<Building size={15}/> },
    { label:"Saved", p:"saved", icon:<Heart size={15}/> },
    { label:"Bookings", p:"bookings", icon:<BookOpen size={15}/> },
    ...(user?.role==="landlord" ? [{ label:"Dashboard", p:"dashboard", icon:<LayoutDashboard size={15}/> }] : []),
    ...(user?.role==="admin" ? [{ label:"Admin Panel", p:"admin", icon:<BarChart3 size={15}/> }] : []),
  ];

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg, minHeight:"100vh", color:C.dark }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{overflow-x:hidden}
        input,select,textarea,button{font-family:inherit}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .skeleton{background:linear-gradient(90deg,#f0e8e0 25%,#e8ddd4 50%,#f0e8e0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .hover-lift{transition:transform .25s,box-shadow .25s}
        .hover-lift:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(44,24,16,.15)}
        .btn-press:active{transform:scale(.97)}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#f5ede6}
        ::-webkit-scrollbar-thumb{background:#C4622D;border-radius:3px}
        @media(max-width:768px){
          .desktop-nav{display:none!important}
          .mobile-menu-btn{display:flex!important}
          .hero-grid{grid-template-columns:1fr!important}
          .props-grid{grid-template-columns:1fr!important}
          .escrow-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
          .booking-grid{grid-template-columns:1fr!important;gap:24px!important}
          .compare-table{font-size:.75rem;width:max-content!important;min-width:100%}
          .compare-table td,.compare-table th{padding:10px 10px!important}
          .compare-hint{display:block!important}
          .steps-grid{grid-template-columns:1fr 1fr!important}
          .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
          .stats-grid>div{padding:16px 8px!important}
          .members-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        }
        @media(max-width:480px){
          .steps-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important}
          .payment-methods-row{flex-direction:column!important;align-items:stretch!important}
          .stats-num{font-size:1.5rem!important}
          .members-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(251,246,241,.96)", backdropFilter:"blur(14px)", borderBottom:`1px solid ${C.border}`, height:62, display:"flex", alignItems:"center", padding:"0 4%", gap:16 }}>
        <button onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:36, height:36, background:C.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Home size={18} color="white"/>
          </div>
          <span style={{ fontFamily:"Georgia,serif", fontSize:"1.25rem", fontWeight:900, color:C.primary, letterSpacing:"-0.5px" }}>StayLocal</span>
        </button>

        <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:2, flex:1, justifyContent:"center" }}>
          {nav.map(n => (
            <button key={n.p} onClick={()=>setPage(n.p)} className="btn-press" style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", border:"none", borderRadius:8, background:page===n.p?C.primary:"transparent", color:page===n.p?"white":C.brown, fontWeight:500, fontSize:".83rem", cursor:"pointer", transition:"all .2s" }}>
              {n.icon}{n.label}
            </button>
          ))}
        </div>

        <WC_BADGE/>

        <div style={{ marginLeft:"auto", display:"flex", gap:10, alignItems:"center" }}>
          {user ? (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:user.role==="landlord"?"#2563EB":user.role==="admin"?"#16A34A":C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:".8rem", flexShrink:0 }}>
                  {user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div className="desktop-nav" style={{ display:"block" }}>
                  <div style={{ fontSize:".8rem", fontWeight:600, color:C.dark, lineHeight:1 }}>{user.name.split(" ")[0]}</div>
                  <div style={{ fontSize:".68rem", color:C.muted, textTransform:"capitalize" }}>{user.role}</div>
                </div>
              </div>
              <button onClick={()=>{setUser(null);setPage("home");showToast("Logged out");}} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:`1.5px solid ${C.border}`, borderRadius:7, padding:"5px 10px", cursor:"pointer", color:C.muted, fontSize:".78rem" }}>
                <LogOut size={13}/>
                <span className="desktop-nav">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={()=>{setAuthMode("login");setPage("auth");}} className="btn-press" style={{ padding:"7px 16px", background:"white", border:`1.5px solid ${C.border}`, borderRadius:8, fontWeight:600, fontSize:".83rem", cursor:"pointer", color:C.brown }}>Sign in</button>
              <button onClick={()=>{setAuthMode("register");setPage("auth");}} className="btn-press" style={{ padding:"7px 16px", background:C.primary, color:"white", border:"none", borderRadius:8, fontWeight:600, fontSize:".83rem", cursor:"pointer" }}>Sign up</button>
            </>
          )}
          <button className="mobile-menu-btn" onClick={()=>setMobileOpen(o=>!o)} style={{ display:"none", width:36, height:36, background:"none", border:`1.5px solid ${C.border}`, borderRadius:8, alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Menu size={17} color={C.brown}/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.5)" }} onClick={()=>setMobileOpen(false)}>
          <div style={{ position:"absolute", top:0, right:0, width:260, height:"100%", background:"white", padding:24, display:"flex", flexDirection:"column", gap:4 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:"1.1rem", fontWeight:900, color:C.primary }}>Menu</span>
              <button onClick={()=>setMobileOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={20} color={C.muted}/></button>
            </div>
            {nav.map(n => (
              <button key={n.p} onClick={()=>{setPage(n.p);setMobileOpen(false);}} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", border:"none", borderRadius:10, background:page===n.p?C.primaryFaint:"transparent", color:page===n.p?C.primary:C.brown, fontWeight:500, fontSize:".9rem", cursor:"pointer", textAlign:"left" }}>
                {n.icon}{n.label}
              </button>
            ))}
            <div style={{ height:1, background:C.border, margin:"8px 0" }}/>
            {user ? (
              <button onClick={()=>{setUser(null);setPage("home");setMobileOpen(false);showToast("Logged out");}} style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 14px", border:"none", borderRadius:10, background:"transparent", color:C.error, fontWeight:500, fontSize:".9rem", cursor:"pointer" }}>
                <LogOut size={15}/>Logout
              </button>
            ) : (
              <>
                <button onClick={()=>{setAuthMode("login");setPage("auth");setMobileOpen(false);}} style={{ padding:"11px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontWeight:600, cursor:"pointer", color:C.brown, background:"white" }}>Sign in</button>
                <button onClick={()=>{setAuthMode("register");setPage("auth");setMobileOpen(false);}} style={{ padding:"11px 14px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:600, cursor:"pointer", marginTop:4 }}>Sign up</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* PAGES */}
      <div style={{ animation:"slideUp .4s ease" }} key={page}>
        {page==="home" && <HomePage props={PROPS} saved={saved} toggleSaved={toggleSaved} openProp={p=>{setSelectedProp(p);setPage("property");}} user={user} showToast={showToast} setPage={setPage} setAuthMode={setAuthMode}/>}
        {page==="property" && selectedProp && <PropertyPage prop={selectedProp} saved={saved} toggleSaved={toggleSaved} user={user} bookings={bookings} setBookings={setBookings} showToast={showToast} setPage={setPage} setAuthMode={setAuthMode} goBack={()=>setPage("home")} reviews={reviews[selectedProp.id]||[]} setReviews={setReviews}/>}
        {page==="saved" && <SavedPage props={PROPS} saved={saved} toggleSaved={toggleSaved} openProp={p=>{setSelectedProp(p);setPage("property");}}/>}
        {page==="bookings" && <BookingsPage bookings={bookings} setBookings={setBookings} showToast={showToast} user={user} setPage={setPage} setAuthMode={setAuthMode}/>}
        {page==="auth" && <AuthPage setUser={setUser} setPage={setPage} mode={authMode} setMode={setAuthMode} showToast={showToast}/>}
        {page==="dashboard" && <LandlordDashboard user={user} props={PROPS.filter(p=>p.hostId===2)} bookings={bookings} showToast={showToast} setPage={setPage}/>}
        {page==="list" && <ListPropertyPage user={user} setPage={setPage} showToast={showToast} setAuthMode={setAuthMode} propertyRequests={propertyRequests} setPropertyRequests={setPropertyRequests}/>}
        {page==="admin" && <AdminPage propertyRequests={propertyRequests} setPropertyRequests={setPropertyRequests} showToast={showToast} user={user} setPage={setPage}/>}
        {page==="properties" && <AllPropertiesPage props={PROPS} saved={saved} toggleSaved={toggleSaved} openProp={p=>{setSelectedProp(p);setPage("property");}} setPage={setPage}/>}
      </div>

      {/* TOASTS */}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, display:"flex", flexDirection:"column", gap:8, maxWidth:320 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background:t.type==="error"?C.error:t.type==="warning"?C.warning:C.success, color:"white", padding:"11px 18px", borderRadius:10, display:"flex", alignItems:"center", gap:8, boxShadow:"0 6px 24px rgba(0,0,0,.2)", fontSize:".85rem", fontWeight:500, animation:"slideUp .3s ease" }}>
            {t.type==="error"?<AlertCircle size={15}/>:<Check size={15}/>}{t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── HOME PAGE ────────────────────────────────────────────
function HomePage({ props, saved, toggleSaved, openProp, user, showToast, setPage, setAuthMode }) {
  const resultsRef = useRef(null);
  const [q, setQ] = useState("");
  const [area, setArea] = useState("All Areas");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("rating");
  const [checkin, setCheckin] = useState(tmrStr);
  const [checkout, setCheckout] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [category, setCategory] = useState("all");

  const activeCategory = CATEGORIES.find(c=>c.id===category) || CATEGORIES[0];

  let filtered = props.filter(p => {
    const qm = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase());
    const am = area === "All Areas" || p.neighborhood === area;
    const tm = type === "All" || p.type === type;
    const pm = p.price <= maxPrice;
    const cm = activeCategory.test(p);
    return qm && am && tm && pm && cm;
  });
  filtered = [...filtered].sort((a,b) =>
    sort==="price_asc"?a.price-b.price:sort==="price_desc"?b.price-a.price:b.rating-a.rating
  );

  return (
    <div>
      {/* HERO */}
      <section style={{ position:"relative", background:`linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 55%, ${C.primaryDark} 100%)`, minHeight:"88vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
        {/* background texture */}
        <div style={{ position:"absolute", inset:0, opacity:.035, backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C4622D'%3E%3Cpath d='M0 0h40v40H0zm40 40h40v40H40z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize:80, pointerEvents:"none" }}/>
        {/* glow orbs */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:C.primary, opacity:.07, top:-150, right:-100, filter:"blur(80px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"#4A90D9", opacity:.06, bottom:-100, left:-80, filter:"blur(60px)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 5%", width:"100%", display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:60, alignItems:"center" }} className="hero-grid">
          <div>
            {/* WC badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(196,98,45,.18)", border:`1px solid rgba(196,98,45,.35)`, borderRadius:20, padding:"6px 14px", marginBottom:24 }}>
              <Trophy size={13} color={C.primaryLight}/>
              <span style={{ color:C.primaryLight, fontSize:".75rem", fontWeight:600 }}>World Cup 2026 — Watch parties near every property</span>
            </div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2.6rem,5vw,4rem)", fontWeight:900, lineHeight:1.08, color:"white", marginBottom:20 }}>
              Tanzania's<br/><span style={{ color:C.primaryLight }}>Safest</span> Way<br/>to Book a Stay.
            </h1>
            <p style={{ color:"rgba(255,255,255,.68)", fontSize:"1rem", lineHeight:1.75, marginBottom:32, maxWidth:440 }}>
              Every property physically verified by our ground team in Dar es Salaam. Pay with M-Pesa, Tigo, Airtel or Halo — zero bank card needed. Escrow protection guaranteed.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {[["shield","100% Verified"],["credit-card","Mobile Money"],["lock","Escrow Protected"],["award","No Fake Listings"]].map(([_,l])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:20, background:"rgba(255,255,255,.09)", border:"1px solid rgba(255,255,255,.16)", color:"rgba(255,255,255,.85)", fontSize:".75rem" }}>
                  <CheckCircle size={12} color={C.primaryLight}/>{l}
                </div>
              ))}
            </div>
          </div>

          {/* SEARCH CARD */}
          <div style={{ background:"white", borderRadius:20, padding:28, boxShadow:"0 28px 70px rgba(0,0,0,.32)" }}>
            <p style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.muted, marginBottom:18 }}>Find Your Perfect Stay in Dar es Salaam</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ position:"relative" }}>
                <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search location or property…" style={{ width:"100%", padding:"11px 12px 11px 36px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:".88rem", outline:"none", background:C.bg }}/>
              </div>
              <select value={area} onChange={e=>setArea(e.target.value)} style={{ padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:".88rem", background:C.bg, outline:"none", color:C.dark }}>
                {AREAS.map(a=><option key={a}>{a}</option>)}
              </select>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ display:"block", fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Check-in</label>
                  <input type="date" value={checkin} min={todayStr} onChange={e=>setCheckin(e.target.value)} style={{ width:"100%", padding:"9px 10px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:".83rem", outline:"none", background:C.bg }}/>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Check-out</label>
                  <input type="date" value={checkout} min={checkin||todayStr} onChange={e=>setCheckout(e.target.value)} style={{ width:"100%", padding:"9px 10px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:".83rem", outline:"none", background:C.bg }}/>
                </div>
              </div>
              <button onClick={()=>setShowFilters(o=>!o)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:C.primary, fontSize:".8rem", fontWeight:600, padding:"4px 0" }}>
                <SlidersHorizontal size={14}/> {showFilters?"Hide":"More"} filters
              </button>
              {showFilters && (
                <div style={{ background:C.bg, borderRadius:10, padding:14, display:"flex", flexDirection:"column", gap:10 }}>
                  <div>
                    <label style={{ fontSize:".72rem", fontWeight:700, color:C.muted, textTransform:"uppercase" }}>Property Type</label>
                    <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                      {["All","Entire Home","Private Room"].map(t=>(
                        <button key={t} onClick={()=>setType(t)} style={{ padding:"5px 13px", borderRadius:16, border:`1.5px solid ${type===t?C.primary:C.border}`, background:type===t?C.primary:"white", color:type===t?"white":C.brown, fontSize:".78rem", cursor:"pointer", fontWeight:type===t?600:400 }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:".72rem", fontWeight:700, color:C.muted, textTransform:"uppercase" }}>Max Price: TZS {fmt(maxPrice)}/night</label>
                    <input type="range" min={40000} max={300000} step={5000} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} style={{ width:"100%", marginTop:6, accentColor:C.primary }}/>
                  </div>
                </div>
              )}
              <button onClick={()=>resultsRef.current?.scrollIntoView({ behavior:"smooth" })} className="btn-press" style={{ padding:"13px", background:C.primary, color:"white", border:"none", borderRadius:11, fontWeight:700, fontSize:".93rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"background .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
                onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                <Search size={16}/> Search {filtered.length} Available Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT STRIP */}
      <div style={{ background:C.primary, padding:"11px 4%", display:"flex", alignItems:"center", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
        <span style={{ color:"rgba(255,255,255,.9)", fontSize:".8rem", display:"flex", alignItems:"center", gap:5 }}><CreditCard size={14}/> Pay securely with:</span>
        {["M-Pesa","Airtel Money","Tigo Pesa","HaloPesa"].map(m=>(
          <span key={m} style={{ background:"rgba(255,255,255,.17)", border:"1px solid rgba(255,255,255,.28)", color:"white", padding:"3px 11px", borderRadius:12, fontSize:".72rem", fontWeight:700 }}>{m}</span>
        ))}
        <span style={{ color:"rgba(255,255,255,.75)", fontSize:".75rem" }}>· No bank card required</span>
      </div>

      {/* STATS BAR */}
      <FadeIn>
        <div className="stats-grid" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 4%", display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:0, borderBottom:`1px solid ${C.border}` }}>
          {[["500+","Verified Properties"],["12,000+","Happy Guests"],["4.9","Average Rating"],["100%","Escrow Protected"]].map(([n,l],i)=>(
            <div key={i} style={{ textAlign:"center", padding:"20px 16px", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
              <div className="stats-num" style={{ fontFamily:"Georgia,serif", fontSize:"2rem", fontWeight:900, color:C.primary, lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:".78rem", color:C.muted, marginTop:5 }}>{l}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* PROPERTIES */}
      <div ref={resultsRef} style={{ maxWidth:1200, margin:"0 auto", padding:"60px 4%" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
          <FadeIn>
            <div>
              <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primary, display:"block", marginBottom:6 }}>Verified Listings</span>
              <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,2.5vw,2.1rem)", fontWeight:700, color:C.dark }}>
                {q?`Results for "${q}"`:"Featured Properties"}
                <span style={{ color:C.muted, fontFamily:"Inter,sans-serif", fontSize:".95rem", fontWeight:400, marginLeft:8 }}>({filtered.length})</span>
              </h2>
            </div>
          </FadeIn>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:"8px 14px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:".83rem", background:"white", outline:"none", color:C.dark, cursor:"pointer" }}>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* CATEGORY BAR */}
        <div className="category-bar" style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:10, marginBottom:24, WebkitOverflowScrolling:"touch" }}>
          {CATEGORIES.map(cat=>(
            <button key={cat.id} onClick={()=>setCategory(cat.id)} className="btn-press" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 22px", borderRadius:14, border:`1.5px solid ${category===cat.id?C.primary:C.border}`, background:category===cat.id?C.primaryFaint:"white", color:category===cat.id?C.primary:C.brown, cursor:"pointer", fontSize:".78rem", fontWeight:category===cat.id?700:500, whiteSpace:"nowrap", flexShrink:0, transition:"all .2s" }}>
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
            <Search size={44} style={{ marginBottom:14, opacity:.3 }}/>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"1.2rem", color:C.brown, marginBottom:8 }}>No properties found</p>
            <button onClick={()=>{setQ("");setArea("All Areas");setType("All");setMaxPrice(300000);setCategory("all");}} style={{ marginTop:8, padding:"9px 20px", background:C.primary, color:"white", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600 }}>Clear filters</button>
          </div>
        ) : (
          <>
            <div className="props-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:26 }}>
              {filtered.slice(0,6).map((p,i) => <FadeIn key={p.id} delay={i*0.07}><PropCard prop={p} saved={saved} toggleSaved={toggleSaved} onClick={()=>openProp(p)}/></FadeIn>)}
            </div>
            {filtered.length > 6 && (
              <FadeIn>
                <div style={{ textAlign:"center", marginTop:44 }}>
                  <p style={{ color:C.muted, fontSize:".88rem", marginBottom:14 }}>Showing 6 of <strong>{filtered.length}</strong> verified properties</p>
                  <button onClick={()=>setPage("properties")} className="btn-press" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 32px", background:C.primary, color:"white", border:"none", borderRadius:11, fontWeight:700, fontSize:".93rem", cursor:"pointer", boxShadow:`0 4px 16px ${C.primary}44` }}>
                    See All Properties <ArrowRight size={16}/>
                  </button>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>

      {/* MEMBERS ONLY */}
      <MembersSection user={user} setPage={setPage} setAuthMode={setAuthMode}/>

      {/* HOW IT WORKS */}
      <HowSection/>
      {/* ESCROW */}
      <EscrowSection/>
      {/* COMPARE */}
      <CompareSection/>
      {/* TESTIMONIALS */}
      <TestimonialsSection/>
      {/* LIST PROPERTY CTA */}
      <ListCTA setPage={setPage} user={user} setAuthMode={setAuthMode}/>
      {/* FOOTER */}
      <Footer setPage={setPage}/>
    </div>
  );
}

// ─── ALL PROPERTIES PAGE ─────────────────────────────────
function AllPropertiesPage({ props, saved, toggleSaved, openProp, setPage }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("rating");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [category, setCategory] = useState("all");

  const filtered = props
    .filter(p => {
      const cat = CATEGORIES.find(c => c.id === category);
      if (cat && !cat.test(p)) return false;
      if (type !== "All" && p.type !== type) return false;
      if (p.price > maxPrice) return false;
      if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.location.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    })
    .sort((a,b) => sort==="price_asc" ? a.price-b.price : sort==="price_desc" ? b.price-a.price : b.rating-a.rating);

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      {/* PAGE HEADER */}
      <div style={{ background:`linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 100%)`, padding:"44px 4% 36px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <button onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", borderRadius:8, padding:"6px 12px", color:"rgba(255,255,255,.8)", cursor:"pointer", fontSize:".8rem", marginBottom:20 }}>
            <ChevronLeft size={14}/> Back to Home
          </button>
          <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primaryLight, display:"block", marginBottom:8 }}>All Listings</span>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", color:"white", fontWeight:700, marginBottom:8 }}>
            Browse All Properties
          </h1>
          <p style={{ color:"rgba(255,255,255,.55)", fontSize:".9rem" }}>{props.length} verified properties in Dar es Salaam</p>

          {/* SEARCH BAR */}
          <div style={{ marginTop:24, position:"relative", maxWidth:560 }}>
            <Search size={16} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.4)" }}/>
            <input
              value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Search by name or location…"
              style={{ width:"100%", padding:"12px 16px 12px 42px", background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", borderRadius:11, color:"white", fontSize:".9rem", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 4%" }}>
        {/* FILTERS ROW */}
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
          {/* Category pills */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", flex:1, paddingBottom:2 }}>
            {CATEGORIES.map(cat=>(
              <button key={cat.id} onClick={()=>setCategory(cat.id)} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:20, border:`1.5px solid ${category===cat.id?C.primary:C.border}`, background:category===cat.id?C.primaryFaint:"white", color:category===cat.id?C.primary:C.brown, cursor:"pointer", fontSize:".78rem", fontWeight:category===cat.id?700:500, whiteSpace:"nowrap", flexShrink:0, transition:"all .15s" }}>
                {cat.icon}{cat.label}
              </button>
            ))}
          </div>
          {/* Sort + Type */}
          <div style={{ display:"flex", gap:8, flexShrink:0 }}>
            <select value={type} onChange={e=>setType(e.target.value)} style={{ padding:"8px 12px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:".8rem", background:"white", outline:"none", color:C.dark, cursor:"pointer" }}>
              <option value="All">All Types</option>
              <option value="Entire Home">Entire Home</option>
              <option value="Private Room">Private Room</option>
            </select>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:"8px 12px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:".8rem", background:"white", outline:"none", color:C.dark, cursor:"pointer" }}>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>
        </div>

        {/* RESULTS COUNT */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <p style={{ color:C.muted, fontSize:".83rem" }}>
            <strong style={{ color:C.dark }}>{filtered.length}</strong> properties found
          </p>
          <p style={{ fontSize:".75rem", color:C.muted }}>
            Max price: <strong>TZS {maxPrice.toLocaleString()}</strong>
            <input type="range" min={20000} max={300000} step={5000} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)}
              style={{ marginLeft:10, accentColor:C.primary, verticalAlign:"middle", width:80 }}/>
          </p>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
            <Search size={44} style={{ marginBottom:14, opacity:.3 }}/>
            <p style={{ fontFamily:"Georgia,serif", fontSize:"1.2rem", color:C.brown, marginBottom:12 }}>No properties match your filters</p>
            <button onClick={()=>{setQ("");setType("All");setMaxPrice(300000);setCategory("all");}} style={{ padding:"9px 20px", background:C.primary, color:"white", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600 }}>Clear Filters</button>
          </div>
        ) : (
          <div className="props-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
            {filtered.map((p,i)=>(
              <FadeIn key={p.id} delay={i*0.04}>
                <PropCard prop={p} saved={saved} toggleSaved={toggleSaved} onClick={()=>openProp(p)}/>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

// ─── PROPERTY CARD ────────────────────────────────────────
function PropCard({ prop, saved, toggleSaved, onClick }) {
  const [imgOk, setImgOk] = useState(false);
  const isSaved = saved.includes(prop.id);
  return (
    <div onClick={onClick} className="hover-lift" style={{ background:"white", borderRadius:16, overflow:"hidden", boxShadow:"0 3px 16px rgba(44,24,16,.08)", cursor:"pointer" }}>
      <div style={{ height:208, position:"relative", overflow:"hidden", background:C.bg }}>
        {!imgOk && <div className="skeleton" style={{ position:"absolute", inset:0 }}/>}
        <img src={prop.image} alt={prop.title} onLoad={()=>setImgOk(true)} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:imgOk?1:0, transition:"opacity .4s, transform .4s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.currentTarget.style.transform=""}/>
        <span style={{ position:"absolute", top:11, left:11, background:"white", color:C.primary, fontSize:".68rem", fontWeight:700, padding:"3px 9px", borderRadius:20, textTransform:"uppercase", letterSpacing:.4 }}>{prop.type}</span>
        {prop.verified && <span style={{ position:"absolute", top:11, right:42, background:C.success, color:"white", fontSize:".67rem", fontWeight:600, padding:"3px 8px", borderRadius:20, display:"flex", alignItems:"center", gap:3 }}><CheckCircle size={9}/>Verified</span>}
        <button onClick={e=>{e.stopPropagation();toggleSaved(prop.id);}} className="btn-press" style={{ position:"absolute", top:9, right:9, width:30, height:30, borderRadius:"50%", background:"white", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,.14)", transition:"transform .2s" }}>
          <Heart size={14} fill={isSaved?C.primary:"none"} color={isSaved?C.primary:C.muted}/>
        </button>
      </div>
      <div style={{ padding:"16px 16px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:3, color:C.muted, fontSize:".72rem", marginBottom:5 }}><MapPin size={11}/>{prop.location}</div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:".97rem", fontWeight:700, color:C.dark, marginBottom:9 }}>{prop.title}</h3>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
          {prop.amenities.slice(0,3).map(a=>(
            <span key={a} style={{ display:"flex", alignItems:"center", gap:3, fontSize:".68rem", color:C.brown, background:"#F5EDE5", padding:"2px 8px", borderRadius:10 }}>
              {AMENITY_ICONS[a]||<Check size={11}/>}{a}
            </span>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, fontSize:".72rem", color:C.muted, marginBottom:12 }}>
          <span style={{ display:"flex", alignItems:"center", gap:3 }}><Bed size={11}/>{prop.beds} bed</span>
          <span style={{ display:"flex", alignItems:"center", gap:3 }}><Bath size={11}/>{prop.baths} bath</span>
          <span style={{ display:"flex", alignItems:"center", gap:3 }}><Users size={11}/>{prop.maxGuests} guests</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:`1px solid ${C.border}`, paddingTop:11 }}>
          <div>
            <span style={{ fontSize:"1.05rem", fontWeight:700, color:C.primary }}>TZS {fmt(prop.price)}</span>
            <span style={{ fontSize:".72rem", color:C.muted }}>/night</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:".78rem", fontWeight:600, color:C.dark }}>
            <Star size={12} fill="#F59E0B" color="#F59E0B"/>{prop.rating} <span style={{ color:C.muted, fontWeight:400 }}>({prop.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROPERTY PAGE ────────────────────────────────────────
function PropertyPage({ prop, saved, toggleSaved, user, bookings, setBookings, showToast, setPage, setAuthMode, goBack, reviews, setReviews }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [step, setStep] = useState("details");
  const [checkIn, setCheckIn] = useState(tmrStr);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [payMethod, setPayMethod] = useState("AzamPesa");
  const [phone, setPhone] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [newRev, setNewRev] = useState({ rating:5, comment:"" });
  const isSaved = saved.includes(prop.id);
  const nights = checkIn&&checkOut ? Math.max(0,Math.ceil((new Date(checkOut)-new Date(checkIn))/86400000)) : 0;
  const fee = Math.round(prop.price*nights*0.05);
  const total = prop.price*nights+fee;

  const handleBook = () => {
    if (!user) { setAuthMode("login"); setPage("auth"); showToast("Sign in to book","error"); return; }
    if (nights<1) { showToast("Select valid dates","error"); return; }
    setStep("payment");
  };
  const handlePay = async () => {
    const isCard = isCardMethod(payMethod);
    if (isCard) {
      if (cardNum.replace(/\s/g,'').length < 16) { showToast("Weka namba sahihi ya kadi (digits 16)","error"); return; }
      if (!cardName.trim()) { showToast("Weka jina linaloonekana kwenye kadi","error"); return; }
      if (cardExpiry.length < 5) { showToast("Weka tarehe ya kuisha (MM/YY)","error"); return; }
      if (cardCVV.length < 3) { showToast("Weka CVV sahihi (digits 3)","error"); return; }
    } else {
      if (!phone||phone.length<9) { showToast("Weka namba sahihi ya simu (07XXXXXXXX)","error"); return; }
    }
    setLoading(true);
    try {
      const body = isCard
        ? { userId: user?.id, amount: total, provider: "CARD", cardNum: cardNum.replace(/\s/g,''), cardName, cardExpiry, cardBrand: cardBrand(cardNum) }
        : { userId: user?.id, amount: total, phone, provider: payMethod, email: user?.email, fullname: user?.name };
      const res = await fetch("/api/payment/initiate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setTxnId(data.transactionId||""); setStep("confirm"); }
      else showToast(data.error||"Tatizo la malipo, jaribu tena","error");
    } catch { showToast("Tatizo la network, angalia internet yako","error"); }
    setLoading(false);
  };
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const cRes = await fetch("/api/payment/confirm", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ transactionId: txnId }),
      });
      const cData = await cRes.json();
      if (!cData.success) { showToast(cData.message||"Malipo bado hayajakamilika, jaribu tena","error"); setLoading(false); return; }
      if (cData.status === "pending") { showToast(cData.message||"Malipo bado hayajakamilika kwenye simu yako","error"); setLoading(false); return; }

      const bRes = await fetch("/api/bookings", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId: user?.id, propertyId: prop.id, checkIn, checkOut, guests, paymentMethod: payMethod }),
      });
      const bData = await bRes.json();
      if (bData.success) {
        setBookings(p=>[...p, bData.booking]);
        setStep("success");
        showToast("Booking imethibitishwa! Asante kwa kutumia StayLocal!");
      } else showToast("Tatizo la booking, wasiliana na support","error");
    } catch (err) { console.error("[handleConfirm]", err); showToast("Tatizo: "+err.message,"error"); }
    setLoading(false);
  };
  const submitReview = () => {
    if (!user) { showToast("Sign in to review","error"); return; }
    if (!newRev.comment.trim()) { showToast("Write a comment","error"); return; }
    const r = { id:Date.now(), name:user.name, avatar:user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(), rating:newRev.rating, comment:newRev.comment, date:"Jun 2026" };
    setReviews(p=>({...p,[prop.id]:[r,...(p[prop.id]||[])]}));
    setNewRev({rating:5,comment:""}); showToast("Review submitted!");
  };

  const imgs = prop.images||[prop.image];

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 4%" }}>
      <button onClick={goBack} style={{ display:"flex", alignItems:"center", gap:5, background:"none", border:"none", cursor:"pointer", color:C.primary, fontWeight:600, fontSize:".88rem", marginBottom:24 }}>
        <ChevronLeft size={17}/>Back to listings
      </button>

      {step==="success" ? (
        <div style={{ textAlign:"center", padding:"80px 20px", background:"white", borderRadius:20, boxShadow:`0 4px 20px rgba(44,24,16,.07)` }}>
          <div style={{ width:76, height:76, background:"#DCFCE7", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
            <CheckCircle size={38} color={C.success}/>
          </div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"2rem", color:C.dark, marginBottom:10 }}>Booking Confirmed!</h2>
          <p style={{ color:C.muted, marginBottom:6 }}>Your <strong style={{color:C.primary}}>TZS {fmt(total)}</strong> is held in StayLocal Escrow.</p>
          <p style={{ color:C.muted, fontSize:".85rem", marginBottom:32 }}>Funds released to host 24hrs after check-in. You are protected.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>setPage("bookings")} className="btn-press" style={{ padding:"12px 28px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>View My Bookings</button>
            <button onClick={goBack} style={{ padding:"12px 28px", background:"white", color:C.primary, border:`1.5px solid ${C.primary}`, borderRadius:10, fontWeight:600, cursor:"pointer" }}>Browse More</button>
          </div>
        </div>
      ) : (
        <div className="booking-grid" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:36, alignItems:"start" }}>
          {/* LEFT */}
          <div>
            {/* IMAGE GALLERY */}
            <div style={{ position:"relative", borderRadius:16, overflow:"hidden", marginBottom:24, height:340, background:C.bg }}>
              <img src={imgs[imgIdx]} alt={prop.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"opacity .3s" }}/>
              {imgs.length>1 && (
                <>
                  <button onClick={()=>setImgIdx(i=>(i-1+imgs.length)%imgs.length)} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={16}/></button>
                  <button onClick={()=>setImgIdx(i=>(i+1)%imgs.length)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={16}/></button>
                  <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5 }}>
                    {imgs.map((_,i)=><div key={i} style={{ width:i===imgIdx?20:7, height:7, borderRadius:4, background:i===imgIdx?"white":"rgba(255,255,255,.5)", transition:"width .2s" }}/>)}
                  </div>
                </>
              )}
              <button onClick={()=>toggleSaved(prop.id)} className="btn-press" style={{ position:"absolute", top:12, right:12, width:36, height:36, borderRadius:"50%", background:"white", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,.15)" }}>
                <Heart size={16} fill={isSaved?C.primary:"none"} color={isSaved?C.primary:C.muted}/>
              </button>
              {prop.verified && <span style={{ position:"absolute", top:12, left:12, background:C.success, color:"white", fontSize:".7rem", fontWeight:600, padding:"5px 11px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}><CheckCircle size={10}/>Verified Property</span>}
            </div>

            <h1 style={{ fontFamily:"Georgia,serif", fontSize:"1.75rem", fontWeight:700, color:C.dark, marginBottom:8 }}>{prop.title}</h1>
            <div style={{ display:"flex", flexWrap:"wrap", gap:14, alignItems:"center", marginBottom:18 }}>
              <span style={{ display:"flex", alignItems:"center", gap:4, color:C.muted, fontSize:".85rem" }}><MapPin size={13}/>{prop.location}</span>
              <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:".85rem", fontWeight:600 }}><Star size={13} fill="#F59E0B" color="#F59E0B"/>{prop.rating} · {prop.reviewCount} reviews</span>
              <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:".83rem", color:C.muted }}><Bed size={13}/>{prop.beds} bed · <Bath size={13}/>{prop.baths} bath · <Users size={13}/>up to {prop.maxGuests}</span>
            </div>
            <p style={{ color:C.brown, lineHeight:1.75, marginBottom:26, fontSize:".93rem" }}>{prop.description}</p>

            <div style={{ marginBottom:28 }}>
              <h3 style={{ fontWeight:700, color:C.dark, marginBottom:13, fontSize:".95rem" }}>Amenities</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                {prop.amenities.map(a=>(
                  <span key={a} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#F5EDE5", borderRadius:10, fontSize:".8rem", color:C.brown, fontWeight:500 }}>
                    {AMENITY_ICONS[a]||<Check size={13}/>}{a}
                  </span>
                ))}
              </div>
            </div>

            {/* REVIEWS */}
            <div>
              <h3 style={{ fontWeight:700, color:C.dark, marginBottom:14, fontSize:".95rem" }}>Reviews <span style={{ color:C.muted, fontWeight:400 }}>({reviews.length})</span></h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:22 }}>
                {reviews.map(r=>(
                  <div key={r.id} style={{ background:"#F5EDE5", borderRadius:12, padding:15 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:7 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:C.primary, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".75rem", flexShrink:0 }}>{r.avatar}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:".85rem", color:C.dark }}>{r.name}</div>
                        <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(s=><Star key={s} size={10} fill={s<=r.rating?"#F59E0B":"none"} color={s<=r.rating?"#F59E0B":"#ddd"}/>)}</div>
                      </div>
                      <span style={{ marginLeft:"auto", fontSize:".72rem", color:C.muted }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize:".83rem", color:C.brown, lineHeight:1.6, margin:0 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
              {/* ADD REVIEW */}
              <div style={{ background:"white", border:`1.5px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <h4 style={{ fontWeight:700, color:C.dark, marginBottom:12, fontSize:".88rem" }}>Leave a Review</h4>
                <div style={{ display:"flex", gap:3, marginBottom:11 }}>
                  {[1,2,3,4,5].map(s=>(
                    <button key={s} onClick={()=>setNewRev(p=>({...p,rating:s}))} style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
                      <Star size={22} fill={s<=newRev.rating?"#F59E0B":"none"} color={s<=newRev.rating?"#F59E0B":"#ddd"}/>
                    </button>
                  ))}
                </div>
                <textarea value={newRev.comment} onChange={e=>setNewRev(p=>({...p,comment:e.target.value}))} placeholder="Share your experience…" rows={3} style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:".85rem", resize:"vertical", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                <button onClick={submitReview} className="btn-press" style={{ marginTop:9, padding:"9px 20px", background:C.primary, color:"white", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer", fontSize:".82rem" }}>Submit Review</button>
              </div>
            </div>
          </div>

          {/* BOOKING WIDGET */}
          <div style={{ position:"sticky", top:110 }}>
            {step==="details" && (
              <div style={{ background:"white", borderRadius:20, padding:26, boxShadow:"0 8px 32px rgba(44,24,16,.1)" }}>
                <div style={{ marginBottom:20 }}>
                  <span style={{ fontFamily:"Georgia,serif", fontSize:"1.7rem", fontWeight:900, color:C.primary }}>TZS {fmt(prop.price)}</span>
                  <span style={{ color:C.muted, fontSize:".83rem" }}> / night</span>
                </div>
                <div style={{ border:`1.5px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:12 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:`1.5px solid ${C.border}` }}>
                    <div style={{ padding:"11px 13px", borderRight:`1px solid ${C.border}` }}>
                      <label style={{ display:"block", fontSize:".62rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Check-in</label>
                      <input type="date" value={checkIn} min={todayStr} onChange={e=>setCheckIn(e.target.value)} style={{ border:"none", outline:"none", fontSize:".83rem", background:"transparent", color:C.dark, width:"100%", fontFamily:"inherit" }}/>
                    </div>
                    <div style={{ padding:"11px 13px" }}>
                      <label style={{ display:"block", fontSize:".62rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Check-out</label>
                      <input type="date" value={checkOut} min={checkIn||todayStr} onChange={e=>setCheckOut(e.target.value)} style={{ border:"none", outline:"none", fontSize:".83rem", background:"transparent", color:C.dark, width:"100%", fontFamily:"inherit" }}/>
                    </div>
                  </div>
                  <div style={{ padding:"11px 13px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontSize:".62rem", fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:2 }}>Guests</div>
                      <div style={{ fontSize:".85rem", color:C.dark }}>{guests} guest{guests>1?"s":""}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <button onClick={()=>setGuests(g=>Math.max(1,g-1))} disabled={guests<=1} style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"white", cursor:guests>1?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", opacity:guests<=1?.4:1 }}><Minus size={12}/></button>
                      <span style={{ fontWeight:700, minWidth:14, textAlign:"center", fontSize:".9rem" }}>{guests}</span>
                      <button onClick={()=>setGuests(g=>Math.min(prop.maxGuests,g+1))} disabled={guests>=prop.maxGuests} style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"white", cursor:guests<prop.maxGuests?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", opacity:guests>=prop.maxGuests?.4:1 }}><Plus size={12}/></button>
                    </div>
                  </div>
                </div>
                <button onClick={handleBook} className="btn-press" style={{ width:"100%", padding:"13px", background:C.primary, color:"white", border:"none", borderRadius:11, fontWeight:700, fontSize:".95rem", cursor:"pointer", marginBottom:12 }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
                  onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                  Reserve Now
                </button>
                {nights>0 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[["TZS "+fmt(prop.price)+" × "+nights+" night"+(nights>1?"s":""),fmt(prop.price*nights)],["Service fee (5%)",fmt(fee)]].map(([l,v])=>(
                      <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:".83rem", color:C.brown }}><span>{l}</span><span>TZS {v}</span></div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:".95rem", color:C.dark, borderTop:`1.5px solid ${C.border}`, paddingTop:9, marginTop:3 }}>
                      <span>Total</span><span style={{color:C.primary}}>TZS {fmt(total)}</span>
                    </div>
                  </div>
                )}
                <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:5, color:C.muted, fontSize:".72rem", justifyContent:"center" }}>
                  <Shield size={12} color={C.success}/> Escrow protected — pay only confirmed after check-in
                </div>
              </div>
            )}

            {step==="payment" && (
              <div style={{ background:"white", borderRadius:20, padding:26, boxShadow:"0 8px 32px rgba(44,24,16,.1)" }}>
                <button onClick={()=>setStep("details")} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", color:C.primary, fontWeight:600, marginBottom:18, fontSize:".83rem" }}><ChevronLeft size={15}/>Back</button>
                <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.1rem", color:C.dark, marginBottom:18 }}>Choose Payment</h3>
                {/* PAYMENT METHOD PILLS */}
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:18 }}>
                  {/* Mobile money */}
                  <div style={{ fontSize:".65rem", fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginBottom:2 }}>Mobile Money</div>
                  {PAYMENTS.filter(m=>!isCardMethod(m)).map(m=>(
                    <label key={m} style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 13px", border:`2px solid ${payMethod===m?C.primary:C.border}`, borderRadius:10, cursor:"pointer", background:payMethod===m?C.primaryFaint:"white", transition:"all .15s" }}>
                      <input type="radio" checked={payMethod===m} onChange={()=>setPayMethod(m)} style={{ accentColor:C.primary }}/>
                      <Phone size={14} color={payMethod===m?C.primary:C.muted}/>
                      <span style={{ fontSize:".84rem", fontWeight:payMethod===m?700:400, color:payMethod===m?C.primary:C.brown }}>{m}</span>
                    </label>
                  ))}
                  {/* Card */}
                  <div style={{ fontSize:".65rem", fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:.8, margin:"6px 0 2px" }}>Kadi ya Benki</div>
                  <label style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 13px", border:`2px solid ${isCardMethod(payMethod)?C.primary:C.border}`, borderRadius:10, cursor:"pointer", background:isCardMethod(payMethod)?C.primaryFaint:"white", transition:"all .15s" }}>
                    <input type="radio" checked={isCardMethod(payMethod)} onChange={()=>setPayMethod("Kadi (Visa/Mastercard)")} style={{ accentColor:C.primary }}/>
                    <CreditCard size={14} color={isCardMethod(payMethod)?C.primary:C.muted}/>
                    <span style={{ fontSize:".84rem", fontWeight:isCardMethod(payMethod)?700:400, color:isCardMethod(payMethod)?C.primary:C.brown, flex:1 }}>Visa / Mastercard</span>
                    {/* Card brand logos */}
                    <span style={{ display:"flex", gap:4 }}>
                      <span style={{ background:"#1A1F71", color:"white", fontSize:".55rem", fontWeight:900, padding:"2px 5px", borderRadius:3, letterSpacing:.5 }}>VISA</span>
                      <span style={{ display:"flex", position:"relative", width:20, height:14 }}>
                        <span style={{ position:"absolute", left:0, width:14, height:14, borderRadius:"50%", background:"#EB001B", opacity:.9 }}/>
                        <span style={{ position:"absolute", left:6, width:14, height:14, borderRadius:"50%", background:"#F79E1B", opacity:.9 }}/>
                      </span>
                    </span>
                  </label>
                </div>

                {/* INPUT FIELDS — phone or card */}
                {!isCardMethod(payMethod) ? (
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:".68rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>Namba ya Simu</label>
                    <div style={{ position:"relative" }}>
                      <Phone size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
                      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XXXXXXXX" style={{ width:"100%", padding:"10px 12px 10px 34px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom:14, display:"flex", flexDirection:"column", gap:10 }}>
                    {/* Card preview strip */}
                    <div style={{ background:`linear-gradient(135deg,${C.dark},${C.darkMid})`, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ color:"rgba(255,255,255,.5)", fontSize:".6rem", marginBottom:3 }}>CARD NUMBER</div>
                        <div style={{ color:"white", fontFamily:"monospace", fontSize:".9rem", letterSpacing:2 }}>{cardNum||"•••• •••• •••• ••••"}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        {cardBrand(cardNum)==="VISA" && <span style={{ background:"white", color:"#1A1F71", fontSize:".6rem", fontWeight:900, padding:"2px 6px", borderRadius:3 }}>VISA</span>}
                        {cardBrand(cardNum)==="MC"   && <span style={{ display:"flex", gap:-4 }}><span style={{ width:16,height:16,borderRadius:"50%",background:"#EB001B",display:"inline-block" }}/><span style={{ width:16,height:16,borderRadius:"50%",background:"#F79E1B",display:"inline-block",marginLeft:-6 }}/></span>}
                        {cardBrand(cardNum)==="AMEX" && <span style={{ color:"rgba(255,255,255,.7)", fontSize:".65rem", fontWeight:700 }}>AMEX</span>}
                        {cardBrand(cardNum)==="CARD" && <CreditCard size={20} color="rgba(255,255,255,.4)"/>}
                      </div>
                    </div>
                    {/* Card number */}
                    <div>
                      <label style={{ display:"block", fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Namba ya Kadi</label>
                      <input value={cardNum} onChange={e=>setCardNum(fmtCardNum(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", boxSizing:"border-box", fontFamily:"monospace", letterSpacing:1 }}/>
                    </div>
                    {/* Name */}
                    <div>
                      <label style={{ display:"block", fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Jina kwenye Kadi</label>
                      <input value={cardName} onChange={e=>setCardName(e.target.value.toUpperCase())} placeholder="JOHN MWAMBA" style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", boxSizing:"border-box", fontFamily:"inherit", textTransform:"uppercase" }}/>
                    </div>
                    {/* Expiry + CVV */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <div>
                        <label style={{ display:"block", fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Tarehe (MM/YY)</label>
                        <input value={cardExpiry} onChange={e=>setCardExpiry(fmtExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", boxSizing:"border-box", fontFamily:"monospace" }}/>
                      </div>
                      <div>
                        <label style={{ display:"block", fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>CVV</label>
                        <input value={cardCVV} onChange={e=>setCardCVV(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="•••" maxLength={4} type="password" style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", boxSizing:"border-box", fontFamily:"monospace" }}/>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:".72rem", color:C.muted }}>
                      <Shield size={11} color={C.success}/> Malipo yako yanalindwa kwa SSL encryption
                    </div>
                  </div>
                )}

                <div style={{ background:C.bg, borderRadius:10, padding:13, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:C.dark, fontSize:".88rem", marginBottom:4 }}>{prop.title} · {nights} nights</div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:"1.35rem", fontWeight:900, color:C.primary }}>TZS {fmt(total)}</div>
                </div>
                <button onClick={handlePay} disabled={loading} className="btn-press" style={{ width:"100%", padding:"13px", background:loading?C.muted:C.primary, color:"white", border:"none", borderRadius:11, fontWeight:700, fontSize:".93rem", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                  {loading
                    ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"white", borderRadius:"50%", animation:"spin 1s linear infinite" }}/> Inachakata…</>
                    : isCardMethod(payMethod)
                      ? <><CreditCard size={15}/> Lipa kwa Kadi</>
                      : <><Phone size={15}/> Tuma STK Push</>
                  }
                </button>
              </div>
            )}

            {step==="confirm" && (
              <div style={{ background:"white", borderRadius:20, padding:26, boxShadow:"0 8px 32px rgba(44,24,16,.1)" }}>
                <div style={{ textAlign:"center", marginBottom:22 }}>
                  <div style={{ width:58, height:58, background:"#DCFCE7", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                    <Phone size={24} color={C.success}/>
                  </div>
                  <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.1rem", color:C.dark, marginBottom:6 }}>{isCardMethod(payMethod)?"Kadi Imethibitishwa!":"STK Push Sent!"}</h3>
                  <p style={{ color:C.muted, fontSize:".82rem" }}>{isCardMethod(payMethod)?<>Kadi yako <strong>****{cardNum.replace(/\s/g,'').slice(-4)}</strong> imepokelewa. Thibitisha booking.</>:<>Check <strong>{phone}</strong> and enter your <strong>{payMethod}</strong> PIN</>}</p>
                </div>
                <div style={{ background:C.bg, borderRadius:10, padding:14, marginBottom:18 }}>
                  <div style={{ fontWeight:600, fontSize:".85rem", color:C.dark, marginBottom:4 }}>{prop.title}</div>
                  <div style={{ fontSize:".78rem", color:C.muted, marginBottom:8 }}>{checkIn} → {checkOut} · {nights}n · {guests} guest{guests>1?"s":""}</div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:"1.4rem", fontWeight:900, color:C.primary }}>TZS {fmt(total)}</div>
                </div>
                <button onClick={handleConfirm} disabled={loading} className="btn-press" style={{ width:"100%", padding:"13px", background:loading?C.muted:C.success, color:"white", border:"none", borderRadius:11, fontWeight:700, fontSize:".93rem", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, marginBottom:9 }}>
                  {loading?<><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"white", borderRadius:"50%", animation:"spin 1s linear infinite" }}/> Confirming…</>:<><Check size={15}/> Confirm Payment</>}
                </button>
                <button onClick={()=>setStep("payment")} style={{ width:"100%", padding:"11px", background:"white", color:C.primary, border:`1.5px solid ${C.primary}`, borderRadius:11, fontWeight:600, cursor:"pointer", fontSize:".88rem" }}>Resend STK Push</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SAVED PAGE ───────────────────────────────────────────
function SavedPage({ props, saved, toggleSaved, openProp }) {
  const list = props.filter(p=>saved.includes(p.id));
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"50px 4%" }}>
      <FadeIn><h2 style={{ fontFamily:"Georgia,serif", fontSize:"2rem", fontWeight:700, color:C.dark, marginBottom:6 }}>Saved Properties</h2>
      <p style={{ color:C.muted, marginBottom:32 }}>{list.length} property saved</p></FadeIn>
      {list.length===0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
          <Heart size={44} style={{ marginBottom:14, opacity:.28 }}/>
          <p style={{ fontFamily:"Georgia,serif", fontSize:"1.15rem", color:C.brown }}>No saved properties yet</p>
          <p style={{ fontSize:".85rem", marginTop:8 }}>Tap the heart icon on any property</p>
        </div>
      ) : (
        <div className="props-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:26 }}>
          {list.map((p,i)=><FadeIn key={p.id} delay={i*.07}><PropCard prop={p} saved={saved} toggleSaved={toggleSaved} onClick={()=>openProp(p)}/></FadeIn>)}
        </div>
      )}
    </div>
  );
}

// ─── BOOKINGS PAGE ────────────────────────────────────────
function BookingsPage({ bookings, setBookings, showToast, user, setPage, setAuthMode }) {
  if (!user) return (
    <div style={{ maxWidth:500, margin:"80px auto", textAlign:"center", padding:"0 4%" }}>
      <Lock size={44} style={{ marginBottom:14, color:C.primary, opacity:.7 }}/>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.5rem", color:C.dark, marginBottom:10 }}>Sign in to view bookings</h2>
      <p style={{ color:C.muted, marginBottom:22 }}>You need an account to manage your bookings.</p>
      <button onClick={()=>{setAuthMode("login");setPage("auth");}} className="btn-press" style={{ padding:"11px 26px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>Sign In</button>
    </div>
  );
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelNote, setCancelNote] = useState("");
  const CANCEL_REASONS = ["Change of plans","Found a better option","Host unresponsive","Price too high","Booked by mistake"];
  const openCancel = id => { setCancelTarget(id); setCancelNote(""); };
  const closeCancel = () => { setCancelTarget(null); setCancelNote(""); };
  const confirmCancel = () => {
    setBookings(p=>p.map(b=>b.id===cancelTarget?{...b,status:"cancelled",cancelReason:cancelNote.trim()}:b));
    showToast("Booking cancelled. Refund in 24hrs.");
    closeCancel();
  };
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"50px 4%" }}>
      <FadeIn><h2 style={{ fontFamily:"Georgia,serif", fontSize:"2rem", fontWeight:700, color:C.dark, marginBottom:6 }}>My Bookings</h2>
      <p style={{ color:C.muted, marginBottom:32 }}>{bookings.length} booking{bookings.length!==1?"s":""}</p></FadeIn>
      {bookings.length===0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
          <BookOpen size={44} style={{ marginBottom:14, opacity:.28 }}/>
          <p style={{ fontFamily:"Georgia,serif", fontSize:"1.15rem", color:C.brown }}>No bookings yet</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {bookings.map((b,i)=>(
            <FadeIn key={b.id} delay={i*.06}>
              <div style={{ background:"white", borderRadius:14, overflow:"hidden", boxShadow:`0 3px 16px rgba(44,24,16,.07)`, display:"grid", gridTemplateColumns:"160px 1fr" }}>
                <div style={{ minHeight:130, overflow:"hidden" }}>
                  <img src={b.propertyImage} alt={b.propertyTitle} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:9, gap:8 }}>
                    <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:".98rem", color:C.dark }}>{b.propertyTitle}</h3>
                    <span style={{ padding:"3px 10px", borderRadius:16, fontSize:".68rem", fontWeight:700, textTransform:"uppercase", background:b.status==="confirmed"?"#DCFCE7":"#FEE2E2", color:b.status==="confirmed"?C.success:C.error, flexShrink:0 }}>{b.status}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:12, fontSize:".78rem", color:C.muted, marginBottom:11 }}>
                    <span style={{ display:"flex", alignItems:"center", gap:3 }}><Calendar size={11}/>{b.checkIn} → {b.checkOut}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:3 }}><Users size={11}/>{b.guests} guests · {b.nights}n</span>
                    <span style={{ display:"flex", alignItems:"center", gap:3 }}><CreditCard size={11}/>{b.paymentMethod}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ fontSize:"1.05rem", fontWeight:700, color:C.primary }}>TZS {fmt(b.total)}</span>
                      <span style={{ fontSize:".72rem", color:C.muted, marginLeft:4 }}>incl. TZS {fmt(b.serviceFee)} fee</span>
                    </div>
                    {b.status==="confirmed" && <button onClick={()=>openCancel(b.id)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", background:"white", color:C.error, border:`1.5px solid ${C.error}`, borderRadius:7, fontWeight:600, cursor:"pointer", fontSize:".78rem" }}><Trash2 size={12}/>Cancel</button>}
                  </div>
                  {b.status==="confirmed" && <div style={{ marginTop:9, display:"flex", alignItems:"center", gap:4, fontSize:".7rem", color:C.success }}><Shield size={11}/>Funds in escrow — released 24hrs after check-in</div>}
                  {b.status==="cancelled" && b.cancelReason && (
                    <div style={{ marginTop:9, display:"flex", alignItems:"flex-start", gap:6, fontSize:".75rem", color:C.brown, background:C.bg, borderRadius:8, padding:"8px 11px" }}>
                      <MessageSquare size={12} style={{ marginTop:1, flexShrink:0, color:C.muted }}/>
                      <span><strong>Cancellation reason:</strong> {b.cancelReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
      {cancelTarget!==null && (
        <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={closeCancel}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:16, padding:28, maxWidth:440, width:"100%", boxShadow:"0 28px 70px rgba(0,0,0,.32)" }}>
            <h3 style={{ fontFamily:"Georgia,serif", fontSize:"1.2rem", fontWeight:700, color:C.dark, marginBottom:6 }}>Cancel Booking</h3>
            <p style={{ color:C.muted, fontSize:".85rem", marginBottom:16 }}>Help us improve — please tell us why you're cancelling.</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {CANCEL_REASONS.map(r=>(
                <button key={r} onClick={()=>setCancelNote(r)} style={{ padding:"6px 13px", borderRadius:16, border:`1.5px solid ${cancelNote===r?C.error:C.border}`, background:cancelNote===r?C.error:"white", color:cancelNote===r?"white":C.brown, fontSize:".78rem", cursor:"pointer", fontWeight:cancelNote===r?600:400 }}>{r}</button>
              ))}
            </div>
            <textarea value={cancelNote} onChange={e=>setCancelNote(e.target.value)} placeholder="Tell us more about why you're cancelling…" rows={3} style={{ width:"100%", padding:"11px 12px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:".85rem", outline:"none", background:C.bg, resize:"vertical", fontFamily:"inherit", marginBottom:18 }}/>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={closeCancel} className="btn-press" style={{ flex:1, padding:"11px", background:"white", color:C.brown, border:`1.5px solid ${C.border}`, borderRadius:10, fontWeight:600, cursor:"pointer", fontSize:".88rem" }}>Nevermind</button>
              <button onClick={confirmCancel} disabled={!cancelNote.trim()} className="btn-press" style={{ flex:1, padding:"11px", background:cancelNote.trim()?C.error:C.border, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:cancelNote.trim()?"pointer":"not-allowed", fontSize:".88rem" }}>Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────
function AuthPage({ setUser, setPage, mode, setMode, showToast }) {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [role,setRole]=useState("guest"); const [showPwd,setShowPwd]=useState(false); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const DEMO_USERS = [
    { id:1, name:"Demo User", email:"demo@staylocal.co.tz", password:"demo123", role:"guest" },
    { id:2, name:"John Host", email:"host@staylocal.co.tz", password:"host123", role:"landlord" },
    { id:3, name:"Admin User", email:"admin@staylocal.co.tz", password:"admin123", role:"admin" },
  ];
  const submit = async () => {
    setErr(""); if (!email||!password) { setErr("Fill all fields."); return; }
    if (mode==="register"&&!name) { setErr("Enter your name."); return; }
    setLoading(true);
    try {
      const endpoint = mode==="login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode==="login" ? { email, password } : { name, email, password, role };
      const res = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || !data.success) { setErr(data.error || "Tatizo la mfumo, jaribu tena."); setLoading(false); return; }
      setUser(data.user);
      setPage(data.user.role==="admin" ? "admin" : data.user.role==="landlord" ? "dashboard" : "home");
      showToast(mode==="login" ? `Karibu tena, ${data.user.name.split(" ")[0]}!` : `Karibu StayLocal, ${data.user.name.split(" ")[0]}!`);
    } catch {
      setErr("Hakuna muunganiko wa internet, angalia server.");
    }
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 4%" }}>
      <FadeIn>
        <div style={{ background:"white", borderRadius:22, padding:38, boxShadow:"0 12px 48px rgba(44,24,16,.1)", width:"100%", maxWidth:410 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ width:50, height:50, background:C.primary, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><Home size={24} color="white"/></div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.5rem", fontWeight:700, color:C.dark, marginBottom:4 }}>{mode==="login"?"Welcome back":"Create account"}</h2>
            <p style={{ color:C.muted, fontSize:".83rem" }}>{mode==="login"?"Sign in to your StayLocal account":"Join thousands booking safely in Tanzania"}</p>
          </div>
          {err && <div style={{ background:"#FEE2E2", color:C.error, padding:"9px 13px", borderRadius:8, marginBottom:14, fontSize:".8rem", display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={13}/>{err}</div>}
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {mode==="register" && <>
              <Field label="Full Name" icon={<User size={14}/>}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Amina Mwangi"/></Field>
              <div>
                <label style={{ display:"block", fontSize:".68rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>I am a…</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[["guest","Guest / Traveler"],["landlord","Property Owner"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setRole(v)} style={{ padding:"10px", border:`2px solid ${role===v?C.primary:C.border}`, borderRadius:9, background:role===v?C.primaryFaint:"white", color:role===v?C.primary:C.brown, fontWeight:role===v?700:400, cursor:"pointer", fontSize:".8rem", transition:"all .2s" }}>{l}</button>
                  ))}
                </div>
              </div>
            </>}
            <Field label="Email" icon={<Mail size={14}/>}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/></Field>
            <div>
              <label style={{ display:"block", fontSize:".68rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>Password</label>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.muted }}><Lock size={14}/></div>
                <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type={showPwd?"text":"password"} style={{ width:"100%", padding:"10px 38px 10px 34px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                <button onClick={()=>setShowPwd(o=>!o)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.muted }}>{showPwd?<EyeOff size={14}/>:<Eye size={14}/>}</button>
              </div>
            </div>
            <button onClick={submit} disabled={loading} className="btn-press" style={{ padding:"12px", background:loading?C.muted:C.primary, color:"white", border:"none", borderRadius:11, fontWeight:700, fontSize:".93rem", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, marginTop:4 }}>
              {loading?<><div style={{ width:15, height:15, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"white", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>{mode==="login"?"Signing in…":"Creating…"}</>:<>{mode==="login"?"Sign In":"Create Account"}<ArrowRight size={15}/></>}
            </button>
          </div>
          <p style={{ textAlign:"center", marginTop:18, fontSize:".82rem", color:C.muted }}>
            {mode==="login"?"Don't have an account? ":"Already have an account? "}
            <button onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}} style={{ background:"none", border:"none", color:C.primary, fontWeight:700, cursor:"pointer", fontSize:".82rem" }}>{mode==="login"?"Sign up":"Sign in"}</button>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
function Field({ label, icon, children }) {
  return (
    <div>
      <label style={{ display:"block", fontSize:".68rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{label}</label>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.muted }}>{icon}</div>
        {React.cloneElement(children, { style:{ width:"100%", padding:"10px 12px 10px 34px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:C.bg } })}
      </div>
    </div>
  );
}

// ─── LANDLORD DASHBOARD ───────────────────────────────────
function LandlordDashboard({ user, props, bookings, showToast, setPage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const myBookings = bookings.filter(b => props.some(p => p.id === b.propertyId));
  const totalRevenue = myBookings.filter(b=>b.status==="confirmed").reduce((a,b)=>a+b.total,0);

  const tabs = [
    { id:"overview", label:"Overview", icon:<LayoutDashboard size={14}/> },
    { id:"properties", label:"My Properties", icon:<Home size={14}/> },
    { id:"requests", label:"Booking Requests", icon:<Bell size={14}/> },
    { id:"earnings", label:"Earnings", icon:<DollarSign size={14}/> },
  ];

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 4%" }}>
      <FadeIn>
        <div style={{ marginBottom:28 }}>
          <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primary, display:"block", marginBottom:6 }}>Landlord Portal</span>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ fontFamily:"Georgia,serif", fontSize:"1.9rem", fontWeight:700, color:C.dark, marginBottom:4 }}>Welcome, {user?.name?.split(" ")[0] || "Host"}</h1>
              <p style={{ color:C.muted, fontSize:".88rem" }}>Manage your properties and track bookings</p>
            </div>
            <button onClick={()=>setPage("list")} className="btn-press" style={{ display:"flex", alignItems:"center", gap:7, padding:"11px 20px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>
              <Plus size={16}/>Add New Property
            </button>
          </div>
        </div>
      </FadeIn>

      {/* TABS */}
      <div style={{ display:"flex", gap:4, background:"white", borderRadius:12, padding:4, marginBottom:28, boxShadow:`0 2px 8px rgba(44,24,16,.06)`, overflowX:"auto" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", border:"none", borderRadius:9, background:activeTab===t.id?C.primary:"transparent", color:activeTab===t.id?"white":C.brown, fontWeight:activeTab===t.id?700:400, cursor:"pointer", fontSize:".83rem", whiteSpace:"nowrap", transition:"all .2s" }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {activeTab==="overview" && (
        <div>
          {/* STATS */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
            {[
              { label:"Total Properties", value:props.length, icon:<Home size={20} color={C.primary}/>, bg:"#FFF1E8" },
              { label:"Active Bookings", value:myBookings.filter(b=>b.status==="confirmed").length, icon:<Calendar size={20} color={C.info}/>, bg:"#EFF6FF" },
              { label:"Total Revenue", value:`TZS ${fmt(totalRevenue)}`, icon:<TrendingUp size={20} color={C.success}/>, bg:"#F0FDF4" },
              { label:"Average Rating", value:"4.8 ★", icon:<Star size={20} color="#F59E0B"/>, bg:"#FFFBEB" },
            ].map(s=>(
              <FadeIn key={s.label}>
                <div style={{ background:"white", borderRadius:14, padding:"20px 22px", boxShadow:`0 2px 12px rgba(44,24,16,.06)`, display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:"1.3rem", fontWeight:900, color:C.dark, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:".75rem", color:C.muted, marginTop:3 }}>{s.label}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {/* RECENT REQUESTS */}
          <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.1rem", color:C.dark, marginBottom:14 }}>Recent Booking Requests</h3>
          <BookingRequestsList bookings={myBookings} showToast={showToast}/>
        </div>
      )}

      {activeTab==="properties" && (
        <div>
          <div className="props-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:22 }}>
            {props.map((p,i)=>(
              <FadeIn key={p.id} delay={i*.06}>
                <div style={{ background:"white", borderRadius:14, overflow:"hidden", boxShadow:`0 3px 14px rgba(44,24,16,.07)` }}>
                  <div style={{ height:165, overflow:"hidden", position:"relative" }}>
                    <img src={p.image} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <span style={{ position:"absolute", top:9, right:9, background:C.success, color:"white", fontSize:".67rem", fontWeight:700, padding:"3px 9px", borderRadius:16 }}>Active</span>
                  </div>
                  <div style={{ padding:16 }}>
                    <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:".95rem", color:C.dark, marginBottom:4 }}>{p.title}</div>
                    <div style={{ fontSize:".75rem", color:C.muted, marginBottom:10, display:"flex", alignItems:"center", gap:3 }}><MapPin size={10}/>{p.location}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontWeight:700, color:C.primary, fontSize:".93rem" }}>TZS {fmt(p.price)}<span style={{ color:C.muted, fontWeight:400, fontSize:".72rem" }}>/night</span></span>
                      <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:".78rem" }}><Star size={11} fill="#F59E0B" color="#F59E0B"/>{p.rating}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
            <FadeIn delay={props.length*.06}>
              <button onClick={()=>setPage("list")} style={{ background:"white", borderRadius:14, border:`2px dashed ${C.border}`, minHeight:260, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer", color:C.muted, transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.color=C.primary;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
                <Plus size={28}/>
                <span style={{ fontWeight:600, fontSize:".88rem" }}>Add New Property</span>
              </button>
            </FadeIn>
          </div>
        </div>
      )}

      {activeTab==="requests" && <BookingRequestsList bookings={myBookings} showToast={showToast} expanded/>}

      {activeTab==="earnings" && (
        <div>
          <FadeIn>
            <div style={{ background:"white", borderRadius:16, padding:28, boxShadow:`0 3px 14px rgba(44,24,16,.07)`, marginBottom:22 }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.1rem", color:C.dark, marginBottom:18 }}>Revenue Summary</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
                {[["This Month","TZS "+fmt(totalRevenue)],["Pending Release","TZS "+fmt(Math.round(totalRevenue*.3))],["Total Earned","TZS "+fmt(totalRevenue*3)]].map(([l,v])=>(
                  <div key={l} style={{ background:C.bg, borderRadius:10, padding:16 }}>
                    <div style={{ fontSize:".72rem", color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{l}</div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:"1.2rem", fontWeight:900, color:C.primary }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={.1}>
            <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:`0 3px 14px rgba(44,24,16,.07)` }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.05rem", color:C.dark, marginBottom:16 }}>Payment History</h3>
              {myBookings.map(b=>(
                <div key={b.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:".85rem", color:C.dark }}>{b.propertyTitle}</div>
                    <div style={{ fontSize:".75rem", color:C.muted }}>{b.checkIn} · {b.paymentMethod}</div>
                    {b.status==="cancelled" && b.cancelReason && <div style={{ fontSize:".7rem", color:C.muted, marginTop:3 }}><MessageSquare size={10} style={{ verticalAlign:"-1px", marginRight:3 }}/>Guest's reason: {b.cancelReason}</div>}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontWeight:700, color:C.primary, fontSize:".9rem" }}>TZS {fmt(b.total)}</div>
                    <span style={{ fontSize:".68rem", fontWeight:700, padding:"2px 8px", borderRadius:12, background:b.status==="confirmed"?"#DCFCE7":"#FEE2E2", color:b.status==="confirmed"?C.success:C.error }}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}

function BookingRequestsList({ bookings, showToast, expanded }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {bookings.length===0 ? (
        <div style={{ textAlign:"center", padding:"48px 0", color:C.muted }}><Bell size={36} style={{ marginBottom:12, opacity:.28 }}/><p>No booking requests yet</p></div>
      ) : bookings.map((b,i)=>(
        <FadeIn key={b.id} delay={i*.05}>
          <div style={{ background:"white", borderRadius:12, padding:"16px 20px", boxShadow:`0 2px 10px rgba(44,24,16,.06)`, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ width:52, height:52, borderRadius:10, overflow:"hidden", flexShrink:0 }}>
              <img src={b.propertyImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ fontWeight:700, fontSize:".88rem", color:C.dark }}>{b.propertyTitle}</div>
              <div style={{ fontSize:".75rem", color:C.muted, marginTop:3 }}>
                {b.checkIn} → {b.checkOut} · {b.guests} guest{b.guests>1?"s":""} · {b.paymentMethod}
              </div>
              {expanded && <div style={{ fontSize:".75rem", color:C.muted, marginTop:2 }}>Guest: Demo User · <span style={{ color:C.info }}>demo@staylocal.co.tz</span></div>}
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontWeight:700, color:C.primary, fontSize:".92rem" }}>TZS {fmt(b.total)}</div>
              <span style={{ fontSize:".68rem", fontWeight:700, padding:"3px 9px", borderRadius:12, background:b.status==="confirmed"?"#DCFCE7":"#FEE2E2", color:b.status==="confirmed"?C.success:C.error }}>{b.status}</span>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ─── LIST PROPERTY PAGE ───────────────────────────────────
function ListPropertyPage({ user, setPage, showToast, setAuthMode, propertyRequests, setPropertyRequests }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title:"", location:"", neighborhood:"All Areas", type:"Entire Home", price:"",
    beds:1, baths:1, maxGuests:2, description:"",
    amenities:[], images:[], phone:"", email:"", hostName:"",
    termsAccepted:false,
  });
  const allAmenities = ["WiFi","AC","Kitchen","Pool","Gym","Parking","Garden","Security","Beach Access","Washer","Restaurant","City View"];

  const up = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleAmenity = a => setForm(p=>({ ...p, amenities:p.amenities.includes(a)?p.amenities.filter(x=>x!==a):[...p.amenities,a] }));
  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    files.forEach(f=>{
      const reader = new FileReader();
      reader.onload = ev => setForm(p=>({ ...p, images:[...p.images,{ name:f.name, url:ev.target.result }] }));
      reader.readAsDataURL(f);
    });
  };

  const steps = [
    { n:1, label:"Basic Info" }, { n:2, label:"Details" },
    { n:3, label:"Photos" }, { n:4, label:"Contact" },
  ];

  const validate = () => {
    if (step===1 && (!form.title||!form.location||!form.price)) { showToast("Fill all required fields","error"); return false; }
    if (step===2 && !form.description) { showToast("Add a description","error"); return false; }
    if (step===4 && (!form.phone||!form.email||!form.hostName)) { showToast("Fill contact details","error"); return false; }
    if (step===4 && !form.termsAccepted) { showToast("Accept terms to continue","error"); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (!user) { setAuthMode("register"); setPage("auth"); showToast("Create an account to list","error"); return; }
    const req = { id:Date.now(), ...form, status:"pending", date:new Date().toISOString().split("T")[0] };
    setPropertyRequests(p=>[...p,req]);
    setSubmitted(true);
    showToast("Property submitted for verification!");
  };

  if (submitted) return (
    <div style={{ maxWidth:560, margin:"80px auto", textAlign:"center", padding:"0 4%" }}>
      <FadeIn>
        <div style={{ background:"white", borderRadius:20, padding:44, boxShadow:`0 8px 32px rgba(44,24,16,.08)` }}>
          <div style={{ width:78, height:78, background:"#DCFCE7", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
            <CheckCircle size={38} color={C.success}/>
          </div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.8rem", color:C.dark, marginBottom:12 }}>Application Submitted!</h2>
          <p style={{ color:C.muted, marginBottom:10, lineHeight:1.7 }}>Your property <strong style={{color:C.dark}}>"{form.title}"</strong> has been submitted for physical verification.</p>
          <div style={{ background:C.bg, borderRadius:12, padding:16, marginBottom:24, textAlign:"left" }}>
            {[["Next Step","Our team will contact you within 24–48 hours to schedule a physical visit."],["Verification","We inspect the property to confirm it matches your listing."],["Go Live","Once approved, your property goes live on StayLocal."]].map(([t,d],i)=>(
              <div key={i} style={{ display:"flex", gap:12, marginBottom:i<2?12:0 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:C.primary, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".72rem", fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div><div style={{ fontWeight:600, fontSize:".83rem", color:C.dark }}>{t}</div><div style={{ fontSize:".78rem", color:C.muted, marginTop:2 }}>{d}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <button onClick={()=>setPage("dashboard")} className="btn-press" style={{ padding:"11px 22px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>Go to Dashboard</button>
            <button onClick={()=>{setSubmitted(false);setStep(1);setForm({title:"",location:"",neighborhood:"All Areas",type:"Entire Home",price:"",beds:1,baths:1,maxGuests:2,description:"",amenities:[],images:[],phone:"",email:"",hostName:"",termsAccepted:false});}} style={{ padding:"11px 22px", background:"white", color:C.primary, border:`1.5px solid ${C.primary}`, borderRadius:10, fontWeight:600, cursor:"pointer" }}>List Another</button>
          </div>
        </div>
      </FadeIn>
    </div>
  );

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"40px 4%" }}>
      <FadeIn>
        <div style={{ marginBottom:32 }}>
          <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primary, display:"block", marginBottom:6 }}>List Your Property</span>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"2rem", fontWeight:700, color:C.dark, marginBottom:6 }}>Add Your Property to StayLocal</h1>
          <p style={{ color:C.muted, fontSize:".88rem" }}>Fill in the details below. Our team will physically verify and approve your listing within 24–48 hours.</p>
        </div>
      </FadeIn>

      {/* STEP INDICATOR */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:32, gap:0 }}>
        {steps.map((s,i)=>(
          <div key={s.n} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:step>=s.n?C.primary:C.border, color:step>=s.n?"white":C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".83rem", transition:"all .3s" }}>
                {step>s.n?<Check size={16}/>:s.n}
              </div>
              <span style={{ fontSize:".68rem", color:step>=s.n?C.primary:C.muted, fontWeight:step===s.n?700:400, whiteSpace:"nowrap" }}>{s.label}</span>
            </div>
            {i<steps.length-1 && <div style={{ flex:1, height:2, background:step>s.n?C.primary:C.border, margin:"0 4px", marginBottom:22, transition:"background .3s" }}/>}
          </div>
        ))}
      </div>

      <div style={{ background:"white", borderRadius:18, padding:"28px 30px", boxShadow:`0 4px 20px rgba(44,24,16,.08)` }}>
        {/* STEP 1: BASIC INFO */}
        {step===1 && (
          <FadeIn>
            <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.15rem", color:C.dark, marginBottom:22 }}>Basic Information</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <FormGroup label="Property Title *" hint="Make it descriptive and memorable">
                <input value={form.title} onChange={e=>up("title",e.target.value)} placeholder="e.g. Masaki Ocean Studio Apartment"/>
              </FormGroup>
              <FormGroup label="Full Address *" hint="Street, area, Dar es Salaam">
                <input value={form.location} onChange={e=>up("location",e.target.value)} placeholder="e.g. Plot 15, Masaki, Dar es Salaam"/>
              </FormGroup>
              <FormGroup label="Neighborhood">
                <select value={form.neighborhood} onChange={e=>up("neighborhood",e.target.value)}>
                  {AREAS.slice(1).map(a=><option key={a}>{a}</option>)}
                </select>
              </FormGroup>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <FormGroup label="Property Type">
                  <select value={form.type} onChange={e=>up("type",e.target.value)}>
                    {["Entire Home","Private Room","Shared Room"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Price per Night (TZS) *" hint="Set your nightly rate">
                  <input type="number" value={form.price} onChange={e=>up("price",e.target.value)} placeholder="e.g. 80000"/>
                </FormGroup>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {[["beds","Bedrooms"],["baths","Bathrooms"],["maxGuests","Max Guests"]].map(([k,l])=>(
                  <FormGroup key={k} label={l}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, background:C.bg }}>
                      <button onClick={()=>up(k,Math.max(1,form[k]-1))} style={{ width:24, height:24, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={11}/></button>
                      <span style={{ flex:1, textAlign:"center", fontWeight:700 }}>{form[k]}</span>
                      <button onClick={()=>up(k,Math.min(20,form[k]+1))} style={{ width:24, height:24, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={11}/></button>
                    </div>
                  </FormGroup>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* STEP 2: DETAILS */}
        {step===2 && (
          <FadeIn>
            <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.15rem", color:C.dark, marginBottom:22 }}>Property Details</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <FormGroup label="Description *" hint="Describe what makes your property unique">
                <textarea value={form.description} onChange={e=>up("description",e.target.value)} placeholder="Describe your property — views, surroundings, nearby amenities, access to transport, etc." rows={5} style={{ resize:"vertical" }}/>
              </FormGroup>
              <div>
                <label style={{ display:"block", fontSize:".72rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>Amenities Available</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {allAmenities.map(a=>(
                    <button key={a} onClick={()=>toggleAmenity(a)} className="btn-press" style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", border:`1.5px solid ${form.amenities.includes(a)?C.primary:C.border}`, borderRadius:20, background:form.amenities.includes(a)?C.primaryFaint:"white", color:form.amenities.includes(a)?C.primary:C.brown, fontSize:".78rem", cursor:"pointer", fontWeight:form.amenities.includes(a)?600:400, transition:"all .2s" }}>
                      {AMENITY_ICONS[a]||<Check size={11}/>}{a}{form.amenities.includes(a)&&<Check size={11}/>}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize:".72rem", color:C.muted, marginTop:8 }}>{form.amenities.length} amenity selected</p>
              </div>
            </div>
          </FadeIn>
        )}

        {/* STEP 3: PHOTOS */}
        {step===3 && (
          <FadeIn>
            <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.15rem", color:C.dark, marginBottom:8 }}>Property Photos</h3>
            <p style={{ color:C.muted, fontSize:".83rem", marginBottom:20 }}>Upload at least 3 photos. Clear, well-lit images improve your listing's performance.</p>
            <label style={{ display:"block", border:`2px dashed ${C.border}`, borderRadius:14, padding:"36px 20px", textAlign:"center", cursor:"pointer", background:C.bg, transition:"all .2s", marginBottom:20 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.background="rgba(196,98,45,.04)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg;}}>
              <Upload size={30} color={C.muted} style={{ marginBottom:10 }}/>
              <div style={{ fontWeight:600, color:C.dark, marginBottom:4 }}>Click to upload photos</div>
              <div style={{ fontSize:".78rem", color:C.muted }}>JPG, PNG · Max 10MB each · Recommended: 1200×800px</div>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display:"none" }}/>
            </label>
            {form.images.length>0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10 }}>
                {form.images.map((img,i)=>(
                  <div key={i} style={{ position:"relative", borderRadius:10, overflow:"hidden", height:100 }}>
                    <img src={img.url} alt={img.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <button onClick={()=>setForm(p=>({...p,images:p.images.filter((_,j)=>j!==i)}))} style={{ position:"absolute", top:4, right:4, width:22, height:22, borderRadius:"50%", background:"rgba(0,0,0,.6)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <X size={11} color="white"/>
                    </button>
                    {i===0 && <span style={{ position:"absolute", bottom:4, left:4, background:C.primary, color:"white", fontSize:".6rem", fontWeight:700, padding:"2px 6px", borderRadius:8 }}>Cover</span>}
                  </div>
                ))}
              </div>
            )}
            {form.images.length===0 && <p style={{ color:C.muted, fontSize:".78rem", textAlign:"center" }}>No photos yet. You can continue without photos and add them later.</p>}
          </FadeIn>
        )}

        {/* STEP 4: CONTACT */}
        {step===4 && (
          <FadeIn>
            <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.15rem", color:C.dark, marginBottom:22 }}>Contact & Confirmation</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <FormGroup label="Your Full Name *">
                <input value={form.hostName} onChange={e=>up("hostName",e.target.value)} placeholder="e.g. Amina Mohamed"/>
              </FormGroup>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <FormGroup label="Phone Number *" hint="We'll call to schedule verification">
                  <input value={form.phone} onChange={e=>up("phone",e.target.value)} placeholder="07XXXXXXXX"/>
                </FormGroup>
                <FormGroup label="Email Address *">
                  <input type="email" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="you@example.com"/>
                </FormGroup>
              </div>

              {/* SUMMARY */}
              <div style={{ background:C.bg, borderRadius:12, padding:18, marginTop:4 }}>
                <h4 style={{ fontWeight:700, fontSize:".88rem", color:C.dark, marginBottom:12 }}>Listing Summary</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {[["Title",form.title||"—"],["Location",form.location||"—"],["Type",form.type],["Price",form.price?`TZS ${fmt(form.price)}/night`:"—"],["Beds/Baths",`${form.beds} bed · ${form.baths} bath · ${form.maxGuests} guests`],["Amenities",form.amenities.length+" selected"],["Photos",form.images.length+" uploaded"]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:".82rem" }}>
                      <span style={{ color:C.muted }}>{l}</span>
                      <span style={{ fontWeight:600, color:C.dark }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VERIFICATION NOTICE */}
              <div style={{ background:"#EFF6FF", border:`1.5px solid #BFDBFE`, borderRadius:12, padding:16, display:"flex", gap:12 }}>
                <Shield size={18} color={C.info} style={{ flexShrink:0, marginTop:1 }}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:".83rem", color:"#1E40AF", marginBottom:4 }}>Physical Verification Required</div>
                  <div style={{ fontSize:".78rem", color:"#3B82F6", lineHeight:1.6 }}>After submitting, our StayLocal team will contact you within 24–48 hours to schedule an in-person visit and verify your property before it goes live.</div>
                </div>
              </div>

              <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                <input type="checkbox" checked={form.termsAccepted} onChange={e=>up("termsAccepted",e.target.checked)} style={{ marginTop:2, accentColor:C.primary }}/>
                <span style={{ fontSize:".8rem", color:C.brown, lineHeight:1.6 }}>I confirm this property belongs to me or I have authority to list it. I agree to StayLocal's <span style={{ color:C.primary, fontWeight:600, cursor:"pointer" }}>Terms of Service</span> and <span style={{ color:C.primary, fontWeight:600, cursor:"pointer" }}>Host Policy</span>.</span>
              </label>
            </div>
          </FadeIn>
        )}

        {/* NAV BUTTONS */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
          <button onClick={()=>step>1?setStep(s=>s-1):setPage("home")} style={{ display:"flex", alignItems:"center", gap:5, padding:"10px 18px", background:"white", border:`1.5px solid ${C.border}`, borderRadius:9, fontWeight:600, cursor:"pointer", color:C.brown, fontSize:".85rem" }}>
            <ChevronLeft size={15}/>{step>1?"Previous":"Cancel"}
          </button>
          {step<4 ? (
            <button onClick={()=>{if(validate())setStep(s=>s+1);}} className="btn-press" style={{ display:"flex", alignItems:"center", gap:5, padding:"10px 22px", background:C.primary, color:"white", border:"none", borderRadius:9, fontWeight:700, cursor:"pointer", fontSize:".85rem" }}>
              Continue<ArrowRight size={15}/>
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-press" style={{ display:"flex", alignItems:"center", gap:5, padding:"10px 22px", background:C.success, color:"white", border:"none", borderRadius:9, fontWeight:700, cursor:"pointer", fontSize:".85rem" }}>
              <Send size={15}/>Submit for Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function FormGroup({ label, hint, children }) {
  return (
    <div>
      <label style={{ display:"block", fontSize:".68rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{label}{hint&&<span style={{ fontWeight:400, marginLeft:6, textTransform:"none", letterSpacing:0 }}>— {hint}</span>}</label>
      {React.cloneElement(children, { style:{ ...children.props.style, width:"100%", padding:"10px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:".88rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:C.bg, resize:"vertical" } })}
    </div>
  );
}

// ─── SUPER ADMIN: STAT CARD ──────────────────────────────
function StatCard({ label, value, sub, bg, col, icon }) {
  return (
    <div style={{ background:"white", borderRadius:14, padding:"18px 20px", border:`1px solid ${C.border}`, boxShadow:"0 1px 6px rgba(0,0,0,.05)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:col||C.primary, borderRadius:"14px 14px 0 0" }}/>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:".65rem", fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>{label}</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:"1.8rem", fontWeight:900, color:C.dark, lineHeight:1.05, wordBreak:"break-all" }}>{value}</div>
          {sub && <div style={{ fontSize:".72rem", color:C.muted, marginTop:5, display:"flex", alignItems:"center", gap:3 }}>{sub}</div>}
        </div>
        {icon && <div style={{ width:40, height:40, borderRadius:10, background:bg||C.primaryFaint, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{React.cloneElement(icon,{ size:18, color:col||C.primary })}</div>}
      </div>
    </div>
  );
}

// ─── SUPER ADMIN: OVERVIEW TAB ───────────────────────────
function AdminOverviewTab({ overview, logs }) {
  const fmt = n => n?.toLocaleString() || "0";
  const cards = [
    { label:"Total Users",         value: fmt(overview.totalUsers),        sub:`${overview.totalGuests||0} guests · ${overview.totalHosts||0} hosts`,  icon:<Users/>,       col:"#2563EB", bg:"#EFF6FF" },
    { label:"Total Bookings",      value: fmt(overview.totalBookings),      sub:`${overview.pendingBookings||0} inasubiri`,                              icon:<BookOpen/>,    col:C.warning, bg:"#FEF3C7" },
    { label:"Confirmed Bookings",  value: fmt(overview.confirmedBookings),  sub:"malipo yamethibitishwa",                                               icon:<Check/>,       col:C.success, bg:"#DCFCE7" },
    { label:"Cancelled",           value: fmt(overview.cancelledBookings),  sub:"bookings zilizofutwa",                                                 icon:<X/>,           col:C.error,   bg:"#FEE2E2" },
    { label:"Check-ins",           value: fmt(overview.checkedInBookings),  sub:"wamefika tayari",                                                      icon:<LogIn/>,       col:"#16A34A", bg:"#F0FDF4" },
    { label:"StayLocal Revenue",   value:`TZS ${fmt(overview.totalRevenue)}`,sub:"5% service fee",                                                     icon:<TrendingUp/>,  col:"#9333EA", bg:"#FDF4FF" },
    { label:"Logins Leo",          value: fmt(overview.todayLogins),        sub:"users walioingia leo",                                                 icon:<Activity/>,    col:C.primary, bg:"#FFF7ED" },
    { label:"Logins Wiki Hii",     value: fmt(overview.weekLogins),         sub:`${overview.newUsersThisWeek||0} wapya wiki hii`,                       icon:<Calendar/>,    col:"#0284C7", bg:"#F0F9FF" },
  ];
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:14, marginBottom:28 }}>
        {cards.map((c,i) => <FadeIn key={c.label} delay={i*.04}><StatCard {...c}/></FadeIn>)}
      </div>
      <FadeIn>
        <div style={{ background:"white", borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
          <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:9 }}>
            <Activity size={15} color={C.primary}/>
            <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1rem", color:C.dark }}>Shughuli za Hivi Karibuni</h3>
          </div>
          {(!logs||logs.length===0) ? (
            <p style={{ color:C.muted, fontSize:".85rem", textAlign:"center", padding:"40px 0" }}>Hakuna shughuli bado</p>
          ) : (
            <div>
              {logs.slice(0,15).map((l,i) => (
                <div key={l.id||i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 22px", borderBottom:i<Math.min(logs.length,15)-1?`1px solid ${C.border}`:"none", transition:"background .12s" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:l.event==="register"?"#DCFCE7":"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {l.event==="register" ? <UserPlus size={14} color={C.success}/> : <LogIn size={14} color="#2563EB"/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:".84rem", fontWeight:600, color:C.dark, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{l.userName}</div>
                    <div style={{ fontSize:".72rem", color:C.muted, display:"flex", gap:6, marginTop:1 }}>
                      <span style={{ background:l.event==="register"?"#DCFCE7":"#EFF6FF", color:l.event==="register"?C.success:"#2563EB", fontWeight:700, padding:"1px 7px", borderRadius:6, fontSize:".65rem" }}>{l.event==="register"?"AKAUNTI MPYA":"LOGIN"}</span>
                      {l.role}
                    </div>
                  </div>
                  <div style={{ fontSize:".7rem", color:C.muted, whiteSpace:"nowrap" }}>{new Date(l.timestamp).toLocaleString("sw-TZ",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

// ─── SUPER ADMIN: USERS TAB ──────────────────────────────
function AdminUsersTab({ users }) {
  const [filter, setFilter] = useState("all");
  const displayed = filter==="all" ? users : users.filter(u=>u.role===filter);
  const roleBadge = role => {
    const map = { guest:["#EFF6FF","#2563EB","Guest"], host:["#FEF3C7",C.warning,"Host"], admin:["#FEE2E2",C.error,"Admin"] };
    const [bg,col,label] = map[role]||["#F3F4F6","#6B7280",role];
    return <span style={{ fontSize:".64rem", fontWeight:700, padding:"2px 9px", borderRadius:10, background:bg, color:col, textTransform:"uppercase" }}>{label}</span>;
  };
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {[["all","Wote"],["guest","Wageni"],["host","Landlords"],["admin","Admins"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${filter===v?C.primary:C.border}`, background:filter===v?C.primaryFaint:"white", color:filter===v?C.primary:C.muted, fontSize:".78rem", fontWeight:filter===v?700:500, cursor:"pointer" }}>{l}</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:".78rem", color:C.muted, alignSelf:"center" }}>{displayed.length} users</span>
      </div>
      <div style={{ background:"white", borderRadius:14, overflow:"hidden", boxShadow:`0 3px 14px rgba(44,24,16,.06)` }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".82rem" }}>
            <thead>
              <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                {["Jina","Email","Role","Alijiunga","Mara za Kuingia","Bookings","Mara ya Mwisho"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:C.muted, fontSize:".7rem", textTransform:"uppercase", letterSpacing:.4, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((u,i)=>(
                <tr key={u.id} style={{ borderBottom:i<displayed.length-1?`1px solid ${C.border}`:"none" }}>
                  <td style={{ padding:"11px 14px", fontWeight:600, color:C.dark }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:C.primaryFaint, display:"flex", alignItems:"center", justifyContent:"center", color:C.primary, fontWeight:700, fontSize:".7rem", flexShrink:0 }}>
                        {u.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding:"11px 14px", color:C.muted }}>{u.email}</td>
                  <td style={{ padding:"11px 14px" }}>{roleBadge(u.role)}</td>
                  <td style={{ padding:"11px 14px", color:C.muted, whiteSpace:"nowrap" }}>{u.createdAt||"—"}</td>
                  <td style={{ padding:"11px 14px", fontWeight:700, color:C.dark, textAlign:"center" }}>{u.loginCount||0}</td>
                  <td style={{ padding:"11px 14px", fontWeight:700, color:C.primary, textAlign:"center" }}>{u.totalBookings||0}</td>
                  <td style={{ padding:"11px 14px", color:C.muted, whiteSpace:"nowrap", fontSize:".72rem" }}>{u.lastLogin?new Date(u.lastLogin).toLocaleString("sw-TZ",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"Haijaingia"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SUPER ADMIN: BOOKINGS TAB ───────────────────────────
function AdminBookingsTab({ bookings, showToast, onRefresh }) {
  const [filter, setFilter] = useState("all");
  const displayed = filter==="all" ? bookings : bookings.filter(b=>b.status===filter);
  const fmt = n => n?.toLocaleString()||"0";

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) { showToast(`Status imebadilishwa: ${status}`); onRefresh(); }
    } catch { showToast("Tatizo la network","error"); }
  };

  const statusBadge = status => {
    const map = { confirmed:["#DCFCE7",C.success,"Imethibitishwa"], pending:["#FEF3C7",C.warning,"Inasubiri"], cancelled:["#FEE2E2",C.error,"Imefutwa"], "checked-in":["#EDE9FE","#7C3AED","Check-in"] };
    const [bg,col,label] = map[status]||["#F3F4F6","#6B7280",status];
    return <span style={{ fontSize:".64rem", fontWeight:700, padding:"2px 9px", borderRadius:10, background:bg, color:col, whiteSpace:"nowrap" }}>{label}</span>;
  };

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {[["all","Zote"],["confirmed","Zilizothibitishwa"],["pending","Zinazosubiri"],["checked-in","Check-in"],["cancelled","Zilizofutwa"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${filter===v?C.primary:C.border}`, background:filter===v?C.primaryFaint:"white", color:filter===v?C.primary:C.muted, fontSize:".78rem", fontWeight:filter===v?700:500, cursor:"pointer" }}>{l}</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:".78rem", color:C.muted, alignSelf:"center" }}>{displayed.length} bookings</span>
      </div>
      <div style={{ background:"white", borderRadius:14, overflow:"hidden", boxShadow:`0 3px 14px rgba(44,24,16,.06)` }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".82rem" }}>
            <thead>
              <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                {["#","Mgeni","Nyumba","Landlord","Tarehe","Jumla","Status","Hatua"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:C.muted, fontSize:".7rem", textTransform:"uppercase", letterSpacing:.4, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length===0 ? (
                <tr><td colSpan={8} style={{ padding:"40px", textAlign:"center", color:C.muted }}>Hakuna bookings</td></tr>
              ) : displayed.map((b,i)=>(
                <tr key={b.id} style={{ borderBottom:i<displayed.length-1?`1px solid ${C.border}`:"none" }}>
                  <td style={{ padding:"11px 14px", color:C.muted, fontWeight:600 }}>#{b.id}</td>
                  <td style={{ padding:"11px 14px", fontWeight:600, color:C.dark, whiteSpace:"nowrap" }}>
                    {b.guestName||"—"}
                    {b.guestEmail&&<div style={{ fontSize:".7rem", color:C.muted }}>{b.guestEmail}</div>}
                  </td>
                  <td style={{ padding:"11px 14px", color:C.brown, maxWidth:180 }}>
                    <div style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.propertyTitle}</div>
                    {b.propertyLocation&&<div style={{ fontSize:".7rem", color:C.muted }}>{b.propertyLocation}</div>}
                  </td>
                  <td style={{ padding:"11px 14px", color:C.muted, whiteSpace:"nowrap" }}>{b.hostName||"—"}</td>
                  <td style={{ padding:"11px 14px", color:C.muted, whiteSpace:"nowrap", fontSize:".78rem" }}>{b.checkIn} → {b.checkOut}<div style={{ fontSize:".7rem" }}>{b.nights}n · {b.guests}g</div></td>
                  <td style={{ padding:"11px 14px", fontWeight:700, color:C.primary, whiteSpace:"nowrap" }}>TZS {fmt(b.total)}</td>
                  <td style={{ padding:"11px 14px" }}>{statusBadge(b.status)}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", gap:5, flexWrap:"nowrap" }}>
                      {b.status==="confirmed" && <button onClick={()=>updateStatus(b.id,"checked-in")} style={{ fontSize:".68rem", padding:"4px 9px", borderRadius:6, background:"#EDE9FE", color:"#7C3AED", border:"none", cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>✓ Check-in</button>}
                      {b.status!=="cancelled" && b.status!=="checked-in" && <button onClick={()=>updateStatus(b.id,"cancelled")} style={{ fontSize:".68rem", padding:"4px 9px", borderRadius:6, background:"#FEE2E2", color:C.error, border:"none", cursor:"pointer", fontWeight:600 }}>Futa</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SUPER ADMIN: PAYMENTS TAB ───────────────────────────
function AdminPaymentsTab({ transactions, overview }) {
  const fmt = n => n?.toLocaleString()||"0";
  const statusBadge = status => {
    const map = { completed:["#DCFCE7",C.success,"Imekamilika"], pending:["#FEF3C7",C.warning,"Inasubiri"], failed:["#FEE2E2",C.error,"Imeshindwa"] };
    const [bg,col,label] = map[status]||["#F3F4F6","#6B7280",status];
    return <span style={{ fontSize:".64rem", fontWeight:700, padding:"2px 9px", borderRadius:10, background:bg, color:col }}>{label}</span>;
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Jumla ya Malipo" value={`TZS ${fmt(overview.totalBookingValue)}`} sub="thamani ya bookings" bg="#F0FDF4" col={C.success}/>
        <StatCard label="Fee ya StayLocal" value={`TZS ${fmt(overview.totalRevenue)}`} sub="5% ya kila booking" bg="#FDF4FF" col="#9333EA"/>
        <StatCard label="Miamala Yote" value={fmt(transactions?.length)} sub="transactions zote" bg="#EFF6FF" col="#2563EB"/>
        <StatCard label="Zilizokamilika" value={fmt(transactions?.filter(t=>t.status==="completed").length)} sub="malipo yaliyofanikiwa" bg="#DCFCE7" col={C.success}/>
      </div>
      <div style={{ background:"white", borderRadius:14, overflow:"hidden", boxShadow:`0 3px 14px rgba(44,24,16,.06)` }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
          <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1rem", color:C.dark }}>Miamala ya AzamPesa</h3>
          <p style={{ fontSize:".78rem", color:C.muted, marginTop:2 }}>Malipo yote yaliyopita kwenye mfumo wa StayLocal</p>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".82rem" }}>
            <thead>
              <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                {["Transaction ID","Booking","User ID","Kiasi","Namba ya Simu","Mtoa Huduma","Mode","Status","Tarehe"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:C.muted, fontSize:".7rem", textTransform:"uppercase", letterSpacing:.4, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(!transactions||transactions.length===0) ? (
                <tr><td colSpan={9} style={{ padding:"40px", textAlign:"center", color:C.muted }}>Hakuna miamala bado</td></tr>
              ) : transactions.map((t,i)=>(
                <tr key={t.id||i} style={{ borderBottom:i<transactions.length-1?`1px solid ${C.border}`:"none" }}>
                  <td style={{ padding:"11px 14px", fontFamily:"monospace", fontSize:".72rem", color:C.muted }}>{t.azamTransactionId||"—"}</td>
                  <td style={{ padding:"11px 14px", color:C.muted }}>#{t.bookingId||"—"}</td>
                  <td style={{ padding:"11px 14px", color:C.muted }}>{t.userId||"—"}</td>
                  <td style={{ padding:"11px 14px", fontWeight:700, color:C.primary, whiteSpace:"nowrap" }}>TZS {fmt(t.amount)}</td>
                  <td style={{ padding:"11px 14px", color:C.dark }}>{t.phone||"—"}</td>
                  <td style={{ padding:"11px 14px" }}><span style={{ fontSize:".72rem", background:C.bg, padding:"2px 9px", borderRadius:8, color:C.brown, fontWeight:600 }}>{t.provider||"—"}</span></td>
                  <td style={{ padding:"11px 14px" }}><span style={{ fontSize:".68rem", padding:"2px 8px", borderRadius:8, background:t.mode==="flutterwave"?"#DCFCE7":t.mode==="card"?"#EFF6FF":"#FEF3C7", color:t.mode==="flutterwave"?C.success:t.mode==="card"?"#2563EB":C.warning, fontWeight:700 }}>{t.mode==="flutterwave"?"FLUTTERWAVE":t.mode==="card"?"CARD":"SANDBOX"}</span></td>
                  <td style={{ padding:"11px 14px" }}>{statusBadge(t.status)}</td>
                  <td style={{ padding:"11px 14px", color:C.muted, fontSize:".72rem", whiteSpace:"nowrap" }}>{t.createdAt?new Date(t.createdAt).toLocaleString("sw-TZ",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SUPER ADMIN: PROPERTIES TAB ─────────────────────────
function AdminPropertiesTab({ propertyRequests, setPropertyRequests, showToast }) {
  const approve = id => { setPropertyRequests(p=>p.map(r=>r.id===id?{...r,status:"approved"}:r)); showToast("Nyumba imeidhinishwa na imewekwa kwenye orodha!"); };
  const reject  = id => { setPropertyRequests(p=>p.map(r=>r.id===id?{...r,status:"rejected"}:r)); showToast("Nyumba imekataliwa.","error"); };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
        {[["Zinazosubiri",propertyRequests.filter(r=>r.status==="pending").length,"#FEF3C7",C.warning],["Zilizoidhinishwa",propertyRequests.filter(r=>r.status==="approved").length,"#DCFCE7",C.success],["Zilizokataliwa",propertyRequests.filter(r=>r.status==="rejected").length,"#FEE2E2",C.error]].map(([l,v,bg,col])=>(
          <FadeIn key={l}><StatCard label={l} value={v} bg={bg} col={col}/></FadeIn>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {propertyRequests.length===0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}><FileText size={36} style={{ marginBottom:12, opacity:.28 }}/><p>Hakuna maombi bado</p></div>
        ) : propertyRequests.map((r,i)=>(
          <FadeIn key={r.id} delay={i*.05}>
            <div style={{ background:"white", borderRadius:14, padding:"20px 24px", boxShadow:`0 3px 14px rgba(44,24,16,.07)`, border:`1px solid ${r.status==="pending"?C.border:r.status==="approved"?"#BBF7D0":"#FECACA"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:14 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}>
                    <h3 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.05rem", color:C.dark }}>{r.title}</h3>
                    <span style={{ fontSize:".68rem", fontWeight:700, padding:"2px 9px", borderRadius:12, textTransform:"uppercase", background:r.status==="pending"?"#FEF3C7":r.status==="approved"?"#DCFCE7":"#FEE2E2", color:r.status==="pending"?C.warning:r.status==="approved"?C.success:C.error }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize:".8rem", color:C.muted, display:"flex", alignItems:"center", gap:4 }}><MapPin size={11}/>{r.location}</div>
                </div>
                <div style={{ fontSize:".85rem", color:C.muted }}>Imewasilishwa: {r.date}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:10, marginBottom:14 }}>
                {[["Landlord",r.hostName],["Simu",r.phone],["Email",r.email],["Aina",r.type],["Bei","TZS "+(r.price||0).toLocaleString()+"/usiku"],["Vyumba/Bafuni",`${r.beds}B / ${r.baths}Ba · ${r.maxGuests} wageni`]].map(([l,v])=>(
                  <div key={l} style={{ background:C.bg, borderRadius:8, padding:"10px 13px" }}>
                    <div style={{ fontSize:".65rem", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.4, marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:".82rem", fontWeight:600, color:C.dark }}>{v}</div>
                  </div>
                ))}
              </div>
              {r.status==="pending" && (
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button onClick={()=>approve(r.id)} className="btn-press" style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 20px", background:C.success, color:"white", border:"none", borderRadius:9, fontWeight:700, cursor:"pointer", fontSize:".83rem" }}><Check size={14}/>Idhinisha & Orodhesha</button>
                  <button onClick={()=>reject(r.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 20px", background:"white", color:C.error, border:`1.5px solid ${C.error}`, borderRadius:9, fontWeight:600, cursor:"pointer", fontSize:".83rem" }}><X size={14}/>Kataa</button>
                  <button onClick={()=>{window.location.href=`tel:${r.phone}`;}} style={{ display:"flex", alignItems:"center", gap:5, padding:"9px 16px", background:"white", color:C.info, border:`1.5px solid #BFDBFE`, borderRadius:9, fontWeight:600, cursor:"pointer", fontSize:".78rem" }}><Phone size={13}/>Piga Simu</button>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── SUPER ADMIN: LANDLORDS TAB ──────────────────────────
function AdminLandlordsTab({ landlords }) {
  const fmt = n => n?.toLocaleString()||"0";
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {(!landlords||landlords.length===0) ? (
          <p style={{ color:C.muted, gridColumn:"1/-1", textAlign:"center", padding:"40px" }}>Hakuna data ya landlords bado</p>
        ) : landlords.map((l,i)=>(
          <FadeIn key={l.landlordId||i} delay={i*.05}>
            <div style={{ background:"white", borderRadius:14, padding:"18px 20px", boxShadow:`0 3px 14px rgba(44,24,16,.07)`, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:C.primaryFaint, display:"flex", alignItems:"center", justifyContent:"center", color:C.primary, fontWeight:700, fontSize:".82rem", flexShrink:0 }}>
                  {(l.landlordName||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:".95rem", color:C.dark }}>{l.landlordName}</div>
                  {l.email&&<div style={{ fontSize:".72rem", color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.email}</div>}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {[["Nyumba",l.propertyCount||0,"#EFF6FF","#2563EB"],["Bookings Zote",l.totalBookings||0,"#FEF3C7",C.warning],["Zilizothibitishwa",l.confirmedBookings||0,"#DCFCE7",C.success],["Zilizofutwa",l.cancelledBookings||0,"#FEE2E2",C.error]].map(([label,value,bg,col])=>(
                  <div key={label} style={{ background:bg, borderRadius:8, padding:"10px 12px", border:`1px solid ${col}22` }}>
                    <div style={{ fontSize:".62rem", fontWeight:700, color:col, textTransform:"uppercase", letterSpacing:.3 }}>{label}</div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:"1.4rem", fontWeight:900, color:col, lineHeight:1.1 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                <div style={{ fontSize:".72rem", color:C.muted, marginBottom:2 }}>Mapato (5% service fee)</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:"1.1rem", fontWeight:900, color:C.success }}>TZS {fmt(l.revenue||0)}</div>
                <div style={{ fontSize:".7rem", color:C.muted }}>Thamani ya bookings: TZS {fmt(l.bookingValue||0)}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────
function AdminPage({ propertyRequests, setPropertyRequests, showToast, user, setPage }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch { /* show stale data */ }
    setLoadingStats(false);
  }, []);

  useEffect(() => { if (user?.role==="admin") fetchStats(); }, [user, fetchStats]);

  if (!user||user.role!=="admin") return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4%" }}>
      <div style={{ textAlign:"center", maxWidth:420 }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <Shield size={32} color={C.error}/>
        </div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.6rem", color:C.dark, marginBottom:10 }}>Hauna Ruhusa</h2>
        <p style={{ color:C.muted, marginBottom:24 }}>Ukurasa huu ni wa Super Admin pekee ya StayLocal.</p>
        <button onClick={()=>setPage("auth")} style={{ padding:"10px 24px", background:C.primary, color:"white", border:"none", borderRadius:9, fontWeight:700, cursor:"pointer" }}>Ingia kama Admin</button>
      </div>
    </div>
  );

  const tabs = [
    { id:"overview",   label:"Muhtasari",  icon:<BarChart3  size={16}/>, count: null },
    { id:"users",      label:"Watumiaji",  icon:<Users      size={16}/>, count: stats?.overview?.totalUsers },
    { id:"bookings",   label:"Bookings",   icon:<BookOpen   size={16}/>, count: stats?.overview?.totalBookings },
    { id:"payments",   label:"Malipo",     icon:<CreditCard size={16}/>, count: stats?.paymentTransactions?.length },
    { id:"properties", label:"Nyumba",     icon:<Home       size={16}/>, count: propertyRequests.filter(r=>r.status==="pending").length },
    { id:"landlords",  label:"Landlords",  icon:<Building   size={16}/>, count: stats?.bookingsByLandlord?.length },
  ];

  const DARK = "#0F1923";
  const DARK2 = "#1A2535";
  const DARK3 = "#243040";

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      {/* SIDEBAR */}
      <div style={{ width: sidebarOpen ? 230 : 60, flexShrink:0, background:DARK, display:"flex", flexDirection:"column", transition:"width .25s ease", overflow:"hidden", position:"sticky", top:0, height:"100vh" }}>
        {/* Logo area */}
        <div style={{ padding:"24px 16px 20px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Shield size={17} color="white"/>
            </div>
            {sidebarOpen && <div>
              <div style={{ color:"white", fontWeight:800, fontSize:".9rem", fontFamily:"Georgia,serif", whiteSpace:"nowrap" }}>StayLocal</div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:".62rem", fontWeight:700, textTransform:"uppercase", letterSpacing:.8 }}>Admin Panel</div>
            </div>}
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:4 }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", background:tab===t.id?`${C.primary}22`:"transparent", color:tab===t.id?"white":"rgba(255,255,255,.52)", cursor:"pointer", fontWeight:tab===t.id?700:500, fontSize:".84rem", textAlign:"left", transition:"all .15s", position:"relative", outline:"none" }}>
              <span style={{ flexShrink:0, color:tab===t.id?C.primaryLight:"rgba(255,255,255,.4)", display:"flex" }}>{t.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace:"nowrap", flex:1 }}>{t.label}</span>}
              {sidebarOpen && t.count!=null && t.count>0 && <span style={{ fontSize:".64rem", background:tab===t.id?C.primary:"rgba(255,255,255,.12)", color:tab===t.id?"white":"rgba(255,255,255,.6)", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>{t.count}</span>}
              {tab===t.id && <div style={{ position:"absolute", left:0, top:4, bottom:4, width:3, background:C.primary, borderRadius:"0 3px 3px 0" }}/>}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,.08)", display:"flex", flexDirection:"column", gap:6 }}>
          <button onClick={fetchStats} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", background:"transparent", color:"rgba(255,255,255,.45)", cursor:"pointer", fontSize:".82rem", fontWeight:500, transition:"all .15s" }}>
            <RefreshCw size={15} style={{ flexShrink:0 }}/>{sidebarOpen&&"Sasisha Data"}
          </button>
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", background:"transparent", color:"rgba(255,255,255,.35)", cursor:"pointer", fontSize:".82rem", fontWeight:500 }}>
            {sidebarOpen ? <ChevronLeft size={15}/> : <ChevronRight size={15}/>}
            {sidebarOpen&&"Funga Menyu"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
        {/* Top bar */}
        <div style={{ background:"white", borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexShrink:0 }}>
          <div>
            <h2 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1.15rem", color:C.dark }}>
              {tabs.find(t=>t.id===tab)?.label||""}
            </h2>
            <p style={{ fontSize:".75rem", color:C.muted, marginTop:1 }}>
              {tab==="overview" && "Muhtasari kamili wa StayLocal"}
              {tab==="users" && "Watumiaji wote waliojisajili"}
              {tab==="bookings" && "Bookings zote — thibitisha au futa"}
              {tab==="payments" && "Miamala ya AzamPesa"}
              {tab==="properties" && "Maombi ya nyumba — idhinisha au kataa"}
              {tab==="landlords" && "Landlords na takwimu zao"}
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {loadingStats && <div style={{ width:18, height:18, border:`2px solid ${C.border}`, borderTopColor:C.primary, borderRadius:"50%", animation:"spin 1s linear infinite" }}/>}
            <div style={{ display:"flex", alignItems:"center", gap:8, background:C.bg, padding:"7px 13px", borderRadius:9, border:`1px solid ${C.border}` }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:".7rem" }}>
                {user.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:".75rem", fontWeight:700, color:C.dark }}>{user.name}</div>
                <div style={{ fontSize:".62rem", color:C.primary, fontWeight:700, textTransform:"uppercase" }}>Super Admin</div>
              </div>
            </div>
            <button onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 13px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, fontSize:".78rem", color:C.muted, cursor:"pointer", fontWeight:500 }}>
              <Home size={13}/> Nyumbani
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ flex:1, padding:"26px 28px", overflowY:"auto" }}>
          {loadingStats && !stats ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
              <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.primary, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }}/>
              <p style={{ fontFamily:"Georgia,serif", fontSize:"1rem", color:C.brown }}>Inapakia data ya mfumo...</p>
            </div>
          ) : (
            <div key={tab} style={{ animation:"slideUp .25s ease" }}>
              {tab==="overview"   && stats && <AdminOverviewTab   overview={stats.overview} logs={stats.loginLogs}/>}
              {tab==="users"      && stats && <AdminUsersTab      users={stats.users}/>}
              {tab==="bookings"   && stats && <AdminBookingsTab   bookings={stats.bookings} showToast={showToast} onRefresh={fetchStats}/>}
              {tab==="payments"   && stats && <AdminPaymentsTab   transactions={stats.paymentTransactions} overview={stats.overview}/>}
              {tab==="properties" &&          <AdminPropertiesTab propertyRequests={propertyRequests} setPropertyRequests={setPropertyRequests} showToast={showToast}/>}
              {tab==="landlords"  && stats && <AdminLandlordsTab  landlords={stats.bookingsByLandlord}/>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MEMBERS ONLY SECTION ─────────────────────────────────
function MembersSection({ user, setPage, setAuthMode }) {
  const perks = [
    { icon:<Award size={22} color="white"/>, title:"Member-Only Pricing", desc:"Unlock discounted rates on select stays — available exclusively to signed-in StayLocal members." },
    { icon:<Zap size={22} color="white"/>, title:"Priority Booking", desc:"Get early access to newly verified properties before they're open to the public." },
    { icon:<Shield size={22} color="white"/>, title:"Priority Escrow Support", desc:"Jump the queue with faster dispute resolution and a dedicated support line." },
    { icon:<LayoutDashboard size={22} color="white"/>, title:"Your StayLocal Dashboard", desc:"Track bookings, manage saved stays, and — for hosts — monitor earnings, all from one members dashboard." },
  ];

  const goToDashboard = () => {
    if (user.role==="landlord") setPage("dashboard");
    else if (user.role==="admin") setPage("admin");
    else setPage("bookings");
  };

  return (
    <div style={{ background:`linear-gradient(135deg, ${C.dark} 0%, ${C.primaryDark} 100%)`, padding:"70px 4%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%", background:C.primary, opacity:.08, top:-140, left:-100, filter:"blur(70px)", pointerEvents:"none" }}/>
      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(196,98,45,.18)", border:`1px solid rgba(196,98,45,.35)`, borderRadius:20, padding:"6px 16px", color:C.primaryLight, fontSize:".7rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, marginBottom:16 }}>
              <Award size={13}/> StayLocal Members Only
            </span>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:700, color:"white", marginBottom:12 }}>More Perks With a Free Account</h2>
            <p style={{ color:"rgba(255,255,255,.6)", fontSize:".93rem", lineHeight:1.7, maxWidth:560, margin:"0 auto" }}>Create a free StayLocal account to unlock member pricing, priority booking and your own personal dashboard.</p>
          </div>
        </FadeIn>

        <div className="members-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:18, marginBottom:40 }}>
          {perks.map((p,i)=>(
            <FadeIn key={p.title} delay={i*.08}>
              <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:16, padding:22, height:"100%" }}>
                <div style={{ width:44, height:44, borderRadius:12, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>{p.icon}</div>
                <h3 style={{ fontFamily:"Georgia,serif", fontSize:".95rem", color:"white", marginBottom:8 }}>{p.title}</h3>
                <p style={{ fontSize:".8rem", color:"rgba(255,255,255,.5)", lineHeight:1.6 }}>{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={.1}>
          <div style={{ textAlign:"center" }}>
            {user ? (
              <>
                <p style={{ color:"rgba(255,255,255,.7)", fontSize:".9rem", marginBottom:16 }}>Welcome back, <strong style={{ color:"white" }}>{user.name.split(" ")[0]}</strong> — you're a StayLocal member.</p>
                <button onClick={goToDashboard} className="btn-press" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:700, fontSize:".93rem", cursor:"pointer" }}>
                  <LayoutDashboard size={16}/> Go to My Dashboard
                </button>
              </>
            ) : (
              <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={()=>{setAuthMode("register");setPage("auth");}} className="btn-press" style={{ padding:"13px 28px", background:C.primary, color:"white", border:"none", borderRadius:10, fontWeight:700, fontSize:".93rem", cursor:"pointer" }}>Create Free Account</button>
                <button onClick={()=>{setAuthMode("login");setPage("auth");}} style={{ padding:"13px 28px", background:"transparent", color:"white", border:"2px solid rgba(255,255,255,.35)", borderRadius:10, fontWeight:600, fontSize:".93rem", cursor:"pointer" }}>Sign In</button>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────
function HowSection() {
  const steps = [
    { icon:<Search size={24} color="white"/>, title:"Search & Browse", desc:"Filter by location, dates, price and amenities. All listings physically verified by our ground team." },
    { icon:<Phone size={24} color="white"/>, title:"Pay via Mobile Money", desc:"STK Push straight to your phone. M-Pesa, Tigo, Airtel or HaloPesa — no bank card needed." },
    { icon:<Shield size={24} color="white"/>, title:"Escrow Protection", desc:"Your money is locked in escrow until you physically check in and confirm the property." },
    { icon:<Home size={24} color="white"/>, title:"Check In & Enjoy", desc:"Confirm on arrival and the host gets paid 24 hours later. You're protected the entire time." },
  ];
  return (
    <div style={{ background:C.dark, padding:"80px 4%" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FadeIn><div style={{ textAlign:"center", marginBottom:48 }}>
          <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primaryLight, display:"block", marginBottom:8 }}>Simple Process</span>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)", fontWeight:700, color:"white", marginBottom:10 }}>How StayLocal Works</h2>
          <p style={{ color:"rgba(255,255,255,.5)", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>Book a safe, verified stay in Dar es Salaam in just four steps.</p>
        </div></FadeIn>
        <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
          {steps.map((s,i)=>(
            <FadeIn key={i} delay={i*.1}>
              <div style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", borderRadius:16, padding:"28px 22px", textAlign:"center", transition:"background .3s, transform .3s", cursor:"default" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(196,98,45,.14)";e.currentTarget.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.transform="";}}>
                <div style={{ width:54, height:54, borderRadius:14, background:C.primary, margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"Georgia,serif", fontSize:".95rem", color:"white", marginBottom:9 }}>{s.title}</h3>
                <p style={{ fontSize:".8rem", color:"rgba(255,255,255,.5)", lineHeight:1.6 }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ESCROW SECTION ───────────────────────────────────────
function EscrowSection() {
  const steps = [
    { n:1, title:"Book & Initiate", desc:"Select your room and hit Reserve. STK Push sent instantly." },
    { n:2, title:"Funds in Escrow", desc:"Your PIN confirms payment — held safely in StayLocal escrow, not with the host." },
    { n:3, title:"Arrive & Check In", desc:"Inspect the property. Confirm it matches the listing." },
    { n:4, title:"Host Gets Paid", desc:"24 hours after check-in, funds are released to the host's mobile wallet." },
  ];
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 4%" }}>
      <div className="escrow-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>
        <FadeIn dir="left">
          <div>
            <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primary, display:"block", marginBottom:8 }}>Zero Fraud Guarantee</span>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)", fontWeight:700, color:C.dark, marginBottom:14 }}>The StayLocal Escrow System</h2>
            <p style={{ color:C.muted, lineHeight:1.75, marginBottom:26, fontSize:".93rem" }}>Tanzania's biggest rental problem is fake listings and stolen deposits. We solve it entirely through escrow — your money is never at risk.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {steps.map(s=>(
                <div key={s.n} style={{ display:"flex", gap:13, background:"#F5EDE5", borderRadius:12, padding:15, transition:"background .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#EDE0D4"}
                  onMouseLeave={e=>e.currentTarget.style.background="#F5EDE5"}>
                  <div style={{ minWidth:30, height:30, background:C.primary, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:".8rem" }}>{s.n}</div>
                  <div><div style={{ fontWeight:600, fontSize:".85rem", color:C.dark, marginBottom:2 }}>{s.title}</div><div style={{ fontSize:".77rem", color:C.muted, lineHeight:1.5 }}>{s.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn dir="right" delay={.15}>
          <div style={{ background:`linear-gradient(145deg, ${C.dark}, ${C.primaryDark})`, borderRadius:22, padding:32, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:"white", borderRadius:14, padding:20 }}>
              <div style={{ fontSize:".65rem", fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8, display:"flex", alignItems:"center", gap:5 }}><Phone size={11}/> M-Pesa STK Push</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:"1.8rem", fontWeight:900, color:C.primary }}>TZS 185,000</div>
              <div style={{ fontSize:".73rem", color:C.muted, marginBottom:14 }}>StayLocal Escrow · Masaki Ocean Penthouse</div>
              <div style={{ background:C.primary, color:"white", padding:"11px 0", borderRadius:9, textAlign:"center", fontWeight:700, fontSize:".85rem" }}>Enter M-Pesa PIN to Confirm</div>
            </div>
            {[["Funds Status","Held in Escrow"],["Host Receives","After Check-in ✓"],["Your Protection","100% Guaranteed"]].map(([l,v])=>(
              <div key={l} style={{ background:"rgba(255,255,255,.08)", borderRadius:10, padding:"13px 16px" }}>
                <div style={{ fontSize:".65rem", color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:"1.1rem", fontWeight:700, color:C.primaryLight, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── COMPARE SECTION ──────────────────────────────────────
function CompareSection() {
  const rows = [
    ["Payment","Mobile Money (M-Pesa, Tigo, Airtel, Halo)","Visa/Mastercard only","Cash/risky transfer"],
    ["Verification","100% Physical Inspection","Host-uploaded only","None"],
    ["Fraud Protection","Escrow System","Partial","High Risk"],
    ["Support","Local, ground team","International email","None"],
    ["Price","Clear TZS, no hidden fees","FX conversion fees","Hidden commissions"],
  ];
  return (
    <div style={{ background:"#F5EDE5", padding:"80px 4%" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <FadeIn><div style={{ textAlign:"center", marginBottom:40 }}>
          <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primary, display:"block", marginBottom:8 }}>Why Choose Us</span>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)", fontWeight:700, color:C.dark }}>StayLocal vs The Alternatives</h2>
        </div></FadeIn>
        <FadeIn delay={.1}>
          <p className="compare-hint" style={{ display:"none", textAlign:"center", fontSize:".75rem", color:C.muted, marginBottom:8 }}>← Swipe to compare →</p>
          <div style={{ background:"white", borderRadius:18, overflow:"hidden", boxShadow:`0 6px 28px rgba(44,24,16,.08)` }}>
            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
              <table className="compare-table" style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    {[["Feature","#F5EDE5",C.brown],["StayLocal",C.primary,"white"],["Airbnb",C.darkMid,"rgba(255,255,255,.7)"],["Madalali / Brokers",C.brown,"rgba(255,255,255,.6)"]].map(([h,bg,col])=>(
                      <th key={h} style={{ padding:"15px 18px", textAlign:"left", background:bg, color:col, fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:.5, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row,i)=>(
                    <tr key={i}>
                      <td style={{ padding:"13px 18px", borderTop:`1px solid ${C.border}`, fontWeight:600, fontSize:".83rem", color:C.dark, whiteSpace:"nowrap" }}>{row[0]}</td>
                      <td style={{ padding:"13px 18px", borderTop:`1px solid ${C.border}`, background:"rgba(196,98,45,.04)", color:C.primaryDark, fontWeight:500, fontSize:".8rem" }}><span style={{ display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}><CheckCircle size={13} color={C.success}/>{row[1]}</span></td>
                      <td style={{ padding:"13px 18px", borderTop:`1px solid ${C.border}`, fontSize:".8rem", color:C.muted, whiteSpace:"nowrap" }}>{row[2]}</td>
                      <td style={{ padding:"13px 18px", borderTop:`1px solid ${C.border}`, fontSize:".8rem", color:C.muted, whiteSpace:"nowrap" }}>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────
function TestimonialsSection() {
  const ts = [
    { ini:"AM", name:"Amina Mwangi", role:"Corporate Traveler, Arusha", text:"Nilifika Dar es Salaam kwa kazi na niliogopa kupoteza pesa kwa madalali. StayLocal ilinisaidia kupata nyumba nzuri na kulipa kwa M-Pesa. Salama sana!" },
    { ini:"JK", name:"John Kileo", role:"Property Host, Masaki", text:"As a host I now earn predictable income. The escrow builds trust — guests feel safe, and I always receive payment on time directly to my Tigo Pesa wallet." },
    { ini:"FN", name:"Fatuma Ngowi", role:"Family Traveler, Dodoma", text:"I visited Muhimbili Hospital for a month with my family. StayLocal found us a clean, affordable apartment nearby with no middleman drama. Highly recommend!" },
  ];
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 4%" }}>
      <FadeIn><div style={{ textAlign:"center", marginBottom:44 }}>
        <span style={{ fontSize:".68rem", fontWeight:800, textTransform:"uppercase", letterSpacing:2, color:C.primary, display:"block", marginBottom:8 }}>Real Reviews</span>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)", fontWeight:700, color:C.dark }}>What Our Guests Say</h2>
      </div></FadeIn>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:22 }}>
        {ts.map((t,i)=>(
          <FadeIn key={i} delay={i*.1}>
            <div style={{ background:"white", borderRadius:16, padding:26, boxShadow:`0 3px 14px rgba(44,24,16,.06)`, transition:"transform .25s, box-shadow .25s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 30px rgba(44,24,16,.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 3px 14px rgba(44,24,16,.06)";}}>
              <div style={{ fontFamily:"Georgia,serif", fontSize:"2.8rem", color:C.primary, lineHeight:.8, marginBottom:14 }}>"</div>
              <p style={{ fontSize:".85rem", color:C.brown, lineHeight:1.75, marginBottom:18, fontStyle:"italic" }}>{t.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:C.primary, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".78rem" }}>{t.ini}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:".83rem", color:C.dark }}>{t.name}</div>
                  <div style={{ fontSize:".7rem", color:C.muted }}>{t.role}</div>
                </div>
                <div style={{ marginLeft:"auto", display:"flex" }}>{[1,2,3,4,5].map(s=><Star key={s} size={12} fill="#F59E0B" color="#F59E0B"/>)}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── LIST CTA ─────────────────────────────────────────────
function ListCTA({ setPage, user, setAuthMode }) {
  return (
    <div style={{ background:`linear-gradient(135deg, ${C.dark}, ${C.primaryDark})`, padding:"80px 4%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%", background:C.primary, opacity:.07, top:-120, right:-80, filter:"blur(60px)" }}/>
      <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <FadeIn>
          <Trophy size={32} color={C.primaryLight} style={{ marginBottom:16 }}/>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.7rem,3vw,2.6rem)", color:"white", marginBottom:12 }}>Own Property in Dar es Salaam?</h2>
          <p style={{ color:"rgba(255,255,255,.6)", marginBottom:32, fontSize:".95rem", lineHeight:1.7 }}>List it on StayLocal and earn consistent monthly income. We handle verification, payments and escrow — you just host.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>setPage("list")} className="btn-press" style={{ padding:"13px 28px", background:"white", color:C.primary, border:"none", borderRadius:10, fontWeight:700, fontSize:".93rem", cursor:"pointer" }}>List Your Property</button>
            <button onClick={()=>{setAuthMode("register");setPage("auth");}} style={{ padding:"13px 28px", background:"transparent", color:"white", border:"2px solid rgba(255,255,255,.35)", borderRadius:10, fontWeight:600, fontSize:".93rem", cursor:"pointer" }}>Create Host Account</button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer({ setPage }) {
  const cols = [
    { title:"For Guests", links:[["Browse Properties","home"],["How It Works","home"],["Payment Methods","home"],["Guest Safety","home"]] },
    { title:"For Hosts", links:[["List Your Property","list"],["Host Dashboard","dashboard"],["Verification Process","home"],["Earnings","dashboard"]] },
    { title:"Company", links:[["About StayLocal","home"],["Contact Us","home"],["Privacy Policy","home"],["Terms of Service","home"]] },
  ];
  return (
    <footer style={{ background:C.dark, padding:"52px 4% 26px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:36, marginBottom:36 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:32, height:32, background:C.primary, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}><Home size={15} color="white"/></div>
              <span style={{ fontFamily:"Georgia,serif", fontSize:"1.15rem", fontWeight:900, color:C.primary }}>StayLocal</span>
            </div>
            <p style={{ fontSize:".8rem", color:"rgba(255,255,255,.45)", lineHeight:1.7, maxWidth:240 }}>Tanzania's most trusted short-term rental platform. Verified listings. Mobile Money. Zero fraud.</p>
            <div style={{ display:"flex", gap:7, marginTop:16, flexWrap:"wrap" }}>
              {["M-Pesa","Tigo","Airtel","Halo"].map(m=><span key={m} style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.13)", color:"rgba(255,255,255,.6)", padding:"2px 9px", borderRadius:5, fontSize:".67rem", fontWeight:600 }}>{m}</span>)}
            </div>
          </div>
          {cols.map(col=>(
            <div key={col.title}>
              <h4 style={{ color:"white", fontSize:".75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:13 }}>{col.title}</h4>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:9 }}>
                {col.links.map(([label,p])=>(
                  <li key={label}><button onClick={()=>setPage(p)} style={{ background:"none", border:"none", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:".8rem", textAlign:"left", padding:0, transition:"color .2s" }} onMouseEnter={e=>e.currentTarget.style.color=C.primaryLight} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.4)"}>{label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:18, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10, fontSize:".73rem", color:"rgba(255,255,255,.35)" }}>
          <span>© 2026 StayLocal Platforms Ltd. All rights reserved.</span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}><Globe size={11}/>Built for Tanzania · Dar es Salaam</span>
        </div>
      </div>
    </footer>
  );
}
