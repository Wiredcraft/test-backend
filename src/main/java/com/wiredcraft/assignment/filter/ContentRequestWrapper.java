package com.wiredcraft.assignment.filter;

import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
public class ContentRequestWrapper extends ContentCachingRequestWrapper {
    private final String body;

    public ContentRequestWrapper(HttpServletRequest request) {
        super(request);
        body = getRequestPayload(request);
    }

    /**
     * get request：body
     * @param request
     * @return
     */
    private String getRequestPayload(HttpServletRequest request) {
        ContentCachingRequestWrapper wrapper1 = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper1 != null) {
            byte[] buf1 = wrapper1.getContentAsByteArray();
            if (buf1.length > 0) {
                try {
                    return new String(buf1, 0, buf1.length, wrapper1.getCharacterEncoding());
                } catch (UnsupportedEncodingException var10) {
                    //NOOP
                }
            }
        }
        return "{}";
    }

    public String getBody() {
        return this.body;
    }
}
