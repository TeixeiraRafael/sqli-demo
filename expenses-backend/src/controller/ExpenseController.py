import csv
from io import StringIO

from fastapi import APIRouter, Depends, UploadFile, Query, HTTPException

from src.model.User import User
from src.model.Expense import Expense, ExpenseRequest
from src.auth.JwtHandler import JwtHandler
from src.repository.ExpenseRepository import ExpenseRepository

class ExpenseController:
    def __init__(
        self,
        router = APIRouter(),
        expense_repository = ExpenseRepository()
    ):
        self.router = router
        self.expense_repository = expense_repository

        self.router.add_api_route("/expenses/upload", self.upload_expenses, methods=["POST"])
        self.router.add_api_route("/expenses", self.create_expense, methods=["POST"])
        self.router.add_api_route("/expenses", self.get_expenses, methods=["GET"])
        self.router.add_api_route("/expenses/search", self.search_expenses, methods=["GET"])

    def create_expense(self,
            request: ExpenseRequest,
            current_user : User = Depends(JwtHandler())
        ):        
        
        expense = Expense(
            id=None, 
            name=request.name, 
            description=request.description, 
            amount=request.amount, 
            category=request.category, 
            user_id=current_user.id, 
            date=request.date
        )
        _expense = self.expense_repository.create_expense(expense)
        
        return {"success": True, "expense": _expense}
    
    # GET /expenses
    def get_expenses(self, current_user: User = Depends(JwtHandler())):
        expenses = self.expense_repository.get_all_expenses(current_user.id)

        return {
            "success": True,
            "expenses": expenses
        }
    # GET /expenses/search?category={category}
    def search_expenses(self, category: str = Query("all"), current_user: User = Depends(JwtHandler())):
        if(category == "all"):
            expenses = self.expense_repository.get_all_expenses(current_user.id)
        else:
            expenses = self.expense_repository.get_expenses_by_category(current_user.id, category)

        return {
            "success": True,
            "expenses": expenses
        }
    
    async def upload_expenses(self, file: UploadFile, current_user: User = Depends(JwtHandler())):
        if file.content_type != "text/csv":
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")

        try:
            contents = file.file.read().decode("utf-8").splitlines()
            csv_reader = csv.reader(contents)

            expenses = []
            for row in csv_reader:
                print(row)
                expense = Expense(
                    id=None, 
                    name=row[0], 
                    description=row[1], 
                    amount=row[2], 
                    category=row[3], 
                    date=row[4],
                    user_id=current_user.id 
                )
                expenses.append(expense)

            for expense in expenses:
                self.expense_repository.create_expense(expense)

            return {"message": f"Successfully uploaded your expenses."}
        
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error processing the CSV file: {str(e)}")
