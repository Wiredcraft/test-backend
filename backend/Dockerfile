FROM python:3.8-slim

RUN apt update && apt install -y gdal-bin

RUN mkdir /app
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -i https://mirrors.aliyun.com/pypi/simple --disable-pip-version-check -r requirements.txt

COPY . /app/
