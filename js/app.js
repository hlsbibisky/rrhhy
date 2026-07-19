/**
 * 日日是好日 - 每日状态记录应用
 */

// ==================== 配置与常量 ====================
const STORAGE_KEY = 'rrhhy_data';
const DIMENSIONS_KEY = 'rrhhy_dimensions';
const THEME_KEY = 'rrhhy_theme';
const NOTES_KEY = 'rrhhy_notes';
const MONTHLY_NOTES_KEY = 'rrhhy_monthly_notes';

// SVG 图标定义（默认维度使用）
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

// 可选 emoji 图标
const EMOJI_ICONS = ['🎯','⭐','🎨','💎','🛡️','⚡','👥','🌿','😊','🔥','🌙','☀️','🎵','📚','🏃','💡','🌈','🍀','🦋'];

// 默认图标
const DEFAULT_EMOJI = '🎯';

function getDimIcon(dim) {
  // dim 可以是维度对象或维度 ID（兼容旧调用）
  if (typeof dim === 'object' && dim !== null) {
    // 如果维度对象有自定义 icon 字段
    if (dim.icon) {
      // 判断是 emoji 还是 SVG
      if (dim.icon.startsWith('<svg') || dim.icon.startsWith('<SVG')) {
        return dim.icon;
      }
      // emoji 图标
      return '<span style="font-size:18px;line-height:1;">' + dim.icon + '</span>';
    }
    // 回退到默认 SVG 图标
    return DIM_ICONS[dim.id] || '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>';
  }
  // 兼容旧调用：传入的是 ID 字符串
  return DIM_ICONS[dim] || '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>';
}

const DEFAULT_DIMENSIONS = [
  { id: 'focus', name: '专注/思维力', icon: null },
  { id: 'subjectivity', name: '主体性', icon: null },
  { id: 'feeling', name: '感受/创造力', icon: null },
  { id: 'meaning', name: '意义/价值感', icon: null },
  { id: 'responsibility', name: '责任/边界感', icon: null }
];

const RATING_LEVELS = ['很弱', '较弱', '一般', '较强', '很强'];
const RATING_VALUES = [1, 2, 3, 4, 5];

const CHART_COLORS = [
  '#F4A261', '#5B9BD5', '#70B870', '#E9C46A', '#B5838D',
  '#F4A261', '#6D9EAB', '#D4766A', '#8FB996', '#D4A574'
];

// 柔和粉彩色系（用于饼图）
const CHART_PASTEL = [
  '#F4A261', '#7EB5E3', '#8FCA8F', '#F0D58C', '#D4A0B0',
  '#F4C49A', '#8EC5D0', '#E0A090', '#B5D5B8', '#E0C090'
];

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const THEME_LIST = ['warm', 'cool', 'fresh'];

// ==================== 应用状态 ====================
const state = {
  currentPage: 'record',
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  statsYear: new Date().getFullYear(),
  statsMonth: new Date().getMonth() + 1,
  dimensions: [],
  records: {},
  notes: {},
  monthlyNotes: {},  // 月度备注，key格式: "2026-7"
  currentRatings: {},
  selectedCalDate: null,   // {year, month, day}
  recordDate: null,        // {year, month, day} - 当前记录的目标日期
  theme: 'warm',
  inlineEditIcon: DEFAULT_EMOJI,
  noDataDate: null          // 无数据弹窗对应的日期
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

  // 加载主题
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme && THEME_LIST.includes(theme)) {
      state.theme = theme;
    }
  } catch (e) {}

  // 加载备注
  try {
    const notes = localStorage.getItem(NOTES_KEY);
    if (notes) {
      state.notes = JSON.parse(notes);
    }
  } catch (e) {}

  // 加载月度备注
  try {
    const monthlyNotes = localStorage.getItem(MONTHLY_NOTES_KEY);
    if (monthlyNotes) {
      state.monthlyNotes = JSON.parse(monthlyNotes);
    }
  } catch (e) {}
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function saveDimensions() {
  localStorage.setItem(DIMENSIONS_KEY, JSON.stringify(state.dimensions));
}

function saveNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(state.notes));
}

