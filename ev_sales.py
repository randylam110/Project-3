import pandas as pd

def sales():
    
    # Extracting Sales csv file into dataframe
    sales_file = "Data/IEA-EV-dataEV salesCarsHistorical.csv"
    sales_df = pd.read_csv(sales_file)
    
    # Clean Sales dataset by dropping PHEV Powertrain
    sales_df=sales_df.loc[(sales_df['powertrain'] == 'BEV')].reset_index(drop=True)

    # drop unused columns
    sales_df.drop(sales_df.columns[[1,2,3,4,6]], axis=1, inplace=True)

    # select only sales in the US
    sales_df = sales_df.loc[(sales_df['region'] == 'USA')].reset_index(drop=True)

    # change name to something meaningful
    sales_df.rename(columns={'value' : 'sold'}, inplace=True)

    # drop this column since it is no longer needed
    sales_df.drop(columns=['region'], inplace=True)

    return sales_df.to_dict('split')