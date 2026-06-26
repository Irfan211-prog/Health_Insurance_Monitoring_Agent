from tools.ollama_tool import ask_llm


class ExplanationAgent:

    def explain(self, claim, fraud_result):

        prompt = f"""
You are an experienced health insurance fraud investigator.

Claim Details:
{claim}

Fraud Analysis:
Probability: {fraud_result['fraud_probability']:.2f}
Risk Level: {fraud_result['risk_level']}
Recommended Action: {fraud_result['recommended_action']}

Explain in simple English:

1. Why this claim received this risk level.
2. Mention suspicious factors.
3. Mention positive factors.
4. Give recommendation to investigator.

Keep answer under 150 words.
"""

        return ask_llm(prompt)