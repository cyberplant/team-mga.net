const SERVER_IP = '45.235.99.18:28960';
const maps = [
  { id: 'mp_4t4scrap', name: '4T4 Scrap', blurb: 'Chatarrería compacta para 4 vs 4. Combate cerrado y ritmo alto.' },
  { id: 'mp_rats_sansa_room', name: 'Rats Sansa Room', blurb: 'Mapa rats de una sola habitación. Distancias mínimas, CQB puro.' },
  { id: 'mp_efa_lake', name: 'EFA Lake', blurb: 'Remake de Lake (CS). Cabaña junto al lago, mapa chico y lecturas rápidas.' },
  { id: 'mp_little_residence', name: 'Little Residence', blurb: 'Casa chica con interiores cortos. Ideal para peleas de cerca.' },
  { id: 'mp_shipmentx2', name: 'Shipment x2', blurb: 'Doble Shipment. Contenedores, spawns cruzados y acción constante.' },
  { id: 'mp_uber', name: 'Uber', blurb: 'Suburbio desértico de tamaño medio. Calles, patios y flanqueos.' },
  { id: 'mp_uprise', name: 'Uprise', blurb: 'Favela urbana. Alturas, callejones y control de techos.' },
  { id: 'mp_vovel', name: 'Vovel', blurb: 'Remake de Vovel (CoD2). Mapa medio, con varios ángulos para aguantar.' },
  { id: 'mp_asylum', name: 'Asylum', blurb: 'Remake del manicomio de WaW. Pasillos, salas y combates de media distancia.' },
  { id: 'mp_bank', name: 'Bank', blurb: 'Interior de un banco. Mostradores, oficinas y CQB.' },
  { id: 'mp_bo2paintball', name: 'BO2 Paintball', blurb: 'Arena de paintball estilo Black Ops 2. Coberturas bajas y campo abierto.' },
  { id: 'mp_cellblocks', name: 'Cellblocks', blurb: 'Bloques de celdas. Pasillos estrechos y peleas de rincón a rincón.' },
  { id: 'mp_decoy_day', name: 'Decoy Day', blurb: 'Versión diurna de Decoy (CoD2). Pueblo de tamaño medio.' }
];
const admins = ['Alpha','Atbirra','Col. Kurtz','RCparana'];
const moderators = ['Micho','Pantera','Saurido','WiS_K4:)'];
const members = ['Alpha','Aquiles Báez Zabala','Atbirra','Col. Kurtz','DJ Pajero','Fabiannn','Fénix','Hoor','Mapuche','Micho','Monomario','Nacho','Pantera','R2Fly','RCparana','Saurido','Sin Piedad','thebestsong','Viejo Choto','WiS_K4:)','XXX','Zhivago'];

const mapList = document.querySelector('#mapList');
const mapCount = document.querySelector('#mapCount');
mapList.innerHTML = maps.map((m, i) => `
  <div class="map-item">
    <button type="button" class="map-item-btn" aria-expanded="false" aria-controls="map-tip-${i}" aria-label="${m.name}. Ver briefing">
      <span class="map-item-copy">
        <span class="map-item-name">${m.name}</span>
        <span class="map-item-id">${m.id}</span>
      </span>
      <span class="map-item-mark" aria-hidden="true"></span>
    </button>
    <p class="map-item-tip" id="map-tip-${i}" hidden>${m.blurb}</p>
  </div>
`).join('');
if (mapCount) mapCount.textContent = String(maps.length);

function closeMapBriefings(){
  mapList.querySelectorAll('.map-item').forEach((item) => {
    item.classList.remove('is-open');
    const btn = item.querySelector('.map-item-btn');
    const tip = item.querySelector('.map-item-tip');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (tip) tip.hidden = true;
  });
}
mapList.addEventListener('click', (e) => {
  const btn = e.target.closest('.map-item-btn');
  if (!btn) return;
  const item = btn.closest('.map-item');
  const wasOpen = item.classList.contains('is-open');
  closeMapBriefings();
  if (wasOpen) return;
  item.classList.add('is-open');
  btn.setAttribute('aria-expanded', 'true');
  const tip = item.querySelector('.map-item-tip');
  if (tip) tip.hidden = false;
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('#mapList')) closeMapBriefings();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMapBriefings();
});
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
