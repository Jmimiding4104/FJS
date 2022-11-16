const apiPath = 'daikai4104';
const deskApi = 'https://livejs-api.hexschool.io/api/livejs/v1/admin';
const deskOrderApi = `${deskApi}/${apiPath}/orders`
const apiKey = 'Uuk24RfqaNSLnB49k7BjcBlSSnq1';

//渲染

let orderPageTable = document.querySelector(".orderPage-table");

function renderDeskHtml(data) {
    let DeskDataHtmlTitle = '';
    let DeskDataHtml = '';

    data.forEach((i) => {
        let orderItem = '';
        i.products.forEach((j) =>
            orderItem += `<p>${j.title}</p>`)
        DeskDataHtml += `        
        <tr>
                    <td>${i.createdAt}</td>
                    <td>
                        <p>${i.user.name}</p>
                        <p>${i.user.tel}</p>
                    </td>
                    <td>${i.user.address}</td>
                    <td>${i.user.email}</td>
                    <td>
                        <p>${orderItem}</p>
                    </td>
                    <td>2021/03/08</td>
                    <td class="orderStatus">
                        <a href="#" class="turn-btn" data-id="${i.id}">${i.paid ? '已付款' : '未付款'}</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" data-id="${i.id}" value="刪除">
                    </td>
                </tr>
        `
    })

    DeskDataHtmlTitle = `
    <thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>聯絡人</th>
                        <th>聯絡地址</th>
                        <th>電子郵件</th>
                        <th>訂單品項</th>
                        <th>訂單日期</th>
                        <th>訂單狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>
    `

    orderPageTable.innerHTML = DeskDataHtmlTitle + DeskDataHtml;
}

//取得訂單資料

let orderData = [];

function getOrder() {
    axios.get(deskOrderApi, {
        headers: {
            'authorization': apiKey
        }
    })
        .then((res) => {
            orderData = res.data.orders;
            renderDeskHtml(orderData);
            c3Function();
        })
}

//更改訂單狀態

function editOrder(id) {
    let data = {
        id,
        "paid": ''
    }

    let orderStatus = '';

    let order = orderData.filter(item => item.id == id);
    order.forEach(i => orderStatus = i)
    if (orderStatus.paid == true) {
        data.paid = false;
    } else {
        data.paid = true;
    }
    axios.put(deskOrderApi,
        {
            data
        },
        {
            headers: {
                'authorization': apiKey
            }
        }
    ).then(() => getOrder())

}

orderPageTable.addEventListener('click', function (e) {
    e.preventDefault();
    let dom = e.target.getAttribute('class');

    if (dom === 'turn-btn') {
        let id = e.target.getAttribute('data-id');
        editOrder(id);
    } else if (dom === 'delSingleOrder-Btn') {
        let id = e.target.getAttribute('data-id');
        delOrder(id);
    }

})

//c3

function c3Function() {
    let totalProducts = {};
    orderData.forEach((i) => {
        i.products.forEach((j) => {
            if (totalProducts[j.title] == undefined) {
                totalProducts[j.title] = 1;
            } else {
                totalProducts[j.title]++
            }
        })
    })
    let products = Object.keys(totalProducts);
    let newData = [];
    products.forEach((i) => {
        let arr = [];
        arr.push(i)
        arr.push(totalProducts[i])
        newData.push(arr)
    })
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
            colors: {
                "Louvre 雙人床架": "#DACBFF",
                "Antony 雙人床架": "#9D7FEA",
                "Anty 雙人床架": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
};

//移除訂單

let discardAllBtn = document.querySelector(".discardAllBtn");

function delOrders() {
    axios.delete(deskOrderApi,
        {
            headers: {
                'authorization': apiKey
            }
        }
    ).then(() => alert('已刪除所有訂單'), getOrder())
        .catch(() => alert('刪除失敗'))
}

function delOrder(id) {
    axios.delete(`${deskOrderApi}/${id}`,
        {
            headers: {
                'authorization': apiKey
            }
        }
    ).then(() => alert('已刪除該訂單'),
        setTimeout(() => {
            getOrder(), '500'
        }))
        .catch(() => alert('刪除失敗'))
}

discardAllBtn.addEventListener('click', function (e) {
    e.preventDefault();
    delOrders();
})

getOrder()
