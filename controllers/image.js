const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '030a0b2c980b4ed8a51379b71c3f36dd'
})

const handleApiCall = (req, resp) => {

    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) //toma 3 arguments. La key que está declarda mas arriba, el modo y la imagen. 
     
    .then(data => {
            
   
            resp.json(data);
            
        })
        .catch(err =>
            resp.status(400).json('unable to connect to API'))
}


    

const handleImage = (req, resp, dataBase) => {
    
    const {id} = req.body; //porque la id va en el body

    dataBase('users').where('id', '=', id) //un solo = porque es sql
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        resp.json(entries[0])
    })
        .catch(err => {
            resp.status(400).json('Sorry. There was a problem processing your request')
        })
    }

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall    
}