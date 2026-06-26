from tools.ollama_tool import ask_llm


class RecommendationAgent:

    def generate_recommendations(self, claim, fraud_result):

        prompt = f"""
You are an Insurance Fraud Decision Support Agent.

Based on the claim and fraud analysis, generate actionable next steps.

Claim:
{claim}

Fraud Result:
{fraud_result}

Give a structured response with:

1. Immediate Actions
2. Documents to Verify
3. Risk Handling Steps
4. Prevention Suggestions

Keep it short, clear, and practical.
"""

        return ask_llm(prompt)