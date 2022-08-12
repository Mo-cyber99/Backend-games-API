const app = require('./app')

const { PORT = 37035 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));