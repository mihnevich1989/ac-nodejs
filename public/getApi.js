let txt = document.querySelector('.txt'),
    apiSubmit = document.querySelector('.apiSubmit'),
    progress = document.createElement('div'),
    indeterminate = document.createElement('div'),
    apiData = [],
    actionsData,
    parseApiData = [],
    testsApiData = [];

progress.classList.add('progress');
indeterminate.classList.add('indeterminate');
progress.appendChild(indeterminate)
const apiInput = document.querySelector('#api')
progress.style.cssText = `
                display: block;
                width: 89%;
                position: absolute;
                left: 10%;
                top: 27%;
            `;
async function getDataFetch(url) {
    let res = await fetch(url);
    if (!res.ok) {
        txt.style.boxShadow = `inset 0 0 0 1px red;`;
        txt.style.cssText = `
                                box-shadow: inset 0 0 0 2px red;
                                outline: none;
                            `;
        throw new Error("Ошибка получения данных, статус = " + res.status);
    }
    txt.insertAdjacentElement('afterend', progress);
    return await res.json();
}
if (txt) {
    txt.addEventListener('input', () => {
        getDataFetch(`https://www.postman.com/collections/${txt.value}`)
            .then(data => {
                progress.remove()
                txt.style.boxShadow = 'inherit';
                txt.setAttribute('disabled', 'disabled')
                M.toast({ html: '<span class="teal-text darken-1">API загружены!</span>' })
                txt.value = data.info.name;
                apiSubmit.removeAttribute('disabled')
                return data;
            }).then(data => {
                let getApiValue = objJson => {
                    let getProp = ob => {
                        for (let prop in ob) {
                            if (typeof (ob[prop]) === 'object') {
                                getProp(ob[prop]);
                            } else if (prop === 'raw') {
                                apiData.push(ob[prop]);
                            }
                        }
                    };
                    getProp(objJson);
                };
                getApiValue(data.item);
                return apiData;
            }).then(apiData => {
                apiData.forEach(item => {
                    if (item.indexOf('http') != 0) {
                        parseApiData.push(item);
                    }
                });
                parseApiData.forEach(obj => {
                    testsApiData.push(JSON.parse(obj).action);
                });
                return testsApiData;
            }).then(async testsApiData => {
                apiInput.textContent = await testsApiData;
            })
    })
}


