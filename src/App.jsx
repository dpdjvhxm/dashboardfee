import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutDashboard, Table2, PlusCircle, Upload, Search, AlertTriangle, CheckCircle2, Trash2, Download } from 'lucide-react';

const STORAGE_KEY = 'sirva-payment-dashboard-records-v1';
const COLORS = ['#22d3ee', '#fb923c', '#a78bfa', '#34d399', '#f472b6'];

const sampleRows = [
  { id:'1', country:'Taiwan', countryCode:'TW', invoiceMonth:'Jan', invoiceDate:'2026-01-12', fileNumber:'872156', invoiceNo:'217761', entity:'RFC', employeeId:'CP26773', employeeName:'Ranjan Tukesh', serviceType:'SIRVA Fee', category:'Expat-Relovc', description:'CP26773_Tukesh Ranjan_INV217761_260312', costCenter:'', currency:'USD', amount:987, paymentDate:'2026-05-11', poNumber:'PO312440', iacDocNo:'100003884', paymentItem:'N60', status:'PAID' },
  { id:'2', country:'Taiwan', countryCode:'TW', invoiceMonth:'Feb', invoiceDate:'2026-02-12', fileNumber:'871204', invoiceNo:'217353', entity:'RFC', employeeId:'CP281024', employeeName:'Gattani, Deepesh', serviceType:'Disbursement', category:'Expat-Relovc', description:'CP281024_Deepesh Gattani_INV217353_260312', costCenter:'TR7030000', currency:'USD', amount:8750, paymentDate:'2026-04-24', poNumber:'PO312440', iacDocNo:'100003886', paymentItem:'N30', status:'PAID' },
  { id:'3', country:'Taiwan', countryCode:'TW', invoiceMonth:'Mar', invoiceDate:'2026-03-12', fileNumber:'871359', invoiceNo:'2173532', entity:'CPTW', employeeId:'CP277208', employeeName:'Kwok, Ka Chun', serviceType:'SIRVA Fee', category:'Expat-FurnRent', description:'CP277208_Ken Kwok_INV2173532_260312', costCenter:'TA2102000', currency:'USD', amount:6705, paymentDate:'2026-05-11', poNumber:'PO308846', iacDocNo:'100004327', paymentItem:'N30', status:'PAID' },
  { id:'4', country:'Taiwan', countryCode:'TW', invoiceMonth:'Apr', invoiceDate:'2026-04-02', fileNumber:'873160', invoiceNo:'218073', entity:'CPTW', employeeId:'CP279328', employeeName:'Chi, Xiang', serviceType:'Disbursement', category:'Expat-Transport', description:'CP79328_Tina X Chi_INV218073_260402', costCenter:'TA2102000', currency:'USD', amount:21623, paymentDate:'2026-06-01', poNumber:'PO308846', iacDocNo:'100005725', paymentItem:'N30', status:'PAID' },
  { id:'5', country:'Singapore', countryCode:'SG', invoiceMonth:'Apr', invoiceDate:'2026-04-02', fileNumber:'875725', invoiceNo:'2180374', entity:'CPTW', employeeId:'CP278355', employeeName:'Kumar, Dinesh', serviceType:'SIRVA Fee', category:'Expat-Relovc', description:'CP278355_Dinesh Kumar_INV2180374_260402', costCenter:'', currency:'USD', amount:1930, paymentDate:'2026-06-01', poNumber:'PO308846', iacDocNo:'100005725', paymentItem:'N60', status:'PAID' }
];

const fields = ['country','invoiceMonth','invoiceDate','fileNumber','invoiceNo','entity','employeeId','employeeName','serviceType','category','description','costCenter','currency','amount','paymentDate','poNumber','iacDocNo','paymentItem','status'];
const fieldLabels = { country:'Country', invoiceMonth:'Invoice Month', invoiceDate:'Invoice Date', fileNumber:'File Number', invoiceNo:'Invoice No', entity:'Entity', employeeId:'Employee ID', employeeName:'Employee Name', serviceType:'Service Type', category:'Category', description:'Text Description', costCenter:'Cost Center', currency:'Currency', amount:'Amount', paymentDate:'Payment Date', poNumber:'PO', iacDocNo:'IAC Doc #', paymentItem:'PO Payment Item', status:'Status' };

