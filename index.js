let productList = [];
let cart = [];
let quantity = 0;
let totalCount = 0;
async function getData() {
  try {
    let { data } = await axios({
      url: "https://6343863c3f83935a7854ae81.mockapi.io/captone",
      method: "GET",
    });

    productList = mapData(data);
    renderData(data);
  } catch (err) {
    console.log(err);
  }
}

window.onload = async function () {
  await getData();

  cart = JSON.parse(localStorage.getItem("SL"));
  document.getElementById("numberitem").innerHTML = sumArray(cart);
  document.getElementById("coutMoney").innerHTML = billItems(cart);

  if (!cart) {
    for (let item of productList) {
      document.getElementById(`${item.id}`).innerHTML = `<button
  onclick="buyNow('${item.id}')" style="margin: 0 0 30px 100px" class="btn btn-success"
> Buy Now
</button>`;
    }
    return;
  }
  for (let item of cart) {
    if (item.quantity >= 1) {
      document.getElementById(
        `${item.products.id}`
      ).innerHTML = `<button style="display: inline ;margin-left: 125px" onclick="Cout(-1,${item.products.id},1)">-</button>
      <span id="value${item.products.id}">${item.quantity}</span
      ><button style="display: inline" onclick="Cout(+1,${item.products.id},1)">+</button>`;
    } else {
      document.getElementById(`${item.products.id}`).innerHTML = `<button
        onclick="buyNow('${item.id}')"
      > Buy Now
      </button>`;
    }
  }
};

// copy lai lop doi tuong de khong bi mat method
function mapData(data) {
  if (!data) data = productList;

  const result = [];
  for (let i = 0; i < data.length; i++) {
    const oldProduct = data[i];
    const newProduct = new Products(
      oldProduct.id,
      oldProduct.name,
      oldProduct.price,
      oldProduct.screen,
      oldProduct.backCamera,
      oldProduct.frontCamera,
      oldProduct.img,
      oldProduct.desc,
      oldProduct.type
    );
    result.push(newProduct);
  }
  return result;
}

// render toan bo du lieu
function renderData(data) {
  let html = "";
  for (let item in data) {
    html += `<div class="col">
    <div class="item">
      <img src=${data[item].img} alt="" />
      <div class="card-body">
      
        <h3><span>${data[item].name}</span> </h3>
        <p>${data[item].desc}</p>
      </div>   
      <div class="item-detail">
      <h4>${data[item].name}</h4>
      <p>Price :$${data[item].price}</p>
      <p>Screen:${data[item].screen}</p>
      <p>BackCamera:${data[item].backCamera}</p>
      <p>FrontCamera:${data[item].frontCamera}</p>
      <p>Type:${data[item].desc}</p>
      <h5>${data[item].type} </h5>
   <div id="${data[item].id}">
      <button id="${data[item].name}"
        onclick="buyNow('${data[item].id}')" style="margin: 0 0 30px 100px" class="btn btn-success"
      >
        Buy Now
      </button>
    </div>
     </div>
    </div>
  </div>`;
  }

  document.getElementById("renderhtml").innerHTML = html;
}

// renderSearch
function searchType() {
  let phoneType = document.getElementById("typePhone").value;
  let results = [];
  if (!phoneType) {
    results = productList;
  } else {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].type === phoneType) {
        results.push(productList[i]);
      }
    }
  }

  renderData(results);
}

