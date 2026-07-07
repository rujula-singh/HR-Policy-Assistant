
import os
from langchain_community.document_loaders import PyPDFLoader, PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path

PDF_DIRECTORY = "data/pdf"
### Read all the pdfs files inside the directory
def process_all_pdfs(pdf_directory):
  all_documents = []
  pdf_dir = Path(pdf_directory)

  pdf_files = list(pdf_dir.glob("**/*.pdf"))

  print(f"Found {len(pdf_files)} PDF files to be process")

  for pdf_file in pdf_files:
    print(f"Processing: {pdf_file.name}")
    try:
      loader = PyPDFLoader(str(pdf_file))
      documents = loader.load()

      for doc in documents:
        doc.metadata['source_file'] = pdf_file.name
        doc.metadata['file_type'] ='pdf'

      all_documents.extend(documents)
      print(f" ✔️ Loaded {len(documents)} pages")

    except Exception as e:
      print(f" ❌ Error: {e}")


  print(f"\nTotal documents loaded: {len(all_documents)}")
  return all_documents


### Text Splitting

def split_documents(documents,chunk_size=1000,chunk_overlap=200):
  """Split documents into smaller chunks for better RAG performance"""
  text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size,
    chunk_overlap=chunk_overlap,
    length_function=len,
    separators=["\n\n","\n"," ",""]
  )
  #first try splitting by paras,then by lines,then by words,then finally by characters.

  split_docs = text_splitter.split_documents(documents)
  print(f"Split {len(documents)} documents into {len(split_docs)} chunks")

  #eg of a chunk
  if split_docs:
    print(f"\nExample chunk:")
    print(f"Content: {split_docs[0].page_content[:200]}...")
    print(f"Metadata: {split_docs[0].metadata}")

  return split_docs  


#embedding and vector store

import numpy as np
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import uuid
from typing import List, Dict, Any, Tuple
from sklearn.metrics.pairwise import cosine_similarity

class EmbeddingManager:
  """Handles document embedding generation using SentenceTransformer"""

  def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
    """
    Initialize the embedding manager

    Args:
    model_name: HuggingFace model name for sentence embeddings
    """
    self.model_name = model_name
    self.model = None
    self._load_model()

  def _load_model(self): 
    """Load the SentenceTransformer model"""
    try: 
      print(f"Loading embedding model: {self.model_name}")
      self.model = SentenceTransformer(self.model_name)
      print(f"Model loaded successfully. Embedding dimension: {self.model.get_sentence_embedding_dimension()}")
    except Exception as e:
      print(f"Error loading model {self.model_name}: {e}")
      raise

  def generate_embeddings(self, texts: List[str]) -> np.ndarray:
    """
    Generate embeddings for a list of texts

    Args:
      texts: List of text strings to embed

    Returns:
      numpy array of embeddings with shape (len(texts), embedding_dim)
      """
    if not self.model:
      raise ValueError("Model not loaded")
      
    print(f"Generating embeddings for {len(texts)} texts...")
    embeddings = self.model.encode(texts, show_progress_bar=True)
    print(f"Generated embeddings with shape: {embeddings.shape}")
    return embeddings
  
  def get_embedding_dimension(self) -> int:
    """Get the embedding dimension of the model"""
    if not self.model: 
      raise ValueError("Model not loaded")
    return self.model.get_embedding_dimension()
  
 ## initialize the embeddings
   
embedding_manager = EmbeddingManager()  


#vector store
import os

class VectorStore:
  """ Manages document embeddings in a ChromaDB vector store"""

  def __init__(self,collection_name: str = "pdf_documents",persist_directory: str = "./data/vector_store"):
    """
    Initialize the vector store

    Args:
      collection_name: Name of the ChromaDB collection
      persist_directory: Directory to persist the vector store
    """

    self.collection_name = collection_name
    self.persist_directory = persist_directory
    self.client = None
    self.collection = None
    self._initialize_store()

  def _initialize_store(self):
    """Initialize ChromaDB client and collection"""
    try:
      #Create persistent ChromaDB client
      os.makedirs(self.persist_directory,exist_ok=True)
      self.client = chromadb.PersistentClient(path=self.persist_directory)

      #Get or create collection
      self.collection = self.client.get_or_create_collection(
        name=self.collection_name,
        metadata={"description":"PDF document embeddings for RAG"}
      )
      print(f"Vector store initialized. Collection: {self.collection_name}")
      print(f"Existing documents in collection: {self.collection.count()}")

    except Exception as e:
      print(f"Error initializing vector store: {e}")
      raise  

  def add_document(self,documents: List[Any], embeddings: np.ndarray):
    """
    Add documents and their embeddings to the vector store

    Args:
       documents: List of Langchain documents
       embeddings: Corresponding embeddings for the documents
    """
    if(len(documents) != len(embeddings)):
      raise ValueError("Number of documents must match number of embeddings")

    print(f"Adding {len(documents)} documents to vector store...")

    #Prepare data for ChromaDB
    ids = []
    metadatas = []
    documents_text = []
    embeddings_list = []

    for i, (doc,embedding) in enumerate(zip(documents,embeddings)): #enumerate adds an index to each pair
      #Generate unique ID
      doc_id = f"doc_{uuid.uuid4().hex[:8]}_{i}"
      ids.append(doc_id)   

      #Prepare metadata
      metadata = dict(doc.metadata)
      metadata['doc_index'] = i
      metadata['content_length'] = len(doc.page_content)
      metadatas.append(metadata)

      #Document content
      documents_text.append(doc.page_content)

      #Embedding
      embeddings_list.append(embedding.tolist())

    #Add to collection
    try:
      self.collection.add(
        ids=ids,
        embeddings=embeddings_list,
        metadatas=metadatas,
        documents=documents_text
      )
      print(f"Successfully added {len(documents)} documents to vector store")
      print(f"Total documents in collection: {self.collection.count()}")

    except Exception as e:
      print(f"Error adding documents to vector store: {e}")
      raise 

  def document_count(self):
    return self.collection.count() 

  def delete_collection(self):
    """Delete the current collection and recreate it."""
    self.client.delete_collection(self.collection_name)

    self.collection = self.client.get_or_create_collection(
        name=self.collection_name,
        metadata={"description": "PDF document embeddings for RAG"}
    )

    print("Collection deleted and recreated.")  

