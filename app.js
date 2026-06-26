// Emergency AI Command Center Core Application Logic

// ================= STATE DEFINITION =================
const state = {
  activeTab: 'dashboard',
  shelters: [
    {
      id: 'shelter-1',
      name: 'Vyasarpadi Community Hall (Shelter Alpha)',
      sector: 'A',
      distance: 0.8,
      capacity: 150,
      occupancy: 45,
      amenities: ['medical', 'power', 'meals'],
      contact: '044-2561-9283',
      notes: 'Fully operational. GCC backup diesel generator active. Standard medical tent staffed by local government doctors.'
    },
    {
      id: 'shelter-2',
      name: 'Nungambakkam Stadium Complex (Shelter Beta)',
      sector: 'D',
      distance: 1.5,
      capacity: 500,
      occupancy: 485,
      amenities: ['medical', 'power', 'meals', 'pet'],
      contact: '044-2827-4455',
      notes: 'WARNING: Near maximum capacity. GCC relief kitchen active. Emergency vehicles and critical cases prioritized.'
    },
    {
      id: 'shelter-3',
      name: 'Adyar Youth Hostel (Shelter Gamma)',
      sector: 'B',
      distance: 2.3,
      capacity: 120,
      occupancy: 88,
      amenities: ['meals', 'pet'],
      contact: '044-2491-8812',
      notes: 'Operational. Hot meals (khichdi and tea) served by local volunteers at 08:00, 13:00, and 18:00.'
    },
    {
      id: 'shelter-4',
      name: 'Guindy Industrial Training Center (Shelter Delta)',
      sector: 'E',
      distance: 3.1,
      capacity: 200,
      occupancy: 32,
      amenities: ['power', 'meals'],
      contact: '044-2250-9944',
      notes: 'High vacancy. Solar micro-grid running. Good choice for battery recharging, but limited medical crew.'
    }
  ],
  selectedShelterId: null,
  
  // Grid coordinates representing local sector nodes
  nodes: {
    'A': { name: 'Sector A (North Chennai - Vyasarpadi)', x: 120, y: 80 },
    'B': { name: 'Sector B (East Coast - Adyar / Besant Nagar)', x: 380, y: 90 },
    'C': { name: 'Sector C (Lowland Basin - Velachery)', x: 90, y: 260 },
    'D': { name: 'Sector D (Central Hub - Nungambakkam)', x: 250, y: 190 },
    'E': { name: 'Sector E (Industrial Belt - Guindy / Ambattur)', x: 220, y: 320 },
    'F': { name: 'Sector F (Hills Access / Southern Outskirts - Tambaram)', x: 420, y: 280 }
  },
  
  // Roads connecting the nodes
  roads: [
    { from: 'A', to: 'B', status: 'safe', notes: 'Clear route' },
    { from: 'A', to: 'D', status: 'safe', notes: 'Clear route' },
    { from: 'B', to: 'D', status: 'safe', notes: 'Minor waterlogging' },
    { from: 'B', to: 'F', status: 'safe', notes: 'Clear route' },
    { from: 'C', to: 'D', status: 'blocked', notes: 'Severe Flooding (Velachery lake overflowed)' },
    { from: 'C', to: 'E', status: 'safe', notes: 'Clear route' },
    { from: 'D', to: 'E', status: 'safe', notes: 'Clear route' },
    { from: 'D', to: 'F', status: 'blocked', notes: 'Landslip (Tambaram bypass blocked)' },
    { from: 'E', to: 'F', status: 'safe', notes: 'Clear route' }
  ],
  
  // Simulated news logs
  newsFeed: [
    { type: 'alert', title: 'Road Closure: Velachery to Central', body: 'Velachery-Taramani link road submersed under 4 feet of water. Avoid C-D route.', time: '2 mins ago' },
    { type: 'info', title: 'NDRF Evacuation Dispatch', body: 'NDRF Unit 4 has arrived at Adyar with inflatable rescue boats. Relocating families to Shelter Gamma.', time: '10 mins ago' },
    { type: 'success', title: 'Power Restored in Vyasarpadi', body: 'Local TNEB sub-station team restored power lines in Sector A community zones.', time: '22 mins ago' },
    { type: 'alert', title: 'Landslide on Tambaram Bypass', body: 'Heavy landslip near Tambaram bypass junction blocking highway traffic. Route D-F closed.', time: '40 mins ago' }
  ],
  
  // Radar state for canvas animation
  radarAngle: 0,
  radarSweepActive: true,
  radarPings: [
    { x: 120, y: 80, type: 'shelter', label: 'Vyasarpadi Shelter' },
    { x: 380, y: 90, type: 'shelter', label: 'Adyar Shelter' },
    { x: 250, y: 190, type: 'shelter', label: 'Nungambakkam Shelter' },
    { x: 220, y: 320, type: 'shelter', label: 'Guindy Shelter' },
    { x: 90, y: 260, type: 'danger', label: 'Velachery Flooding' },
    { x: 420, y: 280, type: 'danger', label: 'Tambaram Landslip' },
    { x: 180, y: 150, type: 'user', label: 'Active SOS' }
  ],
  
  // User selected route path display
  assessedRoute: null,
  
  // Supply Checklist checklist data
  currentChecklist: [],

  // New Advanced Features State
  weatherRadarActive: false,
  weatherRadarOffset: 0,
  activeVehicles: [],
  dispatchQueue: [
    { id: 'd-1', victim: 'Rescue Request #420', sector: 'C', incident: 'Velachery waterlogging relief', priority: 'critical', status: 'pending', x: 90, y: 260 },
    { id: 'd-2', victim: 'Medical Request #108', sector: 'F', incident: 'Oxygen support generator failure', priority: 'high', status: 'pending', x: 420, y: 280 },
    { id: 'd-3', victim: 'Supply Request #782', sector: 'B', incident: 'Food packet drop near Adyar river', priority: 'medium', status: 'pending', x: 380, y: 90 }
  ]
};

