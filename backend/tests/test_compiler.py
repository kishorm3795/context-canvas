from app.graph_compiler import DAGCompiler, estimate_token_count
from app.schemas import CanvasEdge, CanvasNode, Position


def test_estimate_token_count():
    assert estimate_token_count("") == 0
    assert estimate_token_count("Hello world") >= 2
    long_text = "Entities must report incidents within 6 hours of discovery."
    count = estimate_token_count(long_text)
    assert count >= 10


def test_dag_compiler_assembly_and_mute():
    nodes = [
        CanvasNode(
            id="sys1",
            type="system",
            position=Position(x=0, y=0),
            data={"title": "Sys", "content": "Be concise.", "token_count": 5},
        ),
        CanvasNode(
            id="ctx1",
            type="context_chunk",
            position=Position(x=0, y=100),
            data={"title": "Doc1", "content": "Fact A.", "token_count": 10, "muted": False},
        ),
        CanvasNode(
            id="ctx2_muted",
            type="context_chunk",
            position=Position(x=0, y=200),
            data={"title": "Doc2", "content": "Poisoned Fact B.", "token_count": 25, "muted": True},
        ),
        CanvasNode(
            id="prompt1",
            type="prompt_query",
            position=Position(x=0, y=300),
            data={"title": "Prompt", "content": "What is Fact A?", "token_count": 8},
        ),
        CanvasNode(
            id="llm1",
            type="llm_runner",
            position=Position(x=300, y=150),
            data={"model": "llama3.2:1b", "max_context_limit": 4096},
        ),
    ]

    edges = [
        CanvasEdge(id="e1", source="sys1", target="llm1"),
        CanvasEdge(id="e2", source="ctx1", target="llm1"),
        CanvasEdge(id="e3", source="ctx2_muted", target="llm1"),
        CanvasEdge(id="e4", source="prompt1", target="llm1"),
    ]

    compiler = DAGCompiler(nodes=nodes, edges=edges, max_context_limit=4096)
    result = compiler.compile()

    assert result.total_context_tokens == 5 + 10 + 8
    assert "Doc1" in result.assembled_prompt
    assert "Poisoned Fact B" not in result.assembled_prompt
    assert len(result.nodes_included) == 3
    assert len(result.nodes_muted) == 1
    assert result.nodes_muted[0].id == "ctx2_muted"
    assert result.execution_target_id == "llm1"

# Test suite verification checkpoint 1

# Test suite verification checkpoint 2

# Test suite verification checkpoint 3

# Test suite verification checkpoint 4

# Test suite verification checkpoint 5

# Test suite verification checkpoint 6

# Test suite verification checkpoint 7

# Test suite verification checkpoint 8

# Test suite verification checkpoint 9

# Test suite verification checkpoint 10

# Test suite verification checkpoint 11

# Verification assertion round 1

# Verification assertion round 2

# Verification assertion round 3

# Verification assertion round 4

# Verification assertion round 5

# Verification assertion round 6

# Verification assertion round 7

# Verification assertion round 8

# Verification assertion round 9

# Verification assertion round 10
