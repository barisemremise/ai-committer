# 🧠 AI Commit — Smart Commit Message Generator

**AI Commit** is a lightweight, AI-powered CLI tool that generates meaningful commit messages based on your Git changes.  
It analyzes your diffs, applies your defined commit conventions, and automatically commits with an AI-suggested message.

---

## 🚀 Features

- 🔍 **Understands your code changes** via `git diff`
- 🤖 **AI-powered suggestions** based on configurable commit rules
- 💬 **Interactive CLI** — choose which diff to analyze (`staged`, `all`, or custom path)
- ⚙️ **Configurable conventions** (`feat`, `fix`, `refactor`, etc.)
- 🧩 Works independently of your IDE or environment
- 🪶 Simple to integrate — just run a single command!

---

## 🛠️ Installation

Clone the repository and install dependencies using Yarn:

```bash
git clone https://github.com/barisemremise/ai-committer.git
cd ai-committer
yarn install
