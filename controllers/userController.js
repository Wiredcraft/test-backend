const bcrypt = require('bcryptjs');
const users = require('./../models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.UserRegister = async(req, res) => {
    try{
        const salt = await bcrypt.genSalt(11);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const NewUser = await new users({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            passwordConfirm: hashedPass,
            dob: req.body.dob,
            address: req.body.address,
        });

      
        if (!NewUser){
            res.status(400).json({message: "All Input is required"});
        }

        const oldUser = await users.findOne({email: NewUser.email});

        if (oldUser) {
            res.status(409).json({message: "User Already Exist"});
        }

        const token = jwt.sign(
            { id: NewUser._id },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_TIME,
            });
    
            NewUser.token = token;
            
        if (NewUser){
            const resultPost = await NewUser.save();
            res.status(200).json({
                status: "success",
                resultPost
            });
        }

        

    } catch(err){
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: err
        });
    }
};

exports.UserLogin = async(req, res)=>{
    try{
        const user = await users.findOne({username: req.body.username});
        !user && res.status(400).json('wrong username or email');

        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json('wrong password');

        const {password, passwordConfirm,...others} = user._doc;

        const token = jwt.sign(
            { id: user._id },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_TIME,
            });

        user.token = token;
        

        res.status(200).json({
            status: "success",
            others
        });

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
          });
    }
};

exports.getUser = async (req, res) => {
    try{
        const user = await users.findById(req.params.id);
        res.status(200).json({
            status: "user found",
            user
        });

    } catch(err){
        console.log(err)
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};
exports.getAllUser = async (req, res) => {
    try{
        const user = await users.find();
        res.status(200).json({
            status: "user found",
            user
        });

    } catch(err){
        console.log(err)
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.UpdateUser = async (req, res) => {
    try{
        const user = await users.findOneAndUpdate(req.params.username, req.body,{
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "user details updated",
            user
        });

    } catch(err){
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.DeleteUser = async (req, res) => {
    try{
        const user = await users.findOneAndDelete(req.params.username)

        res.status(200).json({
            status: `user ${user.username} deleted`
        });

    } catch(err){
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};


