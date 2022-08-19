// https://www.geeksforgeeks.org/how-to-upload-file-using-formidable-module-in-node-js/
// npm install formidable
// npm install express
// npm install fs
// npm install --save path

const express = require('express');

const fs = require('fs');

const path = require('path')

const formidable = require('formidable');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('public'));

//===================================================================
// EndPoint de Envio
// Enviar com nome do campo em file = profilePic
//===================================================================

app.get('/', (req, res) =>
	//res.send("<h3>Upload Js - Formidable</h3><p>Bem Vindo<br>Use Postman para testes</p>")
	//res.sendFile( path.resolve('src/app/index.html') );
	//res.sendFile(path.join(__dirname, '../public', 'index1.html'));
	//res.sendFile('index.html', { root: __dirname })
	//res.sendFile( `${process.cwd()}/public/index1.html` );
	res.status(200).sendFile(path.join(__dirname, '/form_upload.html'))
);


app.post('/api/upload', (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
        var oldPath = files.profilePic.filepath;
        console.log("OLDPATH-Recebido: ",oldPath);
		var newPath = path.join(__dirname, 'uploads') + '\\'+files.profilePic.originalFilename;
        console.log("NEWPATH-SalvoUploads: ",newPath);
        
		//==  Grava na pasta o arquivo recebido == 
		var rawData = fs.readFileSync(oldPath)
		fs.writeFile(newPath, rawData, function(err){
			if(err) console.log(err)

			var   ret = "<table><tr><td colspan=2>"
			ret = ret + "ARQUIVO RECEBIDO COM SUCESSO ! </td></tr>";
			ret = ret + "<tr><td>Nome</td><td>"+files.profilePic.originalFilename + "</td></tr>";
			ret = ret + "<tr><td>Tipo</td><td>"+files.profilePic.mimetype + "</td></tr>";
			ret = ret + "<tr><td>Tamanho</td><td>"+files.profilePic.size + "</td></tr>";
						
			//=== OK ===
			//var data =fs.readFileSync(newPath);
			//console.log(files.profilePic.mimetype);
			//res.contentType(files.profilePic.mimetype);
			//== Envia direto para o Browse ==
			//res.send(data);
			//res.end();
			//== Faz o Download do Arquivo Recebido ==
			//res.download(newPath);

			res.send(ret);

		});

		
		
		



    })
});


// Aciona o Servidor ===============================================
app.listen(port, function(err){
	if(err) console.log(err)
	console.log('Servidor de Envio Ativado | http://localhost:3000');
});