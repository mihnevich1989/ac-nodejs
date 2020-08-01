document.addEventListener("DOMContentLoaded", function () {
  const elems1 = document.querySelectorAll(".dropdown-trigger");
  const instances1 = M.Dropdown.init(elems1, {
    alignment: "top",
  });
  const elems2 = document.querySelectorAll(".modal");
  const instances2 = M.Modal.init(elems2);
  const elems3 = document.querySelectorAll(".tooltipped");
  const instances3 = M.Tooltip.init(elems3);
  const reAnalitic = document.querySelector('.reAnalitic');
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
              M.toast({ html: `<span class="red-text ">Action удален!</span>`, displayLength: 500 });
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
                    delete_forever
                </i></button></td>
                    
                </tr>
                `;
                })
                .join(``);
              $cardNoCover.querySelector("tbody").innerHTML = html;
              localStorage.setItem('sync', 'false')
              reAnalitic.setAttribute('disabled', 'disabled')
            } else {
              $cardNoCover.innerHTML = "<p>Actions нет</p>";
            }
          });
      }
    });
  }
  const backCheck = document.querySelector('.back-check');
  const enterUpdate = document.querySelector('.updateBase');
  const fomrSaveList = document.querySelector('#checkUrl')
  if (backCheck || enterUpdate) {
    backCheck.setAttribute('href', `${(document.location.pathname).slice(0, 4)}`);
    enterUpdate.setAttribute('href', `${document.location.pathname}/update`);
  }

  if (document.location.pathname === '/mzk/check-cover') {
    fomrSaveList.setAttribute('value', 'MZK')
  } else if (document.location.pathname === '/lit/check-cover') {
    fomrSaveList.setAttribute('value', 'Lit')
  }
  const reloadPage = document.querySelector('.reloadPage');
  if (reloadPage) {
    reloadPage.addEventListener('click', () => {
      localStorage.setItem('sync', 'true')
      location.reload();
    })
    if (localStorage.getItem('sync') === 'true') {
      reAnalitic.removeAttribute('disabled')
    } else {
      reAnalitic.setAttribute('disabled', 'disabled')
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
  if (updateBase) {
    updateBase.addEventListener("click", (e) => {
      const rarget = e.target;
      const dataUpdate = rarget.getAttribute("data-update");
      const dataTitle = rarget.getAttribute("data-title");
      if (dataUpdate === "mzk" || dataUpdate === "lit") {
        fetch(`/update-${dataUpdate}`, {
          method: "GET",
        }).then((res) => {
          if (!res.ok) {
            M.toast({
              html: `<span class="red-text">Нет соединения с базой данных ${dataTitle}!</span>`,
              displayLength: 1500,
            });
          } else {
            M.toast({
              html: `<span class="green-text">База данных ${dataTitle} обновлена!</span>`,
              displayLength: 1500,
            });
          }
        });
      }
    });
  }
});
