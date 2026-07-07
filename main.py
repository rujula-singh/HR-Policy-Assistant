
from fastapi import FastAPI
from pydantic import BaseModel
from rag import generate_answer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
  ]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["GET","POST"],
  allow_headers=["*"]
)

class QuestionRequest(BaseModel):
  question: str

@app.get("/")
def read_root():
  return {
    "message":"CORS configured successfully"
  }

@app.post("/ask")
def ask_question(request: QuestionRequest):
  try:
    answer = generate_answer(request.question)
    return {
      "answer":answer
    }
  except Exception as e:
    import traceback
    traceback.print_exc()
    raise


