import pandas as pd

def analyze_spending(transactions):
    """
    Analyzes transaction data to provide insights.
    Input: List of dicts [{'amount': 10, 'category': 'Food', 'type': 'DEBIT'}]
    """
    if not transactions:
        return {"total_spent": 0, "breakdown": {}, "insight": "No data available."}

    df = pd.DataFrame(transactions)
    
    # Filter for debits
    debits = df[df['type'] == 'DEBIT']
    
    if debits.empty:
        return {"total_spent": 0, "breakdown": {}, "insight": "No spending detected."}

    total_spent = debits['amount'].sum()
    breakdown = debits.groupby('category')['amount'].sum().to_dict()
    
    # Simple Insight Generation
    insight = "Spending is within normal limits."
    if total_spent > 1000:
        insight = "High spending detected this month. Consider reviewing your budget."
    
    return {
        "total_spent": float(total_spent),
        "breakdown": breakdown,
        "insight": insight
    }
