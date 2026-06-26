from tools.ollama_tool import ask_llm


class ReportAgent:

    def generate_report(self,
                        claim,
                        fraud_result,
                        explanation,
                        investigation):

        prompt = f"""
You are an AI Insurance Report Generator.

Generate a professional Health Insurance Fraud Report.

Claim Details:
{claim}

Fraud Analysis:
{fraud_result}

Explanation:
{explanation}

Investigation Findings:
{investigation}

Create the report using exactly these sections:

=====================================
HEALTH INSURANCE FRAUD REPORT
=====================================

1. Claim Summary

2. Fraud Prediction

3. AI Explanation

4. Investigation Findings

5. Final Recommendation

Make it professional and under 400 words.
"""

        return ask_llm(prompt)