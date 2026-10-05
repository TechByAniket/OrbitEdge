from supabase import create_client, Client
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    """
    Returns an initialized Supabase client using the URL and Key from settings.
    """
    try:
        supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return supabase
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        raise
