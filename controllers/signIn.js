
const handleSignIn = (req, resp, dataBase, bcrypt, saltRounds) => {
const {email, password} = req.body;
if (!email || !password) {
    return resp.status(400).json('incorrect form submission'); //return here evita que la funcion corra past la bad request en caso de que la gatille.
}

 dataBase.select('email', 'hash').from('login')
.where(
    'email', '=', email
)
.then(data =>{
   const isValid = bcrypt.compareSync(password, data[0].hash); //El 0 nos evita pickear el array, getteamos el primer elemento y hash
   if (isValid) {

      return dataBase.select('*').from('users')
       .where('email', '=', email) //saca todo de users donde el mail coincida
       .then(user =>{
        resp.json(user[0])
       
       })
       .catch(err =>{
        resp.status(400).json("unable to get user")
       })
     
   }
   else resp.status(400).json("invalid username and/or password. ")
})
.catch( err => {
    resp.status(400).json('Wrong credentials')
})
}

module.exports = {
    handleSignIn : handleSignIn
}