from typing import List

from src.model.Expense import Expense
from src.repository.BaseRepository import BaseRepository

class ExpenseRepository(BaseRepository):

    def __init__(self):
        super()

    def create_expense(self, expense: Expense) -> Expense:
        query = f"""INSERT INTO expenses(user_id, name, description, category, amount, date) VALUES ({expense.user_id}, '{expense.name}', '{expense.description}', '{expense.category}', {expense.amount}, '{expense.date}') RETURNING * ;"""
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute(query)
        row = cursor.fetchone()
        
        if row is None:
            return None

        _expense = Expense(
            id=row.get("id"),
            user_id=row.get("user_id"),
            name=row.get("name"),
            category=row.get("category"),
            description=row.get("description"),
            amount=row.get("amount"),
            date=row.get("date")
        )

        connection.commit()
        connection.close()
        return _expense
    
    def get_all_expenses(self, user_id) -> List[Expense]:
        query = f"""SELECT * FROM expenses WHERE expenses.user_id = '{user_id}'"""

        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute(query)
        
        expenses = []
        rows = cursor.fetchall()

        for row in rows:
            _expense = Expense(
                id=row.get("id"),
                user_id=row.get("user_id"),
                name=row.get("name"),
                category=row.get("category"),
                description=row.get("description"),
                amount=row.get("amount"),
                date=row.get("date")
            )
            expenses.append(_expense)
        
        connection.commit()
        connection.close()
        return expenses

    def get_expenses_by_category(self, user_id, category) -> List[Expense]:
        connection = self.connect()
        cursor = connection.cursor()

        query = f"""SELECT * FROM expenses WHERE expenses.user_id = '{user_id}' AND expenses.category = '{category}' ORDER BY date DESC"""
        cursor.execute(query)
        
        expenses = []
        rows = cursor.fetchall()

        for row in rows:
            _expense = Expense(
                id=row.get("id"),
                user_id=row.get("user_id"),
                name=row.get("name"),
                category=row.get("category"),
                description=row.get("description"),
                amount=row.get("amount"),
                date=row.get("date")
            )
            expenses.append(_expense)

        return expenses
    
    def get_expenses_by_category_safe(self, user_id, category) -> List[Expense]:
        connection = self.connect()
        cursor = connection.cursor()

        query = f"""SELECT * FROM expenses WHERE expenses.user_id = %s AND expenses.category = %s ORDER BY date DESC"""
        cursor.execute(query, (user_id, category))
        
        expenses = []
        rows = cursor.fetchall()

        for row in rows:
            _expense = Expense(
                id=row.get("id"),
                user_id=row.get("user_id"),
                name=row.get("name"),
                category=row.get("category"),
                description=row.get("description"),
                amount=row.get("amount"),
                date=row.get("date")
            )
            expenses.append(_expense)

        return expenses