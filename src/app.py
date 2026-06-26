import joblib
import pandas as pd
import io
import json
import requests

from flask import Flask, render_template, request, jsonify, Response, send_file
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from agents.recommendation_agent import RecommendationAgent
from tools.ollama_tool import ask_llm
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# =========================
# LOAD MODEL
# =========================
model = joblib.load("models/fraud_model.pkl")

recommendation_agent = RecommendationAgent()

# =========================
# STORE LAST PREDICTION
# =========================
LAST_CLAIM = {}

# =========================
# FEATURES
# =========================
selected_features = [
    "Claim_Amount", "Patient_Age", "Provider_Type", "Provider_Specialty",
    "Diagnosis_Code", "Procedure_Code", "Number_of_Procedures",
    "Admission_Type", "Discharge_Type", "Service_Type",
    "Length_of_Stay_Days", "Deductible_Amount", "CoPay_Amount",
    "Number_of_Previous_Claims_Patient", "Number_of_Previous_Claims_Provider",
    "Provider_Patient_Distance_Miles", "Claim_Submitted_Late",
    "Claim_Delay_Days", "Days_To_Policy_Expiry",
    "Claim_Month", "Claim_DayOfWeek",
    "Claim_to_Age_Ratio", "High_Claim_Flag", "Frequent_Claim_Flag"
]

# =========================
# FEATURE ENGINEERING
# =========================
def create_features(df):

    df["Claim_Date"] = pd.to_datetime(df["Claim_Date"])
    df["Service_Date"] = pd.to_datetime(df["Service_Date"])
    df["Policy_Expiration_Date"] = pd.to_datetime(df["Policy_Expiration_Date"])

    df["Claim_Delay_Days"] = (df["Claim_Date"] - df["Service_Date"]).dt.days
    df["Days_To_Policy_Expiry"] = (df["Policy_Expiration_Date"] - df["Claim_Date"]).dt.days

    df["Claim_to_Age_Ratio"] = df["Claim_Amount"] / (df["Patient_Age"] + 1)

    df["High_Claim_Flag"] = (df["Claim_Amount"] > 100000).astype(int)

    df["Frequent_Claim_Flag"] = (
        df["Number_of_Previous_Claims_Patient"] > 5
    ).astype(int)

    df["Claim_Month"] = df["Claim_Date"].dt.month
    df["Claim_DayOfWeek"] = df["Claim_Date"].dt.dayofweek

    return df

# =========================
# RISK FUNCTION
# =========================
def get_risk(score):
    if score < 30:
        return "LOW", "AUTO APPROVE"
    elif score < 60:
        return "MEDIUM", "MANUAL REVIEW"
    elif score < 80:
        return "HIGH", "FLAG FOR INVESTIGATION"
    else:
        return "CRITICAL", "ESCALATE TO SIU"


