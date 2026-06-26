from agents.report_agent import ReportAgent

agent = ReportAgent()

claim = {
    "Claim_Amount": 1883481.3,
    "Patient_Age": 40,
    "Provider_Type": "Laboratory"
}

fraud_result = {
    "fraud_probability": 0.44,
    "risk_level": "MEDIUM",
    "recommended_action": "MANUAL REVIEW"
}

explanation = """
The claim amount is relatively high compared to similar claims.
The model recommends manual review.
"""

investigation = """
Red Flags:
- High claim amount
- Multiple previous provider claims

Recommendation:
Verify hospital records before approval.
"""

report = agent.generate_report(
    claim,
    fraud_result,
    explanation,
    investigation
)

print(report)