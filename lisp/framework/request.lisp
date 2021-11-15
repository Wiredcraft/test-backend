(in-package #:wiredcraft)

(defmacro member~> ((action/broadcast &optional sth) &body codes)
  "Response for a $member request to the sender itself without send response"
  `(defmethod dispose->member ((action/broadcast (eql ,action/broadcast)))
     ,@(cond ((null? sth)
              codes)
             ((cons? sth)
              `((let ,(mapcar
                       (^(param)
                         `(,param (or (gesh ,(read-from-format "|~A|" (lisp->camel param)) *value*) :null)))
                       sth)
                  ,@codes))))))


(defmacro member=> ((action/broadcast &optional sth) &body codes)
  "Response for a $member request to the sender itself"
  `(member~> (,action/broadcast ,sth)
     (send-message *member* action/broadcast (progn ,@codes))))

(defmacro @cason=> ((action &rest args))
  "Call postgres function for JSON text, the function itself may return text or jsonb"
  `(member=> (,action ,args)
     (@postgres (,action *mmid* ,@args))))

(defmacro @broadcast=> ((action &rest args))
  "Send to the member, and response to all members in his FOLLOWERS??"
  `(member~> (,action ,(mapcar λ(if (atom? _) _ (second _)) args))  ;; prices covers (json more) (json description)... 
     (broadcast->members (@postgres (,action *mmid* ,@args)))))

(defun broadcast->members (message)
  (vprint message *member* *broadcast* *value* *mmid* )
  (cond ((search #/"@error"/# message)  ;; If something wrong, don't broadcast
         (error-message *member* *broadcast* message))
        (:otherwise
         (dolist (member *members*)	;; TODO
           (broadcast-message member *broadcast* message)))))




;; (defun translate (args)
;;   "Replace some speicial data format, it might be done in ai.lisp "
;;   (let ((code '((description . (json description))
;;                 (more . (json more))
;;                 (features . (json features))))
;;         (tempt args))
;;     (dolist (sth code tempt)
;;       (setf tempt (subst (cdr sth) (car sth) tempt)))))
