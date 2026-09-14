const maps = ['mp_4t4scrap','mp_rats_sansa_room','mp_efa_lake','mp_little_residence','mp_shipmentx2','mp_uber','mp_uprise','mp_vovel','mp_asylum','mp_bank','mp_bo2paintball','mp_cellblocks','mp_decoy_day'];
const admins = ['Alpha','Atbirra','Col. Kurtz','RCparana'];
const moderators = ['Micho','Pantera','Saurido','WiS_K4:)'];
const members = ['Alpha','Aquiles Báez Zabala','Atbirra','Col. Kurtz','DJ M4nk-0','Fabiannn','Fénix','Hoor','Mapuche','Micho','Monomario','Nacho','Pantera','R2Fly','RCparana','Saurido','Sin Piedad','thebestsong','Viejo Choto','WiS_K4:)','Zhivago'];

document.querySelector('#mapList').innerHTML = maps.map(m => `<div>${m}</div>`).join('');
document.querySelector('#adminList').innerHTML = admins.map(n => `<div>${n}</div>`).join('');
document.querySelector('#modList').innerHTML = moderators.map(n => `<div>${n}</div>`).join('');
document.querySelector('#memberList').innerHTML = members.map(n => `<div>${n}</div>`).join('');

function toast(msg){
  const el=document.querySelector('#toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>el.classList.remove('show'),1800);
}
async function copyIP(serverIP){
  try{ await navigator.clipboard.writeText(serverIP); toast('IP copiada: '+serverIP); }
  catch{ toast('IP: '+serverIP); }
};
function connectServer(serverIP, serverName){
  copyIP(serverIP);
  setTimeout(()=>toast(serverName+': /connect '+serverIP),250);
};

const serverNames = { 1: '|MGA| 1 S&D', 2: '|MGA| 2 Sniper' };
const serverAddresses = {};

function isValidServerAddress(value){
  return /^[a-zA-Z0-9.-]+:\d{1,5}$/.test(value);
}

async function loadServerAddress(number){
  const response = await fetch(`ip_server_${number}.txt`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Servidor ${number} no disponible`);
  const address = (await response.text())
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(line => line && !line.startsWith('#')) || '';
  if (!isValidServerAddress(address)) throw new Error(`Dirección inválida para servidor ${number}`);
  serverAddresses[number] = address;
  document.querySelectorAll(`[data-server-ip="${number}"]`).forEach(el => { el.textContent = address; });
  document.querySelectorAll(`[data-server="${number}"]`).forEach(button => { button.disabled = false; });
  return address;
}

document.querySelectorAll('[data-server-action]').forEach(button => button.addEventListener('click', () => {
  const number = button.dataset.server;
  const address = serverAddresses[number];
  if (!address) return;
  if (button.dataset.serverAction === 'copy') copyIP(address);
  else connectServer(address, serverNames[number]);
}));

Promise.all([loadServerAddress(1), loadServerAddress(2)])
  .catch(() => {
    document.querySelectorAll('[data-server-ip]').forEach(el => {
      if (el.textContent === 'CARGANDO…') el.textContent = 'NO DISPONIBLE';
    });
  });

function parseGameTrackerUrl(text){
  const value = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(line => line && !line.startsWith('#')) || '';
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:' || !/(^|\.)gametracker\.com$/i.test(url.hostname)) throw new Error('URL de GameTracker inválida');
  const match = url.pathname.match(/^\/server_info\/([^/]+)\/?$/i);
  if (!match) throw new Error('URL de servidor inválida');
  const address = decodeURIComponent(match[1]);
  if (!isValidServerAddress(address)) throw new Error('Dirección de GameTracker inválida');
  return { url: url.href, address };
}

fetch('gametracker_server_1.txt', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('GameTracker 1 no disponible');
    return response.text();
  })
  .then(text => {
    const tracker = parseGameTrackerUrl(text);
    if (!tracker) return;
    const widget = document.querySelector('#gameTrackerWidget');
    const link = document.querySelector('#gameTrackerLink');
    if (widget) widget.src = `https://cache.gametracker.com/components/html0/?host=${encodeURIComponent(tracker.address)}&bgColor=11120e&fontColor=d9d5c8&titleBgColor=151710&titleColor=a0ad60&borderColor=454333&linkColor=b4893d&borderLinkColor=3b3a2b&showMap=1&currentPlayersHeight=200&showCurrPlayers=1&topPlayersHeight=130&showTopPlayers=1&showBlogs=0&width=250`;
    if (link) link.href = tracker.url;
  })
  .catch(() => {
    // El resto de la página sigue operativo si GameTracker no responde.
  });

fetch('gametracker_server_2.txt', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('GameTracker 2 no disponible');
    return response.text();
  })
  .then(text => {
    const tracker = parseGameTrackerUrl(text);
    if (!tracker) return;
    const slot = document.querySelector('#gameTracker2Slot');
    if (!slot) return;
    slot.className = 'gametracker-widget';
    slot.innerHTML = `<iframe src="https://cache.gametracker.com/components/html0/?host=${encodeURIComponent(tracker.address)}&bgColor=11120e&fontColor=d9d5c8&titleBgColor=151710&titleColor=a0ad60&borderColor=454333&linkColor=b4893d&borderLinkColor=3b3a2b&showMap=1&currentPlayersHeight=200&showCurrPlayers=1&topPlayersHeight=130&showTopPlayers=1&showBlogs=0&width=250" frameborder="0" scrolling="no" width="250" height="666" title="GameTracker |MGA| 2 Sniper"></iframe>`;
  })
  .catch(() => {
    // El segundo GameTracker es opcional hasta que el servidor esté registrado.
  });

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
