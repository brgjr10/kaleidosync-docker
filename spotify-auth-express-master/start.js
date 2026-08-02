const spotify = require('./index');

const app = spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
  port: 2223,
  root: '/api/spotify'
});

app.listen(2223, () => console.log('Spotify API running on 2223'));
