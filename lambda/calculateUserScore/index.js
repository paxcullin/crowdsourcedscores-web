var mysql = require('mysql')

var con = mysql.createConnection({
    host: 'shs-extendedprofile.cl836yyaoxqh.us-west-2.rds.amazonaws.com',
    user: 'shs_admin',
    password: 'PC$MPassw0rd!',
    database: 'innodb'
});

con.connect((err) => {
    if (err) throw err;
    console.log('connected!')
    //var insert = "INSERT INTO extendedprofiles_score_overall (username, sport, year, predictionscore) VALUES ('cmaronchick', 'nfl', 2019, 0)";
    var select = 'SELECT username, predictionscore from extendedprofiles_score_overall'
    con.query(select, (err, result) => {
        if (err) throw err;
        console.log('1 record inserted: ', result)
        
    })


})