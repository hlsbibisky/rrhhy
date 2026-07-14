/**
 * 日日是好日 - 每日状态记录应用
 */

// ==================== 配置与常量 ====================
const STORAGE_KEY = 'rrhhy_data';
const DIMENSIONS_KEY = 'rrhhy_dimensions';

// SVG 图标定义
const DIM_ICONS = {
  focus: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E8845C" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="10" stroke-dasharray="1 3"/></svg>',
  subjectivity: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#E8C87A" stroke="#D4A574" stroke-width="1.5"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/></svg>',
  feeling: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="13.5" cy="6.5" r="2" fill="#E8845C"/><circle cx="17.5" cy="10.5" r="2" fill="#F0A88C"/><circle cx="15.5" cy="15.5" r="2" fill="#D4A574"/><circle cx="9.5" cy="14.5" r="2" fill="#C9B896"/><circle cx="7.5" cy="9.5" r="2" fill="#B8A9C9"/><circle cx="10.5" cy="5.5" r="2" fill="#F5C4B0"/></svg>',
  meaning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#A8C4D4" stroke="#7BA3B8" stroke-width="1.5"><polygon points="12,2 20,9 12,22 4,9"/></svg>',
  responsibility: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#B8A9C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  energy: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#E8C87A" stroke="#D4A574" stroke-width="1.5" stroke-linejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>',
  social: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9BB5CE" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M17 14a3 3 0 0 1 3 3v2"/></svg>',
  peace: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#A8C4B8" stroke-width="2" stroke-linecap="round"><path d="M12 22c-4-3-8-6-8-11a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 5-4 8-8 11z"/></svg>',
  joy: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#F5C4B0" stroke="#E8845C" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  courage: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#E8845C" stroke="#D4643C" stroke-width="1.5" stroke-linejoin="round"><path d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z"/><path d="M12 18c0 0-2 2-2 4h4c0-2-2-4-2-4z"/></svg>'
};

function getDimIcon(dimId) {
  return DIM_ICONS[dimId] || '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>';
}

const DEFAULT_DIMENSIONS = [
  { id: 'focus', name: '专注/思维力' },
  { id: 'subjectivity', name: '主体性' },
  { id: 'feeling', name: '感受/创造力' },
  { id: 'meaning', name: '意义/价值感' },
  { id: 'responsibility', name: '责任/边界感' }
];

const OPTIONAL_DIMENSIONS = [
  { id: 'energy', name: '精力/体力' },
  { id: 'social', name: '社交/连接感' },
  { id: 'peace', name: '平静/安定感' },
  { id: 'joy', name: '喜悦/满足感' },
  { id: 'courage', name: '勇气/行动力' }
];

const RATING_LEVELS = ['很弱', '较弱', '一般', '较强', '很强'];
const RATING_VALUES = [1, 2, 3, 4, 5];

const CHART_COLORS = [
  '#E8845C', '#F0A88C', '#D4A574', '#C9B896', '#B8A9C9',
  '#A8C4B8', '#F5C4B0', '#E8C87A', '#9BB5CE', '#D4918B'
];

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

// ==================== 应用状态 ====================
const state = {
  currentPage: 'record',
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  statsYear: new Date().getFullYear(),
  statsMonth: new Date().getMonth() + 1,
  dimensions: [],
  records: {},
  currentRatings: {}
};

// ==================== 数据存储 ====================
function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      state.records = JSON.parse(data);
    }
  } catch (e) {
    console.error('加载数据失败', e);
  }

  try {
    const dims = localStorage.getItem(DIMENSIONS_KEY);
    if (dims) {
      state.dimensions = JSON.parse(dims);
    } else {
      state.dimensions = JSON.parse(JSON.stringify(DEFAULT_DIMENSIONS));
    }
  } catch (e) {
    state.dimensions = JSON.parse(JSON.stringify(DEFAULT_DIMENSIONS));
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function saveDimensions() {
  localStorage.setItem(DIMENSIONS_KEY, JSON.stringify(state.dimensions));
}

// ==================== 工具函数 ====================
function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getToday() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
}

function getWeekdayName(year, month, day) {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return days[new Date(year, month - 1, day).getDay()];
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// ==================== 页面导航 ====================
function switchPage(pageName) {
  state.currentPage = pageName;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageName}`).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${pageName}"]`).classList.add('active');

  if (pageName === 'record') renderRecordPage();
  if (pageName === 'calendar') renderCalendar();
  if (pageName === 'stats') renderStats();
}

