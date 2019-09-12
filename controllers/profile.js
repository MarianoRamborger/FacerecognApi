const handleProfile = (req, resp, dataBase) => { //lets us grab the id through request response-
    const {id} = req.params;
    
    
    dataBase.select('*').from('users').where({
        id: id //esta id es la recibida en params.
    })
    .then(user => {
        if (user.length) {
            resp.json(user[0]) 
        } else {
            resp.status(400).json('Error getting user'); 
        }
    
    })
}

module.exports = {
    handleProfile : handleProfile
}