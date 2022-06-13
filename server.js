console.log('node is working'); //runs everytime node is running the server

const express = require('express'); //module that allows us to use express inside of node.
const bodyParser = require('body-parser') //module that creates a body object for form data.
const MongoClient = require('mongodb').MongoClient //module that has a lot of methods for our database extraction.
const app = express();  //what type of app we are using. in this case we are running node through express so we set our app to express.


MongoClient.connect('', { useUnifiedTopology:
true }) //connects our mongoDB to our server. the second parameter gets rid of the need for callbacks and sets our mongoclient to use Promise syntax.
    
    .then(client => {
        console.log('Connected to DB')
        const db = client.db('LeetQuotes')
        const quotesCollection = db.collection('quotes')
    
    app.set('view engine', 'ejs',) // this will set our app to view our ejs file over our index file.
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json()) //Must use before all other CRUD handlers.
    app.use(express.static('public'))

    app.get('/', (req, res) => {
        //res.sendFile(__dirname + '/index.html') //serving up the index file from the directory we are currently in.
        db.collection('quotes').find().toArray()
            .then(quotes => {
                res.render('index.ejs', { quotes: quotes }) //this will render our ejs file and allow us to use our quotes in the file.
            })
            .catch(error => console.error(error))
    })

    app.post('/quotes', (req,res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')// this will redirect us back to the main domain after we submit a form.
            })
            .catch(err => console.error(err))
        //console.log('Hellllloooooo') //sends this log everything we submit something to the form to let us know the form is running.
        //console.log(req.body) //The bodyParser module create an bodyObj to store the form data. We are requesting the form data from the body object.
    })

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Jacob' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
        })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
          { name: req.body.name }
        )
        .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Jacob's quote`)
          })
          .catch(error => console.error(error))
      })

    app.listen(8000, function() {
        console.log('listening on 8000') //tells our browser where we can run this port from.
    });
}) //this is the wrapper from the MongoClient conection for all of the CRUD handlers.
    .catch(err => console.error(err))





