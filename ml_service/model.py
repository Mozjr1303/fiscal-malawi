import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

MODEL_PATH = "isolation_forest.pkl"

class AnomalyDetector:
    def __init__(self):
        self.model = None
        self.load_or_train_model()

    def load_or_train_model(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            self._train_initial_model()

    def _train_initial_model(self):
        # Generate some synthetic normal transaction data for initial training
        # Features: [amount, hour_of_day, payment_method_encoded]
        # In a real scenario, this would be loaded from historical data
        np.random.seed(42)
        
        # Normal transactions: mostly between $5 and $500
        normal_amounts = np.random.lognormal(mean=3, sigma=1, size=1000)
        
        # Hours of day (mostly daytime 8-20)
        normal_hours = np.random.normal(loc=14, scale=4, size=1000)
        normal_hours = np.clip(normal_hours, 0, 23)
        
        X = np.column_stack([normal_amounts, normal_hours])
        
        # Initialize and train Isolation Forest
        self.model = IsolationForest(contamination=0.05, random_state=42, n_estimators=100)
        self.model.fit(X)
        
        joblib.dump(self.model, MODEL_PATH)

    def extract_features(self, transaction):
        """
        Convert raw transaction dict into feature array
        Expected input: {'amount': 150.50, 'timestamp': '2023-10-25T14:30:00Z', ...}
        """
        amount = float(transaction.get('amount', 0))
        
        # Extract hour from timestamp if available
        timestamp = transaction.get('timestamp')
        try:
            hour = pd.to_datetime(timestamp).hour
        except:
            hour = 12 # Default to noon if parsing fails
            
        return np.array([[amount, hour]])

    def predict(self, transaction):
        features = self.extract_features(transaction)
        
        # Predict returns 1 for normal, -1 for anomaly
        prediction = self.model.predict(features)[0]
        
        # Decision function returns score (lower means more anomalous)
        # We'll normalize it to a 0-1 scale where 1 is highly anomalous
        score = self.model.decision_function(features)[0]
        
        # Convert score to a 0-1 anomaly probability (approximate)
        # Decision function is typically between -0.5 and 0.5
        normalized_score = 1.0 - (1.0 / (1.0 + np.exp(-10 * score))) # Sigmoid mapping
        
        is_anomaly = bool(prediction == -1)
        
        return {
            "is_anomaly": is_anomaly,
            "anomaly_score": float(normalized_score)
        }

# Singleton instance
detector = AnomalyDetector()
