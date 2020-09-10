import setText, {appendText, showWaiting, hideWaiting} from "./results.mjs";

export function get() {
    axios.get('http://localhost:3000/orders/1/')
    .then( ({data}) => {
        setText(JSON.stringify(data));
    });
}

export function getCatch() {
    axios.get('http://localhost:3000/orders/122/')
    .then( ({data}) => { // destructured response
        setText(JSON.stringify(data)); //set text prints result NO AXIOS related
    })
    .catch(error => setText(error));
}

export function chain() {
    axios.get('http://localhost:3000/orders/1/')
    .then(({data}) => {
         return axios.get(
            `http://localhost:3000/addresses/${data.shippingAddress}`
        );
    })
    .then( ({data}) => {
        setText(`City: ${data.city}`)
    })
}

export function chainCatch() {
    axios.get('http://localhost:3000/orders/1/')
    .then(({data}) => {
        axios.get(
            `http://localhost:3000/addresses/${data.shippingAddress}`
        );

        throw new Error("Error shipping address")
    })
    .catch(err => {
        setText(err);
        throw new Error("Error 2")
    })
    .then( ({data}) => {
        setText(`City: ${data.err.city}`)
    })
    .catch(err => setText(`${err}`));
}

export function final() {
    showWaiting();
    axios.get('http://localhost:3000/orders/1/')
    .then(({data}) => {
        return axios.get(
            `http://localhost:3000/addresses/${data.shippingAddress}`
        );
    })
    .then( ({data}) => {
        setText(`City: ${data.city}`)
    })
    .catch(err => setText(`${err}`))
    .finally( () => {
        // timeout used for demo purpouses
        setTimeout( ()=> {
            hideWaiting();
        }, 2000 )
    });
}