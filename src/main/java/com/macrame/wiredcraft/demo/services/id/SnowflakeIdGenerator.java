package com.macrame.wiredcraft.demo.services.id;


import com.macrame.wiredcraft.demo.services.IdGenerator;
import com.macrame.wiredcraft.demo.utils.IdWorker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service(value = "idGenerator")
@ConditionalOnProperty(name = "config.id.snowflake.enabled", havingValue = "true")
public class SnowflakeIdGenerator implements IdGenerator {
    private final Logger logger = LoggerFactory.getLogger(getClass());
    @Value("${common.id.dataCenterId:1}")
    private long dataCenterId;
    @Value("${common.id.workId:1}")
    private long workId;

    private IdWorker idWorker;

    public SnowflakeIdGenerator(){
        logger.info("Initializing IdGenerator, workId={}, dataCenterId={}", workId, dataCenterId);
        idWorker = new IdWorker(workId, dataCenterId);
    }

    public long nextId(){
        return idWorker.getId();
    }


}