const buyNow = function (idButton) {
  if (cart === null) {
    cart = [];
  }
  let flagItem = cart.find((item) => +item.products.id === +idButton);
  if (!flagItem) {
    for (let data of productList) {
      if (+data.id === +idButton) {
        let addItem = new CartItems(
          {
            id: data.id,
            img: data.img,
            name: data.name,
            price: data.price,
            type: data.type,
          },
          1
        );
        cart.push(addItem);
      }
    }
  } else {
    for (let item of cart) {
      if (+item.products.id === +idButton) {
        item.quantity++;
      }
    }
  }
  for (let item of cart) {
    if (+item.products.id === +idButton) {
      document.getElementById(
        `${idButton}`
      ).innerHTML = `<button style="display: inline ;margin-left: 125px" onclick="Cout(-1,${item.products.id},1)">-</button>
    <span id="value${idButton}">${item.quantity}</span
    ><button style="display: inline;" onclick="Cout(+1,${item.products.id},1)">+</button>`;
    }
  }

  document.getElementById("numberitem").innerHTML = sumArray(cart);
  document.getElementById("coutMoney").innerHTML = billItems(cart);
  renderCart();
  console.log("ditmemay");
  document.getElementById("modalrender").style.display = "none";
  saveProductList();
};
function closemodal() {
  document.getElementById("modalrender").style.display = "none";
}
const Cout = function (step, id, status = 0) {
  for (let item of cart) {
    if (+id === +item.products.id) {
      item.quantity = item.quantity + step;
      if (item.quantity >= 1) {
        document.getElementById(`value${id}`).innerHTML = item.quantity;
      } else {
        let findex = cart.findIndex((item) => item.quantity === 0);
        cart.splice(findex, 1);
        document.getElementById(
          `${id}`
        ).innerHTML = `<button style="margin: 0 0 30px 100px" class="btn btn-success"
        onclick="buyNow('${id}')"
      > Buy Now
      </button>`;
      }
    }
  }
  document.getElementById("numberitem").innerHTML = sumArray(cart);
  document.getElementById("coutMoney").innerHTML = billItems(cart);

  renderCart();
  if (status === 1) {
    document.getElementById("modalrender").style.display = "none";
  } else {
    document.getElementById("modalrender").style.display = "block";
  }
  saveProductList();
};
function sumArray(mang) {
  let sum = 0;
  for (let i in mang) {
    sum += mang[i].quantity;
  }
  return sum;
}
function renderCart() {
  document.getElementById("modalrender").style.display = "block";

  document.getElementById("renderCartItems").innerHTML = "";
  for (let item of cart) {
    if (item.quantity > 0) {
      document.getElementById("renderCartItems").innerHTML += ` <div >
      <img
        src="${item.products.img}"
        style="
          height: 80px;
          width: 70px;
          margin-right: 60px;
          margin-left: 40px;
        "
        alt=""
      />
    </div>
    <div>${item.products.name}</div>
    <div>
      <button onclick="Cout(-1,${item.products.id})">
        <i
          class="fa-solid fa-chevron-left"
          style="display: inline"
        ></i></button
      ><span style="padding: 0 2px" id='value${item.products.id}'>${item.quantity}</span>
      <button onclick="Cout(+1,${item.products.id})">
        <i
          class="fa-solid fa-chevron-right"
          style="display: inline"
        ></i>
      </button>
    </div>
    <div>$ ${item.products.price}</div>
    <div>
      <button
        style="display: inline; background-color: gray; border: none"
        onclick="deleteItem(${item.products.id}) "
      >
        <i
          class="fa-solid fa-trash"
          style="padding: 5px; color: white; font-size: 20px"
        ></i>
      </button>
    </div>`;
    }
  }
}
function billItems(cart) {
  let totolMoney = 0;
  if (!cart) return (totolMoney = 0);
  for (let item of cart) {
    totolMoney += +item.quantity * +item.products.price;
  }
  return totolMoney;
}

function deleteItem(id) {
  for (let index in cart) {
    if (id === +cart[index].products.id) {
      cart.splice(index, 1);

      renderCart();
      document.getElementById(
        `${id}`
      ).innerHTML = `<button style="margin: 0 0 30px 100px" class="btn btn-success"
      onclick="buyNow('${id}')"
    > Buy Now
    </button>`;
      document.getElementById("coutMoney").innerHTML = billItems(cart);
      document.getElementById("numberitem").innerHTML = sumArray(cart);
    }
  }
  saveProductList();
}

function ClearItems() {
  cart.length = 0;
  renderCart();
  for (let item of productList) {
    document.getElementById(
      `${item.id}`
    ).innerHTML = `<button style="margin: 0 0 30px 100px" class="btn btn-success"
    onclick="buyNow('${item.id}')"
  > Buy Now
  </button>`;
  }
  document.getElementById("coutMoney").innerHTML = billItems(cart);
  document.getElementById("numberitem").innerHTML = sumArray(cart);
  saveProductList();
}
function saveProductList() {
  // chuyen tu object sang chuoi json
  let productJSon = JSON.stringify(cart);
  // luu vao localStorage
  localStorage.setItem("SL", productJSon);
}
function puchase() {
  let html = "";
  let coutMoney = billItems(cart);
  let totaMoneyhtml = "";
  for (let item of cart) {
    if (item.quantity > 0) {
      totaMoneyhtml = `    <hr /><div>Payment</div>
      <div class="row">
        <div class="col">total amount to be paid:</div>
        <div class="col">
          <div style="margin-left: 9em">$ <span>${coutMoney}</span></div>
        </div>
      </div>`;
      html += `<div class="row">
    <div class='col-6'>
    <span>${item.quantity}</span>  x  <span>${item.products.name}</span>
    </div>
    <div class='col-6'> <div style="margin-left: 9em" ><span>$ </span> ${
      +item.quantity * +item.products.price
    }
    </div> </div>
    </div>`;
    }
  }
  document.getElementById("totalmoney").innerHTML = totaMoneyhtml;
  document.getElementById("puchaseItem").innerHTML = html;
}
function orderItem() {
  let id = Math.floor(Math.random() * 1000);
  document.getElementById("idDonhang").innerHTML = id;
  document.getElementById("totalBillMoneys").innerHTML = billItems(cart);
  cart.length = 0;
  saveProductList();
}
function Okey() {
  document.getElementById("coutMoney").innerHTML = 0;
  document.getElementById("modalrender").style.display = "none";
  renderData();
  document.getElementById("closeButton").click();
  renderData(productList);
  document.getElementById("numberitem").innerHTML = sumArray(cart);
}
