import debugpy
import uvicorn

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.config.environment import DEBUG
from src.controller.AuthController import AuthController
from src.controller.ExpenseController import ExpenseController

from psycopg2.errors import SyntaxError, Error

app = FastAPI()

@app.exception_handler(Exception)
async def custom_exception_handler(request: Request, exc : Exception) -> JSONResponse: 
    return JSONResponse(status_code=400, content={ "success": False, "errors": str(exc) })

@app.exception_handler(SyntaxError)
async def custom_exception_handler(request: Request, exc : Exception) -> JSONResponse: 
    return JSONResponse(status_code=400, content={ "success": False, "errors": str(exc) })

@app.exception_handler(Error)
async def custom_exception_handler(request: Request, exc : Exception) -> JSONResponse: 
    return JSONResponse(status_code=400, content={ "success": False, "errors": str(exc) })

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_controller = AuthController()
expense_controller = ExpenseController()

app.include_router(auth_controller.router)
app.include_router(expense_controller.router)

if __name__ == '__main__':
    if DEBUG:
        debugpy.listen(("0.0.0.0", 5678))
    uvicorn.run(app, host="0.0.0.0", port=80)