import sys
import types
import http.client
import urllib.parse
import urllib.request
import json

if "/opt/python" not in sys.path:
    sys.path.insert(0, "/opt/python")

for module_name in list(sys.modules):
    if module_name == "urllib3" or module_name.startswith("urllib3."):
        del sys.modules[module_name]

try:
    import six

    sys.modules.setdefault("urllib3.packages.six", six)
    sys.modules.setdefault("urllib3.packages.six.moves", six.moves)

    try:
        from six.moves import http_client as six_http_client, urllib, urllib_parse, urllib_request, configparser

        sys.modules.setdefault("urllib3.packages.six.moves.http_client", six_http_client)
        sys.modules.setdefault("urllib3.packages.six.moves.urllib", urllib)
        sys.modules.setdefault("urllib3.packages.six.moves.urllib.parse", urllib_parse)
        sys.modules.setdefault("urllib3.packages.six.moves.urllib.request", urllib_request)
        sys.modules.setdefault("urllib3.packages.six.moves.configparser", configparser)
    except ImportError:
        pass
except ImportError:
    six_module = types.ModuleType("urllib3.packages.six")
    moves_module = types.ModuleType("urllib3.packages.six.moves")

    moves_module.http_client = http.client
    sys.modules.setdefault("urllib3.packages.six.moves.http_client", http.client)

    urllib_module = types.ModuleType("urllib3.packages.six.moves.urllib")
    urllib_module.parse = urllib.parse
    urllib_module.request = urllib.request
    moves_module.urllib = urllib_module
    sys.modules.setdefault("urllib3.packages.six.moves.urllib", urllib_module)
    sys.modules.setdefault("urllib3.packages.six.moves.urllib.parse", urllib.parse)
    sys.modules.setdefault("urllib3.packages.six.moves.urllib.request", urllib.request)

    six_module.moves = moves_module
    sys.modules.setdefault("urllib3.packages.six", six_module)
    sys.modules.setdefault("urllib3.packages.six.moves", moves_module)

if "cgi" not in sys.modules:
    cgi_module = types.ModuleType("cgi")
    cgi_module.escape = lambda value: value
    sys.modules["cgi"] = cgi_module

from datetime import date, datetime, timedelta, timezone

import boto3
from pymongo import MongoClient, UpdateOne
from pysbr import BestLines, CurrentLines, EventsByDateRange, NBA, Sportsbook
from pysbr.config.config import Config


sns = boto3.client("sns")
lambda_client = boto3.client("lambda")

client = MongoClient(
    "mongodb+srv://"
    + str(Config.username)
    + ":"
    + str(Config.password)
    + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority"
)
db = client["pcsm"]
collection = db["games-nba"]

nba = NBA()
sportsbook = Sportsbook()

def fetch_nba_week(event_datetime):
    response = lambda_client.invoke(
        FunctionName="getGameWeek",
        InvocationType="RequestResponse",
        Payload=json.dumps({
            "sport": "nba",
            "eventDate": event_datetime.astimezone(timezone.utc).isoformat()
        }).encode("utf-8"),
    )
    return json.load(response["Payload"])
def get_postseason_end(target_date):
    if target_date.month >= 7:
        return datetime(target_date.year + 1, 6, 30)
    return datetime(target_date.year, 6, 30)


def parse_event_datetime(value):
    return datetime.strptime(value, "%Y-%m-%dT%H:%M:%S%z")


def normalize_range(event):
    today = date.today()
    start_value = event.get("startDate") if isinstance(event, dict) else None
    end_value = event.get("endDate") if isinstance(event, dict) else None

    if start_value:
        start_date = datetime.strptime(start_value, "%Y-%m-%d")
    else:
        start_date = datetime.combine(today - timedelta(days=1), datetime.min.time())

    if end_value:
        end_date = datetime.strptime(end_value, "%Y-%m-%d")
    else:
        end_date = get_postseason_end(today)

    return start_date, end_date


def infer_season(game, event_datetime):
    event_group = game.get("event group") or {}
    alias = str(event_group.get("alias") or "").lower()

    if "pre" in alias:
        return "pre"
    if "playoff" in alias or "final" in alias or "post" in alias:
        return "post"
    if "regular" in alias:
        return "reg"

    if event_datetime.month == 10 and event_datetime.day < 15:
        return "pre"
    if event_datetime.month in (4, 5, 6):
        return "post"
    return "reg"


def format_game_date(event_datetime):
    return event_datetime.astimezone(timezone.utc).strftime("%Y%m%d")


def get_existing_game(home_code, away_code, season, year, game_date):
    return collection.find_one(
        {
            "homeTeam.code": home_code,
            "awayTeam.code": away_code,
            "season": season,
            "year": year,
            "gameDate": game_date,
        }
    )


