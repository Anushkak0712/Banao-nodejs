const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const fs = require('fs');
const path = require('path');
const crypto=require('crypto');
const auth=require('./auth')

const usersFile = path.join(__dirname, './users.json');

const readUsersFile= ()=>{
    const data = fs.readFileSync(usersFile,'utf8');
    return JSON.parse(data);
};

const writeUsersFile= (data)=>{
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
};

function generateBackupCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); 
  }
  
  function generateBackupCodes(count) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(generateBackupCode());
    }
    return codes;
  }

router.post('/register',(req,res)=>{
    const {username,email,password}=req.body;
    const users=readUsersFile();
    const userExists=users.some(user=>user.username===username);
    const emailUsed=users.some(user=>user.email===email);
    if(userExists){
        res.status(400).json({message:'User already exists!...try again with another username'});
    }
    else if(emailUsed){
        res.status(400).json({message:'Email already in use!...use another email'});
    }
    else{
        const backupCodes = generateBackupCodes(4);
        const salt=bcrypt.genSaltSync(10);
        const hash=bcrypt.hashSync(password,salt);
        users.push({username,email,password:hash,backupCodes});
        writeUsersFile(users);
        const payload = {
          username
        };
        const token = auth.generateToken(payload);
        res.cookie('jwt', token);
        res.status(201).json({
            message:'User created successfully!....Store the provided backup codes to use as authentication if you ever need to reset password.',
            backupCodes:backupCodes});
        
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsersFile();
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong password' });
    }
    const payload = {
      username
    };
    const token = auth.generateToken(payload);
    res.cookie('jwt', token);
    res.status(200).json({ message: 'Login successfull' });
  });
  
  router.post('/reset-password', (req, res) => {
    const { username, backupCode, newPassword } = req.body;
  
    const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
    const userIndex = users.findIndex(u => u.username === username);
  
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const user = users[userIndex];
  
    if (!user.backupCodes.includes(backupCode)) {
      return res.status(400).json({ message: 'Invalid backup code' });
    }
    const salt=bcrypt.genSaltSync(10);
    const hash=bcrypt.hashSync(newPassword,salt);
    user.password =hash ;
    users[userIndex] = user;
    fs.writeFileSync('users.json', JSON.stringify(users));
  
    return res.status(200).json({ message: 'Password reset successfully' });
  });
  router.get('/logout', function(req, res, next) {
    try {
      res.clearCookie('jwt');
      console.log('logged out succesfully');
      res.status(200).json({message:"logged out successfully"});
    } catch (error) {
      console.log(error)
    }
    
  });

module.exports=router;

/* sample request data
1. register user
{
    "username":"test_10",
    "email":"test10@xyz.com",
    "password":"xyz123"
}

2. login user
{
    "username":"test_10",
    "password":"xyz123"
}

3. reset password
{
    "username":"test_10",
    "backupCode": ,
    "newPassword":"xyz1234"
}
    ENTER BACKUP CODE FROM USERS.JSON
*/