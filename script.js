// Konfigurasi Firebase BIMASENA
const firebaseConfig = {
  apiKey: "AIzaSyDwgiklZ2uOwSHJhGjoS7V3luAiq2aNyac",
  authDomain: "bimasena-web.firebaseapp.com",
  databaseURL: "https://bimasena-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bimasena-web",
  storageBucket: "bimasena-web.firebasestorage.app",
  messagingSenderId: "182907195902",
  appId: "1:182907195902:web:53e6587549d17fe79ab0af",
  measurementId: "G-QER4E0VVJR"
};

// Inisialisasi Firebase & Realtime Database
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ==========================================
// 1. DATA ULANG TAHUN ANGGOTA BIMASENA
// ==========================================
const bimasenaMembers = [
  { name: "Fauziah", birthMonth: 1, birthDay: 1 },
  { name: "Irfan Syahfutra", birthMonth: 3, birthDay: 1 },
  { name: "Muhamad Syaikhon", birthMonth: 10, birthDay: 7 },
  { name: "Tabby Jenovan", birthMonth: 4, birthDay: 4 },
  { name: "Andini Raissa", birthMonth: 12, birthDay: 21 },
  { name: "Tiara Citra Dewi", birthMonth: 3, birthDay: 22 },
  { name: "Alysa Chairani", birthMonth: 9, birthDay: 11 },
  { name: "Fathiya Adiba", birthMonth: 1, birthDay: 30 },
  { name: "Zahrah Widya Alifah", birthMonth: 8, birthDay: 30 },
  { name: "Isna Putri", birthMonth: 2, birthDay: 17 }
];

// Variable acuan agar interval tidak berjalan ganda
let birthdayInterval = null;

// ==========================================
// 2. HITUNG MUNDUR ULANG TAHUN
// ==========================================
function getNextBirthday() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  let upcoming = bimasenaMembers.map(member => {
    let nextBday = new Date(now.getFullYear(), member.birthMonth - 1, member.birthDay, 0, 0, 0);
    const isToday = (now.getDate() === member.birthDay && now.getMonth() === member.birthMonth - 1);

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

  upcoming.sort((a, b) => a.diff - b.diff);
  return upcoming[0];
}

function updateBirthdayUI() {
  const target = getNextBirthday();
  const targetElem = document.getElementById('target-name');

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
// 3. ONESIGNAL PUSH NOTIFICATIONS
// ==========================================

// A. Kirim Notif Mading Baru
function sendOneSignalNotification(senderName, messageText) {
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      app_id: "e4ed6495-9946-4255-b365-7396026be64d",
      included_segments: ["Subscribed Users"],
      headings: { "en": "📌 Mading Baru BIMASENA!" },
      contents: { "en": `${senderName}: "${messageText}"` }
    })
  })
  .then(res => res.json())
  .then(data => console.log("Notif Mading Terkirim:", data))
  .catch(err => console.error("Gagal Kirim Notif Mading:", err));
}

// B. Kirim Notif Ulang Tahun
function sendBirthdayNotification(memberName) {
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      app_id: "e4ed6495-9946-4255-b365-7396026be64d",
      included_segments: ["Subscribed Users"],
      headings: { "en": "🎉 Selamat Ulang Tahun! 🎂" },
      contents: { "en": `Hari ini ${memberName} anggota BIMASENA ulang tahun! Berikan ucapan hangatmu!` }
    })
  })
  .then(res => res.json())
  .then(data => console.log("Notif Ultah Terkirim:", data))
  .catch(err => console.error("Gagal Kirim Notif Ultah:", err));
}

// C. Cek Otomatis Ultah Hari Ini
function checkTodayBirthdays() {
  const target = getNextBirthday();
  if (target && target.isToday) {
    const notifSentKey = `bday_notif_${target.name}_${new Date().getFullYear()}`;
    if (!localStorage.getItem(notifSentKey)) {
      sendBirthdayNotification(target.name);
      localStorage.setItem(notifSentKey, "true");
    }
  }
}

// ==========================================
// 4. MADING DIGITAL (FIREBASE REALTIME DATABASE)
// ==========================================

// Fungsi Mengirim Pesan Mading ke Cloud Database
function kirimMading() {
  const senderInput = document.getElementById('mading-sender');
  const messageInput = document.getElementById('mading-message');

  if (!senderInput || !messageInput) return;

  const sender = senderInput.value.trim();
  const message = messageInput.value.trim();

  if (!sender || !message) {
    alert("Harap isi nama dan pesan mading terlebih dahulu!");
    return;
  }

  // Simpan data ke Firebase Realtime Database
  database.ref('mading').push({
    sender: sender,
    message: message,
    timestamp: Date.now()
  })
  .then(() => {
    // Kirim Push Notification ke HP & Laptop lain
    sendOneSignalNotification(sender, message);

    // Kosongkan form input
    senderInput.value = '';
    messageInput.value = '';
  })
  .catch((error) => {
    console.error("Gagal mengirim mading:", error);
    alert("Gagal mengirim mading. Cek koneksi internetmu!");
  });
}

// Membaca dan Menampilkan Mading secara Realtime
function initMadingRealtime() {
  const madingList = document.getElementById('mading-list');
  if (!madingList) return;

  database.ref('mading').on('value', (snapshot) => {
    const data = snapshot.val();
    madingList.innerHTML = '';

    if (!data) {
      madingList.innerHTML = '<p class="text-gray-500 italic text-center">Belum ada mading. Jadilah yang pertama menulis!</p>';
      return;
    }

    // Ubah object Firebase menjadi array dan urutkan dari yang terbaru
    const posts = Object.keys(data).map(key => data[key]);
    posts.sort((a, b) => b.timestamp - a.timestamp);

    posts.forEach(post => {
      const dateStr = new Date(post.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const card = document.createElement('div');
      card.className = "p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-3";
      card.innerHTML = `
        <div class="flex justify-between items-center mb-1">
          <span class="font-bold text-blue-600 dark:text-blue-400">${post.sender}</span>
          <span class="text-xs text-gray-400">${dateStr}</span>
        </div>
        <p class="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-line">${post.message}</p>
      `;
      madingList.appendChild(card);
    });
  });
}

// ==========================================
// 5. INISIALISASI HALAMAN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateBirthdayUI();

  if (birthdayInterval) {
    clearInterval(birthdayInterval);
  }
  
  birthdayInterval = setInterval(updateBirthdayUI, 1000);

  // Cek apakah ada anggota yang ultah hari ini untuk kirim notif
  checkTodayBirthdays();

  // Inisialisasi Mading Realtime
  initMadingRealtime();

  // Bind event Listener ke Tombol Kirim Mading
  const btnKirim = document.getElementById('btn-kirim-mading');
  if (btnKirim) {
    btnKirim.addEventListener('click', (e) => {
      e.preventDefault();
      kirimMading();
    });
  }
});