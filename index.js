// Our initial setup (package requires, port number setup)
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require('fs');
const RSS = require('rss');

const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express();

// Route setup. You can implement more in the future!
const ta01Routes = require("./routes/ta01");
const feedRoutes = require("./routes/feed");

var feed = new RSS({
   title: ' The Alluvium Podcast ',
   description: '𝗔𝗹𝗹𝘂𝘃𝗶𝘂𝗺: 𝘢 𝘥𝘦𝘱𝘰𝘴𝘪𝘵 𝘰𝘧 𝘤𝘭𝘢𝘺, 𝘴𝘪𝘭𝘵, 𝘢𝘯𝘥 𝘴𝘢𝘯𝘥 𝘭𝘦𝘧𝘵 𝘣𝘺 𝘧𝘭𝘰𝘸𝘪𝘯𝘨 𝘴𝘵𝘳𝘦𝘢𝘮𝘴 𝘪𝘯 𝘢 𝘳𝘪𝘷𝘦𝘳 𝘷𝘢𝘭𝘭𝘦𝘺, 𝘵𝘺𝘱𝘪𝘤𝘢𝘭𝘭𝘺 𝘱𝘳𝘰𝘥𝘶𝘤𝘪𝘯𝘨 𝘧𝘦𝘳𝘵𝘪𝘭𝘦 𝘴𝘰𝘪𝘭. Sit back and enjoy as hosts Sam and Brennan deposit their fertilizing mental clay, silt, and sand into your brain. ',
   feed_url: 'http://www.alluviumpodcast.com/rss.xml',
   site_url: 'http://www.alluviumpodcast.com',
   image_url: 'http://www.alluviumpodcast.com/images/cover.png',
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

/* loop over data and add to feed */
feed.item({
   title:  ' Barely Legal Teenaged Turtles',
   description: 'The boys unpack their favorite cartoons in this one.',
   url: 'https://alluviumpodcast.com/episode1', // link to the item
   categories: ['Comedy'], // optional - array of item categories
   date: 'Wed, 26 Jan 2022 22:55:23 GMT', // any format that js Date can parse.
   enclosure: {url:'http://www.alluviumpodcast.com/Audio/AllEp1.mp3',
   'size' : 81772017, //
   'type' : 'audio/mpeg' }, // optional enclosure
   custom_elements: [
     {'itunes:author': ''},
     {'itunes:image': {
       _attr: {
         href: 'http://www.alluviumpodcast.com/images/cover.png'
       }
     }},
     {'itunes:duration': '1:21:10'}
   ]
});

feed.item({
   title:  ' Captain Controversial Crunch ',
   description: 'Grab some milk, because the boys unpack their spiciest controversial opinions in this one.',
   url: 'https://alluviumpodcast.com/episode2', // link to the item
   categories: ['Comedy'], // optional - array of item categories
   date: 'Wed, 26 Jan 2022 22:55:23 GMT', // any format that js Date can parse.
   enclosure: {url:'http://www.alluviumpodcast.com/Audio/AllEp2.mp3',
   'size' : 93474163, //
   'type' : 'audio/mpeg' }, // optional enclosure
   custom_elements: [
     {'itunes:author': ''},
     {'itunes:image': {
       _attr: {
         href: 'http://www.alluviumpodcast.com/images/cover.png'
       }
     }},
     {'itunes:duration': '1:27:36'}
   ]
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
   .use("/ta01", ta01Routes)
   .use("/feed", feedRoutes)

   
   .get("/feed.xml", (req, res, next) => {
      res.set('Content-Type', 'text/xml');
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