function saveMonthlyNotes() {
  localStorage.setItem(MONTHLY_NOTES_KEY, JSON.stringify(state.monthlyNotes));
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

function isSameDate(d1, d2) {
  if (!d1 || !d2) return false;
  return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
}

// ==================== 主题管理 ====================
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function cycleTheme() {
  const idx = THEME_LIST.indexOf(state.theme);
  const next = THEME_LIST[(idx + 1) % THEME_LIST.length];
  applyTheme(next);
  showToast('已切换到' + (next === 'warm' ? '暖色' : next === 'cool' ? '冷色' : '清新') + '主题');
}

// ==================== 数据导出/导入 ====================
function downloadDataFile() {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    records: state.records,
    dimensions: state.dimensions,
    notes: state.notes,
    monthlyNotes: state.monthlyNotes,
    theme: state.theme
  };
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const today = getToday();
  a.download = `日日是好日_备份_${formatDate(today.year, today.month, today.day)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('数据已导出');
}

function exportData() {
  downloadDataFile();
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.records) {
        state.records = data.records;
        saveRecords();
      }
      if (data.dimensions) {
        state.dimensions = data.dimensions;
        saveDimensions();
      }
      if (data.notes) {
        state.notes = data.notes;
        saveNotes();
      }
      if (data.monthlyNotes) {
        state.monthlyNotes = data.monthlyNotes;
        saveMonthlyNotes();
      }
      if (data.theme && THEME_LIST.includes(data.theme)) {
        applyTheme(data.theme);
      }
      renderRecordPage();
      showToast('数据已导入，共恢复 ' + Object.keys(data.records || {}).length + ' 条记录');
    } catch (err) {
      showToast('导入失败：文件格式错误');
    }
  };
  reader.readAsText(file);
}

// ==================== 页面导航 ====================
function switchPage(pageName) {
  state.currentPage = pageName;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageName}`).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${pageName}"]`).classList.add('active');

  if (pageName === 'record') {
    // 如果 recordDate 未设置或不是从日历跳转来的，默认为今天
    if (!state.recordDate) {
      state.recordDate = getToday();
    }
    renderRecordPage();
  }
  if (pageName === 'calendar') renderCalendar();
  if (pageName === 'stats') renderStats();
}

// ==================== 记录页 ====================
function renderRecordPage() {
  const rd = state.recordDate || getToday();
  const today = getToday();
  const isNotToday = !isSameDate(rd, today);

  // 显示日期
  document.getElementById('record-date').textContent =
    `${rd.year}年${rd.month}月${rd.day}日 ${getWeekdayName(rd.year, rd.month, rd.day)}`;

  // 补记指示器
  const indicator = document.getElementById('record-date-indicator');
  if (isNotToday) {
    indicator.textContent = '补记模式';
    indicator.style.display = 'inline-block';
  } else {
    indicator.style.display = 'none';
  }

  renderDimensions();
  updateAddDimensionText();

  const dateKey = formatDate(rd.year, rd.month, rd.day);
  state.currentRatings = state.records[dateKey] ? { ...state.records[dateKey] } : {};
  updateRatingButtons();
}

