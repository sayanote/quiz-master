# Backend Architecture: Sequence & Message Definitions

This document details the interaction between the player clients, the spectator screen, the game backend service, and the quiz manager service.

## 1. System Sequence Diagram

```mermaid
sequenceDiagram
    actor P as Player (Handheld)
    actor Spec as Spectator (Big Screen)
    participant F as Frontend App (UI)
    participant B as Backend Server (Game Service + WS)
    participant Q as Quiz Manager Service

    %% 1. Initial Access & UI Distribution
    rect rgb(240, 240, 255)
        Note over P, B: 1. Initialization & UI Distribution
        Spec->>B: HTTP GET / (Initial Access as Spectator)
        P->>B: HTTP GET / (Initial Access as Player)
        B-->>Spec: Distribute Frontend App (Spectator View)
        B-->>P: Distribute Frontend App (Player View)
        F->>B: Establish WebSocket Connection
        B-->>F: Acknowledge & Send Initial State (REGISTRATION)
        Spec->>F: Display "Waiting for Players" / Join Code
        P->>F: Display Registration Screen
    end

    %% 2. Registration Phase
    rect rgb(255, 240, 240)
        Note over P, B: 2. Player Registration
        P->>F: Enter Name & Join
        F->>B: Emit 'register_player'
        B->>B: Register Player
        B-->>F: Broadcast State Update
        Spec->>F: Update Player List on Big Screen
        P->>F: Display Waiting Screen
    end

    %% 3. Configuration & Quiz Fetching
    rect rgb(240, 255, 240)
        Note over P, Q: 3. Game Configuration & Quiz Loading
        Note over B: Host initiates game configuration
        B->>Q: HTTP GET /api/quizzes/ (Fetch Quiz Data)
        Q-->>B: Return Quiz Data
        B-->>F: Broadcast State Update (PREPARATION)
        Spec->>F: Display Game Rules / Ready Screen
        P->>F: Display Configuration / Ready Screen
    end

    %% 4. Answering Phase (Repeated for each question)
    rect rgb(255, 255, 240)
        Note over P, Q: 4. Game Ongoing & Answering
        B-->>F: Broadcast Quiz Question
        Spec->>F: Display Question Text & Options
        P->>F: Display Answer Buttons (A, B, C, D)
        
        P->>F: Select/Submit Answer
        F->>B: Emit 'submit_answer'
        
        Note over B: Wait for all players or timeout
        B->>B: Judge Answers & Calculate Scores
        B-->>F: Broadcast Results/Scores
        Spec->>F: Display Correct Answer & Round Leaderboard
        P->>F: Display "Correct/Incorrect" feedback
    end

    %% 5. Final Result Phase
    rect rgb(240, 240, 240)
        Note over P, Spec: 5. Game Conclusion & Final Results
        B->>B: Calculate Final Rankings
        B-->>F: Broadcast State Update (FINISHED)
        Spec->>F: Display Final Podium (All Players Ranking)
        P->>F: Display Individual Rank (e.g., "You placed 3rd!")
    end

    %% 6. Quiz Data Update
    rect rgb(255, 240, 255)
        Note over B, Q: 6. Updating Quiz Statistics
        Note over B: End of game
        B->>Q: HTTP POST/PUT /api/quizzes/stats (Update usage, correct rate)
        Q-->>B: Acknowledge Update
    end
```

## 2. Message Definitions (Socket.io)

### Client -> Server (Events)

| Event Name | Payload Type | Description |
| :--- | :--- | :--- |
| `register_player` | `{ name: string }` | Requests to join the game during REGISTRATION phase. |
| `start_game` | `void` | (Admin) Moves the game from REGISTRATION to PREPARATION/ONGOING. |
| `submit_answer` | `{ choiceId: string }` | Player submits their answer choice. |
| `finish_game` | `void` | (Admin) Moves the game to FINISHED phase. |
| `reset_game` | `void` | (Admin) Moves the game back to REGISTRATION. |

### Server -> Client (Events)

| Event Name | Payload Type | Description |
| :--- | :--- | :--- |
| `game_state_update` | `GameState` | Broadcasted whenever any state changes (Phase, Players, etc.). |
| `registration_success` | `{ message: string }` | Confirmation for the registering player. |
| `registration_error` | `{ message: string }` | Error details if registration fails. |
| `new_question` | `QuestionData` | Sent when a new quiz question starts (includes text for Spectator, options for Player). |
| `answer_result` | `ResultData` | Sent after a question ends, showing the correct answer and round leaderboard. |
| `final_results` | `FinalRankingData` | Sent when the game ends, containing the full leaderboard. |

### Data Structures

#### `GameState`
```typescript
{
  phase: "REGISTRATION" | "PREPARATION" | "ONGOING" | "FINISHED";
  players: Player[];
  currentQuestion?: QuestionData;
}
```

#### `Player`
```typescript
{
  id: string;
  name: string;
  socketId: string;
  score: number;
  rank?: number; // Calculated at the end of the game
}
```

#### `FinalRankingData`
```typescript
{
  rankings: {
    playerId: string;
    name: string;
    score: number;
    rank: number;
  }[];
}
```
