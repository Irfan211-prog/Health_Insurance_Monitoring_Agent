from agents.fraud_agent import FraudAgent
from agents.explanation_agent import ExplanationAgent
from agents.investigation_agent import InvestigationAgent
from agents.report_agent import ReportAgent


class CoordinatorAgent:

    def __init__(self):

        self.fraud_agent = FraudAgent()

        self.explanation_agent = ExplanationAgent()

        self.investigation_agent = InvestigationAgent()

        self.report_agent = ReportAgent()

    def analyze_claim(self, claim):

        # Step 1
        fraud_result = self.fraud_agent.analyze(claim)

        # Step 2
        explanation = self.explanation_agent.explain(
            claim,
            fraud_result
        )

        # Step 3
        investigation = self.investigation_agent.investigate(
            claim,
            fraud_result
        )

        # Step 4
        report = self.report_agent.generate_report(
            claim,
            fraud_result,
            explanation,
            investigation
        )

        return {

            "fraud_result": fraud_result,

            "explanation": explanation,

            "investigation": investigation,

            "report": report

        }