// ==================== 记录页 ====================
function renderRecordPage() {
  const today = getToday();
  document.getElementById('record-date').textContent =
    `${today.year}年${today.month}月${today.day}日 ${getWeekdayName(today.year, today.month, today.day)}`;

  renderDimensions();
  updateAddDimensionText();

  const todayKey = formatDate(today.year, today.month, today.day);
  state.currentRatings = state.records[todayKey] ? { ...state.records[todayKey] } : {};
  updateRatingButtons();
}

function renderDimensions() {
  const container = document.getElementById('dimensions-list');
  container.innerHTML = '';

  state.dimensions.forEach((dim, index) => {
    const card = document.createElement('div');
    card.className = 'dimension-card';
    card.innerHTML = `
      <div class="dimension-header">
        <div class="dimension-name" data-index="${index}">
          <span class="dimension-icon">${getDimIcon(dim.id)}</span>
          <span class="dim-name-text">${dim.name}</span>
          <button class="dimension-edit-btn" data-index="${index}" title="编辑名称">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
        <div class="dimension-actions">
          <button class="dimension-delete" data-index="${index}" title="删除维度">&#x1F5D1;</button>
        </div>
      </div>
      <div class="rating-group" data-dim-id="${dim.id}">
        ${RATING_LEVELS.map((level, i) => `
          <button class="rating-btn" data-dim="${dim.id}" data-value="${RATING_VALUES[i]}">
            ${level}
          </button>
        `).join('')}
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dimId = btn.dataset.dim;
      const value = parseInt(btn.dataset.value);
      // 如果已选中同一级别，则取消选中
      if (state.currentRatings[dimId] === value) {
        delete state.currentRatings[dimId];
      } else {
        state.currentRatings[dimId] = value;
      }
      updateRatingButtons();
    });
  });

  // 编辑维度名称
  container.querySelectorAll('.dimension-edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      startEditDimensionName(index, btn);
    });
  });

  container.querySelectorAll('.dimension-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      if (state.dimensions.length <= 1) {
        showToast('至少保留一个维度');
        return;
      }
      const dimId = state.dimensions[index].id;
      state.dimensions.splice(index, 1);
      delete state.currentRatings[dimId];
      saveDimensions();
      renderDimensions();
      updateAddDimensionText();
    });
  });
}

function startEditDimensionName(index, editBtn) {
  const dim = state.dimensions[index];
  const nameSpan = editBtn.parentElement.querySelector('.dim-name-text');
  const originalName = dim.name;

  // 创建输入框
  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalName;
  input.className = 'dim-name-input';
  input.maxLength = 10;

  nameSpan.replaceWith(input);
  editBtn.style.display = 'none';
  input.focus();
  input.select();

  function saveName() {
    const newName = input.value.trim();
    if (newName && newName !== originalName) {
      state.dimensions[index].name = newName;
      saveDimensions();
    }
    renderDimensions();
    updateRatingButtons();
  }

  input.addEventListener('blur', saveName);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    } else if (e.key === 'Escape') {
      input.value = originalName;
      input.blur();
    }
  });
}

function updateRatingButtons() {
  document.querySelectorAll('.rating-btn').forEach(btn => {
    const dimId = btn.dataset.dim;
    const value = parseInt(btn.dataset.value);
    if (state.currentRatings[dimId] === value) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function updateAddDimensionText() {
  document.getElementById('add-dimension-text').textContent =
    `添加维度（${state.dimensions.length}/10）`;
}

function showAddDimensionModal() {
  if (state.dimensions.length >= 10) {
    showToast('最多添加10个维度');
    return;
  }

  const container = document.getElementById('add-dimension-options');
  container.innerHTML = '';

  const currentIds = state.dimensions.map(d => d.id);
  const available = OPTIONAL_DIMENSIONS.filter(d => !currentIds.includes(d.id));

  if (available.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light); font-size: 14px;">没有更多可选维度了</p>';
  } else {
    available.forEach(dim => {
      const btn = document.createElement('button');
      btn.className = 'add-option-btn';
      btn.innerHTML = `${getDimIcon(dim.id)} ${dim.name}`;
      btn.addEventListener('click', () => {
        state.dimensions.push({ ...dim });
        saveDimensions();
        renderDimensions();
        updateAddDimensionText();
        hideAddModal();
      });
      container.appendChild(btn);
    });
  }

  document.getElementById('add-modal-overlay').classList.add('active');
}

function hideAddModal() {
  document.getElementById('add-modal-overlay').classList.remove('active');
}

function confirmRecord() {
  const today = getToday();
  const todayKey = formatDate(today.year, today.month, today.day);

  const ratedDims = Object.keys(state.currentRatings).filter(k => state.currentRatings[k] > 0);
  if (ratedDims.length === 0) {
    showToast('请至少为一个维度评分');
    return;
  }

  state.records[todayKey] = { ...state.currentRatings };
  saveRecords();
  showToast('记录已保存');
}

// ==================== 月历页 ====================
function renderCalendar() {
  const year = state.currentYear;
  const month = state.currentMonth;

  document.getElementById('cal-month-title').textContent = `${year}年${month}月`;

  // 干支年月标题（考虑未来日期的不确定性）
  const gzTitle = GanZhiCalendar.getMonthTitleWithUncertainty(year, month);
  document.getElementById('cal-lunar-year').textContent = gzTitle;

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  WEEKDAYS.forEach(day => {
    const el = document.createElement('div');
    el.className = 'cal-weekday';
    el.textContent = day;
    grid.appendChild(el);
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const today = getToday();

  for (let i = 0; i < firstDayOfWeek; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const el = document.createElement('div');
    el.className = 'cal-day';

    const dateKey = formatDate(year, month, day);
    const isToday = (year === today.year && month === today.month && day === today.day);
    const hasData = !!state.records[dateKey];

    if (isToday) el.classList.add('today');
    if (hasData) el.classList.add('has-data');

    // 干支日
    const ganzhiDayStr = GanZhiCalendar.getDayGanZhi(year, month, day);

    el.innerHTML = `
      <span class="day-number">${day}</span>
      <span class="day-lunar">${ganzhiDayStr}</span>
    `;

    el.addEventListener('click', () => {
      if (hasData) {
        showDateDetail(year, month, day);
      }
    });

    grid.appendChild(el);
  }

  renderMonthSummary(year, month);
}

function renderMonthSummary(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  let recordCount = 0;
  let dominantDim = null;
  let dominantCount = 0;
  const dimCounts = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDate(year, month, day);
    const record = state.records[dateKey];
    if (record) {
      recordCount++;
      let maxVal = 0;
      let maxDim = null;
      for (const [dimId, val] of Object.entries(record)) {
        if (val > maxVal) {
          maxVal = val;
          maxDim = dimId;
        }
        dimCounts[dimId] = (dimCounts[dimId] || 0) + 1;
      }
      if (maxDim) {
        if (!dominantDim || dimCounts[maxDim] > dominantCount) {
          dominantDim = maxDim;
          dominantCount = dimCounts[maxDim];
        }
      }
    }
  }

  const summaryEl = document.getElementById('month-summary-text');
  if (recordCount === 0) {
    summaryEl.textContent = `本月记录了 0 天状态数据，暂无占比最大。`;
  } else {
    const dimInfo = state.dimensions.find(d => d.id === dominantDim);
    const dimName = dimInfo ? dimInfo.name : dominantDim;
    summaryEl.textContent = `本月记录了 ${recordCount} 天状态数据，${dimName} 占比最大。`;
  }
}

function showDateDetail(year, month, day) {
  const dateKey = formatDate(year, month, day);
  const record = state.records[dateKey];
  if (!record) return;

  document.getElementById('modal-date-title').textContent = `${year}年${month}月${day}日`;

  const strongDims = [];
  const weakDims = [];
  state.dimensions.forEach(dim => {
    const val = record[dim.id];
    if (val !== undefined) {
      if (val >= 4) strongDims.push(dim.name);
      else if (val <= 2) weakDims.push(dim.name);
    }
  });

  let summaryText = '';
  if (strongDims.length > 0 && weakDims.length > 0) {
    summaryText = `${strongDims.join('、')}都表现不错，${weakDims.join('、')}值得多加关注。`;
  } else if (strongDims.length > 0) {
    summaryText = `${strongDims.join('、')}都表现不错。`;
  } else if (weakDims.length > 0) {
    summaryText = `${weakDims.join('、')}值得多加关注。`;
  } else {
    summaryText = '各维度表现均衡。';
  }
  document.getElementById('modal-summary').textContent = summaryText;

  const dimContainer = document.getElementById('modal-dimensions');
  dimContainer.innerHTML = '';

  state.dimensions.forEach(dim => {
    const val = record[dim.id];
    if (val === undefined) return;

    const item = document.createElement('div');
    item.className = 'modal-dim-item';

    const dotsHtml = Array.from({ length: 5 }, (_, i) =>
      `<span class="modal-dim-dot ${i < val ? 'filled' : ''}"></span>`
    ).join('');

    item.innerHTML = `
      <span class="dimension-icon">${getDimIcon(dim.id)}</span>
      <span>${dim.name}</span>
      <span class="modal-dim-dots">${dotsHtml}</span>
    `;
    dimContainer.appendChild(item);
  });

  document.getElementById('modal-overlay').classList.add('active');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// ==================== 统计页 ====================
function renderStats() {
  const year = state.statsYear;
  const month = state.statsMonth;

  document.getElementById('stats-month-title').textContent = `${year}年${month}月`;

  const daysInMonth = getDaysInMonth(year, month);
  let recordCount = 0;
  const dimScores = {};
  const dimDays = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDate(year, month, day);
    const record = state.records[dateKey];
    if (record) {
      recordCount++;
      for (const [dimId, val] of Object.entries(record)) {
        dimScores[dimId] = (dimScores[dimId] || 0) + val;
        dimDays[dimId] = (dimDays[dimId] || 0) + 1;
      }
    }
  }

  document.getElementById('stats-days-number').textContent = recordCount;

  const totalScore = Object.values(dimScores).reduce((a, b) => a + b, 0);
  const dimPercentages = {};

  state.dimensions.forEach(dim => {
    const score = dimScores[dim.id] || 0;
    dimPercentages[dim.id] = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
  });

  const dimsContainer = document.getElementById('stats-dimensions');
  dimsContainer.innerHTML = '';

  const sortedDims = [...state.dimensions].sort((a, b) =>
    (dimPercentages[b.id] || 0) - (dimPercentages[a.id] || 0)
  );

  sortedDims.forEach(dim => {
    const pct = dimPercentages[dim.id] || 0;
    const item = document.createElement('div');
    item.className = 'stats-dimension-item';
    item.innerHTML = `
      <div class="stats-dim-header">
        <div class="stats-dim-name">
          <span class="dimension-icon">${getDimIcon(dim.id)}</span>
          <span>${dim.name}</span>
        </div>
        <div class="stats-dim-percent">${pct}%</div>
      </div>
      <div class="stats-dim-bar">
        <div class="stats-dim-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
    dimsContainer.appendChild(item);
  });

  renderDonutChart(sortedDims, dimPercentages, recordCount);
}

