"""HTTP response utilities and assertions for API testing.

This module provides utility functions for asserting HTTP response properties
such as status codes and response body content.
"""

import httpx
import pytest


def assert_status_code(
    response: httpx.Response, expected: int, message: str = ""
) -> None:
    """Assert that the response has the expected status code.

    Args:
        response: HTTP response object
        expected: Expected status code
        message: Optional custom error message
    """
    if response.status_code != expected:
        error_msg = f"Expected status {expected}, got {response.status_code}"
        if message:
            error_msg += f": {message}"
        error_msg += f"\nResponse body: {response.text}"
        pytest.fail(error_msg)


def assert_response_contains(
    response: httpx.Response, text: str, message: str = ""
) -> None:
    """Assert that the response body contains specific text.

    Args:
        response: HTTP response object
        text: Text to search for in response body
        message: Optional custom error message
    """
    if text not in response.text:
        error_msg = f"Expected response to contain '{text}', but it didn't"
        if message:
            error_msg += f": {message}"
        error_msg += f"\nResponse body: {response.text}"
        pytest.fail(error_msg)
