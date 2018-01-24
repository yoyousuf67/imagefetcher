require('dotenv').config({path: __dirname + '/.env'});
var fs = require('fs');
var request = require('request');
var request2 = require("request");
var express = require('express');
var app = express();
var path = require('path');
var Jimp = require("jimp");
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var Promise = require('bluebird');
var GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));
var nope=55;
var storage = GoogleCloudStorage({
  projectId: process.env.MYAPIKEY,
  keyFilename:process.env.FILENAME
})

var BUCKET_NAME = 'imagescraper1'
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket
var myBucket = storage.bucket(BUCKET_NAME)

app.use(express.static((__dirname + '/public'))));


app.get('/store',function(req,res){
if(nope==1){
	res.send("Successfully uploaded files to google cloud").status(200);
}else{
	
	var po=1;
		// upload file to bucket
		 let folderName = path.join(__dirname,'filestore/');
		 
			fs.readdir(folderName , (err, files) => {
					if (err) {
						console.log(err);
						return;
					}
			 files.forEach(file => {
				let filename = `${folderName }${file}`;
		const bucketName = 'imagescraper1';
		//const filename = fileName;

		// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket?method=upload
		let localFileLocation = filename;
		myBucket.uploadAsync(localFileLocation, { public: true })
		  .then(file => {
			// file saved
			console.log(localFileLocation+" uploaded");
			++po;
			console.log('po'+po+' fl'+files.length);
			if(po>files.length){
				res.send("Successfully uploaded files to google cloud").status(200);
								files.forEach(file => {
				let fileName = `${folderName }${file}`
				fs.unlink(fileName, (err) => {
				  if (err) throw err;
				  console.log('successfully deleted '+fileName);
			})
			})
			}
			})
			})

			})
}
			});


var someurl;
app.get('/displaying/:someurl', function (req, res) {
	someurl=req.params.someurl;
	console.log("3");
	  res.sendFile(path.join(__dirname, 'public', 'display.html'));

});
app.get('/display', function (req, res) {
console.log("1");
	var fname= new Array();
	fname=[];
const prefix = '';
const delimiter = '';
const options = {
  prefix: prefix,
};
if (delimiter) {
  options.delimiter = delimiter;
}
// Lists files in the bucket, filtered by a prefix
storage
  .bucket(BUCKET_NAME)
  .getFiles(options)
  .then(results => {
    const files = results[0];
    console.log('Files:');
    files.forEach(file => {
		if(someurl==file.name.split('@')[0]){
			console.log("2");
			fname.push(file.name);
		}
    });
	var Imgurl="";
	for(i=0;i<fname.length;i++){
		Imgurl=Imgurl+dispImg(fname[i]);
	}
	console.log(Imgurl);
	res.send(Imgurl);
	//<img src="https://storage.googleapis.com/imagescraper1/"+fname[i]>
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
});

	function dispImg(someurl){
	var htmlTemplate=`<li><img src="https://storage.googleapis.com/imagescraper1/${someurl}"></li>`;
      return htmlTemplate;
	}
	//res.sendFile(path.join(__dirname, 'public', 'display.html'));


var download =function(uri, filename, callback){
	request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length'])
	
	var picStream = fs.createWriteStream(filename);
	picStream.on('close', function() {
	  console.log('file done');
	  callback();
	});
		picStream.on('error', function() {
		console.log('error');
	});
	request(uri).pipe(picStream);
  });
};
	 
	 app.get('/getcook',function(req,res){
		 //var input=req.params.input;
		 var cookie_id = req.cookies.randomcookiename;
		 console.log(cookie_id);
	 });
	 
	 
	 
	 
	 
	 
