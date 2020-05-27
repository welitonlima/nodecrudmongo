const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const url = 'mongodb+srv://admin:iXFvKt1d1SbN1iOq@cluster0-kiuls.gcp.mongodb.net/test?retryWrites=true&w=majority'
const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(url, options)
.then(() => console.log("Concectou ao banco de dados"))
.catch((err) => console.log(err));

const User = require("./models/User");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get("/users/:campo/:crescente", async (req, res) => {
    const campo = req.params.campo;
    const crescente = req.params.crescente;    

    //console.log(campo + crescente);

    let users;

    if(campo == 'nome')
    {
        users = await User.find({}).sort({nome: crescente});
    }
    else if(campo == 'email')
    {
        users = await User.find({}).sort({email: crescente});
    }   

    res.json(users);
});

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    User.findById( userId , (err, data) => {
        if(err){
            return res.status(400).send({ error: "Usuário não cadastrado." });
        }
        res.json(data);
    });
    
});

app.post('/users', async (req, res) => {    

    const {nome, email, senha } = req.body;

    // testar campos se estao fazios

    const newUser = {};
    newUser.nome = nome;
    newUser.email = email;
    newUser.senha = senha;
    
    const userBusca = await User.findOne({email});

    if(userBusca == null){
        const user = await User.create(newUser , async (err, data) => {
            if(err){
                return res.status(404).send({ error: "Usuário não foi cadastrado." });
            }

            //res.json(user);
            return res.status(201).send();
        });        
        
    }
    else{
        return res.status(400).send({ error: "Email já cadastrado." });
    }
});

app.put('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const fields = req.body;    

    console.log(userId);
    console.log(fields);

    await User.update( {_id:userId} , fields);
});

app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    User.findById( userId , async (err, data) => {
        if(err){
            return res.status(400).send({ error: "Usuário não cadastrado." });
        }        
                
        const userDeletado = await User.findByIdAndDelete(userId);

        if(userDeletado != undefined){
            return res.status(200).send();
        }

    });    
});



app.listen(process.env.PORT||port, () => console.log(`Example app listening at http://localhost:${port}`));