vectorstore = VectorStore()    


#RAG retriever pipeline from vectorstore

class RAGRetriever:
  """ Handles query-based retrieval from the vector store"""

  def __init__(self,vector_store: VectorStore, embedding_manager: EmbeddingManager):
    """
    Initialize the retriever

    Args:
        vector_store: Vector store containing document embeddings
        embedding_manager: Manager for generating query embeddings
    """

    self.vector_store = vector_store
    self.embedding_manager = embedding_manager  

  def retrieve(self, query: str, top_k: int = 5, score_threshold: float = 0.0) -> List[Dict[str,Any]]:
    """
    Retrieve relevant documents for a query

    Args:
        query: the search query
        top_k: Number of results to return
        score_threshold: Minimum similarity score threshold

    Returns:
          List of dictionaries containing retrieved documents and metadata
    """

    print(f"Retrieving documents for query: '{query}'")
    print(f"Top K: {top_k}, Score threshold: {score_threshold}")

    #Generate query embedding
    query_embedding = self.embedding_manager.generate_embeddings([query])[0]

    #Search in vector store    
    try:
      results = self.vector_store.collection.query(
        query_embeddings = [query_embedding.tolist()],
        n_results = top_k
      )  

      #Process results
      retrieved_docs = []

      if results['documents'] and results['documents'][0]:
        documents = results['documents'][0]
        metadatas = results['metadatas'][0]
        distances = results['distances'][0]
        ids = results['ids'][0]

        for i, (doc_id, document, metadata, distance) in enumerate(zip(ids,documents,metadatas,distances)):
          # Convert distance to similarity score (ChromaDB uses cosine distance)
            similarity_score = 1 - distance

            if similarity_score >= score_threshold:
              retrieved_docs.append({
                'id':doc_id,
                'content':document,
                'metadata':metadata,
                'similarity_score':similarity_score,
                'distance':distance,
                'rank':i+1
                }) 
          
        print(f"Retrieved {len(retrieved_docs)} documents (after filtering)")

      else:
        print("No documents found")

      return retrieved_docs   
   
    except Exception as e:
      print(f"Error during retrieval: {e}")
      return []
    

def initialize_rag():
  if(vectorstore.document_count() == 0):
    print("Vector databse is empty. Building index...")
    all_pdf_documents = process_all_pdfs(PDF_DIRECTORY)
    chunks = split_documents(all_pdf_documents)

    texts = [doc.page_content for doc in chunks]
    embeddings = embedding_manager.generate_embeddings(texts)

    vectorstore.add_document(chunks,embeddings)
  
  print("Using existing vector database.")
  rag_retriever = RAGRetriever(vectorstore,embedding_manager)

  return rag_retriever

#create the retriever object
retriever = initialize_rag()
          
#Integration of vectorDB context pipeline with LLM output

### Simple RAG pipeline with Groq LLM
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
load_dotenv()

### Intialize the Groq LLM 
groq_api_key = os.getenv("GROQ_API_KEY")

llm =  ChatGroq(groq_api_key=groq_api_key,model_name="openai/gpt-oss-20b",temperature=0.1,max_tokens=1024)

## Simple RAG function : retrieve context + generate response
def rag_simple(query,retriever,llm,top_k=3):
  ##retrieve the context
  results = retriever.retrieve(query,top_k=top_k)
  context="\n\n".join([doc['content'] for doc in results]) if results else""

  # print("Context length:", len(context))

  if not context:
    print("Returning because no context was found.")
    return "No relevant context found to answer the question."
  
  ## generate the answer using GROQ LLM
  prompt=f"""
   You are a helpful assistant.

  Answer the question **only** using the provided context.
  If the context does not contain enough information, reply:
  "I don't have enough information in the provided context."

      Context:
      {context}
     
      Question: {query}

      Answer:"""
  
  response=llm.invoke(prompt)

  #print("LLM response type:", type(response))
  return response.content   
 

def generate_answer(query):
  answer = rag_simple(query,retriever,llm)
  return answer
   


 
   
     