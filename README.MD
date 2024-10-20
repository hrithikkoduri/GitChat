# GitChat: Your Interactive GitHub Companion

**GitChat** is an AI-powered tool designed to enhance how developers interact with GitHub repositories. Utilizing FastAPI, OpenAI's GPT, and Deeplake Vector, GitChat allows users to clone repositories and load files for efficient querying.

Users can ask specific questions about repository content—like "What are the key features?" or "How XYZ module works?"—and receive contextual answers along with relevant code snippets. Its intelligent document-splitting feature ensures precise searches, while a dynamic interface supports dark mode and maintains chat history for seamless context. GitChat streamlines the process of extracting insights from repositories, saving valuable development time and fostering collaboration in the coding community.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)


## Features

GitChat operates by integrating several key functionalities to allow users to interact with GitHub repositories effectively:

1. **Cloning Repositories**: When a user provides a link to a GitHub repository, GitChat clones that repository to a local environment. This allows the application to access all the files within the repository.

2. **Loading Files**: After cloning, the application loads the files into a vector store. This vector store enables efficient querying and retrieval of information from the repository's content.

3. **Document Splitting**: To improve the retrieval process, the application splits documents into smaller chunks. This helps in managing large files and allows for more precise searches.

4. **Search Functionality**: Users can input questions or queries, and the system generates search queries based on the user's input and previous conversation history. This feature enhances the relevance of the information retrieved.

5. **Chat History Management**: GitChat maintains a history of the conversation, which helps in providing context for user queries. The chat history is used to refine search results and improve the overall user experience.

6. **Dynamic User Interface**: The application features a user-friendly interface that supports dark mode and displays loading states, success messages, and options for managing repositories.

7. **Error Handling**: The system includes error handling mechanisms to address any issues that may arise during the loading of files or querying processes.

By combining these functionalities, GitChat provides an interactive and efficient way for users to explore and extract information from GitHub repositories.

## Usage

Once both the backend and frontend are running, you can interact with GitChat through the web interface. Here's how to utilize the application's features:

1. **Add Repository**: Enter the URL of the GitHub repository you want to clone. Click the "Submit" button to clone it to your local environment.

2. **Ask Questions**: Use the chat interface to ask questions about the repository's content, such as "What are the main files?" or "Can you explain the setup process?".

3. **Get Code Implementations and Explanations**: Request specific code implementations or explanations by typing your queries in the chat, like "Show me the implementation of function X" or "Explain how this module works." GitChat will retrieve relevant information based on the repository's content.

4. **Delete and Add New Repository**: To delete a repository, click the "Delete" button. You can then add a new repository by providing its URL and clicking "Submit".

5. **Toggle Between Dark and Light Mode**: Use the toggle button in the interface to switch between dark mode and light mode according to your preference.

6. **Chat History:** GitChat maintains a history of your conversation, allowing you to revisit previous queries and responses. You can scroll through the chat history for context or clarity.

## Technologies Used

- **Backend**: FastAPI, Langchain, OpenAI for LLM and embeddings, DeepLake for vector store
- **Frontend**: Next.js, Tailwind CSS

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/hrithikkoduri/GitChat.git
    ```

2. Setup Activeloop:

    Activeloop provides vector databse to storage embeddings from the data gathered. This will be retrieved by the underlying LLM (in this case GPT-4o) to retrieve relevant information for user queries.

    >Create your ActiveLoop account by going tothis link : https://app.activeloop.ai/

    Create an **ActiveLoop Token** and paste it securely in a file, this will be useful to connect your app with the databse.

    Further you need to create an **organization** (a project like structure where all you dataset will be store) on activeloop and copy the name of the organization you created

3. Create OpenAI Key:

    >Go to this link https://openai.com/index/openai-api/

    To access the Embeddings and GPT model in the app, you'll need to add some OpenAI credits. For personal use, it doesn't require much—you can start with as little as $5-$10, which should be enough to last 2-3 months depending on your usage.

    Sign up and create your **OpenAI API Key**. Copy the api key and store it securely.

4. Setup environment variables and Deeplake :
    
    Open the .env file replace the respective place holders with your API keys
        
    .env
    ```bash
    ACTIVELOOP_TOKEN="<YOUR_ACTIVELOOP_TOKEN>"
    OPENAI_API_KEY="<YOUR_OPENAI_API_KEY>"
    ```

    Open vectordb.py script and replace the organization name placeholder with the one you created and the dataset name placeholder with the name of the deeplake dataset you want to create.
        
    **Note:** You only need to create the organization on ActiveLoop, the dataset will be created at the runtime with the name you provided on it own.

    vectordb.py
    ```bash
    self.activeloop_org = "<YOUR_ACTIVELOOP_ORGANISATION_NAME>" # replace with your ActiveLoop organisation name
    self.activeloop_dataset = "<DATASET_NAME>" # replace with your ActiveLoop dataset name you want to be created
    ```


### Backend (FastAPI)

1. Navigate to the `fastapi-backend` directory:
   ```bash
   cd fastapi-backend
   ```

2. Create a virtual environment (if needed):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    .\venv\Scripts\activate   # On Windows
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the FastAPI server:
    ```bash
    uvicorn main:app
    ```

### Frontend (Next.js)

1. Navigate to the nextjs-frontend directory:
    ```bash
    cd ..
    cd nextjs-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the Next.js application:
    ```bash
    npm run dev
    ```

## Contributing

1. Fork the repository.

2. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/YourFeatureName
    ```

3. Make your changes and commit them:
    ```bash
    git commit -m "Add some feature"
    ```

4. Push your changes to your fork:
    ```bash
    git push origin feature/YourFeatureName
    ```

5. Create a pull request to the main repository.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments
- [Langchain](https://www.langchain.com/) for the framework to manage the AI pipeline.
- [OpenAI](https://openai.com/) GPT for providing the language model.
- [Activeloop Deep Lake](https://activeloop.ai/) for the vector database used in the project.
- [Next.js](https://nextjs.org) for the robust framework for used for building this application.
- Special thanks to all contributors and users for their support and feedback.