const mongoose=require('mongoose')
const {Comment, validateComment}=require('../models/comment-model')
const lodash = require('lodash')
const express =require('express')
const router=express.Router()

router.get('/', async (req,res)=>{
    const comment= await Comment.find()
    res.send(comment)
})

router.get('/:id', async (req,res)=>{
    try{
        const comment=await Comment.findById(req.params.id)
         if(!comment) res.status(404).send('The Product Id not found')  
         res.send(comment)
    }
    catch(err){res.send(err)}
})

router.post('/', async (req,res)=>{
    const result= validateComment(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } 

    let comment= new Comment(lodash.pick(req.body,["postId","comm"]))
    try{
        comment= await comment.save()
        res.send(comment)
    }
    catch(err){res.send(err)}
    
})

router.put('/:id', async (req,res)=>{
    
    const comment= await Comment.findByIdAndUpdate(req.params.id,{comm:req.body.comm},{new:true})
    if(!comment) res.status(404).send('The Product Id not found')

    const result= validateComment(req.body)
    if (result.error)  res.status(400).send(result.error.details[0].message)

    comment.comm = req.body.comm
       
    res.send(comment)
})

router.delete('/:id', async (req,res)=>{
    const comment=await Comment.findByIdAndRemove(req.params.id)
    if(!comment) res.status(404).send('The Product Id not found')  
    res.send(comment)
})

module.exports=router;