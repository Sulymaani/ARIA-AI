import { C } from "../../theme"
export function SkeletonLoader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, width:"100%" }}>
      <style>{`
        @keyframes sk1{0%,100%{transform:translate(0,0)}40%{transform:translate(10px,-6px)}70%{transform:translate(-6px,8px)}}
        @keyframes sk2{0%,100%{transform:translate(0,0)}35%{transform:translate(-8px,10px)}65%{transform:translate(12px,-4px)}}
        @keyframes sk3{0%,100%{transform:translate(0,0)}45%{transform:translate(6px,8px)}80%{transform:translate(-10px,-5px)}}
        @keyframes shimmer{0%,100%{opacity:.25}50%{opacity:.5}}
        @keyframes dotPulse{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
      `}</style>
      {[{h:130,w:"100%",a:"sk1 3.2s ease-in-out infinite"},{h:90,w:"72%",a:"sk2 3.8s ease-in-out infinite"},{h:110,w:"88%",a:"sk3 4.1s ease-in-out .4s infinite"}].map((s,i)=>(
        <div key={i} style={{ height:s.h, width:s.w, background:`linear-gradient(120deg,${C.card} 0%,${C.border} 50%,${C.card} 100%)`, borderRadius:16, border:`1px solid ${C.border}`, animation:`${s.a},shimmer 2s ease-in-out ${i*.25}s infinite` }} />
      ))}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:C.text2, fontSize:13, marginTop:4, letterSpacing:"0.06em", fontWeight:500 }}>
        ARIA is thinking
        {[0,1,2].map(i => (
          <span key={i} style={{ width:4, height:4, borderRadius:"50%", background:C.cyan, display:"inline-block", animation:`dotPulse 1.4s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}