// ================= DOM ELEMENT SELECTION =================
const DOM = {
  navLinks: document.querySelectorAll('.nav-menu .nav-item'),
  panels: document.querySelectorAll('.content-panel'),
  
  // Dashboard elements
  newsFeedContainer: document.getElementById('news-feed-container'),
  btnSimulateDisaster: document.getElementById('btn-simulate-disaster'),
  btnRadarScan: document.getElementById('btn-radar-scan'),
  btnWeatherRadar: document.getElementById('btn-weather-radar'),
  legendWeather: document.getElementById('legend-weather-container'),
  dispatchQueueContainer: document.getElementById('dispatch-queue-container'),
  
  // Broadcast elements
  broadcastScope: document.getElementById('broadcast-scope'),
  broadcastMsgInput: document.getElementById('broadcast-msg-input'),
  btnSendBroadcast: document.getElementById('btn-send-broadcast'),
  ebsOverlay: document.getElementById('ebs-overlay'),
  ebsMsgText: document.getElementById('ebs-msg-text'),
  btnCloseBroadcast: document.getElementById('btn-close-broadcast'),
  
  statShelters: document.getElementById('stat-shelters-open'),
  statRoads: document.getElementById('stat-roads-blocked'),
  statThreats: document.getElementById('stat-active-threats'),
  
  // Shelter finder elements
  shelterSearch: document.getElementById('shelter-search'),
  shelterAmenity: document.getElementById('shelter-amenity-filter'),
  shelterStatus: document.getElementById('shelter-status-filter'),
  shelterList: document.getElementById('shelter-list-container'),
  shelterDetailEmpty: document.getElementById('shelter-detail-empty'),
  shelterDetailContent: document.getElementById('shelter-detail-content'),
  detailName: document.getElementById('detail-shelter-name'),
  detailStatus: document.getElementById('detail-shelter-status'),
  detailLocation: document.getElementById('detail-shelter-location'),
  detailOccupancyRatio: document.getElementById('detail-shelter-occupancy-ratio'),
  detailOccupancyBar: document.getElementById('detail-shelter-occupancy-bar'),
  detailAmenities: document.getElementById('detail-shelter-amenities'),
  detailNotes: document.getElementById('detail-shelter-notes'),
  btnShelterRoute: document.getElementById('btn-shelter-route'),
  btnShelterContact: document.getElementById('btn-shelter-contact'),
  
  // Route elements
  routeStart: document.getElementById('route-start'),
  routeEnd: document.getElementById('route-end'),
  btnAssessRoute: document.getElementById('btn-assess-route'),
  routeResults: document.getElementById('route-results-container'),
  
  // Triage chat elements
  chatMessages: document.getElementById('chat-messages-container'),
  chatUserInput: document.getElementById('chat-user-input'),
  btnChatSend: document.getElementById('btn-chat-send'),
  triagePriorityTag: document.getElementById('triage-priority-tag'),
  triageRecommendations: document.getElementById('triage-recommendations-list'),
  triageDispatchStatus: document.getElementById('triage-dispatch-status'),
  
  // Supply Checklist elements
  supplyScenario: document.getElementById('supply-scenario'),
  supplyPeople: document.getElementById('supply-people-count'),
  supplyDuration: document.getElementById('supply-duration'),
  btnGenerateSupplies: document.getElementById('btn-generate-supplies'),
  btnPrintSupplies: document.getElementById('btn-print-supplies'),
  btnResetChecklist: document.getElementById('btn-reset-checklist'),
  checklistProgressRatio: document.getElementById('checklist-progress-ratio'),
  checklistProgressFill: document.getElementById('checklist-progress-fill'),
  checklistItems: document.getElementById('checklist-items-container')
};

// ================= SYSTEM INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupDashboardMap();
  setupShelterFinder();
  setupSafeRouting();
  setupTriageBot();
  setupSupplyPlanner();
  setupAdvancedFeatures();
  
  // Populate initial logs
  renderNewsFeed();
  
  // Trigger default supply checklist generation
  generateSupplyChecklist();
  
  // Initial draw of maps
  window.dispatchEvent(new Event('resize'));
});

// ================= NAVIGATION HANDLER =================
function setupNavigation() {
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tabName = link.getAttribute('data-tab');
      state.activeTab = tabName;
      
      // Update UI active links
      DOM.navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      
      // Update active panels
      DOM.panels.forEach(panel => {
        if (panel.id === tabName) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
      
      // Perform resize triggers to update Canvas layouts
      setTimeout(() => {
        resizeCanvases();
      }, 50);
    });
  });
}

// Handle layout canvas sizing
function resizeCanvases() {
  const dCanvas = document.getElementById('map-canvas');
  if (dCanvas && dCanvas.offsetParent !== null) {
    dCanvas.width = dCanvas.parentElement.clientWidth;
    dCanvas.height = dCanvas.parentElement.clientHeight || 380;
  }
  const rCanvas = document.getElementById('route-map-canvas');
  if (rCanvas && rCanvas.offsetParent !== null) {
    rCanvas.width = rCanvas.parentElement.clientWidth;
    rCanvas.height = rCanvas.parentElement.clientHeight || 450;
    drawRouteMap();
  }
}
window.addEventListener('resize', resizeCanvases);

// ================= SYSTEM STATS & LOGS =================
function renderNewsFeed() {
  DOM.newsFeedContainer.innerHTML = '';
  state.newsFeed.forEach(item => {
    const el = document.createElement('div');
    el.className = 'news-item';
    
    let badgeClass = 'info';
    let badgeText = 'INFO';
    if (item.type === 'alert') {
      badgeClass = 'alert';
      badgeText = 'ALERT';
    } else if (item.type === 'success') {
      badgeClass = 'success';
      badgeText = 'SUCCESS';
    }
    
    el.innerHTML = `
      <span class="news-badge ${badgeClass}">${badgeText}</span>
      <div class="news-details">
        <div class="news-title">${item.title}</div>
        <p style="font-size:12px; color:var(--color-text-muted); line-height:1.4; margin-top:2px;">${item.body}</p>
        <span class="news-time">${item.time}</span>
      </div>
    `;
    DOM.newsFeedContainer.appendChild(el);
  });
  
  // Update stats
  DOM.statShelters.textContent = state.shelters.filter(s => s.occupancy < s.capacity).length + ' Open';
  DOM.statRoads.textContent = state.roads.filter(r => r.status === 'blocked').length;
  DOM.statThreats.textContent = state.roads.filter(r => r.status === 'blocked').length + 1; // Simulated hazard count
}

// Generate new random event alerts for visual immersion
setInterval(() => {
  const alertsList = [
    { type: 'info', title: 'Medical Supply Drop', body: 'Extra insulin and first aid kits dispatched to Shelter Alpha.' },
    { type: 'alert', title: 'Flash Flood Hazard', body: 'Sector E industrial drain overflow reported. Keep to elevated structures.' },
    { type: 'success', title: 'Road Safety Cleared', body: 'Minor debris on Route 1 (Sector A-B) cleared by local volunteers.' },
    { type: 'info', title: 'Power Grid Stabilization', body: 'Generator cells at Shelter Delta initialized. 100% station lighting active.' }
  ];
  
  const selected = alertsList[Math.floor(Math.random() * alertsList.length)];
  selected.time = 'Just now';
  
  // Unshift to keep news feed fresh
  state.newsFeed.unshift(selected);
  if (state.newsFeed.length > 6) state.newsFeed.pop();
  
  // Render ticker updater
  if (selected.type === 'alert') {
    const ticker = document.getElementById('live-alert-ticker');
    ticker.textContent = `🚨 URGENT UPDATE: ${selected.title} - ${selected.body} | ${ticker.textContent}`;
  }
  
  renderNewsFeed();
}, 20000);

