// Librerias

const puppeteer = require('puppeteer');
const fs = require('fs');
var jsonminify = require("jsonminify");
//JSON.minify = jsonminify
//const dataWord = fs.readFileSync('palabras.txt', 'utf8');
const db = JSON.parse(fs.readFileSync('users.json', 'utf8'));
const settings = JSON.parse(jsonminify(fs.readFileSync('config.json', 'utf8')))
var currentCursor = 0
const showBanner = require('node-banner');
var XLSX = require("xlsx");
const cfonts = require('cfonts');
const Dropbox = require('dropbox');
var dbx = new Dropbox.Dropbox({ accessToken: settings.dropbox.accessToken });
let started
const mainUrl = 'https://www.twitch.tv/directory/all?sort=VIEWER_COUNT_ASC';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

var workbook = XLSX.readFile("./textos/1.xlsx");
var workbook2 = XLSX.readFile("./textos/2.xlsx");
var jsa = XLSX.utils.sheet_to_json(workbook.Sheets["Hoja 1"])
var jsa2 = XLSX.utils.sheet_to_json(workbook2.Sheets["Hoja 1"])
// Librerias

// Escribir en archivo users.json
const whiteUserData = async function (user, reason, comment) {
  constant = {
    username : user,
    reason : reason,
    lastSeen : Date.now(),
    comment : comment
  }
  db.push(constant);
  fs.writeFileSync('users.json', JSON.stringify(db));
}


// Generar una conversacion
const GetConversation = function (username) {
const maindb = []
var randLineNum = Math.floor(Math.random() * 2);

console.log(randLineNum)

switch (randLineNum) {
  case 1 :
    var randLineNum2 = Math.floor(Math.random() * jsa.length);
    maindb.push(jsa[randLineNum2]["1"].replace("@username", "@" + username))
    var randLineNum1 = Math.floor(Math.random() * jsa.length);
    maindb.push(jsa[randLineNum1]["2"].replace("@username", "@" + username))
    var randLineNum3 = Math.floor(Math.random() * jsa.length);
    maindb.push(jsa[randLineNum3]["3"].replace("@username", "@" + username))
    /*var randLineNum4 = Math.floor(Math.random() * jsa.length);
    maindb.push(jsa[randLineNum4]["4"].replace("@username", "@" + username))*/
    for (let i = 0; i < jsa2.length; i++) {
      }
    return maindb
  break
  case 0:
    var randLineNum2 = Math.floor(Math.random() * jsa2.length);
    maindb.push(jsa2[randLineNum2]["1"].replace("@username", "@" + username))
    var randLineNum1 = Math.floor(Math.random() * jsa2.length);
    maindb.push(jsa2[randLineNum1]["2"].replace("@username", "@" + username))
    var randLineNum3 = Math.floor(Math.random() * jsa2.length);
    maindb.push(jsa2[randLineNum3]["3"].replace("@username", "@" + username))
    var randLineNum4 = Math.floor(Math.random() * jsa2.length);
    maindb.push(jsa2[randLineNum4]["4"].replace("@username", "@" + username))
    /*var randLineNum5 = Math.floor(Math.random() * jsa2.length);
    maindb.push(jsa2[randLineNum5]["5"].replace("@username", "@" + username))*/
    for (let i = 0; i < jsa2.length; i++) {
    maindb[i]
    }
    return maindb
  break
}

return maindb


}

//console.log(GetConversation("Aiden uwu"))
// Buscar un usuario
async function getData(getLink) {

const getUser = getLink.link.split('twitch.tv/')[1];
if (settings.blacklist.find(x => x === getUser)) return {username : getUser, reason : 'Blacklisted'};
// Get Db data
const dbdata = db.find(x => x.username === getUser);

return dbdata


}
// Pruebas
/*
async function simulate(user) {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  //console.log((((Math.random() * 6) + 2)).toString().split('.')[0] + '000')
  const conversatin = GetConversation('Aidens')
    for (let i = 0; i < conversatin.length; i++) {
      await log(conversatin[i])
     await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
  }

}*/

//simulate('Aiden')

async function log(text) {
  cfonts.say(text, {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  })
}

async function autoScroll(page){
  try {
   await page.keyboard.press("PageDown", {delay: 1000});
   await page.keyboard.press("PageDown", {delay: 1000});
  } catch (error) {
    console.log(error)
    process.exit()
  }
   //await page.keyboard.press("PageDown", {delay: 1000});
   //await page.keyboard.press("PageDown", {delay: 1000});
   //await page.keyboard.press("PageDown", {delay: 1000});
   //await page.keyboard.press("PageDown", {delay: 1000});  
  
}


