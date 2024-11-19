// JavaScriptファイル全文

document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    addVacationTableSwitcher(); // 休暇テーブル切り替え機能を追加
});

// 初期化関数
function initializePage() {
    console.log("ページ初期化開始");

    // データをロード
    loadData();

    // 各種イベントリスナーを追加
    addEventListeners();

    // 初期計算
    calculateTotalNurses();
    calculateCalendarDays();
    calculateMonthlySums();
    calculateRequiredDays(); // 必要日数計算を初期化に追加

    console.log("ページ初期化完了");
}

// ローカルストレージからデータを読み込む
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("vacationData")) || {};
    Object.entries(storedData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value;
    });
    console.log("データロード完了");
}

// データ保存
function saveData() {
    const inputs = document.querySelectorAll("input[type='number']");
    const vacationData = {};

    inputs.forEach(input => {
        if (input.id) {
            vacationData[input.id] = input.value;
        }
    });

    localStorage.setItem("vacationData", JSON.stringify(vacationData));
    console.log("データ保存完了");
}

// 看護師数の計算
function calculateTotalNurses() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    let cumulativeTotal = 0;

    months.forEach(month => {
        const nurseCount = parseInt(document.getElementById(`nurse-count-${month}`)?.value) || 0;
        const retireCount = parseInt(document.getElementById(`retire-count-${month}`)?.value) || 0;
        const maternityCount = parseInt(document.getElementById(`maternity-count-${month}`)?.value) || 0;

        const totalCount = retireCount + maternityCount;
        const totalField = document.getElementById(`total-count-${month}`);
        if (totalField) totalField.value = totalCount;

        cumulativeTotal += totalCount;

        const totalNurseField = document.getElementById(`total-nurse-${month}`);
        if (totalNurseField) {
            if (nurseCount === 0) {
                totalNurseField.value = "";
            } else {
                totalNurseField.value = nurseCount - cumulativeTotal;
            }
        }
    });
}

// 必要日数の計算
function calculateRequiredDays() {
    const categories = [
        "summer", "legal5", "sick", "other", "special",
        "night", "rotation", "student", "year1year3"
    ];

    categories.forEach(category => {
        const totalPlanField = document.getElementById(`vacation-${category}-required-plan`);
        const totalResultField = document.getElementById(`vacation-${category}-required-result`);

        const dayField = parseInt(document.getElementById(`vacation-${category}-days`)?.value) || 0;
        const peopleField = parseInt(document.getElementById(`vacation-${category}-people`)?.value) || 0;

        let planSum = 0;
        let resultSum = 0;

        // 月ごとの予定と実績の合計を計算
        ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"].forEach(month => {
            planSum += parseInt(document.getElementById(`vacation-${category}-${month}-plan`)?.value) || 0;
            resultSum += parseInt(document.getElementById(`vacation-${category}-${month}-result`)?.value) || 0;
        });

        // 必要日数の計算
        const requiredPlan = (dayField * peopleField) - planSum;
        const requiredResult = (dayField * peopleField) - resultSum;

        // 計算結果を表示
        if (totalPlanField) totalPlanField.value = requiredPlan;
        if (totalResultField) totalResultField.value = requiredResult;
    });
}

// テーブル切り替え機能（修正）
function addVacationTableSwitcher() {
    const prevButton = document.getElementById("vacation-prev-button");
    const nextButton = document.getElementById("vacation-next-button");
    const tablePeriod = document.getElementById("vacation-table-period");
    const table4To9 = document.getElementById("vacation-table-4-9");
    const table10To3 = document.getElementById("vacation-table-10-3");

    let currentTable = "4-9";

    // 初期状態の設定
    table4To9.classList.add("active");
    table10To3.classList.add("hidden");

    function toggleTables() {
        if (currentTable === "4-9") {
            currentTable = "10-3";
            table4To9.classList.remove("active");
            table4To9.classList.add("hidden");
            table10To3.classList.remove("hidden");
            table10To3.classList.add("active");
            tablePeriod.textContent = "10月〜3月";
        } else {
            currentTable = "4-9";
            table10To3.classList.remove("active");
            table10To3.classList.add("hidden");
            table4To9.classList.remove("hidden");
            table4To9.classList.add("active");
            tablePeriod.textContent = "4月〜9月";
        }
    }

    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}

// イベントリスナーを追加
function addEventListeners() {
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses();
            calculateCalendarDays();
            calculateMonthlySums();
            calculateRequiredDays();
            saveData(); // 入力変更時にデータを保存
        });
    });
    console.log("イベントリスナー追加完了");
}

// 他の関数（省略部分はそのまま既存コードに準拠）
