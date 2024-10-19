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
import sqlite3  
import time


app = FastAPI()
deeplake = VectorStore()

def init_db():
    conn = sqlite3.connect('repo_url.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS repo_url (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE,
            processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    return conn, c

def insert_url(conn, c, url):
    c.execute('INSERT INTO repo_url (url) VALUES (?)', (url,))
    conn.commit()

def is_url_(c):
    c.execute('SELECT url FROM repo_url ORDER BY processed_at DESC LIMIT 1')  # Fetch most recent URL
    return c.fetchone()

def delete_url(conn, c, url):
    c.execute('DELETE FROM repo_url WHERE url = ?', (url,))
    conn.commit()

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
   

class RepoRequest(BaseModel):
    githubRepo: str


db = deeplake.load_db()
conn, c = init_db()



@app.post("/chat/")
async def chat(request: PromptRequest):
    try:
        print("Request: ", request.question)

        response = Output(db).chat(request.question)
        
        print("Response: ", response['response'])
        return {"response": response['response']}

    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/get-repo-url/")
async def get_repo_url():
    db = deeplake.load_db()
    try:
        url = is_url_(c)
        if url is not None:
            return {"url": "Exist", "repo_url": url[0]}
        else:
            return {"url": "Not Exist"}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))



@app.post("/load-repo/")
async def load_repo(repo_request: RepoRequest):
    try:
        repo_url = repo_request.githubRepo  
        db = deeplake.load_github_repo(repo_url)
        insert_url(conn, c, repo_url)
        return {"status": "Success"}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/delete-repo/")
async def delete_repo(repo_request: RepoRequest):
    global db
    try:
        repo_url = repo_request.githubRepo
        print("Deleting repo: ", repo_url)
        db = deeplake.delete_github_repo(repo_url)    
        delete_url(conn, c, repo_url)
        return {"status": "Success"}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))