var input,cookie_id;
app.get('/imgdownload/:input', function (req, res) {	
var input=req.params.input;
console.log(input);
var cookie_id = req.cookies.randomcookiename;
console.log(cookie_id);
		nope=55;
		if(cookie_id!=undefined){
			console.log("here");
			var arrq=cookie_id.split("/");
			 for(p=0;p<arrq.length;p++){
				 if(arrq[p]==input){
					  nope=1;
					  console.log(nope);
					 break;
				 }
				 else{nope=55;
					console.log(nope);}
				}}
			 if(nope==1){
				 res.send("Download Success").status(200);
			 }
			 else{
				 if(cookie_id==undefined&&nope!=1){
			 cookie_id=input;
		 }else{
					 cookie_id=cookie_id+'/'+input;
				 }
			 

	
console.log('input'+input);
console.log('cookie_id'+cookie_id);
var options = { method: 'GET',
  url: 'https://www.googleapis.com/customsearch/v1',
  qs: 
   { q: input,
     cx:process.env.CX,
     key:process.env.KEY,
     searchType: 'image'
	 },
  headers: 
   {
     'cache-control': 'no-cache' } };

var options2 = { method: 'GET',
  url: 'https://www.googleapis.com/customsearch/v1',
  qs: 
   { q: input,
      cx:process.env.CX,
     key:process.env.KEY,
     searchType: 'image',
     start: '11',
	 num:  '5'
},
  headers: 
   {'cache-control': 'no-cache' } };

var downloader = new Promise(function(resolve,reject){
		request(options, function (error, response, body) {
		if (error) {console.log(error);}

	  var jsonData = JSON.parse(body);
	  //console.log(body);
		for (var i = 0,j=0; i < jsonData.items.length; i++) {
			var urls = jsonData.items[i];
			var links = urls.link;
			var mimetype=(urls.mime).split("/")[1];
			if(mimetype==""){
				j++;
				continue;
			}
			var imgid=Math.floor(100000 + Math.random() * 900000);
			var imgpath=input+'@'+imgid+'.'+mimetype;
			console.log(imgpath);
					download(links, path.join(__dirname,'filestore',imgpath), function(){
					console.log('done1');
					++j;
					if(j== jsonData.items.length-1){
					resolve(console.log("success"));
					}
					})		
		}
		})
		});

		downloader
		.then(function(){
				console.log("yolo");
				request2(options2, function (error, response, body) {
				  if (error) {console.log(error);}
						  var jsonData = JSON.parse(body);
				  //console.log(body);
					for (var i = 0, temp=0; i < jsonData.items.length; i++) {
							var urls = jsonData.items[i];
							var links = urls.link;
							var mimetype=(urls.mime).split("/")[1];
							if(mimetype==""){
								++temp;
							continue;
							}
							var imgid=Math.floor(100000 + Math.random() * 900000);
							var imgpath=input+'@'+imgid+'.'+mimetype;
							console.log(imgpath+'2ha');
									download(links, path.join(__dirname,'filestore',imgpath), function(){
									console.log('done2');
									++temp;
									if(temp== jsonData.items.length-1){
										console.log('Download Success');
										setTimeout(function(){
											res.cookie('randomcookiename',cookie_id, { maxAge: 345600000}).send("Download Success").status(200);
										},10000);
							
					}
									});
					}
				  //console.log(body);
				  })
		})
			 }
});	
		



app.get('/bw', function (req, res){
		setTimeout(function(){
			if(nope==1){
				res.send("Compression and B/W filter successful").status(200);
			}else{
		c=0;
		let folderName = path.join(__dirname,'filestore/'),
		destFolder = path.join(__dirname,'bw/');

		fs.readdir(folderName , (err, files) => {
			if (err) {
				console.log(err);
				return;
			}

    files.forEach(file => {
        let fileName = `${folderName }${file}`,
            BWFile = `${destFolder}${file}`;
        if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.jpeg')) {
           
		   // open a file called "lenna.png"
			Jimp.read(fileName).then(function (img) {
				++c;
				img  .resize(256,256)         // resize
					 .quality(60)                 // set JPEG quality
					 .greyscale()                 // set greyscale
					 .write(fileName); // save
						console.log("haa");
					console.log(c+' c '+files.length+' fl' );
					setTimeout(function(){c=files.length},35000);
						if(c==files.length){
				res.send("Compression and B/W filter successful").status(200);
			}
			}).catch(function(err){
				++c;
				console.log(err);
			});
		   
        }else{++c;
		console.log("i am here");}
   })
});
			}}, 5000);
});






function createTemplate (somename){
var htmlTemplate=`<li><a href="/displaying/${somename}" target="_blank">${somename}</a></li>`;
      return htmlTemplate;
  }

  app.get('/historypage', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'history.html'));
});
  
app.get('/history',function(req,res){
	var template="";
	var cookie_id = req.cookies.randomcookiename;
	if(cookie_id!=undefined){
	var arr=cookie_id.split("/");
	for(var index=0, len=arr.length;index<len;++index){
		//console.log(arr[index]);
		template=template+createTemplate(arr[index]);
	}
	}
	res.send(template);
});



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'Image_fetch.html'));
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
/*var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`listening on port ${port}!`);
});*/