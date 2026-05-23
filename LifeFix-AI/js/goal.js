  let lfxgGoals = JSON.parse(localStorage.getItem("lfxg_goals")) || [];
      let lfxgXP = parseInt(localStorage.getItem("lfxg_xp")) || 0;
      let lfxgChart;

      /* SAVE */
      function lfxgSave() {
        localStorage.setItem("lfxg_goals", JSON.stringify(lfxgGoals));
        localStorage.setItem("lfxg_xp", lfxgXP);
      }

      /* XP */
      function lfxgUpdateXP(p) {
        lfxgXP += p;
        document.getElementById("lfxg-xp").innerText = lfxgXP;
        document.getElementById("lfxg-level").innerText =
          Math.floor(lfxgXP / 100) + 1;
      }

      /* ADD */
      function lfxgAdd() {
        const name = document.getElementById("lfxg-name").value;
        const date = document.getElementById("lfxg-date").value;
        const cat = document.getElementById("lfxg-cat").value;

        if (!name) return;

        lfxgGoals.push({
          id: Date.now(),
          name,
          date,
          category: cat,
          progress: 0,
        });
        lfxgSave();
        lfxgRender();
      }

      /* AI */
      function lfxgSuggest() {
        const mood = document.getElementById("lfxg-mood").value.toLowerCase();
        let s = "";

        if (mood.includes("sad")) s = "Go for a walk";
        else if (mood.includes("happy")) s = "Start a new project";
        else if (mood.includes("stress")) s = "Meditation 10 min";
        else s = "Read a book";

        document.getElementById("lfxg-name").value = s;
      }

      /* RENDER */
      function lfxgRender() {
        const list = document.getElementById("lfxg-list");
        list.innerHTML = "";

        lfxgGoals.forEach((g) => {
          const d = document.createElement("div");
          d.className = "lfxg-card";

          const days = g.date
            ? Math.ceil((new Date(g.date) - new Date()) / (1000 * 60 * 60 * 24))
            : "No date";

          d.innerHTML = `
    <h3>${g.name}</h3>
    <small>${g.category} | ⏳ ${days} days left</small>

    <div class="lfxg-progress">
      <div class="lfxg-fill" style="width:${g.progress}%"></div>
    </div>

    <div class="lfxg-actions">
      <button class="lfxg-complete" onclick="lfxgProgress(${g.id})">+10%</button>
      <button class="lfxg-delete" onclick="lfxgDelete(${g.id})">Delete</button>
    </div>
    `;

          list.appendChild(d);
          lfxgReminder(g);
        });

        lfxgChartUpdate();
        document.getElementById("lfxg-xp").innerText = lfxgXP;
        document.getElementById("lfxg-level").innerText =
          Math.floor(lfxgXP / 100) + 1;
      }

      /* UPDATE */
      function lfxgProgress(id) {
        lfxgGoals = lfxgGoals.map((g) => {
          if (g.id === id) {
            g.progress = Math.min(g.progress + 10, 100);
            lfxgUpdateXP(10);
          }
          return g;
        });
        lfxgSave();
        lfxgRender();
      }

      function lfxgDelete(id) {
        lfxgGoals = lfxgGoals.filter((g) => g.id !== id);
        lfxgSave();
        lfxgRender();
      }

      /* REMINDER */
      function lfxgReminder(g) {
        if (!("Notification" in window)) return;

        Notification.requestPermission().then((p) => {
          if (p === "granted" && g.date) {
            const today = new Date().toISOString().split("T")[0];
            if (g.date === today) {
              new Notification("Reminder: " + g.name);
            }
          }
        });
      }

      /* CHART */
      function lfxgChartUpdate() {
        const labels = lfxgGoals.map((g) => g.name);
        const data = lfxgGoals.map((g) => g.progress);

        if (lfxgChart) lfxgChart.destroy();

        lfxgChart = new Chart(document.getElementById("lfxg-chart"), {
          type: "line",
          data: {
            labels,
            datasets: [{ label: "Progress %", data, tension: 0.4, fill: true }],
          },
          options: { responsive: true, maintainAspectRatio: false },
        });
      }

      lfxgRender();