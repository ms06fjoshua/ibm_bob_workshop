// 基本功能已提供，學員需實作進階分析功能：
// TODO: GET /api/journeys/popular-routes - 熱門路線 Top 10
// TODO: GET /api/journeys/peak-hours - 24 小時進站分布

const API_BASE = '/api/journeys';

// 圖表實例管理
let popularRoutesChart = null;
let peakHoursChart = null;

document.addEventListener('DOMContentLoaded', () => {
  loadStatistics();
  loadAllJourneys();
  renderPopularRoutesChart();
  renderPeakHoursChart();
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
    let routes;
    
    // 嘗試從 API 獲取資料，失敗則使用 mock data
    try {
      const response = await fetch(`${API_BASE}/popular-routes`);
      if (!response.ok) throw new Error('API not available');
      routes = await response.json();
    } catch (apiError) {
      console.warn('API 尚未實作，使用 Mock Data');
      routes = mockPopularRoutes;
    }
    
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
    
    // 同時更新圖表
    renderPopularRoutesChart();
  } catch (error) {
    showError(5, '無法載入熱門路線');
  }
}

async function loadPeakHours() {
  setActiveButton(2);
  document.getElementById('tableHead').innerHTML = `
    <tr>
      <th>時段</th>
      <th>時間範圍</th>
      <th>進站人數</th>
      <th>擁擠程度</th>
      <th>尖峰標記</th>
      <th>視覺化</th>
    </tr>
  `;
  try {
    let hours;
    
    // 嘗試從 API 獲取資料，失敗則使用 mock data
    try {
      const response = await fetch(`${API_BASE}/peak-hours`);
      if (!response.ok) throw new Error('API not available');
      hours = await response.json();
    } catch (apiError) {
      console.warn('API 尚未實作，使用 Mock Data');
      hours = mockPeakHours;
    }
    
    const tbody = document.getElementById('tableBody');

    if (hours.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading">查無資料</td></tr>';
      return;
    }

    tbody.innerHTML = hours.map(item => `
      <tr>
        <td>${String(item.hour).padStart(2, '0')}:00 - ${String(item.hour).padStart(2, '0')}:59</td>
        <td>${item.entryCount}</td>
      </tr>
    `).join('');
    
    // 同時更新圖表
    renderPeakHoursChart();
    // 找出最大進站人數用於計算百分比
    const maxCount = Math.max(...hours.map(h => h.entryCount));

    tbody.innerHTML = hours.map(item => {
      const percentage = maxCount > 0 ? (item.entryCount / maxCount * 100) : 0;
      const levelClass = getLevelClass(item.level);
      const levelText = getLevelText(item.level);
      const peakBadge = item.peak ? '<span class="peak-badge">🔥 尖峰</span>' : '';
      
      return `
        <tr class="${item.peak ? 'peak-row' : ''}">
          <td><strong>${String(item.hour).padStart(2, '0')}:00</strong></td>
          <td>${item.timeRange}</td>
          <td class="count-cell">${item.entryCount}</td>
          <td><span class="level-badge ${levelClass}">${levelText}</span></td>
          <td>${peakBadge}</td>
          <td>
            <div class="bar-container">
              <div class="bar ${levelClass}" style="width: ${percentage}%"></div>
              <span class="bar-label">${percentage.toFixed(0)}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    showError(6, '無法載入尖峰時段');
  }
}

function getLevelClass(level) {
  const classes = {
    'HIGH': 'level-high',
    'MEDIUM': 'level-medium',
    'LOW': 'level-low',
    'NONE': 'level-none'
  };
  return classes[level] || 'level-none';
}

function getLevelText(level) {
  const texts = {
    'HIGH': '高度擁擠',
    'MEDIUM': '中度擁擠',
    'LOW': '低度擁擠',
    'NONE': '正常'
  };
  return texts[level] || '未知';
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

// Mock Data - 熱門路線
const mockPopularRoutes = [
  { entryStation: '台北車站', exitStation: '板橋站', tripCount: 1250, totalRevenue: 50000 },
  { entryStation: '台北車站', exitStation: '松山站', tripCount: 980, totalRevenue: 39200 },
  { entryStation: '西門站', exitStation: '台北車站', tripCount: 875, totalRevenue: 35000 },
  { entryStation: '中山站', exitStation: '台北車站', tripCount: 820, totalRevenue: 32800 },
  { entryStation: '忠孝復興站', exitStation: '市政府站', tripCount: 765, totalRevenue: 30600 },
  { entryStation: '南港站', exitStation: '台北車站', tripCount: 720, totalRevenue: 28800 },
  { entryStation: '板橋站', exitStation: '台北車站', tripCount: 680, totalRevenue: 27200 },
  { entryStation: '信義安和站', exitStation: '台北101站', tripCount: 625, totalRevenue: 25000 },
  { entryStation: '松山站', exitStation: '南港站', tripCount: 580, totalRevenue: 23200 },
  { entryStation: '大安站', exitStation: '忠孝復興站', tripCount: 540, totalRevenue: 21600 }
];

// Mock Data - 尖峰時段
const mockPeakHours = [
  { hour: 0, entryCount: 45 }, { hour: 1, entryCount: 28 }, { hour: 2, entryCount: 15 },
  { hour: 3, entryCount: 12 }, { hour: 4, entryCount: 18 }, { hour: 5, entryCount: 85 },
  { hour: 6, entryCount: 320 }, { hour: 7, entryCount: 580 }, { hour: 8, entryCount: 750 },
  { hour: 9, entryCount: 420 }, { hour: 10, entryCount: 280 }, { hour: 11, entryCount: 310 },
  { hour: 12, entryCount: 380 }, { hour: 13, entryCount: 290 }, { hour: 14, entryCount: 260 },
  { hour: 15, entryCount: 310 }, { hour: 16, entryCount: 420 }, { hour: 17, entryCount: 680 },
  { hour: 18, entryCount: 820 }, { hour: 19, entryCount: 520 }, { hour: 20, entryCount: 380 },
  { hour: 21, entryCount: 290 }, { hour: 22, entryCount: 180 }, { hour: 23, entryCount: 95 }
];

// 熱門路線圖表渲染函數
async function renderPopularRoutesChart() {
  try {
    let routes;
    
    // 嘗試從 API 獲取資料，失敗則使用 mock data
    try {
      const response = await fetch(`${API_BASE}/popular-routes`);
      if (!response.ok) throw new Error('API not available');
      routes = await response.json();
    } catch (apiError) {
      console.warn('API 尚未實作，使用 Mock Data:', apiError.message);
      routes = mockPopularRoutes;
    }

    if (routes.length === 0) {
      console.warn('無熱門路線資料');
      return;
    }

    const ctx = document.getElementById('popularRoutesChart');
    
    // 銷毀舊圖表實例
    if (popularRoutesChart) {
      popularRoutesChart.destroy();
    }

    // 準備圖表資料
    const labels = routes.map(r => `${r.entryStation} → ${r.exitStation}`);
    const data = routes.map(r => r.tripCount);
    const revenues = routes.map(r => r.totalRevenue);

    popularRoutesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '搭乘次數',
          data: data,
          backgroundColor: 'rgba(0, 102, 204, 0.8)',
          borderColor: 'rgba(0, 102, 204, 1)',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const index = context.dataIndex;
                const tripCount = data[index];
                const revenue = formatCurrency(revenues[index]);
                return [
                  `搭乘次數: ${tripCount}`,
                  `總收入: ${revenue}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: '搭乘次數'
            },
            ticks: {
              precision: 0
            }
          },
          y: {
            title: {
              display: true,
              text: '路線'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('載入熱門路線圖表失敗:', error);
  }
}

// 尖峰時段圖表渲染函數
async function renderPeakHoursChart() {
  try {
    let hours;
    
    // 嘗試從 API 獲取資料，失敗則使用 mock data
    try {
      const response = await fetch(`${API_BASE}/peak-hours`);
      if (!response.ok) throw new Error('API not available');
      hours = await response.json();
    } catch (apiError) {
      console.warn('API 尚未實作，使用 Mock Data:', apiError.message);
      hours = mockPeakHours;
    }

    if (hours.length === 0) {
      console.warn('無尖峰時段資料');
      return;
    }

    const ctx = document.getElementById('peakHoursChart');
    
    // 銷毀舊圖表實例
    if (peakHoursChart) {
      peakHoursChart.destroy();
    }

    // 準備圖表資料 - 確保有完整的 24 小時
    const hourlyData = new Array(24).fill(0);
    hours.forEach(item => {
      if (item.hour >= 0 && item.hour < 24) {
        hourlyData[item.hour] = item.entryCount;
      }
    });

    const labels = Array.from({length: 24}, (_, i) => `${String(i).padStart(2, '0')}:00`);
    const maxCount = Math.max(...hourlyData);

    peakHoursChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '進站人數',
          data: hourlyData,
          backgroundColor: 'rgba(0, 168, 150, 0.2)',
          borderColor: 'rgba(0, 168, 150, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(0, 168, 150, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 168, 150, 1)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `進站人數: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '時段'
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '進站人數'
            },
            ticks: {
              precision: 0
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('載入尖峰時段圖表失敗:', error);
  }
}

// Made with Bob
