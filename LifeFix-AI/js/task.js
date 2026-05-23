 let lftdTasks = JSON.parse(localStorage.getItem("lftd_tasks")) || [];

      /* SAVE */
      function lftdSave() {
        localStorage.setItem("lftd_tasks", JSON.stringify(lftdTasks));
      }

      /* NOTIFY */
      function lftdNotify(msg) {
        if (Notification.permission === "granted") {
          new Notification(msg);
        } else {
          Notification.requestPermission();
        }
      }

      /* ADD */
      function lftdAdd(
        title,
        status = "lftd-todo",
        due = null,
        priority = "low",
      ) {
        if (!title) {
          title = document.getElementById("lftd-input").value;
          due = document.getElementById("lftd-date").value;
          priority = document.getElementById("lftd-priority").value;
        }

        if (title === "") return;

        lftdTasks.push({
          id: Date.now(),
          title,
          status,
          due,
          priority,
        });

        lftdNotify("Task Added 🚀");
        document.getElementById("lftd-input").value = "";
        lftdSave();
        lftdRender();
      }

      /* RENDER */
      function lftdRender() {
        document.querySelectorAll(".lftd-col").forEach((col) => {
          col.innerHTML = `<h3>${col.id.replace("lftd-", "").toUpperCase()}</h3>`;
        });

        lftdTasks.forEach((task) => {
          let div = document.createElement("div");
          div.className = `lftd-task lftd-${task.priority}`;
          div.draggable = true;
          div.id = task.id;

          div.innerHTML = `
      <b>${task.title}</b><br>
      📅 ${task.due || "No date"}
    `;

          div.ondragstart = lftdDrag;
          document.getElementById(task.status).appendChild(div);
        });
      }

      /* DRAG */
      function lftdAllow(e) {
        e.preventDefault();
      }

      function lftdDrag(e) {
        e.dataTransfer.setData("text", e.target.id);
      }

      function lftdDrop(e) {
        e.preventDefault();
        let id = e.dataTransfer.getData("text");

        let t = lftdTasks.find((x) => x.id == id);
        t.status = e.currentTarget.id;

        lftdNotify("Task moved ✅");
        lftdSave();
        lftdRender();
      }

      /* AI */
      function lftdAI() {
        let arr = [
          "Learn React",
          "Workout",
          "Read book",
          "Build startup",
          "Practice coding",
        ];
        lftdAdd(arr[Math.floor(Math.random() * arr.length)]);
      }

      /* INIT */
      lftdRender();