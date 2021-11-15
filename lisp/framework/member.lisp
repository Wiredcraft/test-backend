(in-package #:wiredcraft)
(defparameter *lm nil "Last member")

(defmethod print-object ((member the-member) stream &aux $info)
  (cond ((logged-in? member)
         (setf $info (member-info member))
         (format stream "[ ~A @~A ~A] "
                 (member-name member)
                 (member-id member)
                 (or (getf $info :info) "")))
        (:else
         (format stream "[Not Logged ~A]" (class-name (class-of member))))))

(define-symbol-macro member-id* (member-id *member*))
(define-symbol-macro member-name* (member-name *member*))
(define-symbol-macro member-info* (member-info *member*))
(define-symbol-macro member-ip* (member-ip *member*))
(define-symbol-macro member-location* (member-location *member*))
(define-symbol-macro member-session* (member-session *member*))
(define-symbol-macro member-agent* (member-agent *member*))


(defmethod dispose->member (action/broadcast)
  "Default handler, which will do nothing"
  (vprint action/broadcast *member* *value*)
  (let ((info (fmt "[ ~S ] is Not Implemented >_<" action/broadcast)))
    (output info)
    (sleep 0.2)
    (send-message *member* :error (json (list :message info)))))

(defmethod @member-connected ()
  ($output "==== Member connected ~A ====" *member*))

(defmethod @member-disconnected ()
  ($output "==== Member disconnected ~A ====" *member*))

(defmethod logged-in? ((member the-member))
  (slot-boundp member 'mmid))

(defmethod client-connected ((room (eql +member-room+)) *member*)
  (setf *lm *member*)
  (let1 (ip (client-ip *member*))
    (setf member-ip* ip
          member-agent* (cdr (assoc :user-agent (headers-in (slot-value *member* 'request))))
          member-location* (try-fetch-location ip)))
  (@member-connected))

(defmethod client-disconnected ((room (eql +member-room+)) *member*)
  ;; (@procedure (:come-out (member-session *member*)))
  (@member-disconnected))

(defmethod text-message-received ((room (eql +member-room+)) *member* message)
  (let* ((info (parse-json message))
         (*action* (when* #[info action] (read-from-string it)))
         (*broadcast* (when* #[info broadcast] (read-from-string it)))
         (*action/broadcast* (or *action* *broadcast*))
         (*key* #[info key])
         (*value* #[info value])
         (*mmid* (unless (member *action* '(:login :open-screen)) member-id*)))


    (dispose->member *action/broadcast*)))



(defmethod log-request ((room (eql +member-room+)))
  "Only action, No value"
  (output "~%~A~%|| ~A || ~S || ~S ~%"
          (now*)
          (or (ignore-errors (getf (member-info *member*) :wiredcraft)) ">,<")
          *value*
          *action*)
  (ignore-errors (call-next-method)))

(defmethod dispose->member ((action (eql :open-screen)))
  (setf (screen-of *member*) (symbol-to-key (gesh "uri" *value*))))
