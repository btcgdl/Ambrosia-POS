# Ambrosia-POS

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/btcgdl/Ambrosia-POS)

**Status: In Development**

> [!WARNING]
> Security Warning: The system uses Bitcoin locally. The default username and password are:
>
> - User: `cooluser1`
> - Pin: `0000`
> - Wallet: `password123`
>
> Do not leave these default credentials in production! Change the username and password immediately after installation to protect your funds.

<p align="center">
  <img src="imgs/Ambrosia.png" alt="Ambrosia Logo" width="300"/>
</p>

This repository contains the documentation and project details for a restaurant point of sale (POS) system, with a frontend developed in React and Electron, and a backend in Kotlin. The main files and their contents are described below:

## Main Files

- [PROPOSAL.md](PROPOSAL.md): Contains a general description of the system, including the main modules and their functionalities. It is ideal for understanding the scope and purpose of the project.
- [OBJECTIVES_TABLE.md](OBJECTIVES_TABLE.md): Presents a detailed table with the system's modules and their objectives.

## General Description

The system is designed to optimize the daily operations of a restaurant, such as managing orders, tables, and finances, with a modern and reactive interface. It includes features like authentication, user management, menu handling, orders, point of sale, and more.

Consult the mentioned files for more details about the project.

## Installation

To install Ambrosia POS, refer to the [Installation Guide](INSTALLATION.md) where you will find all available options and detailed instructions for setting up the system.

## Testing

The project includes end-to-end (E2E) tests for the server API. For detailed information on running the tests, see the [E2E Tests README](server/e2e_tests_py/README.md).

### Quick Start

```bash
cd server/e2e_tests_py
uv venv && source .venv/bin/activate
uv pip install -e .
pytest
```

---

## Want to contribute?

Check out the [Contribution Guide](Contributing.md) to learn how you can help and be part of the future of POS systems for restaurants.
