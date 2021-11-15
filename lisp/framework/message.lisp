(in-package #:wiredcraft)


(defun the-key ()
  (cond (*key* #/,"key":"$[*key*]"/#)
        (:otherwise "")))


(defmethod broadcast-message ((client websocket-client) action &optional (content "{}"))
  "CLIENT maybe member or user"  
  (send-text-message client #/{"broadcast":"$(write-to-string action)","content":$content $(the-key)}/#))

(defmethod error-message ((client websocket-client) action &optional (content "{}"))
  (send-text-message client #/{"error":"$(write-to-string action)","content":$content $(the-key)}/#))


(defmethod send-message ((client websocket-client) action &optional content)
  "CLIENT maybe member or user"  
  ;; (vector-push-extend (cons action content) %responses)  ;; For test
  
  (when *logging*
    (output "~2%Send message [~a] => ~a ~a~%" action client content))

  (when (string? content)
    (send-text-message client #/{"action":"$(write-to-string action)", "content": $[content]$(the-key)}/#)
    (return-from send-message))
  
  (when (and content (list? content)	;; wechat 
             (not (keyword? (first content)))
             (not (and (string? (first content))
                       (keyword? (read-from-string (first content))))))
    (setf content (coerce content 'vector)))	;; For stringifying JSON 
  
  (send-text-message client (json `(:action ,(write-to-string action)
                                    ,@(when content (list :content content))))))
