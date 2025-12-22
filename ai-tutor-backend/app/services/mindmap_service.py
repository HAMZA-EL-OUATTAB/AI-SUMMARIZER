from typing import List
from app.services.groq_service import groq_service


def generate_mindmap(context: str, topic: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "You are an assistant that creates educational mind maps.\n"
                "Return ONLY Mermaid mindmap syntax.\n"
                "No explanations, no markdown, no code blocks."
            )
        },
        {
            "role": "user",
            "content": f"""
Create a clear and structured mind map about "{topic}".

Use ONLY the information below:
{context}

Rules:
- Use Mermaid mindmap syntax
- Keep it concise
- Use hierarchy
"""
        }
    ]

    return groq_service.chat_completion(
        messages=messages,
        max_tokens=600,
        temperature=0.3
    )
