const SERVER_IP = '45.235.99.18:28960';
const maps = ['mp_4t4scrap','mp_rats_sansa_room','mp_efa_lake','mp_little_residence','mp_shipmentx2','mp_uber','mp_uprise','mp_vovel','mp_asylum','mp_bank','mp_bo2paintball','mp_cellblocks','mp_decoy_day'];
const admins = ['Alpha','Atbirra','Col. Kurtz','RCparana'];
const moderators = ['Micho','Pantera','Saurido','WiS_K4:)'];
const members = ['Alpha','Aquiles Báez Zabala','Atbirra','Col. Kurtz','DJ Pajero','Fabiannn','Fénix','Hoor','Mapuche','Micho','Monomario','Nacho','Pantera','R2Fly','RCparana','Saurido','Sin Piedad','thebestsong','Viejo Choto','WiS_K4:)','XXX','Zhivago'];

document.querySelector('#mapList').innerHTML = maps.map(m => `<div>${m}</div>`).join('');
document.querySelector('#adminList').innerHTML = admins.map(n => `<div>${n}</div>`).join('');
document.querySelector('#modList').innerHTML = moderators.map(n => `<div>${n}</div>`).join('');
document.querySelector('#memberList').innerHTML = members.map(n => `<div>${n}</div>`).join('');

function toast(msg){
  const el=document.querySelector('#toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>el.classList.remove('show'),1800);
}
window.copyIP = async function(){
  try{ await navigator.clipboard.writeText(SERVER_IP); toast('IP copiada: '+SERVER_IP); }
  catch{ toast('IP: '+SERVER_IP); }
};
window.connectServer = function(){
  copyIP();
  setTimeout(()=>toast('Abrí COD4 y usá: /connect '+SERVER_IP),250);
};

const menuBtn=document.querySelector('#menuBtn');
const sidebar=document.querySelector('#sidebar');
menuBtn.addEventListener('click',()=>sidebar.classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelectorAll('.main-nav a').forEach(x=>x.classList.remove('active'));
  a.classList.add('active');
  sidebar.classList.remove('open');
}));


// Contador de visitas opcional. La web funciona normalmente aunque PHP no esté disponible.
(function loadVisitorCount(){
  const el = document.querySelector('#visitCounter');
  if (!el) return;

  fetch('contador.php', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Contador no disponible');
      return response.text();
    })
    .then(text => {
      const count = Number.parseInt(text.trim(), 10);
      if (!Number.isFinite(count) || count < 0) throw new Error('Respuesta inválida');
      el.innerHTML = `<strong>${count.toLocaleString('es-UY')} Visitas</strong>`;
    })
    .catch(() => {
      // Degradación silenciosa: no afecta el resto de la página.
      el.innerHTML = '<strong>Visitas</strong>';
    });
})();
