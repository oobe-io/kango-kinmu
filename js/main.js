// DOMの読み込み完了後の処理
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("nurse-count-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // 各月の看護師数を取得
        const nurseCounts = {
            jan: document.getElementById("nurse-count-jan").value,
            feb: document.getElementById("nurse-count-feb").value,
            mar: document.getElementById("nurse-count-mar").value,
            apr: document.getElementById("nurse-count-apr").value,
            may: document.getElementById("nurse-count-may").value,
            jun: document.getElementById("nurse-count-jun").value,
            jul: document.getElementById("nurse-count-jul").value,
            aug: document.getElementById("nurse-count-aug").value,
            sep: document.getElementById("nurse-count-sep").value,
            oct: document.getElementById("nurse-count-oct").value,
            nov: document.getElementById("nurse-count-nov").value,
            dec: document.getElementById("nurse-count-dec").value
        };

        // ローカルストレージに保存（簡易保存方法）
        localStorage.setItem("nurseCounts", JSON.stringify(nurseCounts));
        alert("予定看護師総数が保存されました。");
    });
});
