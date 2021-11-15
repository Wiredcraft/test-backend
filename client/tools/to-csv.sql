\copy (select * from functions()) to '~/Desktop/test-it.csv' with csv  DELIMITER ',' HEADER
\! open 'Desktop/test-it.csv'


COPY (SELECT * from functions()) To '/tmp/output.csv' With CSV;