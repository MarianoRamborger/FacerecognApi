

const handleRegister = (req, resp, dataBase, bcrypt, saltRounds) => {
    const { email, name, password } = req.body; //destructuring.
    if (!email || !name || !password) {
        return resp.status(400).json('incorrect form submission'); //return here evita que la funcion corra past la bad request en caso de que la gatille.
    }
     const hash = bcrypt.hashSync(password, saltRounds);
  { //Version sin destructuring
  //   database.users.push({
  //     id: "125",
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //     entries: 0,
  //     joined: new Date()
  }
  
      dataBase.transaction(trx => { //transaction from knex. So si CUALQUIER tabla falla en updatearse, la operacion entera falla.
          trx.insert({
  
                  hash: hash, //Estos van para login
                  email: email
              })
                  .into('login')
                  .returning('email')
                  .then(loginEmail =>{
  
                      return  dataBase('users') 
                      .returning('*')                                                 //knex function que retorna todas las columnas.
                      .insert({                                                       //OJO que esta es sintaxis del knex. Also password no va porque está en otra table.
                      email: loginEmail[0], //[0] para no mandar el array
                      name: name,
                      joined: new Date()
  
                      }).then(user =>{
                          resp.json(user[0]);
                      })
                  })
                  .then(trx.commit) // Si todo salió bien, los cambios stickean.
                  .catch(trx.rollback) 
      }) //Recien acá termina la transaction.
       
      .catch(err => {
          resp.status(400).json('The used email may already be in use. Please try another one')
      })
  
  
  }


  module.exports = {
    handleRegister: handleRegister
  };