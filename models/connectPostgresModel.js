const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const promise = require("bluebird");
const initOptions = {
  promiseLib: promise,
};
const pgp = require("pg-promise")(initOptions);

class UpdateDataBase {

  static updateMzk() {
    const mzk = {
      host: "172.25.43.138",
      port: 5432,
      database: "mcm_demo",
      user: "postgres",
      password: "pass",
    };

    const dataBaseMzk = pgp(mzk);
    dataBaseMzk
      .any(
        "SELECT code AS action, display_name AS name, description AS description, module_code FROM core.actions",
        [true]
      )
      .then((data) => {
        data.map((obj) => {
          if (!obj.id) {
            return (obj.id = uuid());
          }
          return obj;
        });
        fs.writeFile(
          path.join(__dirname, "..", "data", "actionsMZK.json"),
          JSON.stringify(data),
          (err) => {
            if (err) {
              throw err;
            }
            console.log("Actions MZK обновлены!");
          }
        );
      })
      .catch((error) => {
        console.log("ERROR:", error);
      })
      .finally(dataBaseMzk.$pool.end);
  }

  static updateLit() {
    const lit = {
      host: "172.20.10.197",
      port: 5432,
      database: "liteyka",
      user: "postgres",
      password: "pass",
    };

    const dataBaseLit = pgp(lit);
    dataBaseLit
      .any(
        "SELECT id AS action, name AS name, description AS description FROM core.actions WHERE id NOT IN ('SYSTEM', 'ROOT', 'LifeCycleLog')",
        [true]
      )
      .then((data) => {
        data.map((obj) => {
          if (!obj.id) {
            return (obj.id = uuid());
          }
          return obj;
        });
        fs.writeFile(
          path.join(__dirname, "..", "data", "actionsL.json"),
          JSON.stringify(data),
          (err) => {
            if (err) {
              throw err;
            }
            console.log("Actions L обновлены!");
          }
        );
      })
      .catch((error) => {
        console.log("ERROR:", error);
      })
      .finally(dataBaseLit.$pool.end);

  }

}


module.exports = UpdateDataBase;