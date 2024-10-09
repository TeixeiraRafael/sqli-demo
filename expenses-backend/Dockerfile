FROM python:3.9 as build

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . .

ENV PYTHONPATH=/app

EXPOSE 5678

CMD ["python", "src/main.py"]