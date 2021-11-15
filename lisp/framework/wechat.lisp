(in-package #:wiredcraft)
(defparameter *lc nil "Last Customer")

(defun fetch-wechat-account* (&key code (app-id +wx-app-id+) (secret-id +wx-secret-id+))
  "Return a hash with openid & session_key
 session_key is for other API, e.g Get the user's phone number
 openid is unique for every WeChat user for this mini-app "
  (vprint app-id secret-id code)
  (<< (parse-json ~)
      (princ ~) ; {"session_key":"leYfKC7+cV3LmJjTNAd5sg==","openid":"ououg4uFrGM5dqLKTZrLUpWTlgKk"}
      (http-request +wx-sns+
                    :parameters `(("appid" . ,app-id)
                                  ("secret" . ,secret-id)
                                  ("grant_type" . "authorization_code")
                                  ("js_code" . ,code)))))

(defmethod print-object (($user wechat-user) stream)
  (cond ((slot-boundp $user 'id)
         (format stream "[~A ~A] ~A " (user-location $user) (slot-value $user 'hunchensocket::state) (user-name $user)))
        (:else 
         (format stream "[~A] Not In" (slot-value $user 'hunchensocket::state)))))

(define-symbol-macro user-id*
    (user-id *user*))

(define-symbol-macro user-name*
    (user-name *user*))

(define-symbol-macro user-location*
    (user-location *user*))

(define-symbol-macro user-agent*
    (wechat-agent *user*))

(define-symbol-macro user-session*
    (user-session *user*))

(defmethod client-connected ((room (eql +wechat-room+)) *user*)
  (setf *lc *user*)
  (let* ((params (=> (client-request *user*) 'script-name 'split-trim 'princ))
         (ip (client-ip *user*))
         (action (read-from-string (second params)))  ; connect or reconnect
         openid
         session-key
         callback)

    (ecase action
      (:connect
       ($output "Connect ~A" *user*)
       (let* ((code (last1 params))	; /:wechat/openid
              (account (fetch-wechat-account* :code code)))

         (setf openid #[account openid]	; /:wechat/openid/session-key
               session-key #[account session_key]
               callback '@user-connected)))
      (:reconnect
       ($output "Reconnect ~A" *user*)
       (setf openid (third params)
             session-key (fourth params)
             callback '@user-reconnected)))

    (setf (user-ip *user*) ip
          (open-id *user*) openid
          (wechat-session *user*) session-key)
    
    (@user-init *user* action)	;; user-login
    
    (call callback *user*)))

(defmethod client-disconnected ((room (eql +wechat-room+)) *user* &aux (ustatus (status-of *user*)))
  (@user-left)
  ($output "User disconnected*:~%~A	~S ~%[~A -> ~A] (~S seconds)~%~A ~A ~%~A~%~%"
           user-name*
           (age-online ustatus)
           (pretty-time :timestamp (@come ustatus))
           (pretty-time :timestamp (@out ustatus))
           (@duration ustatus)
           user-location*
           (user-ip *user*)
           user-agent*))


(defmethod text-message-received ((room (eql +wechat-room+)) *user* message)
  "room maybe +app-room+ or +wechat-room+"
  (let* ((info (parse-json message))
         (*action* (read-from-string #[info action]))
         (*value* #[info value]))
    
    (log-request room)
    (dispose->user *action*)))

(defmethod log-request ((room (eql +wechat-room+)))
  (output "WeChat: [~A] ~A ~A ~%" (user-name *user*) (now*) *action*))


(defmethod @user-init (action)
  (output "~&Init user ~A ~A, no matter connect or reconnect, like :login ~%" *user* action))

(defmethod @user-connected ()
  ($output "@User connected ~A" *user*))

(defmethod @user-reconnected ()
  ($output "@User reconnected ~A" *user*))

(defmethod @user-left ()
  ($output "@User ~A has left" *user*))
