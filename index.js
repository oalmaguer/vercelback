// const axios = require('axios');
import axios from 'axios';
import { OpenAI, PromptTemplate } from "langchain";
import { StructuredOutputParser, OutputFixingParser } from "langchain/output_parsers";
import { SerpAPI, Calculator } from "langchain/tools";
import * as dotenv from "dotenv";
dotenv.config();

// const configurationa = new Configuration({
//     organization: "org-fnANBh9V0ypwCz9MZxvgAwT4",
//     apiKey: process.env.API_KEY,
// });

import express from 'express';
import cors from 'cors';
// const express = require('express')
const app = express()


// const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// const querystring = require('querystring');
import querystring from 'querystring';




app.use(express.json());
app.use(cors(corsOptions));

app.options("*",function(req,res,next){
  res.header("Access-Control-Allow-Origin", req.get("Origin")||"*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   //other headers here
    res.status(200).end();
});
  
  // var distDir = __dirname + "/dist/angular-test";
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

  
// app.use(express.static(distDir));

const PORT = process.env.PORT || 3000;
// const model = new OpenAI({temperature: 0.5});
// const res = await model.call("What is the capital city of france");
const giphyUrl = 'https://api.giphy.com/v1/gifs/search';

//LANGCHAIN STARTS ////////////////////////////////////////////////////////////////////
const model = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9, maxTokens: 1024});
// const tools = [new SerpAPI()];

app.post('/getSongs', async(req, res) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
      song: "name of the song",
      artist: "the artist of the song",
      youtubeLink: "the youtube link of the song",
    });
  
    const formatInstructions = parser.getFormatInstructions();
  
    const prompt = new PromptTemplate({
      template:
        `Give the user recommendations as best as possible.\n{format_instructions}\n{question}`,
      inputVariables: ["question"],
      partialVariables: { format_instructions: formatInstructions },
    });
  
    const input = await prompt.format({
      question: `Recommend me a list of 7 songs if my favorite song is ${req.body.song} by ${req.body.artist}, try to avoid songs from the same artist, return an array of objects`,
    });
    const response = await model.call(input);
    var newStr = response.replace(/`/g, "").replace(/json/g, "")
    res.send(JSON.stringify(newStr));
});


//LANGCHAIN FINISH ////////////////////////////////////////////////////////////////////


app.get('/test', (req, res) => {
    res.send('Hello World');
})

/////////////// REPLACED FOR LANGCHAIN ///////////////// BUT I STILL WANT THE CODE FOR FUTURE REFERENCE

// const response = await openai.listEngines();
// app.post('/songs', async(req, res) => {
//     let data = {
//         "model": "gpt-3.5-turbo",
//         "messages": [{"role": "user", "content":
//         `Recommend me a list of 10 songs if my favorite song is ${req.body.song} from ${req.body.artist}, do not include any explanations, also try to not add songs from the same artist. 
//         Only Return a JSON object with the songs in the following format:
//         {"data": [
//             {
//                     "songName": "the name of the song",
//                 "songArtist": "the name of the artist"
//             }
//         ]
//         };

//         Do not explain anything else.
//         `}],
//     }
//     axios.post('https://api.openai.com/v1/chat/completions', data, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         }
//     })
//     .then(elem => {
//         res.send(elem.data.choices[0]);
//     }).catch(err => res.send(err));
// })

app.get('/auth_window', (req, res) => {
  var client_id = process.env.SPOTIFY_CLIENT_API_KEY;
var redirect_uri = 'http://localhost:3000/callback';

  // var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    }));
});

app.get('/spotify_token', (req, res) => {
  let data;
  let params = {
    grant_type: 'client_credentials',
  }

  var cliente = process.env.SPOTIFY_CLIENT_API_KEY;
  var secreto = process.env.SPOTIFY_SECRET_API_KEY;

    const headers = {
      Authorization: 'Basic ' + btoa(cliente + ':' + secreto),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    axios
      .post('https://accounts.spotify.com/api/token', params, {
        headers: headers,
      })
      .then((elem) => {
        data = elem.data.access_token;
        res.send(JSON.stringify(data));
      }).catch(err => res.send(err));
    })


    app.get("/gif", (req, res) => {
      let gif;
      axios.get(`${giphyUrl}?api_key=${process.env.GIPHY_API_KEY}&q=robots&limit=15`)
      .then(elem => {
        gif = elem.data
          res.send(gif);
        })
        
    })

    app.get("/", (req, res) => {
        res.send("Pagina inicio");
    })


app.listen(PORT, () => {
  console.log(`App app listening on port ${PORT}`)
})

//how can I enable CORS in this code