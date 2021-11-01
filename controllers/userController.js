const bcrypt = require('bcryptjs');
const users = require('./../models/userModel');

exports.UserRegister = async(req, res) => {
    try{
        const salt = await bcrypt.genSalt(11);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const savedPost = await new users({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            dob: req.body.dob,
            address: req.body.address,
            description: req.body.description,
            createdAt: req.body.createdAt
        });

        const resultPost = await savedPost.save();


        res.status(200).json({
            status: "success",
            resultPost
        });

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
        !user && res.status(400).json('wrong user');

        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json('wrong password');

        const {password, ...others} = user._doc;

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


