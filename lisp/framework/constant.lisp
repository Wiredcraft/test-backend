(in-package #:wiredcraft)

(defconst +root+ #"$[+home+]wiredcraft/lisp/"#)
(defconst +root-src+ #"$[+root+]src/"#)
(defconst +avatar-root+ #"$[+root+]src/avatar"#)


(defparameter *key* nil "The optional request key")
(defparameter *value* nil "The optional request value")
(defparameter *member* nil)
(defparameter *action* nil)
(defparameter *broadcast* nil)
(defparameter *action/broadcast* nil)
(defparameter *mmid* nil)


(defconst +wx-sns+ "https://api.weixin.qq.com/sns/jscode2session")
(defconst +wx-app-id+ "wx9f13a398798b50e8")  ;; "wxc0155748f5e9b7e2" => celwk
(defconst +wx-secret-id+ "49aa2d64d2628b7f15584caf3a85dd61")

(defconst +member-room+  (make-instance 'server-socket :client-class 'the-member :name "Memberister"))
(defconst +wechat-room+ (make-instance 'server-socket :client-class 'wechat-user :name "WeChat"))

(define-symbol-macro *members*
    (values (clients +member-room+ ) (car (clients +member-room+ ))))
(define-symbol-macro *users*
    (values (clients +wechat-room+) (car (clients +wechat-room+))))
