const { Configuration, OpenAIApi } = require('openai')
const axios = require('axios');
const bodyParser = require('body-parser')
require('dotenv').config();
const configurationa = new Configuration({
    organization: "org-fnANBh9V0ypwCz9MZxvgAwT4",
    apiKey: process.env.API_KEY,
});

const express = require('express')
const app = express()


const cors = require('cors');
app.use(cors({
    origin: '*'
}));

  app.use(express.json());
var distDir = __dirname + "/dist/angular-test";

const PORT = process.env.PORT || 3000;
const openai = new OpenAIApi(configurationa);

app.get('/test', (req, res) => {
    res.send('Hello World');
})
// const response = await openai.listEngines();
app.post('/songs', async(req, res) => {
    console.log("Body: ", req.body);

    let data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content":
        `Recommend me a list of songs if my favorite song is ${req.body.song} from ${req.body.artist}, do not include any explanations, also try to not add songs from the same artist. 
        Only Return a JSON object with the songs in the following format:
        {"data": [
            {
                    "songName": "the name of the song",
                "songArtist": "the name of the artist"
            }
        ]
        };

        Do not explain anything else.
        `}],
    }
    axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
           
        }
    })
    .then(elem => {
        console.log(elem.data.choices[0]);
        res.send(elem.data.choices[0]);
    })

})

app.post('spotify_token', async(req, res) => {


    console.log(req.body.params)

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
          return elem.data.access_token;
        });
  
})

// app.use(express.static(distDir));
console.log(distDir);
app.get("/", (req, res) => {
    res.send("Pagina inicio");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})