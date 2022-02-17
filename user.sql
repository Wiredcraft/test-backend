create table user
(
    id            bigint auto_increment
        primary key,
    name          varchar(256)  not null,
    date_of_birth date          null,
    address       varchar(2048) null,
    create_at     timestamp     null,
    description   varchar(4096) null,
    constraint USER_id_uindex
        unique (id),
    constraint USER_name_uindex
        unique (name)
);