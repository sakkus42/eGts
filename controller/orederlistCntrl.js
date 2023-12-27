const OrderList = require('../model/OrderList');
const Product = require('../model/Product');
const User = require('../model/User');
const transporter = require('../middleWare/mail');

//  productData
//   {
//     id: '104',
//     image: '/images/product/1701512048723-258168110.png',
//     title: 'watch 8 plus',
//     color: 'uzay grisi',
//     giftContent: '2 adet kordon hediye',
//     options: [ '' ],
//     prices: [ 0 ],
//     slug: 'watch-8-plus',
//     newId: 'idc4cf0ff428ab3',
//     price: 1045,
//     oldPrice: 1136,
//     index: 0,
//     count: 1
//   }


const creatOrder = async (req, res, next) => {
    const basket = req.session.basket;
    if (basket.length == 0){
        res.redirect("/");
        return;
    }

    const totalPrice = basket.reduce((total, item) => {
        return total + (item.price * item.count);
    }, 0);

    const totalOp = basket.reduce((total, item) => {
        return total + item.prices.reduce((total, item) => { return total + item }, 0) * item.count;
    }, 0);

    let userId = 0;
    if (res.locals.isLog){ userId = res.locals.user.id; }

    const body = {
        productData: basket,
        totalPrice: totalPrice + totalOp,
        userId: userId,
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
        sirname: req.body.sirname,
        address: req.body.address.join(' '),
        note: req.body.note,
    }
    for (let index = 0; index < basket.length; index++){
        console.log("leng")
        console.log(basket.length)
        const [prdct] = await Product.findById(basket[index].id);
        if (prdct.length == 0){
            res.redirect('/');
            return;
        }
        prdct.some(el => 
        {Product.update(el.id, 
        { quantity: el.quantity - (1 * basket[index].count)}
        ) });
    }
    const orderlist = new OrderList(body);
    orderlist.save();
    req.session.basket = []; 
    orderSendMail(req, res);
    return;
};

const orderSendMail = async (req, res) => {
    res.render('pay-mail', {
        contentTitle: 'Siparişiniz Alınmıştır',
        content: 'Siparişiniz alınmıştır kargoya verildiği zaman takip numaranız tarafınıza iletilecektir bizi tercih ettiğiniz için teşekkür ederiz.'}, 
        function(err, html){ 
        if (err) {
            console.log('error rendering email template:', err) 
            return
        } else {
            var mailOptions = {
                from: process.env.MAIL,
                to : req.body.email,
                subject: 'Siparişiniz Alınmıştır',
                generateTextFromHtml : true,
                html: html,
                attachments: [{
                  filename: 'logo.png',
                  path: __dirname + '/../views/images/logo.png',
                  cid: 'logo'
              }],
            };
      
            transporter.sendMail(mailOptions, function(error, response){
                if(error) {
                    console.log(error);
                } else {
                    res.redirect('/odeme-onay');
                }
            });
          } 
    });

    const contentTitle = 'Siparişiniz Var';
    const content = 'Yeni Bir Sipariş Geldi';
        var mailOptions = {
            from: process.env.MAIL,
            to : process.env.MAIL,
            subject: 'Siparişiniz Var',
            generateTextFromHtml : true,
            html: `<!DOCTYPE html>
            <body>
                <div>
                    <div style="
                        display:grid; justify-items: ce;">
                        <!-- <img src="./images/logo.png" alt="logo" style=" -->
                        <img src="cid:logo" alt="logo" style="
                        height: 200px;
                        width: 200px;
                        object-fit: fill;
                        object-position: center center;">
                        <span style="
                        font-size: large;
                        font-weight: 700;
                        text-transform: capitalize;
                        color: rgb(114,115,117);">
                        ${contentTitle}
                        </span>
                        <span style="
                        font-size: large;
                        font-weight: 400;
                        color: rgb(114,115,117);">
                            ${content}
                        </span>
                    </div>    
                </div>
            </body>
            </html>`,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/../views/images/logo.png',
                cid: 'logo'
            }],
        };
    
        transporter.sendMail(mailOptions, function(error, response){
            if(error) {
                console.log(error);
            } else {
                res.redirect('/odeme-onay');
            }
        });

}

