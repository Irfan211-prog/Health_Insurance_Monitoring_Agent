from tools.ollama_tool import ask_llm


class InvestigationAgent:

    def investigate(self, claim, fraud_result):

        prompt = f"""
You are a senior Health Insurance Fraud Investigator.

Analyze the following insurance claim.

Claim Details:
{claim}

Fraud Result:
Probability: {fraud_result["fraud_probability"]:.2f}
Risk Level: {fraud_result["risk_level"]}

Generate a professional investigation report.

Include exactly these sections:

1. Red Flags
2. Positive Indicators
3. Information to Verify
4. Recommended Investigation Steps
5. Final Recommendation

Keep the report under 250 words.
"""

        response = ask_llm(prompt)

        return response