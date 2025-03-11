# Live Transcription System

# Overview

The Live Transcription System is a full-stack application that provides real-time speech-to-text transcription capabilities. It consists of two main components:

Live Transcription Server: A FastAPI-based backend that handles real-time audio processing and transcription using machine learning models.
Live Transcription Web: A Nuxt 3-based frontend that provides an intuitive user interface for audio capture and real-time transcription display.
# System Architecture

┌─────────────────┐         WebSocket         ┌─────────────────┐
│                 │◄────── Audio Stream ──────┤                 │
│  Transcription  │                          │  Transcription   │
│     Server      │────── Transcribed ───────►│      Web        │
│    (FastAPI)    │         Text             │    (Nuxt 3)     │
│                 │                          │                 │
└─────────────────┘                          └─────────────────┘
The system uses WebSocket connections for bidirectional real-time communication:

Frontend captures and streams audio to the backend
Backend processes audio and returns transcribed text in real-time
Frontend displays the transcription results instantly