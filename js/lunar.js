/**
 * 简易农历转换工具
 * 基于 1900-2100 年农历数据表
 */
const LunarCalendar = (() => {
  // 农历数据表 (1900-2100)
  // 每个元素编码了该年的农历信息
  const lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
    0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252,
    0x0d520
  ];

  const Gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const Zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const Animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  const nStr1 = ['日','一','二','三','四','五','六','七','八','九','十'];
  const nStr2 = ['初','十','廿',''];
  const monthNames = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];

  function lYearDays(y) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
  }

  function leapMonth(y) {
    return lunarInfo[y - 1900] & 0xf;
  }

  function leapDays(y) {
    if (leapMonth(y)) {
      return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  function monthDays(y, m) {
    return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }

  function toLunar(obj) {
    let year = obj.year;
    let month = obj.month;
    let day = obj.day;
    let offset = 0;

    // 计算从1900年1月31日(农历1900年正月初一)到目标日期的天数
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    offset = Math.floor((targetDate - baseDate) / 86400000);

    let temp = 0;
    let lunarYear = 1900;

    for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
      temp = lYearDays(lunarYear);
      offset -= temp;
    }

    if (offset < 0) {
      offset += temp;
      lunarYear--;
    }

    let isLeap = false;
    let lunarMonth = 1;

    temp = leapMonth(lunarYear);
    for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
      if (temp > 0 && lunarMonth === (temp + 1) && !isLeap) {
        --lunarMonth;
        isLeap = true;
        temp = leapDays(lunarYear);
      } else {
        temp = monthDays(lunarYear, lunarMonth);
      }
      if (isLeap && lunarMonth === (temp + 1)) {
        isLeap = false;
      }
      offset -= temp;
    }

    if (offset === 0 && temp > 0 && temp === 30 && isLeap) {
      isLeap = false;
    }

    if (offset < 0) {
      offset += temp;
      --lunarMonth;
    }

    const lunarDay = offset + 1;

    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeap: isLeap
    };
  }

  function toLunarString(lunar) {
    let monthStr = '';
    if (lunar.isLeap) {
      monthStr = '闰' + monthNames[lunar.month - 1] + '月';
    } else {
      monthStr = monthNames[lunar.month - 1] + '月';
    }

    let dayStr = '';
    if (lunar.day <= 10) {
      dayStr = nStr2[0] + nStr1[lunar.day];
    } else if (lunar.day < 20) {
      dayStr = nStr2[1] + nStr1[lunar.day - 10];
    } else if (lunar.day === 20) {
      dayStr = nStr2[1] + nStr1[0];
    } else if (lunar.day < 30) {
      dayStr = nStr2[2] + nStr1[lunar.day - 20];
    } else {
      dayStr = nStr2[2] + nStr1[0];
    }

    return monthStr + dayStr;
  }

  function getGanZhiYear(year) {
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    return Gan[ganIndex] + Zhi[zhiIndex];
  }

  function getAnimal(year) {
    return Animals[(year - 4) % 12];
  }

  // 获取农历月名（用于日历标题下方）
  function getLunarMonthYear(year, month) {
    // 找到该月对应的农历年
    const firstDay = toLunar({ year, month, day: 1 });
    const ganZhi = getGanZhiYear(firstDay.year);
    return ganZhi + '年';
  }

  // 获取某天的农历日显示
  function getLunarDayStr(year, month, day) {
    const lunar = toLunar({ year, month, day });
    if (lunar.day === 1) {
      // 初一显示月名
      if (lunar.isLeap) {
        return '闰' + monthNames[lunar.month - 1];
      }
      return monthNames[lunar.month - 1] + '月';
    }
    // 其他日子显示日
    if (lunar.day <= 10) {
      return nStr2[0] + nStr1[lunar.day];
    } else if (lunar.day < 20) {
      return nStr2[1] + nStr1[lunar.day - 10];
    } else if (lunar.day === 20) {
      return nStr2[1] + nStr1[0];
    } else if (lunar.day < 30) {
      return nStr2[2] + nStr1[lunar.day - 20];
    } else {
      return nStr2[2] + nStr1[0];
    }
  }

  // 获取天干地支年+生肖（用于日历标题下方）
  function getLunarYearTitle(year, month) {
    const firstDay = toLunar({ year, month, day: 1 });
    const ganZhi = getGanZhiYear(firstDay.year);
    const animal = getAnimal(firstDay.year);
    return ganZhi + '年·' + animal;
  }

  return {
    toLunar,
    toLunarString,
    getLunarDayStr,
    getLunarYearTitle,
    getGanZhiYear,
    getAnimal
  };
})();
