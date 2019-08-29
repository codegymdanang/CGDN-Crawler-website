const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');



function crawlerPopularLinks()
{
    //Gửi 1 request tới website
    request('https://apps.apple.com/kn/genre/ios-business/id6000?letter=A', function (err, res, body)
    {
        //  Sử dụng cheerio.load để lấy dữ liệu trả về
        var $ = cheerio.load(body);
        //  get select content
        var links = new Array();

        $('#selectedcontent').find('a').each(function(i,elem){
            links.push($(this).attr('href'));
        });

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

    })
}



function crawlerAppSupportLink(appSupportlink) {
    let link = "";
    return new Promise(resolve => {
        request(appSupportlink, function (err, res, body) {
            //  Sử dụng cheerio.load để lấy dữ liệu trả về
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

function readPopularLinks() {
    let appSupportLinks = new Array();
    return new Promise((resolve, reject)=>{
        fs.readFile('popularapp.json', async function readFileCallback(err, data) {
            if (err) {
                console.log('Fail to  popularapp.json !');
                return;
            } else {
                // get all popular link from file
                let popularLinks = JSON.parse(data);
                for (var index in popularLinks) {
                    var link = await crawlerAppSupportLink(popularLinks[index]);
                    console.log("Link " , link);
                    appSupportLinks.push(link);

                }
                resolve(appSupportLinks);

            }
        });
    });

}

function saveAppSupportLinkToFile(appSupportLinks) {
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

//crawlerPopularLinks();
//readPopularLinks();
//saveAppSupportLinkToFile();

async function crawlData() {
    const appSupport = await readPopularLinks();
    saveAppSupportLinkToFile(appSupport);
}

crawlData();