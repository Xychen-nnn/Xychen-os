const router=require('express').Router(),c=require('../services/community'),{clean}=require('../utils/validation');
router.post('/',(req,res)=>{
  const subject=clean(req.body.subject,2,120),message=clean(req.body.message,2,4000);
  if(!subject||!message)return res.status(400).json({error:'Subject and message are required'});
  res.status(201).json({ticket:c.create('support',null,subject,message)});
});
module.exports=router;
