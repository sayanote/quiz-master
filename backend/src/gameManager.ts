import { Server } from "socket.io";
import { GameState, GameSettings, Player, QuestionData, ResultData, GamePhase } from "./types.js";

class GameManager {
    private io: Server;
    private state: GameState;
    private quizzes: QuestionData[] = [];
    private managerHost: string;
    private managerPort: string;
    private managerUrl: string;
    private currentCorrectIndex: number = -1;

    constructor(io: Server) {
        this.io = io;
        // Quiz Manager Host Configuration
        this.managerHost = process.env.QUIZ_MANAGER_HOST || "localhost"
        this.managerPort = process.env.QUIZ_MANAGER_PORT || "8000"
        this.managerUrl = `http://${this.managerHost}:${this.managerPort}`
        this.state = {
            phase: "REGISTRATION",
            players: [],
            settings: {
                timerDuration: 10,
                questionCount: 5        // how many questions will be played on a round.
            },
            // Which question is currently being asked (index of self.quizzes)
            currentQuestionIndex: -1,
            currentQuestion: undefined
        };
    }

    public getGameState(): GameState {
        return this.state;
    }

    public addPlayer(socketId: string, name: string): void {
        const newPlayer: Player = {
            id: socketId, // Simple for prototype
            name: name,
            socketId: socketId,
            score: 0
        };
        this.state.players.push(newPlayer);
        this.broadcastState();
    }

    public removePlayer(socketId: string): void {
        this.state.players = this.state.players.filter(p => p.socketId !== socketId);
        this.broadcastState();
    }

    public updateSettings(settings: GameSettings): void {
        this.state.settings = { ...this.state.settings, ...settings };
        this.broadcastState();
    }

    /**
     * Load quiz data which will be used in single round.
     * The fetched quizzes are set to this.quizzes
     * 
     * @returns {Promise<void>}
     */
    private async loadQuiz(): Promise<void> {

        const url = `${this.managerUrl}/quizzes/random/?n=${this.state.settings.questionCount}`;
        console.log(`Fetching quizzes from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch quizzes: ${response.statusText}`);

        // Parse quiz data
        const data = await response.json();
        // Expecting data to be an array of QuestionData or a wrapper
        this.quizzes = data.map((quiz: any) => {
            return {
                id: quiz.id,
                statement: quiz.text, // Use statement field as per types.ts
                options: [
                    quiz.correct_answer,
                    quiz.wrong_option_1,
                    quiz.wrong_option_2,
                    quiz.wrong_option_3
                ],
                correctAnswer: quiz.correct_answer
            };
        });

    }

    public async startGame(): Promise<void> {
        if (this.state.phase !== "REGISTRATION") return;

        try {
            // Fetch random quizzes from Quiz Manager
            await this.loadQuiz()

            this.state.currentQuestionIndex = 0;
            this.state.phase = "PREPARATION";
            this.broadcastState();

            // Auto-start first question after short delay
            setTimeout(() => this.startNextQuestion(), 3000);

        } catch (error) {
            console.error("Error starting game:", error);
            // In a real app, send error to clients
        }
    }

    private startNextQuestion(): void {
        if (this.state.currentQuestionIndex >= this.quizzes.length) {
            this.finishGame();
            return;
        }

        const quiz = this.quizzes[this.state.currentQuestionIndex];
        this.state.phase = "ONGOING";

        // Prepare question for clients (hide correct answer and shuffle options)
        const correctAnswerText = quiz.correctAnswer || quiz.options[0];
        const { correctAnswer, ...clientQuestion } = quiz;
        const { shuffled, correctAnswerIndex } = this.shuffleArray([...quiz.options]);
        this.currentCorrectIndex = correctAnswerIndex;
        clientQuestion.options = shuffled;

        console.log("shuffled options : ", clientQuestion)
        console.log("correct answer: ", clientQuestion.options[this.currentCorrectIndex])

        this.state.currentQuestion = clientQuestion;

        // Reset player answer status
        this.state.players.forEach(p => {
            p.lastAnswerIndex = undefined;
            p.isCorrect = undefined;
        });

        this.broadcastState();
        this.io.emit('new_question', clientQuestion);

        // Timer logic could go here
    }

    private shuffleArray<T>(array: T[]): { shuffled: T[], correctAnswerIndex: number } {
        const shuffled = [...array];
        let correctAnswerIndex = 0;
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            if (i == correctAnswerIndex) {
                correctAnswerIndex = j;
            } else if (j == correctAnswerIndex) {
                correctAnswerIndex = i;
            }
        }
        return { shuffled, correctAnswerIndex };
    }

    public submitAnswer(socketId: string, choiceIndex: number): void {
        if (this.state.phase !== "ONGOING") return;

        const player = this.state.players.find(p => p.socketId === socketId);
        if (player && player.lastAnswerIndex === undefined) {
            player.lastAnswerIndex = choiceIndex;

            // Check if all players answered
            if (this.state.players.every(p => p.lastAnswerIndex !== undefined)) {
                this.evaluateAnswers();
            }
        }
    }

    private evaluateAnswers(): void {
        const quiz = this.quizzes[this.state.currentQuestionIndex];
        const correctAnswerText = quiz.correctAnswer || quiz.options[0];

        const results: ResultData = {
            correctAnswerIndex: this.currentCorrectIndex,
            correctAnswerText: correctAnswerText,
            playerResults: []
        };

        this.state.players.forEach(player => {
            player.isCorrect = player.lastAnswerIndex === this.currentCorrectIndex;
            if (player.isCorrect) {
                player.score += 100; // Fixed score for prototype
            }
            results.playerResults.push({
                playerName: player.name,
                isCorrect: !!player.isCorrect,
                score: player.score
            });
        });

        this.io.emit('answer_result', results);

        // Wait a bit then move to next or finish
        setTimeout(() => {
            this.state.currentQuestionIndex++;
            this.startNextQuestion();
        }, 5000);
    }

    private finishGame(): void {
        this.state.phase = "FINISHED";
        this.state.currentQuestion = undefined;

        // Sort players by score
        this.state.players.sort((a, b) => b.score - a.score);
        this.state.players.forEach((p, i) => p.rank = i + 1);

        this.broadcastState();
        this.io.emit('final_results', { players: this.state.players });
    }

    private broadcastState(): void {
        this.io.emit('game_state_update', this.state);
    }
}

export default GameManager;
