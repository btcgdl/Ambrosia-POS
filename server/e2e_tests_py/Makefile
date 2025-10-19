# Makefile for Ambrosia POS Server Tests

.PHONY: help test lint format clean

# Default target
help:
	@echo "Ambrosia POS Server Test Commands:"
	@echo ""
	@echo "  test           - Run all tests"
	@echo "  lint           - Run ruff linter"
	@echo "  format         - Format code with ruff"
	@echo "  clean          - Clean up test artifacts"
	@echo ""

# Run all tests
test:
	@echo "Running all tests..."
	pytest

# Run ruff linter
lint:
	@echo "Linting code with ruff..."
	ruff check .

# Format code with ruff
format:
	@echo "Formatting code with ruff..."
	ruff format .

# Clean up test artifacts
clean:
	@echo "Cleaning up test artifacts..."
	rm -rf .pytest_cache/
	rm -rf dist/
	rm -rf build/
	rm -rf *.egg-info/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	@echo "Cleanup completed"
