package com.wiredcraft.assignment.filter;

import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
public class ContentResponseWrapper extends ContentCachingResponseWrapper {
    private final String body;

    public ContentResponseWrapper(HttpServletResponse response) {
        super(response);
        body = getResponsePayload(response);
    }

    /**
     * get response：body
     * @param response
     * @return
     */
    private String getResponsePayload(HttpServletResponse response) {
        ContentCachingResponseWrapper wrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                try {
                    return new String(buf, 0, buf.length, "utf-8");
                } catch (UnsupportedEncodingException ex) {
                    // NOOP
                }
            }
        }
        return "{}";
    }

    public String getBody() {
        return this.body;
    }
}
