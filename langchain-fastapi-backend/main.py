from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

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

class PromptRequest(BaseModel):
    question: str

model = ChatOpenAI(model = "gpt-4o-mini", temperature = 0.5)

prompt_template = PromptTemplate(
    template = "Anser the following question: {question}",
    input_variables = ["question"]
)
chain = LLMChain(llm = model, prompt=prompt_template)

@app.post("/generate/")

async def generate_response(request: PromptRequest):
    try:
        print("Request: ", request.question)
        response = chain.run(request.question)
        return {"response": response}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=400, detail=str(e))
