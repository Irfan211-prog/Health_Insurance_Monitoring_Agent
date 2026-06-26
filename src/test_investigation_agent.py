from agents.investigation_agent import InvestigationAgent

agent = InvestigationAgent()

claim = {
    "Claim_Amount": 1883481.3,
    "Patient_Age": 40,
    "Provider_Type": "Laboratory",
    "Diagnosis_Code": "J02.9"
}

fraud_result = {
    "fraud_probability": 0.44,
    "risk_level": "MEDIUM"
}

result = agent.investigate(claim, fraud_result)

print(result)