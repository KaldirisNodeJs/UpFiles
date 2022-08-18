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

//===================================================================
// EndPoint de Envio
// Enviar com nome do campo em file = profilePic
//===================================================================

app.get('/', (req, res) =>
res.send("<h3>Upload Js - Formidable</h3><p>Bem Vindo<br>Use Postman para testes</p>")
);


app.post('/api/upload', (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		// var oldPath = files.profilePic.path;
        // var oldPath ='C:\\00_GREGO\\NODE\\Formidable_2\\uploads\\';
        var oldPath = files.profilePic.filepath;
        console.log("OLDPATH-Recebido: ",oldPath);
		var newPath = path.join(__dirname, 'uploads') + '/'+files.profilePic.originalFilename;
        console.log("NEWPATH-SalvoUploads: ",newPath);
        var rawData = fs.readFileSync(oldPath)
        //console.log("RAW DATA",rawData);
		fs.writeFile(newPath, rawData, function(err){
			if(err) console.log(err)
			return res.send("Recebido com Sucesso.")
		})
    })
});


// Aciona o Servidor ===============================================
app.listen(port, function(err){
	if(err) console.log(err)
	console.log('Servidor de Envio Ativado | http://localhost:3000');
});