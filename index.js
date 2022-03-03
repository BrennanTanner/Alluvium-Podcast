// Our initial setup (package requires, port number setup)
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const RSS = require('rss');
var request = require("request");
const date = require('date-and-time');


const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express();

// Route setup. You can implement more in the future!
const feedRoutes = require("./routes/feed");
const { Console } = require("console");
const { exit } = require("process");

const url = "https://archive.org/metadata/@alluviumpodcast";


global.feed = new RSS({
   title: ' The Alluvium Podcast ',
   description: '𝗔𝗹𝗹𝘂𝘃𝗶𝘂𝗺: 𝘢 𝘥𝘦𝘱𝘰𝘴𝘪𝘵 𝘰𝘧 𝘤𝘭𝘢𝘺, 𝘴𝘪𝘭𝘵, 𝘢𝘯𝘥 𝘴𝘢𝘯𝘥 𝘭𝘦𝘧𝘵 𝘣𝘺 𝘧𝘭𝘰𝘸𝘪𝘯𝘨 𝘴𝘵𝘳𝘦𝘢𝘮𝘴 𝘪𝘯 𝘢 𝘳𝘪𝘷𝘦𝘳 𝘷𝘢𝘭𝘭𝘦𝘺, 𝘵𝘺𝘱𝘪𝘤𝘢𝘭𝘭𝘺 𝘱𝘳𝘰𝘥𝘶𝘤𝘪𝘯𝘨 𝘧𝘦𝘳𝘵𝘪𝘭𝘦 𝘴𝘰𝘪𝘭. Sit back and enjoy as hosts Sam and Brennan deposit their fertilizing mental clay, silt, and sand into your brain. ',
   feed_url: 'http://www.alluviumpodcast.com/feed.xml',
   site_url: 'http://www.alluviumpodcast.com',
   image_url: 'https://archive.org/details/alluvium-s01-ep01/cover.jpg',
   copyright: 'Brennan Tanner 2022',
   language: 'en',
   categories: ['Comedy'],
   pubDate: 'Wed, 26 Jan 2022 22:55:23 GMT',
   ttl: '60',
   custom_namespaces: {
     'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
   },
   custom_elements: [
     {'itunes:author': 'Alluvium'},
     {'itunes:summary': '𝗔𝗹𝗹𝘂𝘃𝗶𝘂𝗺: 𝘢 𝘥𝘦𝘱𝘰𝘴𝘪𝘵 𝘰𝘧 𝘤𝘭𝘢𝘺, 𝘴𝘪𝘭𝘵, 𝘢𝘯𝘥 𝘴𝘢𝘯𝘥 𝘭𝘦𝘧𝘵 𝘣𝘺 𝘧𝘭𝘰𝘸𝘪𝘯𝘨 𝘴𝘵𝘳𝘦𝘢𝘮𝘴 𝘪𝘯 𝘢 𝘳𝘪𝘷𝘦𝘳 𝘷𝘢𝘭𝘭𝘦𝘺, 𝘵𝘺𝘱𝘪𝘤𝘢𝘭𝘭𝘺 𝘱𝘳𝘰𝘥𝘶𝘤𝘪𝘯𝘨 𝘧𝘦𝘳𝘵𝘪𝘭𝘦 𝘴𝘰𝘪𝘭. Sit back and enjoy as hosts Sam and Brennan deposit their fertilizing mental clay, silt, and sand into your brain. '},
     {'itunes:owner': [
       {'itunes:name': 'Alluvium Podcast'},
       {'itunes:email': 'brennanplayswow@gmail.com'}
     ]},
     {'itunes:explicit': 'no'},
      {'itunes:type': 'episodic'},
     {'itunes:image': {
       _attr: {
         href:  'http://www.alluviumpodcast.com/images/cover.png'
       }
     }},
     {'itunes:category': [
       {_attr: {
         text: 'Comedy'
       }}
     ]}
   ]
});


async function getItem(body2, i){
  let fileName = '';
  let fileSize = '';
  let fileLength = '';

  for(let x = 0; x < body2.files_count; x++) {
    if (body2.files[x].name.includes('.mp3')){
      fileName = body2.files[x].name;
      fileSize = body2.files[x].size;
      fileSize = body2.files[x].length * 100;
      filedate = date.parse(body2.metadata.date, 'YYYY-MM-DD');
      filedate = date.format(filedate, 'ddd, MMM DD YYYY')
    }
  }

  //console.log('https://' + body2.d1 + body2.dir + '/cover.jpg');
  feed.item({
    title:  body2.metadata.title,
    description: body2.metadata.description,
    url: 'https://archive.org/details/alluvium-s01-ep0' + i, // link to the item
    categories: body2.metadata.subject, // optional - array of item categories
    date: filedate +' 06:00:00 GMT', // any format that js Date can parse.
    enclosure: {url:'https://' + body2.d1 + body2.dir + '/' + fileName,
    'size' : fileSize, //
    'type' : 'audio/mpeg' }, // optional enclosure
    custom_elements: [
      {'itunes:author': body2.metadata.creator},
      {'itunes:image': {
        _attr: {
          href: 'https://' + body2.d1 + body2.dir + '/cover.jpg'
        }
      }},
      {'itunes:duration': fileLength}
    ]
 });
 
};
/* loop over data and add to feed */

 request({
  url: url,
  json: true
},async function (error, response, body) {
console.log(body.files_count);


/*
CHANGE THIS ONE HERE AFTER EACH NEW RELEASE
                       |||
                       VVV
*/
  if (!error && response.statusCode === 200) {
    for (let i = 0; i < 5; i++) {
      let ep = i + 1; 
      
      const urls = [];
      urls[i] = "https://archive.org/metadata/alluvium-s01-ep0"+ ep;

      const timer = ms => new Promise(res => setTimeout(res, ms));

      request({
        url: urls[i],
        json: true
      },async function (error, response, body2) {
      
        console.log(body2);
        if (body2 == null){
          i = body2.files_count;
        }
        else if (!error && response.statusCode === 200) {
console.log(urls[i]);
          itemCount = feed.items.length + 1;
        await getItem(body2, i); 

        } 
        else {console.log(error);}
      });
      await timer(100);
    }
  }
  else {console.log(error);}

});


const xml = feed.xml({indent: true });

app.use(express.static(path.join(__dirname, "public")))
   .set("views", path.join(__dirname, "views"))
   .set("view engine", "ejs")

   .use(
      bodyParser.urlencoded({
         extended: true,
      })
   )
   .use(bodyParser.json()) // For parsing the body of a POST
   .use("/feed", feedRoutes)

   
   .get("/feed.xml", (req, res, next) => {
      res.set('Content-Type', 'text/xml');
      request({
        url: url,
        json: true
      }, function (error, response, body) {
      
        if (!error && response.statusCode === 200) {
      
          
        }
        else {console.log(error);}
      
      });
      
      const xml = feed.xml({indent: true });
      res.send(xml);

   })

   .get("/", (req, res, next) => {
      // This is the primary index, always handled last.
      res.render("pages/index", {
         title: "Alluvium Podcast",
         path: "/",
      });
   })
   .use((req, res, next) => {
      // 404 page
      res.render("pages/404", { title: "404 - Page Not Found", path: req.url });
   })
   .listen(PORT, () => console.log(`Listening on ${PORT}`));
