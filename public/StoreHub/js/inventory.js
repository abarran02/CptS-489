function addrow(...args) {
    const table = document.getElementById("productstable")
    const row = table.insertRow()
    args.forEach((arg) => {
        row.insertCell().innerHTML = arg
    })
}

async function getproducts() {
    const res = await fetch('http://localhost:3000/api/product')
    const products = await res.json()
    return products
}

async function populatetable() {
    const products = await getproducts()
    products.forEach((product) =>{
        with(product){
            addrow(ingredientname, price, stock, amount, unit)
        }
    })
}

populatetable().then(console.log("table population completed"))

async function postData(url = "", data = {}) {
    // Default options are marked with *
    console.log(url);
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  function addproduct() {
    const formdata = new FormData(document.forms[0])
    const formobject = Object.fromEntries(formdata)
    console.log(formobject)
    postData('http://localhost:3000/api/product',formobject).then((product)=> {
        console.log(product)
        with(product){
            addrow(itemName, price, stock, amount, unit)
        }
        document.forms[0].reset()
    })
    return false;
  }