const cargoNumberSendMail = async (req, res, email) => {
    res.render('pay-mail', {
        contentTitle: 'Siparişiniz Kargoya Verilmiş',
        content: `Takip numarası ${req.body.cargoNumber} ile yurt içi kargo sitesinden takip edebilirsiniz.`},
        function(err, html){ 
        if (err) {
            console.log('error rendering email template:', err) 
            return
        } else {
            var mailOptions = {
                from: process.env.MAIL,
                to : email,
                subject: 'Kargo Bilgisi',
                generateTextFromHtml : true,
                html: html,
                attachments: [{
                  filename: 'logo.png',
                  path: __dirname + '/../views/images/logo.png',
                  cid: 'logo'
              }],
            };
      
            transporter.sendMail(mailOptions, function(error, response){
                if(error) {
                    console.log(error);
                } else {
                    res.end();
                }
            });
          } 
    });    
}

const updateCloseOrder = async (req, res) => { // mail işlemi burda yapılacak
    const { id, cargoNumber } = req.body;
    const [order] = await OrderList.findById(id);
    if (order.length == 0){
        res.end();
        return;
    }
    OrderList.update(id, {
        cargoNumber: cargoNumber,
        close: 1
    });
    cargoNumberSendMail(req, res, order[0].email);
}

const deleteOrder = async (req, res) => {
    const { id } = req.body;
    const [order] = await OrderList.findById(id);
    if (order.length == 0){
        res.end();
        return;
    }
    OrderList.deleteById(id);
    res.end();
};

async function totalOrder(orders) {
    const ids = orders.map(order => {
        return order.productData.map(prdct => {
            return {
                id: prdct.id,
                count: prdct.count
            };
        });
    })
    .flat();
    const res = {};
    ids.forEach(el => {
        if (res[el.id]) {
            res[el.id] += el.count || 0;
        } else {
            res[el.id] = el.count || 0;
        }
    });
    const array = Object.entries(res).sort((a, b) => b[1] - a[1]);
    let bestProduct = [];
    for (const el of array) {
        const [prdct] = await Product.findById(el[0]);
        if (prdct.length != 0) {
            prdct[0].count = el[1];
            bestProduct.push(prdct[0]);
        }
    }
    return bestProduct;
}

const orderListstatistic = async (req, res) => {

    const [ordersAll] = await OrderList.getAllDeactiveOrder();
    const prdctAll = await totalOrder(ordersAll);

    const [ordersDay] = await OrderList.getTodaySold();
    const prdctDay = await totalOrder(ordersDay);

    const [ordersWeek] = await OrderList.getThisWeekSold();
    const prdctWeek = await totalOrder(ordersWeek)

    const [ordersMonth] = await OrderList.getThisMonthSold();
    const prdctMonth = await totalOrder(ordersMonth)
    
    const [day] = await OrderList.getTurnoverDayOfDay(); 
    const [week] = await OrderList.getTurnoverWeekOfWeek(); 
    
    const [turnoverDay] = await OrderList.getThisDayTurnover();
    const [turnoverWeek] = await OrderList.getThisWeekTurnover();
    const [turnoverMonth] = await OrderList.getAllTurnover();
    const [turnoverGeneral] = await OrderList.getGeneralTurnover();
    const turnover = [
        turnoverDay[0],
        turnoverWeek[0],
        turnoverMonth[0],
        turnoverGeneral[0]
    ]
    console.log(prdctAll)
    const [members] = await User.getAllUser();
    res.render("statistic", {
        turnoverDay:turnoverDay[0].total,
        turnoverWeek:turnoverWeek[0].total,
        turnoverMonth:turnoverMonth[0].total,
        turnoverYear:turnoverGeneral[0].total,
        dayGraph: day,
        weekGraph: week,
        monthGraph: turnoverMonth,
        prdctDay,
        prdctWeek,
        prdctMonth,
        prdctAll,
        members
    });
};

module.exports = {
    creatOrder,
    updateCloseOrder,
    deleteOrder,
    orderListstatistic
}