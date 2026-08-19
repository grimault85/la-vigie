import React from "react";
import { createRoot } from "react-dom/client";
import { LineChart, Line, ComposedChart, Bar, Cell, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const curve=[{label:"Juil 26",to:39.4,adr:301,revpar:119},{label:"Août 26",to:61.3,adr:170,revpar:104}];
const eur2=n=>n+" €", pct=n=>n+" %";
function App(){return(<div>
  <div id="occ" className="card" style={{width:560,height:260}}>
    <ResponsiveContainer width="100%" height={260}><ComposedChart data={curve} margin={{top:8,right:8,left:0,bottom:0}}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E7E0D6" vertical={false}/>
      <XAxis dataKey="label" tick={{fontSize:11,fill:"#7A7268"}}/>
      <YAxis tick={{fontSize:11,fill:"#7A7268"}} domain={[0,100]} tickFormatter={v=>v+"%"}/>
      <Tooltip formatter={v=>pct(v)} labelStyle={{fontWeight:700}}/>
      <Bar dataKey="to" name="Remplissage" radius={[4,4,0,0]}>{curve.map((r,i)=><Cell key={i} fill="#8B9683"/>)}</Bar>
      <ReferenceLine y={50} stroke="#2B2B2B" strokeDasharray="4 3"/>
    </ComposedChart></ResponsiveContainer>
  </div>
  <div id="adr" className="card" style={{width:560,height:240}}>
    <ResponsiveContainer width="100%" height={240}><LineChart data={curve} margin={{top:8,right:12,left:0,bottom:0}}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E7E0D6" vertical={false}/>
      <XAxis dataKey="label" tick={{fontSize:11,fill:"#7A7268"}}/>
      <YAxis tick={{fontSize:11,fill:"#7A7268"}} tickFormatter={v=>v+"€"}/>
      <Tooltip formatter={v=>eur2(v)} labelStyle={{fontWeight:700}}/>
      <Line type="monotone" dataKey="adr" name="ADR" stroke="#B5A18E" strokeWidth={2.5} dot={{r:4,fill:"#B5A18E",stroke:"#fff",strokeWidth:1}} isAnimationActive={false}/>
      <Line type="monotone" dataKey="revpar" name="RevPAR" stroke="#8B9683" strokeWidth={2.5} dot={{r:4,fill:"#8B9683",stroke:"#fff",strokeWidth:1}} isAnimationActive={false}/>
    </LineChart></ResponsiveContainer>
  </div>
</div>);}
createRoot(document.getElementById("root")).render(<App/>);
