// ==========================================
// 1. DATA ULANG TAHUN ANGGOTA BIMASENA
// ==========================================
const bimasenaMembers = [
  { name: "Fauziah", birthMonth: 1, birthDay: 1 },
  { name: "Irfan Syahfutra", birthMonth: 3, birthDay: 1 },
  { name: "Muhamad Syaikhon", birthMonth: 10, birthDay: 7 },
  { name: "Tabby Jenovan", birthMonth: 4, birthDay: 4 },
  { name: "Andini Raissa", birthMonth: 6, birthDay: 25 },
  { name: "Tiara Citra Dewi", birthMonth: 7, birthDay: 8 },
  { name: "Alysa Chairani", birthMonth: 8, birthDay: 18 },
  { name: "Fathiya Adiba", birthMonth: 9, birthDay: 30 },
  { name: "Zahrah Widya Alifah", birthMonth: 10, birthDay: 14 },
  { name: "Isna Putri", birthMonth: 11, birthDay: 5 }
];

// Variable acuan agar interval tidak berjalan ganda
let birthdayInterval = null;

// ==========================================
// 2. HITUNG MUNDUR ULANG TAHUN
// ==========================================
function getNextBirthday() {
  const now = new Date();
  
  // Waktu acuan dikunci pada awal hari (jam 00:00:00 hari ini)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  let upcoming = bimasenaMembers.map(member => {
    // Tentukan tanggal ultah tahun ini tepat pukul 00:00:00
    let nextBday = new Date(now.getFullYear(), member.birthMonth - 1, member.birthDay, 0, 0, 0);

    // Cek apakah hari ini tepat ultah
    const isToday = (now.getDate() === member.birthDay && now.getMonth() === member.birthMonth - 1);

    // Jika ultah tahun ini sudah lewat sebelum hari ini, set ke tahun depan
    if (nextBday < todayStart) {
      nextBday = new Date(now.getFullYear() + 1, member.birthMonth - 1, member.birthDay, 0, 0, 0);
    }

    return {
      name: member.name,
      date: nextBday,
      diff: nextBday.getTime() - now.getTime(),
      isToday: isToday
    };
  });

  // Urutkan dari selisih waktu terkecil (paling dekat dengan sekarang)
  upcoming.sort((a, b) => a.diff - b.diff);

  return upcoming[0];
}

function updateBirthdayUI() {
  const target = getNextBirthday();
  const targetElem = document.getElementById('target-name');

  // Paksa nama anggota terdekat masuk ke dalam kurung
  if (targetElem && target) {
    targetElem.textContent = `(${target.name})`;
  }

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const now = new Date();
  if (target.isToday) {
    cdDays.innerText = "00";
    cdHours.innerText = "00";
    cdMinutes.innerText = "00";
    cdSeconds.innerText = "00";
    return;
  }

  const diff = target.date.getTime() - now.getTime();
  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  cdDays.innerText = days < 10 ? '0' + days : days;
  cdHours.innerText = hours < 10 ? '0' + hours : hours;
  cdMinutes.innerText = minutes < 10 ? '0' + minutes : minutes;
  cdSeconds.innerText = seconds < 10 ? '0' + seconds : seconds;
}

// ==========================================
// 3. INISIALISASI HALAMAN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Update tampilan saat pertama dimuat
  updateBirthdayUI();

  // Cegah multiple interval dengan mereset interval lama jika ada
  if (birthdayInterval) {
    clearInterval(birthdayInterval);
  }
  
  // Jalankan interval per 1 detik
  birthdayInterval = setInterval(updateBirthdayUI, 1000);
});