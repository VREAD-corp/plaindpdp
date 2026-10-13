/*! PlainDPDP anonymous audience: no cookie, no identifier, no IP stored. Same pattern as octave-checkout gas/web/mesure.js */
((n,l,d)=>{let q=new URLSearchParams(l.search),A=(k,f)=>d.addEventListener(k,f,!0),b,t,x='',s,go;
window.pdTrack=()=>{};
if(n.doNotTrack=='1'||n.globalPrivacyControl||l.hostname!='outils.vread.fr')return;
// Not a visit (counted apart, by reason): our tests (?octave_notrack=1, remembered here; =0 clears), automated browsers, crawlers. The user agent is read here, never sent.
try{s=localStorage;if(q.has('octave_notrack'))q.get('octave_notrack')=='1'?s.setItem('octave_notrack','1'):s.removeItem('octave_notrack');if(s.getItem('octave_notrack')=='1')x='notrack'}catch{}
if(!x&&q.get('octave_notrack')=='1')x='notrack';
if(!x&&n.webdriver)x='webdriver';
if(!x&&/bot\b|crawl|spider|slurp|headless|lighthouse|pagespeed|inspectiontool|googleother|mediapartners|bingpreview|phantom|puppeteer|playwright|selenium/i.test(n.userAgent||''))x='bot';
b={site:'plaindpdp',v:2,page:l.pathname,ref_domain:d.referrer.split('/')[2],device:innerWidth<768?'mobile':'desktop',variant:window.pdVariant||''};
if(x)b.excluded=x;
for(let g of['source','medium','campaign'])b['utm_'+g]=q.get('utm_'+g);
t=v=>{b.event=v;b.ts=Date.now();try{fetch('https://script.google.com/macros/s/AKfycbxtPsxjdWpguJKKJ5nPN0K1NZSUCmMKpjmrkhM49wNv-0ySFsfq6aHNN2bt3puvlk1nhQ/exec?action=track',{method:'POST',keepalive:!0,credentials:'omit',redirect:'manual',body:JSON.stringify(b)}).catch(e=>0)}catch{}};
window.pdTrack=t;
// A prerendered or prefetched page is counted only once the visitor actually opens it.
go=()=>t('view');
if(d.prerendering)d.addEventListener('prerenderingchange',go,{once:!0});
else if(d.visibilityState=='prerender'){let v=()=>{if(d.visibilityState!='prerender'){d.removeEventListener('visibilitychange',v);go()}};d.addEventListener('visibilitychange',v)}
else go();
A('click',e=>{let a=e.target.closest?.('a,button'),h=a?.dataset.mesure;h&&t(h)})})(navigator,location,document)
