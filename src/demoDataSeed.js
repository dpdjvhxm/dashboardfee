const PAYMENT_KEY = 'sirva-payment-dashboard-records-v3';
const FLIGHT_KEY = 'sirva-flight-booking-records-v3';
const ACCOUNT_KEY = 'global-mobility-accounts-v1';
const NOTICE_KEY = 'global-mobility-notices-v1';
const DEMO_VERSION_KEY = 'global-mobility-demo-data-version';
const DEMO_VERSION = '2026-demo-v3-only-kr-tw-sg-jp';

const FX = { KRW: 1, USD: 1350, SGD: 1000, TWD: 42, JPY: 9.2, AUD: 890 };
const krw = (amount, currency = 'KRW') => Math.round(Number(amount || 0) * (FX[currency] || 1));

const paymentRows = [
  ['Taiwan','Jan','2026-01-12','DF-TW-001','INV-DEMO-TW-001','DEMO-TW','EMP-TW-001','Taiwan Demo User 01','SIRVA Fee','Demo-Relocation','Demo relocation service fee / Taiwan / January','CC-DEMO-TW-01','USD',980,'2026-01-28','PO-DEMO-TW-001','ACC-DEMO-TW-001','N60','PAID'],
  ['Taiwan','Feb','2026-02-09','DF-TW-002','INV-DEMO-TW-002','DEMO-TW','EMP-TW-002','Taiwan Demo User 02','Disbursement','Demo-Tuition','Demo tuition invoice / Taiwan / February','CC-DEMO-TW-02','USD',7200,'2026-02-24','PO-DEMO-TW-002','ACC-DEMO-TW-002','N30','PAID'],
  ['Taiwan','Mar','2026-03-15','DF-TW-003','INV-DEMO-TW-003','DEMO-TW','EMP-TW-003','Taiwan Demo User 03','Disbursement','Demo-Transport','Demo school transportation cost / Taiwan / March','CC-DEMO-TW-03','TWD',265000,'2026-03-30','PO-DEMO-TW-003','ACC-DEMO-TW-003','N30','APPROVED'],
  ['Taiwan','Apr','2026-04-11','DF-TW-004','INV-DEMO-TW-004','DEMO-TW','EMP-TW-004','Taiwan Demo User 04','SIRVA Fee','Demo-Relocation','Demo mobility handling fee / Taiwan / April','CC-DEMO-TW-04','USD',1280,'2026-04-25','PO-DEMO-TW-004','ACC-DEMO-TW-004','N60','PAID'],
  ['Singapore','Jan','2026-01-20','DF-SG-001','INV-DEMO-SG-001','DEMO-SG','EMP-SG-001','Singapore Demo User 01','SIRVA Fee','Demo-Relocation','Demo relocation service fee / Singapore / January','CC-DEMO-SG-01','USD',1450,'2026-02-05','PO-DEMO-SG-001','ACC-DEMO-SG-001','N60','PAID'],
  ['Singapore','Feb','2026-02-18','DF-SG-002','INV-DEMO-SG-002','DEMO-SG','EMP-SG-002','Singapore Demo User 02','Disbursement','Demo-Tuition','Demo international school tuition / Singapore / February','CC-DEMO-SG-02','SGD',13200,'2026-03-03','PO-DEMO-SG-002','ACC-DEMO-SG-002','N30','PAID'],
  ['Singapore','May','2026-05-14','DF-SG-003','INV-DEMO-SG-003','DEMO-SG','EMP-SG-003','Singapore Demo User 03','Disbursement','Demo-Tuition','Demo semester tuition invoice / Singapore / May','CC-DEMO-SG-03','SGD',18900,'2026-06-20','PO-DEMO-SG-003','ACC-DEMO-SG-003','N30','PAID'],
  ['Singapore','Jun','2026-06-10','DF-SG-004','INV-DEMO-SG-004','DEMO-SG','EMP-SG-004','Singapore Demo User 04','SIRVA Fee','Demo-Relocation','Demo service fee / Singapore / June','CC-DEMO-SG-04','USD',1700,'2026-06-30','PO-DEMO-SG-004','ACC-DEMO-SG-004','N60','PAYMENT_PENDING'],
  ['Korea','Mar','2026-03-05','DF-KR-001','INV-DEMO-KR-001','DEMO-KR','EMP-KR-001','Korea Demo User 01','SIRVA Fee','Demo-Relocation','Demo mobility fee / Korea / March','CC-DEMO-KR-01','KRW',1950000,'2026-03-21','PO-DEMO-KR-001','ACC-DEMO-KR-001','N60','PAID'],
  ['Korea','Apr','2026-04-17','DF-KR-002','INV-DEMO-KR-002','DEMO-KR','EMP-KR-002','Korea Demo User 02','Disbursement','Demo-Tuition','Demo education support invoice / Korea / April','CC-DEMO-KR-02','KRW',8300000,'2026-05-02','PO-DEMO-KR-002','ACC-DEMO-KR-002','N30','APPROVED'],
  ['Korea','Jul','2026-07-03','DF-KR-003','INV-DEMO-KR-003','DEMO-KR','EMP-KR-003','Korea Demo User 03','Disbursement','Demo-Transport','Demo school bus support invoice / Korea / July','CC-DEMO-KR-03','KRW',1450000,'2026-07-19','PO-DEMO-KR-003','ACC-DEMO-KR-003','N30','PAID'],
  ['Korea','Aug','2026-08-22','DF-KR-004','INV-DEMO-KR-004','DEMO-KR','EMP-KR-004','Korea Demo User 04','SIRVA Fee','Demo-Relocation','Demo service fee / Korea / August','CC-DEMO-KR-04','KRW',1780000,'2026-09-06','PO-DEMO-KR-004','ACC-DEMO-KR-004','N60','PAID'],
  ['Japan','May','2026-05-09','DF-JP-001','INV-DEMO-JP-001','DEMO-JP','EMP-JP-001','Japan Demo User 01','SIRVA Fee','Demo-Relocation','Demo relocation handling fee / Japan / May','CC-DEMO-JP-01','JPY',220000,'2026-05-24','PO-DEMO-JP-001','ACC-DEMO-JP-001','N60','PAID'],
  ['Japan','Sep','2026-09-12','DF-JP-002','INV-DEMO-JP-002','DEMO-JP','EMP-JP-002','Japan Demo User 02','Disbursement','Demo-Tuition','Demo tuition invoice / Japan / September','CC-DEMO-JP-02','JPY',1650000,'2026-09-30','PO-DEMO-JP-002','ACC-DEMO-JP-002','N30','RECEIVED'],
  ['Japan','Oct','2026-10-10','DF-JP-003','INV-DEMO-JP-003','DEMO-JP','EMP-JP-003','Japan Demo User 03','Disbursement','Demo-Transport','Demo school transportation invoice / Japan / October','CC-DEMO-JP-03','JPY',420000,'2026-10-29','PO-DEMO-JP-003','ACC-DEMO-JP-003','N30','APPROVED'],
  ['Japan','Dec','2026-12-08','DF-JP-004','INV-DEMO-JP-004','DEMO-JP','EMP-JP-004','Japan Demo User 04','SIRVA Fee','Demo-Relocation','Demo service fee / Japan / December','CC-DEMO-JP-04','USD',1540,'2026-12-24','PO-DEMO-JP-004','ACC-DEMO-JP-004','N60','PAID']
].map((r, i) => {
  const currency = r[12];
  const amount = r[13];
  return {
    id: `demo-pay-${i + 1}`,
    country: r[0], invoiceMonth: r[1], invoiceDate: r[2], fileNumber: r[3], invoiceNo: r[4], entity: r[5], employeeId: r[6], employeeName: r[7], serviceType: r[8], category: r[9], description: r[10], costCenter: r[11], currency, amount,
    normalizedKrw: krw(amount, currency), exchangeRate: FX[currency] || 1,
    paymentDate: r[14], poNumber: r[15], iacDocNo: r[16], paymentItem: r[17], status: r[18]
  };
});

