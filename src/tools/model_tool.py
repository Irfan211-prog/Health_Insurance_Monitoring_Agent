import joblib
import pandas as pd

# Load the trained model only once
model = joblib.load("models/fraud_model.pkl")


def predict_fraud(claim_data):
    """
    Predict fraud probability for one insurance claim.
    """

    df = pd.DataFrame([claim_data])

    probability = model.predict_proba(df)[0][1]

    return float(probability)