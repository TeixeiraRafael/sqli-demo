from typing import Optional
from pydantic import BaseModel
from datetime import date

class Expense(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    amount: float
    category: Optional[str] = None
    user_id: Optional[int] = None
    date: date

class ExpenseRequest(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    amount: float
    category: Optional[str] = None
    date: date