const flightRows = [
  ['Korea','2026-05-04','Repat','EMP-D101','Avery Demo','N','Demo Corp.','Demo Manager A','DEMO/AVERY MR','Employee','2026-05-10','','ICN','BLR',1628000,62700,'DEMO-CARD-2880','','EMP-D101_Avery Demo(E)','CC-DEMO-KR-01','BOOKED'],
  ['Japan','2026-05-04','HLF','EMP-D102','Bailey Sample','N','Demo Corp.','Demo Manager B','DEMO/BAILEY MS','Employee','2026-07-25','2026-08-08','ICN','IAD',4263500,164100,'DEMO-CARD-2880','','EMP-D102_Bailey Sample(E)','CC-DEMO-JP-01','BOOKED'],
  ['Taiwan','2026-05-04','HLF','EMP-D102','Bailey Sample','N','Demo Corp.','Demo Manager B','DEMO/CHILD ONE MS','Child','2026-07-25','2026-08-21','ICN','IAD',3506500,135000,'DEMO-CARD-2880','','EMP-D102_Bailey Sample(C)','CC-DEMO-TW-01','BOOKED'],
  ['Korea','2026-05-06','HLF','EMP-D103','Charlie Test','N','Demo Corp.','Demo Manager C','DEMO/CHARLIE MR','Employee','2026-05-16','','ICN','TRV',1134000,0,'DEMO-CARD-2880','Manual demo entry','EMP-D103_Charlie Test(E)','CC-DEMO-KR-02','BOOKED'],
  ['Japan','2026-05-06','HLF','EMP-D103','Charlie Test','N','Demo Corp.','Demo Manager C','DEMO/FAMILY ONE MISS','Child','2026-06-16','2026-06-20','ICN','HNL',2211600,85100,'DEMO-CARD-2880','','EMP-D103_Charlie Test(C)','CC-DEMO-JP-02','BOOKED'],
  ['Singapore','2026-05-07','HLF','EMP-D104','Dakota Mock','N','Demo Corp.','Demo Manager A','DEMO/DAKOTA CHILD MS','Child','2026-08-01','2026-08-09','ICN','SYD',2718800,104700,'DEMO-CARD-2880','','EMP-D104_Dakota Mock(C)','CC-DEMO-SG-01','BOOKED'],
  ['Japan','2026-06-12','STA','EMP-D105','Emerson Placeholder','N','Demo Corp.','Demo Manager B','DEMO/EMERSON SPOUSE MS','Spouse','2026-06-17','2026-08-15','ICN','NRT',1526000,58700,'DEMO-CARD-2880','','EMP-D105_Emerson Placeholder(S)','CC-DEMO-JP-03','BOOKED'],
  ['Singapore','2026-07-08','HLF','EMP-D106','Frankie Demo','N','Demo Corp.','Demo Manager C','DEMO/FRANKIE SPOUSE MS','Spouse','2026-08-12','','ICN','SIN',1784000,69200,'DEMO-CARD-2880','','EMP-D106_Frankie Demo(S)','CC-DEMO-SG-02','BOOKED'],
  ['Taiwan','2026-08-14','Repat','EMP-D107','Grayson Sample','N','Demo Corp.','Demo Manager A','DEMO/GRAYSON MR','Employee','2026-08-31','','ICN','TPE',814800,31400,'DEMO-CARD-2880','','EMP-D107_Grayson Sample(E)','CC-DEMO-TW-02','BOOKED'],
  ['Taiwan','2026-09-03','HLF','EMP-D108','Hayden Test','N','Demo Corp.','Demo Manager B','DEMO/HAYDEN SPOUSE MRS','Spouse','2026-09-22','','ICN','HKG',1737000,66900,'DEMO-CARD-2880','','EMP-D108_Hayden Test(S)','CC-DEMO-TW-03','BOOKED'],
  ['Korea','2026-10-11','STA','EMP-D109','Jamie Mock','N','Demo Corp.','Demo Manager C','DEMO/JAMIE CHILD MSTR','Child','2026-10-29','','BOM','ICN',677800,26100,'DEMO-CARD-2880','','EMP-D109_Jamie Mock(C)','CC-DEMO-KR-03','BOOKED'],
  ['Singapore','2026-11-04','HLF','EMP-D109','Jamie Mock','N','Demo Corp.','Demo Manager C','DEMO/JAMIE CHILD TWO MSTR','Child','2026-11-20','','ICN','BOM',677800,26100,'DEMO-CARD-2880','','EMP-D109_Jamie Mock(C)','CC-DEMO-SG-03','PENDING'],
  ['Japan','2026-12-02','Repat','EMP-D110','Kendall Demo','N','Demo Corp.','Demo Manager A','DEMO/KENDALL MR','Employee','2026-12-18','','ICN','SEA',2684600,103300,'DEMO-CARD-2880','','EMP-D110_Kendall Demo(E)','CC-DEMO-JP-04','BOOKED']
].map((r, i) => ({
  id: `demo-flight-${i + 1}`,
  country: r[0], bookingDate: r[1], category: r[2], employeeId: r[3], employeeName: r[4], pil: r[5], entity: r[6], caseManager: r[7], passengerName: r[8], relationship: r[9], departureDate1: r[10], departureDate2: r[11], departure1: r[12], departure2: r[13], currency: 'KRW', airfare: r[14], trxFee: r[15], normalizedKrw: krw(Number(r[14]) + Number(r[15]), 'KRW'), exchangeRate: 1, card: r[16], remark: r[17], iaccDetail: r[18], costCenter: r[19], status: r[20]
}));

