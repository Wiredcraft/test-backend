(in-package #:wiredcraft)



(defparameter *socket-server* nil)
(defparameter *http-server* nil)


(defconst +unlimit+ most-positive-fixnum)

(defparameter *socket-port* nil "For WebSocket server")
(defparameter *land-port* nil "For http server")

;; For testing:
;; ==================================================
(defparameter *lur nil "Last User Request")
(defparameter *lmr nil "Last Member Request")

(defparameter *logging* nil)

(defun listen-socket ()
  (setf *websocket-dispatch-table* ())
  (pushnew (^(request)
             (vprint request)
             (destructuring-bind (role &rest others)
                 (split-trim (script-name request))               
               (ecase (read-from-string role)
                 (:member (output "Connect an member ~%")	;; wss://shop.com/:member/
                         (setf *lar request)
                         +member-room+)
                 (:wechat ($output "An Wechat User: ~a~%" others)
                          (setf *lur request)
                          +wechat-room+))))
           *websocket-dispatch-table*))

(defun launch-socket-server (port)
  (setf *socket-server* (make-instance 'websocket-acceptor :port port :websocket-timeout +unlimit+) ;:max-thread-count 1000 :max-accept-count 1000)
        *socket-port* port)
  (if (ignore-errors (start *socket-server*))
      (output "~2%WebSocket OK :~S~%" port)
      ($output "Start WebSocket Server error, already Running?")))

(defun launch-http-server (port)
  (setf *http-server* (create-land :port port) ; "Smart-server For upload images mainly"
        *land-port* port)
  (if (ignore-errors (start *http-server*))
      (output "~&HTTP OK :~S~%" port)
      ($output "Error when starting a smart-land (:~d) because there's one Running?" port)))

(<=> started-p started? start?)
(defun stop-servers ()
  (dolist (server (list *http-server* *socket-server*))
    (when (started? server)
      (stop server))))

(defun start-servers (&key socket-port http-port)
  (launch-socket-server socket-port)
  (when http-port
    (launch-http-server http-port))
  (listen-socket))



(defun client-ip (user-or-member)
  (or (cdr (assoc :x-real-ip (headers-in (client-request user-or-member))))
      (remote-addr (client-request user-or-member))))