function renderDonutChart(sortedDims, dimPercentages, recordCount) {
  const canvas = document.getElementById('donut-chart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  canvas.width = 240 * dpr;
  canvas.height = 240 * dpr;
  canvas.style.width = '240px';
  canvas.style.height = '240px';
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, 240, 240);

  const cx = 120, cy = 120, outerR = 100, innerR = 65;
  const total = Object.values(dimPercentages).reduce((a, b) => a + b, 0);

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.fillStyle = '#F0EBE8';
    ctx.fill();
  } else {
    let startAngle = -Math.PI / 2;
    sortedDims.forEach((dim, i) => {
      const pct = dimPercentages[dim.id] || 0;
      if (pct === 0) return;
      const sliceAngle = (pct / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
      ctx.fill();

      startAngle = endAngle;
    });
  }

  document.getElementById('chart-center-number').textContent = recordCount;

  const legendContainer = document.getElementById('chart-legend');
  legendContainer.innerHTML = '';
  sortedDims.forEach((dim, i) => {
    const pct = dimPercentages[dim.id] || 0;
    if (pct === 0) return;
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background: ${CHART_COLORS[i % CHART_COLORS.length]}"></span>
      <span>${dim.name} ${pct}%</span>
    `;
    legendContainer.appendChild(item);
  });
}

// ==================== Toast 提示 ====================
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.75);
    color: white;
    padding: 10px 24px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 999;
    animation: fadeInOut 2s ease forwards;
    max-width: 480px;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      15% { opacity: 1; transform: translateX(-50%) translateY(0); }
      85% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

// ==================== 事件绑定 ====================
function initEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
    });
  });

  document.getElementById('confirm-btn').addEventListener('click', confirmRecord);
  document.getElementById('add-dimension-btn').addEventListener('click', showAddDimensionModal);
  document.getElementById('add-modal-close').addEventListener('click', hideAddModal);
  document.getElementById('modal-close').addEventListener('click', hideModal);

  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideModal();
  });
  document.getElementById('add-modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideAddModal();
  });

  document.getElementById('cal-prev').addEventListener('click', () => {
    state.currentMonth--;
    if (state.currentMonth < 1) {
      state.currentMonth = 12;
      state.currentYear--;
    }
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    state.currentMonth++;
    if (state.currentMonth > 12) {
      state.currentMonth = 1;
      state.currentYear++;
    }
    renderCalendar();
  });

  document.getElementById('stats-prev').addEventListener('click', () => {
    state.statsMonth--;
    if (state.statsMonth < 1) {
      state.statsMonth = 12;
      state.statsYear--;
    }
    renderStats();
  });

  document.getElementById('stats-next').addEventListener('click', () => {
    state.statsMonth++;
    if (state.statsMonth > 12) {
      state.statsMonth = 1;
      state.statsYear++;
    }
    renderStats();
  });
}

// ==================== 初始化 ====================
function init() {
  loadData();
  initEvents();
  renderRecordPage();
}

document.addEventListener('DOMContentLoaded', init);