// ================= INTERACTIVE RADAR & MAP CANVAS =================
let animationFrameId = null;

function setupDashboardMap() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  DOM.btnRadarScan.addEventListener('click', () => {
    state.radarSweepActive = !state.radarSweepActive;
    if (state.radarSweepActive) {
      animate();
    }
  });

  if (DOM.btnWeatherRadar) {
    DOM.btnWeatherRadar.addEventListener('click', () => {
      state.weatherRadarActive = !state.weatherRadarActive;
      DOM.btnWeatherRadar.classList.toggle('active', state.weatherRadarActive);
      if (DOM.legendWeather) {
        DOM.legendWeather.style.display = state.weatherRadarActive ? 'flex' : 'none';
      }
    });
  }

  DOM.btnSimulateDisaster.addEventListener('click', () => {
    // Generate a temporary visual shockwave ping
    state.radarPings.push({
      x: canvas.width * 0.5,
      y: canvas.height * 0.5,
      type: 'danger',
      label: 'SIMULATED WAVE',
      radius: 5
    });
    
    // Add alert log
    state.newsFeed.unshift({
      type: 'alert',
      title: 'AI Threat Simulation',
      body: 'Triggered radar echo scan sweep. Sector hazard nodes mapped and confirmed.',
      time: 'Just now'
    });
    renderNewsFeed();
  });

  function drawGrid() {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    const size = 30;
    for (let x = 0; x < canvas.width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Concentric radar circles in center
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)*0.25, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)*0.4, 0, Math.PI*2);
    ctx.stroke();
  }

  function drawRadarSweep() {
    if (!state.radarSweepActive) return;
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.max(canvas.width, canvas.height);
    
    // Increment angle
    state.radarAngle += 0.01;
    if (state.radarAngle > Math.PI * 2) state.radarAngle = 0;
    
    // Draw sweep segment
    ctx.fillStyle = 'rgba(6, 182, 212, 0.02)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, state.radarAngle - 0.2, state.radarAngle);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(state.radarAngle)*r, cy + Math.sin(state.radarAngle)*r);
    ctx.stroke();
  }

  function drawNodes() {
    // Draw road lines first
    state.roads.forEach(road => {
      const fromNode = state.nodes[road.from];
      const toNode = state.nodes[road.to];
      if (!fromNode || !toNode) return;
      
      // Calculate responsive screen offsets
      const startX = (fromNode.x / 500) * canvas.width;
      const startY = (fromNode.y / 400) * canvas.height;
      const endX = (toNode.x / 500) * canvas.width;
      const endY = (toNode.y / 400) * canvas.height;
      
      ctx.lineWidth = road.status === 'blocked' ? 3 : 2;
      ctx.strokeStyle = road.status === 'blocked' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.4)';
      
      if (road.status === 'blocked') {
        // Dashed warning road
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw sector node markers
    Object.keys(state.nodes).forEach(key => {
      const node = state.nodes[key];
      const px = (node.x / 500) * canvas.width;
      const py = (node.y / 400) * canvas.height;
      
      // Draw pulse glow
      const timeFactor = Date.now() * 0.002;
      const pulseSize = 6 + Math.sin(timeFactor) * 3;
      
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.beginPath();
      ctx.arc(px, py, pulseSize + 4, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = 'var(--color-ai)';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI*2);
      ctx.fill();
      
      // Name label
      ctx.fillStyle = '#fff';
      ctx.font = '10px Outfit';
      ctx.fillText(`Sector ${key}`, px - 18, py - 12);
    });

    // Draw radar icons/pings
    state.radarPings.forEach(ping => {
      const px = (ping.x / 500) * canvas.width;
      const py = (ping.y / 400) * canvas.height;
      
      if (ping.type === 'danger') {
        // Red warning circle
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.strokeStyle = 'var(--color-danger)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const pulse = 12 + Math.sin(Date.now()*0.005) * 4;
        ctx.arc(px, py, pulse, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = 'var(--color-danger)';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI*2);
        ctx.fill();
      } else if (ping.type === 'shelter') {
        // Green shelter node
        ctx.fillStyle = 'var(--color-safety)';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI*2);
        ctx.fill();
        // Inner white dot
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI*2);
        ctx.fill();
      } else if (ping.type === 'user') {
        // Blinking cyan dot
        ctx.fillStyle = 'var(--color-ai)';
        ctx.beginPath();
        const isBlink = Math.floor(Date.now() / 400) % 2 === 0;
        ctx.arc(px, py, isBlink ? 6 : 2, 0, Math.PI*2);
        ctx.fill();
      }
    });
  }

  function drawWeatherRadar() {
    if (!state.weatherRadarActive) return;
    state.weatherRadarOffset += 0.3;
    if (state.weatherRadarOffset > 360) state.weatherRadarOffset = 0;
    
    // Draw moving storm front circles
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.4 + Math.sin(state.weatherRadarOffset*0.01)*50,
      canvas.height * 0.4 + Math.cos(state.weatherRadarOffset*0.01)*50,
      10,
      canvas.width * 0.4 + Math.sin(state.weatherRadarOffset*0.01)*50,
      canvas.height * 0.4 + Math.cos(state.weatherRadarOffset*0.01)*50,
      120
    );
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      canvas.width * 0.4 + Math.sin(state.weatherRadarOffset*0.01)*50,
      canvas.height * 0.4 + Math.cos(state.weatherRadarOffset*0.01)*50,
      120,
      0,
      Math.PI*2
    );
    ctx.fill();
    
    // Animate a second smaller dense cell (danger warning storm core)
    const g2 = ctx.createRadialGradient(
      canvas.width * 0.42 + Math.sin(state.weatherRadarOffset*0.01)*50,
      canvas.height * 0.38 + Math.cos(state.weatherRadarOffset*0.01)*50,
      5,
      canvas.width * 0.42 + Math.sin(state.weatherRadarOffset*0.01)*50,
      canvas.height * 0.38 + Math.cos(state.weatherRadarOffset*0.01)*50,
      40
    );
    g2.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
    g2.addColorStop(0.6, 'rgba(239, 68, 68, 0.08)');
    g2.addColorStop(1, 'rgba(239, 68, 68, 0)');
    
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(
      canvas.width * 0.42 + Math.sin(state.weatherRadarOffset*0.01)*50,
      canvas.height * 0.38 + Math.cos(state.weatherRadarOffset*0.01)*50,
      40,
      0,
      Math.PI*2
    );
    ctx.fill();
  }

  function drawActiveVehicles() {
    state.activeVehicles.forEach((veh, index) => {
      // Progress movement from Sector D node (250, 190) to target node (veh.tx, veh.ty)
      veh.progress += 0.008; // speed
      if (veh.progress >= 1.0) {
        veh.progress = 1.0;
        
        // Reach target! Show completed message if first trigger
        if (!veh.reached) {
          veh.reached = true;
          // Reach target
          state.newsFeed.unshift({
            type: 'success',
            title: `Rescue Evac Success: Sector ${veh.sector}`,
            body: `${veh.label} has safely secured target zones and checked in with local shelter.`,
            time: 'Just now'
          });
          renderNewsFeed();
          
          // Remove alert / danger pings in that sector
          const sectorNode = state.nodes[veh.sector];
          const match = state.radarPings.find(p => p.x === sectorNode.x && p.y === sectorNode.y && p.type === 'danger');
          if (match) {
            match.type = 'user'; // make it blue / safe
            match.label = 'Secured Zone';
          }
          
          // Render dispatch queue again to update button to 'deployed'
          renderDispatchQueue();
          
          // Clear vehicle after a short delay
          setTimeout(() => {
            const idx = state.activeVehicles.findIndex(v => v.id === veh.id);
            if (idx !== -1) state.activeVehicles.splice(idx, 1);
          }, 3000);
        }
      }
      
      const startX = (250 / 500) * canvas.width;
      const startY = (190 / 400) * canvas.height;
      const endX = (veh.tx / 500) * canvas.width;
      const endY = (veh.ty / 400) * canvas.height;
      
      const curX = startX + (endX - startX) * veh.progress;
      const curY = startY + (endY - startY) * veh.progress;
      
      // Draw glowing pulse for vehicle
      const pulse = 10 + Math.sin(Date.now() * 0.015) * 4;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.beginPath();
      ctx.arc(curX, curY, pulse, 0, Math.PI*2);
      ctx.fill();
      
      // Draw flashing rescue indicator
      ctx.fillStyle = 'var(--color-safety)';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px Outfit';
      ctx.fillText(veh.label, curX + 10, curY + 3);
    });
  }

  function animate() {
    if (!canvas || canvas.offsetParent === null) return;
    
    // Clear canvas
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    drawRadarSweep();
    drawWeatherRadar();
    drawNodes();
    drawActiveVehicles();
    
    if (state.radarSweepActive) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  // Initial draw
  animate();
}

