//TA04 PLACEHOLDER
const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
  res.render('pages/feed.xml', {
    title: 'RSS feed',
    path: '/feed.xml', // For pug, EJS
  });
});

router.post('/feed.xml', (req, res, next) =>{
   users.push(req.body.users);
   console.log();
   res.redirect('/feed.xml');  
 });

module.exports = router;