def build_team_object(team):
    code = team["source"].get("abbreviation") or ""
    return {
        "participantId": team["participant id"],
        "code": code,
        "shortName": team["source"].get("nickname") or "",
        "fullName": (team["source"].get("name") or "") + " " + (team["source"].get("nickname") or ""),
    }


def get_line_queries(event_ids):
    if not event_ids:
        return {}

    return {
        "spreads": CurrentLines(event_ids, nba.market_ids("pointspread"), sportsbook.ids("Pinnacle")[0]),
        "best_spreads": BestLines(event_ids, nba.market_ids([83])),
        "totals": CurrentLines(event_ids, nba.market_ids("totals"), sportsbook.ids("Pinnacle")[0]),
        "best_totals": BestLines(event_ids, nba.market_ids([401])),
        "moneylines": CurrentLines(event_ids, nba.market_ids("money-line"), sportsbook.ids("Pinnacle")[0]),
        "best_moneylines": BestLines(event_ids, nba.market_ids([403])),
        "bookmaker_spreads": CurrentLines(event_ids, nba.market_ids("pointspread"), sportsbook.ids("Bookmaker")[0]),
        "bookmaker_totals": CurrentLines(event_ids, nba.market_ids("totals"), sportsbook.ids("Bookmaker")[0]),
    }


def find_first_matching_line(lines, event_id, participant_id=None):
    for line in lines:
        if line.get("event id") != event_id:
            continue
        if participant_id is not None and line.get("participant id") != participant_id:
            continue
        return line
    return None


def append_odds(game_object, existing_game, line_queries, event_id, home_participant_id):
    odds = {
        "spread": "",
        "spreadOdds": "",
        "total": "",
        "totalOdds": "",
        "history": [],
    }

    if existing_game and existing_game.get("odds") and existing_game["odds"].get("history"):
        odds["history"] = existing_game["odds"]["history"]

    spreads = line_queries.get("spreads").list() if line_queries.get("spreads") else []
    best_spreads = line_queries.get("best_spreads").list() if line_queries.get("best_spreads") else []
    totals = line_queries.get("totals").list() if line_queries.get("totals") else []
    best_totals = line_queries.get("best_totals").list() if line_queries.get("best_totals") else []
    moneylines = line_queries.get("moneylines").list() if line_queries.get("moneylines") else []
    best_moneylines = line_queries.get("best_moneylines").list() if line_queries.get("best_moneylines") else []
    bookmaker_spreads = line_queries.get("bookmaker_spreads").list() if line_queries.get("bookmaker_spreads") else []
    bookmaker_totals = line_queries.get("bookmaker_totals").list() if line_queries.get("bookmaker_totals") else []

    spread = find_first_matching_line(spreads, event_id, home_participant_id)
    if spread is None:
        spread = find_first_matching_line(best_spreads, event_id, home_participant_id)
    if spread is None:
        spread = find_first_matching_line(bookmaker_spreads, event_id, home_participant_id)
    if spread is not None:
        odds["spread"] = spread.get("spread / total", "")
        odds["spreadOdds"] = spread.get("american odds", "")

    total = find_first_matching_line(totals, event_id)
    if total is None:
        total = find_first_matching_line(best_totals, event_id)
    if total is None:
        total = find_first_matching_line(bookmaker_totals, event_id)
    if total is not None:
        odds["total"] = total.get("spread / total", "")
        odds["totalOdds"] = total.get("american odds", "")

    moneyline_entries = [line for line in moneylines if line.get("event id") == event_id]
    if not moneyline_entries:
        moneyline_entries = [line for line in best_moneylines if line.get("event id") == event_id]
    for line in moneyline_entries:
        line_value = {
            "decimal": line.get("decimal odds", ""),
            "american": line.get("american odds", ""),
        }
        if line.get("participant id") == home_participant_id:
            odds["homeML"] = line_value
        else:
            odds["awayML"] = line_value

    current_snapshot = {
        "date": datetime.now(timezone.utc),
        "spread": odds.get("spread", ""),
        "spreadOdds": odds.get("spreadOdds", ""),
        "total": odds.get("total", ""),
        "totalOdds": odds.get("totalOdds", ""),
        "awayML": odds.get("awayML", ""),
        "homeML": odds.get("homeML", ""),
    }
    if current_snapshot["spread"] != "" or current_snapshot["total"] != "":
        odds["history"].append(current_snapshot)

    game_object["odds"] = odds