// ================= SHELTER FINDER SYSTEM =================
function setupShelterFinder() {
  DOM.shelterSearch.addEventListener('input', renderSheltersList);
  DOM.shelterAmenity.addEventListener('change', renderSheltersList);
  DOM.shelterStatus.addEventListener('change', renderSheltersList);
  
  DOM.btnShelterRoute.addEventListener('click', () => {
    if (!state.selectedShelterId) return;
    const selected = state.shelters.find(s => s.id === state.selectedShelterId);
    if (!selected) return;
    
    // Switch to Route Planner Tab
    state.activeTab = 'routing';
    DOM.navLinks.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-tab') === 'routing') item.classList.add('active');
    });
    DOM.panels.forEach(p => {
      p.classList.remove('active');
      if (p.id === 'routing') p.classList.add('active');
    });
    
    // Pre-populate routing fields
    DOM.routeEnd.value = `Shelter ${selected.id.split('-')[1]}`; // e.g. Shelter 1
    
    // Trigger computation
    assessRouteSafety();
    
    setTimeout(() => {
      resizeCanvases();
    }, 50);
  });
  
  DOM.btnShelterContact.addEventListener('click', () => {
    if (!state.selectedShelterId) return;
    const selected = state.shelters.find(s => s.id === state.selectedShelterId);
    alert(`Establishing secure VOIP link to dispatcher: ${selected.contact}\n(Simulation: Connecting...)`);
  });

  renderSheltersList();
}

