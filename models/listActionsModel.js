const fs = require('fs');
const path = require('path');

class ListActions {

    static async checkCover(api, db, noCoverBase) {
        const allApiPostman = await ListActions.getAllActions(api)
        const allApiBase = await ListActions.getAllActions(db)
        const allApiBaseActions = allApiBase.map(obj => obj.action)
        const testNonCoverage = allApiBaseActions.filter(n => allApiPostman.indexOf(n) === -1);
        const testNonCoverDescribe = [];
        allApiBase.forEach((item) => {
            for (let val in item) {
                for (let action of testNonCoverage) {
                    if (item[val] === action) {
                        testNonCoverDescribe.push(item);
                    }
                }
            }
        });
        fs.writeFile(path.join(__dirname, '..', 'data', `${noCoverBase}.json`), JSON.stringify(testNonCoverDescribe), err => {
            if (err) throw err
        })
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', `${noCoverBase}.json`), 'utf-8', (err, content) => {
                if (err) { reject(`При чтении всех ${noCoverBase} ошибка: ${err}`) }
                resolve(JSON.parse(content))
            })
        })
    }

    static getDate() {
        const date = new Date();
        const dateNow = (date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate();
        const monthNow = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        const yearNow = date.getFullYear();
        const hoursNow = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const minutesNow = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const curentDate = `${dateNow}.${monthNow}.${yearNow} (${hoursNow}:${minutesNow})`
        return curentDate;
    }

    static async update(nameOldBase, nameNewBase) {
        const allActions = await ListActions.getAllActions(nameOldBase)
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', `${nameNewBase}.json`), JSON.stringify(allActions), err => {
                if (err) reject(err)
                resolve(allActions)
            })
        })
    }

    static async remove(id, name) {
        let allActions = await ListActions.getAllActions(name)
        allActions = allActions.filter(c => c.id !== id)
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', `${name}.json`), JSON.stringify(allActions), err => {
                if (err) reject(err)
                resolve(allActions)
            })
        })
    }
    static async removeEditList(collection, id, lid) {
        const actions = await ListActions.getAllActions(collection),
            idx = actions.findIndex(c => c.list_id === id);
        actions[idx].actions = actions[idx].actions.filter(c => c.id !== lid)
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', `${collection}.json`), JSON.stringify(actions), err => {
                if (err) reject(err)
                resolve(actions[idx].actions)
            })
        })
    }
    static getAllActions(name) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', `${name}.json`), 'utf-8', (err, content) => {
                if (err) { reject(`При чтении всех ${name} ошибка: ${err}`) }
                resolve(JSON.parse(content))
            })
        })

    }


}

module.exports = ListActions;