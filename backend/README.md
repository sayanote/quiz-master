# backend server

# Quiz API

## Run mock of Quiz API

You can run mock of Quiz API.

### How to run

1. Install json-server using `npm`

    ```sh
    npm install -g json-server
    ```

1. Run mock of Quiz API

    ```sh
    json-server --watch examples/quiz/choice.json
    ```

1. Access to mock of Quiz API

    ```sh
    curl http://localhost:3000/quiz
    ```