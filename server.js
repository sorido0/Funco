import express from "express";
import mysql2 from "mysql2";
import {z} from "zod";

const app = express();
const port = 5000 || 0;


const db= mysql2.createConnection({
    host:"junction.proxy.rlwy.net",
    port:"13897",
    user: "root",
    password:"XtudGvMsZzfBLxScBwEPgJlZnVRRoPHI",
    database:"railway"
})

db.connect(err =>{
    if(err){
        console.error("Error al conectarse a la base de datos "+ err);
        return
    }
    console.info("conexion exitosa");
});


app.use(express.static("public"));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Soy Naruto");
} )

//Crear CRUD
app.get('/articulos',(req,res)=>{
    db.query("Select * from Articulos",(err,result)=>{
        if(err) return res.status(500).send(err);
        res.json(result);
        console.info(result);

    })
})

//leer articulos por id
app.get("/articulo/:id",(req,res)=>{
    const {id}= req.params;
    db.query("select *from Articulos where id= ?",[id],(err,result)=>{
        if(err) return res.status(500).send(err);
        if(result.length===0) return res.status(404).send(500);
        res.json(result);
        console.info(result);
    })
})

app.put("/articulos/:id",(req,res)=>{
    const {id} = req.params;
    const{Nombre,Descripcion,Imagen,Precio,Categoria,Cantidad}= req.body;

    const query = `update Articulos set
                    nombre = ?,
                    Descripcion= ?,
                    Imagen = ?,
                    Precio = ?,
                    Categoria = ?,
                    Cantidad=?,
                    where id = ?
                    `;

    db.query(query,[Nombre,Descripcion,Imagen,Precio,Categoria,Cantidad,id],(err, res)=>{
        if(err) return res.status(500).send(err);

        if(res.affectedRows === 0) return res.status(404).json({message:"Articulo no Encontrado"});

        res.status(202).json({message:"Actualizado"});
    })
})

app.listen(port,()=>{
    console.info(`Estoy escuchando en el puerto ${port}`);
})
