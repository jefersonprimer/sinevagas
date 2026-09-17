FROM postgres:16-alpine

# Definir variáveis de ambiente padrão do Postgres
ENV POSTGRES_USER=sinevagas
ENV POSTGRES_PASSWORD=sinevagas_password
ENV POSTGRES_DB=sinevagas_db

# Copiar o script de inicialização do banco de dados
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
