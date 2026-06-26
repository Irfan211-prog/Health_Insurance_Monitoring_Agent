from agents.coordinator_agent import CoordinatorAgent

agent = CoordinatorAgent()

claim = {
    "Claim_Amount": 1883481.3,
    "Patient_Age": 40,
    "Provider_Type": "Laboratory",
    "Provider_Specialty": "Cardiology",
    "Diagnosis_Code": "J02.9",
    "Procedure_Code": "99203",
    "Number_of_Procedures": 2,
    "Admission_Type": "Elective",
    "Discharge_Type": "Deceased",
    "Service_Type": "Outpatient",
    "Length_of_Stay_Days": 0,
    "Deductible_Amount": 3618.4,
    "CoPay_Amount": 851.43,
    "Number_of_Previous_Claims_Patient": 0,
    "Number_of_Previous_Claims_Provider": 6,
    "Provider_Patient_Distance_Miles": 170.4,
    "Claim_Submitted_Late": 0,
    "Claim_Delay_Days": 2,
    "Days_To_Policy_Expiry": 1540,
    "Claim_Month": 1,
    "Claim_DayOfWeek": 6,
    "Claim_to_Age_Ratio": 1883481.3 / 41,
    "High_Claim_Flag": 1,
    "Frequent_Claim_Flag": 0
}

result = agent.analyze_claim(claim)

print(result["fraud_result"])

print("\n")

print(result["explanation"])

print("\n")

print(result["investigation"])

print("\n")

print(result["report"])