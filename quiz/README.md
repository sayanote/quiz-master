# Quiz Service

## features

* Quiz management
    * Create new quiz
    * Distribute quiz to Game Service
    * Update quiz status
    * Provide management screen

## How to run server

### Production mode

```bash
uv run main.py
```

### Development mode

```bash
uv run main.py --reload
```


## APIs

### Quiz

* GET /apis/quiz
    * Get all quizzes
* GET /apis/quiz?id={quiz_id}
    * Get quiz by id
* GET /apis/quiz?n={n}
    * Get n random quizzes

