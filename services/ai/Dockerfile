FROM python:3.13-slim
WORKDIR /service
COPY pyproject.toml ./
COPY app ./app
RUN pip install --no-cache-dir "fastapi[standard]>=0.115.0,<1.0.0" "pydantic>=2.10.0,<3.0.0"
EXPOSE 8000
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]
