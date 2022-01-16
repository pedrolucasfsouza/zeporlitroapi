const { rejects } = require('assert')
const axios = require('axios')
const fs = require ('fs')
const fsPromises = fs.promises;
const cheerio = require('cheerio')
const { resolve } = require('path')
const db = require("./db")

const mongodb=require('mongodb').MongoClient
const url = "mongodb://159.223.169.216:27017/"




const BASE_URL = 'https://www.ze.delivery/produtos/marca/'

const browserHeaders = {
accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
'accept-encoding': 'gzip, deflate, br',
'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
'cache-control': 'max-age=0',
cookie: 
'visitorId=%222263d139-e67f-4a85-8fad-741d33e2ab90%22; ageGateAccepted=true; OptanonAlertBoxClosed=2021-12-29T23:50:53.066Z; _gcl_au=1.1.436800644.1640821856; _ga=GA1.2.1272893600.1640821856; _gid=GA1.2.1811488761.1640821856; _fbp=fb.1.1640821856556.1819410550; _hjFirstSeen=1; _hjSession_1675056=eyJpZCI6IjUzZDA4OWU2LTI1MWEtNGU0Yy1hM2QyLTYwOTYzNWQwNDIzZSIsImNyZWF0ZWQiOjE2NDA4MjE4NTY3NDR9; _hjIncludedInSessionSample=0; _hjAbsoluteSessionInProgress=0; afUserId=95fea40c-e525-4b7f-8798-080c97aa3a1a-p; AF_SYNC=1640821858598; userAddress=%7B%22latitude%22%3A-22.9735234%2C%22longitude%22%3A-43.19129359999999%2C%22zipcode%22%3A%2222051-002%22%2C%22street%22%3A%22Rua%20Barata%20Ribeiro%22%2C%22neighborhood%22%3A%22Copacabana%22%2C%22city%22%3A%22Rio%20de%20Janeiro%22%2C%22province%22%3A%22RJ%22%2C%22country%22%3A%22BR%22%2C%22number%22%3A%22672%22%2C%22addressLine2%22%3A%2254%22%2C%22referencePoint%22%3A%22%22%2C%22type%22%3A%7B%22displayName%22%3A%22%22%2C%22id%22%3A%22HISTORIC%22%7D%7D; deliveryOptions=%7B%22address%22%3A%7B%22latitude%22%3A-22.9735234%2C%22longitude%22%3A-43.19129359999999%2C%22zipcode%22%3A%2222051-002%22%2C%22country%22%3A%22BR%22%2C%22province%22%3A%22RJ%22%2C%22city%22%3A%22Rio%20de%20Janeiro%22%2C%22neighborhood%22%3A%22Copacabana%22%2C%22street%22%3A%22Rua%20Barata%20Ribeiro%22%2C%22number%22%3A%22672%22%2C%22addressLine2%22%3A%2254%22%2C%22referencePoint%22%3A%22%22%7D%2C%22deliveryMethod%22%3A%22DELIVERY%22%2C%22schedule%22%3A%22NOW%22%2C%22scheduleDateTime%22%3Anull%2C%22pickupPoc%22%3Anull%7D; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Dec+29+2021+20%3A55%3A59+GMT-0300+(Brasilia+Standard+Time)&version=6.24.0&isIABGlobal=false&hosts=&consentId=9291466e-d22b-4ae6-b81f-d406529e2c40&interactionCount=1&landingPath=NotLandingPage&groups=1%3A1%2C2%3A1%2C4%3A1&geolocation=BR%3BES&AwaitingReconsent=false; _gat_UA-153849477-1=1; _hjSessionUser_1675056=eyJpZCI6ImZhYzUyNWM5LTI0NTMtNWVkZi1hY2I1LTM1ZjI4NWJmNjgyOSIsImNyZWF0ZWQiOjE2NDA4MjE4NTY2NTgsImV4aXN0aW5nIjp0cnVlfQ==',
'if-none-match': 'W/"713c-vd+DFsdc3nc/ZaLkuN7avts3o4Y"',
referer: 'https://www.ze.delivery/produtos/marca/skol',
'sec-ch-ua': '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
'sec-ch-ua-mobile': '?1',
'sec-ch-ua-platform': '"Android"',
'sec-fetch-dest': 'document',
'sec-fetch-mode': 'navigate',
'sec-fetch-site': 'same-origin',
'sec-fetch-user': '?1',
'upgrade-insecure-requests': '1',
'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36'
}

const writeToFile = (data, filename, path) => {
    const promiseCallBack = (resolve, reject) =>{
    fs.writeFile(path, data, (error) => {
        if (error) {
            rejects(error)
            return
        }
        resolve(true)
    })
}
    return new Promise(promiseCallBack)
}

const getPage = (path) => {
    const url = `${BASE_URL}${path}`

    const options = {
        headers: browserHeaders,
    }

    return axios.get(url, options).then((response) => response.data)
}

const readFromFile = (filename) => {
    const promiseCallBack = (resolve) =>{
        fs.readFile(filename, 'utf-8', (error, contents) => {
            if(error) {
                console.log('getfromFile', error)
                resolve(null)
            }
            resolve(contents)
        })
    }
    return new Promise(promiseCallBack)}

const getCachedPage = (path) => {

    const filename = path

    const promiseCallBack = async (resolve, reject) => {
        // const cachedHTML = await readFromFile(filename)
       // if (!cachedHTML) {
            console.log('buscando no site!')
            const html = await getPage(path)
            //await writeToFile(html, filename, path)
            resolve(html)
            return 
       // }
       // console.log('***Dados cacheados')
        //resolve(cachedHTML)
    }
    return new Promise(promiseCallBack)
}

