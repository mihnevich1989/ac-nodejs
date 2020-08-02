document.addEventListener("DOMContentLoaded", function () {
  const elems1 = document.querySelectorAll(".dropdown-trigger");
  const instances1 = M.Dropdown.init(elems1, {
    alignment: "top",
  });
  const elems2 = document.querySelectorAll(".modal");
  const instances2 = M.Modal.init(elems2);
  const elems3 = document.querySelectorAll(".tooltipped");
  const instances3 = M.Tooltip.init(elems3);
  const reAnalitic = document.querySelector(".reAnalitic");


  const $cardNoCover = document.querySelector("#noCoverList");
  if ($cardNoCover) {
    $cardNoCover.addEventListener("click", (event) => {
      if (event.target.classList.contains("js-remove")) {
        const id = event.target.dataset.id;
        fetch(`${event.view.location.pathname}/remove/${id}`, {
          method: "delete",
        })
          .then((res) => res.json())
          .then((card) => {
            if (card.length) {
              M.toast({
                html: `<span class="red-text ">Action удален!</span>`,
                displayLength: 500,
              });
              const html = card
                .map((c) => {
                  return `
                <tr>
                    <td><b>${c.action}</b></td>
                    <td>${c.name}</td>
                    <td>${c.description}</td>
                    <td><button class="btn btn-small red darken-1 waves-effect waves-light js-remove" data-id=${c.id}><i data-id=${c.id}
                    class="material-icons trash js-remove tooltipped" data-position="right"
                        data-tooltip="Удалить">
                        backspace
                </i></button></td>
                    
                </tr>
                `;
                })
                .join(``);
              $cardNoCover.querySelector("tbody").innerHTML = html;
              localStorage.setItem("sync", "false");
              reAnalitic.setAttribute("disabled", "disabled");
            } else {
              $cardNoCover.innerHTML = "<p>Actions нет</p>";
            }
          });
      }
    });
  }

  const $delList = document.querySelector('.delete-list')
  if ($delList) {
    $delList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-list')) {
        const id = e.target.dataset.id;
        fetch(`${event.view.location.pathname}/delete/${id}`, {
          method: "delete",
        }).then(res => {
          if (res.ok) {
            document.location.assign($delList.dataset.href)
          }
        })
      }
    })
  }

  const backCheck = document.querySelector(".back-check");
  const enterUpdate = document.querySelector(".updateBase");
  const fomrSaveList = document.querySelector("#checkUrl");
  if (backCheck || enterUpdate) {
    backCheck.setAttribute("href", `${document.location.pathname.slice(0, 4)}`);
    enterUpdate.setAttribute("href", `${document.location.pathname}/update`);
  }
  if (fomrSaveList) {
    fomrSaveList.setAttribute("value", `${(document.location.pathname).slice(1, 4).toUpperCase()}`);
  }
  const reloadPage = document.querySelector(".reloadPage");
  if (reloadPage) {
    reloadPage.addEventListener("click", () => {
      localStorage.setItem("sync", "true");
      location.reload();
    });
    if (localStorage.getItem("sync") === "true") {
      reAnalitic.removeAttribute("disabled");
    } else {
      reAnalitic.setAttribute("disabled", "disabled");
    }
  }

  const coverApi = document.querySelector(".coverApi");
  const noCoverApi = document.querySelector(".noCoverApi");
  const editApi = document.querySelector(".editApi");
  if (coverApi || noCoverApi || editApi) {
    //chart
    const ctx = document.getElementById("myChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Задействованные ", "Не задействованные", "В редактированнии"],
        datasets: [
          {
            backgroundColor: ["#43a047", "#fb8c00", "#e53935"],
            data: [
              +coverApi.textContent,
              +noCoverApi.textContent,
              +editApi.textContent,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
    //end chart
  }
  //update base
  const updateBase = document.querySelector(".update-base");
  const updateRow = document.querySelector(".update");
  if (updateBase) {
    updateBase.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains('update-base-actions')) {
        const dataUpdate = target.getAttribute("data-update");
        const dataTitle = target.getAttribute("data-title");
        const progress = document.createElement("div");
        progress.classList.add("progress", "col", "s6", "offset-s3");
        const preload = document.createElement("div");
        preload.classList.add("indeterminate");
        progress.appendChild(preload);
        progress.style.cssText = `
                  display: block;
                  transform: translateY(-16.7rem);
        `;
        updateRow.insertAdjacentElement("beforeend", progress);
        if (dataUpdate === "mzk" || dataUpdate === "lit") {
          fetch(`/update-${dataUpdate}`, {
            method: "GET",
          }).then(async (res) => {
            if (!res.ok) {
              progress.remove();
              M.toast({
                html: `<span class="red-text">Нет соединения с базой данных ${dataTitle}!</span>`,
                displayLength: 1500,
              });
            } else if (res.ok) {
              progress.remove();
              M.toast({
                html: `<span class="green-text">База данных ${dataTitle} обновлена!</span>`,
                displayLength: 1500,
              });
            }
          });
        }
      }
    });
  }
});
