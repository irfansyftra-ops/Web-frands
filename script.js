/* ===============================
   1. AOS ANIMATION INITIALIZATION
=============================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Re-render ikon Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/* ===============================
   2. DARK / LIGHT MODE TOGGLE
=============================== */
function toggleDarkMode() {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  
  html.classList.toggle('dark');
  
  if (html.classList.contains('dark')) {
    themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    themeIcon.setAttribute('data-lucide', 'moon');
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ===============================
   3. FLOATING MUSIC PLAYER
=============================== */
function toggleAudio() {
  const audio = document.getElementById('bg-music');
  const playIcon = document.getElementById('play-icon');
  
  if (audio.paused) {
    audio.play();
    playIcon.setAttribute('data-lucide', 'pause');
  } else {
    audio.pause();
    playIcon.setAttribute('data-lucide', 'play');
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ===============================
   4. BIRTHDAY MODAL & COUNTDOWN
=============================== */
function closeBirthdayModal() {
  const modal = document.getElementById('birthday-modal');
  if (modal) modal.classList.add('hidden');
}

/* ===============================
   5. LOGIKA COUNTDOWN ULANG TAHUN
=============================== */
// 1. Data Ulang Tahun Anggota (Format: MM/DD)
const membersBirthday = [
  { name: "Irfan Syahfutra", date: "03/11" },
  { name: "Muhamad Syaikhon", date: "10/07" },
  { name: "Tabby Jenovan", date: "04/04" },
  { name: "Andini Raissa", date: "-/-" },
  { name: "Tiara Citra Dewi", date: "-/-" },
  { name: "Alysa Chairani", date: "-/-" },
  { name: "Fathiya Adiba", date: "-/-" },
  { name: "Zahrah Widya", date: "-/-" },
  { name: "Isna Putri", date: "-/0-" }
];

function startBirthdayCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Cari tanggal ultah terdekat berikutnya
  let nextBirthday = null;
  let targetMember = "";
  let minDiff = Infinity;

  membersBirthday.forEach(member => {
    let bdate = new Date(`${member.date}/${currentYear}`);
    
    // Jika ultah tahun ini sudah lewat, set ke tahun depan
    if (bdate < now) {
      bdate = new Date(`${member.date}/${currentYear + 1}`);
    }

    const diff = bdate - now;
    if (diff < minDiff) {
      minDiff = diff;
      nextBirthday = bdate;
      targetMember = member.name;
    }
  });

  // Tampilkan nama anggota yang ultah terdekat
  const nameElement = document.getElementById('target-name');
  if (nameElement) nameElement.innerText = `(${targetMember})`;

  // Update angka hitung mundur setiap 1 detik
  const timer = setInterval(() => {
    const today = new Date().getTime();
    const distance = nextBirthday.getTime() - today;

    if (distance < 0) {
      clearInterval(timer);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Tampilkan ke elemen HTML
    if (document.getElementById('cd-days')) document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    if (document.getElementById('cd-hours')) document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    if (document.getElementById('cd-minutes')) document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
    if (document.getElementById('cd-seconds')) document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
  }, 1000);
}

// Jalankan fungsi saat halaman selesai di-load
document.addEventListener('DOMContentLoaded', () => {
  startBirthdayCountdown();
});