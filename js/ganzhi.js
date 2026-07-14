/**
 * 干支历法计算模块
 * 包含：干支日、干支月（基于节气）、干支年（基于立春）
 */
const GanZhiCalendar = (() => {
  const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  // 60甲子
  function getGanZhi(index) {
    return TIAN_GAN[index % 10] + DI_ZHI[index % 12];
  }

  // ==================== 干支日 ====================
  // 参考日：2000年1月7日 = 甲子日 (index 0)
  const GANZHI_DAY_REF_DATE = new Date(2000, 0, 7);
  const GANZHI_DAY_REF_INDEX = 0; // 甲子

  function getGanZhiDayIndex(year, month, day) {
    const targetDate = new Date(year, month - 1, day);
    const refDate = new Date(GANZHI_DAY_REF_DATE);
    const diffDays = Math.round((targetDate - refDate) / 86400000);
    return ((GANZHI_DAY_REF_INDEX + diffDays) % 60 + 60) % 60;
  }

  function getGanZhiDay(year, month, day) {
    const idx = getGanZhiDayIndex(year, month, day);
    return getGanZhi(idx);
  }

  // ==================== 节气日期表 ====================
  // 节气对应的太阳黄经度数
  // 节（jie）用于确定干支月边界
  const JIE_SOLAR_TERMS = [
    { name: '小寒', longitude: 285, month: 1 },   // 丑月开始
    { name: '立春', longitude: 315, month: 2 },   // 寅月开始（干支年起点）
    { name: '惊蛰', longitude: 345, month: 3 },   // 卯月开始
    { name: '清明', longitude: 15,  month: 4 },   // 辰月开始
    { name: '立夏', longitude: 45,  month: 5 },   // 巳月开始
    { name: '芒种', longitude: 75,  month: 6 },   // 午月开始
    { name: '小暑', longitude: 105, month: 7 },   // 未月开始
    { name: '立秋', longitude: 135, month: 8 },   // 申月开始
    { name: '白露', longitude: 165, month: 9 },   // 酉月开始
    { name: '寒露', longitude: 195, month: 10 },  // 戌月开始
    { name: '立冬', longitude: 225, month: 11 },  // 亥月开始
    { name: '大雪', longitude: 255, month: 12 },  // 子月开始
  ];

  // 节气日期查找表（2020-2040年）
  // 格式：{ year: { termName: [month, day] } }
  const SOLAR_TERM_TABLE = {
    2020: { '小寒': [1,6], '立春': [2,4], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,6], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2021: { '小寒': [1,5], '立春': [2,3], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2022: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,5], '立夏': [5,5], '芒种': [6,6], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2023: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,6], '清明': [4,5], '立夏': [5,6], '芒种': [6,6], '小暑': [7,7], '立秋': [8,8], '白露': [9,8], '寒露': [10,8], '立冬': [11,8], '大雪': [12,7] },
    2024: { '小寒': [1,6], '立春': [2,4], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,6], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2025: { '小寒': [1,5], '立春': [2,3], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2026: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,5], '立夏': [5,5], '芒种': [6,6], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2027: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,6], '清明': [4,5], '立夏': [5,6], '芒种': [6,6], '小暑': [7,7], '立秋': [8,8], '白露': [9,8], '寒露': [10,9], '立冬': [11,8], '大雪': [12,7] },
    2028: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,6], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2029: { '小寒': [1,5], '立春': [2,3], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2030: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,5], '立夏': [5,5], '芒种': [6,6], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2031: { '小寒': [1,6], '立春': [2,4], '惊蛰': [3,6], '清明': [4,5], '立夏': [5,6], '芒种': [6,6], '小暑': [7,7], '立秋': [8,8], '白露': [9,8], '寒露': [10,9], '立冬': [11,8], '大雪': [12,7] },
    2032: { '小寒': [1,6], '立春': [2,4], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,6], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2033: { '小寒': [1,5], '立春': [2,3], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2034: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,5], '立夏': [5,5], '芒种': [6,6], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2035: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,6], '清明': [4,5], '立夏': [5,6], '芒种': [6,6], '小暑': [7,7], '立秋': [8,8], '白露': [9,8], '寒露': [10,9], '立冬': [11,8], '大雪': [12,7] },
    2036: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,6], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2037: { '小寒': [1,5], '立春': [2,3], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2038: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,5], '立夏': [5,5], '芒种': [6,6], '小暑': [7,7], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
    2039: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,6], '清明': [4,5], '立夏': [5,6], '芒种': [6,6], '小暑': [7,7], '立秋': [8,8], '白露': [9,8], '寒露': [10,9], '立冬': [11,8], '大雪': [12,7] },
    2040: { '小寒': [1,5], '立春': [2,4], '惊蛰': [3,5], '清明': [4,4], '立夏': [5,5], '芒种': [6,5], '小暑': [7,6], '立秋': [8,7], '白露': [9,7], '寒露': [10,8], '立冬': [11,7], '大雪': [12,7] },
  };

  // 计算某年某节气的日期
  function getSolarTermDate(year, termName) {
    // 先查表
    if (SOLAR_TERM_TABLE[year] && SOLAR_TERM_TABLE[year][termName]) {
      const [month, day] = SOLAR_TERM_TABLE[year][termName];
      return new Date(year, month - 1, day);
    }
    
    // 如果不在表中，使用近似计算
    // 找到最近的有数据的年份
    const years = Object.keys(SOLAR_TERM_TABLE).map(Number).sort((a, b) => a - b);
    const minYear = years[0];
    const maxYear = years[years.length - 1];
    
    let refYear, refDate;
    if (year < minYear) {
      refYear = minYear;
      refDate = SOLAR_TERM_TABLE[minYear][termName];
      // 向前推算：每年提前约0.2422天
      const yearDiff = refYear - year;
      const driftDays = Math.round(yearDiff * 0.2422);
      return new Date(year, refDate[0] - 1, refDate[1] - driftDays);
    } else if (year > maxYear) {
      refYear = maxYear;
      refDate = SOLAR_TERM_TABLE[maxYear][termName];
      // 向后推算：每年推迟约0.2422天
      const yearDiff = year - refYear;
      const driftDays = Math.round(yearDiff * 0.2422);
      return new Date(year, refDate[0] - 1, refDate[1] + driftDays);
    }
    
    return null;
  }

  // ==================== 干支月 ====================
  // 干支月的地支由节气决定：
  // 立春→寅月, 惊蛰→卯月, 清明→辰月, 立夏→巳月,
  // 芒种→午月, 小暑→未月, 立秋→申月, 白露→酉月,
  // 寒露→戌月, 立冬→亥月, 大雪→子月, 小寒→丑月

  // 干支月的天干由年干决定（五虎遁）：
  // 甲己年→丙寅月起, 乙庚年→戊寅月起, 丙辛年→庚寅月起,
  // 丁壬年→壬寅月起, 戊癸年→甲寅月起

  function getGanZhiMonth(year, month, day) {
    // 先确定该日期在哪个干支月
    // 干支月从"节"开始，到下一个"节"之前
    const targetDate = new Date(year, month - 1, day);

    // 收集所有相关节气的日期
    const jieDates = [];
    for (const jie of JIE_SOLAR_TERMS) {
      // 当前年的节气
      const d = getSolarTermDate(year, jie.name);
      if (d) jieDates.push({ ...jie, date: d, year: year });
      
      // 前一年的节气（用于年初）
      if (jie.month >= 6) { // 只需要下半年节气
        const dPrev = getSolarTermDate(year - 1, jie.name);
        if (dPrev) jieDates.push({ ...jie, date: dPrev, year: year - 1 });
      }
      
      // 下一年的节气（用于年末）
      if (jie.month <= 6) { // 只需要上半年节气
        const dNext = getSolarTermDate(year + 1, jie.name);
        if (dNext) jieDates.push({ ...jie, date: dNext, year: year + 1 });
      }
    }

    // 按日期排序
    jieDates.sort((a, b) => a.date - b.date);

    // 找到目标日期所在的节气区间
    let currentJie = null;
    for (let i = jieDates.length - 1; i >= 0; i--) {
      if (jieDates[i].date <= targetDate) {
        currentJie = jieDates[i];
        break;
      }
    }

    if (!currentJie) return null;

    // 确定地支：从立春开始，寅卯辰巳午未申酉戌亥子丑
    const zhiOrder = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];
    const jieToZhi = {
      '立春': 0, '惊蛰': 1, '清明': 2, '立夏': 3,
      '芒种': 4, '小暑': 5, '立秋': 6, '白露': 7,
      '寒露': 8, '立冬': 9, '大雪': 10, '小寒': 11
    };
    const zhiIndex = jieToZhi[currentJie.name];
    const zhi = zhiOrder[zhiIndex];

    // 确定年干（用于计算月干）
    // 干支年在立春切换
    const ganZhiYear = getGanZhiYear(year, month, day);
    const yearGanIndex = TIAN_GAN.indexOf(ganZhiYear[0]);

    // 五虎遁：寅月的天干
    const yinMonthGanOffset = [2, 4, 6, 8, 0]; // 甲己→丙(2), 乙庚→戊(4), 丙辛→庚(6), 丁壬→壬(8), 戊癸→甲(0)
    const yinGanIndex = yinMonthGanOffset[yearGanIndex % 5];

    // 从寅月开始计算当前月的天干
    const monthGanIndex = (yinGanIndex + zhiIndex) % 10;

    return TIAN_GAN[monthGanIndex] + zhi;
  }

  // ==================== 干支年 ====================
  // 干支年在立春切换（不是春节，也不是元旦）

  function getGanZhiYear(year, month, day) {
    // 立春通常在2月4日或5日
    const lichun = getSolarTermDate(year, '立春');

    const targetDate = new Date(year, month - 1, day);

    let ganZhiYearNum;
    if (lichun && targetDate < lichun) {
      // 在立春之前，属于上一年
      ganZhiYearNum = year - 1 - 4; // 减4是因为公元4年是甲子年
    } else {
      ganZhiYearNum = year - 4;
    }

    const ganIndex = ((ganZhiYearNum % 10) + 10) % 10;
    const zhiIndex = ((ganZhiYearNum % 12) + 12) % 12;

    return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
  }

  // 获取干支年月
  function getGanZhiYearMonth(year, month, day) {
    const gzYear = getGanZhiYear(year, month, day);
    const gzMonth = getGanZhiMonth(year, month, day);
    return gzYear + gzMonth;
  }

  // 获取某月的干支标题（用于日历标题）
  function getMonthGanZhiTitle(year, month) {
    const gzYear = getGanZhiYear(year, month, 1);
    const gzMonth = getGanZhiMonth(year, month, 1);
    if (gzMonth) {
      return gzYear + gzMonth + '月';
    }
    return gzYear + '年';
  }

  // 获取某天的完整干支显示（用于日历日期下方）
  function getDayGanZhi(year, month, day) {
    return getGanZhiDay(year, month, day) + '日';
  }

  // 判断干支信息是否"确定"（用于未来日期的显示控制）
  // 规则：如果日期在今天之后，且涉及的节气还没到，则不确定
  function isGanZhiCertain(year, month, day) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(year, month - 1, day);
    return targetDate <= today;
  }

  // 获取某月的干支标题（考虑不确定性）
  // 格式: "丙午年-乙未月"，基于选定日期而非1号
  function getMonthTitleWithUncertainty(year, month, day) {
    day = day || 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gzYear = getGanZhiYear(year, month, day);

    // 先确定该日期所在的干支月及其起始节气
    const targetDate = new Date(year, month - 1, day);

    // 收集所有相关节气的日期
    const jieDates = [];
    for (const jie of JIE_SOLAR_TERMS) {
      const d = getSolarTermDate(year, jie.name);
      if (d) jieDates.push({ ...jie, date: d });
      if (jie.month >= 6) {
        const dPrev = getSolarTermDate(year - 1, jie.name);
        if (dPrev) jieDates.push({ ...jie, date: dPrev });
      }
      if (jie.month <= 6) {
        const dNext = getSolarTermDate(year + 1, jie.name);
        if (dNext) jieDates.push({ ...jie, date: dNext });
      }
    }
    jieDates.sort((a, b) => a.date - b.date);

    // 找到targetDate所在区间的起始节气
    let definingJie = null;
    for (let i = jieDates.length - 1; i >= 0; i--) {
      if (jieDates[i].date <= targetDate) {
        definingJie = jieDates[i];
        break;
      }
    }

    // 判断年干支是否确定：立春是否已过
    const lichun = getSolarTermDate(year, '立春');
    const yearCertain = !lichun || lichun <= today;

    if (!yearCertain) {
      // 立春还没到，年也不确定
      return '';
    }

    // 年确定
    if (!definingJie) {
      return gzYear + '年';
    }

    // 判断月干支是否确定：定义该干支月的节气是否已过
    const monthCertain = definingJie.date <= today;

    if (!monthCertain) {
      // 节气还没到，月不确定，只显示年
      return gzYear + '年';
    }

    // 月也确定，显示完整干支年月（新格式：丙午年-乙未月）
    const gzMonth = getGanZhiMonth(year, month, day);
    if (gzMonth) {
      return gzYear + '年-' + gzMonth + '月';
    }
    return gzYear + '年';
  }

  return {
    getGanZhiDay,
    getGanZhiDayIndex,
    getGanZhiMonth,
    getGanZhiYear,
    getGanZhiYearMonth,
    getMonthGanZhiTitle,
    getDayGanZhi,
    getMonthTitleWithUncertainty,
    isGanZhiCertain,
    getSolarTermDate,
    TIAN_GAN,
    DI_ZHI
  };
})();
