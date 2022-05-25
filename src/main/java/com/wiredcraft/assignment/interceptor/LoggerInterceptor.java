package com.wiredcraft.assignment.interceptor;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * @author jarvis.jia
 * @date 2022/5/24
 */
@Slf4j
@Component
public class LoggerInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        long start = System.currentTimeMillis();
        request.setAttribute("startTime", start);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {


    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        long start = (long) request.getAttribute("startTime");
        long end  = System.currentTimeMillis();

        Map<String, Object> apiLog = new HashMap<>();
        apiLog.put("URL", request.getRequestURL().toString());
        apiLog.put("HTTP_METHOD", request.getMethod());
        apiLog.put("IP", request.getRemoteAddr());
        apiLog.put("TIME", end-start);
        log.info("apiLog: " + JSONObject.toJSONString(apiLog));
    }
}

