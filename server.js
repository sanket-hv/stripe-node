const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var Publishable_Key = 'your publishavble key'
var Secret_Key = 'your secret key'

const stripe = require('stripe')(Secret_Key, { apiVersion: '' });

app.set('view engine', 'pug')
app.set('views', __dirname + '/views');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
    res.render('paymentPage');
})

app.post('/payment', async (req, res) => {
    var obj = {
        'amount': req.body.amount,
        'currency': req.body.currency
    }
    res.render('index', { obj })
})

app.get('/paysuccess', (req, res) => {
    res.render('paysuccess')
})

app.post('/v1', async (req, res) => {

    //For Creating a product
    const product = await stripe.products.create({
        name: 'Bbbc',
    }, (err, product) => {
        if (err) {
            console.log(err);
        }
        else {
            var prod_id = product.id;
            console.log(product.id);
            res.end();
        }
    });

    //for Genereating a price for the product
    // const price = await stripe.prices.create({
    //     product: {{PRODUCT_ID}}, //Pass the product id here
    //     unit_amount: 200058,
    //     currency: 'usd',
    // },(err,price)=>{
    //     console.log(price);
    // });
})


//Creating a Charge
app.post('/charge', (req, res) => {
    var token = req.body.stripeToken;
    var chargeAmount = req.body.chargeAmount;
    var currency = req.body.currency;

    console.log(token);
    var charge = stripe.charges.create({
        amount: chargeAmount,
        currency: currency,
        source: token
    }, (err, charge) => {
        if (err === "StripeCardError") {
            console.log("Your card was declined");
        }
    })
    console.log("Your payment was successful");
    res.redirect('/paysuccess');
})


app.listen(3000, () => {
    console.log("Server is running on https://localhost:3000/ ");
})