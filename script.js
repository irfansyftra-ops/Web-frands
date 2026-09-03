/* ===============================
   1. INITIALIZATION (AOS, LUCIDE, TEMA)
=============================== */
document.addEventListener('DOMContentLoaded', () => {
  // Init AOS Animation
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Init Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Load Simpanan Theme & Jalankan Countdown
  initTheme();
  startBirthdayCountdown();
});

/* ===============================
   2. DARK / LIGHT MODE TOGGLE
=============================== */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('theme-icon');

  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    document.documentElement.classList.add('dark');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleDarkMode() {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');

  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  }
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ===============================
   3. FLOATING MUSIC PLAYER
=============================== */
function toggleAudio() {
  const audio = document.getElementById('bg-music');
  const playIcon = document.getElementById('play-icon');

  if (!audio) return;
  
  if (audio.paused) {
    audio.play();
    if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
  } else {
    audio.pause();
    if (playIcon) playIcon.setAttribute('data-lucide', 'play');
  }
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ===============================
   4. BIRTHDAY MODAL
=============================== */
function closeBirthdayModal() {
  const modal = document.getElementById('birthday-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function showBirthdayModal(memberName) {
  const modal = document.getElementById('birthday-modal');
  const title = document.getElementById('birthday-title');
  const text = document.getElementById('birthday-text');

  if (modal && title && text) {
    title.innerText = `Selamat Ulang Tahun, ${memberName}! 🎉`;
    text.innerText = `Hari ini adalah hari spesial bagi ${memberName}. Jangan lupa beri ucapan hangat!`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

/* ===============================
   5. LOGIKA COUNTDOWN ULANG TAHUN
=============================== */
// Data Ulang Tahun Anggota (Format: MM/DD)
// Jika tanggal belum ada, cukup isi string kosong ""
const membersBirthday = [
  { name: "Irfan Syahfutra", date: "03/11" },
  { name: "Muhamad Syaikhon", date: "10/07" },
  { name: "Tabby Jenovan", date: "04/04" },
  { name: "Andini Raissa", date: "" },
  { name: "Tiara Citra Dewi", date: "" },
  { name: "Alysa Chairani", date: "" },
  { name: "Fathiya Adiba", date: "" },
  { name: "Zahrah Widya", date: "" },
  { name: "Isna Putri", date: "" }
];

function startBirthdayCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();

  let nextBirthday = null;
  let targetMember = "";
  let minDiff = Infinity;

  // Filter anggota yang punya format tanggal valid
  const validMembers = membersBirthday.filter(member => member.date && member.date.includes('/'));

  if (validMembers.length === 0) return;

  validMembers.forEach(member => {
    let bdate = new Date(`${member.date}/${currentYear}`);
    
    // Cek jika hari ini ulang tahun
    if (bdate.getMonth() === now.getMonth() && bdate.getDate() === now.getDate()) {
      showBirthdayModal(member.name);
    }

    // Jika ultah tahun ini sudah lewat, set ke tahun depan
    if (bdate < now && (bdate.getDate() !== now.getDate() || bdate.getMonth() !== now.getMonth())) {
      bdate = new Date(`${member.date}/${currentYear + 1}`);
    }

    const diff = bdate - now;
    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      nextBirthday = bdate;
      targetMember = member.name;
    }
  });

  if (!nextBirthday) return;

  const nameElement = document.getElementById('target-name');
  if (nameElement) nameElement.innerText = `(${targetMember})`;

  const timer = setInterval(() => {
    const today = new Date().getTime();
    const distance = nextBirthday.getTime() - today;

    if (distance <= 0) {
      clearInterval(timer);
      startBirthdayCountdown();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (document.getElementById('cd-days')) document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    if (document.getElementById('cd-hours')) document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    if (document.getElementById('cd-minutes')) document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
    if (document.getElementById('cd-seconds')) document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
  }, 1000);
}

/* ===============================
   6. WEB SHARE API & QR CODE
=============================== */
async function shareWebsite() {
  const shareData = {
    title: 'BIMASENA | Official Squad Profile',
    text: 'Cek profil resmi squad BIMASENA di sini!',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Batal berbagi:', err);
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link website berhasil disalin ke clipboard! 📋');
  }
}

function openQrModal() {
  const modal = document.getElementById('qr-modal');
  const qrImage = document.getElementById('qr-image');
  const currentUrl = encodeURIComponent(window.location.href);

  if (modal && qrImage) {
    qrImage.src = `https://quickchart.io/qr?text=${currentUrl}&size=200&margin=1`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeQrModal() {
  const modal = document.getElementById('qr-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}