const MongoClient = require('mongodb').MongoClient;

const { config } = require('./config');
const MONGO_URL = `mongodb+srv://${config.username}:${config.password}@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority`;

// exports.handler = async (event, context) => {
async function generateNFLschedulepicker() {
    try {
        // Connection URL

        // Connect to MongoDB
        const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });

        // Access the database
        const db = client.db('pcsm');

        // Perform database operations
        const games = await db.collection('games').find({ year: 2024, season: "reg" }).toArray();
        ///*1*/["DET-KC","ARI-WAS","CAR-ATL","CIN-CLE","HOU-BAL","JAC-IND","SF-PIT","TB-MIN","TEN-NO","GB-CHI","LAR-SEA","LV-DEN","MIA-LAC","PHI-NE","DAL-NYG","BUF-NYJ"],
        let gameWeeks = [];
        let gameWeekSchedule = ""
        const NFL_teams = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAC", "KC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "LV", "PHI", "PIT", "LAC", "SEA", "SF", "LAR", "TB", "TEN", "WAS"]
        let foe_lookup = {}
        let foe_hash = {}
        for (let i = 1; i < 19; i++) {
            if (i > 1) {
                gameWeekSchedule += "+"
            }
            let gameWeekArray = []
            let gamesArray = games.filter(game => game.gameWeek === i).sort((a, b) => a.startDateTime - b.startDateTime);
            gamesArray.forEach((game, index) => {
                gameWeekArray.push(`${game.awayTeam.code}-${game.homeTeam.code}`);
                if (index === 0) {
                    gameWeekSchedule += "\""
                }
                let gameWeekDate = new Date(game.startDateTime)
                let gameWeekDay = gameWeekDate.getDay()
                let gameWeekTime = gameWeekDate.getHours()
                console.log('gameWeekTime', gameWeekTime)
                if (gameWeekDay === 0) {
                    if (gameWeekTime > 14) {
                        gameWeekSchedule += "Z"
                    } else {
                        gameWeekSchedule += " "
                    }
                } else if (gameWeekDay === 1) {
                    gameWeekSchedule += "M"
                } else if (gameWeekDay === 3) {
                    gameWeekSchedule += "W"
                } else if (gameWeekDay === 4) {
                    gameWeekSchedule += "T"
                } else if (gameWeekDay === 5) {
                    gameWeekSchedule += "F"
                } else if (gameWeekDay === 6) {
                    gameWeekSchedule += "Z"
                }
                if (index === gamesArray.length-1) {
                    gameWeekSchedule += "\"\n"
                }
            })
            
            gameWeeks.push(gameWeekArray);
        }
        for (let team in NFL_teams) {
            let teamAbbrev = NFL_teams[team]
            foe_lookup[teamAbbrev] = [];
            foe_hash[teamAbbrev] = {};
            let teamGamesArray = games.filter(game => game.awayTeam.code === teamAbbrev || game.homeTeam.code === teamAbbrev).sort((a, b) => a.startDateTime - b.startDateTime)
            .forEach(game => {
                if (game.awayTeam.code === teamAbbrev) {
                    foe_lookup[teamAbbrev].push(game.homeTeam.code)
                    foe_hash[teamAbbrev][game.homeTeam.code] = 1
                } else {
                    foe_lookup[teamAbbrev].push(game.awayTeam.code)
                    foe_hash[teamAbbrev][game.awayTeam.code] = 1
                }
            });
        }
        console.log('gameWeeks', gameWeeks);
        console.log('gameWeekSchedule', gameWeekSchedule);
        console.log('foe_lookup', foe_lookup);
        console.log('foe_hash', foe_hash);
        // Close the connection
        // client.close();

        return {
            statusCode: 200,
            body: 'Successfully connected to MongoDB'
        };
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        return {
            statusCode: 500,
            body: 'Failed to connect to MongoDB'
        };
    }
}
generateNFLschedulepicker();
// };