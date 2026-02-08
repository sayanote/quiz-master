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
    import argparse
    import uvicorn
    
    parser = argparse.ArgumentParser(description="Run Quiz Service API")
    parser.add_argument(
        "--reload",
        action="store_true",
        help="Run uvicorn in reload mode for development"
    )
    args = parser.parse_args()
    
    uvicorn.run("main:app", host="0.0.0.0", port=8989, reload=args.reload)
