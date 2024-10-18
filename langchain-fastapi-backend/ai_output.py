
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
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
activeloop_token = os.getenv("ACTIVELOOP_TOKEN")

class Output:
    def __init__(self):
        self.llm = ChatOpenAI(model = "gpt-4o-mini", temperature = 0.5)

        self.activeloop_org = "hrithikkoduri18"
        self.activeloop_dataset = "gitchat_test_2"
        self.dataset_path = f"hub://{self.activeloop_org}/{self.activeloop_dataset}"
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
        self.db = DeepLake(dataset_path = self.dataset_path, embedding=self.embeddings)
        self.retriever = self.db.as_retriever()
        self.retriever.search_kwargs['distance_metric'] = 'cos'
        self.retriever.search_kwargs['fetch_k'] = 100
        self.retriever.search_kwargs['k'] = 10

        self.prompt_search_query = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="chat_history"),
        ("user","{input}"),
        ("user","Given the above conversation, generate a search query to look up to get information relevant to the conversation")
        ])
    
        self.retriever_chain = create_history_aware_retriever(self.llm, self.retriever, self.prompt_search_query)
        
        self.system_message  = '''   
            You are an AI assistant designed to help users understand and interact with GitHub repositories. Your primary role is to answer questions based on the information extracted from the specified GitHub repo URL.

            The user has already provided the GitHub repository URL, it is stored in the vector store. You will have the conext of the information with the documents in the vector store.

            For the context of conversation, you can use this {context}.

            Your goals are to:
            - Answer questions related to the GitHub repository.
            - Provide relevant code snippets and explanations as needed.
            - Offer guidance on understanding repository structures, files, and functionalities.
            - Assist with common GitHub operations and best practices.

            **Behavior Guidelines:**
            1. Be helpful, friendly, and concise.
            2. Provide code snippets and explanations when requested.
            3. Focus solely on the information available in the GitHub repository context.
            4. If a question exceeds the documentation, guide users to the relevant sections or suggest they check the repository directly.
            5. Use technical language only when necessary; prioritize simplicity and clarity.
            6. If no question is asked, provide a brief overview of the repository and suggest possible questions users might have.

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
        chat_history = []  # Default to an empty list if it's not a list
    
        response = self.retrieval_chain.invoke(
            {"input": question, "chat_history": chat_history}
        )

        return response['answer']

