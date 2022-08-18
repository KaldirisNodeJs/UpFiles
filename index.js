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
        var rawData = fs.readFileSync(oldPath)
        //console.log("RAW DATA",rawData);
		fs.writeFile(newPath, rawData, function(err){
			if(err) console.log(err)
			return res.send(files);
		});

		// // Lendo o arquivo gravado
		// if (fs.existsSync(newPath))
		// {
		// 	fs.readFile(newPath,(err,data)=>{
		// 		if(err){
		// 			consol.log(err);
		// 		}else{
		// 			const stat = fs.statSync(newPath);
		// 			res.contentType('application/pdf');
		// 			res.setHeader('Content-Length', stat.size);
		// 			res.setHeader('Content-Type', 'application/pdf');
		// 			res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
		// 			// *Should force download the file to the browser*
		// 			res.download(newPath, 'report.pdf', function(e) {
		// 				if (e){
		// 					console.log("Erro:",e.message);
		// 				}else{
		// 					console.log("OK");
		// 				}
		// 			});
		// 		}
		// 	});
		// }

		



    })
});


// Aciona o Servidor ===============================================
app.listen(port, function(err){
	if(err) console.log(err)
	console.log('Servidor de Envio Ativado | http://localhost:3000');
});