function renderSheltersList() {
  const query = DOM.shelterSearch.value.toLowerCase();
  const amenityFilter = DOM.shelterAmenity.value;
  const spaceFilter = DOM.shelterStatus.value;
  
  DOM.shelterList.innerHTML = '';
  
  const filtered = state.shelters.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(query) || s.sector.toLowerCase().includes(query);
    const matchAmenity = amenityFilter === 'all' || s.amenities.includes(amenityFilter);
    const matchSpace = spaceFilter === 'all' || s.occupancy < s.capacity;
    return matchQuery && matchAmenity && matchSpace;
  });
  
  if (filtered.length === 0) {
    DOM.shelterList.innerHTML = '<div style="text-align:center; padding:20px; color:var(--color-text-muted);">No shelters match filters</div>';
    return;
  }
  
  filtered.forEach(s => {
    const card = document.createElement('div');
    card.className = `shelter-card ${state.selectedShelterId === s.id ? 'active' : ''}`;
    
    const pct = Math.round((s.occupancy / s.capacity) * 100);
    let barColor = 'safe';
    if (pct > 90) barColor = 'full';
    else if (pct > 65) barColor = 'warning';
    
    card.innerHTML = `
      <div class="shelter-card-header">
        <div class="shelter-name">${s.name}</div>
        <div class="shelter-distance">${s.distance} km</div>
      </div>
      <div class="shelter-meta">
        <span>Sector ${s.sector}</span>
        <span>${pct}% Occupied (${s.occupancy}/${s.capacity})</span>
      </div>
      <div class="occupancy-bar-container">
        <div class="occupancy-bar ${barColor}" style="width: ${pct}%"></div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      selectShelter(s.id);
      renderSheltersList(); // Redraw selection outline
    });
    
    DOM.shelterList.appendChild(card);
  });
}

function selectShelter(id) {
  state.selectedShelterId = id;
  const s = state.shelters.find(x => x.id === id);
  if (!s) return;
  
  DOM.shelterDetailEmpty.style.display = 'none';
  DOM.shelterDetailContent.style.display = 'flex';
  
  DOM.detailName.textContent = s.name;
  DOM.detailLocation.textContent = `Sector ${s.sector} Location Grid - ${s.distance} km from center`;
  DOM.detailNotes.textContent = s.notes;
  
  const pct = Math.round((s.occupancy / s.capacity) * 100);
  DOM.detailOccupancyRatio.textContent = `${s.occupancy} / ${s.capacity} beds occupied (${pct}%)`;
  
  DOM.detailOccupancyBar.className = 'occupancy-bar';
  let barColor = 'safe';
  if (pct > 90) {
    barColor = 'full';
    DOM.detailStatus.textContent = 'CAPACITY FULL';
    DOM.detailStatus.style.color = 'var(--color-danger)';
    DOM.detailStatus.style.borderColor = 'var(--color-danger)';
    DOM.detailStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
  } else if (pct > 65) {
    barColor = 'warning';
    DOM.detailStatus.textContent = 'HIGH LOAD';
    DOM.detailStatus.style.color = 'var(--color-warning)';
    DOM.detailStatus.style.borderColor = 'var(--color-warning)';
    DOM.detailStatus.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
  } else {
    DOM.detailStatus.textContent = 'OPEN';
    DOM.detailStatus.style.color = 'var(--color-safety)';
    DOM.detailStatus.style.borderColor = 'var(--color-safety)';
    DOM.detailStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
  }
  DOM.detailOccupancyBar.classList.add(barColor);
  DOM.detailOccupancyBar.style.width = `${pct}%`;
  
  // Populate amenities badges
  DOM.detailAmenities.innerHTML = '';
  s.amenities.forEach(am => {
    const span = document.createElement('span');
    span.className = 'logo-badge';
    
    let icon = '';
    let label = '';
    
    if (am === 'medical') { icon = '🏥'; label = 'Medical Tent'; }
    if (am === 'power') { icon = '⚡'; label = 'Power Outlets'; }
    if (am === 'meals') { icon = '🍲'; label = 'Hot Meals'; }
    if (am === 'pet') { icon = '🐕'; label = 'Pet Allowed'; }
    
    span.textContent = `${icon} ${label}`;
    span.style.color = '#fff';
    span.style.background = 'rgba(255,255,255,0.05)';
    span.style.borderColor = 'rgba(255,255,255,0.15)';
    DOM.detailAmenities.appendChild(span);
  });
}

// ================= SAFE ROUTING PLANNER =================
function setupSafeRouting() {
  DOM.btnAssessRoute.addEventListener('click', assessRouteSafety);
}

// BFS implementation to find shortest path that avoids blocked roads if possible
function assessRouteSafety() {
  const start = DOM.routeStart.value;
  const endVal = DOM.routeEnd.value; // "Shelter X (Sector Y)"
  
  // Find which sector the selected shelter is in
  let endSector = 'D'; // default fallback
  if (endVal === 'Shelter 1') endSector = 'A';
  if (endVal === 'Shelter 2') endSector = 'D';
  if (endVal === 'Shelter 3') endSector = 'B';
  if (endVal === 'Shelter 4') endSector = 'E';
  
  // Perform pathfinding check
  const pathData = findSafePath(start, endSector);
  state.assessedRoute = pathData;
  
  // Render routing output details
  DOM.routeResults.style.display = 'block';
  DOM.routeResults.innerHTML = '';
  
  const card = document.createElement('div');
  card.className = `route-status-card ${pathData.safetyLevel}`;
  
  let safetyTitle = 'ROUTE SECURE';
  let safetyIcon = '✓';
  if (pathData.safetyLevel === 'warning') {
    safetyTitle = 'CAUTION - HAZARDS NEARBY';
    safetyIcon = '⚠';
  } else if (pathData.safetyLevel === 'danger') {
    safetyTitle = 'PATH BLOCKED / INACCESSIBLE';
    safetyIcon = '❌';
  }
  
  card.innerHTML = `
    <div class="route-status-title">
      <span style="font-size:16px;">${safetyIcon}</span>
      <span>${safetyTitle}</span>
    </div>
    <div class="route-status-desc">
      <strong>Computed Path:</strong> ${pathData.pathString} <br>
      <strong>Details:</strong> ${pathData.details} <br>
      <span style="display:inline-block; margin-top:8px; font-size:11px; color:#fff; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">
        AI Risk Score: ${pathData.riskScore}%
      </span>
    </div>
  `;
  
  DOM.routeResults.appendChild(card);
  
  // Redraw route map
  drawRouteMap();
}

function findSafePath(start, dest) {
  // Hardcoded node graph solver for local sectors (A, B, C, D, E, F)
  // Blocks: C-D, D-F
  
  if (start === dest) {
    return {
      path: [start],
      pathString: `Sector ${start} (You are already here)`,
      safetyLevel: 'safe',
      riskScore: 5,
      details: 'Destination reached. No movement required.'
    };
  }
  
  // Simple BFS checking connections, prioritizing pathways where road status is 'safe'
  // Build adjacency list
  const adj = {};
  Object.keys(state.nodes).forEach(n => adj[n] = []);
  state.roads.forEach(r => {
    adj[r.from].push({ to: r.to, status: r.status });
    adj[r.to].push({ to: r.from, status: r.status });
  });
  
  // Try to find a path using ONLY safe roads
  let queue = [[start]];
  let visited = new Set([start]);
  let safePath = null;
  
  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currNode = currentPath[currentPath.length - 1];
    
    if (currNode === dest) {
      safePath = currentPath;
      break;
    }
    
    const neighbors = adj[currNode] || [];
    for (let edge of neighbors) {
      if (edge.status === 'safe' && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([...currentPath, edge.to]);
      }
    }
  }
  
  if (safePath) {
    // Found a 100% safe path!
    return {
      path: safePath,
      pathString: safePath.map(n => `Sector ${n}`).join(' → '),
      safetyLevel: 'safe',
      riskScore: 12,
      details: 'All connections along this path are monitored and safe from active hazards.'
    };
  }
  
  // If no safe path is found, try to find ANY path even if it utilizes a blocked road (warning/danger path)
  queue = [[start]];
  visited = new Set([start]);
  let mixedPath = null;
  
  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currNode = currentPath[currentPath.length - 1];
    
    if (currNode === dest) {
      mixedPath = currentPath;
      break;
    }
    
    const neighbors = adj[currNode] || [];
    for (let edge of neighbors) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([...currentPath, edge.to]);
      }
    }
  }
  
  if (mixedPath) {
    // Contains a blockage, check which segment is blocked
    let blockedSegments = [];
    for (let i = 0; i < mixedPath.length - 1; i++) {
      const road = state.roads.find(r => 
        (r.from === mixedPath[i] && r.to === mixedPath[i+1]) || 
        (r.to === mixedPath[i] && r.from === mixedPath[i+1])
      );
      if (road && road.status === 'blocked') {
        blockedSegments.push(`${mixedPath[i]}-${mixedPath[i+1]}`);
      }
    }
    
    return {
      path: mixedPath,
      pathString: mixedPath.map(n => `Sector ${n}`).join(' → '),
      safetyLevel: 'danger',
      riskScore: 95,
      details: `WARNING: This path goes through active blockades (${blockedSegments.join(', ')}). Proceeding is highly discouraged.`
    };
  }
  
  return {
    path: [start],
    pathString: 'No path found',
    safetyLevel: 'danger',
    riskScore: 100,
    details: 'Unable to trace any path between these sectors. Total connectivity breakdown.'
  };
}

function drawRouteMap() {
  const canvas = document.getElementById('route-map-canvas');
  if (!canvas || canvas.offsetParent === null) return;
  const ctx = canvas.getContext('2d');
  
  // Clear
  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
  ctx.lineWidth = 1;
  const size = 30;
  for (let x = 0; x < canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw all roads
  state.roads.forEach(road => {
    const fromNode = state.nodes[road.from];
    const toNode = state.nodes[road.to];
    if (!fromNode || !toNode) return;
    
    const startX = (fromNode.x / 500) * canvas.width;
    const startY = (fromNode.y / 400) * canvas.height;
    const endX = (toNode.x / 500) * canvas.width;
    const endY = (toNode.y / 400) * canvas.height;
    
    ctx.lineWidth = road.status === 'blocked' ? 4 : 2;
    ctx.strokeStyle = road.status === 'blocked' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.15)';
    
    if (road.status === 'blocked') {
      ctx.setLineDash([6, 6]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  
  // Draw the computed route highlighted
  if (state.assessedRoute && state.assessedRoute.path) {
    const path = state.assessedRoute.path;
    ctx.lineWidth = 6;
    ctx.strokeStyle = state.assessedRoute.safetyLevel === 'danger' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(6, 182, 212, 0.85)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const node = state.nodes[path[i]];
      const px = (node.x / 500) * canvas.width;
      const py = (node.y / 400) * canvas.height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  
  // Draw sector nodes
  Object.keys(state.nodes).forEach(key => {
    const node = state.nodes[key];
    const px = (node.x / 500) * canvas.width;
    const py = (node.y / 400) * canvas.height;
    
    const isStart = state.assessedRoute && state.assessedRoute.path && state.assessedRoute.path[0] === key;
    const isEnd = state.assessedRoute && state.assessedRoute.path && state.assessedRoute.path[state.assessedRoute.path.length-1] === key;
    
    if (isStart) {
      ctx.fillStyle = 'var(--color-ai)';
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI*2);
      ctx.fill();
    } else if (isEnd) {
      ctx.fillStyle = 'var(--color-safety)';
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI*2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
    }
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Outfit';
    ctx.fillText(key, px - 4, py + 4);
    
    // Label tag
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '9px Outfit';
    ctx.fillText(`Sector ${key}`, px - 18, py - 14);
  });
}

// ================= AI SOS BOT & TRIAGE ENGINE =================
function setupTriageBot() {
  DOM.btnChatSend.addEventListener('click', processChatSubmission);
  DOM.chatUserInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') processChatSubmission();
  });
}

function processChatSubmission() {
  const text = DOM.chatUserInput.value.trim();
  if (!text) return;
  
  // User bubble
  addChatBubble(text, 'user');
  DOM.chatUserInput.value = '';
  
  // Simulate bot thinking
  setTimeout(() => {
    const analysis = triageTextParser(text);
    addChatBubble(analysis.reply, 'bot');
    
    // Update triage dashboard cards
    DOM.triagePriorityTag.textContent = analysis.priority.toUpperCase();
    DOM.triagePriorityTag.className = `triage-badge ${analysis.priority}`;
    
    // Update action items
    DOM.triageRecommendations.innerHTML = '';
    analysis.actions.forEach(act => {
      const li = document.createElement('li');
      li.textContent = act;
      DOM.triageRecommendations.appendChild(li);
    });
    
    // Update dispatch status
    DOM.triageDispatchStatus.textContent = analysis.dispatch;
    DOM.triageDispatchStatus.style.color = 
      analysis.priority === 'critical' ? 'var(--color-danger)' : 
      analysis.priority === 'high' ? 'var(--color-warning)' : 
      analysis.priority === 'medium' ? 'var(--color-ai)' : 'var(--color-safety)';
      
    // Auto-scroll chat
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  }, 1000);
}

function addChatBubble(msg, sender) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = msg.replace(/\n/g, '<br>');
  DOM.chatMessages.appendChild(bubble);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function triageTextParser(text) {
  const input = text.toLowerCase();
  
  let score = 0;
  let priority = 'low';
  let reply = '';
  let actions = [];
  let dispatch = 'Awaiting triage details...';
  
  // Search sector context
  let sectorMatch = input.match(/sector\s+([a-f])/i);
  let sector = sectorMatch ? sectorMatch[1].toUpperCase() : null;
  
  // Keyword scoring
  const keywords = {
    critical: ['trap', 'drown', 'water', 'flood', 'collapse', 'bleed', 'unconscious', 'breathing', 'stroke', 'dying'],
    high: ['broken', 'fracture', 'burn', 'wound', 'pain', 'child', 'baby', 'elder', 'medication', 'asthma'],
    medium: ['lost', 'cold', 'food', 'water', 'shelter', 'battery', 'charge', 'power', 'stranded']
  };
  
  let matches = [];
  
  keywords.critical.forEach(w => {
    if (input.includes(w)) { score += 5; matches.push(w); }
  });
  keywords.high.forEach(w => {
    if (input.includes(w)) { score += 3; matches.push(w); }
  });
  keywords.medium.forEach(w => {
    if (input.includes(w)) { score += 1; matches.push(w); }
  });
  
  // Determine Priority
  if (score >= 8 || input.includes('bleed') || input.includes('trap') || input.includes('drown')) {
    priority = 'critical';
  } else if (score >= 4) {
    priority = 'high';
  } else if (score >= 1) {
    priority = 'medium';
  } else {
    priority = 'low';
  }
  
  // Construct Response Actions & Messages
  if (priority === 'critical') {
    reply = `🚨 **AI ASSESSMENT: CRITICAL THREAT DETECTED.**\nYour emergency report has triggered an instant NDRF/108 dispatcher alert. NDRF search and rescue units along with paramedic responders are being mobilized.`;
    if (sector) {
      reply += ` Dispatching emergency assets toward **Sector ${sector}**.`;
      dispatch = `NDRF Rescue Team ACTIVE for Sector ${sector} (ETA 9 mins)`;
    } else {
      reply += `\n*Please state your location sector (A, B, C, D, E, F) immediately so we can direct the dispatch team.*`;
      dispatch = 'Alert Broadcasted - Awaiting GPS/Sector confirmation';
    }
    
    actions = [
      'Stop any bleeding using absolute firm pressure.',
      'If in a flooded area, move to upper floors/terrace immediately. Do not enter flowing water.',
      'Keep mobile link active. Limit battery usage to emergency communication.'
    ];
  } else if (priority === 'high') {
    reply = `⚠️ **AI ASSESSMENT: HIGH PRIORITY.**\nSDMA medical coordinators have logged your case. A local triage unit (108 Ambulance) will contact you.`;
    if (sector) {
      reply += ` We recommend seeking shelter immediately. Vyasarpadi Community Hall (Sector A) or Nungambakkam Stadium Complex (Sector D) are staffed with doctor panels.`;
      dispatch = `108 Ambulance Queue - Sector ${sector} (ETA 22 mins)`;
    } else {
      reply += ` Please identify your nearest landmarks or Sector so we can outline the closest relief medical desk.`;
      dispatch = 'Triage Queue - Awaiting Sector confirmation';
    }
    
    actions = [
      'Immobilize any broken limbs or painful joints.',
      'Keep warm. Rest the patient in a safe, dry zone.',
      'Check if local transportation can reach nearby open shelters.'
    ];
  } else if (priority === 'medium') {
    reply = `ℹ️ **AI ASSESSMENT: STANDARD RESOURCE ASSISTANCE.**\nWe have registered your request for basic resources (food packet drops & drinking water).`;
    if (sector) {
      const recommendation = sector === 'E' ? 'Guindy Training Center (Shelter Delta)' : 'nearest relief shelter';
      reply += ` You can head directly to **${recommendation}** where water tanks, hot food, and emergency charging points are currently active.`;
    }
    dispatch = 'Relief resources logged in dispatch queue';
    actions = [
      'Navigate to nearest open shelter using the Safe Route screen.',
      'Conserve food supply. Drink filtered/clean water or use chlorine tablets.',
      'Charge cellphones if auxiliary power cells are available.'
    ];
  } else {
    reply = `Hello. Thank you for reporting. Your query does not indicate an immediate trauma hazard. For general information, please use our shelter locator tool or check the emergency supply lists.`;
    dispatch = 'Idle - General Info Request';
    actions = [
      'Review your emergency survival kit packing lists.',
      'Download offline road blockage map data.',
      'Follow local radio broadcasts for storm progressions.'
    ];
  }
  
  return { priority, reply, actions, dispatch };
}

// ================= SUPPLY CHECKLIST ENGINE =================
function setupSupplyPlanner() {
  DOM.btnGenerateSupplies.addEventListener('click', generateSupplyChecklist);
  DOM.btnResetChecklist.addEventListener('click', clearChecklistSelections);
  DOM.btnPrintSupplies.addEventListener('click', () => {
    window.print();
  });
}

function generateSupplyChecklist() {
  const scenario = DOM.supplyScenario.value;
  const size = parseInt(DOM.supplyPeople.value, 10) || 1;
  const duration = parseInt(DOM.supplyDuration.value, 10) || 3;
  
  // Base lists
  const baseItems = [
    { title: 'Prescription Medication', desc: 'Crucial prescription drugs. Take at least a 7-day supply.', category: 'critical' },
    { title: 'Emergency First Aid Kit', desc: 'Bandages, antiseptic, antiseptic wipes, surgical tape.', category: 'critical' },
    { title: 'Oral Rehydration Salts (ORS)', desc: `ORS Packets: ${size * 3} sachets (critical for dehydration prevention).`, category: 'critical' },
    { title: 'Clean Drinking Water', desc: `Stored water: ${size * duration * 3} Liters standard (3L per person per day).`, category: 'critical' },
    { title: 'Dry Snacks & Food', desc: `Puffed rice (muri), roasted chana, biscuits: ${size * duration * 3} meals.`, category: 'critical' },
    { title: 'Flashlight & Batteries', desc: 'High-intensity LED torch + spare lithium batteries.', category: 'essential' },
    { title: 'Warm Blankets & Clothes', desc: `${size} lightweight insulated sheets/blankets.`, category: 'essential' },
    { title: 'Hygiene & Sanitizer', desc: 'Hand sanitizer, chlorine tablets, garbage bags.', category: 'essential' },
    { title: 'Identity Documents (Aadhaar/Ration Card)', desc: 'Aadhaar, Ration card, insurance in a waterproof zip-lock file.', category: 'essential' },
    { title: 'Portable Power Bank', desc: 'Fully charged backup battery for mobile devices.', category: 'comfort' },
    { title: 'Multi-tool / Utility Knife', desc: 'Small scissors, knife, can opener, wire cutters.', category: 'comfort' }
  ];
  
  // Scenario specifics
  if (scenario === 'flood') {
    baseItems.unshift(
      { title: 'Waterproof Dry Bags', desc: 'To seal smartphones, Aadhaar files, and dry food.', category: 'essential' },
      { title: 'Water Sterilizing Chlorine Tablets', desc: 'For disinfecting flood-contaminated tap water.', category: 'critical' },
      { title: 'High-traction Wading Shoes', desc: 'To protect feet from submerged garbage, nails, or wires.', category: 'essential' }
    );
  } else if (scenario === 'earthquake') {
    baseItems.unshift(
      { title: 'Heavy Duty Construction Gloves', desc: 'To handle debris, concrete fragments, or metal sheets.', category: 'essential' },
      { title: 'Sturdy Steel-Toe Boots / Shoes', desc: 'Crucial for stepping safely around structural rubble.', category: 'critical' },
      { title: 'High-pitched Emergency Whistle', desc: 'To alert NDRF rescue teams if trapped under masonry.', category: 'critical' }
    );
  } else if (scenario === 'cyclone') {
    baseItems.unshift(
      { title: 'Emergency Weather Radio', desc: 'Battery-powered AM/FM radio to monitor storm broadcasts.', category: 'essential' },
      { title: 'Heavy Tarpaulins & Nylon Rope', desc: 'Temporary barrier for broken windows or roof shelter.', category: 'essential' },
      { title: 'Protective Eyewear / Goggles', desc: 'To guard eyes against high wind-blown grit.', category: 'comfort' }
    );
  } else if (scenario === 'accident') {
    baseItems.unshift(
      { title: 'Tourniquet & Pressure Bandages', desc: 'For heavy bleeding trauma from vehicular accidents.', category: 'critical' },
      { title: 'High-Visibility Orange Safety Vest', desc: 'Reflective safety wear to alert highway emergency vehicles.', category: 'essential' }
    );
  }
  
  state.currentChecklist = baseItems.map((item, idx) => ({
    ...item,
    id: `item-${idx}`,
    checked: false
  }));
  
  renderChecklist();
}

function renderChecklist() {
  DOM.checklistItems.innerHTML = '';
  
  if (state.currentChecklist.length === 0) {
    DOM.checklistItems.innerHTML = '<p style="color:var(--color-text-muted);">No checklist items generated.</p>';
    updateChecklistProgress();
    return;
  }
  
  state.currentChecklist.forEach(item => {
    const el = document.createElement('div');
    el.className = `checklist-item ${item.checked ? 'checked' : ''}`;
    
    el.innerHTML = `
      <input type="checkbox" class="checklist-checkbox" id="chk-${item.id}" ${item.checked ? 'checked' : ''}>
      <div class="checklist-item-content">
        <div class="checklist-item-title">${item.title}</div>
        <div class="checklist-item-desc">${item.desc}</div>
      </div>
      <span class="checklist-item-badge ${item.category}">${item.category}</span>
    `;
    
    // Add checkbox toggle listener
    const chk = el.querySelector('.checklist-checkbox');
    chk.addEventListener('change', () => {
      item.checked = chk.checked;
      el.className = `checklist-item ${item.checked ? 'checked' : ''}`;
      updateChecklistProgress();
    });
    
    // Click card selects checkbox too
    el.addEventListener('click', (e) => {
      if (e.target !== chk) {
        chk.checked = !chk.checked;
        item.checked = chk.checked;
        el.className = `checklist-item ${item.checked ? 'checked' : ''}`;
        updateChecklistProgress();
      }
    });
    
    DOM.checklistItems.appendChild(el);
  });
  
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const total = state.currentChecklist.length;
  const checked = state.currentChecklist.filter(x => x.checked).length;
  
  DOM.checklistProgressRatio.textContent = `${checked} / ${total} completed`;
  
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
  DOM.checklistProgressFill.style.width = `${pct}%`;
}

function clearChecklistSelections() {
  state.currentChecklist.forEach(item => item.checked = false);
  renderChecklist();
}

// ================= ADVANCED FEATURES LOGIC =================
function setupAdvancedFeatures() {
  // Render initial queue
  renderDispatchQueue();
  
  // EBS Broadcast Transmitter
  if (DOM.btnSendBroadcast) {
    DOM.btnSendBroadcast.addEventListener('click', () => {
      const scope = DOM.broadcastScope.value;
      const msg = DOM.broadcastMsgInput.value.trim();
      if (!msg) return;
      
      // Update text in alert overlay modal
      if (DOM.ebsMsgText) {
        DOM.ebsMsgText.innerHTML = `<strong>Area Scope: ${scope === 'all' ? 'GLOBAL ALERT' : 'SECTOR ' + scope}</strong><br><br>${msg}`;
      }
      
      // Trigger full screen overlay display
      if (DOM.ebsOverlay) {
        DOM.ebsOverlay.style.display = 'flex';
      }
      
      // Add alert log
      state.newsFeed.unshift({
        type: 'alert',
        title: `EMERGENCY BROADCAST SENT`,
        body: `Scope: ${scope === 'all' ? 'All Sectors' : 'Sector ' + scope}. Message: "${msg}"`,
        time: 'Just now'
      });
      renderNewsFeed();
    });
  }
  
  // Close Broadcast Modal
  if (DOM.btnCloseBroadcast) {
    DOM.btnCloseBroadcast.addEventListener('click', () => {
      if (DOM.ebsOverlay) {
        DOM.ebsOverlay.style.display = 'none';
      }
    });
  }
}

function renderDispatchQueue() {
  if (!DOM.dispatchQueueContainer) return;
  DOM.dispatchQueueContainer.innerHTML = '';
  
  state.dispatchQueue.forEach(item => {
    const el = document.createElement('div');
    el.className = 'dispatch-item';
    
    // Check if vehicle is already deployed for this task
    const isDeployed = item.status === 'deployed';
    const btnText = isDeployed ? '✓ Deployed' : 'Deploy Rescue';
    const btnClass = isDeployed ? 'dispatch-btn deployed' : 'dispatch-btn';
    const disabledAttr = isDeployed ? 'disabled' : '';
    
    el.innerHTML = `
      <div class="dispatch-meta">
        <div style="font-weight:600;">${item.victim} (${item.incident})</div>
        <div style="font-size:11px; color:var(--color-text-muted);">
          Location: Sector ${item.sector} | Priority: 
          <span style="font-weight:700; color:${item.priority === 'critical' ? 'var(--color-danger)' : item.priority === 'high' ? 'var(--color-warning)' : 'var(--color-ai)'}">
            ${item.priority.toUpperCase()}
          </span>
        </div>
      </div>
      <button class="${btnClass}" ${disabledAttr} data-id="${item.id}">${btnText}</button>
    `;
    
    // Add deploy handler
    const btn = el.querySelector('button');
    if (!isDeployed) {
      btn.addEventListener('click', () => {
        deployRescueUnit(item.id);
      });
    }
    
    DOM.dispatchQueueContainer.appendChild(el);
  });
}

function deployRescueUnit(incidentId) {
  const item = state.dispatchQueue.find(x => x.id === incidentId);
  if (!item) return;
  
  // Set to deployed
  item.status = 'deployed';
  
  // Create animated vehicle object
  const veh = {
    id: `v-${Date.now()}`,
    sector: item.sector,
    tx: item.x,
    ty: item.y,
    progress: 0.0,
    reached: false,
    label: item.priority === 'critical' ? 'Rescue Squad' : item.priority === 'high' ? 'Medical Car' : 'Supply Truck'
  };
  
  state.activeVehicles.push(veh);
  
  // Log message
  state.newsFeed.unshift({
    type: 'info',
    title: `Unit Dispatched to Sector ${item.sector}`,
    body: `${veh.label} mobilized from Central Hub (Sector D) responding to ${item.victim}.`,
    time: 'Just now'
  });
  renderNewsFeed();
  
  // Redraw queue to disable button immediately
  renderDispatchQueue();
}
