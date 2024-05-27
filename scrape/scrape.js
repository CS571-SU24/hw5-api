import cheerio from 'cheerio';
import fs from 'fs';
import { URL } from 'url';

// GPT 4: Function to download image
const downloadImage = async (imageUrl, outputPath) => {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
};

// https://masteringjs.io/tutorials/fundamentals/wait-1-second-then
async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const AUTH_KEY = fs.readFileSync('AUTH_KEY.secret').toString().trim()

const mainRes = await fetch(`https://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals2.aspx?species=Cat&gender=A&agegroup=All&location=&site=&onhold=A&orderby=name&colnum=3&css=&authkey=${AUTH_KEY}&recAmount=&detailsInPopup=Yes&featuredPet=Include&stageID=2`);
const mainData = await mainRes.text();
const main$ = cheerio.load(mainData);
const cats = main$("#tblSearchResults li a")
let ids = []
cats.each(function () {
    const id = main$(this).attr('href').split(".aspx?id=")[1].split("&css=")[0];
    ids.push(id);
});
ids = [...new Set(ids)];

const catObjs = [];

for (let catId of ids) {
    const res = await fetch(`https://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimalDetails2.aspx?id=${catId}&css=&authkey=${AUTH_KEY}&PopUp=true`);
    const data = await res.text();
    const $ = cheerio.load(data);
    const imgIds = []
    const foundFotos = $("#plPhotos a")
    if(foundFotos.length > 0) {
        $("#plPhotos a").each(function () {
            const imgUrl = $(this).attr('href');
            const imgId = imgUrl.split("/").at(-1);
            imgIds.push(imgId);
            delay(Math.random() * 3000).then(() => {
                downloadImage(imgUrl, `./imgs/${imgId}`);
            })
        })
    } else {
        const imgUrl = $("#imgAnimalPhoto").attr('src');
        const imgId = imgUrl.split("/").at(-1);
        imgIds.push(imgId);
        delay(Math.random() * 3000).then(() => {
            downloadImage(imgUrl, `./imgs/${imgId}`);
        })
    }

    const desc = $("#lbDescription")?.text()

    const catObj = {
        id: $("#lblID").text(),
        name: $("#lbName").text(),
        breed: $("#lbBreed").text(),
        age: $("#lbAge").text(),
        gender: $("#lbSex").text(),
        size: $("#lblSize").text(),
        colors: $("#lblColor").text().split("/"),
        declawed: $("#lbDeclawed").text().trim().toLowerCase() === 'yes',
        imgIds: imgIds
    }

    if (desc) {
        catObj["description"] = desc;
    }

    console.log(`Data fetched for ${catObj.name} (${catObj.id})`);
    catObjs.push(catObj)
    await delay(5000 + Math.random() * 3000);
}

fs.writeFileSync('cats.json', JSON.stringify(catObjs, null, 2))

console.log("Done!")