// Iniciar programa
async function scrape() {
    if (!started) await showBanner('Twitch Comment', 'Un bot de comentarios basado en una lista de palabras, by @Aiden_NotLogic');
    started = true;
    // Sincronizar con dropbox
    /*if ((settings.lastSync - Date.now()) < 86400000 || !(started)) {
      log('Sincronizando con la nube...')
      const syncDate = Date.now()
      dbx.filesUpload({path: '/users' + syncDate + '.json', contents: JSON.stringify(db)}).then(function(response) {
      settings.lastSync = syncDate
      fs.writeFileSync('config.json', JSON.stringify(settings, null, 2));
      log('Sincronizado con la nube')
    })
    .catch(function(error) {
      log('Error al sincronizar con la nube')
      //console.log(error);
    })
    }*/
    // Iniciar browser
    const browser = await puppeteer.launch({
        headless: settings.headless,
        defaultViewport: null,
        userDataDir: "./twitch-session",
        executablePath : "/usr/bin/chromium-browser",
        ignoreDefaultArgs: ["--disable-extensions",  "--enable-automation"],
        args: [
            '--start-maximized',
            '--disable-notifications',
            '--disable-infobars',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
           
     ]})
     global.browser = browser;
    const page = await browser.newPage();
    global.page = page
    await page.setViewport({
    width: 1920,
    height: 1080
})
    await page.setDefaultNavigationTimeout(0); // No timeout

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });
    // Detectar si esta logueado
    await page.goto(mainUrl, {waitUntil: 'networkidle2'});
    
    await page.waitForSelector('button[data-a-target="login-button"]', {timeout : 1000}).then(async() => {
        if (!settings.headless) {
        page.click('button[data-a-target="login-button"]');
        await page.evaluate(() => new Promise((resolve) => {
           alert('Por favor inicie sesión en Twitch para continuar');
           setInterval(() => {
            page.waitForSelector('button[data-a-target="login-button"]', {timeout : 2000}).then(() => {
                return
            })
            .catch(() => {
              mainfunc(browser, page);
              resolve();
            })
              resolve(); 
            })
         })

         )}
         else {
           browser.close();
           log('No estas logueado, por favor inicia sesión en Twitch para continuar');
            process.exit();
         }})
         .catch(async() => {
          mainfunc(browser, page);
})
}

process.on('SIGINT', () => {
  log("Por favor espere...");
  browser.close().catch()
  process.exit();
  


});

process.on("unhandledRejection", async (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, reason);
  if (settings.crashOnError) process.exit(1);
  await page.screenshot({path: './screenshot.png'});
  browser.close().catch()
  scrape()
})


scrape();

