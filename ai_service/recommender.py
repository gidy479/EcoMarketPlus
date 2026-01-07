import random

def get_recommendations(user_id, purchase_history):
    """
    Mock recommendation engine.
    In a real system, this would use collaborative filtering or content-based filtering.
    """
    # Mock database of eco-friendly recommendations
    eco_products = [
        {"id": "1", "name": "Bamboo Toothbrush", "reason": "Reduces plastic waste"},
        {"id": "2", "name": "Reusable Water Bottle", "reason": "Saves money and plastic"},
        {"id": "3", "name": "Solar Power Bank", "reason": "Renewable energy source"},
        {"id": "4", "name": "Organic Cotton Tote", "reason": "Sustainable material"},
    ]
    
    # Simple logic: Return random items for now
    return random.sample(eco_products, 2)
