from pathlib import Path

import pandas as pd


def process_csv(file_path):
    path = Path(file_path)

    dataframe = pd.read_csv(path)

    result = {
        "file_name": path.name,
        "rows": len(dataframe),
        "columns": len(dataframe.columns),
        "column_names": dataframe.columns.tolist(),
        "missing_values": int(
            dataframe.isnull().sum().sum()
        ),
        "duplicate_rows": int(
            dataframe.duplicated().sum()
        ),
    }

    return result