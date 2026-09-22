document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('[data-nav]');
  const menu=document.querySelector('[data-nav-toggle]');
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const theme=document.querySelector('[data-theme-toggle]');
  const themeKey='3sg-theme';
  if(localStorage.getItem(themeKey)==='dark')document.body.classList.add('theme-dark');
  theme?.addEventListener('click',()=>{document.body.classList.toggle('theme-dark');localStorage.setItem(themeKey,document.body.classList.contains('theme-dark')?'dark':'light');});

  const toast=document.querySelector('[data-toast]');let toastTimer;
  const notify=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2500)};

  const savedKey='3sg-saved-items';
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(savedKey)||'[]')}catch{return []}};
  const setSaved=items=>{localStorage.setItem(savedKey,JSON.stringify([...new Set(items)]));renderSaved();};
  function renderSaved(){
    const saved=getSaved();
    document.querySelectorAll('[data-saved-count]').forEach(el=>el.textContent=String(saved.length));
    document.querySelectorAll('[data-save]').forEach(btn=>{const on=saved.includes(btn.dataset.save);btn.classList.toggle('saved',on);btn.textContent=on?'Saved':'Save';});
    const list=document.querySelector('[data-saved-list]');
    if(list){list.innerHTML=saved.length?saved.map(name=>`<div class="saved-row"><span>${name}</span><button type="button" data-remove-saved="${name}">Remove</button></div>`).join(''):'<p>No saved items yet.</p>';list.querySelectorAll('[data-remove-saved]').forEach(btn=>btn.addEventListener('click',()=>setSaved(getSaved().filter(x=>x!==btn.dataset.removeSaved))));}
  }
  document.querySelectorAll('[data-save]').forEach(btn=>btn.addEventListener('click',()=>{const items=getSaved();const name=btn.dataset.save;setSaved(items.includes(name)?items.filter(x=>x!==name):[...items,name]);notify(items.includes(name)?'Removed from saved items.':'Saved for your preorder.');}));
  renderSaved();

  const search=document.querySelector('.catalog-search');
  const filter=document.querySelector('.catalog-filter');
  const cards=[...document.querySelectorAll('.filterable-catalog .searchable-card')];
  const empty=document.querySelector('.catalog-empty');
  function applyCatalog(){const q=(search?.value||'').toLowerCase().trim();const c=filter?.value||'all';let visible=0;cards.forEach(card=>{const show=(!q||(card.dataset.search||'').includes(q))&&(c==='all'||card.dataset.category===c);card.hidden=!show;if(show)visible++;});if(empty)empty.hidden=visible!==0;}
  search?.addEventListener('input',applyCatalog);filter?.addEventListener('change',applyCatalog);

  document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const status=form.querySelector('.form-status');if(status)status.textContent='Demo only — no information was transmitted. Connect a real ordering/form service before launch.';notify('Demo request prepared — nothing was sent.');}));

  document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&d.parentElement?.classList.contains('accordion'))[...d.parentElement.children].filter(x=>x!==d&&x.tagName==='DETAILS').forEach(x=>x.open=false);}));

  const reveal=[...document.querySelectorAll('main > section')];reveal.forEach(el=>el.classList.add('reveal'));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.06});reveal.forEach(el=>io.observe(el));}else reveal.forEach(el=>el.classList.add('visible'));
});
