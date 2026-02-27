# Quiz Service API Reference

This document provides information about the Quiz Service API provided by the `manager` component.

## Base URL
The default development base URL is `http://127.0.0.1:8000/quizzes/`.

---

## 1. Get Quiz Detail

Returns the full information for a specific choice quiz identified by its unique ID.

### Endpoint
`GET /quizzes/<quiz_id>/`

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `quiz_id` | `int` | (Path parameter) The unique identifier of the quiz. |

### Response
**Status Code:** `200 OK`

**Body (JSON):**
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `integer` | Unique ID of the quiz. |
| `text` | `string` | The quiz question text. |
| `correct_answer` | `string` | The correct option. |
| `wrong_option_1` | `string` | First wrong option. |
| `wrong_option_2` | `string` | Second wrong option (optional). |
| `wrong_option_3` | `string` | Third wrong option (optional). |
| `created_at` | `string (ISO 8601)` | When the quiz was created. |
| `frequency` | `integer` | How many times the quiz has been used. |
| `n_of_correct` | `integer` | How many times the quiz was answered correctly. |

### Example Request
```sh
curl http://127.0.0.1:8000/quizzes/1/
```

### Example Response
```json
{
    "id": 1,
    "text": "What is the capital of Japan?",
    "correct_answer": "Tokyo",
    "wrong_option_1": "Osaka",
    "wrong_option_2": "Nagoya",
    "wrong_option_3": "Fukuoka",
    "created_at": "2026-02-26T14:30:00.000000",
    "frequency": 100,
    "n_of_correct": 85
}
```

### Errors
- `404 Not Found`: Returned if no quiz exists with the provided ID.

---

## 2. Get Random Quizzes

Returns a list of `n` random unique quizzes.

### Endpoint
`GET /quizzes/random/`

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `n` | `int` | (Query parameter) Number of random quizzes to retrieve. |

### Response
**Status Code:** `200 OK`

**Body (JSON List):**
Returns a list of quiz objects (same format as Get Quiz Detail).

### Example Request
```sh
curl http://127.0.0.1:8000/quizzes/random/?n=2
```

### Example Response
```json
[
    {
        "id": 1,
        "text": "What is the capital of Japan?",
        "correct_answer": "Tokyo",
        "wrong_option_1": "Osaka",
        "wrong_option_2": "Nagoya",
        "wrong_option_3": "Fukuoka",
        "created_at": "2026-02-26T14:30:00.000000",
        "frequency": 100,
        "n_of_correct": 85
    },
    {
        "id": 2,
        "text": "Who is the gym leader of Asagi City?",
        "correct_answer": "Mikan",
        "wrong_option_1": "Hayato",
        "wrong_option_2": "Tsukushi",
        "wrong_option_3": "Akane",
        "created_at": "2026-02-26T15:00:00.000000",
        "frequency": 50,
        "n_of_correct": 45
    }
]
```

### Errors
- `400 Bad Request`: Returned if `n` is missing or not a positive integer.
