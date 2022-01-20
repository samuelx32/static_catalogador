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

var sit = "deslogado";
var msg;
var id_atual = 0;
var usuario_atual = "";
//ROTAS

server.get ('/login', (req,res) => {
    res.render('login');
})

server.get ('/cadastro', (req,res) => {
    res.render('cadastro');
})

server.post ('/valida-login', (req,res) => {
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    connection.query('SELECT * FROM usuarios WHERE usuario=? AND senha=?',[usuario, senha], function (error, results) {
        if (error || results == ""){
            msg = "Usuário ou Senha, Inválidos";
            res.render('login', {msg, titulo: 'St4tic'});
        }else{
            results.map(function(item){
                id_atual = item.id_usuario;
                usuario_atual = item.usuario;
            })
            sit = "logado";
            res.redirect('/');
        }
    });
})

server.post('/criar-login', (req, res) => {
    msg = "Criado";
    connection.query('INSERT INTO usuarios (nome, usuario, senha) values (?, ?, ?)', [req.body.nome, req.body.usuario, req.body.senha],function (error, results, fields) {
        if(error){
            msg = "Erro: "+error;
        }
        res.render('login', { msg, titulo: 'St4tic' });
    })
})



server.get('/', (req, res) => {
    if(sit == "logado"){
        connection.query('SELECT * FROM livros WHERE id_usuario=?',[id_atual], function (error, results, fields) {
            var livros = results;
            res.render('index', { livros, titulo: 'St4tic', usuario_atual });
        })
    }else{
        res.render('login');
    }
    
})

server.get('/formulario', (req, res) => {
    if(sit == "logado"){
       res.render('formulario',{titulo: 'Formulário'});
    }else{
        res.render('login');
    }
})

server.post('/adicionar-livro', (req, res) => {
    msg = "Adicionado";
    connection.query('INSERT INTO livros (nome, autor, tipo, id_usuario) values (?, ?, ?, ?)', [req.body.nome, req.body.autor, req.body.tipo, id_atual],function (error, results, fields) {
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
    msg = "Alterado";
    connection.query('UPDATE livros set nome=?, autor=?, tipo=? WHERE id_livros=?', [req.body.nome, req.body.autor, req.body.tipo, req.body.id],function (error, results, fields) {
        if(error){
            msg = "Erro: "+error;
        }
        res.render('resposta', { msg, titulo: 'St4tic Alterar' });
    })
})

server.post('/deletar-livro', (req, res) => {
    msg = "Deletado";

    connection.query('DELETE FROM livros WHERE id_livros=?',[req.body.id], function(error,results,fields){
        if(error){
            msg = "Não foi excluído: "+error;
        }
        res.render('resposta', { msg, titulo: 'Deletado' });
    })
})

server.post('/pesquisa-livro', (req, res) => {
    const id = req.body.id;
    msg;

    connection.query('SELECT * FROM livros WHERE id_livros='+id, function (error, results, fields) {
        var selecionado = results;
        if (error || results == ""){
            msg = "Nada Encontrado: \n" + error;
        }
        res.render('index', { selecionado, msg, titulo: 'Pesquisa' });
    });
})

server.get ('/sair', (req,res) => {
    sit = "deslogado";
    id_atual = 0;
    usuario_atual = "";
    res.render('login');
})

server.listen(3000); 