const bcrypt = require('bcryptjs');
const users = require('./../models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.UserRegister = async(req, res) => {
    try{
        
        const salt = await bcrypt.genSalt(11);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

       const savedPost = await new users({
            username: req.body.username,
            email: req.body.email.tolowerCase(),
            password: hashedPass,
            dob: req.body.dob,
            address: req.body.address,
            token: req.body.token
        });

        if (!savedPost){
            res.status(400).json({message: "All Input is required"});
        }

        const oldUser = await user.findOne({email});

        if (oldUser) {
            res.status(409).json({message: "User Already Exist"});
        }

        if (savedPost){
            const resultPost = await savedPost.save();
            res.status(200).json({
                status: "success",
                resultPost
            });
        }

        const token = jwt.sign(
            {user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            });

            savedPost.token = token;

       
        

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
        const user = await users.findOne({username: req.body.username} || {email: req.body.email});
        !user && res.status(400).json('wrong username or email');

        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json('wrong password');

        const {password, ...others} = user._doc;

        const token = jwt.sign(
            {user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
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


