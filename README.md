# Figmenta AI — Admin-Controlled Discord Intelligence Platform

Figmenta AI is a production-ready system for operating a configurable AI agent inside Discord through a secure, web-based Admin Dashboard.  
It enables teams to centrally manage an AI agent’s behavior, knowledge, memory, and permissions while deploying it safely in real Discord conversations.

This repository contains the complete end-to-end codebase, including the Admin Web Console, Discord Bot, and an optional Retrieval-Augmented Generation (RAG) pipeline.

---

## Project Purpose

Most AI bots fail due to lack of control and governance.  
This project is designed to solve that by clearly separating:

- Control (Admin Dashboard) — where the AI is configured  
- Execution (Discord Bot) — where the AI operates  
- Knowledge (Optional RAG) — what the AI is allowed to know  
- Memory — what the AI remembers and when it should forget  

This architecture allows non-developers to safely manage AI behavior without redeploying code.

---

## Core Features

### Admin Dashboard
- Define and update AI system instructions in real time
- Upload PDF documents for knowledge grounding (RAG)
- View and reset conversation memory
- Control exactly which Discord channels the bot can access

### Discord Bot
- Responds only in allow-listed channels or when mentioned
- Uses live admin instructions as its behavioral source of truth
- Maintains rolling conversation context
- Optionally augments responses using document retrieval

### Knowledge Base (Optional RAG)
- PDF ingestion and chunking
- Vector-based semantic search using pgvector
- Context injection during response generation

---

## System Architecture

```mermaid
graph TD
    A[Admin Dashboard] -->|API| B[Supabase Backend]
    C[Discord Bot] -->|Read/Write| B
    D[PDF Knowledge Base] --> E[Vector Storage]
    E -->|Relevant Context| C
    C --> F[Discord Channels]
