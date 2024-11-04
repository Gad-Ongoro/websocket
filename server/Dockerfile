FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV DJANGO_SETTINGS_MODULE=core.settings

RUN pip install --upgrade pip

COPY . /app/

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD python manage.py collectstatic --noinput && \
    daphne -b 0.0.0.0 -p 8000 core.asgi:application