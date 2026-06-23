import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder
import matplotlib.pyplot as plt
import seaborn as sns
import networkx as nx
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import (OneHotEncoder, StandardScaler, LabelEncoder)
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (classification_report, confusion_matrix, roc_auc_score, precision_score, recall_score, f1_score)
from imblearn.over_sampling import SMOTE
from imblearn.over_sampling import ADASYN
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor

df = pd.read_csv('synthetic_health_claims.csv')
##Check fraud counts in file
df["Is_Fraudulent"].value_counts()

##Make Claim_Date, Service_Date and Policy_Expiration_Date useful

df.head()
df["Claim_Date"] = pd.to_datetime(df["Claim_Date"], format="%d-%m-%Y")
df["Service_Date"] = pd.to_datetime(df["Service_Date"], format="%d-%m-%Y")
df["Policy_Expiration_Date"] = pd.to_datetime(df["Policy_Expiration_Date"], format="%d-%m-%Y")  

## Claim Submission Delay; fraudsters submit late claims often
df["Claim_Delay_Days"] = (df["Claim_Date"] - df["Service_Date"]).dt.days

##Days until Policy Expiry; claims close to policy expiration are sus
df["Days_To_Policy_Expiry"] = (df["Policy_Expiration_Date"] -df["Claim_Date"]).dt.days

##Extract components of date
df["Claim_Month"] = df["Claim_Date"].dt.month
df["Claim_DayOfWeek"] = df["Claim_Date"].dt.dayofweek

##Drop original date columns
df.drop(columns=["Claim_Date", "Service_Date", "Policy_Expiration_Date"], inplace=True, axis = 1) 

##Drop columns not useful for modeling
df.drop(columns=["Claim_ID", "Policy_Number", "Patient_ID"], inplace=True)      

##Separate features and target variable
X = df.drop("Is_Fraudulent", axis=1)
y = df["Is_Fraudulent"]

##Identify column types
cat_cols = X.select_dtypes(include=["object"]).columns
num_cols = X.select_dtypes(exclude=["object"]).columns

##Preprocessing pipelines
num_transformer = Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())])
cat_transformer = Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("encoder", OneHotEncoder(handle_unknown="ignore"))])     
preprocessor = ColumnTransformer([("num", num_transformer, num_cols), ("cat", cat_transformer, cat_cols)])


##Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)   

X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

##SMOTE oversampling
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train_processed, y_train)   

##ADASYN oversampling
adasyn = ADASYN(random_state=42)
X_train_adasyn, y_train_adasyn = adasyn.fit_resample(X_train_processed, y_train)    