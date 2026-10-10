const router=require('express').Router(),a=require('../services/announcements');
router.get('/',(req,res)=>res.json({announcements:a.published()}));
module.exports=router;
