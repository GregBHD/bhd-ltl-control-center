import {facilities} from './locations.js';
export const AS_OF='2026-10-30T16:00:00Z';
export const SYNC='2026-10-30T15:45:00Z';
export const CUSTOMER={id:'demo-mansfield',name:'Mansfield Energy Corp',short:'MANSFIELD',label:'Published locations · Synthetic freight'};
export {facilities} from './locations.js';
export const external=[{id:'STL',name:'St. Louis customer',state:'MO',x:487,y:209,kind:'external'},{id:'CLT',name:'Charlotte supplier',state:'NC',x:680,y:266,kind:'external'}];
export const terminals=[{id:'DAY',name:'Dayton terminal',x:607,y:183,kind:'terminal'}];
export const nodes=[...facilities.map(x=>({...x,kind:'facility'})),...external];
export const carriers=['Old Dominion','Estes','XPO','Saia','R+L Carriers'];
export const statusNames=['Scheduled','Picked up','In transit','Destination terminal','Out for delivery','Delivered','Partially delivered','Unknown','Cancelled'];
export const owners=['Unassigned','Alex Morgan','Jordan Lee','Casey Brooks','BHD Operations'];
export const exceptionStates=['New','Assigned','Investigating','Awaiting carrier','Awaiting customer','Resolved'];
export const lookup=id=>nodes.find(n=>n.id===id);
export const isActive=s=>!['Delivered','Cancelled'].includes(s.status);
export const endDate='2026-10-30';
export const localDate=(iso,zone='America/Indiana/Indianapolis')=>new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
const at=(d,h=17)=>`2026-10-${String(d).padStart(2,'0')}T${String(h).padStart(2,'0')}:00:00Z`;
export function makeData(){
const lanes=[['GNV','MRK'],['MRK','LOR'],['GNV','SID'],['HOU','GNV'],['BTR','DOR'],['DOR','RED'],['SID','RED'],['LOR','GNV'],['MRK','HOU'],['RED','MRK'],['GNV','STL'],['CLT','DOR'],['HOU','BTR'],['DOR','GNV'],['SID','LOR'],['BTR','GNV'],['DEN','MRK'],['GNV','DEN'],['HSP','BTR'],['HOU','YYC'],['YYC','DEN'],['LOR','SID']];
const shipments=Array.from({length:176},(_,i)=>{
const pair=lanes[i%lanes.length],historical=i<120,day=historical?1+(i*7%25):28+i%3;
const scheduled=!historical&&i%8===0,partial=i===125,unknown=i===133,cancelled=i===15||i===79;
const status=cancelled?'Cancelled':historical?'Delivered':partial?'Partially delivered':unknown?'Unknown':scheduled?'Scheduled':['In transit','Destination terminal','Out for delivery','Picked up'][i%4];
const delivery=historical?at(Math.min(day+2,28),20):at(30,21);const pickup=historical?at(day,14):at(scheduled?30:28+i%2,14);
const late=historical&&i%17===0;const actual=historical&&!cancelled?new Date(new Date(delivery).getTime()+(late?86400000:-3600000)).toISOString():null;
const stale=i===133||i===129||i===141;const updated=historical?(actual||delivery):stale?at(28,11):at(30,12+i%4);
const base=205+(i*37%830),fuel=Math.round(base*.185),accessorial=i%7===0?85:i%11===0?55:0;
const invoiced=historical&&!cancelled?base+fuel+accessorial+(i===34?65:0):null;
const id='SB-'+(260410+i),weight=850+(i*293%7100),pallets=2+i%8;
const deliveredPieces=partial?1:status==='Delivered'?1:0;
const pros=partial?[{number:'OD-781250-A',status:'Delivered',pallets:2},{number:'OD-781250-B',status:'In transit',pallets:pallets-2}]:[{number:`${['OD','ES','XP','SA','RL'][i%5]}-${781000+i}`,status,pallets}];
const events=[{name:'Scheduled',raw:'LOAD_ACCEPTED',time:pickup,source:'Demo Sunnybrook snapshot'}];
if(!scheduled&&!unknown&&!cancelled) events.push({name:'Picked up',raw:'PU_CONFIRMED',time:new Date(new Date(pickup).getTime()+1800000).toISOString(),source:'Synthetic carrier EDI'}, {name:'In transit',raw:'LINEHAUL_DEPARTED',time:new Date(new Date(pickup).getTime()+14400000).toISOString(),source:'Synthetic carrier EDI'});
if(['Destination terminal','Out for delivery','Delivered','Partially delivered'].includes(status))events.push({name:'Destination terminal',raw:'ARRIVED_DEST_TERMINAL',time:new Date(new Date(delivery).getTime()-28800000).toISOString(),source:'Synthetic carrier EDI'});
if(['Out for delivery','Delivered'].includes(status))events.push({name:'Out for delivery',raw:'OUT_FOR_DELIVERY',time:new Date(new Date(delivery).getTime()-14400000).toISOString(),source:'Synthetic carrier EDI'});
if(actual) events.push({name:'Delivered',raw:'DELIVERED',time:actual,source:'Synthetic carrier EDI'});
if(partial)events.push({name:'Partial delivery',raw:'PARTIAL_DELIVERY_1_OF_2_PRO',time:at(30,14),source:'Synthetic carrier EDI'});
return {id,customerId:CUSTOMER.id,origin:pair[0],destination:pair[1],carrier:carriers[i%5],status,shipDate:localDate(pickup),pickupCommitment:pickup,pickupActual:!scheduled&&!unknown&&!cancelled?new Date(new Date(pickup).getTime()+(i%23===0?7200000:-1800000)).toISOString():null,deliveryCommitment:delivery,deliveryActual:actual,eta:historical?actual:new Date(new Date(delivery).getTime()+(i===124?86400000:0)).toISOString(),sourceUpdatedAt:updated,lastLocation:unknown?null:(isActive({status})?'Dayton, OH carrier terminal':lookup(pair[1]).name),pallets,weight,class:['70','85','100','125'][i%4],service:'Standard LTL',dimensions:'48 × 40 × 48 in / pallet',stackable:i%4!==0,handling:'Dry, nonhazardous',readyAt:pickup,pros,bol:'BOL-'+(908100+i),po:'PO-'+(450100+i),charges:{linehaul:base,fuel,accessorial,expected:base+fuel+accessorial,invoiced,accessorialReason:accessorial===85?'Liftgate delivery':accessorial?'Appointment fee':null},documents:{BOL:true,POD:status==='Delivered'&&i!==119,Invoice:invoiced!==null},events,notes:[],history:[],deliveredPieces};
});
// Deliberately complete and inspectable consolidation candidate.
for(const idx of [144,145,146])Object.assign(shipments[idx],{origin:'GNV',destination:'MRK',shipDate:'2026-10-30',pickupCommitment:at(30,18),pickupActual:null,readyAt:at(30,16),deliveryCommitment:'2026-11-02T22:00:00Z',eta:'2026-11-02T20:00:00Z',status:'Scheduled',pallets:3,weight:2100,stackable:true,events:[{name:'Scheduled',raw:'LOAD_ACCEPTED',time:at(30,14),source:'Demo Sunnybrook snapshot'}]});
for(const idx of [144,145,146]){shipments[idx].pros[0].status='Scheduled';shipments[idx].pros[0].pallets=3;}
const templates=[
[124,'Late delivery','High','Reconfirm the delivery appointment and recovery ETA.','BHD Operations'],
[128,'Missed pickup','High','Obtain a recovery pickup window from the carrier.','Alex Morgan'],
[133,'Stalled tracking','Medium','Request a terminal scan; last source update is over 48 hours old.','Jordan Lee'],
[125,'Partial delivery','High','Locate the second PRO and confirm remaining pallet count.','Casey Brooks'],
[119,'Missing POD','Low','Request signed proof of delivery.','BHD Operations'],
[111,'Shortage / damage','High','Collect receiving photos and validate the affected pallet.','Jordan Lee'],
[34,'Billing discrepancy','Medium','Review the $65 invoice adjustment against approved charges.','BHD Operations'],
[129,'Stalled tracking','Medium','Confirm latest movement with the carrier terminal.','Unassigned'],
[130,'Appointment issue','Medium','Confirm receiving availability before delivery.','Casey Brooks'],
[141,'Stalled tracking','Medium','Request a fresh carrier update.','Unassigned'],
[151,'Late delivery','High','Validate recovery plan with receiving team.','Alex Morgan']];
shipments[128].pickupCommitment=at(30,13);shipments[128].status='Scheduled';shipments[128].pickupActual=null;
// The delayed cases retain a missed original commitment and a later estimate.
shipments[124].deliveryCommitment=at(30,14);shipments[124].eta=at(31,21);
shipments[151].deliveryCommitment=at(30,14);shipments[151].eta=at(31,20);
// Normalize event order to the actual observed carrier timestamp, never the demo future.
for(const s of shipments){
 const source=new Date(s.sourceUpdatedAt).getTime();
 const before=(t,h=0)=>new Date(Math.min(new Date(t).getTime()+h*3600000,source)).toISOString();
 s.events=[{name:'Scheduled',raw:'LOAD_ACCEPTED',time:before(s.pickupCommitment,-24),source:'Demo Sunnybrook snapshot'}];
 if(s.pickupActual)s.events.push({name:'Picked up',raw:'PU_CONFIRMED',time:before(s.pickupActual),source:'Synthetic carrier EDI'});
 if(['In transit','Destination terminal','Out for delivery','Delivered','Partially delivered'].includes(s.status))s.events.push({name:'In transit',raw:'LINEHAUL_DEPARTED',time:before(s.pickupActual||s.pickupCommitment,4),source:'Synthetic carrier EDI'});
 if(['Destination terminal','Out for delivery','Delivered','Partially delivered'].includes(s.status))s.events.push({name:'Destination terminal',raw:'ARRIVED_DEST_TERMINAL',time:before(s.deliveryCommitment,-8),source:'Synthetic carrier EDI'});
 if(['Out for delivery','Delivered'].includes(s.status))s.events.push({name:'Out for delivery',raw:'OUT_FOR_DELIVERY',time:before(s.deliveryCommitment,-6),source:'Synthetic carrier EDI'});
 if(s.status==='Delivered')s.events.push({name:'Delivered',raw:'DELIVERED',time:s.deliveryActual,source:'Synthetic carrier EDI'});
 if(s.status==='Partially delivered')s.events.push({name:'Partial delivery',raw:'PARTIAL_DELIVERY_1_OF_2_PRO',time:before(s.sourceUpdatedAt),source:'Synthetic carrier EDI'});
 s.events.sort((a,b)=>a.time.localeCompare(b.time));
 if(s.status==='Scheduled')s.lastLocation=lookup(s.origin).name+' origin facility';
 if(s.status==='Out for delivery')s.lastLocation=lookup(s.destination).name+' destination terminal';
}
const exceptions=templates.map(([idx,type,severity,nextAction,owner],i)=>({id:'EX-'+(1041+i),loadId:shipments[idx].id,facility:facilities.some(f=>f.id===shipments[idx].destination)?shipments[idx].destination:shipments[idx].origin,type,severity,nextAction,owner,status:owner==='Unassigned'?'New':i%3===0?'Awaiting carrier':'Investigating',detectedAt:i===2?at(28,15):at(30,7+i%5),dueAt:at(30,18),source:i===5?'Synthetic receiving report':i===6?'Synthetic invoice comparison':'Demo exception rules',reason:'',history:[{time:at(30,9),text:'Exception detected in the synthetic demonstration.',visibility:'Customer'}]}));
return {shipments,exceptions,reviews:[],savedViews:[],version:2};
}
export const emptyFilters=()=>({facility:'all',date:'month',direction:'all',carrier:'all',status:'all',q:'',lane:'',metric:'',weight:'all',freightClass:'all'});
export function filterShipments(data,f,role='corporate'){
return data.shipments.filter(s=>{
if(role==='facility'&&s.origin!=='GNV'&&s.destination!=='GNV')return false;
if(f.facility!=='all'&&s.origin!==f.facility&&s.destination!==f.facility)return false;
const start=f.date==='today'?'2026-10-30':f.date==='week'?'2026-10-24':'2026-10-01';
if(s.shipDate<start||s.shipDate>'2026-10-30')return false;
if(f.carrier!=='all'&&s.carrier!==f.carrier)return false;
if(f.status!=='all'&&s.status!==f.status)return false;
if(f.lane&&`${s.origin}|${s.destination}`!==f.lane)return false;
if(f.weight==='light'&&s.weight>=3000)return false;if(f.weight==='heavy'&&s.weight<3000)return false;
if(f.freightClass!=='all'&&s.class!==f.freightClass)return false;
const orig=facilities.some(n=>n.id===s.origin),dest=facilities.some(n=>n.id===s.destination);
if(f.direction==='interfacility'&&!(orig&&dest))return false;
if(f.direction==='inbound'&&!(f.facility!=='all'?s.destination===f.facility:!orig&&dest))return false;
if(f.direction==='outbound'&&!(f.facility!=='all'?s.origin===f.facility:orig&&!dest))return false;
if(f.q&&!`${s.id} ${s.pros.map(p=>p.number).join(' ')} ${s.bol} ${s.po} ${lookup(s.origin).name} ${lookup(s.destination).name}`.toLowerCase().includes(f.q.toLowerCase()))return false;
if(f.metric==='active'&&!isActive(s))return false;
if(f.metric==='pickups'&&!(localDate(s.pickupCommitment)==='2026-10-30'&&s.status!=='Cancelled'))return false;
if(f.metric==='deliveries'&&!(localDate(s.deliveryCommitment)==='2026-10-30'&&s.status!=='Cancelled'))return false;
if(f.metric==='service'&&!(s.status==='Delivered'&&s.deliveryActual&&s.deliveryCommitment))return false;
if(f.metric==='spend'&&s.status==='Cancelled')return false;
if(f.metric==='exceptions'&&!data.exceptions.some(e=>e.loadId===s.id&&e.status!=='Resolved'))return false;
return true;
});}
export const openExceptions=(data,ships)=>data.exceptions.filter(e=>e.status!=='Resolved'&&ships.some(s=>s.id===e.loadId));
export function metrics(ships,data){
const delivered=ships.filter(s=>s.status==='Delivered'&&s.deliveryActual&&s.deliveryCommitment),onTime=delivered.filter(s=>new Date(s.deliveryActual)<=new Date(s.deliveryCommitment));
const paid=ships.filter(s=>s.status!=='Cancelled'),invoice=paid.filter(s=>s.charges.invoiced!==null),estimate=paid.filter(s=>s.charges.invoiced===null);
return {active:ships.filter(isActive).length,pickups:ships.filter(s=>s.status!=='Cancelled'&&localDate(s.pickupCommitment)==='2026-10-30').length,deliveries:ships.filter(s=>s.status!=='Cancelled'&&localDate(s.deliveryCommitment)==='2026-10-30').length,exceptions:openExceptions(data,ships).length,denominator:delivered.length,onTime:onTime.length,otd:delivered.length?100*onTime.length/delivered.length:null,invoiced:invoice.reduce((a,s)=>a+s.charges.invoiced,0),estimated:estimate.reduce((a,s)=>a+s.charges.expected,0),spend:paid.reduce((a,s)=>a+(s.charges.invoiced??s.charges.expected),0),spendCount:paid.length};}
export const laneGroups=ships=>Object.values(ships.reduce((m,s)=>{const key=s.origin+'|'+s.destination;m[key]??={key,origin:s.origin,destination:s.destination,ships:[],spend:0};m[key].ships.push(s);m[key].spend+=s.charges.invoiced??s.charges.expected;return m},{}));
export function updateException(data,id,patch,note,visibility,now=new Date().toISOString()){
const e=data.exceptions.find(e=>e.id===id);if(!e)throw Error('Unknown exception');
if(patch.status==='Resolved'&&!patch.reason?.trim())throw Error('A resolution reason is required.');
const changes=['owner','status','severity','nextAction','dueAt','reason'].filter(k=>patch[k]!==undefined&&patch[k]!==e[k]).map(k=>`${k}: ${e[k]||'—'} → ${patch[k]}`);
Object.assign(e,patch);e.history.push({time:now,text:[changes.join('; '),note].filter(Boolean).join(' · ')||'Reviewed without changes',visibility});return e;
}
export function csv(ships,finance=true){
const cols=['Load ID','PRO numbers','BOL','PO','Origin','Destination','Carrier','Status','Promised delivery UTC','ETA UTC','Source update UTC','Pallets','Weight lb',...(finance?['Charge basis','Customer charge USD']:[])];
const safe=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
return '\ufeff'+[cols,...ships.map(s=>[s.id,s.pros.map(p=>p.number).join('; '),s.bol,s.po,lookup(s.origin).name,lookup(s.destination).name,s.carrier,s.status,s.deliveryCommitment,s.eta,s.sourceUpdatedAt,s.pallets,s.weight,...(finance?[s.charges.invoiced===null?'Estimated':'Invoiced',s.charges.invoiced??s.charges.expected]:[])])].map(r=>r.map(safe).join(',')).join('\r\n');
}
