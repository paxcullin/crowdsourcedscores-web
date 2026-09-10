from pysbr import Sportsbook
from pymongo import MongoClient, UpdateOne
from pysbr.config.config import Config

client = MongoClient("mongodb+srv://" +  str(Config.username) + ":" + str(Config.password) + "@pcsm.lwx4u.mongodb.net/pcsm?retryWrites=true&w=majority")
db = client['pcsm']
collection = db['sportsbooks']

def lambda_handler(event, context):
    sportsbook = Sportsbook()
    config = sportsbook.sportsbook_config()

    # Build a map: sportsbook_id -> {name, aliases, system_id}
    books_map = {}
    for book in config.get("sportsbooks", []):
        book_id = book.get("sportsbook id")
        if book_id is None:
            continue
        
        name = book.get("name", "")
        alias = book.get("alias", "")
        system_id = book.get("system sportsbook id")
        
        if book_id not in books_map:
            books_map[book_id] = {
                "sportsbookId": book_id,
                "name": name,
                "aliases": set(),
                "systemSportsbookId": system_id,
            }
        
        # Add alias if different from primary name
        if alias and alias != name:
            books_map[book_id]["aliases"].add(alias)
    
    # Convert to sorted list with aliases as list
    books = []
    writeOperations = []
    for book_id in sorted(books_map.keys()):
        book = books_map[book_id]
        books.append({
            "sportsbookId": book["sportsbookId"],
            "name": book["name"],
            "aliases": sorted(list(book["aliases"])),
            "systemSportsbookId": book["systemSportsbookId"],
        })
        writeOperations.append(UpdateOne({"sportsbookId": book["sportsbookId"]}, {"$set": {
            "name": book["name"],
            "aliases": sorted(list(book["aliases"])),
            "systemSportsbookId": book["systemSportsbookId"],
        }}, upsert=True))
    
    books.sort(key=lambda book: (book.get("name") or "").lower())

    print('books: ', books)
    writeResponse = collection.bulk_write(writeOperations, ordered=False)
    print('writeResponse: ', writeResponse)
    # "upserted_id": str(writeResponse.upserted_id) if writeResponse.upserted_id else None
    return {
        "count": len(books),
        "books": books,
        "writeResponse": {
            "matched_count": writeResponse.matched_count,
            "modified_count": writeResponse.modified_count
        }
    }
