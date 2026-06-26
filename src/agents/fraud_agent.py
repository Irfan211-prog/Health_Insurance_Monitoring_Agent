from tools.model_tool import predict_fraud


class FraudAgent:

    def analyze(self, claim_data):

        probability = predict_fraud(claim_data)

        score = round(probability * 100, 2)

        if score < 30:
            risk = "LOW"
            action = "AUTO APPROVE"

        elif score < 60:
            risk = "MEDIUM"
            action = "MANUAL REVIEW"

        elif score < 80:
            risk = "HIGH"
            action = "FLAG FOR INVESTIGATION"

        else:
            risk = "CRITICAL"
            action = "ESCALATE TO SIU"

        return {
            "fraud_probability": probability,
            "risk_score": score,
            "risk_level": risk,
            "recommended_action": action
        }