# =========================
# PREDICT API
# =========================
@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.json

        df_input = pd.DataFrame([{
            "Claim_Amount": float(data["Claim_Amount"]),
            "Patient_Age": int(data["Patient_Age"]),
            "Provider_Type": data["Provider_Type"],
            "Provider_Specialty": data["Provider_Specialty"],
            "Diagnosis_Code": data["Diagnosis_Code"],
            "Procedure_Code": data["Procedure_Code"],
            "Number_of_Procedures": int(data["Number_of_Procedures"]),
            "Admission_Type": data["Admission_Type"],
            "Discharge_Type": data["Discharge_Type"],
            "Service_Type": data["Service_Type"],
            "Length_of_Stay_Days": int(data["Length_of_Stay_Days"]),
            "Deductible_Amount": float(data["Deductible_Amount"]),
            "CoPay_Amount": float(data["CoPay_Amount"]),
            "Number_of_Previous_Claims_Patient": int(data["Number_of_Previous_Claims_Patient"]),
            "Number_of_Previous_Claims_Provider": int(data["Number_of_Previous_Claims_Provider"]),
            "Provider_Patient_Distance_Miles": float(data["Provider_Patient_Distance_Miles"]),
            "Claim_Submitted_Late": int(data["Claim_Submitted_Late"]),
            "Claim_Date": data["Claim_Date"],
            "Service_Date": data["Service_Date"],
            "Policy_Expiration_Date": data["Policy_Expiration_Date"]
        }])

        df_input = create_features(df_input)
        df_input = df_input[selected_features]

        prob = model.predict_proba(df_input)[0][1]
        score = round(prob * 100, 2)

        risk, action = get_risk(score)
        global LAST_CLAIM

        LAST_CLAIM = {
            "claim": data,
            "fraud_probability": float(prob),
            "risk_score": score,
            "risk_level": risk,
            "recommended_action": action
        }

        recommendation = recommendation_agent.generate_recommendations(
            df_input.to_dict(orient="records")[0],
            {
                "fraud_probability": float(prob),
                "risk_score": score,
                "risk_level": risk
            }
        )

        return jsonify({
            "success": True,
            "fraud_probability": float(round(prob, 4)),
            "risk_score": float(score),
            "risk_level": risk,
            "recommended_action": action,
            "recommendations": recommendation
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# =========================
# CHAT (NORMAL)
# =========================
@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.json
        question = data.get("question", "")

        prompt = f"""
You are an AI Health Insurance Fraud Investigation Assistant.

The following is the latest fraud prediction.

Prediction Data:
{LAST_CLAIM}

User Question:
{question}

Rules:
1. Answer ONLY using the prediction data above.
2. Never answer in a generic way.
3. If the user asks why the claim is risky, explain using:
   - Claim Amount
   - Patient Age
   - Previous Claims
   - Provider History
   - Claim Delay
   - Risk Level
   - Fraud Probability
4. If the claim is LOW risk, explain why it appears safe.
5. If the claim is HIGH risk, explain the suspicious factors.
6. If the user asks what to verify, suggest documents like:
   - Hospital Invoice
   - Medical Records
   - Policy Details
   - Procedure Justification
7. Keep answers short (5-10 lines).
8. Never make up information that is not present in the prediction.
"""

        response = ask_llm(prompt)

        return jsonify({
            "success": True,
            "answer": response
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# =========================
# CHAT STREAM (FIXED)
# =========================
@app.route("/chat_stream", methods=["POST"])
def chat_stream():
    if not LAST_CLAIM:

        def generate():
            message = (
                "Hello! I'm your Fraud Assistant.\n\n"
                "Please run a prediction first.\n"
            )

            for word in message.split():
                yield word + " "

        return Response(generate(), mimetype="text/plain")

    data = request.json
    question = data.get("question", "")

    prompt = f"""
You are an AI Health Insurance Fraud Investigation Assistant.

Latest Prediction:
{LAST_CLAIM}

User Question:
{question}

Rules:
- Answer ONLY using the latest prediction.
- Explain why the fraud probability is high or low.
- Mention claim amount, previous claims, provider history, claim delay, patient age and risk level.
- Give short professional answers.
"""

    def generate():

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": True
            },
            stream=True
        )

        for line in response.iter_lines():

            if line:

                try:

                    chunk = json.loads(line.decode("utf-8"))

                    text = chunk.get("response", "")

                    yield text

                except Exception:
                    continue

    return Response(generate(), mimetype="text/plain")

# =========================
# PDF REPORT
# =========================
def create_pdf(text):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    content = [Paragraph(line, styles["Normal"]) for line in text.split("\n") if line.strip()]
    doc.build(content)

    buffer.seek(0)
    return buffer

@app.route("/download_pdf", methods=["POST"])
def download_pdf():

    data = request.json
    text = data.get("text", "")

    pdf = create_pdf(text)

    return send_file(
        pdf,
        as_attachment=True,
        download_name="fraud_report.pdf",
        mimetype="application/pdf"
    )

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)