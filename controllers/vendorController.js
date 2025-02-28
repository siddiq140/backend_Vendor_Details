const Vendor = require('../models/Vendor')
const jwt =require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const dotEnv =require('dotenv')
  
dotEnv.config()
const secretKey = process.env.WhatIsYourName;

async function vendorRegister(req, res) {
  const { username, email, password } = req.body
  try {
    const VendorEmail = await Vendor.findOne({ email })

    if (VendorEmail) {
      return res.status(400).json('Email already taken')
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword
    })
    await newVendor.save()

    res.status(201).json({ meassage: "Vendor registered Succussfully" })
    console.log("Registered")
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const vendorLogin =async (req,res) => {
  const { email, password} =req.body;
  try{
    const vendor =await Vendor.findOne({email});
      if(!vendor || !(await bcrypt.compare(password,vendor.password))){
      return res.status(401).json({message : "Invalid username or Password"})
  }
  const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn :"1h"})
       res.status(200).json({message : "Login Successfully",token})
       console.log(email,"this is token",token)
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Internal server error"})
  }
}

const getAllvendors =async (req,res) =>{
  try{
    const vendors = await Vendor.find().populate('firm')
    res.status(200).json(vendors)
  }catch(error){
    console.error(error)
    res.status(500).json({error:"Internal server error"})
  }
}

const getVendorById = async (req,res) =>{
  const vendorId = req.params.vendorId;
  try {
    const vendor = await Vendor.findById(vendorId).populate('firm')
    if(!vendor){
      return res.status(404).json({message:"Vendor not found"})
    }
    return res.status(200).json(vendor)     
  } catch (error) {
    console.error(error)
    res.status(500).json({error:"Internal server error"})
  }
}
module.exports ={vendorRegister, vendorLogin,getAllvendors,getVendorById} 