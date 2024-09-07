# Используем официальный базовый образ PostgreSQL
FROM postgres:latest

# Устанавливаем переменные окружения для создания пользователя и базы данных
ENV POSTGRES_USER=nguyen
ENV POSTGRES_PASSWORD=sarina
ENV POSTGRES_DB=tourist

# Копируем скрипты инициализации, если они у вас есть
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Экспонируем порт 5432
EXPOSE 5432

# Запуск PostgreSQL сервера
CMD ["postgres"]