const removeCachedItems = (filename) =>{
    try {
        fs.unlinkSync(filename)
      } catch(err) {
        console.error(err)  }
}

  const checkHaveCache = (filename) => {
    const promiseCallBack = (resolve) =>{
        fs.access(filename, fs.constants.R_OK, (err) => {
            if(err) {
                resolve(false)
            }
            resolve(true)
        })
    }
    return new Promise(promiseCallBack)}


async function listToRemove(){
    
    for (let i = 0; i < marcas.length; i++){
        const haveItem = await checkHaveCache(marcas[i])
        if(haveItem === true){
            console.log(marcas[i], 'removido')
            removeCachedItems(marcas[i])}
    }
}


//essa função obtem o html da pagina e transforma titulo e preco em uma array
const getPageItems = (html) => {
    const $ = cheerio.load(html)

    const promiseCallBack = (resolve, reject) => {

        const selectorCards = '#__next > div > div.css-0 > div > div > div > '

        const products = []
        $(selectorCards).each((i, element) => {
            const title = $('#product-card > div.css-1q4ix2j-productDetails > h3', element)
            const titleText = title.text()

            const price = $('#product-card-price > div.css-t89dhz-priceText', element)
            const priceText = price.text()

            const image = $('#product-card > div.css-6vw06h-ProductCard > img', element)
            const imageURL = image.attr('src');
  
            products.push({title: titleText, price: priceText, img: imageURL})

            resolve(products)
        })        
    }
    return new Promise(promiseCallBack)
}

productsCalc = []

const calcItems = (products) => { // funcao que ira realizar os calculos.
    const promiseCallBack = (resolve, reject) => {

        products.map((product) => {
            const price = Number(parseFloat(product.price.replace(',','.').replace(' ','').replace('R$', '')))

            if(product.title.includes('473') & product.title.includes('24 uni')){
                productsCalc.push({title: product.title, price: parseFloat((price/24).toFixed(2)), plitro: parseFloat((1000*price/473/24).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('473') & product.title.includes('30 uni')){
                productsCalc.push({title: product.title, price: parseFloat((price/30).toFixed(2)), plitro: parseFloat((1000*price/473/30).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('350') & product.title.includes('24 uni')){
                productsCalc.push({title: product.title, price: parseFloat((price/24).toFixed(2)), plitro: parseFloat((1000*price/473/24).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('269') & product.title.includes('30 uni')){
                productsCalc.push({title: product.title, price: parseFloat((price/30).toFixed(2)), plitro: parseFloat((1000*price/473/30).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('269') & product.title.includes('24 uni')){
                productsCalc.push({title: product.title, price: parseFloat((price/30).toFixed(2)), plitro: parseFloat((1000*price/473/24).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('473') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((2, 1000*price/473).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('350') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/350).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('269') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/269).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('300') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/300).toFixed(2)),img: product.img })
                return
            }
            if(product.title.includes('330') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/330).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('355') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/355).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('550') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/550).toFixed(2)), img: product.img})
                return
            }
            if(product.title.includes('600') ){
                productsCalc.push({title: product.title, price: price, plitro: parseFloat((1000*price/600).toFixed(2)), img: product.img})
                return
            }

            
        })
        resolve('produtos calculados')
    }
    return new Promise(promiseCallBack) 

}


const marcas = ['brahma', 'skol', 'antarctica', 'budweiser', 'original', 'stella-artois', 'bohemia', 'corona', 'becks', 'colorado']

async function getNewData(){
    await getCachedPage('skol').then(getPageItems).then(calcItems).then()
    await getCachedPage('brahma').then(getPageItems).then(calcItems).then()
    await getCachedPage('antarctica').then(getPageItems).then(calcItems).then()
    await getCachedPage('budweiser').then(getPageItems).then(calcItems).then()
    await getCachedPage('original').then(getPageItems).then(calcItems).then()
    await getCachedPage('stella-artois').then(getPageItems).then(calcItems).then()
    await getCachedPage('bohemia').then(getPageItems).then(calcItems).then()
    await getCachedPage('corona').then(getPageItems).then(calcItems).then()
    await getCachedPage('becks').then(getPageItems).then(calcItems).then()
    await getCachedPage('colorado').then(getPageItems).then(calcItems).then()


    
    const haveInBD = await haveCollection().then()
        console.log('tem no bd?', haveInBD)
    if(1 === 1){
    await deleteDB().then(value => console.log(value))
    await mapProducts(productsCalc)
}
else {
    mapProducts(productsCalc)
}

productsCalc = []

}

async function mapProducts(products) {
    products.map(product => saveObjToDB(product))

}

async function saveObjToDB(obj){
        dbo.collection('zeporlitro').insertOne(obj, ()=> (erro, resultado) => {
            if (erro) throw erro
        })
}


const haveCollection = () => {

    const promiseCallBack = async (resolve, reject) => {
        mongodb.connect(url, (erro, banco) => {
            if(erro){
                throw erro;
            }
            const dbo = banco.db("zeporlitro")
            dbo.collection('zeporlitro').count({}, { limit: 1 }).then(value => resolve(value))

            })
    }
    return new Promise(promiseCallBack)
}

const deleteDB = () => {

    const promiseCallBack = async (resolve, reject) => {
        mongodb.connect(url, (erro, banco) => {
            if(erro){
                throw erro;
            }
            const dbo = banco.db("zeporlitro")
            dbo.collection("zeporlitro").deleteMany({}).then(value => resolve('foi deletado buceta',value)).catch(err => {
                console.log('deu merda p deletar', err)

            })

            })
    }
    return new Promise(promiseCallBack)
}


    getNewData();

