const mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb://159.223.169.216:27017/?directConnection=true", {useUnifiedTopology: true},
                                    (erro, banco) => {
                                        if(erro) return console.log(error)
                                        dbo = banco.db('zeporlitro')
                                        console.log('banco de dados conectado!')
                                    });

module.exports = {}