import uuid
import pandas as pd

# In-memory store: { session_id: DataFrame }
_sessions: dict[str, pd.DataFrame] = {}


def create_session(df: pd.DataFrame) -> str:
    """Store a DataFrame and return a new session ID."""
    session_id = str(uuid.uuid4())
    _sessions[session_id] = df
    return session_id


def get_session(session_id: str) -> pd.DataFrame | None:
    """Retrieve the DataFrame for a session, or None if not found."""
    return _sessions.get(session_id)


def session_exists(session_id: str) -> bool:
    return session_id in _sessions