from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from VectorStore import VectorStore
import json
import re
from ai_output import Output
from typing import List


app = FastAPI()
deeplake = VectorStore()

origins = [
    "http://localhost:3000",  # Allow requests from your Next.js app
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    sender: str
    message: str

class PromptRequest(BaseModel):
    question: str
    #chat_history: List[ChatMessage]

class RepoRequest(BaseModel):
    githubRepo: str

output = Output()
db = None

@app.post("/chat/")
async def chat(request: PromptRequest):
    try:
        print("Request: ", request.question)
        #print("Chat History: ", request.chat_history)

        #response = output.chat(request.question, request.chat_history)
        response = output.chat(request.question)
        
        print("Response: ", response)
        return {"response": response}

    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/load-repo/")
async def load_repo(repo_request: RepoRequest):
    try:
        repo_url = repo_request.githubRepo  
        db = deeplake.load_github_repo(repo_url)
        return {"status": "Success"}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/delete-repo/")
async def delete_repo(repo_request: RepoRequest):
    try:
        repo_url = repo_request.githubRepo
        deeplake.delete_github_repo(repo_url)
        return {"status": "Success"}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))

