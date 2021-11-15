(in-package #:wiredcraft)

(defparameter %ss nil "Last member for testing")


(defmethod dispose->member ((action (eql :login)))
  (let ((phone #[*value* phone])
        (password #[*value* password])
        (+mmid (query "select anyone(array_agg(id)) from member" :single))) ;; Testing
    ;; TODO
    (setf member-id* +mmid
          member-name* (@postgres (:widget.mname +mmid))
          member-info* (list :phone phone))
    (vprint phone password member-name* member-id*)
    (@procedure (:logging.log-member member-session* member-id* member-name*))
    (send-message *member*
                  action
                  (json 
                   (list :state ":ok"
                         :mmid member-id*
                         :name member-name*
                         :avatar (fmt "/src/~A.jpg" (1+ (mod member-id* 7)))
                         :domain (if +cloud?+ "https://lispcraft.celwk.com" "https://lisp.wcraft.com")
                         :passport (id=>code 1234))))))

(defmethod @member-connected ()
  (setf member-session*
        (@select (:logging.come-in member-ip* member-location* member-agent*) :single))
  ($output "Wiredcraft member connected ~A" *member*))

(defvar $last-out nil)
(defmethod @member-disconnected ()
  (setf $last-out *member*)
  ;; (slot-value * 'hunchensocket::state) => :closed
  (@procedure (:logging.come-out member-session*))
  ($output "Disconnected, broadcast?... ~A" *member*))
