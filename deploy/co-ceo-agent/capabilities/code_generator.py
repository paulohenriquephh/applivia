"""Code generation using Claude Sonnet 4.5 or DeepSeek."""

from typing import Any


class CodeGenerator:
    """Generates code in any language using premium coding models."""

    def __init__(self, router: Any):
        self.router = router

    async def generate(self, description: str, language: str = "python",
                       framework: str = "") -> dict:
        """Generate code from a natural language description."""
        framework_ctx = f" using the {framework} framework" if framework else ""

        prompt = (
            f"Write production-ready {language} code{framework_ctx}.\n\n"
            f"Requirements:\n{description}\n\n"
            f"Rules:\n"
            f"- Complete, runnable code (no stubs)\n"
            f"- Include error handling\n"
            f"- Include type hints (if applicable)\n"
            f"- Follow best practices for {language}\n"
            f"- Include brief inline comments for complex logic\n\n"
            f"Output as JSON:\n"
            f"{{\n"
            f'  "filename": "suggested_filename.ext",\n'
            f'  "code": "...the complete code...",\n'
            f'  "dependencies": ["list", "of", "packages"],\n'
            f'  "usage": "how to run or use this code",\n'
            f'  "tests": "example test code"\n'
            f"}}"
        )

        result = await self.router.call(
            prompt,
            task_type="code_generation",
            system_prompt=f"You are an expert {language} developer. Write clean, efficient, production-ready code.",
        )

        return {
            "description": description,
            "language": language,
            "framework": framework,
            "code": result["text"],
            "model": result["model"],
            "cost": result.get("cost", 0),
        }
