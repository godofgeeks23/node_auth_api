const router = require('express').Router();
const user = require('../model/user');
const {registervalidation, loginvalidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {

    const {error} = registervalidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    // check if user already exists
    const emailexist = await user.findOne({email: req.body.email});
    if(emailexist)
        return res.status(400).send("email already exists!");

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    const new_user = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashedpassword
    });
    try{
        const saveduser = await new_user.save();
        res.send(saveduser);
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const {error} = loginvalidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const thisuser = await user.findOne({email: req.body.email});
    if(!thisuser)
        return res.status(400).send("email does not exists!");
    const validpass = await bcrypt.compare(req.body.password, thisuser.password);
    if(!validpass) 
        return res.status(400).send("invalid password");

    // create a jwt token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
    res.send('Logged in!');
})

module.exports = router;
