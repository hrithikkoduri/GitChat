
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from langchain_community.vectorstores import DeepLake
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import (
    create_history_aware_retriever,
    create_retrieval_chain,
)
from langchain_core.messages import HumanMessage, AIMessage



load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")


class Output:
    def __init__(self, db):
        self.llm = ChatOpenAI(model = "gpt-4o-mini", temperature = 0.5)
        self.db = db
        self.retriever = self.db.as_retriever()
        self.retriever.search_kwargs['distance_metric'] = 'cos'
        self.retriever.search_kwargs['fetch_k'] = 100
        self.retriever.search_kwargs['k'] = 10
        self.chat_history = []

        self.prompt_search_query = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="chat_history"),
        ("user","{input}"),
        ("user","Given the above conversation, generate a search query to look up to get information relevant to the conversation")
        ])
    
        self.retriever_chain = create_history_aware_retriever(self.llm, self.retriever, self.prompt_search_query)
        
        self.system_message  = '''   
            You are an AI assistant designed to help users understand and interact with GitHub repositories. Your primary role is to answer questions based on the information extracted from the specified GitHub repo URL, which the user has already provided and is stored in the vector store.

            For the context of the conversation, you can use this {context}.

            If no question is asked, offer a brief overview of the repository and suggest possible questions. If you don't know the answer, ask the user to be more specific. If the question is not related to the repository, request a relevant question.

            When asked for code snippets, provide exact code as it appears in the repository; do not generate or summarize code on your own.

            **Your goals are to:**
            - Answer questions related to the GitHub repository.
            - Provide relevant code snippets and explanations as needed.
            - Offer guidance on understanding repository structures, files, and functionalities.
            - Assist with common GitHub operations and best practices.
            - Also mention which file the code snippet is from by giving a seperate reference section at the end of the code snippet.

            **Behavior Guidelines:**
            1. Be helpful, friendly, and concise.
            2. Provide code snippets and explanations when requested.
            3. Focus solely on the information available in the GitHub repository context.
            4. If a question exceeds the documentation, guide users to the relevant sections or suggest they check the repository directly.
            5. Use technical language only when necessary; prioritize simplicity and clarity.

            '''

        self.prompt_get_answer = ChatPromptTemplate.from_messages([
            ("system", self.system_message),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            ("user", "Given the above conversation, generate an answer to the user's question.")
        ])
        
        self. document_chain= create_stuff_documents_chain(self.llm, self.prompt_get_answer)
        self.retrieval_chain = create_retrieval_chain(self.retriever_chain, self.document_chain)



    #def chat(self, question, chat_history):
    def chat(self, question):
        
        print("Entered chat function")
        print("-------------------")
        print("Question inside function:",question)
        print("-------------------")
        print("Chat History inside function:",self.chat_history)

        response = self.retrieval_chain.invoke(
            {"input": question, "chat_history": self.chat_history}
        )
        print("-------------------")
        print( "Context:",response['context'])
        print("-------------------")
        self.chat_history.append(HumanMessage(question))
        self.chat_history.append(AIMessage(response['answer']))

        self.chat_history = self.chat_history[-6:]

        json_response = {
            "response": response['answer'],
            "chat_history": self.chat_history
        }
        return json_response

def main():
    output = Output()
    question = "What is the purpose of this repository?"
    response = output.chat(question)
    print("Response:",response['response'])
    print("Chat History:",response['chat_history'])

    print("-------------------")
    question = "What are the different features?"
    response = output.chat(question)
    print("Response:",response['response'])
    print("Chat History:",response['chat_history'])

    

if __name__ == "__main__":
    main()