function loadRows(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || sampleRows; } catch { return sampleRows; } }
function saveRows(rows){ localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }
function num(v){ return Number(String(v ?? 0).replace(/[$,]/g,'')) || 0; }
function dupKey(r){ return [r.invoiceNo, r.employeeId, r.fileNumber, r.amount].map(v=>String(v||'').trim().toLowerCase()).join('|'); }
function monthIndex(m){ return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(String(m).slice(0,3)); }

function normalizeRecord(raw){
  const get = (...names) => { for (const n of names){ const k = Object.keys(raw).find(x => x.trim().toLowerCase() === n.toLowerCase()); if(k) return raw[k]; } return ''; };
  return {
    id: crypto.randomUUID(),
    country: get('Country') || 'Unknown',
    countryCode: get('Country Code') || String(get('Country')||'').slice(0,2).toUpperCase(),
    invoiceMonth: get('Invoice Month','Month','Invoice date (Month)') || '',
    invoiceDate: get('Invoice Date','Invoice date') || '',
    fileNumber: get('File Number','File Num','File No') || '',
    invoiceNo: get('Invoice No','Invoice Number','Invoice No.') || '',
    entity: get('Entity') || '',
    employeeId: get('Employee ID','Employee') || '',
    employeeName: get('Employee Name') || '',
    serviceType: get('SIRVA service type','Service Type','Sirva Service Type') || '',
    category: get('Category','Item','Item Details') || '',
    description: get('Text Description (A/C)','Text Description','Description') || '',
    costCenter: get('Cost Center','Cost Cen') || '',
    currency: get('Currency') || 'USD',
    amount: num(get('Amount','USD','Invoice Amount','Total Amount','Payment Amount')),
    paymentDate: get('Payment Date') || '',
    poNumber: get('PO','PO Number') || '',
    iacDocNo: get('IAC Doc #','IAC Doc','IAC Document') || '',
    paymentItem: get('PO Payment Item','Payment Item') || '',
    status: get('Status') || 'RECEIVED'
  };
}

