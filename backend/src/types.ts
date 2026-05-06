
export class RegisterPlayerMessage {
    name: string

    constructor(name: string) {
        this.name = name
    }
}

export type GamePhase = "REGISTRATION" | "PREPARATION" | "ONGOING" | "FINISHED";

export interface Player {
    id: string;
    name: string;
    socketId: string;
    score: number;
    rank?: number;
    lastAnswerIndex?: number;
    isCorrect?: boolean;
}

export interface GameSettings {
    timerDuration: number;
    questionCount: number;
    category?: string;
    difficulty?: string;
}

export interface QuestionData {
    id: number;
    statement: string;
    options: string[];
    genre?: string;
    difficulty?: number;
    correctAnswer?: string; // Hidden from client normally
}

export interface GameState {
    phase: GamePhase;
    players: Player[];
    settings: GameSettings;
    currentQuestion?: Omit<QuestionData, 'correctAnswer'>;
    currentQuestionIndex: number;
}

export interface ResultData {
    correctAnswerIndex: number;
    correctAnswerText: string;
    playerResults: {
        playerName: string;
        isCorrect: boolean;
        score: number;
    }[];
}
