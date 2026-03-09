
const entryBox = document.getElementById("entry");
const saveBtn = document.getElementById("saveBtn");
const entriesList = document.getElementById("entriesList");
const moodText = document.getElementById("mood");
const ctx = document.getElementById("moodChart").getContext("2d");

let entries = JSON.parse(localStorage.getItem("mindspace_entries")) || [];

// Keyword-based mood detection
function detectMood(text) {
  const happy = ["happy", "good", "great", "awesome", "love", "excited"];
  const sad = ["sad", "bad", "tired", "angry", "upset", "lonely"];
  text = text.toLowerCase();

  if (happy.some(word => text.includes(word))) return "😊 Happy";
  if (sad.some(word => text.includes(word))) return "😞 Sad";
  return "😐 Neutral";
}

function saveEntry() {
  const text = entryBox.value.trim();
  if (!text) return alert("Please write something!");
  const mood = detectMood(text);
  const date = new Date().toLocaleDateString();

  const newEntry = { date, text, mood };
  entries.unshift(newEntry);
  localStorage.setItem("mindspace_entries", JSON.stringify(entries));

  entryBox.value = "";
  showEntries();
  showChart();
  moodText.textContent = mood;
}

function showEntries() {
  entriesList.innerHTML = entries
    .slice(0, 5)
    .map(e => `<li><strong>${e.date}</strong> — ${e.mood}<br>${e.text}</li>`)
    .join("");
}

// Chart.js setup
let chart;
function showChart() {
  const moods = entries.slice(0, 7).reverse();
  const labels = moods.map(e => e.date);
  const data = moods.map(e => e.mood.includes("Happy") ? 3 : e.mood.includes("Sad") ? 1 : 2);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Mood Level (3=Happy, 2=Neutral, 1=Sad)",
        data,
        fill: true,
        borderColor: "#1976d2",
        backgroundColor: "rgba(25,118,210,0.1)",
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { min: 0, max: 4, ticks: { stepSize: 1 } }
      }
    }
  });
}

// Event
saveBtn.addEventListener("click", saveEntry);

// Init
showEntries();
showChart();