// Funcion principal
async function mainfunc(browser, page) {
  try {
const getLink = async function (number) {
  const limk = await page.evaluate(() => new Promise((resolve) => {
      const dbs = document.querySelectorAll("article")
      const dbjs = []
      for (let i = 0; i < dbs.length; i++) {
      dbjs.push({ link : dbs[i].childNodes[1].childNodes[4].childNodes[0].href, views :dbs[i].childNodes[1].childNodes[4].childNodes[0].childNodes[0].childNodes[2].innerText})
    }
    resolve(dbjs);
  }))
  if (!((limk.length - number) > 2)) {
    console.log('Haciendo scroll...')
    for (let i = 0; i < (limk.length) - 10; i++) {
      await page.keyboard.press("PageDown", {delay: 500});

  }
  limk = await page.evaluate(() => new Promise((resolve) => {
    const dbs = document.querySelectorAll("article")
    const dbjs = []
    for (let i = 0; i < dbs.length; i++) {
    dbjs.push({ link : dbs[i].childNodes[1].childNodes[4].childNodes[0].href, views :dbs[i].childNodes[1].childNodes[4].childNodes[0].childNodes[0].childNodes[2].innerText})
  }
  resolve(dbjs);
}))
  }
  return { link : limk[number].link, selector : number, totalselector : limk.length, views : Number(limk[number].views.replace(" espectadores", "")) };

}
const lts = await getLink(currentCursor)
console.log(lts)

// Filtro de views
if (lts.views < settings.minViews) {
  currentCursor++;
  log("Este usuario no tiene suficientes views, pasando a la siguiente...");
  await sleep(1000);
  return mainfunc(browser, page);
}

if (lts.views > settings.maxViews) {
  currentCursor++;
  log("Este usuario tiene demasiados views, pasando a la siguiente...");
  await sleep(1000);
  return mainfunc(browser, page);
}

// Buscar si el usuario existe en la base de datos
const dats = await getData(lts);

// Si el usuario existe, pasar a la siguiente
if (dats) {
  if (dats.reason === 'Blacklisted') {
    currentCursor++;
    log(`${dats.username} ${dats.reason}`)
    await sleep(1000);
    await mainfunc(browser, page);
  }
  if (dats.reason === 'subOnly') {
    log('El canal ' + dats.username + ' es solo para suscripciones/seguidores, probando siguiente...')
    currentCursor++;
    await sleep(1000);
    mainfunc(browser, page);
    return
  } else if (dats.reason === 'normal') {
    log('El canal ' + dats.username + ' ya se le ha mandado mensaje , probando siguiente...')
        currentCursor++;
    await sleep(1000);
    mainfunc(browser, page);
    return
  } else if (dats.reason === 'patner') {
    log('El canal ' + dats.username + ' es patner, probando siguiente...')
        currentCursor++;
    await sleep(1000);
    mainfunc(browser, page);
    return
  } else  {
    log("El canal " + dats.username + " Ya se le ha mandado mensaje, Buscando otro...")
    currentCursor++;
    await sleep(1000);
    mainfunc(browser, page)
    return
  }
}


await page.goto(lts.link, {waitUntil: 'networkidle2'});

const sendMessage = async function (string) {

  //const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  console.log("Dejaremos el siguiente mensaje: " + string)
  whiteUserData(lts.link.split('twitch.tv/')[1], "normal")
  await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
    await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
  })
  await page.click("div[data-a-target='chat-input']");
  await page.waitForSelector("button[data-test-selector='chat-rules-ok-button']", {timeout : 5000}).then(async() => {
    await page.click("button[data-test-selector='chat-rules-ok-button']");
    await page.keyboard.type(string[0], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
      await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
    })
    await page.click("div[data-a-target='chat-input']");
    await page.keyboard.type(string[1], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
      await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
    })
    await page.click("div[data-a-target='chat-input']");
    await page.keyboard.type(string[2], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    if (string[3]) {
    await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
      await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
    })
    await page.click("div[data-a-target='chat-input']");
    await page.keyboard.type(string[3], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
  }
    if (string[4]) {
      await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
        await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
      })
      await page.click("div[data-a-target='chat-input']");
      await page.keyboard.type(string[4], {delay: settings.delayEscribir});
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
     await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'));

    }
    currentCursor += 1;
    //whiteUserData(lts.link.split('twitch.tv/')[1], "normal")
    log('Mensaje enviado')
    await page.goto(mainUrl, {waitUntil: 'networkidle2'});
    mainfunc(browser, page);

    //await page.click("button[data-test-selector='chat-send-button']");
  }).catch(async() => {
    //await page.keyboard.type(string, {delay: settings.delayEscribir});
    await page.keyboard.type(string[0], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    //data-a-target="right-column__toggle-collapse-btn"
    await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
      await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
    })
    await page.click("div[data-a-target='chat-input']");
    await page.keyboard.type(string[1], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
      await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
    })
    await page.click("div[data-a-target='chat-input']");
    await page.keyboard.type(string[2], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    if (string[3]) {
    await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
      await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
    })
    await page.click("div[data-a-target='chat-input']");
    await page.keyboard.type(string[3], {delay: settings.delayEscribir});
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'))
    }
    if (string[4]) {
      await page.waitForSelector("div[data-a-target='chat-input']", {timeout : 1000}).catch(async() => {
        await page.click("div[data-a-target='right-column__toggle-collapse-btn']");
      })
      await page.click("div[data-a-target='chat-input']");
      await page.keyboard.type(string[4], {delay: settings.delayEscribir});
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
     await sleep(Number((((Math.random() * 6) + 2)).toString().split('.')[0] + '000'));
    }
    currentCursor += 1;
    log('Mensaje enviado')
    await page.goto(mainUrl, {waitUntil: 'networkidle2'});
    mainfunc(browser, page);
    //await page.click("button[data-test-selector='chat-send-button']");
  })
}

// Detectar Ajustes del chat
const chatPatner = await page.$x("//figure[class='ScFigure-sc-1j5mt50-0 kYSkP tw-svg']");
const chatdetect = await page.$x("//*[contains(., 'Chat solo para suscriptores')]")
const chatdetect2 = await page.$x("//*[contains(., 'Chat solo para seguidores')]")
if (chatdetect.length > 0 || chatdetect2.length > 0 || chatPatner.length > 0) {
  if (chatdetect.length > 0 || chatdetect2.length > 0) log('Chat solo para suscriptores encontrado, Volviendo a la página anterior')
  if (chatPatner.length > 0) log('Patner Encontrado, Volviendo a la página anterior')
  currentCursor += 1;
  if (chatdetect.length > 0 || chatdetect2.length > 0) whiteUserData(lts.link.split('twitch.tv/')[1], "subOnly")
  if (chatPatner.length > 0) whiteUserData(lts.link.split('twitch.tv/')[1], "patner")
  await page.goto(mainUrl, {waitUntil: 'networkidle2'});
  mainfunc(browser, page);
  return
}


sendMessage(GetConversation(lts.link.split('twitch.tv/')[1]))

} catch (error) {
  // Si hay un error, volvemos a la página anterior
  console.log(error)
  console.log('Por seguridad, Se reiniciara el selector')
  currentCursor = 0;
  await sleep(3000)
  await page.goto(mainUrl, {waitUntil: 'networkidle2'});
  mainfunc(browser, page);
}}
