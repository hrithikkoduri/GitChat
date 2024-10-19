from langchain_community.vectorstores import DeepLake
from langchain_openai import OpenAIEmbeddings
from langchain.docstore.document import Document
import os 
from dotenv import load_dotenv
import git  
from pathlib import Path
from langchain_community.document_loaders import TextLoader
import shutil
from langchain.text_splitter import SpacyTextSplitter
import time


load_dotenv()
activeloop_token = os.getenv("ACTIVELOOP_TOKEN")
openai_api_key = os.getenv("OPENAI_API_KEY")

class VectorStore:
    def __init__(self):
        self.activeloop_org = "hrithikkoduri18"
        self.activeloop_dataset = "gitchat_test_7"
        self.dataset_path = f"hub://{self.activeloop_org}/{self.activeloop_dataset}"
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
        self.db = None

    
    def load_db(self):
        self.db = DeepLake(dataset_path = self.dataset_path, embedding=self.embeddings)
        return self.db
    
    def load_github_repo(self, repo_url):
        self.db = DeepLake(dataset_path = self.dataset_path, embedding=self.embeddings)

        docs = []
        all_document_objects = []
        repo_dir = "repo"
        if os.path.exists(repo_dir):
            shutil.rmtree(repo_dir)

        print(f"Cloning Repo from {repo_url}...")
        git.Repo.clone_from(repo_url, repo_dir)
        print("Cloned Repo!")

        for file_path in Path(repo_dir).rglob("*"):
            if file_path.is_file() and not file_path.name.startswith("."):
                try:
                    loader = TextLoader(file_path, encoding="utf-8")
                    docs.extend(loader.load())
                except Exception as e:
                    print(f"Error loading file {file_path}: {e}")
                
        print(f"Loaded {len(docs)} files from repo!")
        print("Splitting documents further now...")

        text_splitter = SpacyTextSplitter(
            chunk_size=1000,
            chunk_overlap=50,
        )

        for doc in docs:
            splits = text_splitter.split_text(doc.page_content)
            metadata = {
                "source": doc.metadata["source"],
                "repo_url": repo_url,
            }

            print(f"Adding {len(splits)} chunks for {doc.metadata['source']} to the vector store...")
            for split in splits:
                all_document_objects.append(Document(page_content=split, metadata=metadata))
        
        shutil.rmtree(repo_dir)
        print(f"Adding {len(all_document_objects)} chunks to the vector store...")
        non_empty_docs = [doc for doc in all_document_objects if doc.page_content.strip()]
        print(f"Adding {len(non_empty_docs)} non-empty chunks to the vector store...")
        self.db.add_documents(documents=non_empty_docs)    
        print("Repo Cloned and Loaded!")

        return self.db

    def delete_github_repo(self, repo_url):
        
        self.db = DeepLake(dataset_path = self.dataset_path)

        print(f"Deleting all documents related to {repo_url} from the vector store...")
        self.db.delete(
            filter={"metadata": {"repo_url": repo_url}}
        )
        print("Deleted all documents!")
