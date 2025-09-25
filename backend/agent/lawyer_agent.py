# FILE: backend/agent/lawyer_agent.py

import os # <-- Add os import
from typing import TypedDict, Annotated, List, Any
import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# Import the refactored functions from the legal_rag directory
from legal_rag.query_rewriter import rewrite_query
from legal_rag.retrieval import perform_research
from legal_rag.summarizer import summarize_and_reflect_lawyer, generate_lawyer_analysis
from dotenv import load_dotenv

load_dotenv()

# --- Configuration & Validation (Consistent with other agents) ---
# It's good practice to include this check in any file that relies on these keys.
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

if not TAVILY_API_KEY or not GROQ_API_KEY:
    raise ValueError(
        "API keys for Tavily and Grok are not set. Please add them to your .env file."
    )


# --- State Management with LangGraph ---
class LawyerAgentState(TypedDict):
    """Represents the state of the lawyer agent's workflow."""

    query: str
    intermediate_steps: Annotated[List[Any], operator.add]
    web_search_results: str
    faiss_search_results: str
    final_analysis: str
    research_complete: bool
    chat_history: List[BaseMessage]
    sources: Annotated[List[dict], operator.add]
    role: str


# --- Workflow Decision Logic ---
def decide_lawyer_next_step(state: LawyerAgentState):
    """Decide whether to continue research or finalize the analysis for a lawyer."""
    if state.get("research_complete", False):
        return "final_analysis"
    else:
        return "perform_research"


# --- Build the LangGraph for Lawyers ---
lawyer_workflow = StateGraph(LawyerAgentState)

lawyer_workflow.add_node("rewrite_query", rewrite_query)
lawyer_workflow.add_node("perform_research", perform_research)
lawyer_workflow.add_node("summarize_and_reflect_lawyer", summarize_and_reflect_lawyer)
lawyer_workflow.add_node("final_analysis", generate_lawyer_analysis)

lawyer_workflow.set_entry_point("rewrite_query")
lawyer_workflow.add_edge("rewrite_query", "perform_research")
lawyer_workflow.add_edge("perform_research", "summarize_and_reflect_lawyer")
lawyer_workflow.add_conditional_edges(
    "summarize_and_reflect_lawyer",
    decide_lawyer_next_step,
    {
        "perform_research": "perform_research",
        "final_analysis": "final_analysis",
    },
)
lawyer_workflow.add_edge("final_analysis", END)

# Compile the graph
checkpointer = MemorySaver()
lawyer_app = lawyer_workflow.compile(checkpointer=checkpointer)