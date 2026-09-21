import React, {useMemo, useState} from "react";
import {SafeAreaView, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import {StatusBar} from "expo-status-bar";

const PAIRS = ["CAD/CHF", "EUR/USD", "GBP/USD", "USD/JPY"];
const TF = ["1m", "5m", "15m"];

function pseudoSignal(pair, tf) {
  const n = [...(pair + tf)].reduce((a,c)=>a+c.charCodeAt(0),0);
  const rsi = 30 + (n % 41);
  const ema = n % 3 === 0 ? "Above" : "Below";
  const signal = rsi < 35 ? "BUY" : rsi > 65 ? "SELL" : ema === "Above" ? "BUY" : "WAIT";
  return {rsi, ema, signal};
}

export default function App() {
  const [pair,setPair] = useState("CAD/CHF");
  const [tf,setTf] = useState("5m");
  const data = useMemo(()=>pseudoSignal(pair,tf),[pair,tf]);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light"/>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.brand}>ASIM TRADING</Text>
        <Text style={s.sub}>LIVE MARKET ANALYSIS</Text>

        <View style={s.card}>
          <Text style={s.label}>PAIR</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PAIRS.map(p=>
              <Pressable key={p} onPress={()=>setPair(p)} style={[s.chip,pair===p&&s.chipOn]}>
                <Text style={[s.chipText,pair===p&&s.chipTextOn]}>{p}</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        <View style={s.card}>
          <Text style={s.label}>TIMEFRAME</Text>
          <View style={s.row}>
            {TF.map(t=>
              <Pressable key={t} onPress={()=>setTf(t)} style={[s.tf,tf===t&&s.tfOn]}>
                <Text style={s.tfText}>{t}</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={s.chart}>
          <Text style={s.chartTitle}>{pair}  •  {tf}</Text>
          <View style={s.candles}>
            {[48,75,58,88,68,95,62,80,52,72,60,90].map((h,i)=>
              <View key={i} style={s.candleCol}>
                <View style={[s.wick,{height:h+18}]}/>
                <View style={[s.body,{height:h, marginTop:(100-h)/2}]}/>
              </View>
            )}
          </View>
          <Text style={s.chartNote}>Chart engine ready — live feed will be connected in the next build step.</Text>
        </View>

        <View style={s.signalCard}>
          <Text style={s.signalTitle}>CURRENT ANALYSIS</Text>
          <Text style={s.signal}>{data.signal}</Text>
          <View style={s.metrics}>
            <Metric name="RSI" value={data.rsi}/>
            <Metric name="EMA" value={data.ema}/>
            <Metric name="MACD" value="Pending"/>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.label}>INDICATORS</Text>
          <View style={s.grid}>
            {["RSI","EMA","MACD","Stochastic","Bollinger Bands","Support / Resistance"].map(x=>
              <View style={s.item} key={x}><Text style={s.itemText}>{x}</Text></View>
            )}
          </View>
        </View>

        <View style={s.history}>
          <Text style={s.label}>SIGNAL HISTORY</Text>
          <Text style={s.muted}>No live signals yet. This screen will store BUY / SELL / WAIT results.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({name,value}) {
  return <View style={s.metric}><Text style={s.muted}>{name}</Text><Text style={s.metricValue}>{String(value)}</Text></View>
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#08111f"},
  container:{padding:18,paddingBottom:40},
  brand:{fontSize:25,fontWeight:"800",color:"#fff",letterSpacing:1},
  sub:{color:"#8fa2bb",marginTop:3,marginBottom:18,fontSize:12},
  card:{backgroundColor:"#101d2e",borderRadius:16,padding:14,marginBottom:12},
  label:{color:"#8fa2bb",fontSize:11,fontWeight:"700",marginBottom:10},
  row:{flexDirection:"row",gap:8},
  chip:{paddingVertical:9,paddingHorizontal:13,borderRadius:10,backgroundColor:"#17263a",marginRight:8},
  chipOn:{backgroundColor:"#2d6cdf"},
  chipText:{color:"#b8c6d8",fontWeight:"600"},
  chipTextOn:{color:"#fff"},
  tf:{flex:1,alignItems:"center",padding:10,borderRadius:9,backgroundColor:"#17263a"},
  tfOn:{backgroundColor:"#2d6cdf"},
  tfText:{color:"#fff",fontWeight:"700"},
  chart:{backgroundColor:"#0d1929",borderRadius:16,padding:14,height:245,marginBottom:12},
  chartTitle:{color:"#fff",fontWeight:"700",fontSize:15},
  candles:{height:145,marginTop:14,flexDirection:"row",alignItems:"center",justifyContent:"space-around"},
  candleCol:{width:12,height:130,alignItems:"center",justifyContent:"center"},
  wick:{width:2,backgroundColor:"#94a3b8",position:"absolute"},
  body:{width:9,borderRadius:2,backgroundColor:"#5ee0a0"},
  chartNote:{fontSize:10,color:"#70849e",marginTop:7},
  signalCard:{backgroundColor:"#14243a",borderRadius:16,padding:18,marginBottom:12},
  signalTitle:{color:"#8fa2bb",fontSize:11,fontWeight:"700"},
  signal:{color:"#fff",fontSize:30,fontWeight:"900",marginTop:4},
  metrics:{flexDirection:"row",justifyContent:"space-between",marginTop:15},
  metric:{backgroundColor:"#0d1929",borderRadius:10,padding:10,minWidth:85},
  metricValue:{color:"#fff",fontWeight:"700",marginTop:3},
  muted:{color:"#7f93ad",fontSize:11},
  grid:{flexDirection:"row",flexWrap:"wrap",gap:8},
  item:{backgroundColor:"#17263a",borderRadius:10,padding:11,width:"48%"},
  itemText:{color:"#dbe6f3",fontSize:12,fontWeight:"600"},
  history:{backgroundColor:"#101d2e",borderRadius:16,padding:14}
});
