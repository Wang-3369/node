// 控制折疊工具列顯示與隱藏
const toggleMenuBtn = document.getElementById("toggleMenuBtn");
const collapsibleMenu = document.getElementById("collapsibleMenu");

toggleMenuBtn.onclick = function() {
    if (collapsibleMenu.style.display === "block") {
        collapsibleMenu.style.display = "none";
    } else {
        collapsibleMenu.style.display = "block";
    }
}