async function getDataFetch(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Ошибка получения данных, статус = " + res.status);
  }
  return await res.json();
}
//DATABASE
getDataFetch("./database/actionMES.json")
  .then((data) => {
    const arrDataBase = [];
    data.Controllers.forEach((item) => {
      item.Methods.forEach((method) => {
        arrDataBase.push(
          `${method.Type}:${item.Name.slice(0, -10)}/${method.Name}`
        ); // рабочий вариант в виде строки всего запроса, как элемента массива
        /*  arr.push({
        type: `${method.Type}`,
        name: `${item.Name.slice(0, -10)}`,
        method: `${method.Name}`,
      }); */ // рабочий вариант ввиде массива объектов
      });
    });
    console.log("Database MES ", arrDataBase);
    return arrDataBase;
  })
  .then((arrDataBase) => {
    //Postman
    getDataFetch(
      "https://www.postman.com/collections/3034e1abe947b3035bcb"
    ).then((data) => {
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
      // console.log(urlApi2);
      urlApi2.forEach((elem) => {
        if (elem.indexOf("?") !== -1) {
          postmanApiFinalUrl.push(elem.slice(0, elem.indexOf("?")));
        } else {
          postmanApiFinalUrl.push(elem);
        }
      });
      console.log("Postman API ", postmanApiFinalUrl);

      let urlNonCoverage;
      //filter
      urlNonCoverage = arrDataBase.filter(
        (n) => postmanApiFinalUrl.indexOf(n) === -1
      );
      console.log("Non coverage url ", urlNonCoverage);
    });
  });
