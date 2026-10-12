/*! PlainDPDP anonymous audience: no cookie, no identifier, no IP stored. Same pattern as octave-checkout gas/web/mesure.js */
((n,l,d)=>{let q=new URLSearchParams(l.search),A=(k,f)=>d.addEventListener(k,f,!0),b,t;
window.pdTrack=()=>{};
if(n.doNotTrack=='1'||n.globalPrivacyControl||l.hostname!='outils.vread.fr')return;
b={site:'plaindpdp',page:l.pathname,ref_domain:d.referrer.split('/')[2],device:innerWidth<768?'mobile':'desktop',variant:window.pdVariant||''};
for(let g of['source','medium','campaign'])b['utm_'+g]=q.get('utm_'+g);
t=v=>{b.event=v;b.ts=Date.now();try{fetch('https://script.google.com/macros/s/AKfycbxtPsxjdWpguJKKJ5nPN0K1NZSUCmMKpjmrkhM49wNv-0ySFsfq6aHNN2bt3puvlk1nhQ/exec?action=track',{method:'POST',keepalive:!0,credentials:'omit',redirect:'manual',body:JSON.stringify(b)}).catch(e=>0)}catch{}};
window.pdTrack=t;t('view');
A('click',e=>{let a=e.target.closest?.('a,button'),h=a?.dataset.mesure;h&&t(h)})})(navigator,location,document)
