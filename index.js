const express = require('express');
const server = express();
const router = express.Router();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const mysql = require('mysql');

server.use(express.json());
server.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
server.set('view engine', 'handlebars');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static('public'));


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pantera2256!',
    database : 'livraria'
})

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
    }else{
        console.log('connected as id ' + connection.threadId);
    }
})

//ROTAS


server.get('/', (req, res) => {
    connection.query('SELECT * FROM livros', function (error, results, fields) {
        var livros = results;
        res.render('index', { livros, titulo: 'St4tic' });
    })
})

server.get('/formulario', (req, res) => {
    res.render('formulario',{titulo: 'Formulário'});
})

server.post('/adicionar-livro', (req, res) => {
    var msg = "Adicionado";
    connection.query('INSERT INTO livros (nome, autor, tipo) values (?, ?, ?)', [req.body.nome, req.body.autor, req.body.tipo],function (error, results, fields) {
        if(error){
            msg = "Erro: "+error;
        }
        res.render('resposta', { msg, titulo: 'St4tic' });
    })
})

server.post('/alterar-livro', (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    var autor = req.body.autor;
    var tipo = req.body.tipo;
    res.render('alterarLivro',{id, nome, autor, tipo, titulo: 'Formulário'});
})

server.post('/alterar-livro-exe', (req, res) => {
    var msg = "Alterado";
    connection.query('UPDATE livros set nome=?, autor=?, tipo=? WHERE id_livros=?', [req.body.nome, req.body.autor, req.body.tipo, req.body.id],function (error, results, fields) {
        if(error){
            msg = "Erro: "+error;
        }
        res.render('resposta', { msg, titulo: 'St4tic Alterar' });
    })
})

server.post('/deletar-livro', (req, res) => {
    var msg = "Deletado";

    connection.query('DELETE FROM livros WHERE id_livros=?',[req.body.id], function(error,results,fields){
        if(error){
            msg = "Não foi excluído: "+error;
        }
        res.render('resposta', { msg, titulo: 'Deletado' });
    })
})



server.listen(3000); 