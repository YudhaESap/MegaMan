# MegaMan: Your Offline Personal AGI Companion

Inspired by **MegaMan Battle Network** and anime-style assistants like **Grok-4/Bella**, **MegaMan** is a stylized **offline personal AGI** designed to deeply understand and grow with its user. Think of it as your Navi — not just a chatbot, but a truly personal cognitive partner.

![screenshot](./assets/megaman_ui.png)

---

## What is MegaMan?

MegaMan is:
- An **offline-first AGI** that runs on your local machine
- A **real-time thinking companion** with memory, planning, and reflection
- A UI-powered **anime-style assistant**, adapted from Grok 4 / Jackywine’s Bella

It’s not just an LLM interface. MegaMan learns from you, remembers your preferences, and supports both voice and text communication.

---

## Features (In Progress)

| Feature            | Status    | Description |
|--------------------|-----------|-------------|
| Local LLM (Ollama) | planned | Fully offline with models like `phi`, `mistral`, or `gemma` |
| Persona Memory     | pending | YAML + JSONL-based personal traits and episodic memory |
| Voice Interface    | planned | Whisper.cpp + Piper/Coqui for speech input/output |
| Planning System    | pending | Track goals, habits, and actions with long-term reasoning |
| UI with Avatar     | present | Megaman/Bella-inspired interface for interaction |
| Daily Journaling   | planned | Reflects on conversations and writes thoughts to memory |

---

## Tech Stack

- Python 3.11+
- Local LLM via Ollama
- Whisper.cpp (STT)
- Piper / Coqui TTS (TTS)
- Custom UI frontend with avatar
- JSONL/YAML memory system

---

## Project Structure (Planned)

MegaMan/
- core/
-- llm_runner.py
-- plan_loop.py
- memory/
-- persona.yaml
-- episodic.jsonl
- voice/
-- speech_to_text.py
-- text_to_speech.py
- ui/
-- main_window.py
-- assets/
- app.py
- README.md

---

## Why Offline?

Your data should be yours. MegaMan is being built to run fully **locally** — no cloud API, no third-party tracking, no vendor lock-in. It’s private, secure, and personal.

---

## Roadmap

- [ ] Integrate Ollama backend
- [ ] Implement memory reflection
- [ ] Add goal planning & journaling
- [ ] Voice I/O
- [ ] Emotion & tone-based response
- [ ] Sync UI with cognitive state

---

## Contributing

This project is in early prototyping. Contributions, ideas, and custom skins/themes welcome! Fork it, experiment, and help us build a better AGI companion.

---

## License

MIT. This is an open project. Please avoid direct references to Capcom IP. Fan-made inspiration only.

---

## Author

Yudhaesap (https://github.com/YudhaESap)