(in-package :wiredcraft)

(defparameter *debugging* nil)
(setf *debugging* t)
(setf *debugging* nil)

(eval-when (:compile-toplevel :load-toplevel :execute)	; If not do it, @sql will be parsed faile in load time
  (defconst +password+ (sb-posix:getenv "PGPASSWORD"))
  (defconst +user+ (sb-posix:getenv "PGUSER"))
  (defconst +host+ "localhost")
  (defconst +db+ "wiredcraft")
  (defconst +connection+
    (list :database +db+ :user +user+ :password +password+ :host +host+)
    "Database to postgres, remember set postgres-db in the /etc/hosts"))

(defun connect-wcraft ()
  (connect-toplevel +db+ +user+ +password+ +host+))

(defmacro @sql (&body code)
  `(pooled-query ,+connection+
     (when *debugging*
       ($output "=> ~A" (regex-replace "^\\((.*)\\)$" (sql ,(first code)) "\\1") :width 150))
     (query ,@code)))

(alias |sql| @sql)

(defmacro @select (code &optional (format :plists))
  "Call a code function normally"
  `(@sql (:select '* :from ,code) ,format))

(defmacro @postgres (code)
  "For Views return a JSON string, e.g, (@postgres ptj)"
  `(@select ,code :single))

(defmacro @procedure (code)
  `(@sql (fmt "CALL ~A" (sql ,code)) :none))

(connect-wcraft)


