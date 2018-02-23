let express = require('express')
let bodyParser = require('body-parser')
let path = require('path')
let mongoose = require('mongoose')
let app = express()
app.use(bodyParser.json())
app.use(express.static(__dirname + "/client/dist"))

mongoose.connect('mongodb://localhost/pets')

let PetSchema = new mongoose.Schema({
    name: { type: String, minlength: [3, "pet name must be 3 char's long"] },
    type: { type: String, minlength: [3, "pet type must be 3 char's long"] },
    desc: { type: String, minlength: [3, "pet desc must be 3 char's long"] },
    skills: [],
    like : Number,
}, { timestamps: true })

let Pet = mongoose.model("pet", PetSchema)


//show all
app.get("/pets", function (req, res) {
    Pet.find({}, function (err, data) {
        if (err) {
            res.json({
                message: 'app.get/pets',
                error: err
            })
        } else {
            res.json({ db: data })
        }
    })
})

//add one
app.post('/pets', function (req, res) {
    if(req.body.name.length < 3){
        console.log('got error server');
        res.json({error:"custommmmm pet name has to be more than 3 char"})
    } if (req.body.type.length < 3) {
        console.log('got error server');
        res.json({ error: "custommmmm pet type has to be more than 3 char" })
    } if (req.body.desc.length < 3) {
        console.log('got error server');
        res.json({ error: "custommmmm pet description has to be more than 3 char" })
    }else{
        let pet = new Pet({
            name : req.body.name,
            type : req.body.type,
            desc : req.body.desc,
            skills : req.body.skills,
            like : 0,
        })
        pet.save(function (err, data) {
            if (err) {
                res.json({
                    message: 'app.post/pets',
                    error: err
                })
            } else {
                res.json({ success: data })
            }
        })
    }
})

//find One
app.get('/pets/:id', function (req, res) {
    Pet.findById({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            res.json({
                message: 'app.get/pets/:id',
                error: err
            })
        } else {
            res.json(data)
        }
    })
})

//update one
app.put('/pets/:id', function (req, res) {
    Pet.findByIdAndUpdate({ _id: req.params.id }, req.body, function (err, data) {
        if (err) {
            res.json({
                message: 'app.put/pets/:id',
                error: err
            })
        } else {
            res.json({ success: data })
        }
    })
})

//delete one
app.delete('/pets/:id', function (req, res) {
    Pet.findByIdAndRemove({ _id: req.params.id }, function (err, data) {
        if (err) {
            res.json({
                message: 'app.delete/pets/:id',
                error: err
            })
        } else {
            res.json({ success: data })
        }
    })
})

// catch ALL

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve('./client/dist/index.html'))
})

//port number
app.listen(8000)



