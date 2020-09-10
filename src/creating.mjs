import setText, { appendText } from "./results.mjs";

export function timeout(){
    const wait = new Promise( (resolve) => {
        setTimeout(() => {
            resolve("timeout");
        }, 1000)
    })

    wait.then(text => setText(text))
}

export function interval(){
    let count = 0;

    const wait = new Promise( (resolve) => {
        setInterval(() => {
            console.log('interval');
            resolve(`counting with setInterval ${++count}`);
        }, 1000)
    })

    wait.then(text => setText(text))
        .finally( () => appendText(` -- Done ${count}`))
}

export function clearIntervalChain(){
    let count = 0;
    let interval;

    const wait = new Promise( (resolve) => {
        interval = setInterval(() => {
            console.log('interval');
            resolve(`counting with setInterval ${++count}`);
        }, 1000)
    })

    wait.then(text => setText(text))
        .finally( () => clearInterval(interval))
}

export function xhr(){
    let request = new Promise( (resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/7");
        xhr.onload = () => {
            if(xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText)
            }
            
        }
        xhr.onerror = () => reject('your request failed')
        xhr.send();
    })

    request.then(result => setText(result))
        .catch(reason => setText(reason))
}

export function allPromises(){
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let addressTypes = axios.get('http://localhost:3000/addressTypes');

    // .all will complete once all are fulfilled or ONE is rejected
    Promise.all([categories, statuses, userTypes, addressTypes])
    .then(([categories, statuses, userTypes, addressTypes]) => {
        setText("");
        appendText(JSON.stringify(categories.data));
        appendText(JSON.stringify(statuses.data));
        appendText(JSON.stringify(userTypes.data));
        appendText(JSON.stringify(addressTypes.data));
    }).catch(
        reasons => {
            setText(reasons)
        }
    )
}

export function allSettled(){
    let categories = axios.get('http://localhost:3000/itemCategories');
    let statuses = axios.get('http://localhost:3000/orderStatuses');
    let userTypes = axios.get('http://localhost:3000/userTypes');
    let addressTypes = axios.get('http://localhost:3000/addressTypes');

    // .all will complete once all are fulfilled or ONE is rejected
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
    .then((values) => {
        let results = values.map( response => {
            if( response.status === 'fulfilled') {
                return `Fulfilled ${JSON.stringify(response.value.data[0])}`
            }
            
            return `REJECTED: ${JSON.stringify(response.reason.message)}`
        })

        setText(results);
    }).catch(
        reasons => {
            setText(reasons)
        }
    )
}

export function race(){
    let usersMain = axios.get('http://localhost:3000/users');
    let usersBackup = axios.get('http://localhost:3000/users');

    Promise.race([usersMain,usersBackup])
        .then(firstToRespond => setText(JSON.stringify(firstToRespond)))
        .catch(reason => setText(JSON.stringify(reason)))
}