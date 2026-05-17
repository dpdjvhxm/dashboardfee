const PAYMENT_KEY = 'sirva-payment-dashboard-records-v3';
const FLIGHT_KEY = 'sirva-flight-booking-records-v3';
const ACCOUNT_KEY = 'global-mobility-accounts-v1';
const NOTICE_KEY = 'global-mobility-notices-v1';
const DEMO_VERSION_KEY = 'global-mobility-demo-data-version';
const DEMO_VERSION = '2026-demo-v1';

const FX = { KRW: 1, USD: 1350, SGD: 1000, TWD: 42, JPY: 9.2, AUD: 890 };
const krw = (amount, currency = 'KRW') => Math.round(Number(amount || 0) * (FX[currency] || 1));

const paymentRows = [
  ['Taiwan','Jan','2026-01-12','DF-872156','INV-DMO-217761','DEMO-TW','EMP-D001','Alex Demo','SIRVA Fee','Demo-Relocation','Demo tuition support invoice / Taiwan / January','CC-DEMO-TW-01','USD',987,'2026-05-11','PO-DEMO-001','ACC-DEMO-0001','N60','PAID'],
  ['Taiwan','Feb','2026-02-12','DF-871204','INV-DMO-217353','DEMO-TW','EMP-D002','Blair Sample','Disbursement','Demo-Tuition','Demo international school tuition invoice / Taiwan','CC-DEMO-TW-02','USD',8750,'2026-04-24','PO-DEMO-002','ACC-DEMO-0002','N30','PAID'],
  ['Taiwan','Mar','2026-03-12','DF-871359','INV-DMO-217532','DEMO-TW','EMP-D003','Casey Test','SIRVA Fee','Demo-Housing','Demo education relocation fee / Taiwan','CC-DEMO-TW-03','USD',6705,'2026-05-11','PO-DEMO-003','ACC-DEMO-0003','N30','PAID'],
  ['Taiwan','Apr','2026-04-02','DF-873160','INV-DMO-218073','DEMO-TW','EMP-D004','Dana Mock','Disbursement','Demo-Transport','Demo school transportation cost / Taiwan','CC-DEMO-TW-04','USD',21623,'2026-06-01','PO-DEMO-004','ACC-DEMO-0004','N30','PAID'],
  ['Singapore','Apr','2026-04-02','DF-875725','INV-DMO-218374','DEMO-SG','EMP-D005','Evan Placeholder','SIRVA Fee','Demo-Relocation','Demo service fee / Singapore','CC-DEMO-SG-01','USD',1930,'2026-06-01','PO-DEMO-005','ACC-DEMO-0005','N60','PAID'],
  ['Singapore','May','2026-05-14','DF-875991','INV-DMO-218455','DEMO-SG','EMP-D006','Finley Demo','Disbursement','Demo-Tuition','Demo school tuition invoice / Singapore','CC-DEMO-SG-02','SGD',18900,'2026-06-20','PO-DEMO-006','ACC-DEMO-0006','N30','PAID'],
  ['Korea','Jun','2026-06-02','DF-879210','INV-DMO-219001','DEMO-KR','EMP-D007','Gray Sample','SIRVA Fee','Demo-Relocation','Demo mobility fee / Korea','CC-DEMO-KR-01','USD',1450,'2026-06-30','PO-DEMO-007','ACC-DEMO-0007','N60','PAYMENT_PENDING'],
  ['USA','Jul','2026-07-18','DF-881008','INV-DMO-219423','DEMO-US','EMP-D008','Harper Test','Disbursement','Demo-Tuition','Demo school tuition invoice / USA','CC-DEMO-US-01','USD',22500,'2026-08-09','PO-DEMO-008','ACC-DEMO-0008','N30','APPROVED'],
  ['Australia','Aug','2026-08-04','DF-884019','INV-DMO-219880','DEMO-AU','EMP-D009','Indigo Mock','Disbursement','Demo-Tuition','Demo school tuition invoice / Australia','CC-DEMO-AU-01','AUD',14800,'2026-08-29','PO-DEMO-009','ACC-DEMO-0009','N30','PAID'],
  ['India','Sep','2026-09-03','DF-886201','INV-DMO-220115','DEMO-IN','EMP-D010','Jordan Placeholder','SIRVA Fee','Demo-Relocation','Demo relocation service fee / India','CC-DEMO-IN-01','USD',1210,'2026-09-28','PO-DEMO-010','ACC-DEMO-0010','N60','PAID'],
  ['Japan','Oct','2026-10-10','DF-889904','INV-DMO-220771','DEMO-JP','EMP-D011','Kai Demo','Disbursement','Demo-Tuition','Demo tuition support invoice / Japan','CC-DEMO-JP-01','JPY',1650000,'2026-10-30','PO-DEMO-011','ACC-DEMO-0011','N30','RECEIVED'],
  ['Hong Kong','Nov','2026-11-12','DF-892001','INV-DMO-221008','DEMO-HK','EMP-D012','Logan Sample','SIRVA Fee','Demo-Relocation','Demo service fee / Hong Kong','CC-DEMO-HK-01','USD',1640,'2026-11-29','PO-DEMO-012','ACC-DEMO-0012','N60','APPROVED'],
  ['USA','Dec','2026-12-08','DF-895112','INV-DMO-221554','DEMO-US','EMP-D013','Morgan Test','Disbursement','Demo-Transport','Demo transport support invoice / USA','CC-DEMO-US-02','USD',6200,'2026-12-24','PO-DEMO-013','ACC-DEMO-0013','N30','PAID']
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
  ['India','2026-05-04','Repat','EMP-D101','Avery Demo','N','Demo Corp.','Demo Manager A','DEMO/AVERY MR','Employee','2026-05-10','','ICN','BLR',1628000,62700,'DEMO-CARD-2880','','EMP-D101_Avery Demo(E)','CC-DEMO-IN-01','BOOKED'],
  ['USA','2026-05-04','HLF','EMP-D102','Bailey Sample','N','Demo Corp.','Demo Manager B','DEMO/BAILEY MS','Employee','2026-07-25','2026-08-08','ICN','IAD',4263500,164100,'DEMO-CARD-2880','','EMP-D102_Bailey Sample(E)','CC-DEMO-US-01','BOOKED'],
  ['USA','2026-05-04','HLF','EMP-D102','Bailey Sample','N','Demo Corp.','Demo Manager B','DEMO/CHILD ONE MS','Child','2026-07-25','2026-08-21','ICN','IAD',3506500,135000,'DEMO-CARD-2880','','EMP-D102_Bailey Sample(C)','CC-DEMO-US-01','BOOKED'],
  ['India','2026-05-06','HLF','EMP-D103','Charlie Test','N','Demo Corp.','Demo Manager C','DEMO/CHARLIE MR','Employee','2026-05-16','','ICN','TRV',1134000,0,'DEMO-CARD-2880','Manual demo entry','EMP-D103_Charlie Test(E)','CC-DEMO-IN-02','BOOKED'],
  ['USA','2026-05-06','HLF','EMP-D103','Charlie Test','N','Demo Corp.','Demo Manager C','DEMO/FAMILY ONE MISS','Child','2026-06-16','2026-06-20','ICN','HNL',2211600,85100,'DEMO-CARD-2880','','EMP-D103_Charlie Test(C)','CC-DEMO-US-02','BOOKED'],
  ['Australia','2026-05-07','HLF','EMP-D104','Dakota Mock','N','Demo Corp.','Demo Manager A','DEMO/DAKOTA CHILD MS','Child','2026-08-01','2026-08-09','ICN','SYD',2718800,104700,'DEMO-CARD-2880','','EMP-D104_Dakota Mock(C)','CC-DEMO-AU-01','BOOKED'],
  ['Japan','2026-06-12','STA','EMP-D105','Emerson Placeholder','N','Demo Corp.','Demo Manager B','DEMO/EMERSON SPOUSE MS','Spouse','2026-06-17','2026-08-15','ICN','NRT',1526000,58700,'DEMO-CARD-2880','','EMP-D105_Emerson Placeholder(S)','CC-DEMO-JP-01','BOOKED'],
  ['Singapore','2026-07-08','HLF','EMP-D106','Frankie Demo','N','Demo Corp.','Demo Manager C','DEMO/FRANKIE SPOUSE MS','Spouse','2026-08-12','','ICN','SIN',1784000,69200,'DEMO-CARD-2880','','EMP-D106_Frankie Demo(S)','CC-DEMO-SG-01','BOOKED'],
  ['Taiwan','2026-08-14','Repat','EMP-D107','Grayson Sample','N','Demo Corp.','Demo Manager A','DEMO/GRAYSON MR','Employee','2026-08-31','','ICN','TPE',814800,31400,'DEMO-CARD-2880','','EMP-D107_Grayson Sample(E)','CC-DEMO-TW-01','BOOKED'],
  ['Hong Kong','2026-09-03','HLF','EMP-D108','Hayden Test','N','Demo Corp.','Demo Manager B','DEMO/HAYDEN SPOUSE MRS','Spouse','2026-09-22','','ICN','HKG',1737000,66900,'DEMO-CARD-2880','','EMP-D108_Hayden Test(S)','CC-DEMO-HK-01','BOOKED'],
  ['Korea','2026-10-11','STA','EMP-D109','Jamie Mock','N','Demo Corp.','Demo Manager C','DEMO/JAMIE CHILD MSTR','Child','2026-10-29','','BOM','ICN',677800,26100,'DEMO-CARD-2880','','EMP-D109_Jamie Mock(C)','CC-DEMO-KR-01','BOOKED'],
  ['India','2026-11-04','HLF','EMP-D109','Jamie Mock','N','Demo Corp.','Demo Manager C','DEMO/JAMIE CHILD TWO MSTR','Child','2026-11-20','','ICN','BOM',677800,26100,'DEMO-CARD-2880','','EMP-D109_Jamie Mock(C)','CC-DEMO-IN-03','PENDING'],
  ['USA','2026-12-02','Repat','EMP-D110','Kendall Demo','N','Demo Corp.','Demo Manager A','DEMO/KENDALL MR','Employee','2026-12-18','','ICN','SEA',2684600,103300,'DEMO-CARD-2880','','EMP-D110_Kendall Demo(E)','CC-DEMO-US-03','BOOKED']
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
