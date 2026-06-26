from agents.explanation_agent import ExplanationAgent

agent = ExplanationAgent()

claim = {
    "Claim_Amount": 1883481.3,
    "Patient_Age": 40
}

fraud_result = {
    "fraud_probability": 0.44,
    "risk_level": "MEDIUM",
    "recommended_action": "MANUAL REVIEW"
}

print(agent.explain(claim, fraud_result))