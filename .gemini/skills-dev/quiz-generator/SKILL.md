---
name: quiz-generator
description: Generates multiple-choice quizzes in Japanese from an information source URL provided in a text file, and outputs them as a JSONL file. Use this skill when requested to create quizzes.
---

# Quiz Generator

This skill guides Gemini CLI in generating multiple-choice quizzes from an information source URL and outputting them in Japanese in JSONL format to a temporary directory.

## Workflow

1.  **Read the Source URL**: Read the text file `references/source.txt` located within the `quiz-generator` skill directory. This file contains the information source URL.
2.  **Fetch Content**: Access the URL to read the information.
3.  **Generate Quizzes**: Based on the fetched content, generate multiple-choice questions. Ensure the questions are relevant, accurate, and directly derived from the text.
4.  **Language**: The generated quiz MUST be written entirely in Japanese.
5.  **Format as JSONL**: Format the generated quizzes as JSON Lines (JSONL), where each line is a valid JSON object.
6.  **Output to File**: Use the `write_file` tool to save the generated JSONL output to `.gemini/tmp/quizzes/<topic>.jsonl`. Create the directory if it doesn't exist using a shell command.

## JSONL Output Format

The output MUST be in JSONL format. Each line must be a single JSON object representing one quiz question and MUST adhere to the following schema:

-   `text` (string, REQUIRED): The question text in Japanese.
-   `correct_answer` (string, REQUIRED): The correct answer to the question in Japanese.
-   `wrong_option_1` (string, REQUIRED): A plausible incorrect answer in Japanese.
-   `wrong_option_2` (string, OPTIONAL): A second plausible incorrect answer in Japanese.
-   `wrong_option_3` (string, OPTIONAL): A third plausible incorrect answer in Japanese.

### Example Output (JSONL)

```jsonl
{"text": "フランスの首都はどこですか？", "correct_answer": "パリ", "wrong_option_1": "ロンドン", "wrong_option_2": "ベルリン", "wrong_option_3": "マドリード"}
{"text": "赤い惑星として知られている惑星はどれですか？", "correct_answer": "火星", "wrong_option_1": "金星"}
```

## Guidelines

-   **Language Requirement**: All generated text, including questions and options, MUST be in Japanese.
-   **Accuracy**: Ensure the `correct_answer` is factually correct based solely on the provided text.
-   **Plausibility**: The wrong options (distractors) should be plausible but clearly incorrect.
-   **Strict Schema**: Do not add any additional fields to the JSON objects. Only include the specified fields.
-   **File Output Only**: Do NOT print the raw JSONL to the chat. ALWAYS write it directly to `.gemini/tmp/quizzes/<topic>.jsonl` using the `write_file` tool.
