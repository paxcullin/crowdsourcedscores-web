'use strict';

// console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    const sportSeasonStartDates = {
        ncaaf: [{
            season: 'reg',
            startDate: new Date('2019-08-26')
        },
        {
            season: 'post',
            startDate: new Date('2019-12-15')
        }],
        nfl: [{
                season: 'pre',
                startDate: new Date('2021-03-01')
            },
            {
            season: 'reg',
            startDate: new Date('2021-07-01')
        },
        {
            season: 'post',
            startDate: new Date('2022-01-10')
        }]
    }
    const seasonDates = {
        nfl: {
            2021: {
                pre: {
                    start: new Date('2021-06-01'),
                    weeks: [
                        {weekName: 1}
                        ]
                },
                reg: {
                    start: new Date('2021-07-01'),
                    weeks: [
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3},
                        {weekName: 4},
                        {weekName: 5},
                        {weekName: 6},
                        {weekName: 7},
                        {weekName: 8},
                        {weekName: 9},
                        {weekName: 10},
                        {weekName: 11},
                        {weekName: 12},
                        {weekName: 13},
                        {weekName: 14},
                        {weekName: 15},
                        {weekName: 16},
                        {weekName: 17}
                        ]
                },
                post: {
                    start: new Date('2022-01-10'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2020: {
                pre: {
                    start: new Date('2020-06-01'),
                    weeks: [
                        {weekName: 1}
                        ]
                },
                reg: {
                    start: new Date('2020-07-01'),
                    weeks: [
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3},
                        {weekName: 4},
                        {weekName: 5},
                        {weekName: 6},
                        {weekName: 7},
                        {weekName: 8},
                        {weekName: 9},
                        {weekName: 10},
                        {weekName: 11},
                        {weekName: 12},
                        {weekName: 13},
                        {weekName: 14},
                        {weekName: 15},
                        {weekName: 16},
                        {weekName: 17}
                        ]
                },
                post: {
                    start: new Date('2021-01-06'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2019: {
                pre: {
                    start: new Date('2019-03-01'),
                    weeks: [
                        {weekName: 'HOF'},
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3},
                        {weekName: 4},]
                },
                reg: {
                    start: new Date('2019-09-01'),
                    weeks: [
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3},
                        {weekName: 4},
                        {weekName: 5},
                        {weekName: 6},
                        {weekName: 7},
                        {weekName: 8},
                        {weekName: 9},
                        {weekName: 10},
                        {weekName: 11},
                        {weekName: 12},
                        {weekName: 13},
                        {weekName: 14},
                        {weekName: 15},
                        {weekName: 16},
                        {weekName: 17}
                        ]
                },
                post: {
                    start: new Date('2019-12-31'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2018: {
                pre: new Date('2018-03-01'),
                reg: new Date('2018-09-03'),
                post: new Date('2018-01-01')
            }
        },
        ncaaf: {
            2019: {
                reg: {
                    start: new Date('2019-08-26'),
                    weeks: [
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3},
                        {weekName: 4},
                        {weekName: 5},
                        {weekName: 6},
                        {weekName: 7},
                        {weekName: 8},
                        {weekName: 9},
                        {weekName: 10},
                        {weekName: 11},
                        {weekName: 12},
                        {weekName: 13},
                        {weekName: 14},
                        {weekName: 15},
                        {weekName: 16},
                        ]
                },
                post: {
                    start: new Date('2019-11-14'),
                    weeks: [{weekName: 'Bowls'}]
                }
            }
        },
        ncaam: {
            2020: {
                post: {
                    start: new Date('2020-03-15'),
                    weeks: [
                        {weekName: '64'},
                        {weekName: '32'},
                        {weekName: 'S16'},
                        {weekName: 'E8'},
                        {weekName: 'F4'},
                        {weekName: 'Champ'}
                        ]
                }
            }
        }
    }
    
    var weekStartDates = [];
    var sport = (event.sport) ? event.sport : (event.params && event.params.path && event.params.path.sport) ? event.params.path.sport : 'nfl'
    
    const now = Date.now();
    const nowYear = (new Date(now).getFullYear());
    var year = new Date(now).getFullYear();
    console.log({nowYear, year})
    var seasonStartDate = new Date();
    var season = 'reg';
    if (sport === 'nfl') {
        if (now >= seasonDates[sport][nowYear].pre.start && now < seasonDates[sport][nowYear].reg.start) {
            season = 'pre';
        }
        if (now >= seasonDates[sport][nowYear].post.start) {
            season = 'post'
        }
    } else if (sport === 'ncaaf' || sport === 'ncaam') {
        console.log({now: new Date(now), start: new Date(seasonDates[sport][nowYear].post.start)})
        if (new Date(now) >= new Date(seasonDates[sport][nowYear].post.start)) {
            season = 'post'
        }
    }
    
        console.log({season})
    if (sport === 'ncaaf') {
        weekStartDates = season === 'post' ? [
                    Date.UTC(2019, 11, 14),  // 2019 Postseason Week 1
                    Date.UTC(2020, 7, 24),  // 2019 Postseason Week 3
                    
                    ]
            : [
                // Date.UTC(2018, 7, 24), // week 1 of Regular Season
                // Date.UTC(2018, 7, 31), // week 1 of Regular Season
                // Date.UTC(2018, 8, 11), // week 2
                // Date.UTC(2018, 8, 19), // week 3
                // Date.UTC(2018, 8, 26), // week 4
                // Date.UTC(2018, 9, 3), // week 5
                // Date.UTC(2018, 9, 10), // week 6
                // Date.UTC(2018, 9, 17), // week 7
                // Date.UTC(2018, 9, 24), // week 8
                // Date.UTC(2018, 9, 31), // week 9
                // Date.UTC(2018, 10, 7), // week 10
                // Date.UTC(2018, 10, 14), // week 11
                // Date.UTC(2018, 10, 21), // week 12
                // Date.UTC(2018, 10, 28), // week 13
                // Date.UTC(2018, 11, 5), // week 14
                // Date.UTC(2018, 11, 12), // Bowls
                // Date.UTC(2019, 8, 1), // Bowls
                Date.UTC(2019, 7, 26),  // 2019 Week 1
                Date.UTC(2019, 8, 1),  // 2019 Week 2
                Date.UTC(2019, 8, 9),  // 2019 Week 3
                Date.UTC(2019, 8, 16),  // 2019 Week 4
                Date.UTC(2019, 8, 23),  // 2019 Week 5
                Date.UTC(2019, 8, 30),  // 2019 Week 6
                Date.UTC(2019, 9, 7),  // 2019 Week 7
                Date.UTC(2019, 9, 15),  // 2019 Week 8
                Date.UTC(2019, 9, 22),  // 2019 Week 9
                Date.UTC(2019, 9, 29),  // 2019 Week 10
                Date.UTC(2019, 10, 5),  // 2019 Week 11
                Date.UTC(2019, 10, 12),  // 2019 Week 12
                Date.UTC(2019, 10, 19),  // 2019 Week 13
                Date.UTC(2019, 10, 26),  // 2019 Week 14
                Date.UTC(2019, 11, 3),  // 2019 Week 15
                Date.UTC(2019, 11, 10),  // 2019 Week 16
                Date.UTC(2019, 11, 17),  // 2019 Week 17
                Date.UTC(2020, 7, 25),  // 2019 Week 17
            ]
    } else if (sport === 'ncaam') {
        weekStartDates = [
            Date.UTC(2019, 0, 1),
            Date.UTC(2019, 0, 7),
            Date.UTC(2019, 0, 14),
            Date.UTC(2019, 0, 21),
            Date.UTC(2019, 0, 28),
            Date.UTC(2019, 1, 4),
            Date.UTC(2019, 1, 11),
            Date.UTC(2019, 1, 18),
            Date.UTC(2019, 1, 25),
            Date.UTC(2019, 2, 4),
            Date.UTC(2019, 2, 11),
            Date.UTC(2019, 2, 18),
            Date.UTC(2019, 2, 25),
            Date.UTC(2019, 9, 1), // Bowls
            ]
    } else {
        console.log({season})
        switch (season) {
            case 'pre':
                // code
                weekStartDates = [
                    Date.UTC(2019, 0, 21),  // super bowl week
                    Date.UTC(2019, 7, 5),  // 2019 Preseason Week 1
                    Date.UTC(2019, 7, 12),  // 2019 Preseason Week 2
                    Date.UTC(2019, 7, 19),  // 2019 Preseason Week 3
                    Date.UTC(2019, 7, 27),  // 2019 Preseason Week 4
                    ];
                    break;
            case 'reg':
                weekStartDates = [
                    Date.UTC(2021, 6, 2),  // 2020 Week 1
                    Date.UTC(2021, 8, 14),  // 2020 Week 2
                    Date.UTC(2021, 8, 21),  // 2020 Week 3
                    Date.UTC(2021, 8, 28),  // 2020 Week 4
                    Date.UTC(2021, 9, 5),  // 2020 Week 5
                    Date.UTC(2021, 9, 12),  // 2020 Week 6
                    Date.UTC(2021, 9, 19),  // 2020 Week 7
                    Date.UTC(2021, 9, 26),  // 2020 Week 8
                    Date.UTC(2021, 10, 2),  // 2020 Week 9
                    Date.UTC(2021, 10, 9),  // 2020 Week 10
                    Date.UTC(2021, 10, 16),  // 2020 Week 11
                    Date.UTC(2021, 10, 23),  // 2020 Week 12
                    Date.UTC(2021, 10, 30),  // 2020 Week 13
                    Date.UTC(2021, 11, 7),  // 2020 Week 14
                    Date.UTC(2021, 11, 14),  // 2020 Week 15
                    Date.UTC(2021, 11, 21),  // 2020 Week 16
                    Date.UTC(2021, 11, 28),  // 2020 Week 17
                    Date.UTC(2022, 0, 4),  // 2020 Week 18
                    Date.UTC(2021, 0, 10),  // 2020 Week 17
                    ];
                    break;
            case 'post':
                weekStartDates = [
                    Date.UTC(2022, 0, 11),  // 2020 Postseason Week 1
                    Date.UTC(2022, 0, 18),  // 2020 Postseason Week 2
                    Date.UTC(2022, 0, 25),  // 2020 Postseason Week 3
                    Date.UTC(2022, 1, 1),  // 2020 Postseason Week 4
                    Date.UTC(2022, 1, 8),  // 2020 Week 21 - SB
                    ];
                    break;
            default:
                weekStartDates = [
                    Date.UTC(2019, 8, 2),  // 2019 Week 1
                    Date.UTC(2019, 8, 11),  // 2019 Week 2
                    Date.UTC(2019, 8, 18),  // 2019 Week 3
                    Date.UTC(2019, 8, 25),  // 2019 Week 4
                    Date.UTC(2019, 9, 2),  // 2019 Week 5
                    Date.UTC(2019, 9, 9),  // 2019 Week 6
                    Date.UTC(2019, 9, 16),  // 2019 Week 7
                    Date.UTC(2019, 9, 23),  // 2019 Week 8
                    Date.UTC(2019, 9, 30),  // 2019 Week 9
                    Date.UTC(2019, 10, 6),  // 2019 Week 10
                    Date.UTC(2019, 10, 13),  // 2019 Week 11
                    Date.UTC(2019, 10, 20),  // 2019 Week 12
                    Date.UTC(2019, 10, 27),  // 2019 Week 13
                    Date.UTC(2019, 11, 4),  // 2019 Week 14
                    Date.UTC(2019, 11, 11),  // 2019 Week 15
                    Date.UTC(2019, 11, 18),  // 2019 Week 16
                    Date.UTC(2019, 11, 25),  // 2019 Week 17
                    Date.UTC(2019, 11, 31),  // 2019 Week 18 - WC
                    Date.UTC(2020, 0, 7),  // 2019 Week 19 - DIV
                    Date.UTC(2020, 0, 14),  // 2019 Week 20 - CONF
                    Date.UTC(2020, 0, 21),  // 2019 Week 21 - SB
                    Date.UTC(2020, 7, 1),  // 2019 Week 21 - SB
                    ]
        }
        // weekStartDates = [
        //     // Date.UTC(2016, 8, 6), // week 1
        //     // Date.UTC(2016, 8, 13), // week 2
        //     // Date.UTC(2016, 8, 20), // week 3
        //     // Date.UTC(2016, 8, 27), // week 4
        //     // Date.UTC(2016, 9, 4), // week 5
        //     // Date.UTC(2016, 9, 11), // week 6
        //     // Date.UTC(2016, 9, 18), // week 7
        //     // Date.UTC(2016, 9, 25), // week 8
        //     // Date.UTC(2016, 10, 1), // week 9
        //     // Date.UTC(2016, 10, 8), // week 10
        //     // Date.UTC(2016, 10, 15), // week 11
        //     // Date.UTC(2016, 10, 22), // week 12
        //     // Date.UTC(2016, 10, 29), // week 13
        //     // Date.UTC(2016, 11, 6), // week 14
        //     // Date.UTC(2016, 11, 13), // week 15
        //     // Date.UTC(2016, 11, 20), // week 16
        //     // Date.UTC(2016, 11, 27), // week 17
        //     // Date.UTC(2017, 0, 3), // wildcard week
        //     // Date.UTC(2017, 0, 10), // divisional week
        //     // Date.UTC(2017, 0, 17), // championship week
        //     // Date.UTC(2017, 0, 31),  // super bowl week
        //     // Date.UTC(2017, 8, 2), // week 1
        //     // Date.UTC(2017, 8, 13), // week 2
        //     // Date.UTC(2017, 8, 20), // week 3
        //     // Date.UTC(2017, 8, 27), // week 4
        //     // Date.UTC(2017, 9, 4), // week 5
        //     // Date.UTC(2017, 9, 11), // week 6
        //     // Date.UTC(2017, 9, 18), // week 7
        //     // Date.UTC(2017, 9, 25), // week 8
        //     // Date.UTC(2017, 10, 1), // week 9
        //     // Date.UTC(2017, 10, 8), // week 10
        //     // Date.UTC(2017, 10, 15), // week 11
        //     // Date.UTC(2017, 10, 22), // week 12
        //     // Date.UTC(2017, 10, 29), // week 13
        //     // Date.UTC(2017, 11, 6), // week 14
        //     // Date.UTC(2017, 11, 13), // week 15
        //     // Date.UTC(2017, 11, 20), // week 16
        //     // Date.UTC(2017, 11, 27), // week 17
        //     // Date.UTC(2018, 0, 2), // wildcard week
        //     // Date.UTC(2018, 0, 9), // divisional week
        //     // Date.UTC(2018, 0, 16), // championship week
        //     // Date.UTC(2018, 0, 22),  // super bowl week
        //     // Date.UTC(2018, 7, 31), // week 1 of Regular Season
        //     // Date.UTC(2018, 8, 11), // week 2
        //     // Date.UTC(2018, 8, 19), // week 3
        //     // Date.UTC(2018, 8, 26), // week 4
        //     // Date.UTC(2018, 9, 3), // week 5
        //     // Date.UTC(2018, 9, 10), // week 6
        //     // Date.UTC(2018, 9, 17), // week 7
        //     // Date.UTC(2018, 9, 24), // week 8
        //     // Date.UTC(2018, 9, 31), // week 9
        //     // Date.UTC(2018, 10, 7), // week 10
        //     // Date.UTC(2018, 10, 14), // week 11
        //     // Date.UTC(2018, 10, 21), // week 12
        //     // Date.UTC(2018, 10, 28), // week 13
        //     // Date.UTC(2018, 11, 5), // week 14
        //     // Date.UTC(2018, 11, 12), // week 15
        //     // Date.UTC(2018, 11, 19), // week 16
        //     // Date.UTC(2018, 11, 26), // week 17
        //     // Date.UTC(2018, 11, 31), // wildcard week
        //     // Date.UTC(2019, 0, 8), // divisional week
        //     // Date.UTC(2019, 0, 15), // championship week
        // ]
    }
    
    // all games have the same year value
    if (year > new Date(weekStartDates[0]).getFullYear()) {
        year = new Date(weekStartDates[0]).getFullYear();
    }
    var remainingWeeks = weekStartDates.filter(function(startDate) {
        return startDate > now;
    });
    var week = weekStartDates.indexOf(remainingWeeks[0]);
    var result = {
        sport: sport,
        week: week,
        year: year,
        season: season,
    }
    result.weeks = seasonDates[sport][nowYear][season].weeks
    result.season = season;
    
    console.log('result: ', result)
    // console.log('now: ', now);
    // console.log('remainingWeeks: ', remainingWeeks)
    callback(null, result);
};