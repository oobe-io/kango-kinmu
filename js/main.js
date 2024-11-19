// JavaScriptファイル全文

document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    addTableSwitcher(); // 月切り替えとテーブル切り替えを統合
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
    calculateRequiredDays();

    console.log("ページ初期化完了");
}

// 看護師数の計算
function calculateTotalNurses() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const nurseCount = parseInt(document.getElementById(`nurse-count-${month}`)?.value) || 0;
        const retireCount = parseInt(document.getElementById(`retire-count-${month}`)?.value) || 0;
        const maternityCount = parseInt(document.getElementById(`maternity-count-${month}`)?.value) || 0;

        const totalCount = retireCount + maternityCount;
        const totalField = document.getElementById(`total-count-${month}`);
        if (totalField) totalField.value = totalCount;

        const totalNurseField = document.getElementById(`total-nurse-${month}`);
        if (totalNurseField) {
            totalNurseField.value = nurseCount - totalCount;
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

        ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"].forEach(month => {
            planSum += parseInt(document.getElementById(`vacation-${category}-${month}-plan`)?.value) || 0;
            resultSum += parseInt(document.getElementById(`vacation-${category}-${month}-result`)?.value) || 0;
        });

        const requiredPlan = (dayField * peopleField) - planSum;
        const requiredResult = (dayField * peopleField) - resultSum;

        if (totalPlanField) totalPlanField.value = requiredPlan;
        if (totalResultField) totalResultField.value = requiredResult;
    });
}

// テーブル切り替え機能
function addTableSwitcher() {
    const generalPrevButton = document.getElementById("prev-button");
    const generalNextButton = document.getElementById("next-button");
    const vacationPrevButton = document.getElementById("vacation-prev-button");
    const vacationNextButton = document.getElementById("vacation-next-button");

    const generalPeriod = document.getElementById("general-table-period");
    const vacationPeriod = document.getElementById("vacation-table-period");

    const generalTable4To9 = document.getElementById("general-table-4-9");
    const generalTable10To3 = document.getElementById("general-table-10-3");
    const vacationTable4To9 = document.getElementById("vacation-table-4-9");
    const vacationTable10To3 = document.getElementById("vacation-table-10-3");

    let currentGeneralTable = "4-9";
    let currentVacationTable = "4-9";

    function toggleGeneralTables() {
        if (currentGeneralTable === "4-9") {
            currentGeneralTable = "10-3";
            generalTable4To9.classList.add("hidden");
            generalTable10To3.classList.remove("hidden");
            generalPeriod.textContent = "10月〜3月";
        } else {
            currentGeneralTable = "4-9";
            generalTable10To3.classList.add("hidden");
            generalTable4To9.classList.remove("hidden");
            generalPeriod.textContent = "4月〜9月";
        }
    }

    function toggleVacationTables() {
        if (currentVacationTable === "4-9") {
            currentVacationTable = "10-3";
            vacationTable4To9.classList.add("hidden");
            vacationTable10To3.classList.remove("hidden");
            vacationPeriod.textContent = "10月〜3月";
        } else {
            currentVacationTable = "4-9";
            vacationTable10To3.classList.add("hidden");
            vacationTable4To9.classList.remove("hidden");
            vacationPeriod.textContent = "4月〜9月";
        }
    }

    generalPrevButton.addEventListener("click", toggleGeneralTables);
    generalNextButton.addEventListener("click", toggleGeneralTables);

    vacationPrevButton.addEventListener("click", toggleVacationTables);
    vacationNextButton.addEventListener("click", toggleVacationTables);
}

// ローカルストレージからデータを読み込む
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("nurseCounts")) || {};
    Object.entries(storedData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value;
    });
    console.log("データロード完了");
}

// データ保存
function saveData() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    const nurseCounts = {};

    months.forEach(month => {
        nurseCounts[`nurse-count-${month}`] = document.getElementById(`nurse-count-${month}`)?.value || 0;
        nurseCounts[`retire-count-${month}`] = document.getElementById(`retire-count-${month}`)?.value || 0;
        nurseCounts[`maternity-count-${month}`] = document.getElementById(`maternity-count-${month}`)?.value || 0;
        nurseCounts[`weekday-${month}`] = document.getElementById(`weekday-${month}`)?.value || 0;
        nurseCounts[`holiday-${month}`] = document.getElementById(`holiday-${month}`)?.value || 0;
    });

    localStorage.setItem("nurseCounts", JSON.stringify(nurseCounts));
    console.log("データ保存完了");
}

// イベントリスナーを追加
function addEventListeners() {
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses();
            calculateCalendarDays();
            calculateMonthlySums();
            calculateRequiredDays();
            saveData();
        });
    });
    console.log("イベントリスナー追加完了");
}
