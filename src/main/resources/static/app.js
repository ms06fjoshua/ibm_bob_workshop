// 基本功能已提供，學員需實作進階分析功能：
// TODO: GET /api/journeys/popular-routes - 熱門路線 Top 10
// TODO: GET /api/journeys/peak-hours - 24 小時進站分布

const API_BASE = '/api/journeys';

document.addEventListener('DOMContentLoaded', () => {
  loadStatistics();
  loadAllJourneys();
});

async function loadStatistics() {
  try {
    const response = await fetch(`${API_BASE}/statistics`);
    const data = await response.json();
    document.getElementById('totalJourneys').textContent = data.totalJourneys;
    document.getElementById('totalRevenue').textContent = formatCurrency(data.totalRevenue);
    document.getElementById('busiestRoute').textContent = data.busiestRoute;
    document.getElementById('peakHourRange').textContent = data.peakHourRange;
  } catch (error) {
    console.error('載入統計失敗:', error);
  }
}

async function loadAllJourneys() {
  setActiveButton(0);
  setJourneyTableHeader();
  try {
    const response = await fetch(API_BASE);
    const journeys = await response.json();
    const tbody = document.getElementById('tableBody');

    if (journeys.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="loading">查無資料</td></tr>';
      return;
    }

    tbody.innerHTML = journeys.map(j => `
      <tr>
        <td>${j.id}</td>
        <td><code>${j.card.cardNumber}</code></td>
        <td>${j.entryStation.stationName}</td>
        <td>${j.exitStation.stationName}</td>
        <td>${formatDateTime(j.entryTime)}</td>
        <td>${formatDateTime(j.exitTime)}</td>
        <td class="amount">${formatCurrency(j.fare)}</td>
        <td>${j.durationMinutes}</td>
      </tr>
    `).join('');
  } catch (error) {
    showError(8, '無法載入旅程資料');
  }
}

async function loadPopularRoutes() {
  setActiveButton(1);
  document.getElementById('tableHead').innerHTML = `
    <tr>
      <th>排名</th>
      <th>起站</th>
      <th>迄站</th>
      <th>搭乘次數</th>
      <th>總收入</th>
    </tr>
  `;
  try {
    const response = await fetch(`${API_BASE}/popular-routes`);
    const routes = await response.json();
    const tbody = document.getElementById('tableBody');

    if (routes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading">查無資料</td></tr>';
      return;
    }

    tbody.innerHTML = routes.map((route, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${route.entryStation}</td>
        <td>${route.exitStation}</td>
        <td>${route.tripCount}</td>
        <td class="amount">${formatCurrency(route.totalRevenue)}</td>
      </tr>
    `).join('');
  } catch (error) {
    showError(5, '無法載入熱門路線');
  }
}

async function loadPeakHours() {
  setActiveButton(2);
  document.getElementById('tableHead').innerHTML = `
    <tr>
      <th>時段</th>
      <th>進站人數</th>
    </tr>
  `;
  try {
    const response = await fetch(`${API_BASE}/peak-hours`);
    const hours = await response.json();
    const tbody = document.getElementById('tableBody');

    if (hours.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" class="loading">查無資料</td></tr>';
      return;
    }

    tbody.innerHTML = hours.map(item => `
      <tr>
        <td>${String(item.hour).padStart(2, '0')}:00 - ${String(item.hour).padStart(2, '0')}:59</td>
        <td>${item.entryCount}</td>
      </tr>
    `).join('');
  } catch (error) {
    showError(2, '無法載入尖峰時段');
  }
}

function setJourneyTableHeader() {
  document.getElementById('tableHead').innerHTML = `
    <tr>
      <th>旅程ID</th>
      <th>卡號</th>
      <th>起站</th>
      <th>迄站</th>
      <th>進站時間</th>
      <th>出站時間</th>
      <th>票價</th>
      <th>時長(分)</th>
    </tr>
  `;
}

function setActiveButton(index) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn, i) => btn.classList.toggle('active', i === index));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

function showError(colspan, message) {
  document.getElementById('tableBody').innerHTML = `
    <tr>
      <td colspan="${colspan}" style="color: var(--red); text-align: center;">⚠️ ${message}</td>
    </tr>
  `;
}

// Made with Bob
