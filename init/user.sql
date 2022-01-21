CREATE TABLE USER (
    user_id BIGINT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    date_of_birth DATETIME(0),
    address VARCHAR(2048),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    description VARCHAR(4096),
    create_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    version INT NOT NULL
);