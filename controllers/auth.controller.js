
module.exports.register = async(req, res) => {
    const {password, email, name} = req.body;
    console.log(req.body)
    try{
      const exists = await usersCollection.findOne({email});
    if(exists){
      res.json({"error": "Authentication failed"})
      return;
    }      
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {name, email, password: hashedPassword};
    const result = await usersCollection.insertOne({...user, role: 'user'});
      // generate token
      const token =  jwt.sign({userName: user.name, userId: result.insertedId}, process.env.JWT_SECRET, {
        // expiresIn: '1h'
      });
      res.status(200).json({
        name: user.name,
        email: user.email,
        accessToken:token,
        _id: result.insertedId,
        role: 'user'
      })
    }
    catch{
      res.json({"error": "Authentication failed"})
    }
}

module.exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await usersCollection.findOne({email});
        const isValidPassword = bcrypt.compare(password, user.password);
        if(isValidPassword){
          // generate token
          const token = jwt.sign({userName: user.name, userId: user._id}, process.env.JWT_SECRET, {
            // expiresIn: '1h'
          });
          console.log('inside', token)
          res.status(200).json({
            name: user.name,
            email: user.email,
            accessToken:token,
            role: user.role,
            _id: user._id
          })
        }
        else{
          res.status(401).json({
            "error": "Authentication failed",
          })
        }
        }
        catch{
          res.status(401).json({
            error: "Authentication failed"
          })
        }  
}