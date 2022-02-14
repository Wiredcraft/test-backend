package com.wiredcraft.myhomework.aspect;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.reflect.MethodSignature;

public interface LogAspect {


  /**
   * get target method
   *
   * @param pjp ProceedingJoinPoint
   * @return target method
   */
  default Method getTargetMethod(ProceedingJoinPoint pjp) throws NoSuchMethodException, SecurityException {
    Signature sig = pjp.getSignature();
    if (!(sig instanceof MethodSignature)) {
      throw new IllegalArgumentException("The annotation can only apply to method.");
    }
    MethodSignature msig = (MethodSignature) sig;
    Object target = pjp.getTarget();
    return target.getClass().getMethod(msig.getName(), msig.getParameterTypes());
  }

}
