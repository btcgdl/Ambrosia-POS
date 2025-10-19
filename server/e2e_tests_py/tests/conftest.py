"""Pytest configuration and shared fixtures.

This module provides pytest configuration and shared fixtures that are
available to all test modules in the tests directory.
"""

import logging
import os
import sys
from pathlib import Path

from ambrosia_tests.test_server import (  # noqa: F401
    manage_server_lifecycle,
    server_url,
    test_server,
)

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Configure logging for tests
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Set up test environment variables
os.environ.setdefault("TESTING", "true")
os.environ.setdefault("LOG_LEVEL", "INFO")
