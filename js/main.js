document.addEventListener("DOMContentLoaded", async function() {
    const config = await loadConfig();

    document.getElementById("calculate-button").addEventListener("click", function() {
        // 入力値を取得
        const staffCount = parseInt(document.getElementById("staff-count").value);
        const workingDays = parseInt(document.getElementById("working-days").value);

        // 労働力 (P) 計算
        const laborForce = calculateLaborForce(staffCount, workingDays);
        document.getElementById("labor-force-output").textContent = laborForce;

        // 月別の消費 (A+B) 計算
        const consumption = calculateMonthlyConsumption(staffCount, workingDays, config);
        document.getElementById("consumption-output").textContent = consumption;

        // 残余日数 (C) 計算
        const remainingDays = laborForce - consumption;
        document.getElementById("remaining-days-output").textContent = remainingDays;
    });
});

// 労働力計算関数
function calculateLaborForce(staffCount, workingDays) {
    return staffCount * workingDays;
}

// 消費 (A+B) 計算関数（仮実装）
function calculateConsumption(staffCount, workingDays) {
    // 固定値と変動値を加味して計算（仮設定）
    const fixedConsumption = workingDays * 0.8 * staffCount;  // 仮の計算式
    const variableConsumption = workingDays * 0.2 * staffCount; // 仮の計算式
    return fixedConsumption + variableConsumption;
}
