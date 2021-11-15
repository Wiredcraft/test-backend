(in-package :wiredcraft)

(defvar *last-code* nil "Check if needing update, this situation should use DEFVAR instead of DEFPARAMETER!")

(defparameter *print-ai?* nil)
(defun resolve-functions ()
  (let* ((*debugging* nil)
         (code
           (=> (@select (:system.code) :lists)
               (mapcar λ(destructuring-bind (schema func type args) _
                          (list (as-keyword schema)
                                (symbol-to-key (replace-string func "_" "-"))
                                (read-from-string type)
                                (map 'list
                                     (^(arg)
                                       (destructuring-bind (name type &rest others) (split " " arg)
                                         (declare (ignore others))
                                         (let1 (code (=> (replace-string name "_" "-")
                                                         (string-trim "\"" ~)
                                                         (read-from-string ~)))
                                           (when (scan-to-strings "^json" type)
                                             (setf code `(json ,code)))
                                           code)))
                                     args)))
                       ~)
               (mapcar λ(destructuring-bind (schema func type args) _
                          (declare (ignorable type))
                          ;; (vprint schema func type args)
                          (let (macro)
                            (cond ((eql schema :broadcast)
                                   (setf macro '@broadcast=>))
                                  (:otherwise
                                   (setf macro '@cason=>)))
                            
                            `(,macro (,func ,@(nthcdr 1 args)))))
                                      ;; ,@(nthcdr (if (eql macro '@cason=>) 0 1) args))))) ;; with *mmid* or not
                       ~))))

    (when *print-ai?*
      (=> (mapcar λ(destructuring-bind (way fn) _
                     (fmt "(~A (~{~S~^ ~}))~%" way fn))
                  code)
          (sort ~ #'string-lessp)
          (princ (string-join ~))))
    
    code))

(defun delete-method (method)
  (remove-method #'dispose->member
                 (find-method #'dispose->member () `((eql ,method)))))
;; e.g (delete-method :week-schedule)
(defun update-db-functions ()
  (in-package :wiredcraft)	;; Required if use in make-thread/set-time-out/set-interval!
  (let* ((new-code (resolve-functions))
         (diff (set-exclusive-or *last-code* new-code :test #'equal))
         (increase (intersection new-code diff))
         (remove (intersection *last-code* diff)))
    ;; (vprint diff increase remove)
    (when diff
      (format t "~&[Update postgres ~A]~%~A~%++ ~S~%-- ~S~%"
              (now)
              diff
              (or increase :nope)
              (or remove :nope))

      (dolist (each- remove)
        (output "- ~S => ~S~%" each- (caadr each-))
        (delete-method (caadr each-))) 

      (dolist (each+ increase)
        (output "+ ~S ~%" each+)
        (eval each+))      

      (setf *last-code* new-code))))

(defun advance-request ()
  (clear-last-interval)
  (set-interval 1
    (update-db-functions)))

($output "Advance request, roll the postgres functions")
;; Wait
(advance-request)