function renderDimensions() {
  const container = document.getElementById('dimensions-list');
  container.innerHTML = '';

  const rd = state.recordDate || getToday();
  const dateKey = formatDate(rd.year, rd.month, rd.day);
  const dateNotes = state.notes[dateKey] || {};

  state.dimensions.forEach((dim, index) => {
    const hasNote = !!dateNotes[dim.id];
    const card = document.createElement('div');
    card.className = 'dimension-card';
    card.innerHTML = `
      <div class="dimension-header">
        <div class="dimension-name" data-index="${index}">
          <span class="dimension-icon" data-index="${index}">${getDimIcon(dim)}</span>
          <span class="dim-name-text">${dim.name}</span>
          <button class="dimension-edit-btn" data-index="${index}" title="编辑名称">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
        <div class="dimension-actions">
          <button class="dimension-note-btn ${hasNote ? 'has-note' : ''}" data-index="${index}" title="${hasNote ? '查看/修改备注' : '添加备注'}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
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

  // 评分按钮事件
  container.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dimId = btn.dataset.dim;
      const value = parseInt(btn.dataset.value);
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

  // 删除维度
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

  // 备注按钮
  container.querySelectorAll('.dimension-note-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      showNoteModal(index);
    });
  });

  // 点击图标更换图标
  container.querySelectorAll('.dimension-icon').forEach(iconSpan => {
    iconSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(iconSpan.dataset.index);
      showIconPicker(state.dimensions[index].icon || DEFAULT_EMOJI, (selectedIcon) => {
        state.dimensions[index].icon = selectedIcon;
        saveDimensions();
        renderDimensions();
      });
    });
  });
}

function startEditDimensionName(index, editBtn) {
  const dim = state.dimensions[index];
  const nameSpan = editBtn.parentElement.querySelector('.dim-name-text');
  const originalName = dim.name;

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
    `添加维度状态（${state.dimensions.length}/10）`;
}

// ==================== 图标选择器 ====================
function showIconPicker(currentIcon, callback) {
  const overlay = document.getElementById('icon-picker-overlay');
  const grid = document.getElementById('icon-picker-grid');
  grid.innerHTML = '';

  EMOJI_ICONS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = 'icon-picker-item';
    if (emoji === currentIcon) {
      btn.classList.add('selected');
    }
    btn.textContent = emoji;
    btn.addEventListener('click', () => {
      callback(emoji);
      hideIconPicker();
    });
    grid.appendChild(btn);
  });

  overlay.classList.add('active');

  // 点击遮罩关闭
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      hideIconPicker();
    }
  };
}

function hideIconPicker() {
  document.getElementById('icon-picker-overlay').classList.remove('active');
}

// ==================== 内联编辑行（添加维度） ====================
function showInlineEditRow() {
  if (state.dimensions.length >= 10) {
    showToast('最多添加10个维度');
    return;
  }
  state.inlineEditIcon = DEFAULT_EMOJI;
  document.getElementById('inline-icon-preview').textContent = DEFAULT_EMOJI;
  document.getElementById('inline-name-input').value = '';
  document.getElementById('inline-edit-row').style.display = 'flex';
  document.getElementById('add-dimension-btn').style.display = 'none';
  document.getElementById('inline-name-input').focus();
}

function hideInlineEditRow() {
  document.getElementById('inline-edit-row').style.display = 'none';
  document.getElementById('add-dimension-btn').style.display = 'flex';
}

function confirmInlineAdd() {
  const name = document.getElementById('inline-name-input').value.trim();
  if (!name) {
    showToast('请输入维度名称');
    return;
  }

  const newDim = {
    id: 'custom_' + Date.now(),
    name: name,
    icon: state.inlineEditIcon
  };

  state.dimensions.push(newDim);
  saveDimensions();
  hideInlineEditRow();
  renderDimensions();
  updateAddDimensionText();
  showToast('维度已添加');
}

// ==================== 确认记录 ====================
function confirmRecord() {
  const rd = state.recordDate || getToday();
  const dateKey = formatDate(rd.year, rd.month, rd.day);

  const ratedDims = Object.keys(state.currentRatings).filter(k => state.currentRatings[k] > 0);

  if (ratedDims.length === 0) {
    // 所有维度都未选中 → 删除当天记录
    if (state.records[dateKey]) {
      delete state.records[dateKey];
      saveRecords();
      showToast('已取消该日期的记录');
    } else {
      showToast('该日期暂无记录');
    }
    return;
  }

  state.records[dateKey] = { ...state.currentRatings };
  saveRecords();
  showToast('记录已保存');
}

// ==================== 月历页 ====================
function renderCalendar() {
  const year = state.currentYear;
  const month = state.currentMonth;

  // 切换月份时重置选中日期（未选择具体日期时只显示年份）
  state.selectedCalDate = null;

  // 更新日历标题
  document.getElementById('cal-month-title').textContent = `${year}年${month}月`;

  // 更新干支标题（未选日期时只显示年份）
  updateCalendarTitle();
  
  // 更新月度备注图标状态
  updateCalendarNoteIcon();

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
    const dateNotes = state.notes[dateKey] || {};
    const hasNote = Object.keys(dateNotes).length > 0;
    const isSelected = state.selectedCalDate &&
      state.selectedCalDate.year === year &&
      state.selectedCalDate.month === month &&
      state.selectedCalDate.day === day;

    if (isToday) el.classList.add('today');
    if (hasData) el.classList.add('has-data');
    if (hasNote) el.classList.add('has-note');
    if (isSelected) el.classList.add('selected-date');

    // 干支日
    const ganzhiDayStr = GanZhiCalendar.getDayGanZhi(year, month, day);

    el.innerHTML = `
      <span class="day-number">${day}</span>
      <span class="day-lunar">${ganzhiDayStr}</span>
      ${hasNote ? '<span class="day-note-icon" title="有备注">📝</span>' : ''}
    `;

    el.addEventListener('click', () => {
      // 更新选中日期
      state.selectedCalDate = { year: year, month: month, day: day };

      // 更新选中高亮
      grid.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected-date'));
      el.classList.add('selected-date');

      // 更新干支标题
      updateCalendarTitle();

      if (hasData) {
        showDateDetail(year, month, day);
      } else {
        showNoDataModal(year, month, day);
      }
    });

    grid.appendChild(el);
  }

  renderMonthSummary(year, month);
}

function updateCalendarTitle() {
  const year = state.currentYear;
  const month = state.currentMonth;

  if (state.selectedCalDate) {
    // 选择了具体日期 → 始终显示完整干支年月（不做未来不确定性过滤）
    const sd = state.selectedCalDate;
    const gzYear = GanZhiCalendar.getGanZhiYear(sd.year, sd.month, sd.day);
    const gzMonth = GanZhiCalendar.getGanZhiMonth(sd.year, sd.month, sd.day);
    if (gzMonth) {
      document.getElementById('cal-lunar-year').textContent = gzYear + '年-' + gzMonth + '月';
    } else {
      document.getElementById('cal-lunar-year').textContent = gzYear + '年';
    }
  } else {
    // 未选择具体日期 → 不显示干支副标题
    document.getElementById('cal-lunar-year').textContent = '';
  }
}

function renderMonthSummary(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  let recordCount = 0;
  const dimScores = {};

  // 使用新的评分系统计算每个维度的分数
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDate(year, month, day);
    const record = state.records[dateKey];
    if (record) {
      recordCount++;
      // 遍历所有维度，未选择的维度默认为0分
      state.dimensions.forEach(dim => {
        const rating = record[dim.id];
        const score = rating ? mapRatingToScore(rating) : 0;
        dimScores[dim.id] = (dimScores[dim.id] || 0) + score;
      });
    }
  }

  const summaryEl = document.getElementById('month-summary-text');
  if (recordCount === 0) {
    summaryEl.innerHTML = '本月记录了 0 天状态数据。';
  } else {
    // 将分数转换为正数并计算百分比
    const baseline = recordCount * 2;
    const adjustedScores = {};
    let totalAdjusted = 0;

    state.dimensions.forEach(dim => {
      const rawScore = dimScores[dim.id] || 0;
      const adjusted = rawScore + baseline;
      adjustedScores[dim.id] = adjusted;
      totalAdjusted += adjusted;
    });

    // 找出占比最大和最小的维度
    let maxDim = null;
    let maxScore = -Infinity;
    let minDim = null;
    let minScore = Infinity;

    state.dimensions.forEach(dim => {
      const score = adjustedScores[dim.id] || 0;
      if (score > maxScore) {
        maxScore = score;
        maxDim = dim.id;
      }
      if (score < minScore) {
        minScore = score;
        minDim = dim.id;
      }
    });

    const maxDimInfo = state.dimensions.find(d => d.id === maxDim);
    const minDimInfo = state.dimensions.find(d => d.id === minDim);
    const maxDimName = maxDimInfo ? maxDimInfo.name : maxDim;
    const minDimName = minDimInfo ? minDimInfo.name : minDim;

    let html = `本月记录了 ${recordCount} 天状态数据，<strong>${maxDimName}</strong> 占比最大，<strong>${minDimName}</strong> 占比最小。`;
    summaryEl.innerHTML = html;
  }
}

// ==================== 日期详情弹窗（有数据） ====================
function showDateDetail(year, month, day) {
  const dateKey = formatDate(year, month, day);
  const record = state.records[dateKey];
  if (!record) return;

  // 保存当前查看的日期，供修改记录使用
  state.noDataDate = { year, month, day };

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
      <span class="dimension-icon">${getDimIcon(dim)}</span>
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

function editRecordFromModal() {
  if (!state.noDataDate) return;
  state.recordDate = { ...state.noDataDate };
  hideModal();
  switchPage('record');
}

// ==================== 备注弹窗 ====================
let currentNoteDimId = null;

function showNoteModal(dimIndex) {
  const dim = state.dimensions[dimIndex];
  if (!dim) return;
  
  currentNoteDimId = dim.id;
  document.getElementById('note-modal-title').textContent = `${dim.name} - 备注`;
  
  const rd = state.recordDate || getToday();
  const dateKey = formatDate(rd.year, rd.month, rd.day);
  const dateNotes = state.notes[dateKey] || {};
  
  const textarea = document.getElementById('note-textarea');
  textarea.value = dateNotes[dim.id] || '';
  updateNoteCharCount();
  
  document.getElementById('note-modal-overlay').classList.add('active');
  setTimeout(() => textarea.focus(), 100);
}

function hideNoteModal() {
  document.getElementById('note-modal-overlay').classList.remove('active');
  currentNoteDimId = null;
}

function saveNote() {
  if (!currentNoteDimId) return;
  
  const rd = state.recordDate || getToday();
  const dateKey = formatDate(rd.year, rd.month, rd.day);
  
  if (!state.notes[dateKey]) {
    state.notes[dateKey] = {};
  }
  
  const textarea = document.getElementById('note-textarea');
  const content = textarea.value.trim();
  
  if (content) {
    state.notes[dateKey][currentNoteDimId] = content;
  } else {
    delete state.notes[dateKey][currentNoteDimId];
    if (Object.keys(state.notes[dateKey]).length === 0) {
      delete state.notes[dateKey];
    }
  }
  
  saveNotes();
  hideNoteModal();
  showToast('备注已保存');
  renderDimensions();
  updateRatingButtons();
}

function updateNoteCharCount() {
  const textarea = document.getElementById('note-textarea');
  const count = textarea.value.length;
  document.getElementById('note-char-count').textContent = `${count}/150`;
}

// ==================== 月度备注 ====================
function getMonthlyNoteKey(year, month) {
  return `${year}-${month}`;
}

function showMonthlyNoteModal() {
  const year = state.currentYear;
  const month = state.currentMonth;
  const key = getMonthlyNoteKey(year, month);
  
  document.getElementById('monthly-note-title').textContent = `${year}年${month}月 备注`;
  
  const content = state.monthlyNotes[key] || '';
  document.getElementById('monthly-note-content').textContent = content;
  document.getElementById('monthly-note-textarea').value = content;
  updateMonthlyNoteCharCount();
  
  // 默认显示查看模式
  document.getElementById('monthly-note-view').style.display = 'block';
  document.getElementById('monthly-note-edit').style.display = 'none';
  
  document.getElementById('monthly-note-overlay').classList.add('active');
}

function hideMonthlyNoteModal() {
  document.getElementById('monthly-note-overlay').classList.remove('active');
}

function editMonthlyNote() {
  document.getElementById('monthly-note-view').style.display = 'none';
  document.getElementById('monthly-note-edit').style.display = 'block';
  document.getElementById('monthly-note-textarea').focus();
}

function cancelEditMonthlyNote() {
  // 恢复查看模式
  document.getElementById('monthly-note-view').style.display = 'block';
  document.getElementById('monthly-note-edit').style.display = 'none';
}

function saveMonthlyNote() {
  const year = state.currentYear;
  const month = state.currentMonth;
  const key = getMonthlyNoteKey(year, month);
  
  const textarea = document.getElementById('monthly-note-textarea');
  const content = textarea.value.trim();
  
  if (content) {
    state.monthlyNotes[key] = content;
  } else {
    delete state.monthlyNotes[key];
  }
  
  saveMonthlyNotes();
  hideMonthlyNoteModal();
  showToast('月度备注已保存');
  updateCalendarNoteIcon();
}

function updateMonthlyNoteCharCount() {
  const textarea = document.getElementById('monthly-note-textarea');
  const count = textarea.value.length;
  document.getElementById('monthly-note-char-count').textContent = `${count}/500`;
}

function updateCalendarNoteIcon() {
  const year = state.currentYear;
  const month = state.currentMonth;
  const key = getMonthlyNoteKey(year, month);
  const hasNote = !!state.monthlyNotes[key];
  
  const btn = document.getElementById('cal-month-note-btn');
  if (hasNote) {
    btn.classList.add('has-note');
  } else {
    btn.classList.remove('has-note');
  }
}

// ==================== 无数据日期弹窗（居中） ====================
function showNoDataModal(year, month, day) {
  state.noDataDate = { year, month, day };
  document.getElementById('no-data-modal-title').textContent = `${year}年${month}月${day}日`;
  document.getElementById('no-data-modal-overlay').classList.add('active');
}

function hideNoDataModal() {
  document.getElementById('no-data-modal-overlay').classList.remove('active');
  state.noDataDate = null;
}

function goRecordFromNoData() {
  if (!state.noDataDate) return;
  state.recordDate = { ...state.noDataDate };
  hideNoDataModal();
  switchPage('record');
}

// ==================== 统计页 ====================
// 评分映射：1(很弱)=-2, 2(较弱)=-1, 3(一般)=0, 4(较强)=1, 5(很强)=2
function mapRatingToScore(rating) {
  const mapping = { 1: -2, 2: -1, 3: 0, 4: 1, 5: 2 };
  return mapping[rating] || 0;
}

function renderStats() {
  const year = state.statsYear;
  const month = state.statsMonth;

  document.getElementById('stats-month-title').textContent = `${year}年${month}月`;

  const daysInMonth = getDaysInMonth(year, month);
  let recordCount = 0;
  const dimScores = {};
  const dimDays = {};

  // 计算每个维度的原始分数（-2到+2系统）
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDate(year, month, day);
    const record = state.records[dateKey];
    if (record) {
      recordCount++;
      // 遍历所有维度，未选择的维度默认为0分
      state.dimensions.forEach(dim => {
        const rating = record[dim.id];
        const score = rating ? mapRatingToScore(rating) : 0;
        dimScores[dim.id] = (dimScores[dim.id] || 0) + score;
      });
      // 记录该维度被记录的天数
      for (const dimId of Object.keys(record)) {
        dimDays[dimId] = (dimDays[dimId] || 0) + 1;
      }
    }
  }

  document.getElementById('stats-days-number').textContent = recordCount;

  // 将分数转换为正数：加上基准值（recordCount * 2）使所有分数为正
  // 这样最弱的维度（全-2分）也会显示为正百分比
  const baseline = recordCount * 2;
  const adjustedScores = {};
  let totalAdjusted = 0;

  state.dimensions.forEach(dim => {
    const rawScore = dimScores[dim.id] || 0;
    const adjusted = rawScore + baseline;
    adjustedScores[dim.id] = adjusted;
    totalAdjusted += adjusted;
  });

  // 计算百分比
  const dimPercentages = {};
  state.dimensions.forEach(dim => {
    const adjusted = adjustedScores[dim.id] || 0;
    dimPercentages[dim.id] = totalAdjusted > 0 ? Math.round((adjusted / totalAdjusted) * 100) : 0;
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
          <span class="dimension-icon">${getDimIcon(dim)}</span>
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
  
  // 计算并渲染健康度分析
  renderHealthChart(dimScores, dimDays, recordCount);

  // 数据管理按钮事件
  const statsExportBtn = document.getElementById('stats-export-btn');
  const statsImportBtn = document.getElementById('stats-import-btn');
  if (statsExportBtn && !statsExportBtn._bound) {
    statsExportBtn._bound = true;
    statsExportBtn.addEventListener('click', exportData);
  }
  if (statsImportBtn && !statsImportBtn._bound) {
    statsImportBtn._bound = true;
    statsImportBtn.addEventListener('click', () => {
      document.getElementById('data-import-input').click();
    });
  }
}

function renderDonutChart(sortedDims, dimPercentages, recordCount) {
  const canvas = document.getElementById('donut-chart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const size = 220;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2;
  const outerR = 75, innerR = 48;
  const total = Object.values(dimPercentages).reduce((a, b) => a + b, 0);

  const activeDims = sortedDims.filter(d => dimPercentages[d.id] > 0);

  if (total === 0 || activeDims.length === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    ctx.fillStyle = '#F0EBE8';
    ctx.fill();
    document.getElementById('chart-labels').innerHTML = '';
    document.getElementById('chart-legend').innerHTML = '';
    document.getElementById('chart-center-number').textContent = recordCount;
    return;
  }

  // 画饼图扇区 + 引导线
  let startAngle = -Math.PI / 2;
  const sliceInfo = [];
  const elbowDist = outerR + 14;   // 拐点距圆心
  const hExtend = 28;              // 水平延伸长度
  const gap = 8;                   // 线端到文字的间距（约0.2cm）

  activeDims.forEach((dim, i) => {
    const pct = dimPercentages[dim.id] || 0;
    const sliceAngle = (pct / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;
    const color = CHART_PASTEL[i % CHART_PASTEL.length];
    const isRight = midAngle > -Math.PI / 2 && midAngle < Math.PI / 2;
    const dir = isRight ? 1 : -1;

    // 画扇区
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // 计算引导线三个点的坐标（canvas 坐标系）
    const edgeX = cx + Math.cos(midAngle) * outerR;
    const edgeY = cy + Math.sin(midAngle) * outerR;
    const elbowX = cx + Math.cos(midAngle) * elbowDist;
    const elbowY = cy + Math.sin(midAngle) * elbowDist;
    const lineEndX = elbowX + hExtend * dir;
    const lineEndY = elbowY;

    // 画引导线：扇区边缘 → 拐点 → 水平延伸
    ctx.beginPath();
    ctx.moveTo(edgeX, edgeY);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 记录标签锚点信息（相对于 canvas 中心的偏移量）
    // 标签锚点 = 线端 + gap * 方向
    const labelOffsetX = (lineEndX - cx) + gap * dir;
    const labelOffsetY = lineEndY - cy;

    sliceInfo.push({ dim, pct, midAngle, color, isRight, labelOffsetX, labelOffsetY });
    startAngle = endAngle;
  });

  // 用 HTML 元素创建外侧标签
  // 标签的垂直中心对齐引导线端点，水平方向间隔 gap
  const labelsContainer = document.getElementById('chart-labels');
  labelsContainer.innerHTML = '';

  sliceInfo.forEach(({ dim, pct, color, isRight, labelOffsetX, labelOffsetY }) => {
    const label = document.createElement('div');
    label.className = 'chart-label ' + (isRight ? 'align-left' : 'align-right');

    label.style.left = `calc(50% + ${labelOffsetX}px)`;
    label.style.top = `calc(50% + ${labelOffsetY}px)`;
    // 垂直居中于线端点，水平方向紧贴 gap 间距
    label.style.transform = `translate(${isRight ? '0' : '-100%'}, -50%)`;

    // 解析维度名，提取括号内容
    let displayName = dim.name;
    let parenthetical = '';
    const match = dim.name.match(/^(.+?)（(.+?)）$/);
    if (match) {
      displayName = match[1];
      parenthetical = match[2];
    }

    label.innerHTML = `
      <span class="chart-label-pct" style="color: ${color}">${pct}%</span>
      <span class="chart-label-name" style="color: ${color}">${displayName}</span>
      ${parenthetical ? `<span class="chart-label-paren" style="color: ${color}">（${parenthetical}）</span>` : ''}
    `;

    labelsContainer.appendChild(label);
  });

  // 中心文字
  document.getElementById('chart-center-number').textContent = recordCount;

  // 移除底部图例
  document.getElementById('chart-legend').innerHTML = '';
}

// ==================== 健康度分析 ====================
function renderHealthChart(dimScores, dimDays, recordCount) {
  const healthBars = document.getElementById('health-bars');
  
  if (recordCount === 0) {
    healthBars.innerHTML = '<div style="text-align:center;color:var(--text-lighter);padding:20px;">暂无数据</div>';
    return;
  }
  
  // 计算每个维度的健康度（反向：越接近0越健康）
  const healthData = [];
  let totalHealthScore = 0;
  
  state.dimensions.forEach(dim => {
    const totalScore = dimScores[dim.id] || 0;
    const days = dimDays[dim.id] || 0;
    const avgScore = days > 0 ? totalScore / days : 0;
    const deviation = Math.abs(avgScore); // 偏离0的程度
    const healthScore = 2 - deviation; // 健康分数：0-2，越高越健康
    
    healthData.push({
      dim,
      healthScore,
      days
    });
    totalHealthScore += healthScore;
  });
  
  // 计算平均健康度
  const avgHealthScore = totalHealthScore / state.dimensions.length;
  
  // 按健康度排序（分数越高越健康）
  healthData.sort((a, b) => b.healthScore - a.healthScore);
  
  // 渲染柱状图 - 根据相对健康度决定颜色和长度
  healthBars.innerHTML = '';
  
  healthData.forEach(({ dim, healthScore }) => {
    let percent;
    let healthClass = 'healthy';
    
    // 根据与平均值的比较决定状态
    const diff = healthScore - avgHealthScore;
    
    if (diff >= 0.15) {
      healthClass = 'healthy'; // 绿色：积极（高于平均）
      percent = 80 + Math.min((diff - 0.15) / 0.5 * 20, 20); // 80-100%
    } else if (diff >= -0.15) {
      healthClass = 'moderate'; // 黄色：中性（接近平均）
      percent = 40 + (diff + 0.15) / 0.3 * 30; // 40-70%
    } else {
      healthClass = 'unhealthy'; // 红色：过度（低于平均）
      percent = 10 + Math.max((diff + 0.5) / 0.4 * 20, 0); // 10-30%
    }
    
    const item = document.createElement('div');
    item.className = 'health-bar-item';
    item.innerHTML = `
      <div class="health-bar-label">${dim.name}</div>
      <div class="health-bar-track">
        <div class="health-bar-fill ${healthClass}" style="width: ${percent}%"></div>
      </div>
    `;
    healthBars.appendChild(item);
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
  // 底部导航
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
    });
  });

  // 确认记录
  document.getElementById('confirm-btn').addEventListener('click', confirmRecord);

  // 添加维度按钮 -> 显示内联编辑行
  document.getElementById('add-dimension-btn').addEventListener('click', showInlineEditRow);

  // 内联编辑行按钮
  document.getElementById('inline-icon-picker-btn').addEventListener('click', () => {
    showIconPicker(state.inlineEditIcon, (selectedIcon) => {
      state.inlineEditIcon = selectedIcon;
      document.getElementById('inline-icon-preview').textContent = selectedIcon;
    });
  });

  document.getElementById('inline-confirm-btn').addEventListener('click', confirmInlineAdd);
  document.getElementById('inline-cancel-btn').addEventListener('click', hideInlineEditRow);

  // 内联输入框回车确认
  document.getElementById('inline-name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmInlineAdd();
    } else if (e.key === 'Escape') {
      hideInlineEditRow();
    }
  });

  // 日期详情弹窗关闭
  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-close-btn').addEventListener('click', hideModal);
  document.getElementById('modal-edit-record').addEventListener('click', editRecordFromModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideModal();
  });

  // 备注弹窗
  document.getElementById('note-save-btn').addEventListener('click', saveNote);
  document.getElementById('note-cancel-btn').addEventListener('click', hideNoteModal);
  document.getElementById('note-modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideNoteModal();
  });
  document.getElementById('note-textarea').addEventListener('input', updateNoteCharCount);

  // 月度备注弹窗
  document.getElementById('cal-month-note-btn').addEventListener('click', showMonthlyNoteModal);
  document.getElementById('monthly-note-edit-btn').addEventListener('click', editMonthlyNote);
  document.getElementById('monthly-note-close-btn').addEventListener('click', hideMonthlyNoteModal);
  document.getElementById('monthly-note-save-btn').addEventListener('click', saveMonthlyNote);
  document.getElementById('monthly-note-cancel-btn').addEventListener('click', cancelEditMonthlyNote);
  document.getElementById('monthly-note-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideMonthlyNoteModal();
  });
  document.getElementById('monthly-note-textarea').addEventListener('input', updateMonthlyNoteCharCount);

  // 无数据弹窗按钮
  document.getElementById('no-data-go-record').addEventListener('click', goRecordFromNoData);
  document.getElementById('no-data-close').addEventListener('click', hideNoDataModal);
  document.getElementById('no-data-modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideNoDataModal();
  });

  // 图标选择器关闭（点击遮罩）
  document.getElementById('icon-picker-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideIconPicker();
  });

  // 月历导航
  document.getElementById('cal-prev').addEventListener('click', () => {
    state.currentMonth--;
    if (state.currentMonth < 1) {
      state.currentMonth = 12;
      state.currentYear--;
    }
    // 如果选中日期不在新月，不重置，保留原选中
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

  // 统计页导航
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

  // 主题切换
  document.getElementById('theme-switcher-btn').addEventListener('click', cycleTheme);

  // 数据导入
  document.getElementById('data-import-input').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      importData(e.target.files[0]);
      e.target.value = '';
    }
  });
}

// ==================== 初始化 ====================
function init() {
  loadData();
  applyTheme(state.theme);
  initEvents();

  // 初始化 recordDate 为今天
  state.recordDate = getToday();

  renderRecordPage();
}

document.addEventListener('DOMContentLoaded', init);
