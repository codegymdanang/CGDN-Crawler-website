const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

var appSupport = new Array();

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

    })
}

function saveAppSupportLinkToFile() {
    console.log('@@@@@@',appSupport);
}

function crawlerAppSupportLink(appSupportlink) {
    request(appSupportlink, function (err, res, body)
    {
        console.log("$$$$$$ Link name", appSupportlink);
        //  Sử dụng cheerio.load để lấy dữ liệu trả về
        var $ = cheerio.load(body);
        //  get select content
        var category = $('.link').filter(function() {
            return $(this).text().indexOf('App Support') > -1;
        })
        console.log("#########", category.attr('href'));
        appSupport.push(category.attr('href'))

    })

}

function readPopularLinks() {
    fs.readFile('popularapp.json', function readFileCallback(err, data)
    {
        if (err)
        {
            console.log('Đọc file popularapp.json thất bại!');
            return;
        }
        else
        {
            // Lấy chương truyện mới nhất từ file json
            var links = JSON.parse(data);

            for (var index in links) {
                crawlerAppSupportLink(links[index]);
            }

            saveAppSupportLinkToFile();

        }
    });
}
//crawlerPopularLinks();
readPopularLinks();