const apiPath = 'daikai4104';
const api = 'https://livejs-api.hexschool.io/api/livejs/v1/customer';
const apiCustomer = `${api}/${apiPath}/products`;
const apiCart = `${api}/${apiPath}/carts`;
const apiorders = `${api}/${apiPath}/orders`;

let productsData = [];
let productWrap = document.querySelector(".productWrap");

//渲染
function renderHtml(data) {
    let productsDataHtml = '';
    data.forEach((i) => {
        productsDataHtml += `
        <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${i.images}"
            alt="">
        <a href="#" class="addCardBtn" data-id="${i.id}">加入購物車</a>
        <h3>${i.title}</h3>
        <del class="originPrice">NT$${i.origin_price}</del>
        <p class="nowPrice">NT$${i.price}</p>
    </li>
        `
    })

    productWrap.innerHTML = productsDataHtml;
}

let shoppingCartTable = document.querySelector(".shoppingCart-table");

function renderCartsHtml(data) {
    let cartsDataHtmlTitle = '';
    let cartsDataHtmlDel = '';
    let cartsDataHtml = '';

    data.carts.forEach((i) => {
        cartsDataHtml += `        
        <tr>
        <td>
            <div class="cardItem-title">
                <img src="${i.product.images}" alt="">
                <p>${i.product.title}</p>
            </div>
        </td>
        <td>NT$${i.product.price}</td>
        <td>${i.quantity}</td>
        <td>NT$${i.product.price * i.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons delCartItem" data-id="${i.id}">
                clear
            </a>
        </td>
        </tr>
        `
    })

    cartsDataHtmlTitle = `
    <tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
    </tr>
    `

    cartsDataHtmlDel = `
    <tr>
                    <td>
                        <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>總金額</p>
                    </td>
                    <td>NT$${data.finalTotal}</td>
                </tr>
    `
    shoppingCartTable.innerHTML = cartsDataHtmlTitle + cartsDataHtml + cartsDataHtmlDel;
}

//取得產品資料
function getCustomerData() {
    axios.get(apiCustomer)
        .then((res) => {
            productsData = res.data.products;
            renderHtml(productsData);
        })
        .catch((err) => {
            console.log(err)
        })
}

//選單重新渲染
let productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", searchChange);

function searchChange() {

    const searchChangeFunction =
        productsData
            .filter(function (i) {
                if (productSelect.value === i.category) {
                    return i;
                } else if (productSelect.value === "全部") {
                    return i;
                }
            });
    renderHtml(searchChangeFunction);
}

//新增購物車

function addToCart(id, qty = 1) {
    let data = {
        'productId': id,
        'quantity': qty
    }
    axios.post(apiCart, { data })
        .then(() =>
            getCart(),
            alert('購物車新增成功'))
}

productWrap.addEventListener('click', function (e) {
    e.preventDefault();
    let dom = e.target.getAttribute('class');
    if (dom !== 'addCardBtn') {
        return
    }
    let id = e.target.getAttribute('data-id');
    addToCart(id)
})

//呈現購物車列表、總金額

function getCart() {
    let cartsData = [];
    axios.get(apiCart)
        .then((res) => {
            cartsData = res.data;
            renderCartsHtml(cartsData);
        })
        .catch((err) => {
            console.log(err)
        });
}

//刪除購物車

shoppingCartTable.addEventListener('click', function (e) {
    e.preventDefault();
    let dom = e.target.getAttribute('class');
    if (dom === 'material-icons delCartItem') {
        let id = e.target.getAttribute('data-id');
        delCartItem(id)
    } else if (dom === 'discardAllBtn') {
        delCarts()
    }

})

function delCartItem(id) {
    axios.delete(`${apiCart}/${id}`)
        .then(() => {
            alert('已經刪除產品')
            getCart()
        })
        .catch(() => {
            alert('刪除失敗')
        })
}

function delCarts() {
    axios.delete(`${apiCart}`)
        .then(() => {
            alert('已經刪除所有產品')
            getCart()
        })
        .catch(() => {
            alert('刪除失敗')
        })
}

//標單取值

let orderData = {};

function putOrder() {
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerAddress = document.getElementById("customerAddress").value;
    const tradeWay = document.getElementById("tradeWay").value;

    orderData = {
        "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": tradeWay
        }
    };
}

//驗證

var constraints = {
    "姓名": {
        presence: {
            message: '必填!!'
        }
    },
    "電話": {
        presence: {
            message: '必填!!'
        },
    },
    "Email": {
        presence: {
            message: '必填!!'
        },

    },
    "寄送地址": {
        presence: {
            message: '必填!!'
        },
    },
};

const inputs = document.querySelectorAll("input[type=text],input[type=number],input[type=email],input[type=tel]");

let orderInfoForm = document.querySelector(".orderInfo-form");
let orderInfoBtn = document.querySelector(".orderInfo-btn");

console.log(orderInfoForm)

function validateForm(orderInfoForm) {
    let errors = validate(orderInfoForm, constraints);
    inputs.forEach((i) => {
        i.addEventListener("change", function () {
            i.nextElementSibling.textContent = "";
            console.log(errors)
        })
    })
    if (errors) {
        Object.keys(errors).forEach(function (keys) {
            document.querySelector(`.${keys}`).textContent = errors[keys]
        })
    } else {
        putOrder();
        submitOrder();
    }
}

/*inputs.forEach((i) => {
    i.addEventListener("change", function () {
        i.nextElementSibling.textContent = "";
        let errors = validate(orderInfoForm, constraints);
        if (errors) {
            Object.keys(errors).forEach(function (keys) {
                console.log(errors)
                console.log(keys)
                console.log(orderInfoForm.target.getAttribute('data-messag'))
                document.querySelector(`.${keys}`).textContent = errors[keys]
            })
        }
    })
})*/

//e.target.getAttribute('data-id');

//提交

orderInfoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    validateForm(orderInfoForm)
})

function submitOrder() {
    let data = orderData
    axios.post(apiorders, { data })
        .then(() => {
            alert('成功提交訂單')
            orderInfoForm.reset();
            getCart();
        })
        .catch(() => {
            alert('提交訂單失敗')
        })
}

//初始

function init() {
    getCustomerData();
    getCart();
}

init();

