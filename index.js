// https://www.geeksforgeeks.org/how-to-upload-file-using-formidable-module-in-node-js/
// npm install formidable
// npm install express
// npm install fs
// npm install --save path

const express 	= require('express');
const fs 	  	= require('fs');
const path    	= require('path')
const dirTree 	= require("directory-tree");
const formidable= require('formidable');

const directoryPath = path.join(__dirname);
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

app.get('/api/dirtree', (req, res, next) => {
	const tree = dirTree(directoryPath);
	console.log(tree);
	res.status(200).send(tree);
});


app.get('/api/dir2', (req, res, next) => {
	const files = readFilesSync(directoryPath);
	console.log(files);

	// const targetDiv = document.getElementById("dirlist");
    // if (targetDiv.style.display !== "none") 
	// {
    //     targetDiv.style.display = "none";
    // } else {
    //     targetDiv.style.display = "block";
    // };
    




	res.status(200).send(files);
});



app.get('/api/dir', (req, res, next) => {

	// fs.readdir(directoryPath, function (err, files) {
	// 	if (err) {
	// 		return console.log('Erro: ' + err);
	// 	}
	
	console.log("---------------------------------");
	var ret = "<table><tr><td>Diretorio:</td><td>" + directoryPath.toString() + "</td><tr>";
	var tipo = "";

	fs.readdirSync(directoryPath).forEach(file => {
		if (fs.lstatSync(path.resolve(directoryPath, file)).isDirectory()) {
			console.log('Directory: ' + file);
			tipo = "Pasta:";
		} else {
			console.log('File: ' + file);
			tipo = "Arquivo:";
		}
		ret = ret + "<tr><td>" + tipo + "</td><td>" + file.toString() + "</td><tr>";
	});
	ret = ret + "</table>";

	console.log("================================");
	console.log(ret);

	// });
	res.status(200).send(ret);

});



app.post('/api/upload', (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		var oldPath = files.profilePic.filepath;
		console.log("OLDPATH-Recebido: ", oldPath);
		var newPath = path.join(__dirname, 'uploads') + '\\' + files.profilePic.originalFilename;
		console.log("NEWPATH-SalvoUploads: ", newPath);

		//==  Grava na pasta o arquivo recebido == 
		var rawData = fs.readFileSync(oldPath)
		fs.writeFile(newPath, rawData, function (err) {
			if (err) console.log(err)

			var ret = "<table><tr><td colspan=2>"
			ret = ret + "ARQUIVO RECEBIDO COM SUCESSO ! </td></tr>";
			ret = ret + "<tr><td>Nome</td><td>" + files.profilePic.originalFilename + "</td></tr>";
			ret = ret + "<tr><td>Tipo</td><td>" + files.profilePic.mimetype + "</td></tr>";
			ret = ret + "<tr><td>Tamanho</td><td>" + files.profilePic.size + "</td></tr>";

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
app.listen(port, function (err) {
	if (err) console.log(err)
	console.log('Servidor de Envio Ativado | http://localhost:3000');
});





/**************************************************************************************************************************
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 * https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
 * const files = readFilesSync('absolute/path/to/directory/');
 ***************************************************************************************************************************
 */
 function readFilesSync(dir) {
	const files = [];
  	fs.readdirSync(dir).forEach(filename => {
	  const name = path.parse(filename).name;
	  const ext = path.parse(filename).ext;
	  const filepath = path.resolve(dir, filename);
	  const stat = fs.statSync(filepath);
	  const isFile = stat.isFile();
      var status = "folder";
	  if(isFile){
		status = fs.statSync(filepath);
	  }

	  // Só Arquivos
	  //if (isFile) files.push({ filepath, name, ext, stat });

	  files.push({ filepath, name, ext, isFile, status });

	});
  
	files.sort((a, b) => {
	  // natural sort alphanumeric strings
	  // https://stackoverflow.com/a/38641281
	  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
	});
  
	return files;
  }