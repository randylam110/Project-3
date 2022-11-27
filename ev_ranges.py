import pandas as pd

def ranges():
    # read in the excel file dropping the top junk rows
    ev_ranges_file = "Data/10963_EV_range_efficiency_1-6-22.xlsx"
    ev_ranges_df = pd.read_excel(ev_ranges_file, skiprows=2)

    # Removing unused data columns

    ev_ranges_df.drop(ev_ranges_df.columns[[0,5,6,7,8,9]], axis=1, inplace=True)


    # Removes the trailing NaNs
    ev_ranges_df.dropna(inplace=True)

    # Group by year with mean of ranges then return to a dataframe format
    ev_gbymean = ev_ranges_df.groupby("Model Year").mean().reset_index()

    # Group by year with max of ranges then return to a dataframe format
    ev_gbymax = ev_ranges_df.groupby("Model Year")["Range"].max().reset_index()

    # Merge the two grouped dataframes back to one
    ev_ranges_by_year = pd.merge(ev_gbymean,ev_gbymax, how="left", on="Model Year")

    # Rename the columns
    ev_ranges_by_year.rename(columns={'Range_x' : 'Average Range', 'Range_y' : 'Max Range'}, inplace=True)

    # Remove first two rows for continuous years
    ev_ranges_by_year.drop([0,1], inplace=True)

    ev_ranges_by_year.reset_index(drop=True, inplace=True)

    # Return final dataframe as a json
    return ev_ranges_by_year.to_dict("split")