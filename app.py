from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
# import json
import ev_ranges, ev_stations, ev_sales, station_counts

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
conn = "mongodb://localhost:27017/ev_data"
mongo = PyMongo(app, uri = conn)

# Call functions to populate collections in mongo
ev_range = ev_ranges.ranges()
ev_sale = ev_sales.sales()
ev_station = ev_stations.stations()
ev_station_count = station_counts.stationCounts()
mongo.db.ranges.update_one({}, {"$set": ev_range}, upsert=True)
mongo.db.sales.update_one({}, {"$set": ev_sale}, upsert=True)
mongo.db.stations.update_one({}, {"$set": ev_station}, upsert=True)
mongo.db.counts.update_one({}, {"$set": ev_station_count}, upsert=True)


# Route to render index.html
@app.route("/")
def home():
    
    # Return template and data
    return render_template("index.html")


# Route that will plot the map
@app.route("/map")
def map():

    return render_template("map.html")


# Route that will store the range json and send calls to webpage for the range plot
@app.route("/ev-ranges")
def ReadMongoRanges():
    
    result = mongo.db.ranges.find()
    result_list = list(result)
    
    if len(result_list) > 0:
        # Return the first result only and strip off the '_id'
        data = result_list[0] 
        id_to_discard = data.pop('_id', None)
    else:
        # Construct an error message
        data = {'Error': 'No data found'}        

    print('Returning data from MongoDB')

    return jsonify(data)

# Route that will store the sales json and send calls to webpage for the sales plot
@app.route("/ev-sales")
def ReadMongoSales():
    
    result = mongo.db.sales.find()
    result_list = list(result)
    
    if len(result_list) > 0:
        # Return the first result only and strip off the '_id'
        data = result_list[0] 
        id_to_discard = data.pop('_id', None)
    else:
        # Construct an error message
        data = {'Error': 'No data found'}        

    print('Returning data from MongoDB')

    return jsonify(data)

# Route for sending mongo collection for charging stations to be used in leaflet
@app.route("/ev-stations")
def ReadMongoStations():
    
    result = mongo.db.stations.find()
    result_list = list(result)
    
    if len(result_list) > 0:
        # Return the first result only and strip off the '_id'
        data = result_list[0] 
        id_to_discard = data.pop('_id', None)
    else:
        # Construct an error message
        data = {'Error': 'No data found'}        

    print('Returning data from MongoDB')

    return jsonify(data)

# Route for sending mongo collection for charging stations counts for plots
@app.route("/ev-station-counts")
def ReadMongoStationCounts():
    
    result = mongo.db.counts.find()
    result_list = list(result)
    
    if len(result_list) > 0:
        # Return the first result only and strip off the '_id'
        data = result_list[0] 
        id_to_discard = data.pop('_id', None)
    else:
        # Construct an error message
        data = {'Error': 'No data found'}        

    print('Returning data from MongoDB')

    return jsonify(data)





if __name__ == "__main__":
    app.run(debug=True)