const demoAccounts = [
  { id:'demo-u1', name:'Demo Admin', email:'admin@demo.com', role:'Master Admin', department:'Global Mobility Demo', status:'Active', password:'admin123', createdAt:'2026-01-01' },
  { id:'demo-u2', name:'Demo Finance', email:'finance@demo.com', role:'Finance', department:'Finance Demo', status:'Active', password:'finance123', createdAt:'2026-02-01' },
  { id:'demo-u3', name:'Demo HR Operator', email:'hr@demo.com', role:'HR Operator', department:'HR Demo', status:'Active', password:'hr123', createdAt:'2026-03-01' }
];

const demoNotices = [
  { id:'demo-n1', title:'Demo Q2 Cost Data Review Notice', category:'Demo Notice', body:'This is sample notice text. Please review country, currency, and Normalized KRW values in the demo data.', pinned:true, writer:'Demo Admin', createdAt:'2026-04-01' },
  { id:'demo-n2', title:'Demo Flight Upload Duplicate Rule', category:'Demo Data', body:'This is sample notice text. Duplicate prevention is based on booking date, employee ID, passenger, route, and airfare.', pinned:false, writer:'Demo Admin', createdAt:'2026-04-15' }
];

export function seedDemoData() {
  if (localStorage.getItem(DEMO_VERSION_KEY) === DEMO_VERSION) return;
  localStorage.setItem(PAYMENT_KEY, JSON.stringify(paymentRows));
  localStorage.setItem(FLIGHT_KEY, JSON.stringify(flightRows));
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(demoAccounts));
  localStorage.setItem(NOTICE_KEY, JSON.stringify(demoNotices));
  localStorage.removeItem('global-mobility-session-v1');
  localStorage.setItem(DEMO_VERSION_KEY, DEMO_VERSION);
}
