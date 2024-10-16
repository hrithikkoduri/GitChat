from langchain.vectorstores import DeepLake
from langchain.embeddings import OpenAIEmbeddings
from langchain.docstore.document import Document
import os 
from dotenv import load_dotenv
import git  
from pathlib import Path
from langchain_community.document_loaders import TextLoader
import shutil
from langchain.text_splitter import RecursiveCharacterTextSplitter




load_dotenv()
activeloop_token = os.getenv("ACTIVELOOP_TOKEN")
openai_api_key = os.getenv("OPENAI_API_KEY")


class VectorStore:
    def __init__(self):
        self.activeloop_org = "hrithikkoduri18"
        self.activeloop_dataset = "GitChat_Test4"
        self.db = DeepLake(dataset_path=f"hub://{self.activeloop_org}/{self.activeloop_dataset}", embedding=OpenAIEmbeddings(model="text-embedding-3-large"))
        self.docs = []

    def load_github_repo(self, repo_url):

        repo_dir = "repo"
        if os.path.exists(repo_dir):
            shutil.rmtree(repo_dir)  # Remove the folder if it exists)

        print(f"Cloning Repo from {repo_url}...")
        git.Repo.clone_from(repo_url, repo_dir)
        print("Cloned Repo!")

        for file_path in Path(repo_dir).rglob("*"):
            if file_path.is_file() and not file_path.name.startswith("."):
                try:
                    loader = TextLoader(file_path, encoding="utf-8")
                    self.docs.extend(loader.load())
                except Exception as e:
                    print(f"Error loading file {file_path}: {e}")
                
        print(f"Loader {len(self.docs)} files from repo!")
        print("Splitting documnets further now...")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=10)  # Adjust as needed

        all_document_objects = []

        for doc in self.docs:
            # Split the document into chunks
            splits = text_splitter.split_text(doc.page_content)
            metadata = {"source": doc.metadata["source"]}

            print(f"Adding {len(splits)} chunks for {doc.metadata['source']} to the vector store...")
            # Create Document objects for all splits
            for split in splits:
                all_document_objects.append(Document(page_content=split, metadata=metadata))
        
        print(f"Adding {len(all_document_objects)} chunks to the vector store...")
        self.db.add_documents(documents=all_document_objects)    

        shutil.rmtree(repo_dir)
        print("Repo Cloned and Loaded!")
        

if __name__ == "__main__":
    vector_store = VectorStore()
    github_repo_url = "https://github.com/hrithikkoduri/DelvInDocs.AI"  # Replace with the actual GitHub repo URL
    vector_store.load_github_repo(github_repo_url)
    