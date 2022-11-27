import pandas as pd
    
def stations():
    # Extracting charging stations csv file into dataframe
    charging_stations = "Data/Electric and Alternative Fuel Charging Stations.csv"
    stations_df = pd.read_csv(charging_stations, low_memory=False)

    # Clean Sales dataset by replacing NaNs with 0
    stations_df = stations_df.fillna(0)
    
    # Select only electric chargers in the US
    stations_df = stations_df.loc[(stations_df['Fuel Type Code'] == 'ELEC') & (stations_df['Country'] == 'US')].reset_index(drop=True)

    # Get only public charging stations
    stations_df = stations_df.loc[stations_df['Access Code'] == 'public'].reset_index(drop=True)

    # delete unused columns
    stations_df = stations_df.drop(columns=['Fuel Type Code','Groups With Access Code','EV Other Info','EV Network Web','Geocode Status','Date Last Confirmed','Facility Type','Status Code','Expected Date','Access Days Time','Updated At','Country','Access Code','EV Pricing','EV On-Site Renewable Source','Restricted Access','Intersection Directions','Plus4','Station Phone','Cards Accepted','BD Blends','NG Fill Type Code','NG PSI','ID','Owner Type Code','Federal Agency ID','Federal Agency Name','Hydrogen Status Link','NG Vehicle Class','LPG Primary','E85 Blender Pump','Intersection Directions (French)','Access Days Time (French)','BD Blends (French)','Groups With Access Code (French)','Hydrogen Is Retail','Access Detail Code','Federal Agency Code','CNG Dispenser Num','CNG On-Site Renewable Source','CNG Total Compression Capacity','CNG Storage Capacity','LNG On-Site Renewable Source','E85 Other Ethanol Blends','EV Pricing (French)','LPG Nozzle Types','Hydrogen Pressures','Hydrogen Standards','CNG Fill Type Code','CNG PSI','CNG Vehicle Class','LNG Vehicle Class'])

    # change the date to only the year
    stations_df['Year Opened'] = pd.DatetimeIndex(stations_df['Open Date']).year

    # remove the old date
    stations_df.drop(columns=['Open Date'], inplace=True)
    
    return stations_df.to_dict('split')