function App(){
  const [rows, setRows] = useState(loadRows);
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [form, setForm] = useState({ country:'Taiwan', invoiceMonth:'Apr', invoiceDate:'2026-04-02', fileNumber:'', invoiceNo:'', entity:'CPTW', employeeId:'', employeeName:'', serviceType:'SIRVA Fee', category:'Expat-Relovc', description:'', costCenter:'', currency:'USD', amount:'', paymentDate:'', poNumber:'', iacDocNo:'', paymentItem:'', status:'RECEIVED' });

  const setAndSave = next => { setRows(next); saveRows(next); };
  const stats = useMemo(()=>{
    const total = rows.reduce((s,r)=>s+num(r.amount),0);
    const sirva = rows.filter(r=>String(r.serviceType).toLowerCase().includes('sirva')).reduce((s,r)=>s+num(r.amount),0);
    const disb = rows.filter(r=>String(r.serviceType).toLowerCase().includes('disbur')).reduce((s,r)=>s+num(r.amount),0);
    const countries = [...new Set(rows.map(r=>r.country || 'Unknown'))];
    const byCountry = countries.map(c=>({ country:c, total: rows.filter(r=>r.country===c).reduce((s,r)=>s+num(r.amount),0), sirva: rows.filter(r=>r.country===c && String(r.serviceType).toLowerCase().includes('sirva')).reduce((s,r)=>s+num(r.amount),0), disbursement: rows.filter(r=>r.country===c && String(r.serviceType).toLowerCase().includes('disbur')).reduce((s,r)=>s+num(r.amount),0)}));
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const byMonth = months.map(m=>({ month:m, SIRVA: rows.filter(r=>monthIndex(r.invoiceMonth)===monthIndex(m) && String(r.serviceType).toLowerCase().includes('sirva')).reduce((s,r)=>s+num(r.amount),0), Disbursement: rows.filter(r=>monthIndex(r.invoiceMonth)===monthIndex(m) && String(r.serviceType).toLowerCase().includes('disbur')).reduce((s,r)=>s+num(r.amount),0), Total: rows.filter(r=>monthIndex(r.invoiceMonth)===monthIndex(m)).reduce((s,r)=>s+num(r.amount),0)}));
    const categories = [...new Set(rows.map(r=>r.category || 'Uncategorized'))].map(c=>({ category:c, amount: rows.filter(r=>(r.category||'Uncategorized')===c).reduce((s,r)=>s+num(r.amount),0)}));
    return { total, sirva, disb, byCountry, byMonth, categories };
  },[rows]);

  const filtered = rows.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));

  function addRecord(e){
    e.preventDefault();
    const record = { ...form, id: crypto.randomUUID(), amount:num(form.amount) };
    if(rows.some(r=>dupKey(r)===dupKey(record))) { alert('중복 데이터입니다. Invoice No + Employee ID + File Number + Amount 기준으로 이미 존재합니다.'); return; }
    setAndSave([record, ...rows]);
    setForm({...form, fileNumber:'', invoiceNo:'', employeeId:'', employeeName:'', amount:'', description:''});
    setView('table');
  }

  async function onUpload(e){
    const file = e.target.files?.[0]; if(!file) return;
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval:'' });
    const incoming = json.map(normalizeRecord).filter(r=>r.invoiceNo || r.fileNumber || r.employeeId);
    const keys = new Set(rows.map(dupKey));
    const fresh = [], duplicated = [];
    incoming.forEach(r=>{ const k=dupKey(r); if(keys.has(k)) duplicated.push(r); else { keys.add(k); fresh.push(r); }});
    setAndSave([...fresh, ...rows]);
    setUploadResult({ total: incoming.length, inserted: fresh.length, duplicated: duplicated.length });
    e.target.value = '';
  }

  function exportExcel(){
    const ws = XLSX.utils.json_to_sheet(rows.map(r=>Object.fromEntries(fields.map(f=>[fieldLabels[f], r[f]]))));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Payment Tracker'); XLSX.writeFile(wb, 'sirva-payment-tracker.xlsx');
  }

  return <div className="app">
    <aside className="side"><h1>SIRVA<br/>Payment</h1><button onClick={()=>setView('dashboard')} className={view==='dashboard'?'active':''}><LayoutDashboard/> Dashboard</button><button onClick={()=>setView('table')} className={view==='table'?'active':''}><Table2/> Payment Tracker</button><button onClick={()=>setView('form')} className={view==='form'?'active':''}><PlusCircle/> 개별 등록</button><button onClick={()=>setView('upload')} className={view==='upload'?'active':''}><Upload/> Excel Upload</button></aside>
    <main>
      <header><div><p>Global Mobility Tuition / Education Cost</p><h2>{view==='dashboard'?'Sirva Payment Dashboard':view==='table'?'데이터 관리 테이블':view==='form'?'데이터 개별 등록':'엑셀 업로드'}</h2></div><button className="ghost" onClick={exportExcel}><Download size={16}/> Export Excel</button></header>
      {view==='dashboard' && <section className="dash">
        <div className="hero"><div><span>Annual Spend (YTD)</span><strong>${stats.total.toLocaleString()}</strong></div><div className="split"><b>SIRVA Fee</b><strong>${stats.sirva.toLocaleString()}</strong><small>{stats.total?((stats.sirva/stats.total)*100).toFixed(1):0}% of total</small></div><div className="split orange"><b>Disbursement</b><strong>${stats.disb.toLocaleString()}</strong><small>{stats.total?((stats.disb/stats.total)*100).toFixed(1):0}% of total</small></div></div>
        <div className="panel wide"><h3>Full year view - All countries</h3><ResponsiveContainer height={280}><BarChart data={stats.byMonth}><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Bar dataKey="SIRVA" stackId="a" fill="#fb923c"/><Bar dataKey="Disbursement" stackId="a" fill="#22d3ee"/></BarChart></ResponsiveContainer></div>
        <div className="grid3">{stats.byCountry.map(c=><div className="country" key={c.country}><h3>{c.country}</h3><strong>${c.total.toLocaleString()}</strong><ResponsiveContainer height={130}><PieChart><Pie data={[{name:'SIRVA Fee',value:c.sirva},{name:'Disbursement',value:c.disbursement}]} dataKey="value" innerRadius={34} outerRadius={55}>{[0,1].map(i=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><p><span>SIRVA Fee</span><b>${c.sirva.toLocaleString()}</b></p><p><span>Disbursement</span><b>${c.disbursement.toLocaleString()}</b></p></div>)}</div>
        <div className="panel"><h3>Country trend</h3><ResponsiveContainer height={260}><LineChart data={stats.byMonth}><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/>{stats.byCountry.map((c,i)=><Line key={c.country} type="monotone" dataKey="Total" name="Total" stroke={COLORS[i%COLORS.length]}/>)}</LineChart></ResponsiveContainer></div>
        <div className="panel"><h3>Disbursement breakdown by category</h3><table><thead><tr><th>Category</th><th>Amount</th><th>Share</th></tr></thead><tbody>{stats.categories.map(c=><tr key={c.category}><td>{c.category}</td><td>${c.amount.toLocaleString()}</td><td>{stats.total?((c.amount/stats.total)*100).toFixed(1):0}%</td></tr>)}</tbody></table></div>
      </section>}
      {view==='table' && <section className="panel"><div className="toolbar"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="국가, 직원명, Invoice No, PO 검색"/></label><button className="danger" onClick={()=>{ if(confirm('전체 데이터를 샘플로 초기화할까요?')) setAndSave(sampleRows); }}><Trash2 size={16}/> Reset</button></div><div className="tableWrap"><table><thead><tr>{fields.map(f=><th key={f}>{fieldLabels[f]}</th>)}<th></th></tr></thead><tbody>{filtered.map(r=><tr key={r.id}>{fields.map(f=><td key={f}>{f==='amount'?'$'+num(r[f]).toLocaleString():r[f]}</td>)}<td><button className="mini" onClick={()=>setAndSave(rows.filter(x=>x.id!==r.id))}>삭제</button></td></tr>)}</tbody></table></div></section>}
      {view==='form' && <section className="panel"><form className="form" onSubmit={addRecord}>{fields.map(f=><label key={f}>{fieldLabels[f]}<input value={form[f] ?? ''} onChange={e=>setForm({...form,[f]:e.target.value})} required={['invoiceNo','employeeId','amount'].includes(f)} /></label>)}<button className="primary"><PlusCircle size={18}/> 등록하기</button></form></section>}
      {view==='upload' && <section className="panel upload"><Upload size={48}/><h3>엑셀 파일 업로드</h3><p>xlsx, xls, csv 파일을 업로드하면 Invoice No + Employee ID + File Number + Amount 기준으로 중복을 검사하고 신규 건만 등록합니다.</p><input type="file" accept=".xlsx,.xls,.csv" onChange={onUpload}/>{uploadResult && <div className="result"><CheckCircle2/> 전체 {uploadResult.total}건 / 신규 {uploadResult.inserted}건 / 중복 제외 {uploadResult.duplicated}건</div>}<div className="notice"><AlertTriangle/> 학교별 인보이스 양식이 달라도 헤더명을 매핑하도록 설계했습니다. 추후 학교별 템플릿 매핑 화면을 추가하면 OCR/양식 차이까지 관리 가능합니다.</div></section>}
    </main>
  </div>;
}

export default App;
