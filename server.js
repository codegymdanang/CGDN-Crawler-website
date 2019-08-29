const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');



function crawlerPopularLinks(link)
{
    var popularLinks = new Array();
    return new Promise((resolve,reject) => {
        request(link, function (err, res, body)
        {
            console.log("Source Link" , link );
            //  Sử dụng cheerio.load để lấy dữ liệu trả về
            var $ = cheerio.load(body);
            //  get select content


            $('#selectedcontent').find('a').each(function(i,elem){
                popularLinks.push($(this).attr('href'));
            });
            resolve(popularLinks);
        })
    })

}



function crawlerAppSupportLink(appSupportlink) {
    let link = "";
    return new Promise((resolve,reject) => {
        request(appSupportlink, function (err, res, body) {

            let $ = cheerio.load(body);
            //  get select content
            let category = $('.link').filter(function() {
                return $(this).text().indexOf('App Support') > -1;
            })
            link = category.attr('href');

            resolve(link);

        })
    });


}

async function readAppSupportLinksFromFile() {
    let appSupportLinks = new Array();
    return new Promise((resolve, reject)=>{
        fs.readFile('popularapp.json', async function readFileCallback(err, data) {
            if (err) {
                console.log('Fail to  popularapp.json !');
                return;
            } else {
                // get all popular link from file
                let popularLinks = JSON.parse(data);

                for(let index in popularLinks) {
                    console.log("Link" +index+ " is" + popularLinks[index] + "\n");
                    let link = await crawlerAppSupportLink(popularLinks[index]);
                    console.log("Link " , link);
                    appSupportLinks.push(link);

                }
                resolve(appSupportLinks);

            }
        });
    });

}

function savePopularlinksToFile(links) {
    console.log(links);
    var json = JSON.stringify(links);
    //  Kiểm tra file newchap.json tồn tại không
    if (!fs.existsSync('popularapp.json')) {
        //  Nếu chưa tồn tại tạo file  mới
        fs.writeFile('popularapp.json', json, '', (err)=>{
            if (err) throw err;
            console.log('created popularapp.json !');
        });
        return;
    }
}

function saveAppSupportLinksToFile(appSupportLinks) {
    var json = JSON.stringify(appSupportLinks);

    if (!fs.existsSync('appsupport.json')) {
        //  Nếu chưa tồn tại tạo file  mới
        fs.writeFile('appsupport.json', json, '', (err)=>{
            if (err) throw err;
            console.log('created appsupport.json !');
        });
        return;
    }
}

function readSourceLinksFromFile() {
    let appLinks = new Array();
    return new Promise((resolve, reject)=>{
        fs.readFile('sourcelink.json', async function readFileCallback(err, data) {
            if (err) {
                console.log('Fail to  popularapp.json !');
                return;
            } else {
                // get all popular link from file
                let sourceLinks = JSON.parse(data);
                for (var index in sourceLinks) {
                    var link = await crawlerPopularLinks(sourceLinks[index]);
                    console.log("=== Popular Link ===" , link);
                    appLinks.push(...link);

                }
                resolve(appLinks);
            }
        });
    });
}


async function crawlData() {
    const popularlink = await readSourceLinksFromFile();
    await savePopularlinksToFile(popularlink);
    const appSupport = await readAppSupportLinksFromFile();
    saveAppSupportLinksToFile(appSupport);
}

crawlData();