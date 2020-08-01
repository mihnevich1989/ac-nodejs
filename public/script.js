document.addEventListener('DOMContentLoaded', function () {
    const elems1 = document.querySelectorAll('.dropdown-trigger');
    const instances1 = M.Dropdown.init(elems1, {
        alignment: 'top'
    });
    const elems2 = document.querySelectorAll('.modal');
    const instances2 = M.Modal.init(elems2);
    const elems3 = document.querySelectorAll('.tooltipped');
    const instances3 = M.Tooltip.init(elems3);

    const $cardNoCover = document.querySelector('#noCoverList')
    if ($cardNoCover) {
        $cardNoCover.addEventListener('click', event => {
            if (event.target.classList.contains('js-remove')) {
                const id = event.target.dataset.id
                fetch(`${event.view.location.pathname}/remove/${id}`, {
                    method: 'delete'
                }).then(res => res.json()).then(card => {
                    if (card.length) {
                        M.toast({ html: 'Action удален!', displayLength: 500 })
                        const html = card.map(c => {

                            return `
                <tr>
                    <td><strong>${c.action}</strong></td>
                    <td>${c.name}</td>
                    <td>${c.description}</td>
                    <td><button class="btn btn-small red darken-1 waves-effect waves-light js-remove" data-id=${c.id}><i data-id=${c.id}
                    class="material-icons trash js-remove tooltipped" data-position="right"
                        data-tooltip="Удалить">
                    delete_forever
                </i></button></td>
                    
                </tr>
                `
                        }).join(``)
                        $cardNoCover.querySelector('tbody').innerHTML = html
                    } else {
                        $cardNoCover.innerHTML = '<p>Actions нет</p>'
                    }
                })
            }
        })
    }

    const coverApi = document.querySelector('.coverApi')
    const noCoverApi = document.querySelector('.noCoverApi')
    const editApi = document.querySelector('.editApi')
    if (coverApi || noCoverApi || editApi) {
        //chart
        const ctx = document.getElementById('myChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Задействованные ', 'Не задействованные', 'В редактированнии'],
                datasets: [{
                    backgroundColor: [
                        '#43a047',
                        '#fb8c00',
                        '#e53935'
                    ],
                    data: [+coverApi.textContent, +noCoverApi.textContent, +editApi.textContent],
                    borderWidth: 1
                }]
            },
            options: {}
        });
        //end chart
    }
    //update base
    const updateBase = document.querySelector('.update-base')
    if (updateBase) {
        updateBase.addEventListener('click', e => {
            const rarget = e.target;
            const dataUpdate = rarget.getAttribute('data-update');
            if (dataUpdate === 'mzk' || dataUpdate === 'lit') {
                fetch(`/update-${dataUpdate}`, {
                    method: 'GET'
                }).then(res => {
                    if (res) {
                        M.toast({ html: 'База данных обновлена!', displayLength: 1500 })
                    }
                })
            }
        })
    }
});
