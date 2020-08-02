let txt = document.querySelector('.txt'),
    apiSubmit = document.querySelector('.apiSubmit'),
    progress = document.createElement('div'),
    indeterminate = document.createElement('div'),
    apiData = [],
    actionsData,
    parseApiData = [],
    testsApiData = [],
    loc = document.location.pathname.slice(1, 4).toUpperCase();

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
    if (loc === 'MZK' || loc === "LIT") {
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
    } else if (loc === 'MES') {
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
                    const postman = data.item;
                    const apiArr = [];
                    const apiRequest = [];
                    const urlApi = [];
                    const urlApi2 = [];
                    const postmanApiFinalUrl = [];

                    let getApiValue = (objJson) => {
                        let getProp = (ob) => {
                            for (let prop in ob) {
                                if (typeof ob[prop] === "object") {
                                    getProp(ob[prop]);
                                    apiArr.push(ob[prop]);
                                }
                            }
                        };
                        getProp(objJson);
                    };
                    getApiValue(postman);

                    let getApiValue2 = (objJson) => {
                        let getProp = (ob) => {
                            for (let prop in ob) {
                                if (typeof ob[prop] === "object") {
                                    for (let p in ob[prop]) {
                                        if (typeof ob[prop][p] === "object" && p === "request") {
                                            apiRequest.push(ob[prop][p]);
                                        }
                                    }
                                }
                            }
                        };

                        getProp(objJson);
                    };
                    getApiValue2(apiArr);

                    apiRequest.forEach((elem) => {
                        if (typeof elem.url === "object") {
                            urlApi.push({ method: elem.method, url: elem.url.raw });
                        } else {
                            urlApi.push({ method: elem.method, url: elem.url });
                        }
                    });
                    urlApi.forEach((elem, i) => {
                        if (elem.url === "") {
                            urlApi.splice(i, 1);
                        }
                    });
                    urlApi.forEach((elem) => {
                        return urlApi2.push(`${elem.method}:${elem.url.slice(25)}`);
                    });
                    urlApi2.forEach((elem) => {
                        if (elem.indexOf("?") !== -1) {
                            postmanApiFinalUrl.push(elem.slice(0, elem.indexOf("?")));
                        } else {
                            postmanApiFinalUrl.push(elem);
                        }
                    });
                    return postmanApiFinalUrl

                }).then(async postmanApiFinalUrl => {
                    apiInput.textContent = await postmanApiFinalUrl;
                })
        })
    }

}


