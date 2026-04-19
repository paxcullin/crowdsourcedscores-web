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
                startDate: new Date('2025-03-01')
            },
            {
                season: 'reg',
                startDate: new Date('2025-08-27')
            },
            {
                season: 'post',
                startDate: new Date('2025-12-15')
            }
        ]
    }
    const seasonDates = {
        nfl: {

            2025: {
                pre: {
                    start: new Date('2025-06-01'),
                    weeks: [
                        {weekName: 'HOF'},
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3}
                        
                        ]
                },
                reg: {
                    start: new Date('2025-08-27'),
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
                        {weekName: 17},
                        {weekName: 18}
                        ]
                },
                post: {
                    start: new Date('2026-01-07'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2024: {
                pre: {
                    start: new Date('2024-06-01'),
                    weeks: [
                        {weekName: 'HOF'},
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3}
                        
                        ]
                },
                reg: {
                    start: new Date('2024-08-27'),
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
                        {weekName: 17},
                        {weekName: 18}
                        ]
                },
                post: {
                    start: new Date('2025-01-07'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2023: {
                pre: {
                    start: new Date('2023-07-01'),
                    weeks: [
                        {weekName: 'HOF'},
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3}
                        
                        ]
                },
                reg: {
                    start: new Date('2023-08-29'),
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
                        {weekName: 17},
                        {weekName: 18}
                        ]
                },
                post: {
                    start: new Date('2024-01-10'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2022: {
                pre: {
                    start: new Date('2022-06-01'),
                    weeks: [
                        {weekName: 'HOF'},
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3}
                        
                        ]
                },
                reg: {
                    start: new Date('2022-09-01'),
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
                        {weekName: 17},
                        {weekName: 18}
                        ]
                },
                post: {
                    start: new Date('2023-01-10'),
                    weeks: [
                        {weekName: 'WC'},
                        {weekName: 'DIV'},
                        {weekName: 'CONF'},
                        {weekName: 'SB'}
                        ]
                }
            },
            2021: {
                pre: {
                    start: new Date('2021-06-01'),
                    weeks: [
                        {weekName: 1},
                        {weekName: 2},
                        {weekName: 3},
                        {weekName: 4},
                        {weekName: 5}
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
                        {weekName: 17},
                        {weekName: 18}
                        ]
                },
                post: {
                    start: new Date('2022-01-12'),
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
                        {weekName: 17},
                        {weekName: 18}
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
            },
            2022: {
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
                    start: new Date('2022-11-10'),
                    weeks: [{weekName: 'Bowls'}]
                }
            },
            2023: {
                reg: {
                    start: new Date('2023-08-19'),
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
                    start: new Date('2023-11-10'),
                    weeks: [{weekName: 'Bowls'}]
                }
            },
            2024: {
                reg: {
                    start: new Date('2024-08-03'),
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
                        {weekName: 16}
                        ]
                },
                post: {
                    start: new Date('2024-12-16'),
                    weeks: [{weekName: 'Bowls'}]
                }
            },
            2025: {
                reg: {
                    start: new Date('2025-08-03'),
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
                        {weekName: 16}
                        ]
                },
                post: {
                    start: new Date('2025-12-16'),
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
            },
            2025: {
                reg: {
                    start: new Date('2025-11-03'),
                    weeks: [
                        {weekName: 1,
                            start: new Date('2025-11-03T18:00:00Z'),
                            end: new Date('2025-11-10T17:59:59Z')
                        },
                        {weekName: 2,
                            start: new Date('2025-11-10T18:00:00Z'),
                            end: new Date('2025-11-17T17:59:59Z')
                        },
                        {weekName: 3,
                            start: new Date('2025-11-18T18:00:00Z'),
                            end: new Date('2025-11-25T17:59:59Z')
                        },
                        {weekName: 4,
                            start: new Date('2025-11-25T18:00:00Z'),
                            end: new Date('2025-12-02T17:59:59Z')
                        },
                        {weekName: 5,
                            start: new Date('2025-12-02T18:00:00Z'),
                            end: new Date('2025-12-09T17:59:59Z')
                        },
                        {weekName: 6,
                            start: new Date('2025-12-09T18:00:00Z'),
                            end: new Date('2025-12-16T17:59:59Z')
                        },
                        {weekName: 7,
                            start: new Date('2025-12-16T18:00:00Z'),
                            end: new Date('2025-12-23T17:59:59Z')
                        },
                        {weekName: 8,
                            start: new Date('2025-12-23T18:00:00Z'),
                            end: new Date('2025-12-30T17:59:59Z')
                        },
                        {weekName: 9,
                            start: new Date('2025-12-30T18:00:00Z'),
                            end: new Date('2026-01-06T17:59:59Z')
                        },
                        {weekName: 10,
                            start: new Date('2026-01-06T18:00:00Z'),
                            end: new Date('2026-01-13T17:59:59Z')
                        },
                        {weekName: 11,
                            start: new Date('2026-01-13T18:00:00Z'),
                            end: new Date('2026-01-20T17:59:59Z')
                        },
                        {weekName: 12,
                            start: new Date('2026-01-20T18:00:00Z'),
                            end: new Date('2026-01-27T17:59:59Z')
                        },
                        {weekName: 13,
                            start: new Date('2026-01-27T18:00:00Z'),
                            end: new Date('2026-02-03T17:59:59Z')
                        },
                        {weekName: 14,
                            start: new Date('2026-02-03T18:00:00Z'),
                            end: new Date('2026-02-10T17:59:59Z')
                        },
                        {weekName: 15,
                            start: new Date('2026-02-10T18:00:00Z'),
                            end: new Date('2026-02-17T17:59:59Z')
                        },
                        {weekName: 16,
                            start: new Date('2026-02-17T18:00:00Z'),
                            end: new Date('2026-02-24T17:59:59Z')
                        },
                        {weekName: 17,
                            start: new Date('2026-02-24T18:00:00Z'),
                            end: new Date('2026-03-02T17:59:59Z')
                        },
                        {weekName: 18,
                            start: new Date('2026-03-02T18:00:00Z'),
                            end: new Date('2026-03-09T17:59:59Z')
                        }
                        ]
                },
                post: {
                    start: new Date('2026-03-09T18:00:00Z'),
                    weeks: [
                        {weekName: 'Conf Tourneys',
                            start: new Date('2026-03-09T18:00:00Z'),
                            end: new Date('2026-03-16T17:59:59Z')
                        },
                        {weekName: '1st 4',
                            start: new Date('2026-03-16T18:00:00Z'),
                            end: new Date('2026-03-19T07:59:59Z')
                        },
                        {weekName: '64',
                            start: new Date('2026-03-19T08:00:00Z'),
                            end: new Date('2026-03-21T07:59:59Z')
                        },
                        {weekName: '32',
                            start: new Date('2026-03-21T08:00:00Z'),
                            end: new Date('2026-03-23T07:59:59Z')
                        },
                        {weekName: 'S16',
                            start: new Date('2026-03-23T08:00:00Z'),
                            end: new Date('2026-03-28T07:59:59Z')
                        },
                        {weekName: 'E8',
                            start: new Date('2026-03-28T08:00:00Z'),
                            end: new Date('2026-03-30T07:59:59Z')
                        },
                        {weekName: 'F4',
                            start: new Date('2026-03-30T08:00:00Z'),
                            end: new Date('2026-04-05T07:59:59Z')
                        },
                        {weekName: 'Champ',
                            start: new Date('2026-04-05T08:00:00Z'),
                            end: new Date('2026-09-05T07:59:59Z')
                        }
                        ]
                }
            },
            2026: {
                reg: {
                    start: new Date('2026-11-04T01:00:00Z'),
                    weeks: []
                },
                post: {
                    start: new Date('2026-03-09T17:00:00Z'),
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
        },
        nba: {
            2026: {
                reg: {
                    start: new Date('2026-11-04T01:00:00Z'),
                    weeks: []
                },
                post: {
                    start: new Date('2026-04-13T17:00:00Z'),
                    weeks: [
                        {weekName: 'Play-in',
                            start: new Date('2026-04-13T17:00:00Z'),
                            end: new Date('2026-04-16T16:59:59Z')
                        },
                        {weekName: '1st Round',
                            start: new Date('2026-04-16T17:00:00Z'),
                            end: new Date('2026-04-30T16:59:59Z')
                        },
                        {weekName: '2nd Round',
                            start: new Date('2026-04-30T17:00:00Z'),
                            end: new Date('2026-05-14T16:59:59Z')
                        },
                        {weekName: 'Conf Finals',
                            start: new Date('2026-05-14T17:00:00Z'),
                            end: new Date('2026-06-04T16:59:59Z')
                        },
                        {weekName: 'NBA Finals',
                            start: new Date('2026-06-04T17:00:00Z'),
                            end: new Date('2026-10-01T16:59:59Z')
                        }
                        ]
                }
            }
        }
    }
    
    var weekStartDates = [];
    var sport = (event.sport) ? event.sport : (event.params && event.params.path && event.params.path.sport) ? event.params.path.sport : 'nfl'
    
    const now = event.eventDate ? new Date(event.eventDate).getTime() : Date.now();
    const nowDate = new Date(now);
    let nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth();
    var year = nowDate.getFullYear();
    if ((sport === 'nfl' || sport === 'ncaaf' || sport === 'ncaam') && nowYear === 2026) {
        nowYear--;
    }
    if (sport === 'nba' && nowMonth > 9) {
        nowYear--;
    }
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
    const buildWeeklyStartDates = (startUtcMs, endUtcMs) => {
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const dates = [];
        for (let t = startUtcMs; t < endUtcMs; t += weekMs) {
            dates.push(t);
        }
        return dates;
    };

    const buildWeekObjectsFromStartDates = (startDatesUtc, labels) => {
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        return startDatesUtc.map((startUtcMs, index) => {
            const endUtcMs = startUtcMs + weekMs - (60 * 1000);
            return {
                weekName: labels[index],
                start: new Date(startUtcMs),
                end: new Date(endUtcMs)
            };
        });
    };

    const getNthWeekdayOfMonth = (yearValue, monthValue, weekday, nth) => {
        const firstOfMonth = new Date(Date.UTC(yearValue, monthValue, 1));
        const dayOffset = (7 + weekday - firstOfMonth.getUTCDay()) % 7;
        return 1 + dayOffset + ((nth - 1) * 7);
    };

    const isPacificDstAtNoon = (yearValue, monthValue, dayValue) => {
        const secondSundayInMarch = getNthWeekdayOfMonth(yearValue, 2, 0, 2);
        const firstSundayInNovember = getNthWeekdayOfMonth(yearValue, 10, 0, 1);

        if (monthValue < 2 || monthValue > 10) {
            return false;
        }
        if (monthValue > 2 && monthValue < 10) {
            return true;
        }
        if (monthValue === 2) {
            return dayValue >= secondSundayInMarch;
        }
        return dayValue < firstSundayInNovember;
    };

    const pacificMondayNoonUtcMs = (yearValue, monthValue, dayValue) => {
        const utcHour = isPacificDstAtNoon(yearValue, monthValue, dayValue) ? 19 : 20;
        return Date.UTC(yearValue, monthValue, dayValue, utcHour, 0, 0, 0);
    };

    const firstMondayOnOrAfter = (yearValue, monthValue, dayValue) => {
        const date = new Date(Date.UTC(yearValue, monthValue, dayValue));
        while (date.getUTCDay() !== 1) {
            date.setUTCDate(date.getUTCDate() + 1);
        }
        return date;
    };

    const buildNbaRegularSeason = (seasonYear) => {
        const seasonStartMonday = firstMondayOnOrAfter(seasonYear, 9, 15);
        const seasonEndBoundaryMonday = firstMondayOnOrAfter(seasonYear + 1, 3, 13);

        const weeks = [];
        const weekBoundaries = [];
        let weekNumber = 1;
        let cursor = new Date(seasonStartMonday.getTime());

        while (cursor < seasonEndBoundaryMonday) {
            const startYear = cursor.getUTCFullYear();
            const startMonth = cursor.getUTCMonth();
            const startDay = cursor.getUTCDate();

            const nextCursor = new Date(cursor.getTime());
            nextCursor.setUTCDate(nextCursor.getUTCDate() + 7);

            const endYear = nextCursor.getUTCFullYear();
            const endMonth = nextCursor.getUTCMonth();
            const endDay = nextCursor.getUTCDate();

            const startUtcMs = pacificMondayNoonUtcMs(startYear, startMonth, startDay);
            const nextStartUtcMs = pacificMondayNoonUtcMs(endYear, endMonth, endDay);

            weekBoundaries.push(startUtcMs);
            weeks.push({
                weekName: weekNumber,
                start: new Date(startUtcMs),
                end: new Date(nextStartUtcMs - (60 * 1000))
            });

            weekNumber++;
            cursor = nextCursor;
        }

        const boundaryYear = seasonEndBoundaryMonday.getUTCFullYear();
        const boundaryMonth = seasonEndBoundaryMonday.getUTCMonth();
        const boundaryDay = seasonEndBoundaryMonday.getUTCDate();
        weekBoundaries.push(pacificMondayNoonUtcMs(boundaryYear, boundaryMonth, boundaryDay));

        return {
            start: weeks[0] ? weeks[0].start : seasonStartMonday,
            weeks,
            weekBoundaries
        };
    };

    const buildWeekObjectsFromBoundaries = (boundariesUtcMs, labels) => {
        const weeks = [];
        for (let i = 0; i < labels.length; i++) {
            weeks.push({
                weekName: labels[i],
                start: new Date(boundariesUtcMs[i]),
                end: new Date(boundariesUtcMs[i + 1] - (60 * 1000))
            });
        }
        return weeks;
    };

    const nbaPostseasonConfig = {
        // Keep these boundaries current as rounds complete for each season.
        2026: {
            labels: ['Play-In', 'R1', 'Conf Semis', 'Conf Finals', 'Finals'],
            boundaries: [
                [2026, 3, 13],
                [2026, 3, 16],
                [2026, 3, 30],
                [2026, 4, 18],
                [2026, 5, 1],
                [2026, 5, 22]
            ]
        },
        2027: {
            labels: ['Play-In', 'R1', 'Conf Semis', 'Conf Finals', 'Finals'],
            boundaries: [
                [2027, 3, 16],
                [2027, 3, 30],
                [2027, 4, 10],
                [2027, 4, 24],
                [2027, 5, 7],
                [2027, 5, 28]
            ]
        }
    };

    const buildNbaPostseason = (seasonYear, defaultStartUtcMs) => {
        const configured = nbaPostseasonConfig[seasonYear];
        if (!configured) {
            return {
                start: new Date(defaultStartUtcMs),
                weeks: [],
                weekBoundaries: [defaultStartUtcMs]
            };
        }

        const boundariesUtcMs = configured.boundaries.map(function(boundaryParts) {
            return pacificMondayNoonUtcMs(boundaryParts[0], boundaryParts[1], boundaryParts[2]);
        });

        return {
            start: new Date(boundariesUtcMs[0]),
            weeks: buildWeekObjectsFromBoundaries(boundariesUtcMs, configured.labels),
            weekBoundaries: boundariesUtcMs
        };
    };

    if (sport === 'nba') {
        const nbaRegularSeason = buildNbaRegularSeason(nowYear);
        const regularSeasonEndBoundary = nbaRegularSeason.weekBoundaries[nbaRegularSeason.weekBoundaries.length - 1];
        const nbaPostseason = buildNbaPostseason(nowYear, regularSeasonEndBoundary);

        seasonDates.nba[nowYear] = {
            reg: {
                start: nbaRegularSeason.start,
                weeks: nbaRegularSeason.weeks,
                weekBoundaries: nbaRegularSeason.weekBoundaries
            },
            post: {
                start: nbaPostseason.start,
                weeks: nbaPostseason.weeks,
                weekBoundaries: nbaPostseason.weekBoundaries
            }
        };

        if (now >= seasonDates.nba[nowYear].post.start) {
            season = 'post';
        }
    }

    if (sport === 'nba') {
        weekStartDates = seasonDates.nba[nowYear][season].weekBoundaries;
    } else if (sport === 'ncaaf') {
        weekStartDates = season === 'post' ? [
                    Date.UTC(2025, 11, 14),  // 2019 Postseason Week 1
                    Date.UTC(2026, 7, 24),  // 2019 Postseason Week 3
                    
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
                Date.UTC(2025, 6, 19),  // 2019 Week 1
                Date.UTC(2025, 8, 9),  // 2023 Week 2
                Date.UTC(2025, 8, 16),  // 2025 Week 3
                Date.UTC(2025, 8, 23),  // 2025 Week 4
                Date.UTC(2025, 8, 30),  // 2025 Week 5
                Date.UTC(2025, 9, 7),  // 2025 Week 6
                Date.UTC(2025, 9, 14),  // 2025 Week 7
                Date.UTC(2025, 9, 21),  // 2025 Week 8
                Date.UTC(2025, 9, 28),  // 2025 Week 9
                Date.UTC(2025, 10, 4),  // 2025 Week 10
                Date.UTC(2025, 10, 11),  // 2025 Week 11
                Date.UTC(2025, 10, 18),  // 2025 Week 12
                Date.UTC(2025, 10, 25),  // 2025 Week 13
                Date.UTC(2025, 11, 2),  // 2025 Week 14
                Date.UTC(2025, 11, 9),  // 2025 Week 15
                Date.UTC(2025, 11, 16),  // 2025 Week 16
                Date.UTC(2026, 7, 25),  // 2024 Week 17
            ]
    } else if (sport === 'ncaam') {
        weekStartDates = season === 'post' ? [
                    Date.UTC(2026, 2, 9),  // 2020 Postseason Week Conf Tourneys
                    Date.UTC(2026, 2, 16),  // 2020 Postseason Week First Four
                    Date.UTC(2026, 2, 19),  // 2020 Postseason Week 64
                    Date.UTC(2026, 2, 21),  // 2020 Postseason Week 32
                    Date.UTC(2026, 2, 23),  // 2020 Postseason Week S16
                    Date.UTC(2026, 2, 28),  // 2020 Postseason Week E8
                    Date.UTC(2026, 2, 30),  // 2020 Postseason Week F4
                    Date.UTC(2026, 3, 6),  // 2020 Postseason Week 6
                    Date.UTC(2026, 8, 15),  // 2020 Postseason Week 9
        ] : [
            Date.UTC(2025, 10, 3),  // 2025 Week 1
            Date.UTC(2025, 10, 10),  // 2025 Week 2
            Date.UTC(2025, 10, 17),  // 2025 Week 3
            Date.UTC(2025, 10, 24),  // 2025 Week 4
            Date.UTC(2025, 10, 31),  // 2025 Week 5
            Date.UTC(2025, 11, 7),  // 2025 Week 6
            Date.UTC(2025, 11, 14),  // 2025 Week 7
            Date.UTC(2025, 11, 21),  // 2025 Week 8
            Date.UTC(2026, 0, 4),   // 2025 Week 9 
            Date.UTC(2026, 0, 11),  // 2025 Week 10
            Date.UTC(2026, 0, 18),  // 2025 Week 11
            Date.UTC(2026, 0, 25),  // 2025 Week 12
            Date.UTC(2026, 1, 1),   // 2025 Week 13
            Date.UTC(2026, 1, 8),   // 2025 Week 14
            Date.UTC(2026, 1, 15),   // 2025 Week 15
            Date.UTC(2026, 1, 22),   // 2025 Week 16
            Date.UTC(2026, 2, 1),   // 2025 Week 17
            Date.UTC(2026, 2, 8),   // 2025 Week 18
        ]
    } else {
        console.log({season})
        switch (season) {
            case 'pre':
                // code
                weekStartDates = [
                    Date.UTC(2025, 5, 1),  // super bowl week
                    Date.UTC(2025, 7, 3),  // 2019 Preseason Week 1
                    Date.UTC(2025, 7, 13),  // 2019 Preseason Week 2
                    Date.UTC(2025, 7, 20),  // 2019 Preseason Week 3
                    ];
                    break;
            case 'reg':
                weekStartDates = [
                    Date.UTC(2025, 7, 25),  // 2020 Week 1
                    Date.UTC(2025, 8, 10),  // 2020 Week 2
                    Date.UTC(2025, 8, 17),  // 2020 Week 3
                    Date.UTC(2025, 8, 24),  // 2020 Week 4
                    Date.UTC(2025, 9, 1),  // 2020 Week 5
                    Date.UTC(2025, 9, 8),  // 2020 Week 6
                    Date.UTC(2025, 9, 15),  // 2020 Week 7
                    Date.UTC(2025, 9, 22),  // 2020 Week 8
                    Date.UTC(2025, 9, 29),  // 2020 Week 9
                    Date.UTC(2025, 10, 5),  // 2020 Week 10
                    Date.UTC(2025, 10, 12),  // 2020 Week 11
                    Date.UTC(2025, 10, 19),  // 2020 Week 12
                    Date.UTC(2025, 10, 26),  // 2020 Week 13
                    Date.UTC(2025, 11, 3),  // 2020 Week 14
                    Date.UTC(2025, 11, 10),  // 2020 Week 15
                    Date.UTC(2025, 11, 17),  // 2020 Week 16
                    Date.UTC(2025, 11, 24),  // 2020 Week 17
                    Date.UTC(2025, 11, 31),  // 2020 Week 18
                    Date.UTC(2026, 0, 5),  // 2020 Week 18
                    ];
                    break;
            case 'post':
                weekStartDates = [
                    Date.UTC(2026, 0, 6),  // 2020 Postseason Week 1
                    Date.UTC(2026, 0, 13),  // 2020 Postseason Week 2
                    Date.UTC(2026, 0, 20),  // 2020 Postseason Week 3
                    Date.UTC(2026, 0, 27),  // 2020 Postseason Week 4
                    Date.UTC(2026, 7, 1),  // 2022-2023 Season
                    ];
                    break;
            default:
                weekStartDates = [
                    Date.UTC(2019, 8, 2),  // 2019 Week 1
                    Date.UTC(2019, 8, 11),  // 2019 Week 2
                    Date.UTC(2019, 8, 17),  // 2019 Week 3
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
    console.log('year,  :>> ', year, new Date(weekStartDates[0]).getFullYear());
    if (year > new Date(weekStartDates[0]).getFullYear()) {
        year = new Date(weekStartDates[0]).getFullYear();
    }
    console.log('year 2 :>> ', year);
    var remainingWeeks = weekStartDates.filter(function(startDate) {
        return startDate > now;
    });
    var week = weekStartDates.indexOf(remainingWeeks[0]);
    if (sport === 'nba' && season === 'reg' && week === -1 && seasonDates.nba[nowYear].reg.weeks.length) {
        week = seasonDates.nba[nowYear].reg.weeks.length - 1;
    }
    
    var result = {
        sport: sport,
        week: week,
        year: nowYear,
        season: season,
        nfl: { week: week }
    }
    console.log('sport, nowYear, season :>> ', sport, nowYear, season);
    result.weeks = seasonDates[sport][nowYear][season].weeks
    result.season = season;
    
    console.log('result: ', result)
    // console.log('now: ', now);
    // console.log('remainingWeeks: ', remainingWeeks)
    callback(null, result);
};

//aws lambda update-function-code --function-name getGameWeek --zip-file fileb://Archive.zip --publish