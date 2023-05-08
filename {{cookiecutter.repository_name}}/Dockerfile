FROM python:3.10-slim

EXPOSE 8501

WORKDIR /src
COPY . .

RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    build-essential \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --no-cache-dir '.[dev]'

ENTRYPOINT ["python", "-m", "streamlit", "run", "src/main.py", "--server.port=8501", "--server.address=0.0.0.0"]
