const menuBtn=document.querySelector('[data-menu]');
const nav=document.querySelector('.navlinks');
menuBtn?.addEventListener('click',()=>nav?.classList.toggle('open'));

document.querySelectorAll('[data-rail]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const rail=document.getElementById(btn.dataset.rail);
    if(!rail)return;
    const dir=btn.dataset.dir==='next'?1:-1;
    rail.scrollBy({left:dir*Math.max(260,rail.clientWidth*.8),behavior:'smooth'});
  });
});

document.querySelectorAll('[data-device-deck]').forEach(deck=>{
  let images=[];
  try{images=JSON.parse(deck.dataset.images||'[]')}catch{}
  const img=deck.querySelector('[data-device-image]');
  const dots=deck.querySelector('[data-device-dots]');
  let index=0;
  const render=()=>{
    if(!img||!images.length)return;
    img.src=images[index];
    if(dots){
      dots.innerHTML='';
      images.forEach((_,i)=>{
        const d=document.createElement('span');
        d.className='tablet-dot'+(i===index?' active':'');
        d.addEventListener('click',()=>{index=i;render()});
        dots.appendChild(d);
      });
    }
  };
  deck.querySelector('[data-device-prev]')?.addEventListener('click',()=>{index=(index-1+images.length)%images.length;render()});
  deck.querySelector('[data-device-next]')?.addEventListener('click',()=>{index=(index+1)%images.length;render()});
  deck.querySelector('.tablet-screen')?.addEventListener('click',()=>{index=(index+1)%images.length;render()});
  render();
});

document.querySelectorAll('[data-stack]').forEach(stage=>{
  const cards=[...stage.querySelectorAll('.stack-card')];
  cards.forEach(card=>card.addEventListener('click',()=>{
    const first=cards.findIndex(c=>getComputedStyle(c).zIndex==='5');
    if(first>=0){
      const ordered=[...cards.slice(first+1),...cards.slice(0,first+1)];
      ordered.forEach((c,i)=>c.style.zIndex=String(cards.length-i));
    } else {
      const top=cards[0]; stage.appendChild(top);
    }
  }));
});

document.querySelectorAll('[data-flipbook]').forEach(book=>{
  const pages=[...book.querySelectorAll('.flip-page')];
  let index=0;
  const render=()=>pages.forEach((p,i)=>{
    p.classList.remove('active','behind','hidden');
    if(i===index)p.classList.add('active');
    else if(i===(index+1)%pages.length)p.classList.add('behind');
    else p.classList.add('hidden');
  });
  book.addEventListener('click',()=>{index=(index+1)%pages.length;render()});
  render();
});

const lightbox=document.querySelector('.lightbox');
const lightboxImg=lightbox?.querySelector('img');
document.querySelectorAll('.zoom').forEach(el=>{
  el.style.cursor='zoom-in';
  el.addEventListener('click',e=>{
    e.stopPropagation();
    if(!lightbox||!lightboxImg)return;
    lightboxImg.src=el.currentSrc||el.src;
    lightbox.classList.add('open');
  });
});
lightbox?.addEventListener('click',e=>{
  if(e.target===lightbox||e.target.tagName==='BUTTON'){
    lightbox.classList.remove('open');
    if(lightboxImg)lightboxImg.src='';
  }
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.target.tagName!=='VIDEO')return;
    if(entry.isIntersecting){entry.target.play().catch(()=>{})}
    else entry.target.pause();
  });
},{threshold:.45});
document.querySelectorAll('video').forEach(v=>{v.muted=true;v.loop=true;v.playsInline=true;observer.observe(v)});
