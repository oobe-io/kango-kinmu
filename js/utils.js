// JSONデータを読み込む関数
async function loadConfig() {
    const response = await fetch("data/config.json");
    return response.json();
}

// 月別の消費計算関数
function calculateMonthlyConsumption(staffCount, workingDays, config) {
    // 固定消費 (A)
    const fixedWeekday = workingDays * config.fixedConsumption.weekday;
    const fixedWeekend = (workingDays / 7 * 2) * config.fixedConsumption.weekend;
    const fixedNightIn = workingDays * config.fixedConsumption.nightShiftIn;
    const fixedNightOut = workingDays * config.fixedConsumption.nightShiftOut;
    const totalFixed = fixedWeekday + fixedWeekend + fixedNightIn + fixedNightOut;

    // 変動消費 (B)
    const variableAnnual = config.variableConsumption.annualLeave * staffCount;
    const variableSummer = config.variableConsumption.summerLeave * staffCount;
    const variableStudent = config.variableConsumption.studentTraining * staffCount;
    const totalVariable = variableAnnual + variableSummer + variableStudent;

    return totalFixed + totalVariable; // A+B
}
