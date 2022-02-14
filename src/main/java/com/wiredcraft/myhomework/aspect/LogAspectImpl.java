package com.wiredcraft.myhomework.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LogAspectImpl implements LogAspect {

  private static final Logger logger = LoggerFactory.getLogger(LogAspectImpl.class);


  @Around("execution(* com.wiredcraft.myhomework.controller.*.update*(..))")
  public Object logMethod(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {

    Object[] args = proceedingJoinPoint.getArgs();

    MethodSignature methodSignature = (MethodSignature) proceedingJoinPoint.getSignature();

    logger.info("Request Arguments: {}", args);

    logger.info("Request Name:{}", methodSignature.getName());

    Object result = proceedingJoinPoint.proceed(args);

    logger.info("Request Result: {}", result);

    return result;
  }
}
