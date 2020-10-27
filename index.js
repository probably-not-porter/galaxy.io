console.log("\n==================================");
console.log("|           GALAXY.IO            |");
console.log("==================================\n");

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index",{
    })
});
app.use(express.static(__dirname + '/public'));


// LISTEN
app.listen(process.env.PORT || 9900, function(){
    console.log("Server: Running on port %d in %s mode", this.address().port, app.settings.env);
});
