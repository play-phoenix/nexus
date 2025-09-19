// --- LOGIN PAGE ---
if (document.querySelector('.login-form')) {
    const PASSWORD = 'nexus2025';
    document.querySelector('.login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const pass = document.getElementById('login-password').value;
      const tip = document.getElementById('loginTip');
      if (pass === PASSWORD) {
        localStorage.setItem('nexusLoggedIn', 'yes');
        window.location.href = "pages/home.html";
      } else {
        tip.textContent = "Incorrect password!";
        tip.classList.add('error');
        setTimeout(() => { tip.classList.remove('error'); tip.textContent = "Enter the password to access NEXUS."; }, 1200);
      }
    });
    if (localStorage.getItem('nexusLoggedIn') === 'yes') {
      window.location.href = "pages/home.html";
    }
  }

  // ---GAMES PAGE---
  // When a game is clicked, open it in a new about:blank tab and write the game's iframe into it
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const url = card.getAttribute('data-url');
    // Open about:blank and inject iframe
    const newTab = window.open('about:blank', '_blank');
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Play Game - NEXUS</title>
          <meta name="viewport" content="width=device-width,initial-scale=1.0">
          <style>
            body { background: #000; margin:0; display:flex; align-items:center; justify-content:center; height:100vh;}
            iframe { border:0; width:98vw; height:98vh; box-shadow: 0 0 64px #08e2ff; border-radius:12px;}
          </style>
        </head>
        <body>
          <iframe src="${url}" allowfullscreen></iframe>
        </body>
        </html>
      `);
      newTab.document.close();
    }
  });
});
  
  // --- MUSIC BACKGROUND (WORKS WITH URL) ---
  (function() {
    const MUSIC_URL = localStorage.getItem('nexusMusicURL') ||
      (document.body.dataset.musicUrl || 'assets/tokyo-drift.mp3');
    let bgmusic = document.getElementById('bgmusic');
    if (!bgmusic) {
      bgmusic = document.createElement('audio');
      bgmusic.id = 'bgmusic';
      bgmusic.loop = true;
      bgmusic.autoplay = true;
      document.body.appendChild(bgmusic);
    }
    bgmusic.src = MUSIC_URL;
    bgmusic.volume = 0.5;
    bgmusic.autoplay = true;
    let btn = document.getElementById('music-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = "music-toggle";
      btn.className = "music-toggle-btn";
      btn.title = "Mute/Unmute music";
      btn.textContent = "🔊";
      document.body.appendChild(btn);
    }
    btn.onclick = () => {
      bgmusic.muted = !bgmusic.muted;
      btn.textContent = bgmusic.muted ? '🔇' : '🔊';
    };
    bgmusic.play().catch(() => {
      btn.textContent = '▶️';
      btn.onclick = () => { bgmusic.play(); btn.textContent = '🔊'; };
    });
    // Music mute checkbox in settings
    const muteCheckbox = document.getElementById('music-mute');
    if (muteCheckbox) {
      muteCheckbox.checked = bgmusic.muted;
      muteCheckbox.onchange = function() {
        bgmusic.muted = this.checked;
        btn.textContent = this.checked ? "🔇" : "🔊";
      };
    }
  })();
  
  // --- SETTINGS PAGE: MUSIC URL ---
  if (document.getElementById('music-url-save')) {
    document.getElementById('music-url-save').onclick = function() {
      const url = document.getElementById('music-url').value.trim();
      if(url) {
        localStorage.setItem('nexusMusicURL', url);
        alert("Music URL set! Reload page to hear new music.");
      }
    };
  }
  
  // --- SETTINGS PAGE: LOGOUT BUTTON ---
  if (document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').onclick = function() {
      localStorage.removeItem('nexusLoggedIn');
      window.location.href = "../index.html";
    }
  }
  
  // --- MUSIC PAGE: YOUTUBE SEARCH ---
  if (document.getElementById('musicSearch')) {
    document.getElementById('musicSearch').onsubmit = function(e) {
      e.preventDefault();
      const q = document.getElementById('musicQuery').value;
      window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(q), "_blank");
    };
  }
  
  // --- SYSTEM PAGE: INFO + IP LOCATION ---
  if (document.getElementById('browserValue')) {
    function getBrowserInfo() {
      const ua = navigator.userAgent;
      if (ua.indexOf("Firefox") > -1) return "Firefox " + ua.match(/Firefox\/([0-9\.]+)/)[1];
      if (ua.indexOf("Edg") > -1) return "Edge " + ua.match(/Edg\/([0-9\.]+)/)[1];
      if (ua.indexOf("Chrome") > -1) return "Chrome " + ua.match(/Chrome\/([0-9\.]+)/)[1];
      if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) return "Safari " + ua.match(/Version\/([0-9\.]+)/)[1];
      return ua.split(" ")[0];
    }
    function getDeviceType() {
      if (/Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|webOS/i.test(navigator.userAgent)) return "Mobile";
      if (/Tablet|iPad/i.test(navigator.userAgent)) return "Tablet";
      return "Desktop";
    }
    function getOSInfo() {
      const p = navigator.platform || "Unknown";
      if (/Win/i.test(p)) return "Windows";
      if (/Mac/i.test(p)) return "MacOS";
      if (/Linux/i.test(p)) return "Linux";
      if (/Android/i.test(navigator.userAgent)) return "Android";
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return "iOS";
      return p;
    }
    function getTimeStr() {
      return new Date().toLocaleString();
    }
    document.getElementById('browserValue').textContent = getBrowserInfo();
    document.getElementById('deviceValue').textContent = getDeviceType();
    document.getElementById('osValue').textContent = getOSInfo();
    document.getElementById('screenValue').textContent = `${window.screen.width} x ${window.screen.height}`;
    document.getElementById('timeValue').textContent = getTimeStr();
    setInterval(() => {
      document.getElementById('timeValue').textContent = getTimeStr();
    }, 5000);
    // IP Address and IP-based location (no permission needed)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        document.getElementById('ipValue').textContent = data.ip;
        const lat = data.latitude, lon = data.longitude;
        document.getElementById('locationValue').textContent = `Lat: ${lat}, Lon: ${lon}`;
        document.getElementById('addressValue').textContent = `${data.city}, ${data.region}, ${data.country_name}`;
        document.getElementById('mapsLink').innerHTML =
          `<a href="https://maps.google.com/?q=${lat},${lon}" target="_blank">View on Google Maps</a>`;
      })
      .catch(() => {
        document.getElementById('ipValue').textContent = "N/A";
        document.getElementById('locationValue').textContent = "Location unavailable.";
        document.getElementById('addressValue').textContent = "";
        document.getElementById('mapsLink').textContent = "";
      });
  }