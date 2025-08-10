const clockDisplay = document.getElementById('clock');
const dateDisplay = document.getElementById('date');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const alarmMessage = document.getElementById('alarm-message');
const alarmAudio = document.getElementById('alarm-audio');

let alarmTime = null;
let alarmTriggered = false;

function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  clockDisplay.textContent = timeString;
  dateDisplay.textContent = now.toDateString();

  // Debug log
  if (alarmTime) {
    console.log("⏰ Now:", now.toLocaleTimeString(), " | Alarm:", alarmTime.toLocaleTimeString());
  }

  // Trigger alarm within 1 second window
  if (alarmTime && !alarmTriggered && Math.abs(now - alarmTime) < 1000) {
    triggerAlarm();
  }
}

function triggerAlarm() {
  alarmTriggered = true;
  alarmMessage.textContent = '⏰ Wake up! Alarm is ringing!';
  alarmAudio.play().catch(err => console.log("Audio error:", err));

  setTimeout(() => {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    alarmMessage.textContent = '';
    alarmTriggered = false;
  }, 60000); // stop after 1 minute
}

setAlarmButton.addEventListener('click', () => {
  const inputTime = alarmTimeInput.value;
  if (inputTime) {
    const now = new Date();
    const [hours, minutes] = inputTime.split(':');
    alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes), 0);
    alarmMessage.textContent = `✅ Alarm set for ${alarmTime.toLocaleTimeString()}`;
    alarmTriggered = false;
  }
});

setInterval(updateClock, 1000);

// Unlock audio playback on first interaction
window.addEventListener('click', () => {
  alarmAudio.play().then(() => {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
  }).catch(() => {});
}, { once: true });
