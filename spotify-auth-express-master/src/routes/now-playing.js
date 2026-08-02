const axios = require('axios')

const analysisCache = new Map()

module.exports = app => {
  const { root, id, secret, spotifyTokenUrl } = app._config

  app.get(`${root}/now-playing`, async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization || ''

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401)
      res.json({ success: false, error: 'No token supplied.' })
      return
    }

    const token = authHeader.slice(7)

    try {
      const nowPlayingResponse = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (nowPlayingResponse.status === 204) {
        res.status(204)
        return
      }

      const nowPlayingData = nowPlayingResponse.data
      const track = nowPlayingData.item

      if (!track || !track.id || !nowPlayingData.is_playing) {
        res.status(200)
        return res.json({
          track: {
            item: track || {},
            timestamp: nowPlayingData.timestamp || Date.now()
          },
          isPlaying: false,
          audioAnalysis: { segments: [], beats: [] }
        })
      }

      let analysis = analysisCache.get(track.id)

      if (!analysis) {
        try {
          const analysisResponse = await axios({
            method: 'get',
            url: `https://api.spotify.com/v1/audio-analysis/${track.id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          analysis = {
            segments: analysisResponse.data.segments || [],
            beats: analysisResponse.data.beats || []
          }

          analysisCache.set(track.id, analysis)
        } catch (analysisError) {
          console.error('Failed to fetch audio analysis:', analysisError.message)
          analysis = { segments: [], beats: [] }
        }
      }

      res.status(200)
      res.json({
        track: {
          item: track,
          timestamp: nowPlayingData.timestamp || Date.now()
        },
        isPlaying: nowPlayingData.is_playing,
        audioAnalysis: analysis
      })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        res.status(401)
        res.json({ success: false, error: 'Token expired.' })
        return
      }

      console.error('Now-playing error:', error.message)
      res.status(500)
      res.json({ success: false, error: 'Failed to fetch now playing.' })
    }
  })
}
