document.getElementById("calculate-button").addEventListener("click", function() {
    // 各月の予定・実績データを取得し、計算を行う
    calculateMonthlyData(4);
    calculateMonthlyData(5);
    // 必要に応じて、6月から翌年3月までの関数呼び出しを追加
});

function calculateMonthlyData(month) {
    const plannedStaff = parseInt(document.getElementById(`planned-staff-${month}`).value) || 0;
    const actualStaff = parseInt(document.getElementById(`actual-staff-${month}`).value) || 0;

    // 消費 (A+B) と残日数 (C) を計算
    const consumption = calculateConsumption(plannedStaff);
    const remaining = calculateRemaining(plannedStaff, consumption);

    // 計算結果を表示
    document.getElementById(`consumption-${month}`).textContent = consumption;
    document.getElementById(`remaining-${month}`).textContent = remaining;
}

// 消費 (A+B) の計算（仮の計算式）
function calculateConsumption(plannedStaff) {
    return plannedStaff * 30; // 仮の消費値
}

// 残日数 (C) の計算
function calculateRemaining(plannedStaff, consumption) {
    return plannedStaff * 30 - consumption; // 仮の残日数
}
