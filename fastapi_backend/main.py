from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from VectorStore import VectorStore
import json
import re
from ai_output import Output
from typing import List
import sqlite3  
import time

class ChatMessage(BaseModel):
    sender: str
    message: str

class PromptRequest(BaseModel):
    question: str
   
class RepoRequest(BaseModel):
    githubRepo: str

class MainApp:
    def __init__(self):
        self.app = FastAPI()
        self.deeplake = VectorStore()
        self.db = self.deeplake.load_db()
        self.output_instance = Output(self.db)
        self.conn, self.c = self.init_db()
        self.origins = [
            "http://localhost:3000",  # Allow requests from your Next.js app
        ]
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        @self.app.on_event("startup")
        async def load_deeplake_db():
            print("deeplake DB loaded at startup")

        @self.app.post("/chat/")
        async def chat(request: PromptRequest):
            try:
                print("Request: ", request.question)
                response = self.output_instance.chat(request.question)
                print("Response: ", response['response'])
                return {"response": response['response']}
            except Exception as e:
                print("Error: ", e)
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.get("/get-repo-url/")
        async def get_repo_url():
            try:
                url = self.is_url()
                if url is not None:
                    return {"url": "Exist", "repo_url": url[0]}
                else:
                    return {"url": "Not Exist"}
            except Exception as e:
                print("Error: ", e)
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/load-repo/")
        async def load_repo(repo_request: RepoRequest):
            try:
                repo_url = repo_request.githubRepo  
                self.deeplake.load_github_repo(repo_url, self.db)
                self.db = self.deeplake.load_db()
                self.output_instance = Output(self.db)
                self.insert_url(repo_url)
                return {"status": "Success"}
            except Exception as e:
                print("Error: ", e)
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/delete-repo/")
        async def delete_repo(repo_request: RepoRequest):
            try:
                repo_url = repo_request.githubRepo
                print("Deleting repo: ", repo_url)
                self.deeplake.delete_github_repo(repo_url, self.db)   
                self.db = self.deeplake.load_db() 
                self.output_instance = Output(self.db)
                self.delete_url(repo_url)
                return {"status": "Success"}
            except Exception as e:
                print("Error: ", e)
                raise HTTPException(status_code=400, detail=str(e))

    def init_db(self):
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

    def insert_url(self, url):
        self.c.execute('INSERT INTO repo_url (url) VALUES (?)', (url,))
        self.conn.commit()

    def is_url(self):
        self.c.execute('SELECT url FROM repo_url ORDER BY processed_at DESC LIMIT 1')  # Fetch most recent URL
        return self.c.fetchone()

    def delete_url(self, url):
        self.c.execute('DELETE FROM repo_url WHERE url = ?', (url,))
        self.conn.commit()

main_app = MainApp()
app = main_app.app