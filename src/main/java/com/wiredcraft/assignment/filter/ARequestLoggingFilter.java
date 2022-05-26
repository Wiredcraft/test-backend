package com.wiredcraft.assignment.filter;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.UnicodeUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * filter
 * @author jarvis.jia
 * @date 2022/5/25
 */
@Slf4j
@WebFilter(filterName = "requestLoggingFilter", urlPatterns = "/*")
public class ARequestLoggingFilter extends OncePerRequestFilter {



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("hello");
        if (!(request instanceof ContentCachingRequestWrapper)) {
            request = new ContentCachingRequestWrapper(request);
        }
        if (!(response instanceof ContentCachingResponseWrapper)) {
            response = new ContentCachingResponseWrapper(response);
        }
        try {
            long startTime = System.currentTimeMillis();
            filterChain.doFilter(request, response);
            long endTime = System.currentTimeMillis();
            String executeTime = String.valueOf(endTime - startTime).concat("ms");
            request.setAttribute("executeTime", executeTime);
        } finally {
            logPayload(request, response);
            copyBodyToResponse(response);
        }
    }



    private void logPayload(HttpServletRequest request, HttpServletResponse response) {
        String reqBody = new ContentRequestWrapper(request).getBody();
        String rspBody = new ContentResponseWrapper(response).getBody();
        String token = request.getHeader("token");
        String traceId = request.getHeader("traceId");
        if(!StringUtils.isNotBlank(traceId)){
            traceId = UUID.randomUUID().toString();
        }
        String method = request.getMethod();
        String code = null;
        try {
            JSONObject jsonObject = JSON.parseObject(rspBody, JSONObject.class);
            if (jsonObject != null) {
                if (jsonObject.containsKey("code")) {
                    code = jsonObject.getString("code");
                }
                rspBody = JSON.toJSONString(jsonObject, false);
            }
        } catch (Exception ex) {
        }
        if (StringUtils.isBlank(code)) {
            return;
        }
        String reqUrl = request.getRequestURL().toString();

        JSONObject logObject = new JSONObject();
        logObject.put("method", method);
        logObject.put("code", code);
        logObject.put("token", token);
        logObject.put("traceId", traceId);
        logObject.put("reqBody", JSONObject.parseObject(reqBody));
        logObject.put("rspBody", JSONObject.parseObject(UnicodeUtil.toString(rspBody)));
        logObject.put("reqUrl", reqUrl);
        logObject.put("createTime", DateUtil.now());
        logObject.put("executeTime", request.getAttribute("executeTime"));
        String logText = JSON.toJSONString(logObject, false);
        if(!code.equals("SUCCESS")){
            log.error(logText);
        }else{
            log.info(logText);
        }
    }



    private void copyBodyToResponse(HttpServletResponse response) throws IOException {
        ContentCachingResponseWrapper responseWrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        responseWrapper.copyBodyToResponse();
    }


}