def build_results(game, home_participant_id, away_participant_id):
    home_score = 0
    away_score = 0
    home_periods = {"q1": 0, "q2": 0, "q3": 0, "q4": 0}
    away_periods = {"q1": 0, "q2": 0, "q3": 0, "q4": 0}

    for score in game.get("scores", []):
        period_key = f"q{score.get('period')}"
        if score.get("participant id") == home_participant_id:
            home_score += score.get("points scored", 0)
            if period_key in home_periods:
                home_periods[period_key] = score.get("points scored", 0)
        elif score.get("participant id") == away_participant_id:
            away_score += score.get("points scored", 0)
            if period_key in away_periods:
                away_periods[period_key] = score.get("points scored", 0)

    return {
        "awayTeam": {
            "score": away_score,
            "periods": away_periods,
        },
        "homeTeam": {
            "score": home_score,
            "periods": home_periods,
        },
        "total": home_score + away_score,
        "spread": away_score - home_score,
    }


def publish_final_update(game_object):
    attributes = {
        "gameId": {
            "DataType": "Number",
            "StringValue": str(game_object["gameId"]),
        },
        "year": {
            "DataType": "Number",
            "StringValue": str(game_object["year"]),
        },
        "sport": {
            "DataType": "String",
            "StringValue": game_object["sport"],
        },
        "season": {
            "DataType": "String",
            "StringValue": game_object["season"],
        },
        "gameDate": {
            "DataType": "String",
            "StringValue": game_object["gameDate"],
        },
        "gameWeek": {
            "DataType": "Number",
            "StringValue": str(game_object["gameWeek"]) if game_object.get("gameWeek") is not None else "0",
        },
    }

    sns.publish(
        TopicArn="arn:aws:sns:us-west-2:198282214908:gameUpdated",
        Message="Game " + str(game_object["gameId"]),
        Subject="Game Update",
        MessageAttributes=attributes,
    )


def lambda_handler(event, context):
    event = event or {}
    start_date, end_date = normalize_range(event)
    events = EventsByDateRange([nba.league_id], start_date, end_date)
    event_list = events.list()

    if not event_list:
        return {"message": "No NBA games found", "gamesUpdated": 0}

    line_queries = get_line_queries(events.ids())
    write_operations = []
    sbr_event_ids = []

    week_cache = {}
    for game in event_list:
        participants = game.get("participants") or []
        home_team = next((team for team in participants if team.get("is home") is True), None)
        away_team = next((team for team in participants if team.get("is home") is False), None)

        if not home_team or not away_team:
            continue
        event_datetime = parse_event_datetime(game["datetime"])
        game_date = format_game_date(event_datetime)
        if game_date not in week_cache:
            week_cache[game_date] = fetch_nba_week(event_datetime)

        week_info = week_cache[game_date]
        game_week = week_info.get("week")
        season = infer_season(game, event_datetime)
        year = event_datetime.year

        home_team_object = build_team_object(home_team)
        away_team_object = build_team_object(away_team)

        existing_game = get_existing_game(
            home_team_object["code"],
            away_team_object["code"],
            season,
            year,
            game_date,
        )

        game_object = {
            "sbrGameId": game["event id"],
            "gameId": existing_game["gameId"] if existing_game and existing_game.get("gameId") else game["event id"],
            "gameDate": game_date,
            "year": year,
            "status": game.get("event status"),
            "sport": "nba",
            "season": season,
            "location": ((game.get("location") or "") + ", " + (game.get("country") or "")).strip(", "),
            "startDateTime": event_datetime,
            "homeTeam": home_team_object,
            "awayTeam": away_team_object,
            "gameWeek": game_week,
            "weekName": week_info.get("weeks", [{}])[game_week].get("weekName", "") if game_week is not None and game_week >= 0 else (game.get("event group") or {}).get("alias", ""),
        }

        if game.get("event status") != "scheduled":
            game_object["results"] = build_results(game, home_team_object["participantId"], away_team_object["participantId"])
            game_object["status"] = "final" if game.get("event status") == "complete" else "inProgress"
            if existing_game and game_object["status"] == "final" and existing_game.get("status") != "final":
                publish_final_update(game_object)
        else:
            game_object["status"] = "scheduled"
            append_odds(game_object, existing_game, line_queries, game["event id"], home_team_object["participantId"])
            sbr_event_ids.append(game["event id"])

        write_operations.append(
            UpdateOne(
                {"gameId": game_object["gameId"]},
                {"$set": game_object},
                upsert=True,
            )
        )

    if write_operations:
        collection.bulk_write(write_operations)

    if sbr_event_ids:
        lambda_client.invoke(
            FunctionName="pysbr-getCurrentLines",
            Payload=(
                '{"sport":"nba","gameIds":[' + ",".join(str(game_id) for game_id in sbr_event_ids) + "]}"
            ),
        )

    return {
        "message": "NBA schedule updated",
        "gamesUpdated": len(write_operations),
        "startDate": start_date.strftime("%Y-%m-%d"),
        "endDate": end_date.strftime("%Y-%m-%d"),
    }


lambda_handler2 = lambda_handler