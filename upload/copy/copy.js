var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: "./lottovision-d0a46b6212c0.json",
})

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.newf.filepath;
            let r = (Math.random() + 1).toString(36).substring(7);

            var newpath = 'uploades/'+r + files.newf.originalFilename;
            fs.rename(oldpath, newpath, function (err) {

                 var response=[];
              //   console.log(newpath)
                client.textDetection(newpath)
                    .then((results)=>{
                        const texts= results[0].textAnnotations;
                      //  console.log("labels:"+texts);
                        texts.forEach((text)=>{ response.push(text.description)});
                        res.write('text.description'+JSON.stringify(response));
                       res.end();
                    })
                    .catch((err)=>{
                        console.log("EROOR:", err);
                    })

 
                // res.write('text.description'+JSON.stringify(response));
                // res.end();
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="newf"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8081);