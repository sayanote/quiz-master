# ------------
# main.py
# ------------
# This is the entrypoint of Quiz Service APIs

from fastapi import FastAPI


app = FastAPI()


@app.get("/health")
def health():
    return "OK"


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8989)
