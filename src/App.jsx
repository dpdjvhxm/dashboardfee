import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutDashboard, Table2, PlusCircle, Upload, Search, AlertTriangle, CheckCircle2, Trash2, Download, Plane } from 'lucide-react';

const PAYMENT_KEY = 'sirva-payment-dashboard-records-v1';
const FLIGHT_KEY = 'sirva-flight-booking-records-v1';
const COLORS = ['#22d3ee', '#fb923c', '#a78bfa', '#34d399', '#f472b6', '#facc15'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const sampleRows = [
  { id:'1', country:'Taiwan', invoiceMonth:'Jan', invoiceDate:'2026-01-12', fileNumber:'872156', invoiceNo:'217761', entity:'RFC', employeeId:'CP26773', employeeName:'Ranjan Tukesh', serviceType:'SIRVA Fee', category:'Expat-Relovc', description:'CP26773_Tukesh Ranjan_INV217761_260312', costCenter:'', currency:'USD', amount:987, paymentDate:'2026-05-11', poNumber:'PO312440', iacDocNo:'100003884', paymentItem:'N60', status:'PAID' },
  { id:'2', country:'Taiwan', invoiceMonth:'Feb', invoiceDate:'2026-02-12', fileNumber:'871204', invoiceNo:'217353', entity:'RFC', employeeId:'CP281024', employeeName:'Gattani, Deepesh', serviceType:'Disbursement', category:'Expat-Relovc', description:'CP281024_Deepesh Gattani_INV217353_260312', costCenter:'TR7030000', currency:'USD', amount:8750, paymentDate:'2026-04-24', poNumber:'PO312440', iacDocNo:'100003886', paymentItem:'N30', status:'PAID' },
  { id:'3', country:'Taiwan', invoiceMonth:'Mar', invoiceDate:'2026-03-12', fileNumber:'871359', invoiceNo:'2173532', entity:'CPTW', employeeId:'CP277208', employeeName:'Kwok, Ka Chun', serviceType:'SIRVA Fee', category:'Expat-FurnRent', description:'CP277208_Ken Kwok_INV2173532_260312', costCenter:'TA2102000', currency:'USD', amount:6705, paymentDate:'2026-05-11', poNumber:'PO308846', iacDocNo:'100004327', paymentItem:'N30', status:'PAID' },
  { id:'4', country:'Taiwan', invoiceMonth:'Apr', invoiceDate:'2026-04-02', fileNumber:'873160', invoiceNo:'218073', entity:'CPTW', employeeId:'CP279328', employeeName:'Chi, Xiang', serviceType:'Disbursement', category:'Expat-Transport', description:'CP79328_Tina X Chi_INV218073_260402', costCenter:'TA2102000', currency:'USD', amount:21623, paymentDate:'2026-06-01', poNumber:'PO308846', iacDocNo:'100005725', paymentItem:'N30', status:'PAID' },
  { id:'5', country:'Singapore', invoiceMonth:'Apr', invoiceDate:'2026-04-02', fileNumber:'875725', invoiceNo:'2180374', entity:'CPTW', employeeId:'CP278355', employeeName:'Kumar, Dinesh', serviceType:'SIRVA Fee', category:'Expat-Relovc', description:'CP278355_Dinesh Kumar_INV2180374_260402', costCenter:'', currency:'USD', amount:1930, paymentDate:'2026-06-01', poNumber:'PO308846', iacDocNo:'100005725', paymentItem:'N60', status:'PAID' }
];

const sampleFlights = [
  { id:'f1', bookingDate:'2026-05-04', category:'Repat', employeeId:'CP226805', employeeName:'Deepak Malani', pil:'N', entity:'Coupang, Corp.', caseManager:'Mathilde', passengerName:'MALANI/DEEPAK KUMAR MR', relationship:'Employee', departureDate1:'2026-05-10', departureDate2:'', departure1:'ICN', departure2:'BLR', airfare:1628000, trxFee:62700, card:'XXXXXXXXXXXX2880', remark:'', iaccDetail:'CP226805_Deepak Malani(E)', costCenter:'A70001131', status:'BOOKED' },
  { id:'f2', bookingDate:'2026-05-04', category:'HLF', employeeId:'CP280842', employeeName:'Shinae SA Kang', pil:'N', entity:'Coupang, Corp.', caseManager:'Grace', passengerName:'KANG/SHINAE MS', relationship:'Employee', departureDate1:'2026-07-25', departureDate2:'2026-08-08', departure1:'ICN', departure2:'IAD', airfare:4263500, trxFee:164100, card:'XXXXXXXXXXXX2880', remark:'', iaccDetail:'CP280842_Shinae SA Kang(E)', costCenter:'A11080000', status:'BOOKED' },
  { id:'f3', bookingDate:'2026-05-06', category:'HLF', employeeId:'CP176840', employeeName:'San Baek', pil:'N', entity:'Coupang, Corp.', caseManager:'Lee', passengerName:'BAEK/SAN MR', relationship:'Employee', departureDate1:'2026-05-16', departureDate2:'', departure1:'ICN', departure2:'TRV', airfare:1134000, trxFee:0, card:'XXXXXXXXXXXX2880', remark:'수기매입', iaccDetail:'CP176840_San Baek(E)', costCenter:'A12041000', status:'BOOKED' },
  { id:'f4', bookingDate:'2026-05-06', category:'HLF', employeeId:'CP176840', employeeName:'San Baek', pil:'N', entity:'Coupang, Corp.', caseManager:'Lee', passengerName:'BAEK/HA RU MISS', relationship:'Child', departureDate1:'2026-06-16', departureDate2:'2026-06-20', departure1:'ICN', departure2:'HNL', airfare:2211600, trxFee:85100, card:'XXXXXXXXXXXX2880', remark:'', iaccDetail:'CP176840_San Baek(C)', costCenter:'A12041000', status:'BOOKED' },
  { id:'f5', bookingDate:'2026-05-07', category:'HLF', employeeId:'CP257135', employeeName:'Sam Bae', pil:'N', entity:'Coupang, Corp.', caseManager:'Mathilde', passengerName:'BAE/SOPHIA YERANG MS', relationship:'Child', departureDate1:'2026-08-01', departureDate2:'2026-08-09', departure1:'ICN', departure2:'SYD', airfare:2718800, trxFee:104700, card:'XXXXXXXXXXXX2880', remark:'', iaccDetail:'CP257135_Sam Bae(C)', costCenter:'A70108000', status:'BOOKED' }
];

const paymentFields = ['country','invoiceMonth','invoiceDate','fileNumber','invoiceNo','entity','employeeId','employeeName','serviceType','category','description','costCenter','currency','amount','paymentDate','poNumber','iacDocNo','paymentItem','status'];
const paymentLabels = { country:'Country', invoiceMonth:'Invoice Month', invoiceDate:'Invoice Date', fileNumber:'File Number', invoiceNo:'Invoice No', entity:'Entity', employeeId:'Employee ID', employeeName:'Employee Name', serviceType:'Service Type', category:'Category', description:'Text Description', costCenter:'Cost Center', currency:'Currency', amount:'Amount', paymentDate:'Payment Date', poNumber:'PO', iacDocNo:'IAC Doc #', paymentItem:'PO Payment Item', status:'Status' };
const flightFields = ['bookingDate','category','employeeId','employeeName','pil','entity','caseManager','passengerName','relationship','departureDate1','departureDate2','departure1','departure2','airfare','trxFee','card','remark','iaccDetail','costCenter','status'];
const flightLabels = { bookingDate:'Booking Date', category:'Category', employeeId:'EE ID', employeeName:'Employee Name', pil:'PIL', entity:'Entity', caseManager:'Case Manager', passengerName:'Passenger Name', relationship:'Relationship', departureDate1:'Departure Date 1', departureDate2:'Departure Date 2', departure1:'Departure 1', departure2:'Departure 2', airfare:'Airfare', trxFee:'TRX Fee', card:'CARD', remark:'Remark', iaccDetail:'iACC Detail', costCenter:'Cost Center', status:'Status' };

function load(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function save(key, rows){ localStorage.setItem(key, JSON.stringify(rows)); }
function num(v){ return Number(String(v ?? 0).replace(/[$,]/g,'')) || 0; }
function monthFromDate(d){ const m = new Date(d).getMonth(); return Number.isFinite(m) && m >= 0 ? months[m] : 'Unknown'; }
function monthIndex(m){ return months.indexOf(String(m).slice(0,3)); }
function getRaw(raw, ...names){ for (const n of names){ const k = Object.keys(raw).find(x => x.trim().toLowerCase() === n.toLowerCase()); if(k) return raw[k]; } return ''; }
function paymentDupKey(r){ return [r.invoiceNo, r.employeeId, r.fileNumber, r.amount].map(v=>String(v||'').trim().toLowerCase()).join('|'); }
function flightDupKey(r){ return [r.bookingDate, r.employeeId, r.passengerName, r.departureDate1, r.departure1, r.departure2, r.airfare].map(v=>String(v||'').trim().toLowerCase()).join('|'); }
function makeExcelDate(v){ if(typeof v === 'number'){ const d = XLSX.SSF.parse_date_code(v); if(d) return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`; } return String(v || ''); }

function normalizePayment(raw){ return { id:crypto.randomUUID(), country:getRaw(raw,'Country') || 'Unknown', invoiceMonth:getRaw(raw,'Invoice Month','Month','Invoice date (Month)') || '', invoiceDate:makeExcelDate(getRaw(raw,'Invoice Date','Invoice date')), fileNumber:getRaw(raw,'File Number','File Num','File No') || '', invoiceNo:getRaw(raw,'Invoice No','Invoice Number','Invoice No.') || '', entity:getRaw(raw,'Entity') || '', employeeId:getRaw(raw,'Employee ID','Employee','EE ID') || '', employeeName:getRaw(raw,'Employee Name') || '', serviceType:getRaw(raw,'SIRVA service type','Service Type','Sirva Service Type') || '', category:getRaw(raw,'Category','Item','Item Details') || '', description:getRaw(raw,'Text Description (A/C)','Text Description','Description') || '', costCenter:getRaw(raw,'Cost Center','Cost Cen') || '', currency:getRaw(raw,'Currency') || 'USD', amount:num(getRaw(raw,'Amount','USD','Invoice Amount','Total Amount','Payment Amount')), paymentDate:makeExcelDate(getRaw(raw,'Payment Date')), poNumber:getRaw(raw,'PO','PO Number') || '', iacDocNo:getRaw(raw,'IAC Doc #','IAC Doc','IAC Document') || '', paymentItem:getRaw(raw,'PO Payment Item','Payment Item') || '', status:getRaw(raw,'Status') || 'RECEIVED' }; }
function normalizeFlight(raw){ return { id:crypto.randomUUID(), bookingDate:makeExcelDate(getRaw(raw,'Booking Date','Booking Dat')), category:getRaw(raw,'Category') || '', employeeId:getRaw(raw,'EE ID','Employee ID','Employee') || '', employeeName:getRaw(raw,'Employee Name') || '', pil:getRaw(raw,'Pil','PIL') || '', entity:getRaw(raw,'Entity') || '', caseManager:getRaw(raw,'Case Manager') || '', passengerName:getRaw(raw,'Passenger Name') || '', relationship:getRaw(raw,'Relationship') || '', departureDate1:makeExcelDate(getRaw(raw,'Departure Date 1','Departure Date')), departureDate2:makeExcelDate(getRaw(raw,'Departure Date 2')), departure1:getRaw(raw,'Departure 1','Departure') || '', departure2:getRaw(raw,'Departure 2') || '', airfare:num(getRaw(raw,'Airfare')), trxFee:num(getRaw(raw,'TRX Fee','TRX fee')), card:getRaw(raw,'CARD','Card') || '', remark:getRaw(raw,'Remark') || '', iaccDetail:getRaw(raw,'iACC Detail','iAC Detail','IACC Detail') || '', costCenter:getRaw(raw,'Cost Center') || '', status:getRaw(raw,'Status') || 'BOOKED' }; }

function App(){
  const [payments, setPayments] = useState(()=>load(PAYMENT_KEY, sampleRows));
  const [flights, setFlights] = useState(()=>load(FLIGHT_KEY, sampleFlights));
  const [view, setView] = useState('paymentDashboard');
  const [query, setQuery] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ country:'Taiwan', invoiceMonth:'Apr', invoiceDate:'2026-04-02', fileNumber:'', invoiceNo:'', entity:'CPTW', employeeId:'', employeeName:'', serviceType:'SIRVA Fee', category:'Expat-Relovc', description:'', costCenter:'', currency:'USD', amount:'', paymentDate:'', poNumber:'', iacDocNo:'', paymentItem:'', status:'RECEIVED' });
  const [flightForm, setFlightForm] = useState({ bookingDate:'2026-05-06', category:'HLF', employeeId:'', employeeName:'', pil:'N', entity:'Coupang, Corp.', caseManager:'', passengerName:'', relationship:'Employee', departureDate1:'', departureDate2:'', departure1:'ICN', departure2:'', airfare:'', trxFee:'', card:'XXXXXXXXXXXX2880', remark:'', iaccDetail:'', costCenter:'', status:'BOOKED' });

  const setPaymentSave = next => { setPayments(next); save(PAYMENT_KEY, next); };
  const setFlightSave = next => { setFlights(next); save(FLIGHT_KEY, next); };

  const payStats = useMemo(()=>{
    const total = payments.reduce((s,r)=>s+num(r.amount),0);
    const sirva = payments.filter(r=>String(r.serviceType).toLowerCase().includes('sirva')).reduce((s,r)=>s+num(r.amount),0);
    const disb = payments.filter(r=>String(r.serviceType).toLowerCase().includes('disbur')).reduce((s,r)=>s+num(r.amount),0);
    const countries = [...new Set(payments.map(r=>r.country || 'Unknown'))];
    const byCountry = countries.map(c=>({ country:c, total:payments.filter(r=>r.country===c).reduce((s,r)=>s+num(r.amount),0), sirva:payments.filter(r=>r.country===c && String(r.serviceType).toLowerCase().includes('sirva')).reduce((s,r)=>s+num(r.amount),0), disbursement:payments.filter(r=>r.country===c && String(r.serviceType).toLowerCase().includes('disbur')).reduce((s,r)=>s+num(r.amount),0)}));
    const byMonth = months.map(m=>({ month:m, SIRVA:payments.filter(r=>monthIndex(r.invoiceMonth)===monthIndex(m) && String(r.serviceType).toLowerCase().includes('sirva')).reduce((s,r)=>s+num(r.amount),0), Disbursement:payments.filter(r=>monthIndex(r.invoiceMonth)===monthIndex(m) && String(r.serviceType).toLowerCase().includes('disbur')).reduce((s,r)=>s+num(r.amount),0)}));
    return { total, sirva, disb, byCountry, byMonth };
  },[payments]);

  const flightStats = useMemo(()=>{
    const totalAirfare = flights.reduce((s,r)=>s+num(r.airfare),0);
    const totalTrx = flights.reduce((s,r)=>s+num(r.trxFee),0);
    const pax = flights.length;
    const employees = new Set(flights.map(r=>r.employeeId).filter(Boolean)).size;
    const byMonth = months.map(m=>({ month:m, Airfare:flights.filter(r=>monthFromDate(r.bookingDate)===m).reduce((s,r)=>s+num(r.airfare),0), TRX:flights.filter(r=>monthFromDate(r.bookingDate)===m).reduce((s,r)=>s+num(r.trxFee),0), Count:flights.filter(r=>monthFromDate(r.bookingDate)===m).length }));
    const byCategory = [...new Set(flights.map(r=>r.category || 'Unknown'))].map(category=>({ category, amount:flights.filter(r=>(r.category||'Unknown')===category).reduce((s,r)=>s+num(r.airfare)+num(r.trxFee),0), count:flights.filter(r=>(r.category||'Unknown')===category).length }));
    const byRelation = [...new Set(flights.map(r=>r.relationship || 'Unknown'))].map(name=>({ name, value:flights.filter(r=>(r.relationship||'Unknown')===name).length }));
    const byManager = [...new Set(flights.map(r=>r.caseManager || 'Unassigned'))].map(name=>({ name, count:flights.filter(r=>(r.caseManager||'Unassigned')===name).length }));
    return { totalAirfare, totalTrx, pax, employees, byMonth, byCategory, byRelation, byManager };
  },[flights]);

  const isFlight = view.startsWith('flight');
  const titleMap = { paymentDashboard:'Sirva Payment Dashboard', paymentTable:'Payment Tracker', paymentForm:'Payment 개별 등록', paymentUpload:'Payment Excel Upload', flightDashboard:'Flight Booking Dashboard', flightTable:'항공권 데이터 관리', flightForm:'항공권 개별 등록', flightUpload:'항공권 Excel Upload' };
  const filteredPayments = payments.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));
  const filteredFlights = flights.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));

  function addPayment(e){ e.preventDefault(); const record={...paymentForm,id:crypto.randomUUID(),amount:num(paymentForm.amount)}; if(payments.some(r=>paymentDupKey(r)===paymentDupKey(record))) return alert('중복 Payment 데이터입니다.'); setPaymentSave([record,...payments]); setView('paymentTable'); }
  function addFlight(e){ e.preventDefault(); const record={...flightForm,id:crypto.randomUUID(),airfare:num(flightForm.airfare),trxFee:num(flightForm.trxFee)}; if(flights.some(r=>flightDupKey(r)===flightDupKey(record))) return alert('중복 항공권 데이터입니다.'); setFlightSave([record,...flights]); setFlightForm({...flightForm, employeeId:'', employeeName:'', passengerName:'', airfare:'', trxFee:'', iaccDetail:''}); setView('flightTable'); }

  async function onUpload(e, type){
    const file = e.target.files?.[0]; if(!file) return;
    const data = await file.arrayBuffer(); const wb = XLSX.read(data); const sheet = wb.Sheets[wb.SheetNames[0]]; const json = XLSX.utils.sheet_to_json(sheet, { defval:'' });
    if(type==='flight'){
      const incoming = json.map(normalizeFlight).filter(r=>r.employeeId || r.passengerName || r.bookingDate);
      const keys = new Set(flights.map(flightDupKey)); const fresh=[]; const duplicated=[];
      incoming.forEach(r=>{ const k=flightDupKey(r); if(keys.has(k)) duplicated.push(r); else { keys.add(k); fresh.push(r); }});
      setFlightSave([...fresh,...flights]); setUploadResult({ type, total:incoming.length, inserted:fresh.length, duplicated:duplicated.length });
    } else {
      const incoming = json.map(normalizePayment).filter(r=>r.invoiceNo || r.fileNumber || r.employeeId);
      const keys = new Set(payments.map(paymentDupKey)); const fresh=[]; const duplicated=[];
      incoming.forEach(r=>{ const k=paymentDupKey(r); if(keys.has(k)) duplicated.push(r); else { keys.add(k); fresh.push(r); }});
      setPaymentSave([...fresh,...payments]); setUploadResult({ type, total:incoming.length, inserted:fresh.length, duplicated:duplicated.length });
    }
    e.target.value='';
  }

  function exportExcel(){
    const fields = isFlight ? flightFields : paymentFields; const labels = isFlight ? flightLabels : paymentLabels; const data = isFlight ? flights : payments;
    const ws = XLSX.utils.json_to_sheet(data.map(r=>Object.fromEntries(fields.map(f=>[labels[f], r[f]]))));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, isFlight ? 'Flight Booking' : 'Payment Tracker'); XLSX.writeFile(wb, isFlight ? 'flight-booking-data.xlsx' : 'sirva-payment-tracker.xlsx');
  }

  return <div className="app">
    <aside className="side"><h1>Global<br/>Mobility</h1>
      <button onClick={()=>setView('paymentDashboard')} className={view==='paymentDashboard'?'active':''}><LayoutDashboard/> Payment 대시보드</button>
      <button onClick={()=>setView('paymentTable')} className={view==='paymentTable'?'active':''}><Table2/> Payment 데이터</button>
      <button onClick={()=>setView('paymentForm')} className={view==='paymentForm'?'active':''}><PlusCircle/> Payment 등록</button>
      <button onClick={()=>setView('paymentUpload')} className={view==='paymentUpload'?'active':''}><Upload/> Payment 업로드</button>
      <div className="sideGroup">Flight Booking</div>
      <button onClick={()=>setView('flightDashboard')} className={view==='flightDashboard'?'active':''}><Plane/> 항공권 대시보드</button>
      <button onClick={()=>setView('flightTable')} className={view==='flightTable'?'active':''}><Table2/> 항공권 데이터</button>
      <button onClick={()=>setView('flightForm')} className={view==='flightForm'?'active':''}><PlusCircle/> 항공권 등록</button>
      <button onClick={()=>setView('flightUpload')} className={view==='flightUpload'?'active':''}><Upload/> 항공권 업로드</button>
    </aside>
    <main>
      <header><div><p>{isFlight ? 'Flight Booking / Airfare Cost' : 'Global Mobility Tuition / Education Cost'}</p><h2>{titleMap[view]}</h2></div><button className="ghost" onClick={exportExcel}><Download size={16}/> Export Excel</button></header>

      {view==='paymentDashboard' && <section className="dash"><div className="hero"><div><span>Annual Spend (YTD)</span><strong>${payStats.total.toLocaleString()}</strong></div><div className="split"><b>SIRVA Fee</b><strong>${payStats.sirva.toLocaleString()}</strong><small>{payStats.total?((payStats.sirva/payStats.total)*100).toFixed(1):0}% of total</small></div><div className="split orange"><b>Disbursement</b><strong>${payStats.disb.toLocaleString()}</strong><small>{payStats.total?((payStats.disb/payStats.total)*100).toFixed(1):0}% of total</small></div></div><div className="panel wide"><h3>Full year view - All countries</h3><ResponsiveContainer height={280}><BarChart data={payStats.byMonth}><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Bar dataKey="SIRVA" stackId="a" fill="#fb923c"/><Bar dataKey="Disbursement" stackId="a" fill="#22d3ee"/></BarChart></ResponsiveContainer></div><div className="grid3">{payStats.byCountry.map(c=><div className="country" key={c.country}><h3>{c.country}</h3><strong>${c.total.toLocaleString()}</strong><ResponsiveContainer height={130}><PieChart><Pie data={[{name:'SIRVA Fee',value:c.sirva},{name:'Disbursement',value:c.disbursement}]} dataKey="value" innerRadius={34} outerRadius={55}>{[0,1].map(i=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><p><span>SIRVA Fee</span><b>${c.sirva.toLocaleString()}</b></p><p><span>Disbursement</span><b>${c.disbursement.toLocaleString()}</b></p></div>)}</div></section>}

      {view==='flightDashboard' && <section className="dash"><div className="hero four"><div><span>Total Flight Cost</span><strong>₩{(flightStats.totalAirfare+flightStats.totalTrx).toLocaleString()}</strong></div><div className="split"><b>Airfare</b><strong>₩{flightStats.totalAirfare.toLocaleString()}</strong><small>항공권 금액</small></div><div className="split orange"><b>TRX Fee</b><strong>₩{flightStats.totalTrx.toLocaleString()}</strong><small>발권 수수료</small></div><div className="split purple"><b>Passengers</b><strong>{flightStats.pax.toLocaleString()}</strong><small>{flightStats.employees} employees</small></div></div><div className="panel wide"><h3>Monthly airfare & TRX fee</h3><ResponsiveContainer height={280}><BarChart data={flightStats.byMonth}><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Bar dataKey="Airfare" stackId="a" fill="#22d3ee"/><Bar dataKey="TRX" stackId="a" fill="#fb923c"/></BarChart></ResponsiveContainer></div><div className="panel"><h3>Booking count trend</h3><ResponsiveContainer height={230}><LineChart data={flightStats.byMonth}><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="Count" stroke="#a78bfa"/></LineChart></ResponsiveContainer></div><div className="grid3"><div className="country"><h3>Relationship</h3><ResponsiveContainer height={170}><PieChart><Pie data={flightStats.byRelation} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68}>{flightStats.byRelation.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="panel"><h3>Category Breakdown</h3><table><tbody>{flightStats.byCategory.map(c=><tr key={c.category}><td>{c.category}</td><td>{c.count}건</td><td>₩{c.amount.toLocaleString()}</td></tr>)}</tbody></table></div><div className="panel"><h3>Case Manager</h3><table><tbody>{flightStats.byManager.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.count}건</td></tr>)}</tbody></table></div></div></section>}

      {view==='paymentTable' && <DataTable rows={filteredPayments} allRows={payments} setRows={setPaymentSave} fields={paymentFields} labels={paymentLabels} query={query} setQuery={setQuery} reset={()=>setPaymentSave(sampleRows)} placeholder="국가, 직원명, Invoice No, PO 검색" />}
      {view==='flightTable' && <DataTable rows={filteredFlights} allRows={flights} setRows={setFlightSave} fields={flightFields} labels={flightLabels} query={query} setQuery={setQuery} reset={()=>setFlightSave(sampleFlights)} placeholder="직원명, 탑승객, 항공구간, Cost Center 검색" moneyFields={['airfare','trxFee']} />}
      {view==='paymentForm' && <RecordForm fields={paymentFields} labels={paymentLabels} form={paymentForm} setForm={setPaymentForm} submit={addPayment} required={['invoiceNo','employeeId','amount']} />}
      {view==='flightForm' && <RecordForm fields={flightFields} labels={flightLabels} form={flightForm} setForm={setFlightForm} submit={addFlight} required={['bookingDate','employeeId','passengerName','airfare']} />}
      {view==='paymentUpload' && <UploadPanel type="payment" onUpload={onUpload} result={uploadResult} desc="Payment Tracker 엑셀을 업로드하면 Invoice No + Employee ID + File Number + Amount 기준으로 중복을 제외합니다." />}
      {view==='flightUpload' && <UploadPanel type="flight" onUpload={onUpload} result={uploadResult} desc="항공권 엑셀을 업로드하면 Booking Date + EE ID + Passenger Name + Departure + Airfare 기준으로 중복을 제외합니다." />}
    </main>
  </div>;
}

function DataTable({ rows, allRows, setRows, fields, labels, query, setQuery, reset, placeholder, moneyFields=[] }){ return <section className="panel"><div className="toolbar"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder}/></label><button className="danger" onClick={()=>{ if(confirm('샘플 데이터로 초기화할까요?')) reset(); }}><Trash2 size={16}/> Reset</button></div><div className="tableWrap"><table><thead><tr>{fields.map(f=><th key={f}>{labels[f]}</th>)}<th></th></tr></thead><tbody>{rows.map(r=><tr key={r.id}>{fields.map(f=><td key={f}>{moneyFields.includes(f) || f==='amount' ? Number(r[f]||0).toLocaleString() : r[f]}</td>)}<td><button className="mini" onClick={()=>setRows(allRows.filter(x=>x.id!==r.id))}>삭제</button></td></tr>)}</tbody></table></div></section>; }
function RecordForm({ fields, labels, form, setForm, submit, required }){ return <section className="panel"><form className="form" onSubmit={submit}>{fields.map(f=><label key={f}>{labels[f]}<input value={form[f] ?? ''} onChange={e=>setForm({...form,[f]:e.target.value})} required={required.includes(f)} /></label>)}<button className="primary"><PlusCircle size={18}/> 등록하기</button></form></section>; }
function UploadPanel({ type, onUpload, result, desc }){ return <section className="panel upload"><Upload size={48}/><h3>엑셀 파일 업로드</h3><p>{desc}</p><input type="file" accept=".xlsx,.xls,.csv" onChange={e=>onUpload(e,type)}/>{result && result.type===type && <div className="result"><CheckCircle2/> 전체 {result.total}건 / 신규 {result.inserted}건 / 중복 제외 {result.duplicated}건</div>}<div className="notice"><AlertTriangle/> 학교/항공권 양식별 헤더명이 조금 달라도 주요 컬럼은 자동 매핑되도록 구성했습니다. 운영 단계에서는 SharePoint 자동 수집과 DB 저장으로 확장하면 됩니다.</div></section>; }

export default App;
